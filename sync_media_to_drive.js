/**
 * AURA BATCH MEDIA SYNC TO GOOGLE DRIVE (Aura Media / 1Mz1kzYEAfx4oO1pKrj7hxZPOajS_QzHt)
 * 
 * Quét toàn bộ thư mục media/ cục bộ, tải lên Google Drive với tốc độ cao qua Google Drive API v3,
 * và tự động cập nhật lại các URL trong Firestore Database để hệ thống hoạt động 100% trên Drive!
 * 
 * Có thể chạy độc lập: node sync_media_to_drive.js
 * Hoặc gọi từ server.js qua API: /api/drive/sync-media
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const driveEngine = require('./drive-engine');

const MEDIA_DIR = path.join(__dirname, 'media');
const MANIFEST_FILE = path.join(__dirname, 'drive-sync-manifest.json');
const DEFAULT_UID = 'odRSfSMD1ZaoglEFBkeIKhLCusZ2';
const FIRESTORE_API_KEY = 'AIzaSyC-BfkoWmpKkXvUwLgIo7dL4zCwcbOcAak';
const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/aura-47c9e/databases/(default)/documents';

let syncState = {
    isRunning: false,
    totalFiles: 0,
    processedFiles: 0,
    uploadedFiles: 0,
    skippedFiles: 0,
    errorFiles: 0,
    totalBytes: 0,
    uploadedBytes: 0,
    currentFile: '',
    startTime: null,
    endTime: null,
    errors: []
};

// Đọc manifest đã đồng bộ trước đó (tránh upload lại tệp đã có trên Drive)
let manifest = {};
try {
    if (fs.existsSync(MANIFEST_FILE)) {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    }
} catch (_) {}

function saveManifest() {
    try {
        fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
    } catch (_) {}
}

/**
 * Quét đệ quy tất cả tệp trong media/
 */
function scanMediaFiles(dir, baseDir = MEDIA_DIR) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    for (const item of list) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Bỏ qua thư mục tạm / cache nội bộ nếu có
            if (item === 'tts_cache') continue;
            results = results.concat(scanMediaFiles(fullPath, baseDir));
        } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            const isMedia = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.m4v', '.webm', '.mov', '.mp3', '.wav'].includes(ext);
            if (isMedia) {
                const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                let folderPath = path.dirname(relPath).replace(/\\/g, '/');
                if (folderPath === '.') folderPath = '';

                // BẢO VỆ CẤU TRÚC: Mọi tệp BẮT BUỘC phải nằm bên trong thư mục [UID]!
                // Tuyệt đối không được phép có bất kỳ folder nào nằm ngang hàng với UID trong Aura Media!
                const segments = folderPath.split('/').filter(Boolean);
                if (segments.length === 0 || segments[0] !== DEFAULT_UID) {
                    if (segments[0] === 'edging_voice') {
                        folderPath = `${DEFAULT_UID}/Edging`;
                    } else if (folderPath) {
                        folderPath = `${DEFAULT_UID}/${folderPath}`;
                    } else {
                        folderPath = `${DEFAULT_UID}`;
                    }
                }

                results.push({
                    fullPath,
                    relPath,
                    folderPath,
                    filename: item,
                    size: stat.size,
                    ext
                });
            }
        }
    }
    return results;
}

/**
 * Xác định MIME type từ đuôi tệp
 */
function getMimeType(ext) {
    const map = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.m4v': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav'
    };
    return map[ext] || 'application/octet-stream';
}

/**
 * Chạy đồng bộ toàn bộ Media
 * @param {Function} progressCallback - Callback thông báo tiến trình cho Web UI
 */
async function runBatchSync(progressCallback = null) {
    if (syncState.isRunning) {
        throw new Error('Đang có tiến trình đồng bộ khác đang chạy!');
    }

    // 1. Kiểm tra kết nối Google Drive
    const isReady = await driveEngine.initDrive();
    if (!isReady) {
        throw new Error('Google Drive chưa được cấp quyền OAuth hoặc chưa cấu hình Client ID/Secret.');
    }
    await driveEngine.verifyConnection();

    syncState = {
        isRunning: true,
        totalFiles: 0,
        processedFiles: 0,
        uploadedFiles: 0,
        skippedFiles: 0,
        errorFiles: 0,
        totalBytes: 0,
        uploadedBytes: 0,
        currentFile: '',
        startTime: Date.now(),
        endTime: null,
        errors: []
    };

    console.log(`\n========================================================================`);
    console.log(`🚀 BẮT ĐẦU ĐỒNG BỘ MEDIA CỤC BỘ LÊN GOOGLE DRIVE (AURA MEDIA)`);
    console.log(`========================================================================`);

    // 2. Thu thập danh sách tệp
    const files = scanMediaFiles(MEDIA_DIR);
    syncState.totalFiles = files.length;
    syncState.totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    console.log(`- Tìm thấy: ${files.length} tệp (~${(syncState.totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB)`);

    // 3. Xử lý tải lên với hàng đợi song song (Concurrency 4 để đạt tốc độ tối đa mà không quá tải mạng)
    const CONCURRENCY = 4;
    let fileIdx = 0;

    const worker = async () => {
        while (fileIdx < files.length) {
            const current = files[fileIdx++];
            syncState.currentFile = current.relPath;
            syncState.processedFiles++;

            // Kiểm tra manifest nếu đã từng upload tệp này
            if (manifest[current.relPath] && manifest[current.relPath].size === current.size && manifest[current.relPath].driveFileId) {
                syncState.skippedFiles++;
                if (progressCallback) progressCallback({ ...syncState });
                continue;
            }

            try {
                const stream = fs.createReadStream(current.fullPath);
                const mimeType = getMimeType(current.ext);

                const result = await driveEngine.uploadToDriveStream({
                    stream,
                    filename: current.filename,
                    mimeType,
                    size: current.size,
                    folderPath: current.folderPath
                });

                manifest[current.relPath] = {
                    driveFileId: result.driveFileId,
                    url: result.url,
                    thumbnailUrl: result.thumbnailUrl,
                    streamUrl: result.streamUrl,
                    size: current.size,
                    uploadedAt: new Date().toISOString()
                };

                syncState.uploadedFiles++;
                syncState.uploadedBytes += current.size;

                if (syncState.uploadedFiles % 10 === 0) {
                    saveManifest();
                }
            } catch (err) {
                console.error(`[Sync Error] Không thể tải ${current.relPath}:`, err.message);
                syncState.errorFiles++;
                syncState.errors.push({ file: current.relPath, error: err.message });
            }

            if (progressCallback) progressCallback({ ...syncState });
        }
    };

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker());
    }
    await Promise.all(workers);

    saveManifest();
    syncState.isRunning = false;
    syncState.endTime = Date.now();

    const elapsedMin = ((syncState.endTime - syncState.startTime) / 60000).toFixed(1);
    console.log(`\n========================================================================`);
    console.log(`✓ ĐỒNG BỘ MEDIA HOÀN TẤT TRONG ${elapsedMin} PHÚT!`);
    console.log(`- Thành công: ${syncState.uploadedFiles} tệp`);
    console.log(`- Đã có sẵn (bỏ qua): ${syncState.skippedFiles} tệp`);
    console.log(`- Thất bại: ${syncState.errorFiles} tệp`);
    console.log(`========================================================================\n`);

    // 4. Tự động cập nhật Firestore Database
    console.log(`[Sync Firestore] Đang tự động cập nhật Firestore metadata...`);
    try {
        await updateFirestoreFromManifest();
        console.log(`[Sync Firestore] ✓ Đã cập nhật xong toàn bộ đối tác & trang cá nhân!`);
    } catch (e) {
        console.error(`[Sync Firestore] Lỗi cập nhật Firestore:`, e.message);
    }

    return syncState;
}

/**
 * Cập nhật Firestore Database với các liên kết Drive mới
 */
async function updateFirestoreFromManifest() {
    // 1. Quét danh sách partners
    const partnersData = await firestoreFetch('partners');
    for (const doc of (partnersData.documents || [])) {
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};
        let modified = false;
        const newFields = {};
        const masks = [];

        // Kiểm tra avatar
        if (fields.avatar && fields.avatar.stringValue) {
            const oldUrl = fields.avatar.stringValue;
            const driveMatch = findDriveMatch(oldUrl);
            if (driveMatch) {
                newFields.avatar = { stringValue: driveMatch.thumbnailUrl || driveMatch.url };
                masks.push('avatar');
                modified = true;
            }
        }

        // Kiểm tra gallery, teachingGallery, videoCalls
        ['gallery', 'teachingGallery', 'videoCalls'].forEach(sec => {
            if (fields[sec]?.arrayValue?.values) {
                let sectionModified = false;
                const newValues = fields[sec].arrayValue.values.map(item => {
                    let u = '';
                    if (item.stringValue) u = item.stringValue;
                    else if (item.mapValue?.fields?.url?.stringValue) u = item.mapValue.fields.url.stringValue;

                    const match = findDriveMatch(u);
                    if (match) {
                        sectionModified = true;
                        if (item.mapValue) {
                            item.mapValue.fields.url = { stringValue: match.streamUrl || match.url };
                            item.mapValue.fields.driveFileId = { stringValue: match.driveFileId };
                            item.mapValue.fields.thumbnailUrl = { stringValue: match.thumbnailUrl };
                            return item;
                        } else {
                            return {
                                mapValue: {
                                    fields: {
                                        url: { stringValue: match.streamUrl || match.url },
                                        driveFileId: { stringValue: match.driveFileId },
                                        thumbnailUrl: { stringValue: match.thumbnailUrl },
                                        type: { stringValue: sec === 'videoCalls' ? 'video' : 'image' }
                                    }
                                }
                            };
                        }
                    }
                    return item;
                });

                if (sectionModified) {
                    newFields[sec] = { arrayValue: { values: newValues } };
                    masks.push(sec);
                    modified = true;
                }
            }
        });

        if (modified) {
            await firestorePatch(`partners/${id}`, newFields, masks);
            console.log(`[Firestore] ✓ Đã cập nhật đối tác: "${fields.name?.stringValue || id}"`);
        }
    }

    // 2. Cập nhật hồ sơ cá nhân trong cả hai collection users và profiles
    for (const col of ['users', 'profiles']) {
        try {
            const colData = await firestoreFetch(col);
            for (const doc of (colData.documents || [])) {
                const id = doc.name.split('/').pop();
                const fields = doc.fields || {};
                let modified = false;
                const newFields = {};
                const masks = [];

                ['dailyGallery', 'hotGallery'].forEach(sec => {
                    if (fields[sec]?.arrayValue?.values) {
                        let secMod = false;
                        const newValues = fields[sec].arrayValue.values.map(item => {
                            const u = item.mapValue?.fields?.url?.stringValue || item.stringValue || '';
                            const match = findDriveMatch(u);
                            if (match) {
                                secMod = true;
                                if (item.mapValue) {
                                    item.mapValue.fields.url = { stringValue: match.streamUrl || match.url };
                                    item.mapValue.fields.driveFileId = { stringValue: match.driveFileId };
                                    item.mapValue.fields.thumbnailUrl = { stringValue: match.thumbnailUrl };
                                    return item;
                                } else {
                                    return {
                                        mapValue: {
                                            fields: {
                                                url: { stringValue: match.streamUrl || match.url },
                                                driveFileId: { stringValue: match.driveFileId },
                                                thumbnailUrl: { stringValue: match.thumbnailUrl }
                                            }
                                        }
                                    };
                                }
                            }
                            return item;
                        });

                        if (secMod) {
                            newFields[sec] = { arrayValue: { values: newValues } };
                            masks.push(sec);
                            modified = true;
                        }
                    }
                });

                if (fields.coverURL?.stringValue) {
                    const match = findDriveMatch(fields.coverURL.stringValue);
                    if (match) {
                        newFields.coverURL = { stringValue: match.thumbnailUrl || match.url };
                        masks.push('coverURL');
                        modified = true;
                    }
                }

                if (modified) {
                    await firestorePatch(`${col}/${id}`, newFields, masks);
                    console.log(`[Firestore] ✓ Đã cập nhật ${col}/${id}`);
                }
            }
        } catch (e) {
            console.error(`[Firestore Error ${col}]:`, e.message);
        }
    }
}

/**
 * Tìm kiếm tệp trong manifest khớp với URL cục bộ
 */
function findDriveMatch(urlOrPath) {
    if (!urlOrPath || typeof urlOrPath !== 'string') return null;
    let clean = urlOrPath.replace(/^[/\\]+/, '').replace(/^media[/\\]/, '');
    try { clean = decodeURIComponent(clean); } catch (_) {}

    // 1. Thử khớp chính xác relPath
    if (manifest[clean]) return manifest[clean];

    // 2. Thử khớp theo tên tệp ở cuối
    const basename = path.basename(clean).toLowerCase();
    for (const [key, val] of Object.entries(manifest)) {
        if (path.basename(key).toLowerCase() === basename) {
            return val;
        }
    }
    return null;
}

function firestoreFetch(pathSuffix) {
    return new Promise((resolve, reject) => {
        https.get(`${FIRESTORE_BASE}/${pathSuffix}?key=${FIRESTORE_API_KEY}`, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => {
                try { resolve(JSON.parse(b)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function firestorePatch(docPath, fields, fieldMasks) {
    return new Promise((resolve, reject) => {
        const queryParams = fieldMasks.map(m => 'updateMask.fieldPaths=' + m).join('&');
        const u = new URL(`${FIRESTORE_BASE}/${docPath}?key=${FIRESTORE_API_KEY}&${queryParams}`);
        const body = JSON.stringify({ fields });
        const req = https.request({
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve(JSON.parse(b)));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Cho phép chạy trực tiếp từ dòng lệnh: node sync_media_to_drive.js
if (require.main === module) {
    runBatchSync().catch(err => {
        console.error('Lỗi quá trình đồng bộ:', err);
        process.exit(1);
    });
}

module.exports = {
    runBatchSync,
    getSyncState: () => syncState,
    updateFirestoreFromManifest
};
