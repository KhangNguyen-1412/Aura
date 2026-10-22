const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { execFile, spawn } = require('child_process');
const { pipeline } = require('stream');
const zlib = require('zlib');

// TỐI ƯU HÓA HIỆU NĂNG: Bộ nhớ đệm tệp nén Gzip trong RAM (0ms độ trễ, tiết kiệm tới 85-94% băng thông mạng)
const COMPRESSIBLE_EXTS = new Set([
    '.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt', '.xml'
]);
const COMPRESSION_CACHE = new Map(); // filePath -> { mtimeMs, buffer }

const PORT = process.env.PORT || 3000;
const MEDIA_DIR = path.join(__dirname, 'media');
const TTS_CACHE_DIR = path.join(MEDIA_DIR, 'tts_cache');

// BẢO VỆ TIẾN TRÌNH: Ngăn ngừa sập server khi trình duyệt hủy kết nối socket stream video hoặc quá tải EMFILE
process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.code === 'ERR_STREAM_PREMATURE_CLOSE' || err.code === 'EMFILE' || err.code === 'EBUSY') {
        return; // Bình thường khi trình duyệt dừng xem video/thumbnail hoặc file descriptor đang bận
    }
    console.error('[Aura Server Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[Aura Server Unhandled Rejection]:', reason);
});

if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
}
if (!fs.existsSync(TTS_CACHE_DIR)) {
    fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.m4v': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.ogg': 'video/ogg',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.oga': 'audio/ogg',
    '.ico': 'image/x-icon',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.bin': 'application/octet-stream'
};

// Chỉ mục bộ nhớ đệm Media: Tra cứu tức thì O(1) tên tệp -> đường dẫn tuyệt đối đầy đủ
let mediaFileIndex = new Map();

function rebuildMediaIndex() {
    const newIndex = new Map();
    function scan(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const ent of entries) {
                const full = path.join(dir, ent.name);
                if (ent.isDirectory()) {
                    scan(full);
                } else if (ent.isFile()) {
                    newIndex.set(ent.name.toLowerCase(), full);
                }
            }
        } catch (_) {}
    }
    if (fs.existsSync(MEDIA_DIR)) {
        scan(MEDIA_DIR);
    }
    mediaFileIndex = newIndex;
}
rebuildMediaIndex();

function sanitizeFilename(rawName) {
    let name = path.basename(decodeURIComponent(rawName || 'media_file'));
    name = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!name || name === '.' || name === '..') {
        name = `media_${Date.now()}`;
    }
    return name;
}

function sanitizeSubDir(raw) {
    if (!raw) return '';
    try {
        const parts = decodeURIComponent(raw).split(/[\/\\]+/).map(p => {
            let clean = p.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
            return (clean === '.' || clean === '..') ? '' : clean;
        }).filter(Boolean);
        return parts.join(path.sep);
    } catch (e) {
        return '';
    }
}

function mirrorToYDrive(subDir, filename, sourcePath) {
    // Đã tắt đồng bộ Drive theo yêu cầu người dùng — chỉ upload và lưu trực tiếp trong folder media cục bộ
    return;
}

// =====================================================
// TÍCH HỢP GOOGLE DRIVE API V3 SIÊU TỐC (AURA CLOUD ENGINE)
// =====================================================
const driveEngine = require('./drive-engine');
const syncMediaToDrive = require('./sync_media_to_drive');

// Khởi chạy nền engine Google Drive
driveEngine.initDrive().catch(err => {
    console.warn('[Aura Drive] Khởi động Drive Engine:', err.message);
});



function getUniqueFilename(targetDir, desiredName, bufferSize = 0) {
    const ext = path.extname(desiredName);
    const base = path.basename(desiredName, ext);
    let candidate = desiredName;
    let counter = 1;
    while (fs.existsSync(path.join(targetDir, candidate))) {
        // NẾU TỆP ĐÃ TỒN TẠI VỚI CÙNG KÍCH THƯỚC: Tái sử dụng tệp đã có, tuyệt đối KHÔNG nhân bản thành _1, _2!
        if (bufferSize > 0) {
            try {
                const stat = fs.statSync(path.join(targetDir, candidate));
                if (stat.size === bufferSize) {
                    return candidate;
                }
            } catch (_) {}
        }
        candidate = `${base}_${counter}${ext}`;
        counter++;
    }
    return candidate;
}

// Phân giải đường dẫn tệp media vật lý an toàn từ URL, đường dẫn tương đối hoặc tên tệp
function resolveMediaFile(urlOrPath, folder = '') {
    if (!urlOrPath || typeof urlOrPath !== 'string') return null;
    let clean = urlOrPath.trim();
    if (!clean || clean.startsWith('data:')) return null;

    // Loại bỏ query params và hash
    clean = clean.split('#')[0].split('?')[0];

    // Bỏ host / protocol nếu là URL tuyệt đối
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
        try {
            const parsed = new URL(clean);
            clean = parsed.pathname;
        } catch (_) {}
    }

    try {
        clean = decodeURIComponent(clean);
    } catch (_) {}

    // Bỏ tiền tố media/ hoặc /media/ nếu có
    clean = clean.replace(/^[/\\]+/, '');
    if (clean.toLowerCase().startsWith('media/') || clean.toLowerCase().startsWith('media\\')) {
        clean = clean.substring(6);
    }
    clean = clean.replace(/^[/\\]+/, '');

    const normalizedMediaDir = path.resolve(MEDIA_DIR);
    const edgingDir = path.resolve(MEDIA_DIR, 'edging_voice');

    // 1. Thử đường dẫn tương đối trực tiếp trong MEDIA_DIR
    if (clean) {
        const candidate1 = path.resolve(normalizedMediaDir, clean);
        if (candidate1.startsWith(normalizedMediaDir) && candidate1 !== normalizedMediaDir && !candidate1.startsWith(edgingDir)) {
            if (fs.existsSync(candidate1)) {
                try {
                    if (fs.statSync(candidate1).isFile()) return candidate1;
                } catch (_) {}
            }
        }
    }

    // 2. Thử ghép folder (nếu có) + tên tệp
    if (folder) {
        const sanitizedFolder = sanitizeSubDir(folder);
        const baseName = path.basename(clean);
        if (sanitizedFolder && baseName) {
            const candidate2 = path.resolve(normalizedMediaDir, sanitizedFolder, baseName);
            if (candidate2.startsWith(normalizedMediaDir) && candidate2 !== normalizedMediaDir && !candidate2.startsWith(edgingDir)) {
                if (fs.existsSync(candidate2)) {
                    try {
                        if (fs.statSync(candidate2).isFile()) return candidate2;
                    } catch (_) {}
                }
            }
        }
    }

    // 3. Tra cứu nhanh O(1) từ mediaFileIndex theo tên tệp (basename)
    const base = path.basename(clean).toLowerCase();
    if (base && mediaFileIndex.has(base)) {
        const candidate3 = path.resolve(mediaFileIndex.get(base));
        if (candidate3.startsWith(normalizedMediaDir) && candidate3 !== normalizedMediaDir && !candidate3.startsWith(edgingDir)) {
            if (fs.existsSync(candidate3)) {
                try {
                    if (fs.statSync(candidate3).isFile()) return candidate3;
                } catch (_) {}
            }
        }
    }

    return null;
}

// [MỚI] Bộ đệm tra cứu Google Drive Manifest thông minh (0ms) cho Cloud Streaming
let serverDriveManifestMap = null;
function getServerDriveManifestMap() {
    if (!serverDriveManifestMap) {
        serverDriveManifestMap = new Map();
        try {
            const manifestPath = path.join(__dirname, 'drive-sync-manifest.json');
            if (fs.existsSync(manifestPath)) {
                const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                for (const [key, val] of Object.entries(raw)) {
                    if (val && val.driveFileId) {
                        const normalizedKey = key.replace(/\\/g, '/').toLowerCase();
                        serverDriveManifestMap.set(normalizedKey, val);
                        const base = path.basename(key).toLowerCase();
                        if (!serverDriveManifestMap.has(base)) {
                            serverDriveManifestMap.set(base, val);
                        }
                    }
                }
            }
        } catch (_) {}
    }
    return serverDriveManifestMap;
}

function resolveFileFromDriveManifest(targetPath) {
    if (!targetPath) return null;
    const map = getServerDriveManifestMap();
    if (!map || map.size === 0) return null;

    let clean = targetPath.replace(/^[/\\]+/, '').replace(/^media[/\\]/i, '').replace(/\\/g, '/').toLowerCase();
    try { clean = decodeURIComponent(clean); } catch (_) {}

    if (map.has(clean)) return map.get(clean);
    const UID_DEF = 'odRSfSMD1ZaoglEFBkeIKhLCusZ2'.toLowerCase();
    if (map.has(`${UID_DEF}/${clean}`)) return map.get(`${UID_DEF}/${clean}`);
    const base = path.basename(clean).toLowerCase();
    if (map.has(base)) return map.get(base);

    return null;
}

// Xóa an toàn một tệp media vật lý khỏi ổ đĩa
function safelyDeleteMediaFile(targetPath) {
    if (!targetPath || typeof targetPath !== 'string') return false;
    const normalizedMediaDir = path.resolve(MEDIA_DIR);
    const resolved = path.resolve(targetPath);

    // Kiểm tra an toàn: Phải nằm trong MEDIA_DIR, không được là MEDIA_DIR, không nằm trong edging_voice
    if (!resolved.startsWith(normalizedMediaDir) || resolved === normalizedMediaDir) {
        console.warn('[Aura Media Security] Chặn xóa ngoài thư mục media:', resolved);
        return false;
    }
    const edgingDir = path.resolve(MEDIA_DIR, 'edging_voice');
    if (resolved.startsWith(edgingDir)) {
        console.warn('[Aura Media Security] Chặn xóa tệp âm thanh hệ thống edging_voice:', resolved);
        return false;
    }

    try {
        if (fs.existsSync(resolved)) {
            const stat = fs.statSync(resolved);
            if (stat.isFile()) {
                fs.unlinkSync(resolved);
                const baseName = path.basename(resolved).toLowerCase();
                mediaFileIndex.delete(baseName);
                console.log(`[Aura Media] ✓ Đã xóa tệp vật lý khỏi ổ đĩa: ${resolved}`);
                return true;
            }
        }
    } catch (err) {
        console.error('[Aura Media] Lỗi khi xóa tệp vật lý:', resolved, err);
    }
    return false;
}

// Xóa an toàn toàn bộ một thư mục media (khi xóa hồ sơ đối tác/creator)
function safelyDeleteMediaFolder(folderPath) {
    if (!folderPath || typeof folderPath !== 'string') return false;
    const cleanSub = sanitizeSubDir(folderPath);
    if (!cleanSub) return false;

    const normalizedMediaDir = path.resolve(MEDIA_DIR);
    const targetDir = path.resolve(normalizedMediaDir, cleanSub);

    // Kiểm tra an toàn
    if (!targetDir.startsWith(normalizedMediaDir) || targetDir === normalizedMediaDir) {
        console.warn('[Aura Media Security] Chặn xóa thư mục gốc media:', targetDir);
        return false;
    }
    const edgingDir = path.resolve(MEDIA_DIR, 'edging_voice');
    if (targetDir.startsWith(edgingDir) || targetDir === edgingDir) {
        console.warn('[Aura Media Security] Chặn xóa thư mục hệ thống edging_voice:', targetDir);
        return false;
    }
    const ttsDir = path.resolve(MEDIA_DIR, 'tts_cache');
    if (targetDir === ttsDir) {
        console.warn('[Aura Media Security] Chặn xóa thư mục tts_cache:', targetDir);
        return false;
    }

    try {
        if (fs.existsSync(targetDir)) {
            const stat = fs.statSync(targetDir);
            if (stat.isDirectory()) {
                fs.rmSync(targetDir, { recursive: true, force: true });
                rebuildMediaIndex();
                console.log(`[Aura Media] ✓ Đã xóa toàn bộ thư mục và tệp con khỏi ổ đĩa: ${targetDir}`);
                return true;
            }
        }
    } catch (err) {
        console.error('[Aura Media] Lỗi khi xóa thư mục:', targetDir, err);
    }
    return false;
}

// Tự động sửa lỗi track duration = 0 (tkhd) của video Zalo / điện thoại để trình duyệt hiển thị đầy đủ tổng thời lượng và thanh tua seekable
function fixMp4Buffer(buf) {
    if (!Buffer.isBuffer(buf) || buf.length < 16) return buf;
    let mvhdDur = 0;
    let mvhdTs = 0;

    function walk(start, end) {
        let o = start;
        while (o + 8 <= end) {
            const size = buf.readUInt32BE(o);
            if (size <= 0 || size > end - o) break;
            const type = buf.slice(o + 4, o + 8).toString('ascii');

            if (type === 'mvhd') {
                const v = buf.readUInt8(o + 8);
                mvhdTs = buf.readUInt32BE(o + 8 + 4 + (v ? 16 : 8));
                mvhdDur = v ? Number(buf.readBigUInt64BE(o + 8 + 4 + 16 + 4)) : buf.readUInt32BE(o + 8 + 4 + 8 + 4);
            } else if (type === 'tkhd' && mvhdDur > 0) {
                const v = buf.readUInt8(o + 8);
                const durOffset = o + 8 + 4 + (v ? 16 : 8) + 4;
                const curDur = v ? Number(buf.readBigUInt64BE(durOffset)) : buf.readUInt32BE(durOffset);
                if (curDur === 0) {
                    if (v) buf.writeBigUInt64BE(BigInt(mvhdDur), durOffset);
                    else buf.writeUInt32BE(mvhdDur, durOffset);
                }
            }

            if (['moov', 'trak', 'mdia', 'minf'].includes(type)) {
                walk(o + 8, o + size);
            }
            o += size;
        }
    }

    try { walk(0, buf.length); } catch (e) {}
    return buf;
}

// Vá duration metadata cho file MP4 trực tiếp trên đĩa mà không cần nạp toàn bộ gigabyte dữ liệu vào RAM
function fixMp4FileOnDisk(filePath) {
    try {
        const stats = fs.statSync(filePath);
        if (!stats.isFile() || stats.size < 16) return;
        const readLen = Math.min(stats.size, 8 * 1024 * 1024);
        const fd = fs.openSync(filePath, 'r+');
        try {
            const buf = Buffer.alloc(readLen);
            fs.readSync(fd, buf, 0, readLen, 0);
            const original = Buffer.from(buf);
            fixMp4Buffer(buf);
            if (!buf.equals(original)) {
                fs.writeSync(fd, buf, 0, readLen, 0);
                console.log(`[Aura Media] Đã vá duration metadata MP4: ${path.basename(filePath)}`);
            }
        } finally {
            fs.closeSync(fd);
        }
    } catch (_) {}
}

function streamFileSafely(filePath, options, res, req, statusCode, headers) {
    let retries = 0;
    const maxRetries = 5;

    function tryStream() {
        if (res.writableEnded || req.destroyed) return;
        const fileStream = fs.createReadStream(filePath, { ...options, highWaterMark: 256 * 1024 });
        let closed = false;

        const cleanup = () => {
            if (!closed) {
                closed = true;
                fileStream.destroy();
            }
        };

        fileStream.on('error', (err) => {
            if (closed) return;
            if ((err.code === 'EMFILE' || err.code === 'EBUSY') && retries < maxRetries) {
                retries++;
                setTimeout(tryStream, 60 * retries);
                return;
            }
            closed = true;
            if (!res.headersSent && !res.writableEnded) {
                try {
                    res.writeHead(err.code === 'EMFILE' ? 503 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Lỗi stream tệp: ' + err.code);
                } catch (e) {}
            } else if (!res.writableEnded) {
                try { res.end(); } catch (e) {}
            }
        });

        fileStream.on('open', () => {
            if (res.writableEnded || req.destroyed) {
                cleanup();
                return;
            }
            if (!res.headersSent) {
                res.writeHead(statusCode, headers);
            }
            pipeline(fileStream, res, (err) => {
                closed = true;
            });
        });

        req.on('close', cleanup);
    }

    tryStream();
}

// Trả về JSON với nén Gzip tự động nếu payload > 1KB và client hỗ trợ Gzip
function sendJsonResponse(res, req, statusCode, data) {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    const acceptEncoding = (req.headers && req.headers['accept-encoding']) || '';
    if (/\bgzip\b/.test(acceptEncoding) && jsonStr.length > 1024) {
        zlib.gzip(Buffer.from(jsonStr, 'utf8'), { level: 6 }, (err, gzipped) => {
            if (err) {
                res.writeHead(statusCode, {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(jsonStr)
                });
                res.end(jsonStr);
                return;
            }
            res.writeHead(statusCode, {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Encoding': 'gzip',
                'Content-Length': gzipped.length,
                'Vary': 'Accept-Encoding'
            });
            res.end(gzipped);
        });
    } else {
        const buf = Buffer.from(jsonStr, 'utf8');
        res.writeHead(statusCode, {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': buf.length
        });
        res.end(buf);
    }
}

// Phục vụ tệp tĩnh siêu tốc với HTTP 304, Range Requests, Streaming và Gzip Cache trong RAM
function serveStaticFile(filePath, stats, req, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const etag = `"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
    const lastModified = stats.mtime.toUTCString();

    // 1. TỐI ƯU HIỆU NĂNG VƯỢT TRỘI: Kiểm tra HTTP Conditional Cache (304 Not Modified)
    if (req.headers['if-none-match'] === etag || req.headers['if-modified-since'] === lastModified) {
        res.writeHead(304, {
            'ETag': etag,
            'Last-Modified': lastModified,
            'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache, must-revalidate' : 'public, max-age=86400, stale-while-revalidate=604800'
        });
        res.end();
        return;
    }

    // 2. Hỗ trợ chuẩn xác HTTP Range Requests (phát video, tua, đọc đuôi moov atom, thumbnail preview)
    const range = req.headers.range;
    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
        const match = range.match(/bytes=(\d*)-(\d*)/);
        if (match) {
            let start;
            let end;
            const total = stats.size;

            if (match[1] === '' && match[2] !== '') {
                // Suffix range: bytes=-500 (lấy 500 byte cuối)
                const suffix = parseInt(match[2], 10);
                start = Math.max(0, total - suffix);
                end = total - 1;
            } else if (match[1] !== '' && match[2] === '') {
                // Prefix range: bytes=1000-
                start = parseInt(match[1], 10);
                const CHUNK_SIZE = 4 * 1024 * 1024;
                end = Math.min(start + CHUNK_SIZE - 1, total - 1);
            } else if (match[1] !== '' && match[2] !== '') {
                // Exact range: bytes=0-1000
                start = parseInt(match[1], 10);
                end = parseInt(match[2], 10);
            } else {
                start = 0;
                end = Math.min(4 * 1024 * 1024 - 1, total - 1);
            }

            if (isNaN(start) || isNaN(end) || start > end || start >= total) {
                res.writeHead(416, {
                    'Content-Range': `bytes */${total}`,
                    'Accept-Ranges': 'bytes'
                });
                res.end();
                return;
            }

            end = Math.min(end, total - 1);
            const chunkSize = (end - start) + 1;

            const rangeHeaders = {
                'Content-Range': `bytes ${start}-${end}/${total}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
                'ETag': etag,
                'Last-Modified': lastModified,
                'Cache-Control': 'public, max-age=86400'
            };

            streamFileSafely(filePath, { start, end }, res, req, 206, rangeHeaders);
            return;
        }
    }

    // 3. TỐI ƯU NÉN GZIP ĐỈNH CAO: Tự động nén và cache trong RAM cho các tệp tĩnh văn bản (.html, .js, .css, .json, .svg)
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const supportsGzip = /\bgzip\b/.test(acceptEncoding);

    if (supportsGzip && COMPRESSIBLE_EXTS.has(ext)) {
        const cached = COMPRESSION_CACHE.get(filePath);
        if (cached && cached.mtimeMs === stats.mtimeMs) {
            const gHeaders = {
                'Content-Length': cached.buffer.length,
                'Content-Type': contentType,
                'Content-Encoding': 'gzip',
                'Vary': 'Accept-Encoding',
                'ETag': etag,
                'Last-Modified': lastModified
            };
            if (ext === '.html') {
                gHeaders['Permissions-Policy'] = 'accelerometer=*, gyroscope=*, magnetometer=*, xr-spatial-tracking=*';
            }
            if (ext === '.html' || ext === '.js') {
                gHeaders['Cache-Control'] = 'no-cache, must-revalidate';
            } else {
                gHeaders['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
            }
            res.writeHead(200, gHeaders);
            res.end(cached.buffer);
            return;
        }

        // Đọc tệp và nén Gzip, lưu bộ nhớ đệm
        fs.readFile(filePath, (readErr, rawBuf) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Lỗi đọc tệp tĩnh: ' + readErr.message);
                return;
            }
            zlib.gzip(rawBuf, { level: 6 }, (gzErr, gzBuf) => {
                if (gzErr) {
                    const fallbackHeaders = {
                        'Content-Length': stats.size,
                        'Content-Type': contentType,
                        'Accept-Ranges': 'bytes',
                        'ETag': etag,
                        'Last-Modified': lastModified
                    };
                    if (ext === '.html') {
                        fallbackHeaders['Permissions-Policy'] = 'accelerometer=*, gyroscope=*, magnetometer=*, xr-spatial-tracking=*';
                    }
                    if (ext === '.html' || ext === '.js') {
                        fallbackHeaders['Cache-Control'] = 'no-cache, must-revalidate';
                    } else {
                        fallbackHeaders['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
                    }
                    streamFileSafely(filePath, {}, res, req, 200, fallbackHeaders);
                    return;
                }
                COMPRESSION_CACHE.set(filePath, {
                    mtimeMs: stats.mtimeMs,
                    buffer: gzBuf
                });
                const gHeaders = {
                    'Content-Length': gzBuf.length,
                    'Content-Type': contentType,
                    'Content-Encoding': 'gzip',
                    'Vary': 'Accept-Encoding',
                    'ETag': etag,
                    'Last-Modified': lastModified
                };
                if (ext === '.html') {
                    gHeaders['Permissions-Policy'] = 'accelerometer=*, gyroscope=*, magnetometer=*, xr-spatial-tracking=*';
                }
                if (ext === '.html' || ext === '.js') {
                    gHeaders['Cache-Control'] = 'no-cache, must-revalidate';
                } else {
                    gHeaders['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
                }
                res.writeHead(200, gHeaders);
                res.end(gzBuf);
            });
        });
        return;
    }

    // 4. Tệp thông thường (Ảnh, media không nén, hoặc client không hỗ trợ Gzip)
    const headers = {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'ETag': etag,
        'Last-Modified': lastModified
    };
    if (ext === '.html') {
        headers['Permissions-Policy'] = 'accelerometer=*, gyroscope=*, magnetometer=*, xr-spatial-tracking=*';
    }
    if (ext === '.html' || ext === '.js') {
        headers['Cache-Control'] = 'no-cache, must-revalidate';
    } else {
        headers['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
    }

    streamFileSafely(filePath, {}, res, req, 200, headers);
}

const server = http.createServer(async (req, res) => {
    // CORS headers for all requests (bao gồm đầy đủ header upload x-folder, x-user-id, x-category...)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename, x-folder, x-user-id, x-category, x-entity-id, x-source, Range');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Phục vụ favicon chính thức của Aura
    if (pathname === '/favicon.ico' || pathname === '/favicon.svg') {
        const favPath = path.join(__dirname, 'favicon.svg');
        if (fs.existsSync(favPath)) {
            const favSvg = fs.readFileSync(favPath);
            res.writeHead(200, {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=86400',
                'Content-Length': favSvg.length
            });
            res.end(favSvg);
            return;
        }
        res.writeHead(204);
        res.end();
        return;
    }

    // API: Kiểm tra trạng thái máy chủ (Bảo mật: Không để lộ thư mục vật lý hoặc cấu hình storage)
    if (pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            storageReady: true,
            indexedFiles: mediaFileIndex.size,
            port: server.address()?.port || PORT,
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // API: Quét lại chỉ mục bộ nhớ đệm Media
    if (pathname === '/api/reindex-media' && (req.method === 'GET' || req.method === 'POST')) {
        rebuildMediaIndex();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Đã quét và lập chỉ mục lại toàn bộ thư mục media',
            indexedFiles: mediaFileIndex.size,
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // API: Giọng đọc Nam Trầm Ấm Tổng Tài (NamMinhNeural via Edge TTS & Disk Cache)
    if (pathname === '/api/tts' && req.method === 'GET') {
        const text = parsedUrl.searchParams.get('text');
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Thiếu tham số text');
            return;
        }

        const voice = parsedUrl.searchParams.get('voice') || 'vi-VN-NamMinhNeural';

        // Tính toán hash MD5 theo text + voice để cache trên đĩa (0ms độ trễ cho câu lặp lại)
        const hash = crypto.createHash('md5').update(`${voice}_${text}`).digest('hex');
        const cacheFile = path.join(TTS_CACHE_DIR, `${hash}.mp3`);

        const sendAudioFile = (filePath) => {
            try {
                const stat = fs.statSync(filePath);
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size,
                    'Cache-Control': 'public, max-age=31536000',
                    'Access-Control-Allow-Origin': '*'
                });
                fs.createReadStream(filePath).pipe(res);
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Lỗi đọc file âm thanh cache');
            }
        };

        if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 100) {
            sendAudioFile(cacheFile);
            return;
        }

        const scriptPath = path.join(__dirname, 'tts_engine.py');
        const py = spawn('python', [scriptPath, '--json']);

        let pyErr = '';
        py.stderr.on('data', (d) => { pyErr += d.toString(); });

        py.stdin.write(JSON.stringify({
            text: text,
            output: cacheFile,
            voice: voice
        }));
        py.stdin.end();

        py.on('close', (code) => {
            if (code === 0 && fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 100) {
                sendAudioFile(cacheFile);
            } else {
                console.error('[Tổng Tài TTS Error]: Python exited with code', code, pyErr);
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Lỗi tổng hợp giọng đọc Tổng Tài: ' + pyErr);
            }
        });

        py.on('error', (err) => {
            console.error('[Tổng Tài TTS Spawn Error]:', err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Lỗi khởi động tiến trình TTS');
        });
        return;
    }

    // API: Lấy danh sách tệp trong thư mục media (hỗ trợ ?folder=...)
    if (pathname === '/api/media-list' && req.method === 'GET') {
        try {
            const rawFolder = parsedUrl.searchParams.get('folder');
            const subDir = sanitizeSubDir(rawFolder || '');
            const targetDir = subDir ? path.join(MEDIA_DIR, subDir) : MEDIA_DIR;
            if (!fs.existsSync(targetDir)) {
                sendJsonResponse(res, req, 200, { success: true, files: [] });
                return;
            }
            const files = fs.readdirSync(targetDir).filter(f => {
                try {
                    return fs.statSync(path.join(targetDir, f)).isFile();
                } catch (_) { return false; }
            }).map(f => {
                const stat = fs.statSync(path.join(targetDir, f));
                const ext = path.extname(f).toLowerCase();
                const isVideo = ['.mp4', '.m4v', '.webm', '.mov', '.ogg'].includes(ext);
                const relUrl = subDir ? `media/${subDir.replace(/\\/g, '/')}/${encodeURIComponent(f)}` : `media/${encodeURIComponent(f)}`;
                return {
                    name: f,
                    url: relUrl,
                    size: stat.size,
                    type: isVideo ? 'video' : 'image',
                    createdAt: stat.birthtime
                };
            });
            sendJsonResponse(res, req, 200, { success: true, files });
        } catch (err) {
            sendJsonResponse(res, req, 500, { success: false, error: err.message });
        }
        return;
    }

    // API: Tải tệp trực tiếp lên thư mục media (hỗ trợ phân cấp Mô hình 1: User ID / Bạn Đồng Hành / OnlyFans)
    if (pathname === '/api/upload-media' && req.method === 'POST') {
        // VÔ HIỆU HÓA HOÀN TOÀN TIMEOUT CHO REQUEST TẢI TỆP DUNG LƯỢNG LỚN (GIGABYTES)
        req.setTimeout(0);
        res.setTimeout(0);

        const contentType = req.headers['content-type'] || '';
        const rawFilename = req.headers['x-filename'] || `file_${Date.now()}`;
        const sanitized = sanitizeFilename(rawFilename);

        // Phân cấp thư mục theo Mô hình 2 (UID là thư mục gốc tuyệt đối)
        const reqUserId = sanitizeFilename(req.headers['x-user-id'] || 'odRSfSMD1ZaoglEFBkeIKhLCusZ2');
        let subDir = sanitizeSubDir(req.headers['x-folder'] || '');
        if (subDir) {
            // Đảm bảo LUÔN nằm trong thư mục UID của người dùng:
            const segments = subDir.split(/[/\\]+/).filter(Boolean);
            if (segments.length > 0 && segments[0] !== reqUserId) {
                subDir = path.join(reqUserId, subDir);
            }
        } else {
            const category = sanitizeFilename(req.headers['x-category'] || '');
            const entityId = sanitizeFilename(req.headers['x-entity-id'] || '');
            if (category === 'companion') {
                subDir = path.join(reqUserId, 'Bạn Đồng Hành', (entityId && entityId !== 'shared') ? entityId : 'Chưa Phân Loại');
            } else if (category === 'creator') {
                subDir = path.join(reqUserId, 'Trai OnlyFans', (entityId && entityId !== 'shared') ? entityId : 'Chưa Phân Loại');
            } else if (reqUserId && (category === 'hot' || category === 'daily')) {
                subDir = path.join(reqUserId, 'Cá Nhân', category === 'hot' ? 'Ảnh Nóng' : 'Ảnh Đời Thường');
            } else if (reqUserId) {
                subDir = path.join(reqUserId);
            }
        }

        const targetDir = subDir ? path.join(MEDIA_DIR, subDir) : MEDIA_DIR;
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // TRƯỜNG HỢP 1: JSON Base64 (Ảnh nhỏ từ Canvas / Cropper / Avatar)
        if (contentType.includes('application/json')) {
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
                const bodyBuffer = Buffer.concat(chunks);
                try {
                    let fileBuffer = bodyBuffer;
                    let finalName = sanitized;

                    const json = JSON.parse(bodyBuffer.toString('utf8'));
                    if (json.filename) finalName = sanitizeFilename(json.filename);
                    if (json.base64) {
                        const cleanBase64 = json.base64.replace(/^data:[^;]+;base64,/, '');
                        fileBuffer = Buffer.from(cleanBase64, 'base64');
                    }

                    const uniqueName = getUniqueFilename(targetDir, finalName, fileBuffer.length);
                    const targetPath = path.join(targetDir, uniqueName);
                    const ext = path.extname(uniqueName).toLowerCase();
                    const isVideo = ['.mp4', '.m4v', '.webm', '.mov', '.ogg'].includes(ext);

                    if (ext === '.mp4' || ext === '.m4v') {
                        fileBuffer = fixMp4Buffer(fileBuffer);
                    }

                    fs.writeFileSync(targetPath, fileBuffer);
                    mediaFileIndex.set(uniqueName.toLowerCase(), targetPath);

                    const webUrl = (subDir ? `media/${subDir.replace(/\\/g, '/')}/${encodeURIComponent(uniqueName)}` : `media/${encodeURIComponent(uniqueName)}`);
                    console.log(`[Aura Media] Đã lưu tệp JSON Base64: ${webUrl} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

                    // NẾU GOOGLE DRIVE ĐÃ KẾT NỐI: TẢI TRỰC TIẾP LÊN DRIVE
                    if (driveEngine.getStatus().authenticated && driveEngine.config.enabled) {
                        try {
                            const driveMime = isVideo ? 'video/mp4' : (ext === '.png' ? 'image/png' : 'image/jpeg');
                            const driveRes = await driveEngine.uploadToDriveBuffer({
                                buffer: fileBuffer,
                                filename: uniqueName,
                                mimeType: driveMime,
                                folderPath: subDir.replace(/\\/g, '/')
                            });
                            console.log(`[Aura Drive] ✓ Tệp Base64 đã lên Drive: ${driveRes.driveFileId}`);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                success: true,
                                filename: uniqueName,
                                folder: subDir.replace(/\\/g, '/'),
                                url: isVideo ? driveRes.streamUrl : driveRes.url,
                                localUrl: webUrl,
                                driveFileId: driveRes.driveFileId,
                                thumbnailUrl: driveRes.thumbnailUrl,
                                streamUrl: driveRes.streamUrl,
                                directUrl: driveRes.directUrl,
                                type: isVideo ? 'video' : 'image',
                                size: fileBuffer.length,
                                storage: 'google_drive'
                            }));
                            return;
                        } catch (driveErr) {
                            console.warn('[Aura Drive] Lỗi upload buffer lên Drive, giữ bản lưu cục bộ:', driveErr.message);
                        }
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        filename: uniqueName,
                        folder: subDir.replace(/\\/g, '/'),
                        url: webUrl,
                        localUrl: webUrl,
                        type: isVideo ? 'video' : 'image',
                        size: fileBuffer.length,
                        storage: 'local_media'
                    }));
                } catch (err) {
                    console.error('[Aura Media] Lỗi lưu tệp JSON:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            });
            return;
        }

        // TRƯỜNG HỢP 2: TẢI TỆP NHỊ PHÂN TRỰC TIẾP (STREAM THẲNG VÀO Ổ ĐĨA, RAM CỐ ĐỊNH 64KB, HỖ TRỢ FILE GIGABYTE KHÔNG TIMEOUT)
        const tempName = `.uploading_${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${sanitized}`;
        const tempPath = path.join(targetDir, tempName);
        const fileStream = fs.createWriteStream(tempPath, { highWaterMark: 256 * 1024 });
        let bytesReceived = 0;

        req.on('data', chunk => {
            bytesReceived += chunk.length;
        });

        req.on('aborted', () => {
            try { fileStream.destroy(); } catch (_) {}
            try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
            console.warn('[Aura Media] Client hủy kết nối giữa chừng:', sanitized);
        });

        fileStream.on('error', (err) => {
            console.error('[Aura Media Stream Error]:', err);
            try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });

        req.pipe(fileStream);

        fileStream.on('finish', async () => {
            try {
                const uniqueName = getUniqueFilename(targetDir, sanitized, bytesReceived);
                const targetPath = path.join(targetDir, uniqueName);
                const ext = path.extname(uniqueName).toLowerCase();
                const isVideo = ['.mp4', '.m4v', '.webm', '.mov', '.ogg'].includes(ext);

                if (ext === '.mp4' || ext === '.m4v') {
                    fixMp4FileOnDisk(tempPath);
                }

                fs.renameSync(tempPath, targetPath);
                mediaFileIndex.set(uniqueName.toLowerCase(), targetPath);

                const webUrl = (subDir ? `media/${subDir.replace(/\\/g, '/')}/${encodeURIComponent(uniqueName)}` : `media/${encodeURIComponent(uniqueName)}`);
                console.log(`[Aura Media] ✓ Đã lưu tệp streaming: ${webUrl} (${(bytesReceived / (1024 * 1024)).toFixed(2)} MB)`);

                // NẾU GOOGLE DRIVE ĐÃ KẾT NỐI: TẢI TRỰC TIẾP LÊN DRIVE
                if (driveEngine.getStatus().authenticated && driveEngine.config.enabled) {
                    try {
                        const driveMime = isVideo ? (ext === '.webm' ? 'video/webm' : 'video/mp4') : (ext === '.png' ? 'image/png' : (ext === '.webp' ? 'image/webp' : 'image/jpeg'));
                        const driveReadStream = fs.createReadStream(targetPath);
                        const driveRes = await driveEngine.uploadToDriveStream({
                            stream: driveReadStream,
                            filename: uniqueName,
                            mimeType: driveMime,
                            size: bytesReceived,
                            folderPath: subDir.replace(/\\/g, '/')
                        });

                        console.log(`[Aura Drive] 🚀 Tệp đã lên Google Drive thành công: ${driveRes.driveFileId} -> ${driveRes.url}`);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            filename: uniqueName,
                            folder: subDir.replace(/\\/g, '/'),
                            url: isVideo ? driveRes.streamUrl : driveRes.url,
                            localUrl: webUrl,
                            driveFileId: driveRes.driveFileId,
                            thumbnailUrl: driveRes.thumbnailUrl,
                            streamUrl: driveRes.streamUrl,
                            directUrl: driveRes.directUrl,
                            type: isVideo ? 'video' : 'image',
                            size: bytesReceived,
                            storage: 'google_drive'
                        }));
                        return;
                    } catch (driveErr) {
                        console.error('[Aura Drive] Lỗi upload Drive:', driveErr.message);
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    filename: uniqueName,
                    folder: subDir.replace(/\\/g, '/'),
                    url: webUrl,
                    localUrl: webUrl,
                    type: isVideo ? 'video' : 'image',
                    size: bytesReceived,
                    storage: 'local_media'
                }));
            } catch (err) {
                console.error('[Aura Media] Lỗi hoàn tất lưu tệp:', err);
                try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            }
        });
        return;
    }

    // API: Khởi tạo thư mục riêng cho đối tác mới trên Media cục bộ
    if (pathname === '/api/ensure-folder' && req.method === 'POST') {
        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('end', () => {
            try {
                const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                let subDir = sanitizeSubDir(body.folder || '');
                const uid = sanitizeFilename(body.userId || 'odRSfSMD1ZaoglEFBkeIKhLCusZ2');
                if (subDir) {
                    const segments = subDir.split(/[/\\]+/).filter(Boolean);
                    if (segments.length > 0 && segments[0] !== uid) {
                        subDir = path.join(uid, subDir);
                    }
                    const localPath = path.join(MEDIA_DIR, subDir);
                    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });
                    console.log(`[Aura Folder] ✓ Đã khởi tạo thư mục riêng: ${subDir}`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, folder: subDir.replace(/\\/g, '/') }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Tải tệp từ liên kết URL trên mạng về lưu trực tiếp vào thư mục media (hỗ trợ phân cấp Mô hình 1)
    if (pathname === '/api/download-media' && req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            try {
                const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                const fileUrl = body.url;
                if (!fileUrl) throw new Error("Thiếu URL");

                // Phân cấp thư mục theo Mô hình 2 (UID là thư mục gốc tuyệt đối)
                const reqUserId = sanitizeFilename(body.userId || 'odRSfSMD1ZaoglEFBkeIKhLCusZ2');
                let subDir = sanitizeSubDir(body.folder || '');
                if (subDir) {
                    const segments = subDir.split(/[/\\]+/).filter(Boolean);
                    if (segments.length > 0 && segments[0] !== reqUserId) {
                        subDir = path.join(reqUserId, subDir);
                    }
                } else {
                    const category = sanitizeFilename(body.category || '');
                    const entityId = sanitizeFilename(body.entityId || '');
                    if (category === 'companion') {
                        subDir = path.join(reqUserId, 'Bạn Đồng Hành', (entityId && entityId !== 'shared') ? entityId : 'Chưa Phân Loại');
                    } else if (category === 'creator') {
                        subDir = path.join(reqUserId, 'Trai OnlyFans', (entityId && entityId !== 'shared') ? entityId : 'Chưa Phân Loại');
                    } else if (reqUserId && (category === 'hot' || category === 'daily')) {
                        subDir = path.join(reqUserId, 'Cá Nhân', category === 'hot' ? 'Ảnh Nóng' : 'Ảnh Đời Thường');
                    } else if (reqUserId) {
                        subDir = path.join(reqUserId);
                    }
                }

                const targetDir = subDir ? path.join(MEDIA_DIR, subDir) : MEDIA_DIR;
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }

                let rawName = body.filename;
                if (!rawName) {
                    try {
                        rawName = path.basename(new URL(fileUrl).pathname);
                    } catch (e) {
                        rawName = `media_${Date.now()}`;
                    }
                }
                if (!rawName || rawName === '/' || rawName === '.') rawName = `media_${Date.now()}.jpg`;

                const sanitized = sanitizeFilename(rawName);
                const uniqueName = getUniqueFilename(targetDir, sanitized);
                const targetPath = path.join(targetDir, uniqueName);

                const fetchModule = fileUrl.startsWith('https') ? https : http;
                const fileStream = fs.createWriteStream(targetPath);

                const downloadFile = (srcUrl) => {
                    return new Promise((resolve, reject) => {
                        const mod = srcUrl.startsWith('https') ? https : http;
                        const reqDl = mod.get(srcUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (resDl) => {
                            if (resDl.statusCode >= 300 && resDl.statusCode < 400 && resDl.headers.location) {
                                let redirectUrl = resDl.headers.location;
                                if (!redirectUrl.startsWith('http')) {
                                    redirectUrl = new URL(redirectUrl, srcUrl).href;
                                }
                                downloadFile(redirectUrl).then(resolve).catch(reject);
                                return;
                            }
                            resDl.pipe(fileStream);
                            fileStream.on('finish', () => resolve());
                            fileStream.on('error', reject);
                        });
                        reqDl.on('error', reject);
                    });
                };

                await downloadFile(fileUrl);
                mediaFileIndex.set(uniqueName.toLowerCase(), targetPath);

                const ext = path.extname(uniqueName).toLowerCase();
                const isVideo = ['.mp4', '.m4v', '.webm', '.mov', '.ogg'].includes(ext);

                const webUrl = (subDir ? `media/${subDir.replace(/\\/g, '/')}/${encodeURIComponent(uniqueName)}` : `media/${encodeURIComponent(uniqueName)}`);
                console.log(`[Aura Media] Đã tải về và lưu cục bộ: ${webUrl}`);

                // NẾU GOOGLE DRIVE ĐÃ KẾT NỐI: TẢI TRỰC TIẾP LÊN DRIVE
                if (driveEngine.getStatus().authenticated && driveEngine.config.enabled) {
                    try {
                        const driveMime = isVideo ? (ext === '.webm' ? 'video/webm' : 'video/mp4') : (ext === '.png' ? 'image/png' : (ext === '.webp' ? 'image/webp' : 'image/jpeg'));
                        const stat = fs.statSync(targetPath);
                        const driveReadStream = fs.createReadStream(targetPath);
                        const driveRes = await driveEngine.uploadToDriveStream({
                            stream: driveReadStream,
                            filename: uniqueName,
                            mimeType: driveMime,
                            size: stat.size,
                            folderPath: subDir.replace(/\\/g, '/')
                        });

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            filename: uniqueName,
                            folder: subDir.replace(/\\/g, '/'),
                            url: isVideo ? driveRes.streamUrl : driveRes.url,
                            localUrl: webUrl,
                            driveFileId: driveRes.driveFileId,
                            thumbnailUrl: driveRes.thumbnailUrl,
                            streamUrl: driveRes.streamUrl,
                            directUrl: driveRes.directUrl,
                            type: isVideo ? 'video' : 'image',
                            storage: 'google_drive'
                        }));
                        return;
                    } catch (driveErr) {
                        console.error('[Aura Drive] Lỗi upload Drive cho file download:', driveErr.message);
                    }
                }

                // === TRẢ KẾT QUẢ NGAY LẬP TỨC ===
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    filename: uniqueName,
                    folder: subDir.replace(/\\/g, '/'),
                    url: webUrl,
                    localUrl: webUrl,
                    type: isVideo ? 'video' : 'image',
                    storage: 'local_media'
                }));
            } catch (err) {
                console.error('[Aura Media] Lỗi tải media từ URL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Xóa tệp hoặc thư mục vật lý khỏi ổ đĩa cục bộ media & Google Drive
    if (pathname === '/api/delete-media' && (req.method === 'POST' || req.method === 'DELETE')) {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            try {
                let body = {};
                if (chunks.length > 0) {
                    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                }

                let deletedCount = 0;
                let folderDeleted = false;
                let driveFolderDeleted = false;

                // 1. Xóa thư mục nếu có yêu cầu (Xóa cả ổ đĩa cục bộ VÀ Google Drive)
                if (body.folderPath) {
                    folderDeleted = safelyDeleteMediaFolder(body.folderPath);

                    // Xóa folder trên Google Drive
                    try {
                        const driveRes = await driveEngine.deleteFolderFromDrive(body.folderPath);
                        driveFolderDeleted = Boolean(driveRes && driveRes.success && !driveRes.notFound);
                        if (driveRes && driveRes.success) {
                            serverDriveManifestMap = null; // Làm mới bộ đệm tra cứu
                        }
                    } catch (eDrive) {
                        console.warn('[Aura Media] Không thể xóa thư mục trên Google Drive:', eDrive.message);
                    }
                }

                // 2. Thu thập danh sách URL / Tệp cần xóa
                const urlsToDelete = [];
                if (Array.isArray(body.urls)) {
                    urlsToDelete.push(...body.urls);
                }
                if (Array.isArray(body.items)) {
                    body.items.forEach(it => {
                        if (typeof it === 'string') urlsToDelete.push(it);
                        else if (it && (it.url || it.localUrl || it.filename)) urlsToDelete.push(it.url || it.localUrl || it.filename);
                    });
                }
                if (body.url) urlsToDelete.push(body.url);
                if (body.filename && !urlsToDelete.length) urlsToDelete.push(body.filename);

                // 3. Duyệt xóa từng tệp
                const seenFiles = new Set();
                for (const item of urlsToDelete) {
                    if (!item) continue;
                    const resolvedPath = resolveMediaFile(item, body.folder);
                    if (resolvedPath && !seenFiles.has(resolvedPath)) {
                        seenFiles.add(resolvedPath);
                        if (safelyDeleteMediaFile(resolvedPath)) {
                            deletedCount++;
                        }
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    deletedCount,
                    folderDeleted,
                    driveFolderDeleted,
                    message: `Đã xử lý xóa tệp media khỏi thư mục lưu trữ (đã xóa ${deletedCount} tệp${folderDeleted ? ', đã xóa thư mục cục bộ' : ''}${driveFolderDeleted ? ', đã xóa thư mục Google Drive' : ''}).`
                }));
            } catch (err) {
                console.error('[Aura Media Delete Error]:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Lấy URL xác thực Google OAuth 2.0 (1-Click Login)
    if (pathname === '/api/drive/auth-url' && req.method === 'GET') {
        try {
            const authUrl = driveEngine.getAuthUrl();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, authUrl }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Callback tiếp nhận mã ủy quyền từ Google OAuth 2.0
    if (pathname === '/api/drive/oauth2callback' && req.method === 'GET') {
        const code = parsedUrl.searchParams.get('code');
        const errParam = parsedUrl.searchParams.get('error');
        if (errParam) {
            res.writeHead(302, { 'Location': '/dashboard.html?drive_error=' + encodeURIComponent(errParam) });
            res.end();
            return;
        }
        if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Thiếu mã xác thực từ Google.');
            return;
        }
        try {
            await driveEngine.handleOAuthCallback(code);
            console.log('[Aura Drive] ✓ Ủy quyền tài khoản Google Drive thành công!');
            res.writeHead(302, { 'Location': '/dashboard.html?drive_connected=1' });
            res.end();
        } catch (err) {
            console.error('[Aura Drive Callback Error]:', err.message);
            res.writeHead(302, { 'Location': '/dashboard.html?drive_error=' + encodeURIComponent(err.message) });
            res.end();
        }
        return;
    }

    // API: Trạng thái kết nối Google Drive hiện tại (Bảo mật: Chỉ Master UID mới được phép truy vấn)
    if ((pathname === '/api/drive/status' || pathname === '/api/drive-config') && req.method === 'GET') {
        const reqUid = req.headers['x-user-id'] || parsedUrl.searchParams.get('uid');
        if (reqUid !== 'odRSfSMD1ZaoglEFBkeIKhLCusZ2') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Truy cập bị từ chối' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            status: driveEngine.getStatus(),
            config: {
                clientId: driveEngine.config.clientId || '',
                clientSecret: driveEngine.config.clientSecret || '',
                enabled: Boolean(driveEngine.config.enabled)
            }
        }));
        return;
    }

    // API: Lưu cấu hình Google Drive (Chỉ Master UID)
    if ((pathname === '/api/drive/save-config' || pathname === '/api/drive-config') && req.method === 'POST') {
        const reqUid = req.headers['x-user-id'] || parsedUrl.searchParams.get('uid');
        if (reqUid !== 'odRSfSMD1ZaoglEFBkeIKhLCusZ2') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Truy cập bị từ chối' }));
            return;
        }
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            try {
                const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                driveEngine.saveConfig(body);
                await driveEngine.initDrive();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, status: driveEngine.getStatus() }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Kích hoạt đồng bộ toàn bộ media cục bộ lên Google Drive (Batch Sync - Chỉ Master UID)
    if (pathname === '/api/drive/sync-media' && req.method === 'POST') {
        const reqUid = req.headers['x-user-id'] || parsedUrl.searchParams.get('uid');
        if (reqUid !== 'odRSfSMD1ZaoglEFBkeIKhLCusZ2') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Truy cập bị từ chối' }));
            return;
        }
        try {
            syncMediaToDrive.runBatchSync().catch(err => {
                console.error('[Aura Batch Sync Error]:', err);
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Đã bắt đầu tiến trình đồng bộ Media trong nền',
                syncState: syncMediaToDrive.getSyncState()
            }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Lấy tiến độ đồng bộ Media (Chỉ Master UID)
    if (pathname === '/api/drive/sync-status' && req.method === 'GET') {
        const reqUid = req.headers['x-user-id'] || parsedUrl.searchParams.get('uid');
        if (reqUid !== 'odRSfSMD1ZaoglEFBkeIKhLCusZ2') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Truy cập bị từ chối' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            syncState: syncMediaToDrive.getSyncState()
        }));
        return;
    }

    // API: Stream Video Google Drive trực tiếp (Hỗ trợ tua video mượt mà HTTP 206 Partial Content)
    if (pathname.startsWith('/api/drive-stream/')) {
        const fileId = pathname.replace('/api/drive-stream/', '').split('/')[0].split('?')[0];
        if (!fileId) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Thiếu fileId');
            return;
        }
        driveEngine.streamFromDrive(fileId, req, res);
        return;
    }

    // API: Proxy ảnh Google Drive bảo đảm tải mượt mà không bị Google chặn
    if (pathname === '/api/drive-image' && req.method === 'GET') {
        const fileId = parsedUrl.searchParams.get('id');
        if (!fileId) {
            res.writeHead(400); res.end('Thiếu id file'); return;
        }
        const driveUrl = `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}`;
        const fetchDriveImage = (targetUrl) => {
            const u = new URL(targetUrl);
            const opts = {
                hostname: u.hostname,
                port: 443,
                path: u.pathname + u.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
                }
            };
            https.get(opts, (gRes) => {
                if (gRes.statusCode >= 300 && gRes.statusCode < 400 && gRes.headers.location) {
                    fetchDriveImage(gRes.headers.location);
                    return;
                }
                res.writeHead(gRes.statusCode || 200, {
                    'Content-Type': gRes.headers['content-type'] || 'image/jpeg',
                    'Cache-Control': 'public, max-age=86400',
                    'Access-Control-Allow-Origin': '*'
                });
                gRes.pipe(res);
            }).on('error', (err) => {
                res.writeHead(502); res.end('Lỗi proxy Drive: ' + err.message);
            });
        };
        fetchDriveImage(driveUrl);
        return;
    }



    // Phục vụ tệp tĩnh & Media Streaming an toàn
    let decodedPath = pathname;
    try {
        decodedPath = decodeURIComponent(pathname);
    } catch (e) {
        decodedPath = pathname;
    }

    let safePath = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
        safePath = '/index.html';
    }

    let resolvedFilePath = path.join(__dirname, safePath);

    // Kiểm tra an toàn: không cho phép thoát khỏi thư mục dự án
    if (!resolvedFilePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // =====================================================
    // HỆ THỐNG ĐIỀU HƯỚNG THÂN THIỆN & SEO (FRIENDLY URLS)
    // =====================================================
    const cleanRoute = pathname.replace(/\/+$/, '') || '/';

    // 1. Phân hệ Dashboard SPA (Bao gồm tất cả các module con)
    const DASHBOARD_ROUTES = new Set([
        '/dashboard',
        '/ho-so-y-te',
        '/chu-ky-sinh-tinh',
        '/nhat-ky-giai-phong',
        '/ban-dong-hanh',
        '/trai-ngon',
        '/onlyfan',
        '/trai-onlyfans',
        '/dinh-duong-vi-chat',
        '/virtual-pt',
        '/luyen-tap',
        '/libido-trigger-mapping',
        '/libido',
        '/phan-tich-ai',
        '/phan-tich',
        '/thu-thach-edging',
        '/edging',
        '/thiet-lap-bao-mat',
        '/bao-mat'
    ]);

    // 2. Phân hệ Hồ sơ cá nhân
    const PROFILE_ROUTES = new Set([
        '/ca-nhan',
        '/ho-so',
        '/ho-so-ca-nhan',
        '/profile'
    ]);

    // 3. Các trang tính năng & giới thiệu độc lập
    const SHOWCASE_ROUTES = {
        '/khao-sat': 'khao-sat.html',
        '/gioi-thieu': 'gioi-thieu.html',
        '/huan-luyen-pt': 'huan-luyen-pt.html'
    };

    if (DASHBOARD_ROUTES.has(cleanRoute) || cleanRoute.startsWith('/dashboard/')) {
        resolvedFilePath = path.join(__dirname, 'dashboard.html');
    } else if (PROFILE_ROUTES.has(cleanRoute)) {
        resolvedFilePath = path.join(__dirname, 'ca-nhan.html');
    } else if (SHOWCASE_ROUTES[cleanRoute]) {
        resolvedFilePath = path.join(__dirname, SHOWCASE_ROUTES[cleanRoute]);
    } else if (!path.extname(cleanRoute) && cleanRoute !== '/') {
        // Tự động kiểm tra file .html tương ứng nếu người dùng bỏ đuôi .html
        const potentialHtml = path.join(__dirname, cleanRoute.replace(/^\//, '') + '.html');
        if (fs.existsSync(potentialHtml)) {
            try {
                if (fs.statSync(potentialHtml).isFile()) {
                    resolvedFilePath = potentialHtml;
                }
            } catch (_) {}
        }
    }

    // Tương thích ngược: Nếu tệp media đã được chuyển vào [UID]/Cá Nhân/... hoặc thư mục mới
    const cleanSafe = safePath.replace(/^[/\\]+/, '');
    if (!fs.existsSync(resolvedFilePath) && cleanSafe.startsWith('media')) {
        const base = path.basename(safePath);
        const subAfterMedia = cleanSafe.replace(/^media[/\\]/, '');
        const UID_DEF = 'odRSfSMD1ZaoglEFBkeIKhLCusZ2';
        const candidates = [
            path.join(__dirname, 'media', UID_DEF, subAfterMedia),
            path.join(__dirname, 'media', UID_DEF, 'Bạn Đồng Hành', subAfterMedia),
            path.join(__dirname, 'media', UID_DEF, 'Trai OnlyFans', subAfterMedia),
            path.join(__dirname, 'media', UID_DEF, 'Cá Nhân', 'Ảnh Đời Thường', base),
            path.join(__dirname, 'media', UID_DEF, 'Cá Nhân', 'Ảnh Nóng', base),
            path.join(__dirname, 'media', base),
            path.join('Y:\\Aura Media', UID_DEF, subAfterMedia),
            path.join('Y:\\Aura Media', subAfterMedia)
        ];
        for (const cand of candidates) {
            if (fs.existsSync(cand)) {
                try {
                    if (fs.statSync(cand).isFile()) {
                        resolvedFilePath = cand;
                        break;
                    }
                } catch (_) {}
            }
        }
        // [MỚI] Tra cứu thông minh Media Index: Nếu chưa tìm thấy, tra cứu tức thì theo tên tệp trong toàn bộ cây media/
        if (!fs.existsSync(resolvedFilePath) && mediaFileIndex.has(base.toLowerCase())) {
            const indexedPath = mediaFileIndex.get(base.toLowerCase());
            if (fs.existsSync(indexedPath)) {
                try {
                    if (fs.statSync(indexedPath).isFile()) {
                        resolvedFilePath = indexedPath;
                    }
                } catch (_) {}
            }
        }

        // [MỚI] Google Drive Cloud Fallback: Khi tệp media không tồn tại cục bộ (đặc biệt trên Render / Cloud hosting)
        if (!fs.existsSync(resolvedFilePath)) {
            const driveMatch = resolveFileFromDriveManifest(cleanSafe);
            if (driveMatch && driveMatch.driveFileId) {
                const ext = path.extname(cleanSafe).toLowerCase();
                const isVideoOrAudio = ['.mp4', '.m4v', '.webm', '.mov', '.mp3', '.wav', '.ogg'].includes(ext);
                if (isVideoOrAudio) {
                    driveEngine.streamFromDrive(driveMatch.driveFileId, req, res);
                    return;
                } else {
                    res.writeHead(302, {
                        'Location': driveMatch.url || `https://lh3.googleusercontent.com/d/${driveMatch.driveFileId}`,
                        'Cache-Control': 'public, max-age=86400',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end();
                    return;
                }
            }
        }
    }

    const filePath = resolvedFilePath;
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // [MỚI] SPA Fallback: Nếu không tìm thấy file, và request không phải là file có đuôi cụ thể (như .jpg, .css, .mp4)
            // Hoặc nếu nó là đường dẫn thân thiện (không có extension), ta trả về index.html
            const ext = path.extname(pathname).toLowerCase();
            if (!ext || ext === '.html') {
                const indexFilePath = path.join(__dirname, 'index.html');
                fs.stat(indexFilePath, (errIndex, indexStats) => {
                    if (errIndex) {
                        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('404 Not Found');
                        return;
                    }
                    serveStaticFile(indexFilePath, indexStats, req, res);
                });
                return;
            }

            // Nếu thực sự là yêu cầu file tài nguyên lỗi (.png, .js, .mp4) thì trả 404 sạch sẽ
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + pathname);
            return;
        }

        serveStaticFile(filePath, stats, req, res);
    });
});

// Cấu hình không giới hạn thời gian (Zero-Timeout) cho luồng tải tệp dung lượng cao:
server.timeout = 0;              // Vô hiệu hóa socket timeout khi stream tệp lớn
server.requestTimeout = 0;       // Vô hiệu hóa requestTimeout (mặc định Node 18+ là 300s/5 phút)
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;

function startServer(portToTry) {
    server.listen(portToTry, '0.0.0.0', () => {
        console.log(`====================================================`);
        console.log(`  🌟 Aura Media Server đang chạy tại:`);
        console.log(`  👉 http://0.0.0.0:${portToTry}`);
        console.log(`  📁 Thư mục lưu trữ media: ${MEDIA_DIR}`);
        console.log(`====================================================`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && !process.env.PORT) {
            console.warn(`Cổng ${portToTry} đang bận, thử cổng tiếp theo ${portToTry + 1}...`);
            startServer(portToTry + 1);
        } else {
            console.error('Lỗi khởi động máy chủ:', err);
        }
    });
}

startServer(PORT);

