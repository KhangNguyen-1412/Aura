const https = require('https');
const API_KEY = 'AIzaSyC-BfkoWmpKkXvUwLgIo7dL4zCwcbOcAak';
const BASE_URL = 'https://firestore.googleapis.com/v1/projects/aura-47c9e/databases/(default)/documents';

function getDoc(docPath) {
    return new Promise((resolve, reject) => {
        https.get(`${BASE_URL}/${docPath}?key=${API_KEY}`, res => {
            let b = ''; res.on('data', c => b += c); res.on('end', () => resolve(JSON.parse(b)));
        }).on('error', reject);
    });
}

function patchDoc(docPath, fields, updateMask) {
    return new Promise((resolve, reject) => {
        const queryParams = updateMask.map(m => 'updateMask.fieldPaths=' + m).join('&');
        const u = new URL(`${BASE_URL}/${docPath}?key=${API_KEY}&${queryParams}`);
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
            let b = ''; res.on('data', c => b += c); res.on('end', () => resolve(JSON.parse(b)));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function fixProfile() {
    const doc = await getDoc('profiles/profile_odRSfSMD1ZaoglEFBkeIKhLCusZ2');
    if (doc.fields?.dailyGallery?.arrayValue?.values) {
        const vals = doc.fields.dailyGallery.arrayValue.values.map(v => {
            if (v.mapValue?.fields?.url?.stringValue) {
                let u = v.mapValue.fields.url.stringValue;
                u = u.replace('media/users/odRSfSMD1ZaoglEFBkeIKhLCusZ2/daily/', 'media/odRSfSMD1ZaoglEFBkeIKhLCusZ2/Cá Nhân/Ảnh Đời Thường/');
                v.mapValue.fields.url.stringValue = u;
            }
            return v;
        });
        await patchDoc('profiles/profile_odRSfSMD1ZaoglEFBkeIKhLCusZ2', {
            dailyGallery: { arrayValue: { values: vals } }
        }, ['dailyGallery']);
        console.log('✓ Đã cập nhật dailyGallery trong Profile:', vals.length, 'mục');
    }
}

async function fixPartners() {
    const listRes = await new Promise(r => https.get(`${BASE_URL}/partners?key=${API_KEY}`, res => {
        let b = ''; res.on('data', c => b += c); res.on('end', () => r(JSON.parse(b)));
    }));

    for (const d of (listRes.documents || [])) {
        const id = d.name.split('/').pop();
        const name = d.fields?.name?.stringValue;
        if (!name) continue;
        let modified = false;
        const newFields = {};
        const masks = [];

        ['gallery', 'teachingGallery', 'videoCalls'].forEach(sec => {
            if (d.fields?.[sec]?.arrayValue?.values) {
                const vals = d.fields[sec].arrayValue.values.map(v => {
                    let u = v.mapValue?.fields?.url?.stringValue || v.stringValue;
                    if (u && (u.includes('companions/shared/') || u.includes('EU5QzmxZbywKzaBR42cL/'))) {
                        u = u.replace(/media\/companions\/shared\//g, `media/odRSfSMD1ZaoglEFBkeIKhLCusZ2/Bạn Đồng Hành/${name}/`);
                        u = u.replace(/media\/Bạn Đồng Hành\/EU5QzmxZbywKzaBR42cL\//g, `media/odRSfSMD1ZaoglEFBkeIKhLCusZ2/Bạn Đồng Hành/${name}/`);
                        modified = true;
                        if (v.mapValue?.fields?.url) v.mapValue.fields.url.stringValue = u;
                        else v.stringValue = u;
                    }
                    return v;
                });
                if (modified) {
                    newFields[sec] = { arrayValue: { values: vals } };
                    masks.push(sec);
                }
            }
        });

        if (modified) {
            await patchDoc(`partners/${id}`, newFields, masks);
            console.log(`✓ Đã cập nhật URLs cho ${name} (${masks.join(', ')})`);
        }
    }
}

async function main() {
    await fixProfile();
    await fixPartners();
    console.log('🎉 Hoàn tất cập nhật URLs trong Cloud Firestore!');
}

main().catch(console.error);
