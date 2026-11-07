/**
 * ULASH MARKET - Kuryer Paneli va Yetkazib Berish Boshqaruvi
 * Yangi buyurtmalarni qabul qilish, holatni boshqarish va daromad hisobi
 */

const UlashCourier = {
    activeTab: 'available', // 'available' | 'my-active' | 'history'

    init() {
        this.renderCourierPanel();
        this.setupSubscriptions();
    },

    setupSubscriptions() {
        // Buyurtmalar o'zgarganda real-time kuryer panelini qayta chizish
        window.ulashStore.subscribe('ORDER_CREATED', () => {
            if (this.isCourierViewActive()) this.renderCourierPanel();
        });
        window.ulashStore.subscribe('ORDER_ACCEPTED', () => {
            if (this.isCourierViewActive()) this.renderCourierPanel();
        });
        window.ulashStore.subscribe('ORDER_STATUS_CHANGED', () => {
            if (this.isCourierViewActive()) this.renderCourierPanel();
        });
        window.ulashStore.subscribe('USER_CHANGED', () => {
            if (this.isCourierViewActive()) this.renderCourierPanel();
        });
    },

    isCourierViewActive() {
        const panel = document.getElementById('courier-panel-container');
        return panel && !panel.classList.contains('hidden');
    },

    getCurrentCourier() {
        const user = window.ulashStore.getCurrentUser();
        if (user && user.role === 'courier') {
            const couriers = window.ulashStore.getCouriers();
            return couriers.find(c => c.id === user.id || c.phone === user.phone) || {
                id: user.id || 'cour-1',
                name: user.name || 'Sardor Aliyev',
                phone: user.phone || '+998 90 123-45-67',
                transport: user.transport || 'Skuter',
                rating: user.rating || 4.95,
                completedOrders: user.completedOrders || 0,
                earningsTotal: user.earningsTotal || 0
            };
        }
        // Agar kuryer sifatida kirmagan bo'lsa birinchi kuryerni default qilamiz
        return window.ulashStore.getCouriers()[0];
    },

    setTab(tabName) {
        this.activeTab = tabName;
        this.renderCourierPanel();
    },

    renderCourierPanel() {
        const container = document.getElementById('courier-panel-container');
        if (!container) return;

        const courier = this.getCurrentCourier();
        const allOrders = window.ulashStore.getOrders();
        const settings = window.ulashStore.getSettings();

        // 1. Yangi bo'sh buyurtmalar (Hali hech kim olmagan)
        const availableOrders = allOrders.filter(o => o.status === 'Yangi buyurtma');

        // 2. Ushbu kuryer qabul qilgan faol buyurtmalar (Yo'lda yoki qabul qilingan)
        const myActiveOrders = allOrders.filter(o => 
            (o.courierId === courier.id || o.courierPhone === courier.phone) &&
            (o.status === 'Kuryer qabul qildi' || o.status === 'Yo‘lda')
        );

        // 3. Ushbu kuryer yetkazgan buyurtmalar tarixi
        const myHistoryOrders = allOrders.filter(o => 
            (o.courierId === courier.id || o.courierPhone === courier.phone) &&
            (o.status === 'Yetkazib berildi' || o.status === 'Bekor qilindi')
        );

        container.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 py-8">
                <!-- Kuryer Profili va Statistikasi -->
                <div class="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl mb-8">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border border-white/30 shadow-inner">
                                🛵
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h1 class="text-xl md:text-2xl font-bold">${courier.name}</h1>
                                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-900 flex items-center gap-1">
                                        <span class="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping"></span>
                                        Faol Kuryer
                                    </span>
                                </div>
                                <p class="text-blue-100 text-xs mt-1">
                                    Transport: <b class="text-white">${courier.transport}</b> • Tel: <b class="text-white">${courier.phone}</b>
                                </p>
                            </div>
                        </div>

                        <!-- Ko'rsatkichlar -->
                        <div class="grid grid-cols-3 gap-3 w-full md:w-auto">
                            <div class="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                                <div class="text-[11px] text-blue-200">Yetkazilgan</div>
                                <div class="text-lg md:text-xl font-black mt-0.5">${courier.completedOrders || myHistoryOrders.length} ta</div>
                            </div>
                            <div class="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                                <div class="text-[11px] text-blue-200">Reyting</div>
                                <div class="text-lg md:text-xl font-black mt-0.5 text-amber-300">⭐ ${courier.rating || 4.9}</div>
                            </div>
                            <div class="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                                <div class="text-[11px] text-blue-200">Ishlangan mablag'</div>
                                <div class="text-sm md:text-base font-black mt-1 text-emerald-300">
                                    ${UlashStore.formatPrice(courier.earningsTotal || (myHistoryOrders.length * settings.courierCommission))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Kuryerlarni almashtirish (Test qilish uchun juda qulay) -->
                    <div class="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-blue-200 gap-2">
                        <div class="flex items-center gap-2">
                            <span>Kuryer profilini tanlash:</span>
                            <div class="flex gap-2">
                                ${window.ulashStore.getCouriers().map(c => `
                                    <button onclick="UlashCourier.switchCourierProfile('${c.id}')" class="px-2.5 py-1 rounded-lg ${c.id === courier.id ? 'bg-white text-blue-800 font-bold shadow' : 'bg-white/20 text-white hover:bg-white/30'} transition">
                                        ${c.name.split(' ')[0]}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="text-[11px] text-blue-200">
                            Har bir yetkazilgan buyurtma uchun: <b class="text-white">+${UlashStore.formatPrice(settings.courierCommission)}</b>
                        </div>
                    </div>
                </div>

                <!-- Navigatsiya tablari -->
                <div class="flex border-b border-slate-200 mb-6 gap-2">
                    <button onclick="UlashCourier.setTab('available')" class="px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${this.activeTab === 'available' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
                        <span>📦 Yangi buyurtmalar</span>
                        <span class="px-2 py-0.5 rounded-full text-xs ${availableOrders.length > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700'}">
                            ${availableOrders.length}
                        </span>
                    </button>

                    <button onclick="UlashCourier.setTab('my-active')" class="px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${this.activeTab === 'my-active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
                        <span>🛵 Faol buyurtmalarim</span>
                        <span class="px-2 py-0.5 rounded-full text-xs ${myActiveOrders.length > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}">
                            ${myActiveOrders.length}
                        </span>
                    </button>

                    <button onclick="UlashCourier.setTab('history')" class="px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${this.activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
                        <span>📋 Yetkazilganlar tarixi</span>
                        <span class="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-700">
                            ${myHistoryOrders.length}
                        </span>
                    </button>
                </div>

                <!-- Tab Kontentlari -->
                <div>
                    ${this.activeTab === 'available' ? this.renderAvailableOrders(availableOrders, courier) : ''}
                    ${this.activeTab === 'my-active' ? this.renderMyActiveOrders(myActiveOrders, courier) : ''}
                    ${this.activeTab === 'history' ? this.renderHistoryOrders(myHistoryOrders) : ''}
                </div>
            </div>
        `;
    },

    switchCourierProfile(courierId) {
        const found = window.ulashStore.getCouriers().find(c => c.id === courierId);
        if (found) {
            window.ulashStore.setCurrentUser({
                ...found,
                role: 'courier'
            });
            window.ulashCatalog.showToast(`${found.name} sifatida tizimga ulandiz!`);
        }
    },

    renderAvailableOrders(orders, currentCourier) {
        if (orders.length === 0) {
            return `
                <div class="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div class="w-20 h-20 mx-auto mb-3 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl">
                        ✨
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Ayni vaqtda yangi buyurtmalar yo‘q</h3>
                    <p class="text-slate-500 text-xs max-w-sm mx-auto">
                        Mijozlar buyurtma berganda ushbu bo‘limda avtomatik paydo bo‘ladi.
                    </p>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${orders.map(order => `
                    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div class="flex items-center gap-2">
                                    <span class="font-extrabold text-blue-600 text-sm">#${order.id}</span>
                                    <span class="text-xs text-slate-400">• ${UlashStore.formatDate(order.createdAt)}</span>
                                </div>
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    Yangi buyurtma
                                </span>
                            </div>

                            <!-- Qabul qilish va yetkazish manzili -->
                            <div class="py-3 space-y-2 text-xs">
                                <div class="flex items-start gap-2 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                                    <span class="text-base">🏬</span>
                                    <div>
                                        <div class="text-[11px] text-blue-600 font-semibold">Qaysi filialdan olinadi:</div>
                                        <div class="font-bold text-slate-800">${order.branchName || 'Chilonzor Filiali'}</div>
                                    </div>
                                </div>

                                <div class="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <span class="text-base">📍</span>
                                    <div>
                                        <div class="text-[11px] text-slate-500 font-semibold">Yetkazish manzili:</div>
                                        <div class="font-bold text-slate-800">${order.customer.address}</div>
                                        <div class="text-slate-500 text-[11px]">Mijoz: ${order.customer.name}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mahsulotlar qisqacha -->
                            <div class="py-2 border-t border-slate-100 text-xs">
                                <span class="text-slate-500">Mahsulotlar (${order.items.length} xil):</span>
                                <div class="mt-1 flex flex-wrap gap-1.5">
                                    ${order.items.map(item => `
                                        <span class="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-700">
                                            ${item.quantity}x ${item.name}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Narx va Qabul qilish tugmasi -->
                        <div class="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                            <div>
                                <div class="text-[11px] text-slate-500">Buyurtma summasi:</div>
                                <div class="text-base font-bold text-slate-900">${UlashStore.formatPrice(order.total)}</div>
                                <div class="text-[11px] text-emerald-600 font-semibold">To‘lov: ${order.paymentMethod}</div>
                            </div>

                            <button onclick="UlashCourier.acceptOrder('${order.id}')" class="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-200 transition flex items-center gap-1.5 active:scale-95">
                                <span>Buyurtmani qabul qilish</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderMyActiveOrders(orders, currentCourier) {
        if (orders.length === 0) {
            return `
                <div class="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div class="w-20 h-20 mx-auto mb-3 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl">
                        🛵
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Sizda faol buyurtmalar yo‘q</h3>
                    <p class="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                        "Yangi buyurtmalar" bo‘limidan o‘zingizga mos buyurtmani qabul qiling.
                    </p>
                    <button onclick="UlashCourier.setTab('available')" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700">
                        Yangi buyurtmalarni ko‘rish
                    </button>
                </div>
            `;
        }

        return `
            <div class="space-y-6">
                ${orders.map(order => `
                    <div class="bg-white rounded-3xl border-2 border-blue-200 p-6 shadow-md">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-lg font-black text-blue-600">Buyurtma #${order.id}</span>
                                    <span class="px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Yo‘lda' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-blue-100 text-blue-800'}">
                                        ● ${order.status}
                                    </span>
                                </div>
                                <div class="text-xs text-slate-400 mt-0.5">Rasmiylashtirilgan vaqti: ${UlashStore.formatDate(order.createdAt)}</div>
                            </div>

                            <!-- Mijoz bilan bog'lanish tugmasi -->
                            <a href="tel:${order.customer.phone}" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center gap-2 transition">
                                <span>📞</span>
                                <span>Mijozga qo‘ng‘iroq: ${order.customer.phone}</span>
                            </a>
                        </div>

                        <!-- Manzillar va marshrut -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div class="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1.5">
                                    <span>🏬</span> Olish manzili (Filial):
                                </div>
                                <div class="font-bold text-slate-800 text-sm">${order.branchName}</div>
                                <div class="text-xs text-slate-500 mt-1">Ushbu filialdan qutilarni oling</div>
                            </div>

                            <div class="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                                <div class="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1.5">
                                    <span>📍</span> Topshirish manzili:
                                </div>
                                <div class="font-bold text-slate-800 text-sm">${order.customer.address}</div>
                                <div class="text-xs text-slate-600 mt-1">Qabul qiluvchi: <b>${order.customer.name}</b></div>
                            </div>
                        </div>

                        <!-- Mahsulotlar ro'yxati -->
                        <div class="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                            <div class="text-xs font-bold text-slate-700 mb-2">Buyurtma tarkibi:</div>
                            <div class="space-y-2">
                                ${order.items.map(item => `
                                    <div class="flex items-center justify-between text-xs">
                                        <div class="flex items-center gap-2">
                                            <img src="${item.image}" class="w-8 h-8 rounded object-cover bg-white border">
                                            <span class="font-semibold text-slate-800">${item.quantity} x ${item.name}</span>
                                        </div>
                                        <span class="font-bold text-slate-700">${UlashStore.formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="pt-2 border-t border-slate-200 mt-3 flex justify-between font-bold text-xs text-slate-900">
                                <span>Mijozdan olinadigan jami summa:</span>
                                <span class="text-blue-600 text-sm">${UlashStore.formatPrice(order.total)} (${order.paymentMethod})</span>
                            </div>
                        </div>

                        <!-- Holatni yangilash tugmalari -->
                        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <button onclick="UlashCourier.cancelDelivery('${order.id}')" class="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition">
                                ✕ Buyurtmani bekor qilish
                            </button>

                            <div class="flex gap-2">
                                ${order.status === 'Kuryer qabul qildi' ? `
                                    <button onclick="UlashCourier.updateStatus('${order.id}', 'Yo‘lda', 'Kuryer buyurtmani filialdan oldi va yo‘lga chiqdi')" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200 transition flex items-center gap-2">
                                        <span>🛵</span>
                                        <span>Yo‘lga chiqdim (Yo‘lda)</span>
                                    </button>
                                ` : ''}

                                ${order.status === 'Yo‘lda' ? `
                                    <button onclick="UlashCourier.updateStatus('${order.id}', 'Yetkazib berildi', 'Buyurtma mijozga topshirildi va to‘lov qabul qilindi')" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 transition flex items-center gap-2">
                                        <span>✅</span>
                                        <span>Mijozga yetkazdim (Yetkazildi)</span>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderHistoryOrders(orders) {
        if (orders.length === 0) {
            return `
                <div class="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
                    <p class="text-slate-500 text-xs">Hozircha yetkazilgan buyurtmalar tarixi mavjud emas.</p>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="p-3.5">ID & Vaqt</th>
                            <th class="p-3.5">Mijoz</th>
                            <th class="p-3.5">Manzil</th>
                            <th class="p-3.5">Summa</th>
                            <th class="p-3.5">Holati</th>
                            <th class="p-3.5 text-right">Kuryer daromadi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${orders.map(o => `
                            <tr class="hover:bg-slate-50/80 transition">
                                <td class="p-3.5 font-bold text-slate-800">
                                    #${o.id}
                                    <div class="text-[10px] text-slate-400 font-normal">${UlashStore.formatDate(o.createdAt)}</div>
                                </td>
                                <td class="p-3.5 font-medium text-slate-700">${o.customer.name}</td>
                                <td class="p-3.5 text-slate-600 max-w-[200px] truncate" title="${o.customer.address}">${o.customer.address}</td>
                                <td class="p-3.5 font-bold text-slate-900">${UlashStore.formatPrice(o.total)}</td>
                                <td class="p-3.5">
                                    <span class="px-2 py-0.5 rounded text-[11px] font-bold ${o.status === 'Yetkazib berildi' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                                        ${o.status}
                                    </span>
                                </td>
                                <td class="p-3.5 text-right font-black ${o.status === 'Yetkazib berildi' ? 'text-emerald-600' : 'text-slate-400'}">
                                    ${o.status === 'Yetkazib berildi' ? '+12 000 so‘m' : '0 so‘m'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    acceptOrder(orderId) {
        const courier = this.getCurrentCourier();
        const res = window.ulashStore.courierAcceptOrder(orderId, courier);

        if (res.success) {
            window.ulashCatalog.showToast(`Buyurtma #${orderId} qabul qilindi! "Faol buyurtmalarim"ga o‘tildi.`);
            this.setTab('my-active');
        } else {
            alert(res.message);
            this.renderCourierPanel();
        }
    },

    updateStatus(orderId, newStatus, note) {
        const ok = window.ulashStore.updateOrderStatus(orderId, newStatus, note);
        if (ok) {
            if (newStatus === 'Yetkazib berildi') {
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 100, spread: 60, origin: { y: 0.5 } });
                }
                window.ulashCatalog.showToast(`Buyurtma #${orderId} muvaffaqiyatli yetkazildi! Balansingizga +12 000 so‘m qo‘shildi 🎉`);
            } else {
                window.ulashCatalog.showToast(`Buyurtma holati "${newStatus}"ga yangilandi!`);
            }
            this.renderCourierPanel();
        }
    },

    cancelDelivery(orderId) {
        const reason = prompt("Buyurtmani bekor qilish sababini kiriting:", "Mijoz bilan bog'lanib bo'lmadi");
        if (reason) {
            window.ulashStore.cancelOrder(orderId, `Kuryer tomonidan bekor qilindi: ${reason}`);
            window.ulashCatalog.showToast(`Buyurtma #${orderId} bekor qilindi.`);
            this.renderCourierPanel();
        }
    }
};

window.ulashCourier = UlashCourier;
