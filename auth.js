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
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
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

// Khởi tạo Firebase App an toàn với bộ nhớ đệm Offline IndexedDB tức thì (<10ms)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = (() => {
    try {
        return initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            }),
            experimentalAutoDetectLongPolling: true
        });
    } catch (_) {
        return getFirestore(app);
    }
})();

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
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
            return { success: false, cancelled: true };
        }
        console.error("[Aura Auth] Lỗi đăng nhập Google:", error);
        return { success: false, error: error.message, code: error.code };
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
/**
 * Helper: Lấy thông tin user đã lưu trong localStorage (đồng bộ, tức thì)
 */
function getCachedUser() {
    try {
        const raw = localStorage.getItem('aura_user_info');
        if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
}

/**
 * Render góc tài khoản khi đã đăng nhập (Đồng bộ, không giật layout)
 */
function renderLoggedInCornerHTML(user) {
    const defaultAvatarSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E1'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    const avatar = (user && user.photoURL) || defaultAvatarSvg;
    const name = (user && (user.displayName || user.email)) || 'Hồ sơ';
    return `
        <div class="flex items-center space-x-3">
            <a href="dashboard.html" 
               onclick="try{localStorage.setItem('aura_active_module','module1');}catch(e){}"
               class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:opacity-95 cursor-pointer"
               style="background-color: #007BA7 !important; color: #FFFFFF !important; box-shadow: 0 4px 14px rgba(0, 123, 167, 0.4) !important;">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span style="color: #FFFFFF !important;">Đi tới Bảng Điều Khiển</span>
            </a>
            
            <div class="flex items-center space-x-2 pl-2 border-l border-[#D1CCC5]">
                <a href="ca-nhan.html" class="flex items-center space-x-2 group cursor-pointer hover:opacity-90" title="Bấm vào Avatar để Cập nhật Hồ Sơ Cá Nhân & Chỉ Số Cơ Thể">
                    <img src="${avatar}" 
                         alt="${name}" 
                         class="w-9 h-9 rounded-full object-cover border-2 border-[#007BA7] group-hover:border-[#D73B3E] shadow-xs transition-colors" 
                         title="Xem hồ sơ cá nhân của bạn">
                    <span class="text-xs font-bold text-[#1A1A1A] group-hover:text-[#007BA7] hidden md:inline max-w-[110px] truncate">${name}</span>
                </a>
                <button type="button" id="btn-header-logout" class="text-xs text-[#D73B3E] hover:underline font-bold cursor-pointer px-1 py-0.5 ml-1" title="Đăng xuất tài khoản">
                    Đăng xuất
                </button>
            </div>
        </div>
    `;
}

/**
 * Render góc tài khoản khi là khách chưa đăng nhập (Đồng bộ, không giật layout)
 */
function renderLoggedOutCornerHTML() {
    return `
        <button type="button" id="btn-header-login-google" 
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#007BA7] bg-white hover:bg-[#007BA7]/5 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:opacity-95 cursor-pointer"
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
}

function bindAuthCornerEvents() {
    const logoutBtn = document.getElementById('btn-header-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await logoutUser();
            window.location.reload();
        };
    }
    const loginBtn = document.getElementById('btn-header-login-google');
    if (loginBtn) {
        loginBtn.onclick = async () => {
            const res = await loginWithGoogle();
            if (res.success) {
                window.location.reload();
            } else if (!res.cancelled) {
                alert("Không thể đăng nhập: " + res.error);
            }
        };
    }
}

/**
 * Khởi tạo style hiệu ứng chuyển đổi mượt mà nếu chưa tồn tại
 */
function ensureTransitionStyles() {
    if (document.getElementById('aura-header-transition-styles')) return;
    const style = document.createElement('style');
    style.id = 'aura-header-transition-styles';
    style.textContent = `
        /* Hỗ trợ Native View Transitions cho trình duyệt hiện đại (Chrome/Edge 126+) */
        @view-transition {
            navigation: auto;
        }
        #aura-global-header {
            view-transition-name: aura-global-header;
        }
        ::view-transition-old(root) {
            animation: auraFadeOut 0.22s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        ::view-transition-new(root) {
            animation: auraFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes auraFadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes auraFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Hiệu ứng trang chuyển vào mượt mà */
        main {
            animation: auraPageEnter 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes auraPageEnter {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Hiệu ứng trang lướt ra khi bấm chuyển trang */
        body.aura-page-exiting main {
            opacity: 0 !important;
            transform: translateY(-8px) !important;
            transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1), transform 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Khung chứa các nút điều hướng Header */
        .aura-nav-container {
            position: relative;
            display: inline-flex;
            align-items: center;
            background-color: rgba(239, 236, 228, 0.7);
            border: 1px solid rgba(209, 204, 197, 0.85);
            border-radius: 9999px;
            padding: 3px;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        /* Con trỏ trượt mượt mà (Sliding Active Indicator) */
        .aura-nav-indicator {
            position: absolute;
            background-color: #007BA7;
            border-radius: 9999px;
            box-shadow: 0 2px 10px rgba(0, 123, 167, 0.35);
            transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        width 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.2s ease,
                        transform 0.15s ease;
            pointer-events: none;
            z-index: 1;
        }

        /* Con trỏ bóng mờ khi di chuột (Hover Pill) */
        .aura-nav-hover-pill {
            position: absolute;
            background-color: rgba(0, 123, 167, 0.08);
            border-radius: 9999px;
            transition: left 0.22s cubic-bezier(0.16, 1, 0.3, 1), 
                        width 0.22s cubic-bezier(0.16, 1, 0.3, 1), 
                        height 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.2s ease;
            pointer-events: none;
            z-index: 0;
            opacity: 0;
        }

        /* Từng nút điều hướng */
        .aura-nav-item {
            position: relative;
            z-index: 2;
            transition: color 0.25s ease, transform 0.12s ease;
            user-select: none;
            white-space: nowrap;
        }
        .aura-nav-item.is-active {
            color: #FFFFFF !important;
            font-weight: 800;
        }
        .aura-nav-item:not(.is-active) {
            color: #4A4A4A;
        }
        .aura-nav-item:not(.is-active):hover {
            color: #007BA7;
        }
        .aura-nav-item:active {
            transform: scale(0.96);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Render Header Điều Hướng Chung cho tất cả các trang Giới Thiệu
 * @param {string} activePage - Tên trang hiện tại: 'home' | 'khao-sat' | 'ban-dong-hanh' | 'pt' | 'gioi-thieu'
 */
export function setupEditorialHeader(activePage = 'home') {
    ensureTransitionStyles();

    const navLinks = [
        { id: 'home', label: 'Trang Chủ', href: 'index.html' },
        { id: 'khao-sat', label: 'Khảo Sát & Nam Học', href: 'khao-sat.html' },
        { id: 'ban-dong-hanh', label: 'Bạn Đồng Hành', href: 'ban-dong-hanh.html' },
        { id: 'pt', label: 'Huấn Luyện PT', href: 'huan-luyen-pt.html' },
        { id: 'gioi-thieu', label: 'Về Aura', href: 'gioi-thieu.html' },
    ];

    const headerEl = document.getElementById('aura-global-header');
    if (!headerEl) return;

    // Đảm bảo phần tử luôn cố định (sticky) tuyệt đối ở đỉnh màn hình, không bị cuộn mất
    headerEl.classList.add('sticky', 'top-0', 'z-50', 'w-full', 'bg-[#F9F6F0]/95', 'backdrop-blur-md', 'border-b', 'border-[#D1CCC5]', 'shadow-xs', 'font-newsreader');
    headerEl.style.position = 'sticky';
    headerEl.style.top = '0';
    headerEl.style.zIndex = '100';
    headerEl.style.width = '100%';

    const cachedUser = getCachedUser();
    const initialCornerHTML = cachedUser ? renderLoggedInCornerHTML(cachedUser) : renderLoggedOutCornerHTML();

    headerEl.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <!-- Logo & Brand mang sắc xanh Cerulean & đỏ Jasper kinh điển -->
            <div class="flex items-center space-x-8">
                <a href="index.html" 
                   data-nav-id="home"
                   class="flex flex-col group cursor-pointer"
                   title="Trang Chủ Aura">
                    <span class="font-playfair text-3xl md:text-4xl font-black text-[#007BA7] tracking-tight uppercase group-hover:text-[#005b7a] transition-colors">Aura.</span>
                    <span class="text-[9px] uppercase tracking-[0.25em] text-[#D73B3E] font-mono font-bold -mt-1">Y Học & Sức Khỏe Tối Ưu</span>
                </a>

                <!-- Navigation Items Desktop với hiệu ứng Sliding Pill Indicator -->
                <nav class="aura-desktop-nav hidden lg:flex items-center">
                    <div class="aura-nav-container flex items-center relative">
                        <!-- Floating Hover Pill -->
                        <div id="aura-nav-hover-pill" class="aura-nav-hover-pill"></div>
                        <!-- Solid Active Indicator Pill -->
                        <div id="aura-nav-active-pill" class="aura-nav-indicator" style="opacity: 0;"></div>

                        ${navLinks.map(link => {
                            const isActive = link.id === activePage;
                            return `
                                <a href="${link.href}" 
                                   data-nav-id="${link.id}"
                                   class="aura-nav-item px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-full ${isActive ? 'is-active cursor-default' : 'cursor-pointer'}">
                                    ${link.label}
                                </a>
                            `;
                        }).join('')}
                    </div>
                </nav>
            </div>

            <!-- Auth Action Corner (Được render đồng bộ ngay từ frame đầu tiên, triệt tiêu giật layout) -->
            <div id="header-auth-corner" class="flex items-center space-x-3">
                ${initialCornerHTML}
            </div>
        </div>

        <!-- Mobile Nav Sub-bar (CSS thuần ẩn ngay trên desktop, hỗ trợ trượt mượt mà) -->
        <div class="aura-mobile-subbar lg:hidden border-t border-[#D1CCC5] bg-[#F9F6F0] overflow-x-auto py-2.5 px-4 flex items-center space-x-2 scrollbar-none">
            ${navLinks.map(link => {
                const isActive = link.id === activePage;
                return `
                    <a href="${link.href}" 
                       data-nav-id="${link.id}"
                       class="aura-mobile-nav-item px-3.5 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap font-bold transition-all rounded-full ${
                           isActive 
                           ? 'is-active-mobile text-white bg-[#007BA7] shadow-xs cursor-default' 
                           : 'text-[#4A4A4A] hover:text-[#007BA7] bg-white border border-[#D1CCC5] cursor-pointer'
                       }"
                       style="${isActive ? 'background-color: #007BA7 !important; color: #FFFFFF !important;' : ''}">
                        ${link.label}
                    </a>
                `;
            }).join('')}
        </div>
    `;

    // =========================================================================
    // XỬ LÝ HIỆU ỨNG TRƯỢT MƯỢT MÀ CHO DESKTOP NAV PILL
    // =========================================================================
    const navContainer = headerEl.querySelector('.aura-nav-container');
    const activePill = document.getElementById('aura-nav-active-pill');
    const hoverPill = document.getElementById('aura-nav-hover-pill');
    const desktopItems = headerEl.querySelectorAll('.aura-nav-item');
    const activeItem = headerEl.querySelector(`.aura-nav-item[data-nav-id="${activePage}"]`);

    function updatePillPosition(item, animate = false) {
        if (!item || !activePill || !navContainer) return;
        const parentRect = navContainer.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const left = itemRect.left - parentRect.left;
        const top = itemRect.top - parentRect.top;
        const width = itemRect.width;
        const height = itemRect.height;

        if (!animate) {
            activePill.style.transition = 'none';
        } else {
            activePill.style.transition = 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
        }

        activePill.style.left = `${left}px`;
        activePill.style.top = `${top}px`;
        activePill.style.width = `${width}px`;
        activePill.style.height = `${height}px`;
        activePill.style.opacity = '1';

        if (!animate) {
            void activePill.offsetWidth; // flush style
            activePill.style.transition = 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
        }
    }

    // Định vị ban đầu
    if (activeItem) {
        updatePillPosition(activeItem, false);
        requestAnimationFrame(() => updatePillPosition(activeItem, false));
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => updatePillPosition(activeItem, false));
        }
    }

    // Tự động căn lại khi resize màn hình
    window.addEventListener('resize', () => {
        const cur = headerEl.querySelector('.aura-nav-item.is-active');
        if (cur) updatePillPosition(cur, false);
    });

    // Xử lý hover pill
    desktopItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (item.classList.contains('is-active')) {
                if (hoverPill) hoverPill.style.opacity = '0';
                return;
            }
            if (hoverPill && navContainer) {
                const parentRect = navContainer.getBoundingClientRect();
                const itemRect = item.getBoundingClientRect();
                hoverPill.style.left = `${itemRect.left - parentRect.left}px`;
                hoverPill.style.top = `${itemRect.top - parentRect.top}px`;
                hoverPill.style.width = `${itemRect.width}px`;
                hoverPill.style.height = `${itemRect.height}px`;
                hoverPill.style.opacity = '1';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (hoverPill) hoverPill.style.opacity = '0';
        });

        // Xử lý click chuyển trang mượt mà
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            const isCurrent = item.classList.contains('is-active');

            if (isCurrent) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (activePill) {
                    activePill.style.transform = 'scale(0.93)';
                    setTimeout(() => { activePill.style.transform = 'scale(1)'; }, 150);
                }
                return;
            }

            e.preventDefault();

            // 1. Trượt con trỏ active mượt mà sang nút vừa bấm
            desktopItems.forEach(i => i.classList.remove('is-active'));
            item.classList.add('is-active');
            updatePillPosition(item, true);
            if (hoverPill) hoverPill.style.opacity = '0';

            // 2. Kích hoạt hiệu ứng lướt trang ra
            document.body.classList.add('aura-page-exiting');

            // 3. Chuyển trang sau khi kết thúc animation ngắn (160ms)
            setTimeout(() => {
                window.location.href = href;
            }, 160);
        });
    });

    // =========================================================================
    // XỬ LÝ CLICK MƯỢT MÀ CHO MOBILE NAV
    // =========================================================================
    const mobileItems = headerEl.querySelectorAll('.aura-mobile-nav-item');
    mobileItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            const isCurrent = item.classList.contains('is-active-mobile');

            if (isCurrent) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            e.preventDefault();
            mobileItems.forEach(i => {
                i.className = 'aura-mobile-nav-item px-3.5 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap font-bold transition-all rounded-full text-[#4A4A4A] hover:text-[#007BA7] bg-white border border-[#D1CCC5] cursor-pointer';
                i.style = '';
            });
            item.className = 'aura-mobile-nav-item px-3.5 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap font-bold transition-all rounded-full is-active-mobile text-white bg-[#007BA7] shadow-xs cursor-default';
            item.style = 'background-color: #007BA7 !important; color: #FFFFFF !important;';

            document.body.classList.add('aura-page-exiting');
            setTimeout(() => {
                window.location.href = href;
            }, 160);
        });
    });

    // Cuộn mượt đưa nút active vào giữa màn hình trên mobile
    const activeMobile = headerEl.querySelector('.aura-mobile-nav-item.is-active-mobile');
    if (activeMobile) {
        setTimeout(() => {
            activeMobile.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 100);
    }

    // Logo Aura click
    const logoLink = headerEl.querySelector('a[data-nav-id="home"]');
    if (logoLink && activePage === 'home') {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Xóa class exit khi trang được phục hồi từ bfcache
    window.addEventListener('pageshow', () => {
        document.body.classList.remove('aura-page-exiting');
    });

    bindAuthCornerEvents();

    let lastKnownUid = cachedUser ? cachedUser.uid : null;

    // Lắng nghe trạng thái đăng nhập Firebase - chỉ cập nhật DOM khi thực sự có thay đổi trạng thái
    onAuthChange((user) => {
        const corner = document.getElementById('header-auth-corner');
        if (!corner) return;

        const currentUid = user ? user.uid : null;
        if (currentUid === lastKnownUid) {
            bindAuthCornerEvents();
            return;
        }
        lastKnownUid = currentUid;

        if (user) {
            corner.innerHTML = renderLoggedInCornerHTML(user);
        } else {
            corner.innerHTML = renderLoggedOutCornerHTML();
        }
        bindAuthCornerEvents();
    });
}
