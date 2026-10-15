const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { pipeline } = require('stream');

const PORT = process.env.PORT || 3000;
const MEDIA_DIR = path.join(__dirname, 'media');

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
    '.ico': 'image/x-icon',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.bin': 'application/octet-stream'
};

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
// TÍCH HỢP GOOGLE DRIVE (ĐÃ TẮT THEO YÊU CẦU NGƯỜI DÙNG)
// =====================================================
let DRIVE_CONFIG = { enabled: false, scriptUrl: '' };
try {
    const driveConfigPath = path.join(__dirname, 'drive-config.json');
    if (fs.existsSync(driveConfigPath)) {
        DRIVE_CONFIG = JSON.parse(fs.readFileSync(driveConfigPath, 'utf8'));
    }
} catch (e) {}
DRIVE_CONFIG.enabled = false;
console.log('[Aura Drive] ✗ Google Drive upload đã tắt theo yêu cầu. Tất cả tệp chỉ lưu vào folder media/.');

// TỐI ƯU HIỆU NĂNG DRIVE: HTTPS Keep-Alive Agent tái sử dụng TLS connection
const driveHttpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 8,
    maxFreeSockets: 4,
    timeout: 60000
});

// Hàng đợi giới hạn đồng thời upload Drive (tối đa 2 song song) để tránh nghẽn & quá tải Google Apps Script
const DRIVE_CONCURRENCY = 2;
let driveActiveUploads = 0;
const driveQueue = [];

function enqueueDriveUpload(fn) {
    return new Promise((resolve, reject) => {
        driveQueue.push({ fn, resolve, reject });
        processDriveQueue();
    });
}

function processDriveQueue() {
    while (driveActiveUploads < DRIVE_CONCURRENCY && driveQueue.length > 0) {
        const item = driveQueue.shift();
        if (!item) break;
        const { fn, resolve, reject } = item;
        driveActiveUploads++;
        fn().then(resolve).catch(reject).finally(() => {
            driveActiveUploads--;
            processDriveQueue();
        });
    }
}

/**
 * Gửi HTTP POST lên Google Apps Script và xử lý redirect 302 của Google.
 * Sử dụng driveHttpsAgent (Keep-Alive) để tái sử dụng kết nối TLS, tăng tốc đáng kể.
 */
function sendToGoogleAppsScript(payloadString, targetUrl, method = 'POST', redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 6) {
            return reject(new Error('Quá nhiều lần chuyển hướng từ Google Apps Script (>6)'));
        }
        const u = new URL(targetUrl);
        const opts = {
            hostname: u.hostname,
            port: 443,
            path: u.pathname + u.search,
            method: method,
            agent: driveHttpsAgent,
            headers: method === 'POST' ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payloadString),
                'User-Agent': 'Aura-Server-FastBridge/2.0'
            } : {
                'User-Agent': 'Aura-Server-FastBridge/2.0',
                'Accept': 'application/json, text/plain, */*'
            }
        };

        const httpReq = https.request(opts, (httpRes) => {
            // Google Apps Script trả về 302 redirect sau khi nhận POST
            if (httpRes.statusCode >= 300 && httpRes.statusCode < 400 && httpRes.headers.location) {
                let nextLoc = httpRes.headers.location;
                if (!nextLoc.startsWith('http')) {
                    nextLoc = new URL(nextLoc, targetUrl).href;
                }
                httpRes.resume(); // Giải phóng socket
                sendToGoogleAppsScript(payloadString, nextLoc, 'GET', redirectCount + 1)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            let body = '';
            httpRes.on('data', c => body += c);
            httpRes.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Phản hồi không hợp lệ từ Google Drive Script: ' + body.substring(0, 150)));
                }
            });
        });

        httpReq.on('error', reject);
        // Timeout 90 giây cho mỗi lượt gửi
        httpReq.setTimeout(90000, () => {
            httpReq.destroy();
            reject(new Error('Hết thời gian chờ Google Drive (90 giây)'));
        });

        if (method === 'POST') httpReq.write(payloadString);
        httpReq.end();
    });
}

/**
 * Đẩy file lên Google Drive qua Google Apps Script Web App.
 * TỐI ƯU: Tự động retry tối đa 2 lần với backoff nếu gặp sự cố mạng hoặc Google bận,
 * sử dụng Keep-Alive Agent để tối đa hóa tốc độ truyền tải.
 * @param {Buffer} fileBuffer - Nội dung file dạng Buffer
 * @param {string} filename - Tên file
 * @param {string} mimeType - MIME type (image/jpeg, video/mp4...)
 * @param {string} subFolder - Đường dẫn thư mục con (companions/id, users/uid/hot...)
 * @returns {Promise<Object>} Kết quả upload {success, fileId, url, type...}
 */
async function uploadToDrive(fileBuffer, filename, mimeType, subFolder) {
    if (!DRIVE_CONFIG.enabled || !DRIVE_CONFIG.scriptUrl) {
        throw new Error('Google Drive chưa cấu hình');
    }

    // Giới hạn ~25MB (base64 tăng thêm ~33% → ~33MB payload)
    if (fileBuffer.length > 25 * 1024 * 1024) {
        throw new Error('Tệp quá lớn cho Google Drive (tối đa 25MB). Đang lưu cục bộ.');
    }

    const base64 = fileBuffer.toString('base64');
    const payload = JSON.stringify({
        filename: filename,
        mimeType: mimeType || 'application/octet-stream',
        base64: base64,
        folder: subFolder || ''
    });

    const maxRetries = 2;
    let lastError = null;

    console.log(`[Aura Drive] 🚀 Đang tải lên Drive: ${filename} (${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB) → ${subFolder || '/'}`);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                const delayMs = attempt * 1500;
                console.warn(`[Aura Drive] Thử lại lần ${attempt}/${maxRetries} cho ${filename} sau ${delayMs}ms...`);
                await new Promise(r => setTimeout(r, delayMs));
            }
            const result = await sendToGoogleAppsScript(payload, DRIVE_CONFIG.scriptUrl, 'POST');
            return result;
        } catch (err) {
            lastError = err;
            console.warn(`[Aura Drive] Lần thử ${attempt + 1} thất bại cho ${filename}: ${err.message}`);
        }
    }

    throw lastError || new Error('Upload lên Drive thất bại sau các lần thử lại');
}

/**
 * Kiểm tra kết nối tới Google Apps Script Web App qua HTTP GET.
 * @param {string} scriptUrl - URL Web App của Apps Script
 * @returns {Promise<Object>}
 */
function testDriveConnection(scriptUrl) {
    return new Promise((resolve, reject) => {
        let cleanUrl = String(scriptUrl || '').trim();
        if (!cleanUrl) return reject(new Error('Chưa cung cấp scriptUrl'));

        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
        }

        if (cleanUrl.includes('/edit') || cleanUrl.includes('/u/')) {
            return resolve({
                success: false,
                type: 'invalid_url_type',
                message: 'Đây là link trình soạn thảo (Editor) của Google Apps Script, không phải link Web App. Bạn cần bấm nút [Triển khai] (Deploy) -> chọn [Ứng dụng web] để lấy link có đuôi /exec.'
            });
        }

        let redirectCount = 0;
        const maxRedirects = 6;

        const doRequest = (targetUrl) => {
            if (redirectCount++ > maxRedirects) {
                return resolve({
                    success: false,
                    type: 'too_many_redirects',
                    message: 'Quá nhiều lần chuyển hướng (vượt quá 6 lần).'
                });
            }
            try {
                const u = new URL(targetUrl);

                if (u.hostname.includes('accounts.google.com')) {
                    return resolve({
                        success: false,
                        type: 'auth_required',
                        statusCode: 401,
                        message: 'Google yêu cầu đăng nhập tài khoản. Nguyên nhân: Lúc Triển khai (Deploy), mục [Ai có quyền truy cập / Who has access] chưa được chọn là [Bất kỳ ai / Anyone] (Google mặc định là Chỉ mình tôi).'
                    });
                }

                const opts = {
                    hostname: u.hostname,
                    port: u.port || (u.protocol === 'https:' ? 443 : 80),
                    path: u.pathname + u.search,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Aura-Drive-Bridge/1.0',
                        'Accept': 'application/json, text/plain, */*'
                    }
                };

                const mod = u.protocol === 'https:' ? https : http;
                const httpReq = mod.request(opts, (httpRes) => {
                    if (httpRes.statusCode >= 300 && httpRes.statusCode < 400 && httpRes.headers.location) {
                        let nextLoc = httpRes.headers.location;
                        if (!nextLoc.startsWith('http')) {
                            nextLoc = new URL(nextLoc, targetUrl).href;
                        }
                        httpRes.resume();
                        doRequest(nextLoc);
                        return;
                    }

                    let body = '';
                    httpRes.on('data', c => body += c);
                    httpRes.on('end', () => {
                        const trimmed = body.trim();
                        try {
                            const result = JSON.parse(trimmed);
                            if (result.status === 'ok' || result.service || result.success !== false) {
                                return resolve({
                                    success: true,
                                    statusCode: httpRes.statusCode,
                                    data: result,
                                    message: 'Kết nối Google Apps Script thành công!'
                                });
                            }
                            return resolve({
                                success: false,
                                statusCode: httpRes.statusCode,
                                data: result,
                                message: result.error || 'Google Apps Script trả về lỗi'
                            });
                        } catch (_) {}

                        if (trimmed.includes('accounts.google.com') || trimmed.includes('Sign in') || trimmed.includes('Đăng nhập')) {
                            return resolve({
                                success: false,
                                type: 'auth_required',
                                statusCode: httpRes.statusCode,
                                message: 'Google yêu cầu đăng nhập. Bạn cần chọn [Ai có quyền truy cập: Bất kỳ ai (Anyone)] khi Triển khai Web App.'
                            });
                        }

                        if (httpRes.statusCode === 404) {
                            return resolve({
                                success: false,
                                type: 'not_found',
                                statusCode: 404,
                                message: 'Không tìm thấy Web App (404 Not Found). Vui lòng kiểm tra xem bạn đã copy đầy đủ URL đến tận chữ "/exec" ở cuối chưa.'
                            });
                        }

                        if (trimmed.includes('Script function not found') || trimmed.includes('doGet')) {
                            return resolve({
                                success: false,
                                type: 'missing_doget',
                                statusCode: httpRes.statusCode,
                                message: 'Google Apps Script chưa có hàm doGet(). Hãy đảm bảo bạn đã dán toàn bộ mã nguồn và bấm Ctrl+S (Lưu) rồi mới Triển khai.'
                            });
                        }

                        return resolve({
                            success: false,
                            type: 'html_response',
                            statusCode: httpRes.statusCode,
                            preview: trimmed.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 150),
                            message: 'Google Apps Script trả về trang web thay vì dữ liệu JSON. Vui lòng kiểm tra lại quyền truy cập (Anyone) và triển khai lại.'
                        });
                    });
                });

                httpReq.on('error', (err) => {
                    resolve({
                        success: false,
                        type: 'network_error',
                        message: 'Không thể kết nối đến Google: ' + err.message
                    });
                });

                httpReq.setTimeout(15000, () => {
                    httpReq.destroy();
                    resolve({
                        success: false,
                        type: 'timeout',
                        message: 'Quá thời gian chờ phản hồi từ Google (15 giây).'
                    });
                });

                httpReq.end();
            } catch (err) {
                reject(err);
            }
        };

        console.log('[Aura Drive Test] Đang kiểm tra URL:', cleanUrl);
        doRequest(cleanUrl);
    });
}



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

const server = http.createServer((req, res) => {
    // CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename, x-source, Range');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Xử lý favicon.ico để không bao giờ xuất hiện lỗi 404 trong Console trình duyệt
    if (pathname === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API: Kiểm tra trạng thái máy chủ
    if (pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            mediaDir: MEDIA_DIR,
            port: server.address()?.port || PORT,
            drive: {
                enabled: Boolean(DRIVE_CONFIG.enabled),
                configured: Boolean(DRIVE_CONFIG.scriptUrl)
            },
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // API: Proxy giọng đọc Tiếng Việt chuẩn bản xứ (Vietnamese TTS Proxy)
    if (pathname === '/api/tts' && req.method === 'GET') {
        const text = parsedUrl.searchParams.get('text');
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Thiếu tham số text');
            return;
        }
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;
        https.get(ttsUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (ttsRes) => {
            res.writeHead(ttsRes.statusCode || 200, {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
            });
            ttsRes.pipe(res);
        }).on('error', (err) => {
            console.error('[TTS Proxy Error]:', err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Lỗi TTS Proxy: ' + err.message);
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
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, files: [] }));
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
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, files }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Tải tệp trực tiếp lên thư mục media (hỗ trợ phân cấp Mô hình 1: User ID / Bạn Đồng Hành / OnlyFans)
    if (pathname === '/api/upload-media' && req.method === 'POST') {
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

        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            const bodyBuffer = Buffer.concat(chunks);
            try {
                let fileBuffer = bodyBuffer;
                let finalName = sanitized;

                // Nếu là JSON có base64
                if (contentType.includes('application/json')) {
                    const json = JSON.parse(bodyBuffer.toString('utf8'));
                    if (json.filename) finalName = sanitizeFilename(json.filename);
                    if (json.base64) {
                        const cleanBase64 = json.base64.replace(/^data:[^;]+;base64,/, '');
                        fileBuffer = Buffer.from(cleanBase64, 'base64');
                    }
                }

                const uniqueName = getUniqueFilename(targetDir, finalName, fileBuffer.length);
                const targetPath = path.join(targetDir, uniqueName);
                const ext = path.extname(uniqueName).toLowerCase();
                const isVideo = ['.mp4', '.m4v', '.webm', '.mov', '.ogg'].includes(ext);

                if (ext === '.mp4' || ext === '.m4v') {
                    fileBuffer = fixMp4Buffer(fileBuffer);
                }

                fs.writeFileSync(targetPath, fileBuffer);

                const webUrl = (subDir ? `media/${subDir.replace(/\\/g, '/')}/${encodeURIComponent(uniqueName)}` : `media/${encodeURIComponent(uniqueName)}`);
                console.log(`[Aura Media] Đã lưu tệp cục bộ: ${webUrl} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

                // === TRẢ KẾT QUẢ NGAY LẬP TỨC cho trình duyệt (không chờ Drive hay RaiDrive) ===
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
                console.error('[Aura Media] Lỗi lưu tệp:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
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

                const ext = path.extname(uniqueName).toLowerCase();
                const isVideo = ['.mp4', '.m4v', '.webm', '.mov', '.ogg'].includes(ext);

                const webUrl = (subDir ? `media/${subDir.replace(/\\/g, '/')}/${encodeURIComponent(uniqueName)}` : `media/${encodeURIComponent(uniqueName)}`);
                console.log(`[Aura Media] Đã tải về và lưu cục bộ: ${webUrl}`);

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

    // API: Lấy cấu hình Google Drive hiện tại
    if (pathname === '/api/drive-config' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            enabled: !!DRIVE_CONFIG.enabled,
            scriptUrl: DRIVE_CONFIG.scriptUrl || ''
        }));
        return;
    }

    // API: Lưu cấu hình Google Drive (áp dụng ngay lập tức không cần restart server)
    if (pathname === '/api/drive-config' && req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            try {
                const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                DRIVE_CONFIG.enabled = Boolean(body.enabled);
                DRIVE_CONFIG.scriptUrl = String(body.scriptUrl || '').trim();

                const driveConfigPath = path.join(__dirname, 'drive-config.json');
                fs.writeFileSync(driveConfigPath, JSON.stringify({
                    enabled: DRIVE_CONFIG.enabled,
                    scriptUrl: DRIVE_CONFIG.scriptUrl,
                    _huong_dan: "Sau khi triển khai Google Apps Script xong, dán URL Web App vào trường scriptUrl, đổi enabled thành true."
                }, null, 2), 'utf8');

                console.log(`[Aura Drive] Đã cập nhật cấu hình live: enabled=${DRIVE_CONFIG.enabled}, scriptUrl=${DRIVE_CONFIG.scriptUrl ? 'Đã thiết lập' : 'Trống'}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, config: DRIVE_CONFIG }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Kiểm tra kết nối tới Google Apps Script
    if (pathname === '/api/drive-test' && req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            try {
                const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                const testUrl = (body.scriptUrl || DRIVE_CONFIG.scriptUrl || '').trim();
                if (!testUrl) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Chưa có URL Google Apps Script để kiểm tra' }));
                    return;
                }
                const testRes = await testDriveConnection(testUrl);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, result: testRes }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
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
                    streamFileSafely(indexFilePath, {}, res, req, 200, {
                        'Content-Length': indexStats.size,
                        'Content-Type': 'text/html; charset=utf-8',
                        'Accept-Ranges': 'bytes',
                        'Permissions-Policy': 'accelerometer=*, gyroscope=*, magnetometer=*, xr-spatial-tracking=*',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    });
                });
                return;
            }

            // Nếu thực sự là yêu cầu file tài nguyên lỗi (.png, .js, .mp4) thì trả 404 sạch sẽ
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + pathname);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const etag = `"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
        const lastModified = stats.mtime.toUTCString();

        // TỐI ƯU HIỆU NĂNG VƯỢT TRỘI: Kiểm tra HTTP Conditional Cache (304 Not Modified)
        if (req.headers['if-none-match'] === etag || req.headers['if-modified-since'] === lastModified) {
            res.writeHead(304, {
                'ETag': etag,
                'Last-Modified': lastModified,
                'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache, must-revalidate' : 'public, max-age=86400, stale-while-revalidate=604800'
            });
            res.end();
            return;
        }

        // Hỗ trợ chuẩn xác HTTP Range Requests (phát video, tua, đọc đuôi moov atom, thumbnail preview)
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
                    // TỐI ƯU SIÊU TỐC: Bật phân mảnh streaming 4MB cho lượt tải ban đầu.
                    // Trình duyệt nhận ngay 4MB đầu tiên trong <5ms để phát tức thì thay vì chờ stream toàn bộ file lớn!
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

                // Kiểm tra phạm vi hợp lệ, tránh lỗi NaN hoặc âm gây crash server
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

        // Tệp thông thường (Ảnh, tệp tải đủ, Range không kích hoạt)
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
    });
});

function startServer(portToTry) {
    server.listen(portToTry, () => {
        console.log(`====================================================`);
        console.log(`  🌟 Aura Media Server đang chạy tại:`);
        console.log(`  👉 http://localhost:${portToTry}`);
        console.log(`  📁 Thư mục lưu trữ media: ${MEDIA_DIR}`);
        console.log(`====================================================`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Cổng ${portToTry} đang bận, thử cổng tiếp theo ${portToTry + 1}...`);
            startServer(portToTry + 1);
        } else {
            console.error('Lỗi khởi động máy chủ:', err);
        }
    });
}

startServer(PORT);

