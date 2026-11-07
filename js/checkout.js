/**
 * ULASH MARKET - Buyurtma Rasmiylashtirish va Yetkazib Berish Manzili (Checkout)
 * Xaritada manzil tanlash, eng yaqin filialni avtomatik biriktirish va to'lov usullari
 */

const UlashCheckout = {
    selectedBranch: null,
    selectedCoords: { lat: 41.2750, lng: 69.2100 },
    selectedPaymentMethod: 'Naqd pul (kuryerga)',

    init() {
        this.renderCheckout();
    },

    renderCheckout() {
        const container = document.getElementById('checkout-page-container');
        if (!container) return;

        const summary = window.ulashStore.getCartSummary();
        const currentUser = window.ulashStore.getCurrentUser() || {};

        if (summary.items.length === 0) {
            container.innerHTML = `
                <div class="max-w-xl mx-auto py-16 px-4 text-center">
                    <div class="w-24 h-24 mx-auto mb-6 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-5xl shadow-sm">
                        🛒
                    </div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">Savatchangizda mahsulot yo‘q</h2>
                    <p class="text-slate-500 text-sm mb-6">Buyurtma berish uchun avval do‘kondan mahsulot qo‘shing.</p>
                    <button onclick="window.ulashApp.navigateTo('home')" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                        Bosh sahifaga qaytish
                    </button>
                </div>
            `;
            return;
        }

        // Dastlabki eng yaqin filial
        const nearest = window.ulashStore.findNearestBranch(this.selectedCoords.lat, this.selectedCoords.lng);
        this.selectedBranch = nearest;

        container.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 py-8">
                <!-- Sarlavha -->
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">Buyurtmani rasmiylashtirish</h1>
                        <p class="text-xs md:text-sm text-slate-500 mt-1">Yetkazib berish manzili va to‘lov usulini tanlang</p>
                    </div>
                    <button onclick="window.ulashApp.navigateTo('home')" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                        ← Xaridni davom ettirish
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Chap Tomon: Manzil va Qabul Qiluvchi Ma'lumotlari (7 cols) -->
                    <div class="lg:col-span-7 space-y-6">
                        
                        <!-- 1. Qabul qiluvchi -->
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                                <h3 class="text-base font-bold text-slate-800">Qabul qiluvchi ma’lumotlari</h3>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Ism va familiya *</label>
                                    <input type="text" id="checkout-name" value="${currentUser.name || ''}" placeholder="Masalan: Sardor Rahimov" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">Telefon raqam *</label>
                                    <input type="tel" id="checkout-phone" value="${currentUser.phone || '+998 '}" placeholder="+998 90 123-45-67" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium">
                                </div>
                            </div>
                        </div>

                        <!-- 2. Yetkazib berish manzili va Xarita -->
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                                <div>
                                    <h3 class="text-base font-bold text-slate-800">Yetkazib berish manzili</h3>
                                    <p class="text-xs text-slate-400">Xaritada uyingizni belgilang, eng yaqin filial aniqlanadi</p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1.5">To‘liq manzil (Ko‘cha, uy, xonadon, orientir) *</label>
                                    <textarea id="checkout-address" rows="2" placeholder="Masalan: Chilonzor 7-mavze, 12-uy, 45-xonadon. Orientir: 173-maktab yonida" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium">${currentUser.defaultAddress || ''}</textarea>
                                </div>

                                <!-- Xarita tanlagich konteyneri -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                            <span>🗺️</span> Xaritada nuqtani belgilang:
                                        </span>
                                        <span class="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                                            Qizil markerni suring
                                        </span>
                                    </div>
                                    <div id="checkout-map-picker" class="w-full h-64 rounded-xl border border-slate-200 overflow-hidden shadow-inner"></div>
                                </div>

                                <!-- Eng yaqin filial haqida info-kartochka -->
                                <div id="nearest-branch-badge" class="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                                    <div class="text-2xl">🏬</div>
                                    <div class="text-xs">
                                        <div class="text-slate-500">Tayyorlanadigan eng yaqin filial:</div>
                                        <div class="font-bold text-blue-700 text-sm mt-0.5" id="nearest-branch-title">
                                            ${this.selectedBranch ? this.selectedBranch.name : 'Chilonzor Markaziy Filiali'}
                                        </div>
                                        <div class="text-slate-600 mt-1" id="nearest-branch-distance">
                                            Masofa: ~${this.selectedBranch?.distanceKm || 1.8} km • Tezkor yetkazish 30-45 daqiqa
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 3. To'lov usuli -->
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
                                <h3 class="text-base font-bold text-slate-800">To‘lov usuli</h3>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <label class="payment-method-card flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition bg-slate-50/50">
                                    <input type="radio" name="paymentMethod" value="Naqd pul (kuryerga)" checked onchange="UlashCheckout.setPaymentMethod(this.value)" class="text-blue-600 focus:ring-blue-500">
                                    <div>
                                        <div class="font-bold text-xs text-slate-800">💵 Naqd pul</div>
                                        <div class="text-[11px] text-slate-500">Kuryerga yetkazganda</div>
                                    </div>
                                </label>

                                <label class="payment-method-card flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition bg-slate-50/50">
                                    <input type="radio" name="paymentMethod" value="Click / Payme" onchange="UlashCheckout.setPaymentMethod(this.value)" class="text-blue-600 focus:ring-blue-500">
                                    <div>
                                        <div class="font-bold text-xs text-slate-800">📲 Click / Payme</div>
                                        <div class="text-[11px] text-slate-500">Tezkor onlayn to‘lov</div>
                                    </div>
                                </label>

                                <label class="payment-method-card flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition bg-slate-50/50">
                                    <input type="radio" name="paymentMethod" value="Uzcard / Humo (Terminal)" onchange="UlashCheckout.setPaymentMethod(this.value)" class="text-blue-600 focus:ring-blue-500">
                                    <div>
                                        <div class="font-bold text-xs text-slate-800">💳 Karta (Terminal)</div>
                                        <div class="text-[11px] text-slate-500">Kuryer terminalida</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>

                    <!-- O'ng Tomon: Buyurtma Xulosasi (5 cols) -->
                    <div class="lg:col-span-5">
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-24">
                            <h3 class="text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                                <span>Buyurtmangiz tarkibi</span>
                                <span class="text-xs font-semibold text-slate-500">${summary.totalItems} ta mahsulot</span>
                            </h3>

                            <!-- Mahsulotlar ro'yxati -->
                            <div class="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
                                ${summary.items.map(item => {
                                    const p = window.ulashStore.getProductById(item.productId) || item.product;
                                    return `
                                        <div class="flex items-center gap-3">
                                            <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100">
                                            <div class="flex-1 min-w-0">
                                                <div class="text-xs font-semibold text-slate-800 truncate">${p.name}</div>
                                                <div class="text-[11px] text-slate-500">${item.quantity} x ${UlashStore.formatPrice(p.price)}</div>
                                            </div>
                                            <div class="text-xs font-bold text-slate-800">
                                                ${UlashStore.formatPrice(p.price * item.quantity)}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Narxlar hisob-kitobi -->
                            <div class="space-y-2.5 text-xs pt-3 border-t border-slate-100">
                                <div class="flex justify-between text-slate-600">
                                    <span>Mahsulotlar summasi:</span>
                                    <span class="font-semibold text-slate-800">${UlashStore.formatPrice(summary.subtotal)}</span>
                                </div>
                                <div class="flex justify-between text-slate-600">
                                    <span>Yetkazib berish xizmati:</span>
                                    <span>${summary.deliveryFee === 0 ? '<span class="text-emerald-600 font-bold">BEPUL</span>' : UlashStore.formatPrice(summary.deliveryFee)}</span>
                                </div>
                                <div class="flex justify-between text-slate-900 font-bold text-sm pt-3 border-t border-slate-200">
                                    <span>Jami to‘lov summasi:</span>
                                    <span class="text-blue-600 text-lg font-extrabold">${UlashStore.formatPrice(summary.total)}</span>
                                </div>
                            </div>

                            <!-- Buyurtma berish tugmasi -->
                            <button id="btn-submit-order" onclick="UlashCheckout.submitOrder()" class="w-full mt-6 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group active:scale-[0.98]">
                                <span>Buyurtmani tasdiqlash</span>
                                <span class="group-hover:translate-x-1 transition-transform">✓</span>
                            </button>

                            <p class="text-[11px] text-slate-400 text-center mt-3">
                                "Tasdiqlash" tugmasini bosish orqali siz xizmat ko‘rsatish shartlariga rozilik bildirasiz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Xaritani faollashtirish
        setTimeout(() => {
            window.ulashMap.initCheckoutMapPicker('checkout-map-picker', this.selectedCoords.lat, this.selectedCoords.lng, (location) => {
                this.selectedCoords = { lat: location.lat, lng: location.lng };
                this.selectedBranch = location.nearestBranch;

                const branchTitle = document.getElementById('nearest-branch-title');
                const branchDist = document.getElementById('nearest-branch-distance');
                if (branchTitle && location.nearestBranch) {
                    branchTitle.textContent = location.nearestBranch.name;
                    branchDist.textContent = `Masofa: ~${location.nearestBranch.distanceKm} km • Filial manzili: ${location.nearestBranch.shortName}`;
                }
            });
        }, 150);
    },

    setPaymentMethod(val) {
        this.selectedPaymentMethod = val;
    },

    submitOrder() {
        const nameInput = document.getElementById('checkout-name');
        const phoneInput = document.getElementById('checkout-phone');
        const addressInput = document.getElementById('checkout-address');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const address = addressInput ? addressInput.value.trim() : '';

        if (!name || name.length < 2) {
            alert("Iltimos, ism va familiyangizni kiriting!");
            nameInput.focus();
            return;
        }

        if (!phone || phone.replace(/\D/g, '').length < 9) {
            alert("Iltimos, to'liq telefon raqamingizni kiriting!");
            phoneInput.focus();
            return;
        }

        if (!address || address.length < 5) {
            alert("Iltimos, yetkazib berish manzilini to'liq kiriting!");
            addressInput.focus();
            return;
        }

        const summary = window.ulashStore.getCartSummary();
        const nearestBranch = this.selectedBranch || window.ulashStore.getBranches()[0];

        const orderData = {
            customer: {
                name,
                phone,
                address,
                district: nearestBranch ? nearestBranch.district : 'Toshkent',
                lat: this.selectedCoords.lat,
                lng: this.selectedCoords.lng
            },
            items: summary.items.map(item => {
                const p = window.ulashStore.getProductById(item.productId) || item.product;
                return {
                    productId: p.id,
                    name: p.name,
                    price: p.price,
                    quantity: item.quantity,
                    image: p.image
                };
            }),
            subtotal: summary.subtotal,
            deliveryFee: summary.deliveryFee,
            total: summary.total,
            paymentMethod: this.selectedPaymentMethod,
            branchId: nearestBranch ? nearestBranch.id : 'br-1',
            branchName: nearestBranch ? nearestBranch.name : 'Chilonzor Markaziy Filiali',
            distanceKm: nearestBranch ? nearestBranch.distanceKm : 2.0
        };

        const newOrder = window.ulashStore.createOrder(orderData);

        // Bayramona salyut / Confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        window.ulashCatalog.showToast(`Buyurtma #${newOrder.id} muvaffaqiyatli qabul qilindi! 🎉`);

        // Buyurtmalar sahifasiga yoki kuzatuvga o'tish
        setTimeout(() => {
            if (window.ulashApp) {
                window.ulashApp.navigateTo('orders', { highlightOrderId: newOrder.id });
            }
        }, 600);
    }
};

window.ulashCheckout = UlashCheckout;
