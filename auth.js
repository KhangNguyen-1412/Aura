// =========================================================================
// AURA AUTH & MULTI-USER CLOUD SYSTEM (auth.js)
// Quản lý xác thực Google, phân quyền & đồng bộ dữ liệu riêng biệt theo tài khoản
// =========================================================================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Cấu hình Firebase Aura chính thức
export const firebaseConfig = {
    apiKey: "AIzaSyC-BfkoWmpKkXvUwLgIo7dL4zCwcbOcAak",
    authDomain: "aura-47c9e.firebaseapp.com",
    projectId: "aura-47c9e",
    storageBucket: "aura-47c9e.firebasestorage.app",
    messagingSenderId: "425960133786",
    appId: "1:425960133786:web:2134059c058d7256233b23",
    measurementId: "G-9PBMQQ2B2Y"
};

// Khởi tạo Firebase App an toàn
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Đăng nhập tài khoản bằng Google Popup
 */
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Lưu hoặc cập nhật thông tin cá nhân của người dùng vào Firestore
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName || 'Người dùng Aura',
                email: user.email || '',
                photoURL: user.photoURL || '',
                lastLoginAt: serverTimestamp()
            }, { merge: true });
        }
        return { success: true, user };
    } catch (error) {
        console.error("[Aura Auth] Lỗi đăng nhập Google:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Đăng xuất tài khoản
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("[Aura Auth] Lỗi đăng xuất:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Lắng nghe trạng thái đăng nhập
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                localStorage.setItem('aura_user_info', JSON.stringify({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }));
            } catch (_) {}
        } else {
            localStorage.removeItem('aura_user_info');
        }
        callback(user);
    });
}

/**
 * Render Header Điều Hướng Chung cho tất cả các trang Giới Thiệu
 * @param {string} activePage - Tên trang hiện tại: 'home' | 'khao-sat' | 'ban-dong-hanh' | 'pt' | 'gioi-thieu'
 */
export function setupEditorialHeader(activePage = 'home') {
    const navLinks = [
        { id: 'home', label: 'Trang Chủ', href: 'index.html' },
        { id: 'ca-nhan', label: 'Hồ Sơ & Media (18+)', href: 'ca-nhan.html' },
        { id: 'khao-sat', label: 'Khảo Sát & Nam Học', href: 'khao-sat.html' },
        { id: 'ban-dong-hanh', label: 'Bạn Đồng Hành', href: 'ban-dong-hanh.html' },
        { id: 'pt', label: 'Huấn Luyện PT', href: 'huan-luyen-pt.html' },
        { id: 'gioi-thieu', label: 'Về Aura', href: 'gioi-thieu.html' },
    ];

    const headerEl = document.getElementById('aura-global-header');
    if (!headerEl) return;

    headerEl.innerHTML = `
        <header class="sticky top-0 z-50 bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#D1CCC5] shadow-xs font-newsreader">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <!-- Logo & Brand mang sắc xanh Cerulean & đỏ Jasper kinh điển -->
                <div class="flex items-center space-x-8">
                    <a href="index.html" class="flex flex-col group cursor-pointer">
                        <span class="font-playfair text-3xl md:text-4xl font-black text-[#007BA7] tracking-tight uppercase group-hover:text-[#005b7a] transition-colors">Aura.</span>
                        <span class="text-[9px] uppercase tracking-[0.25em] text-[#D73B3E] font-mono font-bold -mt-1">Y Học & Sức Khỏe Tối Ưu</span>
                    </a>

                    <!-- Navigation Items (Từng trang riêng biệt) -->
                    <nav class="hidden lg:flex items-center space-x-2">
                        ${navLinks.map(link => {
                            const isActive = link.id === activePage;
                            return `
                                <a href="${link.href}" 
                                   class="px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded-full ${
                                       isActive 
                                       ? 'text-white bg-[#007BA7] shadow-sm font-extrabold' 
                                       : 'text-[#4A4A4A] hover:text-[#007BA7] hover:bg-[#007BA7]/10'
                                   }"
                                   style="${isActive ? 'background-color: #007BA7 !important; color: #FFFFFF !important;' : ''}">
                                    ${link.label}
                                </a>
                            `;
                        }).join('')}
                    </nav>
                </div>

                <!-- Auth Action Corner -->
                <div id="header-auth-corner" class="flex items-center space-x-3">
                    <div class="h-9 w-28 bg-[#D1CCC5]/40 animate-pulse rounded-full"></div>
                </div>
            </div>

            <!-- Mobile Nav Sub-bar -->
            <div class="lg:hidden border-t border-[#D1CCC5] bg-[#F9F6F0] overflow-x-auto py-2.5 px-4 flex items-center space-x-2 scrollbar-none">
                ${navLinks.map(link => {
                    const isActive = link.id === activePage;
                    return `
                        <a href="${link.href}" 
                           class="px-3.5 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap font-bold transition-all rounded-full ${
                               isActive 
                               ? 'text-white bg-[#007BA7] shadow-xs' 
                               : 'text-[#4A4A4A] hover:text-[#007BA7] bg-white border border-[#D1CCC5]'
                           }"
                           style="${isActive ? 'background-color: #007BA7 !important; color: #FFFFFF !important;' : ''}">
                            ${link.label}
                        </a>
                    `;
                }).join('')}
            </div>
        </header>
    `;

    // Lắng nghe trạng thái đăng nhập để cập nhật góc tài khoản
    onAuthChange((user) => {
        const corner = document.getElementById('header-auth-corner');
        if (!corner) return;

        if (user) {
            corner.innerHTML = `
                <!-- Người dùng đã đăng nhập -->
                <div class="flex items-center space-x-3">
                    <a href="dashboard.html" 
                       class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                       style="background-color: #007BA7 !important; color: #FFFFFF !important; box-shadow: 0 4px 14px rgba(0, 123, 167, 0.4) !important;">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                        <span style="color: #FFFFFF !important;">Đi tới Bảng Điều Khiển</span>
                    </a>
                    
                    <div class="flex items-center space-x-2 pl-2 border-l border-[#D1CCC5]">
                        <a href="ca-nhan.html" class="flex items-center space-x-2 group cursor-pointer hover:opacity-90" title="Bấm vào Avatar để Cập nhật Hồ Sơ Cá Nhân & Chỉ Số Cơ Thể">
                            <img src="${user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}" 
                                 alt="${user.displayName || 'User'}" 
                                 class="w-9 h-9 rounded-full object-cover border-2 border-[#007BA7] group-hover:border-[#D73B3E] shadow-xs transition-all group-hover:scale-105" 
                                 title="Xem hồ sơ cá nhân của bạn">
                            <span class="text-xs font-bold text-[#1A1A1A] group-hover:text-[#007BA7] hidden md:inline max-w-[110px] truncate">${user.displayName || 'Hồ sơ'}</span>
                        </a>
                        <button type="button" id="btn-header-logout" class="text-xs text-[#D73B3E] hover:underline font-bold cursor-pointer px-1 py-0.5 ml-1" title="Đăng xuất tài khoản">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            `;
            const logoutBtn = document.getElementById('btn-header-logout');
            if (logoutBtn) {
                logoutBtn.onclick = async () => {
                    await logoutUser();
                    window.location.reload();
                };
            }
        } else {
            corner.innerHTML = `
                <!-- Khách chưa đăng nhập: Nút Đăng Nhập Google rõ ràng, không bị chìm -->
                <button type="button" id="btn-header-login-google" 
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#007BA7] bg-white hover:bg-[#007BA7]/5 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        style="background-color: #FFFFFF !important; color: #1A1A1A !important; border-color: #007BA7 !important;">
                    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span style="color: #1A1A1A !important;">Đăng Nhập Google</span>
                </button>
            `;
            const loginBtn = document.getElementById('btn-header-login-google');
            if (loginBtn) {
                loginBtn.onclick = async () => {
                    const res = await loginWithGoogle();
                    if (res.success) {
                        window.location.reload();
                    } else {
                        alert("Không thể đăng nhập: " + res.error);
                    }
                };
            }
        }
    });
}
