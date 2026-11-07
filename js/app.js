/**
 * ULASH MARKET - Asosiy Dastur Boshqaruvchisi (Main App Controller)
 * Marshrutlash (Routing), Rollar, Autentifikatsiya va Buyurtma Holatini Kuzatish
 */

const UlashApp = {
    currentPage: 'home',
    highlightOrderId: null,

    init() {
        this.setupNavigation();
        this.setupKeyboardShortcuts();
        this.setupSubscriptions();
        this.updateHeaderUserInfo();

        // Dastlabki sahifani yuklash (hash bo'yicha yoki home)
        const initialHash = window.location.hash.replace('#', '') || 'home';
        this.navigateTo(initialHash);
    },

    setupSubscriptions() {
        window.ulashStore.subscribe('USER_CHANGED', () => {
            this.updateHeaderUserInfo();
            this.updateFloatingRoleBadge();
        });

        window.ulashStore.subscribe('ORDER_STATUS_CHANGED', (payload) => {
            if (this.currentPage === 'orders') {
                this.renderOrdersPage();
            }
        });
    },

    setupNavigation() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '') || 'home';
            this.navigateTo(hash, null, false);
        });
    },

    setupKeyboardShortcuts() {
        // Direktor (Admin) maxfiy klavish kombinatsiyasi: Ctrl + Shift + A
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                this.openAdminAuthModal();
            }
        });
    },

    navigateTo(pageName, params = null, updateHash = true) {
        this.currentPage = pageName;
        if (params && params.highlightOrderId) {
            this.highlightOrderId = params.highlightOrderId;
        }

        if (updateHash) {
            window.location.hash = pageName;
        }

        // Barcha sahifa bo'limlarini yashirish
        const sections = [
            'home-page-container',
            'catalog-page-container',
            'checkout-page-container',
            'orders-page-container',
            'branches-page-container',
            'courier-panel-container',
            'admin-panel-container',
            'profile-page-container'
        ];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Tanlangan sahifani ko'rsatish va initsializatsiya
        if (pageName === 'home') {
            const el = document.getElementById('home-page-container');
            if (el) el.classList.remove('hidden');
            window.ulashCatalog.renderProducts();
        } else if (pageName === 'catalog') {
            const el = document.getElementById('catalog-page-container');
            if (el) el.classList.remove('hidden');
            window.ulashCatalog.renderProducts();
        } else if (pageName === 'checkout') {
            const el = document.getElementById('checkout-page-container');
            if (el) el.classList.remove('hidden');
            window.ulashCheckout.init();
        } else if (pageName === 'orders') {
            const el = document.getElementById('orders-page-container');
            if (el) el.classList.remove('hidden');
            this.renderOrdersPage();
        } else if (pageName === 'branches') {
            const el = document.getElementById('branches-page-container');
            if (el) el.classList.remove('hidden');
            this.renderBranchesPage();
        } else if (pageName === 'courier') {
            const el = document.getElementById('courier-panel-container');
            if (el) el.classList.remove('hidden');
            window.ulashCourier.init();
        } else if (pageName === 'admin' || pageName === 'admin-secret') {
            const currentUser = window.ulashStore.getCurrentUser();
            if (!currentUser || currentUser.role !== 'admin') {
                this.openAdminAuthModal();
            } else {
                const el = document.getElementById('admin-panel-container');
                if (el) el.classList.remove('hidden');
                window.ulashAdmin.renderAdminPanel();
            }
        } else if (pageName === 'profile') {
            const el = document.getElementById('profile-page-container');
            if (el) el.classList.remove('hidden');
            this.renderProfilePage();
        }

        // Sahifa yuqorisiga o'tish
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.updateActiveNavLinks(pageName);
    },

    updateActiveNavLinks(pageName) {
        document.querySelectorAll('.nav-link-btn').forEach(link => {
            if (link.dataset.page === pageName) {
                link.classList.add('text-blue-600', 'font-bold');
                link.classList.remove('text-slate-600');
            } else {
                link.classList.remove('text-blue-600', 'font-bold');
                link.classList.add('text-slate-600');
            }
        });
    },

    updateHeaderUserInfo() {
        const user = window.ulashStore.getCurrentUser() || {};
        const userNameEl = document.getElementById('header-user-name');
        const userRoleBadge = document.getElementById('header-user-role');

        if (userNameEl) {
            userNameEl.textContent = user.name || 'Kirish';
        }

        if (userRoleBadge) {
            if (user.role === 'admin') {
                userRoleBadge.textContent = 'Direktor';
                userRoleBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800';
            } else if (user.role === 'courier') {
                userRoleBadge.textContent = 'Kuryer';
                userRoleBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800';
            } else {
                userRoleBadge.textContent = 'Mijoz';
                userRoleBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800';
            }
        }

        this.updateFloatingRoleBadge();
    },

    updateFloatingRoleBadge() {
        const user = window.ulashStore.getCurrentUser() || {};
        const floatingPill = document.getElementById('quick-role-switcher');
        if (!floatingPill) return;

        const roleText = user.role === 'admin' ? '👑 Direktor' : user.role === 'courier' ? '🛵 Kuryer' : '👤 Foydalanuvchi';
        const roleColor = user.role === 'admin' ? 'border-amber-400 bg-amber-50 text-amber-900' : user.role === 'courier' ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-blue-400 bg-blue-50 text-blue-900';
        
        floatingPill.className = `fixed bottom-20 md:bottom-5 left-5 z-40 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border-2 flex items-center gap-2.5 transition-all ${roleColor}`;
        floatingPill.innerHTML = `
            <div class="text-xs font-bold">${roleText}</div>
            <div class="h-3 w-px bg-slate-300"></div>
            <button onclick="UlashApp.openRoleSelectorModal()" class="text-[11px] underline font-semibold hover:opacity-80">
                Rolni o‘zgartirish ⇄
            </button>
        `;
    },

    // --- Foydalanuvchi & Kuryer Login Modali ---
    openAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    },

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    handleLoginSubmit(e) {
        e.preventDefault();
        const phoneOrEmail = document.getElementById('login-account').value.trim();
        const password = document.getElementById('login-password').value;
        const role = document.querySelector('input[name="login-role"]:checked').value;

        if (!phoneOrEmail) {
            alert("Iltimos, telefon raqamingiz yoki emailingizni kiriting!");
            return;
        }

        const res = window.ulashStore.loginUser(phoneOrEmail, password, role);
        if (res.success) {
            this.closeAuthModal();
            window.ulashCatalog.showToast(`Xush kelibsiz, ${res.user.name}!`);

            if (role === 'courier') {
                this.navigateTo('courier');
            } else {
                this.navigateTo('home');
            }
        }
    },

    // --- Maxfiy Direktor (Admin) Kirish Modali ---
    openAdminAuthModal() {
        const modal = document.getElementById('admin-secret-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            const pinInput = document.getElementById('admin-secret-pin');
            if (pinInput) {
                pinInput.value = '';
                pinInput.focus();
            }
        }
    },

    closeAdminAuthModal() {
        const modal = document.getElementById('admin-secret-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    handleAdminSecretSubmit(e) {
        e.preventDefault();
        const pinInput = document.getElementById('admin-secret-pin');
        const pin = pinInput ? pinInput.value.trim() : '';

        const res = window.ulashStore.verifyAdminSecret(pin);
        if (res.success) {
            this.closeAdminAuthModal();
            window.ulashCatalog.showToast("Direktor boshqaruv tizimi ochildi! 👑");
            this.navigateTo('admin');
        } else {
            alert(res.message || "Noto'g'ri maxfiy parol! (Standart parol: admin123)");
        }
    },

    exitAdminMode() {
        window.ulashStore.setCurrentUser({
            id: 'usr-1',
            name: 'Anvar Qosimov',
            phone: '+998 90 555-11-22',
            role: 'user',
            defaultAddress: "Chilonzor 7-mavze, 12-uy, 45-xonadon",
            district: 'Chilonzor'
        });
        window.ulashCatalog.showToast("Direktor rejimidan chiqildi. Mijoz profiliga o‘tildi.");
        this.navigateTo('home');
    },

    // Sinov uchun 1-bosishda rollar almashtirish
    openRoleSelectorModal() {
        const modal = document.createElement('div');
        modal.id = 'role-picker-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';

        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
                <div class="w-12 h-12 mx-auto mb-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    👥
                </div>
                <h3 class="text-base font-bold text-slate-800 mb-1">Sinov uchun rolni tanlang</h3>
                <p class="text-xs text-slate-400 mb-5">Bir bosishda istalgan rolda sinab ko‘ring</p>

                <div class="space-y-2.5 text-xs font-bold">
                    <button onclick="UlashApp.switchRoleDirect('user')" class="w-full p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 flex items-center justify-between transition">
                        <span class="flex items-center gap-2"><span>👤</span> Foydalanuvchi (Mijoz)</span>
                        <span>→</span>
                    </button>

                    <button onclick="UlashApp.switchRoleDirect('courier')" class="w-full p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-between transition">
                        <span class="flex items-center gap-2"><span>🛵</span> Kuryer Paneli</span>
                        <span>→</span>
                    </button>

                    <button onclick="UlashApp.switchRoleDirect('admin')" class="w-full p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center justify-between transition">
                        <span class="flex items-center gap-2"><span>👑</span> Bosh Direktor (Admin)</span>
                        <span>→</span>
                    </button>
                </div>

                <button onclick="document.getElementById('role-picker-modal').remove()" class="w-full mt-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600">
                    Bekor qilish
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    },

    switchRoleDirect(targetRole) {
        const pickerModal = document.getElementById('role-picker-modal');
        if (pickerModal) pickerModal.remove();

        if (targetRole === 'admin') {
            window.ulashStore.verifyAdminSecret('admin123');
            this.navigateTo('admin');
        } else if (targetRole === 'courier') {
            const couriers = window.ulashStore.getCouriers();
            window.ulashStore.setCurrentUser({
                ...couriers[0],
                role: 'courier'
            });
            window.ulashCatalog.showToast("Kuryer Sardor Aliyev rejimi faollashtirildi! 🛵");
            this.navigateTo('courier');
        } else {
            const users = window.ulashStore.getUsers();
            window.ulashStore.setCurrentUser({
                ...users[0],
                role: 'user'
            });
            window.ulashCatalog.showToast("Mijoz Anvar Qosimov rejimi faollashtirildi! 👤");
            this.navigateTo('home');
        }
    },

    // --- 3. Buyurtmalar Tarixi & Real-Time Kuzatish Sahifasi ---
    renderOrdersPage() {
        const container = document.getElementById('orders-page-container');
        if (!container) return;

        const allOrders = window.ulashStore.getOrders();
        const currentUser = window.ulashStore.getCurrentUser();

        container.innerHTML = `
            <div class="max-w-5xl mx-auto px-4 py-8">
                <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">Mening Buyurtmalarim</h1>
                        <p class="text-xs md:text-sm text-slate-500 mt-1">Buyurtmalaringiz holatini onlayn kuzatib boring</p>
                    </div>
                    <button onclick="UlashApp.navigateTo('catalog')" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition">
                        + Yangi xarid qilish
                    </button>
                </div>

                ${allOrders.length === 0 ? `
                    <div class="bg-white rounded-3xl p-12 text-center border border-slate-200">
                        <div class="w-20 h-20 mx-auto mb-4 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl">
                            📋
                        </div>
                        <h3 class="text-lg font-bold text-slate-800 mb-2">Sizda hali buyurtmalar yo‘q</h3>
                        <p class="text-xs text-slate-500 max-w-sm mx-auto mb-6">Ulash Market orqali kerakli mahsulotlarga buyurtma bering!</p>
                        <button onclick="UlashApp.navigateTo('catalog')" class="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl">
                            Katalogni ko‘rish
                        </button>
                    </div>
                ` : `
                    <div class="space-y-8">
                        ${allOrders.map(order => this.renderSingleOrderCard(order)).join('')}
                    </div>
                `}
            </div>
        `;

        // Agar xarita mavjud bo'lsa uni yuklaymiz
        setTimeout(() => {
            allOrders.forEach(o => {
                const mapEl = document.getElementById(`tracking-map-${o.id}`);
                if (mapEl) {
                    const branch = window.ulashStore.getBranches().find(b => b.id === o.branchId) || window.ulashStore.getBranches()[0];
                    window.ulashMap.initOrderTrackingMap(
                        `tracking-map-${o.id}`,
                        branch.lat,
                        branch.lng,
                        o.customer.lat || 41.2800,
                        o.customer.lng || 69.2200,
                        null,
                        null,
                        o.status
                    );
                }
            });
        }, 200);
    },

    renderSingleOrderCard(order) {
        const isHighlighted = this.highlightOrderId === order.id;

        // 5 Bosqichli Tracker holati
        const steps = [
            { id: 1, key: 'Yangi buyurtma', label: 'Buyurtma berildi', icon: '📝' },
            { id: 2, key: 'Kuryer qabul qildi', label: 'Kuryer qabul qildi', icon: '📦' },
            { id: 3, key: 'Yo‘lda', label: 'Kuryer yo‘lda', icon: '🛵' },
            { id: 4, key: 'Yetkazib berildi', label: 'Yetkazib berildi', icon: '✅' }
        ];

        const isCancelled = order.status === 'Bekor qilindi';
        const currentStepIndex = steps.findIndex(s => s.key === order.status);

        return `
            <div class="bg-white rounded-3xl border ${isHighlighted ? 'border-2 border-blue-600 ring-4 ring-blue-50' : 'border-slate-200'} p-6 shadow-sm overflow-hidden">
                <!-- Sarlavha -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-base font-black text-blue-600">Buyurtma #${order.id}</span>
                            <span class="text-xs text-slate-400">• ${UlashStore.formatDate(order.createdAt)}</span>
                        </div>
                        <div class="text-xs text-slate-600 mt-0.5">
                            Tayyorlanadigan filial: <b class="text-slate-800">${order.branchName || 'Chilonzor Filiali'}</b>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-full text-xs font-bold ${this.getOrderBadgeStyle(order.status)}">
                            ${order.status}
                        </span>
                    </div>
                </div>

                <!-- Real-time Tracker Stepper -->
                <div class="py-6">
                    ${isCancelled ? `
                        <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3">
                            <span class="text-2xl">⚠️</span>
                            <div>
                                <div>Ushbu buyurtma bekor qilingan.</div>
                                <div class="font-normal text-rose-600 text-[11px] mt-0.5">${order.statusHistory[order.statusHistory.length - 1]?.note || 'Bekor qilindi'}</div>
                            </div>
                        </div>
                    ` : `
                        <div class="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                            <!-- Bog'lovchi chiziq -->
                            <div class="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
                                <div class="bg-blue-600 h-full transition-all duration-500" style="width: ${(currentStepIndex / (steps.length - 1)) * 100}%"></div>
                            </div>

                            ${steps.map((st, idx) => {
                                const isPassed = currentStepIndex >= idx;
                                const isCurrent = currentStepIndex === idx;

                                return `
                                    <div class="relative z-10 flex flex-col items-center">
                                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isCurrent ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100 scale-110' : isPassed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}">
                                            <span>${isPassed && !isCurrent ? '✓' : st.icon}</span>
                                        </div>
                                        <span class="text-[11px] font-semibold mt-2 text-center max-w-[80px] ${isCurrent ? 'text-blue-600 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'}">
                                            ${st.label}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>

                <!-- Kuryer ma'lumotlari (agar biriktirilgan bo'lsa) -->
                ${order.courierName ? `
                    <div class="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                                🛵
                            </div>
                            <div>
                                <div class="font-bold text-slate-800 text-sm">${order.courierName}</div>
                                <div class="text-slate-500">Kuryer buyurtmangizni yetkazib bermoqda</div>
                            </div>
                        </div>

                        <a href="tel:${order.courierPhone}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow flex items-center gap-2">
                            <span>📞</span>
                            <span>Kuryerga qo‘ng‘iroq (${order.courierPhone})</span>
                        </a>
                    </div>
                ` : ''}

                <!-- Xarita orqali yetkazish vizualizatsiyasi -->
                ${order.status === 'Yo‘lda' || order.status === 'Kuryer qabul qildi' ? `
                    <div class="mb-4">
                        <div class="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <span>🗺️</span> Real-vaqt xaritasi:
                        </div>
                        <div id="tracking-map-${order.id}" class="w-full h-48 rounded-2xl border border-slate-200 overflow-hidden shadow-inner"></div>
                    </div>
                ` : ''}

                <!-- Mahsulotlar ro'yxati -->
                <div class="border-t border-slate-100 pt-3">
                    <div class="space-y-2">
                        ${order.items.map(item => `
                            <div class="flex items-center justify-between text-xs py-1">
                                <div class="flex items-center gap-3">
                                    <img src="${item.image}" class="w-10 h-10 rounded-lg object-cover bg-slate-50 border">
                                    <div>
                                        <div class="font-semibold text-slate-800">${item.name}</div>
                                        <div class="text-slate-400 text-[11px]">${item.quantity} dona x ${UlashStore.formatPrice(item.price)}</div>
                                    </div>
                                </div>
                                <span class="font-bold text-slate-800">${UlashStore.formatPrice(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <!-- To'lov va summa -->
                    <div class="pt-3 border-t border-slate-100 mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                        <div>
                            <span class="text-slate-500">To‘lov turi: <b class="text-slate-800">${order.paymentMethod}</b></span>
                            <span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentStatus === 'To‘langan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                ${order.paymentStatus}
                            </span>
                        </div>

                        <div class="text-sm font-black text-slate-900">
                            Jami to‘lov: <span class="text-blue-600 font-extrabold text-base">${UlashStore.formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getOrderBadgeStyle(status) {
        const styles = {
            'Yangi buyurtma': 'bg-amber-100 text-amber-800 border border-amber-200',
            'Kuryer qabul qildi': 'bg-blue-100 text-blue-800 border border-blue-200',
            'Yo‘lda': 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse',
            'Yetkazib berildi': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
            'Bekor qilindi': 'bg-rose-100 text-rose-800 border border-rose-200'
        };
        return styles[status] || 'bg-slate-100 text-slate-700';
    },

    // --- 4. Filiallar & Xarita Sahifasi ---
    renderBranchesPage() {
        const container = document.getElementById('branches-page-container');
        if (!container) return;

        const branches = window.ulashStore.getBranches();

        container.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 py-8">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">Ulash Market Filiallari va Xaritasi</h1>
                    <p class="text-xs md:text-sm text-slate-500 mt-1">Toshkent bo‘ylab barcha zamonaviy savdo va yetkazib berish markazlarimiz</p>
                </div>

                <!-- Xarita -->
                <div class="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8">
                    <div id="branches-main-map" class="w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-inner"></div>
                </div>

                <!-- Filiallar Kartalari -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    ${branches.map(b => `
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                                    <span class="text-xs font-bold text-emerald-600">Ochiq: ${b.workingHours}</span>
                                </div>
                                <h3 class="font-bold text-slate-800 text-base mb-1.5">${b.name}</h3>
                                <p class="text-xs text-slate-500 leading-relaxed mb-3">${b.address}</p>
                            </div>

                            <div class="pt-3 border-t border-slate-100 mt-2 space-y-1.5 text-xs">
                                <div class="flex items-center justify-between text-slate-600">
                                    <span>Telefon:</span>
                                    <a href="tel:${b.phone}" class="text-blue-600 font-bold hover:underline">${b.phone}</a>
                                </div>
                                <div class="flex items-center justify-between text-slate-600">
                                    <span>Mudir:</span>
                                    <span class="font-medium text-slate-800">${b.manager}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        setTimeout(() => {
            window.ulashMap.initBranchesMap('branches-main-map');
        }, 150);
    },

    // --- 5. Profil Sahifasi ---
    renderProfilePage() {
        const container = document.getElementById('profile-page-container');
        if (!container) return;

        const user = window.ulashStore.getCurrentUser() || {};
        const orders = window.ulashStore.getOrders();
        const myOrders = orders.filter(o => o.customer.phone === user.phone || user.role === 'admin');

        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm mb-6">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div class="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-200">
                            ${user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div class="flex-1 text-center sm:text-left">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h2 class="text-xl md:text-2xl font-bold text-slate-900">${user.name}</h2>
                                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold w-fit mx-auto sm:mx-0 ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : user.role === 'courier' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
                                    ${user.role === 'admin' ? '👑 Bosh Direktor' : user.role === 'courier' ? '🛵 Kuryer' : '👤 Mijoz'}
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">${user.phone} ${user.email ? '• ' + user.email : ''}</p>
                            <p class="text-xs text-slate-600 mt-2">Asosiy manzil: <b>${user.defaultAddress || 'Toshkent shahri'}</b></p>
                        </div>

                        <button onclick="UlashApp.openRoleSelectorModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                            Rolni almashtirish ⇄
                        </button>
                    </div>
                </div>

                <!-- Tezkor amallar -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div onclick="UlashApp.navigateTo('orders')" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 cursor-pointer transition">
                        <div class="text-2xl mb-2">📦</div>
                        <h4 class="font-bold text-slate-800 text-sm">Buyurtmalar tarixi</h4>
                        <p class="text-xs text-slate-500 mt-1">${myOrders.length} ta buyurtma mavjud</p>
                    </div>

                    <div onclick="UlashApp.navigateTo('branches')" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 cursor-pointer transition">
                        <div class="text-2xl mb-2">🏬</div>
                        <h4 class="font-bold text-slate-800 text-sm">Bizning filiallar</h4>
                        <p class="text-xs text-slate-500 mt-1">Xarita va aloqa raqamlari</p>
                    </div>

                    <div onclick="window.ulashCatalog.openCartModal()" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 cursor-pointer transition">
                        <div class="text-2xl mb-2">🛒</div>
                        <h4 class="font-bold text-slate-800 text-sm">Mening savatcham</h4>
                        <p class="text-xs text-slate-500 mt-1">Xaridlarni ko‘rish</p>
                    </div>
                </div>
            </div>
        `;
    }
};

window.ulashApp = UlashApp;
