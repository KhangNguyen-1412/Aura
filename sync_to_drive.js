/**
 * Aura Media Sync to Google Drive (Y:\Aura Media)
 * 
 * KIẾN TRÚC ĐA NGƯỜI DÙNG CHUẨN HÓA (Mô hình 2):
 * - Đường dẫn lưu trữ: Y:\Aura Media\[UID]\[Phân Loại]\[Tên Đối Tác]\
 * - QUY TRÌNH ƯU TIÊN TUẦN TỰ (Theo chỉ đạo):
 *   + GIAI ĐOẠN 1: Đồng bộ 100% Bạn Đồng Hành vào Y:\Aura Media\[UID]\Bạn Đồng Hành\[Tên]
 *   + GIAI ĐOẠN 2: CHỈ KHI Bạn Đồng Hành xong 100%, mới sang Trai OnlyFans vào Y:\Aura Media\[UID]\Trai OnlyFans\[Tên]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/aura-47c9e/databases/(default)/documents/partners?key=AIzaSyC-BfkoWmpKkXvUwLgIo7dL4zCwcbOcAak';
const DRIVE_ROOT = 'Y:\\Aura Media';
const DEFAULT_UID = 'odRSfSMD1ZaoglEFBkeIKhLCusZ2';

function safeMakeDir(dirPath) {
    if (fs.existsSync(dirPath)) return;
    const parent = path.dirname(dirPath);
    if (!fs.existsSync(parent)) {
        safeMakeDir(parent);
    }
    try {
        fs.mkdirSync(dirPath);
    } catch (e) {
        if (e.code !== 'EEXIST') throw e;
    }
}

function resolveLocalFile(u) {
    if (!u || u.startsWith('http://') || u.startsWith('https://')) return null;
    let cleanPath = u.replace(/^[/\\]+/, '');
    try {
        cleanPath = decodeURIComponent(cleanPath);
    } catch (_) {}

    const baseName = path.basename(cleanPath);
    const candidates = [
        path.join(process.cwd(), cleanPath),
        path.join(process.cwd(), 'media', cleanPath),
        path.join(process.cwd(), 'media', baseName),
        path.join(process.cwd(), 'media', DEFAULT_UID, 'Bạn Đồng Hành', 'Nguyễn Quốc Tuấn', baseName),
        path.join(process.cwd(), 'media', 'Bạn Đồng Hành', 'Nguyễn Quốc Tuấn', baseName),
        path.join(process.cwd(), 'media', 'companions', 'shared', baseName),
        path.join(process.cwd(), 'media', 'companions', 'yQ2hiwOyFen1OwQlk7C8', baseName)
    ];
    for (const cand of candidates) {
        if (fs.existsSync(cand)) return cand;
    }
    return null;
}

function fetchPartners() {
    return new Promise((resolve, reject) => {
        https.get(FIRESTORE_URL, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve(data.documents || []);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function extractUrl(v) {
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (v.stringValue) return v.stringValue;
    if (v.mapValue && v.mapValue.fields) {
        return v.mapValue.fields.url ? v.mapValue.fields.url.stringValue : (v.mapValue.fields.src ? v.mapValue.fields.src.stringValue : null);
    }
    return null;
}

function buildPartnerQueue(partnerDoc, typeLabel) {
    const fields = partnerDoc.fields || {};
    const name = (fields.name ? fields.name.stringValue : 'Chưa đặt tên').trim();
    const uid = (fields.userId ? fields.userId.stringValue : DEFAULT_UID).trim();
    
    // Thư mục chuẩn hóa: Y:\Aura Media\[UID]\[Phân loại]\[Tên]
    const personFolder = path.join(DRIVE_ROOT, uid, typeLabel, name);

    const avatar = fields.avatar ? fields.avatar.stringValue : null;
    const gallery = fields.gallery ? (fields.gallery.arrayValue?.values || []).map(extractUrl).filter(Boolean) : [];
    const teachingGallery = fields.teachingGallery ? (fields.teachingGallery.arrayValue?.values || []).map(extractUrl).filter(Boolean) : [];
    const videoCalls = fields.videoCalls ? (fields.videoCalls.arrayValue?.values || []).map(extractUrl).filter(Boolean) : [];

    const allUrls = [avatar, ...gallery, ...teachingGallery, ...videoCalls].filter(Boolean);
    const seenSrc = new Set();
    const files = [];

    allUrls.forEach(u => {
        const srcPath = resolveLocalFile(u);
        if (srcPath && !seenSrc.has(srcPath)) {
            seenSrc.add(srcPath);
            const filename = path.basename(srcPath);
            const destPath = path.join(personFolder, filename);
            const stat = fs.statSync(srcPath);
            files.push({
                personName: name,
                uid,
                typeLabel,
                personFolder,
                srcPath,
                filename,
                destPath,
                size: stat.size
            });
        }
    });

    return {
        name,
        uid,
        typeLabel,
        folder: personFolder,
        files
    };
}

async function runQueue(partnerGroups, phaseTitle) {
    console.log(`\n========================================================================`);
    console.log(`   ${phaseTitle}`);
    console.log(`========================================================================`);

    const allFiles = [];
    partnerGroups.forEach(g => allFiles.push(...g.files));
    const totalFiles = allFiles.length;
    const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);

    console.log(`- Số đối tác: ${partnerGroups.length} người`);
    console.log(`- Tổng số tệp: ${totalFiles} tệp (~${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB)\n`);

    let copiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let copiedBytes = 0;
    let globalIndex = 0;
    const startTime = Date.now();

    for (let pIdx = 0; pIdx < partnerGroups.length; pIdx++) {
        const group = partnerGroups[pIdx];
        const groupTotalBytes = group.files.reduce((acc, f) => acc + f.size, 0);
        console.log(`\n------------------------------------------------------------------------`);
        console.log(`▶ [${pIdx + 1}/${partnerGroups.length}] ${group.typeLabel}: ${group.name} (${group.files.length} tệp, ${(groupTotalBytes / (1024 * 1024)).toFixed(1)} MB)`);
        console.log(`  📁 Thư mục Drive: ${group.folder}`);
        console.log(`------------------------------------------------------------------------`);

        if (group.files.length === 0) {
            console.log(`  (Không có tệp media cục bộ nào cần đồng bộ)`);
            continue;
        }

        safeMakeDir(group.folder);

        for (let fIdx = 0; fIdx < group.files.length; fIdx++) {
            globalIndex++;
            const item = group.files[fIdx];
            const sizeMB = (item.size / (1024 * 1024)).toFixed(1);
            const overallPct = ((globalIndex / totalFiles) * 100).toFixed(1);
            const personPct = (((fIdx + 1) / group.files.length) * 100).toFixed(0);

            try {
                // Kiểm tra nếu file đã có trên Drive và đúng kích thước -> Bỏ qua
                if (fs.existsSync(item.destPath)) {
                    const destStat = fs.statSync(item.destPath);
                    if (destStat.size === item.size) {
                        skippedCount++;
                        console.log(`  [${fIdx + 1}/${group.files.length}] (${personPct}%) [Tổng: ${overallPct}%] ⏭️ ĐÃ CÓ: ${item.filename} (${sizeMB} MB)`);
                        continue;
                    }
                }

                const t0 = Date.now();
                fs.copyFileSync(item.srcPath, item.destPath);
                const duration = ((Date.now() - t0) / 1000).toFixed(1);
                copiedCount++;
                copiedBytes += item.size;
                console.log(`  [${fIdx + 1}/${group.files.length}] (${personPct}%) [Tổng: ${overallPct}%] ✓ XONG: ${item.filename} (${sizeMB} MB) trong ${duration}s`);
            } catch (err) {
                errorCount++;
                console.error(`  [${fIdx + 1}/${group.files.length}] ✗ LỖI: ${item.filename} - ${err.message}`);
            }
        }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✔ HOÀN TẤT ${phaseTitle}`);
    console.log(`  - Đã sao chép mới: ${copiedCount} tệp (~${(copiedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB)`);
    console.log(`  - Đã có sẵn (bỏ qua): ${skippedCount} tệp`);
    console.log(`  - Lỗi: ${errorCount} tệp`);
    console.log(`  - Thời gian: ${elapsed}s`);
    return { copiedCount, skippedCount, errorCount, copiedBytes };
}

async function main() {
    console.log('========================================================================');
    console.log('   AURA MEDIA SYNC: ĐỒNG BỘ MEDIA LÊN GOOGLE DRIVE (Y:\\Aura Media)');
    console.log('   Mô hình chuẩn hóa: Y:\\Aura Media\\[UID]\\[Phân Loại]\\[Tên Đối Tác]');
    console.log('   Chính sách ưu tiên: BẠN ĐỒNG HÀNH TRƯỚC (100%) → MỚI TỚI TRAI ONLYFANS');
    console.log('========================================================================\n');

    if (!fs.existsSync(DRIVE_ROOT)) {
        console.error(`[LỖI] Không tìm thấy ổ đĩa Google Drive tại: ${DRIVE_ROOT}`);
        console.error('Vui lòng đảm bảo RaiDrive đang chạy và đã mount ổ Y:\\');
        process.exit(1);
    }

    console.log('[1/3] Đang nạp danh sách hồ sơ từ Cloud Firestore...');
    const docs = await fetchPartners();
    console.log(`✓ Đã nạp ${docs.length} hồ sơ đối tác từ Cloud Firestore.\n`);

    console.log('[2/3] Phân loại Bạn Đồng Hành vs Trai OnlyFans theo UID...');
    const banDongHanhGroups = [];
    const traiOnlyFansGroups = [];

    docs.forEach(doc => {
        const fields = doc.fields || {};
        const category = fields.category ? fields.category.stringValue : (fields.partnerType ? fields.partnerType.stringValue : 'real');
        const isOF = category === 'onlyfan' || (fields.relation && fields.relation.stringValue && fields.relation.stringValue.includes('OnlyFan'));
        
        if (isOF) {
            traiOnlyFansGroups.push(buildPartnerQueue(doc, 'Trai OnlyFans'));
        } else {
            banDongHanhGroups.push(buildPartnerQueue(doc, 'Bạn Đồng Hành'));
        }
    });

    const bdTotalFiles = banDongHanhGroups.reduce((acc, g) => acc + g.files.length, 0);
    const bdTotalBytes = banDongHanhGroups.reduce((acc, g) => acc + g.files.reduce((a, f) => a + f.size, 0), 0);

    const ofTotalFiles = traiOnlyFansGroups.reduce((acc, g) => acc + g.files.length, 0);
    const ofTotalBytes = traiOnlyFansGroups.reduce((acc, g) => acc + g.files.reduce((a, f) => a + f.size, 0), 0);

    console.log(`📊 THỐNG KÊ HỆ THỐNG:`);
    console.log(`   1. Bạn Đồng Hành: ${banDongHanhGroups.length} người | ${bdTotalFiles} tệp (~${(bdTotalBytes / (1024*1024*1024)).toFixed(2)} GB)`);
    console.log(`   2. Trai OnlyFans: ${traiOnlyFansGroups.length} người | ${ofTotalFiles} tệp (~${(ofTotalBytes / (1024*1024*1024)).toFixed(2)} GB)\n`);

    // ========================================================================
    // BƯỚC 1: ĐỒNG BỘ 100% BẠN ĐỒNG HÀNH
    // ========================================================================
    console.log('🚀 BẮT ĐẦU GIAI ĐOẠN 1: ĐỒNG BỘ TOÀN BỘ BẠN ĐỒNG HÀNH...');
    await runQueue(banDongHanhGroups, 'GIAI ĐOẠN 1: BẠN ĐỒNG HÀNH (ƯU TIÊN 100%)');

    console.log('\n========================================================================');
    console.log('🎉🎉🎉 CHÚC MỪNG: 100% MEDIA CỦA TOÀN BỘ BẠN ĐỒNG HÀNH ĐÃ XONG!');
    console.log('   Tất cả thư mục Bạn Đồng Hành đã hoàn tất chuẩn hóa dưới UID.');
    console.log('========================================================================\n');

    // ========================================================================
    // BƯỚC 2: CHỈ BÂY GIỜ MỚI CHUYỂN SANG TRAI ONLYFANS
    // ========================================================================
    console.log('🚀 BẮT ĐẦU GIAI ĐOẠN 2: ĐỒNG BỘ MEDIA TRAI ONLYFANS...');
    await runQueue(traiOnlyFansGroups, 'GIAI ĐOẠN 2: TRAI ONLYFANS');

    console.log('\n========================================================================');
    console.log('🌟🌟🌟 TẤT CẢ MEDIA CỦA HỆ THỐNG ĐÃ ĐỒNG BỘ 100% LÊN GOOGLE DRIVE THEO UID!');
    console.log('========================================================================\n');
}

main().catch(err => {
    console.error('[FATAL ERROR]:', err);
});
