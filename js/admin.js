/**
 * ULASH MARKET - Direktor (Admin) Boshqaruv Paneli
 * Maxfiy boshqaruv, Mahsulotlar ombori CRUD, Buyurtmalar, Kuryerlar, Filiallar va Sozlamalar
 */

const UlashAdmin = {
    activeTab: 'dashboard', // dashboard, products, orders, couriers, branches, users, settings
    chartInstance: null,

    init() {
        this.setupSubscriptions();
    },

    setupSubscriptions() {
        window.ulashStore.subscribe('ORDERS_UPDATED', () => {
            if (this.isAdminViewActive()) this.renderCurrentTab();
        });
        window.ulashStore.subscribe('PRODUCTS_UPDATED', () => {
            if (this.isAdminViewActive() && (this.activeTab === 'products' || this.activeTab === 'dashboard')) {
                this.renderCurrentTab();
            }
        });
        window.ulashStore.subscribe('BRANCHES_UPDATED', () => {
            if (this.isAdminViewActive() && this.activeTab === 'branches') this.renderCurrentTab();
        });
        window.ulashStore.subscribe('COURIERS_UPDATED', () => {
            if (this.isAdminViewActive() && this.activeTab === 'couriers') this.renderCurrentTab();
        });
    },

    isAdminViewActive() {
        const container = document.getElementById('admin-panel-container');
        return container && !container.classList.contains('hidden');
    },

    setTab(tabName) {
        this.activeTab = tabName;
        this.renderAdminPanel();
    },

    renderAdminPanel() {
        const container = document.getElementById('admin-panel-container');
        if (!container) return;

        const currentUser = window.ulashStore.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            container.innerHTML = `
                <div class="max-w-md mx-auto py-20 px-4 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                        🔒
                    </div>
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Direktor ruxsati talab etiladi</h2>
                    <p class="text-xs text-slate-500 mb-6">Ushbu boshqaruv paneliga faqat maxsus maxfiy parol bilan kirish mumkin.</p>
                    <button onclick="window.ulashApp.openAdminAuthModal()" class="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition">
                        Maxfiy Parolni Kiritish
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="min-h-screen bg-slate-50 flex">
                <!-- 1. Chap Tomon Sidebar -->
                <aside class="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0">
                    <div>
                        <!-- Logo & Admin Badge -->
                        <div class="p-6 border-b border-slate-100">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl font-black tracking-tight text-blue-600">ULASH</span>
                                <span class="text-xs px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    DIREKTOR
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-1 font-medium">Boshqaruv & Analitika Markazi</p>
                        </div>

                        <!-- Sidebar Navigatsiya -->
                        <nav class="p-4 space-y-1 text-xs">
                            <button onclick="UlashAdmin.setTab('dashboard')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'dashboard' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">📊</span>
                                <span class="font-semibold">Dashboard</span>
                            </button>

                            <button onclick="UlashAdmin.setTab('products')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'products' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">📦</span>
                                <span class="font-semibold">Mahsulotlar & Ombor</span>
                            </button>

                            <button onclick="UlashAdmin.setTab('orders')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'orders' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">📋</span>
                                <span class="font-semibold">Barcha Buyurtmalar</span>
                            </button>

                            <button onclick="UlashAdmin.setTab('couriers')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'couriers' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">🛵</span>
                                <span class="font-semibold">Kuryerlar Nazorati</span>
                            </button>

                            <button onclick="UlashAdmin.setTab('branches')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'branches' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">🏬</span>
                                <span class="font-semibold">Filiallar & Xarita</span>
                            </button>

                            <button onclick="UlashAdmin.setTab('users')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'users' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">👥</span>
                                <span class="font-semibold">Mijozlar Bazasi</span>
                            </button>

                            <button onclick="UlashAdmin.setTab('settings')" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${this.activeTab === 'settings' ? 'active' : 'text-slate-600 hover:bg-slate-100'}">
                                <span class="text-base">⚙️</span>
                                <span class="font-semibold">Tizim Sozlamalari</span>
                            </button>
                        </nav>
                    </div>

                    <!-- Pastki Chiqish bloki -->
                    <div class="p-4 border-t border-slate-100">
                        <div class="flex items-center gap-3 mb-3 px-2">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                AD
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="text-xs font-bold text-slate-800 truncate">${currentUser.name}</div>
                                <div class="text-[10px] text-slate-400">Admin Sessiyasi Faol</div>
                            </div>
                        </div>
                        <button onclick="window.ulashApp.exitAdminMode()" class="w-full py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5">
                            <span>🚪</span>
                            <span>Admindan chiqish</span>
                        </button>
                    </div>
                </aside>

                <!-- 2. Asosiy Kontent Qismi -->
                <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    <!-- Dashboard Header -->
                    <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                        <div class="flex items-center gap-3">
                            <!-- Mobil Menyu tugmasi -->
                            <button onclick="UlashAdmin.toggleMobileSidebar()" class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                ☰
                            </button>
                            <h2 class="text-lg font-bold text-slate-800" id="admin-page-title">
                                ${this.getTabTitle(this.activeTab)}
                            </h2>
                        </div>

                        <div class="flex items-center gap-3">
                            <button onclick="window.ulashApp.navigateTo('home')" class="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition flex items-center gap-1">
                                <span>🛍️</span>
                                <span>Do‘konga o‘tish</span>
                            </button>
                        </div>
                    </header>

                    <!-- Tab Kontenti -->
                    <main class="p-6 flex-1" id="admin-tab-content">
                        <!-- renderCurrentTab() orqali to'ldiriladi -->
                    </main>
                </div>
            </div>
        `;

        this.renderCurrentTab();
    },

    getTabTitle(tab) {
        const titles = {
            'dashboard': 'Umumiy Savdo Statistikasi va Dashboard',
            'products': 'Mahsulotlar Katalogi va Ombor Miqdori',
            'orders': 'Buyurtmalarni Boshqarish va Yetkazish Nazorati',
            'couriers': 'Kuryerlar Ro‘yxati va Faoliyati',
            'branches': 'Filiallar Tarmoqlari va Xarita Nazorati',
            'users': 'Mijozlar va Foydalanuvchilar Bazasi',
            'settings': 'Tizim va Yetkazib Berish Narxlari Sozlamalari'
        };
        return titles[tab] || 'Direktor Paneli';
    },

    renderCurrentTab() {
        const container = document.getElementById('admin-tab-content');
        if (!container) return;

        if (this.activeTab === 'dashboard') {
            this.renderDashboardTab(container);
        } else if (this.activeTab === 'products') {
            this.renderProductsTab(container);
        } else if (this.activeTab === 'orders') {
            this.renderOrdersTab(container);
        } else if (this.activeTab === 'couriers') {
            this.renderCouriersTab(container);
        } else if (this.activeTab === 'branches') {
            this.renderBranchesTab(container);
        } else if (this.activeTab === 'users') {
            this.renderUsersTab(container);
        } else if (this.activeTab === 'settings') {
            this.renderSettingsTab(container);
        }
    },

    // --- 1. Dashboard Tab ---
    renderDashboardTab(container) {
        const orders = window.ulashStore.getOrders();
        const products = window.ulashStore.getProducts();
        const couriers = window.ulashStore.getCouriers();
        const users = window.ulashStore.getUsers();

        // Savdo statistikasi
        const totalRevenue = orders
            .filter(o => o.status !== 'Bekor qilindi')
            .reduce((sum, o) => sum + (o.total || 0), 0);

        const activeOrdersCount = orders.filter(o => o.status === 'Yangi buyurtma' || o.status === 'Kuryer qabul qildi' || o.status === 'Yo‘lda').length;
        const completedOrdersCount = orders.filter(o => o.status === 'Yetkazib berildi').length;
        const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

        container.innerHTML = `
            <div class="space-y-6">
                <!-- 4 Asosiy Statistik Kartalar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Savdo tushumi -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <div class="text-xs text-slate-500 font-semibold">Umumiy Savdo Tushumi</div>
                            <div class="text-xl font-black text-slate-900 mt-1">${UlashStore.formatPrice(totalRevenue)}</div>
                            <div class="text-[11px] text-emerald-600 font-medium mt-1">↑ +18.4% bu oyda</div>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                            💰
                        </div>
                    </div>

                    <!-- Buyurtmalar soni -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <div class="text-xs text-slate-500 font-semibold">Jami Buyurtmalar</div>
                            <div class="text-xl font-black text-slate-900 mt-1">${orders.length} ta</div>
                            <div class="text-[11px] text-blue-600 font-medium mt-1">${activeOrdersCount} ta faol yetkazilmoqda</div>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                            📋
                        </div>
                    </div>

                    <!-- Mahsulotlar & Ombor -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <div class="text-xs text-slate-500 font-semibold">Mahsulotlar xili</div>
                            <div class="text-xl font-black text-slate-900 mt-1">${products.length} xil</div>
                            <div class="text-[11px] text-slate-500 font-medium mt-1">Omborda: ${totalStockUnits} dona jami</div>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                            📦
                        </div>
                    </div>

                    <!-- Kuryerlar & Mijozlar -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <div class="text-xs text-slate-500 font-semibold">Faol Kuryerlar</div>
                            <div class="text-xl font-black text-slate-900 mt-1">${couriers.length} nafar</div>
                            <div class="text-[11px] text-slate-500 font-medium mt-1">${users.length} ta ro‘yxatdan o‘tgan mijoz</div>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                            🛵
                        </div>
                    </div>
                </div>

                <!-- Daromad va Buyurtmalar Grafigi (Chart.js) -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold text-slate-800 text-sm">Savdo Ko‘rsatkichlari Dinamikasi</h3>
                                <p class="text-xs text-slate-400">Oxirgi haftalik buyurtmalar va daromadlar taqsimoti</p>
                            </div>
                            <span class="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">Real-vaqt</span>
                        </div>
                        <div class="h-64">
                            <canvas id="admin-revenue-chart"></canvas>
                        </div>
                    </div>

                    <!-- Filiallar bo'yicha yuklama -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 class="font-bold text-slate-800 text-sm mb-1">Filiallar Bo‘yicha Taqsimot</h3>
                            <p class="text-xs text-slate-400 mb-4">Qaysi filialdan ko‘p buyurtma chiqmoqda</p>

                            <div class="space-y-3">
                                ${window.ulashStore.getBranches().map(b => {
                                    const branchOrders = orders.filter(o => o.branchId === b.id).length;
                                    const percent = orders.length > 0 ? Math.round((branchOrders / orders.length) * 100) : 25;
                                    return `
                                        <div>
                                            <div class="flex justify-between text-xs font-semibold mb-1">
                                                <span class="text-slate-700">${b.shortName || b.name}</span>
                                                <span class="text-blue-600">${branchOrders} ta (${percent}%)</span>
                                            </div>
                                            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div class="bg-blue-600 h-full rounded-full" style="width: ${percent}%"></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <button onclick="UlashAdmin.setTab('branches')" class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-blue-600 text-xs font-semibold rounded-xl transition text-center">
                                Filiallarni boshqarish →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- So'nggi Buyurtmalar Jadvali -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-slate-800 text-sm">So‘nggi Buyurtmalar</h3>
                            <p class="text-xs text-slate-400">Tizimga kelib tushgan yangi buyurtmalar holati</p>
                        </div>
                        <button onclick="UlashAdmin.setTab('orders')" class="text-xs font-semibold text-blue-600 hover:underline">
                            Barchasini ko‘rish →
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                                <tr>
                                    <th class="p-3.5">Buyurtma ID</th>
                                    <th class="p-3.5">Mijoz</th>
                                    <th class="p-3.5">Filial</th>
                                    <th class="p-3.5">Summa</th>
                                    <th class="p-3.5">Kuryer</th>
                                    <th class="p-3.5">Holat</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${orders.slice(0, 5).map(o => `
                                    <tr class="hover:bg-slate-50/70 transition">
                                        <td class="p-3.5 font-bold text-blue-600">#${o.id}</td>
                                        <td class="p-3.5 font-medium text-slate-800">${o.customer.name}</td>
                                        <td class="p-3.5 text-slate-600">${o.branchName || 'Chilonzor'}</td>
                                        <td class="p-3.5 font-bold text-slate-900">${UlashStore.formatPrice(o.total)}</td>
                                        <td class="p-3.5 text-slate-600">${o.courierName || '<span class="text-amber-600 font-semibold">Tayinlanmagan</span>'}</td>
                                        <td class="p-3.5">
                                            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${this.getStatusBadgeClass(o.status)}">
                                                ${o.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => this.initDashboardChart(), 100);
    },

    initDashboardChart() {
        const canvas = document.getElementById('admin-revenue-chart');
        if (!canvas) return;

        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Bugun'],
                datasets: [
                    {
                        label: 'Savdo tushumi (mln so‘m)',
                        data: [4.2, 5.8, 6.1, 7.4, 9.2, 12.5, 8.9],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 3,
                        pointBackgroundColor: '#2563eb',
                        pointRadius: 4
                    },
                    {
                        label: 'Buyurtmalar soni',
                        data: [12, 18, 15, 22, 29, 38, 26],
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.35,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, font: { size: 11 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        ticks: { font: { size: 10 } }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    },

    // --- 2. Mahsulotlar & Ombor Tab ---
    renderProductsTab(container) {
        const products = window.ulashStore.getProducts();
        const categories = window.ulashStore.getCategories();

        container.innerHTML = `
            <div class="space-y-4">
                <!-- Yuqori qidiruv va Qo'shish tugmasi -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div class="relative w-full sm:w-80">
                        <input type="text" id="admin-product-search" placeholder="Mahsulot nomi yoki brend bo‘yicha..." oninput="UlashAdmin.filterProductTable(this.value)" class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                        <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                    </div>

                    <button onclick="UlashAdmin.openAddProductModal()" class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200 transition flex items-center justify-center gap-1.5">
                        <span>+ Yangi mahsulot qo‘shish</span>
                    </button>
                </div>

                <!-- Mahsulotlar Jadvali -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                                <tr>
                                    <th class="p-3.5">Mahsulot</th>
                                    <th class="p-3.5">Kategoriya</th>
                                    <th class="p-3.5">Brend</th>
                                    <th class="p-3.5">Narx</th>
                                    <th class="p-3.5">Chegirma</th>
                                    <th class="p-3.5">Ombordagi soni</th>
                                    <th class="p-3.5 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100" id="admin-products-tbody">
                                ${products.map(p => this.createProductRowHtml(p)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    createProductRowHtml(p) {
        const isOutOfStock = p.stock <= 0;
        const isLowStock = p.stock > 0 && p.stock <= 5;

        return `
            <tr class="hover:bg-slate-50/70 transition" id="prod-row-${p.id}">
                <td class="p-3.5">
                    <div class="flex items-center gap-3">
                        <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover bg-slate-50 border">
                        <div class="min-w-0 max-w-[240px]">
                            <div class="font-bold text-slate-800 truncate" title="${p.name}">${p.name}</div>
                            <div class="text-[10px] text-slate-400">ID: ${p.id}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3.5 text-slate-600">${p.category}</td>
                <td class="p-3.5 font-medium text-slate-700">${p.brand}</td>
                <td class="p-3.5 font-bold text-slate-900">${UlashStore.formatPrice(p.price)}</td>
                <td class="p-3.5">
                    ${p.discountPercent > 0 ? `<span class="badge-discount">-${p.discountPercent}%</span>` : '<span class="text-slate-400">Yo‘q</span>'}
                </td>
                <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold ${isOutOfStock ? 'bg-rose-100 text-rose-700' : isLowStock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${p.stock} dona ${isOutOfStock ? '(Tugagan)' : ''}
                    </span>
                </td>
                <td class="p-3.5 text-right space-x-1">
                    <button onclick="UlashAdmin.openEditProductModal('${p.id}')" class="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition">
                        Tahrirlash
                    </button>
                    <button onclick="UlashAdmin.deleteProduct('${p.id}')" class="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition">
                        O‘chirish
                    </button>
                </td>
            </tr>
        `;
    },

    filterProductTable(query) {
        const tbody = document.getElementById('admin-products-tbody');
        if (!tbody) return;

        const q = query.toLowerCase().trim();
        const products = window.ulashStore.getProducts().filter(p => 
            p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        );

        tbody.innerHTML = products.map(p => this.createProductRowHtml(p)).join('');
    },

    openAddProductModal() {
        this.renderProductFormModal(null);
    },

    openEditProductModal(productId) {
        const product = window.ulashStore.getProductById(productId);
        if (product) {
            this.renderProductFormModal(product);
        }
    },

    renderProductFormModal(product = null) {
        const isEdit = Boolean(product);
        const categories = window.ulashStore.getCategories();

        const modal = document.createElement('div');
        modal.id = 'admin-product-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';

        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <h3 class="font-bold text-base text-slate-800">
                        ${isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
                    </h3>
                    <button onclick="document.getElementById('admin-product-modal').remove()" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                </div>

                <form onsubmit="UlashAdmin.saveProductForm(event, '${isEdit ? product.id : ''}')" class="space-y-4 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Mahsulot to‘liq nomi *</label>
                        <input type="text" id="form-p-name" required value="${isEdit ? product.name : ''}" placeholder="Masalan: Samsung Galaxy S24 Ultra..." class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Brend *</label>
                            <input type="text" id="form-p-brand" required value="${isEdit ? product.brand : ''}" placeholder="Apple, Samsung, Artel..." class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Kategoriya *</label>
                            <select id="form-p-category" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium bg-white">
                                ${categories.map(c => `
                                    <option value="${c.id}" ${isEdit && product.category === c.id ? 'selected' : ''}>${c.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Narxi (so‘m) *</label>
                            <input type="number" id="form-p-price" required value="${isEdit ? product.price : ''}" placeholder="12500000" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Chegirma (%)</label>
                            <input type="number" id="form-p-discount" value="${isEdit ? product.discountPercent : 0}" min="0" max="90" placeholder="10" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Ombordagi miqdori *</label>
                            <input type="number" id="form-p-stock" required value="${isEdit ? product.stock : 10}" min="0" placeholder="25" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                        </div>
                    </div>

                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Mahsulot rasmi URL havolasi</label>
                        <input type="url" id="form-p-image" value="${isEdit ? product.image : ''}" placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">
                        <span class="text-[10px] text-slate-400">Bo‘sh qoldirilsa, avtomatik standart rasm qo‘yiladi.</span>
                    </div>

                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Mahsulot tavsifi</label>
                        <textarea id="form-p-desc" rows="3" placeholder="Mahsulot haqida batafsil ma'lumot..." class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-medium">${isEdit ? product.description : ''}</textarea>
                    </div>

                    <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <button type="button" onclick="document.getElementById('admin-product-modal').remove()" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition">
                            Bekor qilish
                        </button>
                        <button type="submit" class="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200">
                            ${isEdit ? 'O‘zgarishlarni saqlash' : 'Mahsulotni qo‘shish'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
    },

    saveProductForm(event, editId) {
        event.preventDefault();

        const name = document.getElementById('form-p-name').value.trim();
        const brand = document.getElementById('form-p-brand').value.trim();
        const category = document.getElementById('form-p-category').value;
        const price = Number(document.getElementById('form-p-price').value);
        const discount = Number(document.getElementById('form-p-discount').value) || 0;
        const stock = Number(document.getElementById('form-p-stock').value) || 0;
        const image = document.getElementById('form-p-image').value.trim();
        const desc = document.getElementById('form-p-desc').value.trim();

        if (editId) {
            window.ulashStore.updateProduct(editId, {
                name,
                brand,
                category,
                price,
                originalPrice: discount > 0 ? Math.round(price / (1 - discount / 100)) : price,
                discountPercent: discount,
                stock,
                image: image || undefined,
                description: desc
            });
            window.ulashCatalog.showToast("Mahsulot muvaffaqiyatli tahrirlandi! ✓");
        } else {
            window.ulashStore.addProduct({
                name,
                brand,
                category,
                price,
                originalPrice: discount > 0 ? Math.round(price / (1 - discount / 100)) : price,
                discountPercent: discount,
                stock,
                image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                description: desc
            });
            window.ulashCatalog.showToast("Yangi mahsulot omborga qo‘shildi! 🎉");
        }

        const modal = document.getElementById('admin-product-modal');
        if (modal) modal.remove();
        this.renderCurrentTab();
    },

    deleteProduct(id) {
        if (confirm("Haqiqatan ham ushbu mahsulotni tizimdan o‘chirmoqchimisiz?")) {
            window.ulashStore.deleteProduct(id);
            window.ulashCatalog.showToast("Mahsulot o‘chirildi.");
            this.renderCurrentTab();
        }
    },

    // --- 3. Buyurtmalar Tab ---
    renderOrdersTab(container) {
        const orders = window.ulashStore.getOrders();
        const couriers = window.ulashStore.getCouriers();

        container.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2 text-xs">
                        <span class="font-bold text-slate-700">Holat bo‘yicha:</span>
                        <select onchange="UlashAdmin.filterOrdersByStatus(this.value)" class="px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white font-medium">
                            <option value="all">Barcha buyurtmalar (${orders.length})</option>
                            <option value="Yangi buyurtma">Yangi buyurtma</option>
                            <option value="Kuryer qabul qildi">Kuryer qabul qildi</option>
                            <option value="Yo‘lda">Yo‘lda</option>
                            <option value="Yetkazib berildi">Yetkazib berildi</option>
                            <option value="Bekor qilindi">Bekor qilindi</option>
                        </select>
                    </div>

                    <div class="text-xs text-slate-500">
                        Jami aylanma: <b class="text-slate-900">${UlashStore.formatPrice(orders.reduce((s, o) => s + (o.total || 0), 0))}</b>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                                <tr>
                                    <th class="p-3.5">ID</th>
                                    <th class="p-3.5">Sana</th>
                                    <th class="p-3.5">Mijoz & Tel</th>
                                    <th class="p-3.5">Yetkazish Manzili</th>
                                    <th class="p-3.5">Summa</th>
                                    <th class="p-3.5">Kuryer</th>
                                    <th class="p-3.5">Holati</th>
                                    <th class="p-3.5 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100" id="admin-orders-tbody">
                                ${orders.map(o => this.createOrderRowHtml(o, couriers)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    createOrderRowHtml(o, couriers) {
        return `
            <tr class="hover:bg-slate-50/70 transition" id="order-row-${o.id}">
                <td class="p-3.5 font-bold text-blue-600">#${o.id}</td>
                <td class="p-3.5 text-slate-500">${UlashStore.formatDate(o.createdAt)}</td>
                <td class="p-3.5">
                    <div class="font-bold text-slate-800">${o.customer.name}</div>
                    <div class="text-[11px] text-slate-400">${o.customer.phone}</div>
                </td>
                <td class="p-3.5 max-w-[180px] truncate text-slate-600" title="${o.customer.address}">${o.customer.address}</td>
                <td class="p-3.5 font-black text-slate-900">${UlashStore.formatPrice(o.total)}</td>
                <td class="p-3.5 text-slate-700">
                    ${o.courierName ? `<b>${o.courierName}</b>` : '<span class="text-amber-600 text-[11px]">Kutilmoqda</span>'}
                </td>
                <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${this.getStatusBadgeClass(o.status)}">
                        ${o.status}
                    </span>
                </td>
                <td class="p-3.5 text-right space-x-1">
                    <button onclick="UlashAdmin.openOrderDetailsModal('${o.id}')" class="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition">
                        Batafsil
                    </button>
                    ${o.status !== 'Bekor qilindi' && o.status !== 'Yetkazib berildi' ? `
                        <button onclick="UlashAdmin.cancelOrderDirect('${o.id}')" class="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition">
                            Bekor qilish
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    },

    filterOrdersByStatus(status) {
        const tbody = document.getElementById('admin-orders-tbody');
        if (!tbody) return;

        let orders = window.ulashStore.getOrders();
        const couriers = window.ulashStore.getCouriers();

        if (status !== 'all') {
            orders = orders.filter(o => o.status === status);
        }

        tbody.innerHTML = orders.map(o => this.createOrderRowHtml(o, couriers)).join('');
    },

    openOrderDetailsModal(orderId) {
        const order = window.ulashStore.getOrders().find(o => o.id === orderId);
        if (!order) return;

        const modal = document.createElement('div');
        modal.id = 'admin-order-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';

        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-base text-slate-800">Buyurtma #${order.id}</h3>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
                    </div>
                    <button onclick="document.getElementById('admin-order-modal').remove()" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                </div>

                <div class="space-y-4 text-xs">
                    <!-- Mijoz va Yetkazish -->
                    <div class="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <span class="text-slate-400 block text-[11px]">Qabul qiluvchi:</span>
                            <span class="font-bold text-slate-800 text-sm">${order.customer.name}</span>
                            <div class="text-slate-600 mt-0.5">${order.customer.phone}</div>
                        </div>
                        <div>
                            <span class="text-slate-400 block text-[11px]">Yetkazish manzili:</span>
                            <span class="font-semibold text-slate-800">${order.customer.address}</span>
                            <div class="text-blue-600 mt-0.5">Filial: ${order.branchName}</div>
                        </div>
                    </div>

                    <!-- Mahsulotlar ro'yxati -->
                    <div>
                        <h4 class="font-bold text-slate-700 mb-2">Buyurtma tarkibi:</h4>
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            ${order.items.map(item => `
                                <div class="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <div class="flex items-center gap-2">
                                        <img src="${item.image}" class="w-9 h-9 rounded object-cover bg-white border">
                                        <div>
                                            <div class="font-semibold text-slate-800">${item.name}</div>
                                            <div class="text-[11px] text-slate-400">${item.quantity} dona x ${UlashStore.formatPrice(item.price)}</div>
                                        </div>
                                    </div>
                                    <div class="font-bold text-slate-800">${UlashStore.formatPrice(item.price * item.quantity)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Kuryer tayinlash yoki o'zgartirish -->
                    <div class="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                        <div>
                            <div class="font-bold text-blue-900 text-xs">Biriktirilgan kuryer:</div>
                            <div class="text-slate-700 text-xs mt-0.5">${order.courierName ? `${order.courierName} (${order.courierPhone})` : 'Hali kuryer biriktirilmagan'}</div>
                        </div>
                        <select onchange="UlashAdmin.assignCourierToOrder('${order.id}', this.value)" class="px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold bg-white text-blue-700">
                            <option value="">Kuryer tanlash...</option>
                            ${window.ulashStore.getCouriers().map(c => `
                                <option value="${c.id}" ${order.courierId === c.id ? 'selected' : ''}>${c.name} (${c.transport})</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Holatlar tarixi -->
                    <div>
                        <h4 class="font-bold text-slate-700 mb-2">Buyurtma holatlari jurnali:</h4>
                        <div class="space-y-2 border-l-2 border-blue-300 ml-2 pl-3">
                            ${order.statusHistory.map(h => `
                                <div class="text-xs">
                                    <div class="font-semibold text-slate-800">${h.status} <span class="text-[10px] text-slate-400 font-normal">(${UlashStore.formatDate(h.time)})</span></div>
                                    <div class="text-slate-500 text-[11px]">${h.note || ''}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
                    <div class="text-sm font-black text-slate-900">
                        Jami: <span class="text-blue-600">${UlashStore.formatPrice(order.total)}</span>
                    </div>
                    <button onclick="document.getElementById('admin-order-modal').remove()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">
                        Yopish
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    assignCourierToOrder(orderId, courierId) {
        if (!courierId) return;
        const courier = window.ulashStore.getCouriers().find(c => c.id === courierId);
        if (courier) {
            window.ulashStore.courierAcceptOrder(orderId, courier);
            window.ulashCatalog.showToast(`Buyurtma #${orderId} kuryer ${courier.name}ga biriktirildi!`);
            const modal = document.getElementById('admin-order-modal');
            if (modal) modal.remove();
            this.renderCurrentTab();
        }
    },

    cancelOrderDirect(orderId) {
        const reason = prompt("Buyurtmani bekor qilish sababini kiriting:", "Admin tomonidan bekor qilindi");
        if (reason) {
            window.ulashStore.cancelOrder(orderId, reason);
            window.ulashCatalog.showToast(`Buyurtma #${orderId} bekor qilindi va mahsulotlar omborga qaytarildi.`);
            this.renderCurrentTab();
        }
    },

    // --- 4. Kuryerlar Tab ---
    renderCouriersTab(container) {
        const couriers = window.ulashStore.getCouriers();

        container.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-slate-800 text-sm">Kuryerlar Jamoasi (${couriers.length} nafar)</h3>
                        <p class="text-xs text-slate-400">Yetkazib berish xizmati haydovchilari</p>
                    </div>
                    <button onclick="UlashAdmin.openAddCourierModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200 transition">
                        + Yangi kuryer qo‘shish
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${couriers.map(c => `
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                                        🛵
                                    </div>
                                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                        ● Onlayn
                                    </span>
                                </div>
                                <h4 class="font-bold text-slate-900 text-sm">${c.name}</h4>
                                <p class="text-xs text-slate-500 mt-0.5">Tel: <a href="tel:${c.phone}" class="text-blue-600 font-medium">${c.phone}</a></p>
                                <p class="text-xs text-slate-500">Transport: <b class="text-slate-700">${c.transport}</b></p>
                            </div>

                            <div class="pt-3 border-t border-slate-100 mt-4 space-y-1.5 text-xs">
                                <div class="flex justify-between text-slate-500">
                                    <span>Yetkazgan:</span>
                                    <b class="text-slate-800">${c.completedOrders || 0} ta buyurtma</b>
                                </div>
                                <div class="flex justify-between text-slate-500">
                                    <span>Ishlagan puli:</span>
                                    <b class="text-emerald-600 font-bold">${UlashStore.formatPrice(c.earningsTotal || 0)}</b>
                                </div>
                                <div class="flex justify-between text-slate-500">
                                    <span>Reyting:</span>
                                    <b class="text-amber-500">⭐ ${c.rating || 4.9}</b>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    openAddCourierModal() {
        const name = prompt("Kuryerning to'liq ism-familiyasi:");
        if (!name) return;
        const phone = prompt("Kuryer telefon raqami (+998 ...):", "+998 90 ");
        if (!phone) return;
        const transport = prompt("Transport turi (Skuter / Chevrolet Spark / Velosiped):", "Skuter");

        window.ulashStore.addCourier({
            name,
            phone,
            transport: transport || 'Skuter'
        });
        window.ulashCatalog.showToast("Yangi kuryer tizimga qo‘shildi!");
        this.renderCurrentTab();
    },

    // --- 5. Filiallar Tab ---
    renderBranchesTab(container) {
        const branches = window.ulashStore.getBranches();

        container.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-slate-800 text-sm">Do‘kon Filiallari va Omborlar</h3>
                        <p class="text-xs text-slate-400">Har bir filial buyurtmalarni tayyorlash va jo‘natish markazidir</p>
                    </div>
                    <button onclick="UlashAdmin.openAddBranchModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200 transition">
                        + Yangi filial ochish
                    </button>
                </div>

                <!-- Filiallar Kartalari -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${branches.map(b => `
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                        Filial #${b.id}
                                    </span>
                                    <span class="text-xs text-emerald-600 font-semibold">● Ochiq (${b.workingHours})</span>
                                </div>
                                <h4 class="font-bold text-slate-900 text-base mb-1">${b.name}</h4>
                                <p class="text-xs text-slate-600 mb-2 leading-relaxed"><i class="text-blue-600 font-semibold">Manzil:</i> ${b.address}</p>
                                <p class="text-xs text-slate-500 mb-1">Mudir: <b class="text-slate-800">${b.manager}</b></p>
                                <p class="text-xs text-slate-500">Aloqa: <a href="tel:${b.phone}" class="text-blue-600 font-medium">${b.phone}</a></p>
                            </div>

                            <div class="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                                <span class="text-slate-400">Koordinatalar: ${b.lat.toFixed(3)}, ${b.lng.toFixed(3)}</span>
                                <button onclick="UlashAdmin.deleteBranch('${b.id}')" class="text-rose-500 hover:text-rose-700 font-semibold">
                                    Filialni yopish
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    openAddBranchModal() {
        const name = prompt("Filial nomi (Masalan: Mirzo Ulug'bek Filiali):");
        if (!name) return;
        const address = prompt("Filial to'liq manzili:");
        if (!address) return;
        const phone = prompt("Filial telefoni:", "+998 71 200-");
        const manager = prompt("Mudir ismi:", "Menejer");

        window.ulashStore.addBranch({
            name,
            address,
            phone: phone || '+998 71 200-00-00',
            manager: manager || 'Mudir',
            lat: 41.2995 + (Math.random() - 0.5) * 0.05,
            lng: 69.2401 + (Math.random() - 0.5) * 0.05
        });

        window.ulashCatalog.showToast("Yangi filial tizimga qo‘shildi!");
        this.renderCurrentTab();
    },

    deleteBranch(id) {
        if (confirm("Ushbu filialni o'chirmoqchimisiz?")) {
            window.ulashStore.deleteBranch(id);
            window.ulashCatalog.showToast("Filial o‘chirildi.");
            this.renderCurrentTab();
        }
    },

    // --- 6. Foydalanuvchilar Tab ---
    renderUsersTab(container) {
        const users = window.ulashStore.getUsers();
        const orders = window.ulashStore.getOrders();

        container.innerHTML = `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-slate-100">
                    <h3 class="font-bold text-slate-800 text-sm">Ro‘yxatdan O‘tgan Mijozlar (${users.length} nafar)</h3>
                    <p class="text-xs text-slate-400">Do‘kondan xarid qiluvchi foydalanuvchilar ma’lumotlari</p>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                            <tr>
                                <th class="p-3.5">Foydalanuvchi</th>
                                <th class="p-3.5">Telefon / Email</th>
                                <th class="p-3.5">Manzili</th>
                                <th class="p-3.5">Buyurtmalar soni</th>
                                <th class="p-3.5">Sana</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${users.map(u => {
                                const userOrders = orders.filter(o => o.customer.phone === u.phone);
                                return `
                                    <tr class="hover:bg-slate-50/70 transition">
                                        <td class="p-3.5 font-bold text-slate-800">${u.name}</td>
                                        <td class="p-3.5 text-blue-600">${u.phone || u.email}</td>
                                        <td class="p-3.5 text-slate-600 max-w-[200px] truncate">${u.defaultAddress || 'Toshkent'}</td>
                                        <td class="p-3.5 font-bold text-slate-900">${userOrders.length} ta buyurtma</td>
                                        <td class="p-3.5 text-slate-400">${u.registeredAt || '2026-01-01'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- 7. Sozlamalar Tab ---
    renderSettingsTab(container) {
        const settings = window.ulashStore.getSettings();

        container.innerHTML = `
            <div class="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="font-bold text-slate-800 text-base mb-1">Tizim va Narxlar Sozlamalari</h3>
                <p class="text-xs text-slate-400 mb-6">Yetkazib berish tariflari va maxfiy admin parolini boshqarish</p>

                <form onsubmit="UlashAdmin.saveSettingsForm(event)" class="space-y-4 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Do‘kon nomi</label>
                        <input type="text" id="set-store-name" value="${settings.storeName}" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Asosiy yetkazib berish narxi (so‘m)</label>
                            <input type="number" id="set-delivery-fee" value="${settings.baseDeliveryFee}" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium">
                            <span class="text-[10px] text-slate-400">Standart yetkazish to‘lovi</span>
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Bepul yetkazib berish chegarasi (so‘m)</label>
                            <input type="number" id="set-free-threshold" value="${settings.freeDeliveryThreshold}" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium">
                            <span class="text-[10px] text-slate-400">Shu summadan oshsa yetkazish bepul</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Kuryer ulushi (so‘m / buyurtma)</label>
                            <input type="number" id="set-courier-commission" value="${settings.courierCommission}" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium">
                            <span class="text-[10px] text-slate-400">Har bir muvaffaqiyatli yetkazish uchun</span>
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Maxfiy Admin Paroli (PIN)</label>
                            <input type="text" id="set-admin-pin" value="${settings.adminSecretPin}" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium">
                            <span class="text-[10px] text-slate-400">Direktor boshqaruviga kirish paroli</span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md shadow-blue-200">
                            Sozlamalarni saqlash
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    saveSettingsForm(e) {
        e.preventDefault();
        const settings = window.ulashStore.getSettings();

        settings.storeName = document.getElementById('set-store-name').value.trim();
        settings.baseDeliveryFee = Number(document.getElementById('set-delivery-fee').value);
        settings.freeDeliveryThreshold = Number(document.getElementById('set-free-threshold').value);
        settings.courierCommission = Number(document.getElementById('set-courier-commission').value);
        settings.adminSecretPin = document.getElementById('set-admin-pin').value.trim();

        window.ulashStore.saveSettings(settings);
        window.ulashCatalog.showToast("Sozlamalar muvaffaqiyatli yangilandi! ✓");
    },

    getStatusBadgeClass(status) {
        const classes = {
            'Yangi buyurtma': 'bg-amber-100 text-amber-800 border border-amber-200',
            'Kuryer qabul qildi': 'bg-blue-100 text-blue-800 border border-blue-200',
            'Yo‘lda': 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse',
            'Yetkazib berildi': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
            'Bekor qilindi': 'bg-rose-100 text-rose-800 border border-rose-200'
        };
        return classes[status] || 'bg-slate-100 text-slate-700';
    },

    toggleMobileSidebar() {
        const aside = document.querySelector('aside');
        if (aside) {
            aside.classList.toggle('hidden');
        }
    }
};

window.ulashAdmin = UlashAdmin;
