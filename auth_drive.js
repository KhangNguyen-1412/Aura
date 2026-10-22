/**
 * AURA GOOGLE DRIVE OAUTH 2.0 AUTHORIZATION HELPER
 * 
 * Script 1-Click tự động lấy Refresh Token và lưu vĩnh viễn:
 * 1. Mở trình duyệt để bạn đăng nhập Google và bấm "Cho phép"
 * 2. Lắng nghe callback trên cổng 3000 và nhận Refresh Token
 * 3. Lưu vào drive-oauth.json và kiểm tra thư mục Aura Media (1Mz1kzYEAfx4oO1pKrj7hxZPOajS_QzHt)
 * 
 * Chạy lệnh: node auth_drive.js
 */

const http = require('http');
const { exec } = require('child_process');
const driveEngine = require('./drive-engine');

const PORT = 3000;

async function main() {
    console.log('\n========================================================================');
    console.log('🔐 AURA MEDIA - XÁC THỰC GOOGLE DRIVE OAUTH 2.0');
    console.log('========================================================================\n');

    try {
        const authUrl = driveEngine.getAuthUrl();
        console.log('👉 Đang khởi chạy máy chủ tiếp nhận ủy quyền trên cổng 3000...');

        const server = http.createServer(async (req, res) => {
            const parsed = new URL(req.url, `http://localhost:${PORT}`);
            if (parsed.pathname === '/api/drive/oauth2callback') {
                const code = parsed.searchParams.get('code');
                const err = parsed.searchParams.get('error');

                if (err) {
                    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<h2 style="color:red;font-family:sans-serif">❌ Lỗi ủy quyền: ${err}</h2><p>Vui lòng thử lại.</p>`);
                    console.error('❌ Lỗi từ Google:', err);
                    server.close();
                    process.exit(1);
                    return;
                }

                if (!code) {
                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Thiếu mã code.');
                    return;
                }

                try {
                    console.log('⏳ Đang tiếp nhận mã và đổi Refresh Token từ Google...');
                    const result = await driveEngine.handleOAuthCallback(code);
                    
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <div style="font-family:sans-serif;max-width:550px;margin:50px auto;padding:30px;border-radius:16px;background:#f0fdf4;border:1px solid #86efac;text-align:center;">
                            <h2 style="color:#15803d;margin-top:0;">🎉 KẾT NỐI GOOGLE DRIVE THÀNH CÔNG!</h2>
                            <p style="color:#166534;font-size:15px;line-height:1.6;">
                                Tài khoản: <b>${result.account?.email || 'Chính chủ'}</b><br>
                                Thư mục đích: <b>Aura Media (1Mz1kzYEAfx4oO1pKrj7hxZPOajS_QzHt)</b>
                            </p>
                            <p style="color:#4b5563;font-size:13px;margin-top:20px;">
                                Refresh Token đã được lưu an toàn. Bạn có thể đóng tab này và quay lại terminal/dashboard!
                            </p>
                        </div>
                    `);

                    console.log('\n========================================================================');
                    console.log('🎉 XÁC THỰC THÀNH CÔNG!');
                    console.log(`- Tài khoản: ${result.account?.email || 'N/A'}`);
                    console.log(`- Dung lượng đã dùng: ${(result.account?.quotaUsed / 1e9).toFixed(2)} GB`);
                    console.log(`- Thư mục gốc: Aura Media [${driveEngine.config.rootFolderId}]`);
                    console.log('✓ Token đã được lưu vĩnh viễn vào: drive-oauth.json');
                    console.log('========================================================================\n');

                    setTimeout(() => {
                        server.close();
                        process.exit(0);
                    }, 1000);
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<h2 style="color:red">Lỗi đổi token: ${e.message}</h2>`);
                    console.error('❌ Lỗi đổi token:', e.message);
                    server.close();
                    process.exit(1);
                }
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        server.listen(PORT, () => {
            console.log(`✓ Máy chủ callback đang lắng nghe tại: http://localhost:${PORT}/api/drive/oauth2callback\n`);
            console.log('🌐 Đang mở trình duyệt để bạn đăng nhập Google...');
            console.log('🔗 Nếu trình duyệt không tự mở, hãy copy đường link sau dán vào trình duyệt:\n');
            console.log(authUrl);
            console.log('\n------------------------------------------------------------------------');

            // Tự động mở trình duyệt trên Windows
            const openCommand = process.platform === 'win32' ? `start "" "${authUrl}"` : (process.platform === 'darwin' ? `open "${authUrl}"` : `xdg-open "${authUrl}"`);
            exec(openCommand, (e) => {
                if (e) console.log('(Không thể tự bật trình duyệt, vui lòng copy link trên)');
            });
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`\n❌ Cổng ${PORT} đang bận! Có thể bạn đang chạy 'node server.js' ở một cửa sổ khác.`);
                console.log(`👉 Nếu server đang chạy, bạn chỉ cần mở Dashboard (http://localhost:${PORT}/dashboard.html) và bấm "Ủy Quyền Google Drive"!`);
            } else {
                console.error('Lỗi server:', err);
            }
            process.exit(1);
        });

    } catch (err) {
        console.error('❌ Lỗi:', err.message);
        process.exit(1);
    }
}

main();
