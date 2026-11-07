/**
 * ULASH MARKET - Katalog, Qidiruv va Savatcha Boshqaruvi
 * Mahsulotlarni filtrlash, ko'rish, savatchaga qo'shish va hisoblash
 */

const UlashCatalog = {
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    onlyDiscounted: false,

    init() {
        this.renderCategoriesNav();
        this.renderProducts();
        this.renderCartCounter();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Global qidiruv inputi
        const searchInputs = document.querySelectorAll('.global-search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim().toLowerCase();
                this.renderProducts();
            });
        });

        // Savatcha o'zgarganda yangilash
        window.ulashStore.subscribe('CART_UPDATED', () => {
            this.renderCartCounter();
            this.renderCartModalContent();
        });

        // Mahsulotlar o'zgarganda (masalan admin qo'shsa yoki o'zgartirsa)
        window.ulashStore.subscribe('PRODUCTS_UPDATED', () => {
            this.renderProducts();
            this.renderCartModalContent();
        });
    },

    renderCategoriesNav() {
        const container = document.getElementById('categories-strip');
        if (!container) return;

        const categories = window.ulashStore.getCategories();
        
        let html = `
            <button onclick="UlashCatalog.filterByCategory('all')" 
                class="category-pill shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${this.selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}">
                <span>⚡ Barchasi</span>
            </button>
        `;

        const categoryIcons = {
            'smartfonlar': '📱',
            'noutbuklar': '💻',
            'maishiy-texnika': '📺',
            'kiyim': '👕',
            'oziq-ovqat': '🍏',
            'gozallik': '✨',
            'sport': '⚽'
        };

        categories.forEach(cat => {
            const isSelected = this.selectedCategory === cat.id;
            const emoji = categoryIcons[cat.id] || '📦';
            html += `
                <button onclick="UlashCatalog.filterByCategory('${cat.id}')" 
                    class="category-pill shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200 font-semibold' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}">
                    <span>${emoji}</span>
                    <span>${cat.name}</span>
                </button>
            `;
        });

        container.innerHTML = html;
    },

    filterByCategory(categoryId) {
        this.selectedCategory = categoryId;
        this.renderCategoriesNav();
        this.renderProducts();

        // Agar katalog sahifasida bo'lmasa, katalogga scroll yoki navigatsiya
        const catalogSection = document.getElementById('catalog-section');
        if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    },

    getFilteredProducts() {
        let products = window.ulashStore.getProducts();

        // Kategoriya filtri
        if (this.selectedCategory && this.selectedCategory !== 'all') {
            products = products.filter(p => p.category === this.selectedCategory);
        }

        // Qidiruv
        if (this.searchQuery) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.brand.toLowerCase().includes(this.searchQuery) ||
                (p.description && p.description.toLowerCase().includes(this.searchQuery))
            );
        }

        // Faqat chegirmali
        if (this.onlyDiscounted) {
            products = products.filter(p => p.discountPercent > 0);
        }

        // Saralash
        if (this.sortBy === 'price-asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (this.sortBy === 'price-desc') {
            products.sort((a, b) => b.price - a.price);
        } else if (this.sortBy === 'rating') {
            products.sort((a, b) => b.rating - a.rating);
        }

        return products;
    },

    renderProducts() {
        const grid = document.getElementById('products-grid');
        const countLabel = document.getElementById('products-count');
        if (!grid) return;

        const products = this.getFilteredProducts();

        if (countLabel) {
            countLabel.textContent = `${products.length} ta mahsulot topildi`;
        }

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div class="w-20 h-20 mx-auto mb-4 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl">
                        🔍
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Afsuski, hech narsa topilmadi</h3>
                    <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">
                        Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyalarni tanlang.
                    </p>
                    <button onclick="UlashCatalog.resetFilters()" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
                        Barcha filtrlarni tozalash
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(p => this.createProductCardHtml(p)).join('');
    },

    createProductCardHtml(p) {
        const hasDiscount = p.discountPercent > 0;
        const isOutOfStock = p.stock <= 0;
        const isLowStock = p.stock > 0 && p.stock <= 5;

        return `
            <div class="product-card group bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-slate-200/80 transition-all duration-200">
                <!-- Rasm va Belgilar -->
                <div class="product-image-container aspect-square relative bg-slate-50 cursor-pointer" onclick="UlashCatalog.openProductModal('${p.id}')">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'">
                    
                    <!-- Badges -->
                    <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                        ${hasDiscount ? `<span class="badge-discount shadow-sm">-${p.discountPercent}%</span>` : ''}
                        ${p.badge ? `<span class="badge-tag shadow-sm bg-white/90 backdrop-blur-sm">${p.badge}</span>` : ''}
                    </div>

                    <!-- Ombor holati belgisi -->
                    <div class="absolute bottom-2.5 left-2.5">
                        ${isOutOfStock ? 
                            `<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700">Tugagan</span>` :
                            isLowStock ? 
                            `<span class="badge-low-stock shadow-sm">Faqat ${p.stock} dona qoldi</span>` :
                            `<span class="badge-stock shadow-sm">Omborda: ${p.stock} dona</span>`
                        }
                    </div>

                    <!-- Quick View Overlay -->
                    <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="px-3 py-1.5 bg-white/95 text-slate-800 text-xs font-semibold rounded-lg shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            Tezkor ko‘rish 👁️
                        </span>
                    </div>
                </div>

                <!-- Kontent -->
                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span class="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">${p.brand}</span>
                            <div class="flex items-center gap-1 font-semibold text-amber-500">
                                <span>⭐</span>
                                <span>${p.rating}</span>
                                <span class="text-slate-400 font-normal">(${p.reviewsCount})</span>
                            </div>
                        </div>

                        <h3 class="font-semibold text-slate-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer mb-2" onclick="UlashCatalog.openProductModal('${p.id}')" title="${p.name}">
                            ${p.name}
                        </h3>
                    </div>

                    <div class="pt-2 border-t border-slate-100 mt-2">
                        <!-- Narx -->
                        <div class="mb-3">
                            ${hasDiscount ? `
                                <div class="text-xs text-slate-400 line-through">
                                    ${UlashStore.formatPrice(p.originalPrice)}
                                </div>
                            ` : ''}
                            <div class="text-base font-bold text-slate-900">
                                ${UlashStore.formatPrice(p.price)}
                            </div>
                        </div>

                        <!-- Savatchaga qo'shish tugmasi -->
                        ${isOutOfStock ? `
                            <button disabled class="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed text-center">
                                Hozirda mavjud emas
                            </button>
                        ` : `
                            <button onclick="UlashCatalog.quickAddToCart('${p.id}', event)" class="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95">
                                <span>🛒</span>
                                <span>Savatchaga</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    quickAddToCart(productId, event) {
        if (event) event.stopPropagation();
        window.ulashStore.addToCart(productId, 1);
        
        // Kichik bildirishnoma / Toast
        this.showToast("Mahsulot savatchaga muvaffaqiyatli qo‘shildi! 🛒");
    },

    openProductModal(productId) {
        const product = window.ulashStore.getProductById(productId);
        if (!product) return;

        const modal = document.getElementById('product-detail-modal');
        const content = document.getElementById('product-detail-content');
        if (!modal || !content) return;

        const hasDiscount = product.discountPercent > 0;
        const isOutOfStock = product.stock <= 0;

        let specsHtml = '';
        if (product.specs) {
            specsHtml = Object.entries(product.specs).map(([key, val]) => `
                <div class="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                    <span class="text-slate-500">${key}:</span>
                    <span class="font-medium text-slate-800 text-right">${val}</span>
                </div>
            `).join('');
        }

        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <!-- Rasm -->
                <div class="rounded-2xl overflow-hidden bg-slate-50 relative border border-slate-200">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-80 md:h-96 object-cover">
                    ${hasDiscount ? `<span class="absolute top-4 left-4 badge-discount text-sm shadow-md">-${product.discountPercent}% Chegirma</span>` : ''}
                    <span class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold shadow">
                        ${isOutOfStock ? '<span class="text-rose-600">Tugagan</span>' : `<span class="text-emerald-600">Omborda: ${product.stock} dona mavjud</span>`}
                    </span>
                </div>

                <!-- Tafsilotlar -->
                <div class="flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold">${product.brand}</span>
                            <span class="text-xs text-slate-400">•</span>
                            <div class="flex items-center gap-1 text-xs font-bold text-amber-500">
                                <span>⭐ ${product.rating}</span>
                                <span class="text-slate-400 font-normal">(${product.reviewsCount} sharh)</span>
                            </div>
                        </div>

                        <h2 class="text-xl md:text-2xl font-bold text-slate-900 mb-3">${product.name}</h2>

                        <!-- Narx bloki -->
                        <div class="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                            <div class="flex items-baseline gap-3">
                                <span class="text-2xl md:text-3xl font-extrabold text-blue-600">
                                    ${UlashStore.formatPrice(product.price)}
                                </span>
                                ${hasDiscount ? `
                                    <span class="text-sm text-slate-400 line-through">
                                        ${UlashStore.formatPrice(product.originalPrice)}
                                    </span>
                                ` : ''}
                            </div>
                            <p class="text-[11px] text-slate-500 mt-1">Yetkazib berish: 1 kunda (eng yaqin filial orqali)</p>
                        </div>

                        <!-- Tavsif -->
                        <div class="mb-4">
                            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tavsif</h4>
                            <p class="text-xs md:text-sm text-slate-600 leading-relaxed">${product.description || "Mahsulot haqida to'liq ma'lumot tez orada joylanadi."}</p>
                        </div>

                        <!-- Texnik xususiyatlar -->
                        ${specsHtml ? `
                            <div class="mb-4">
                                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Asosiy xususiyatlari</h4>
                                <div class="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                    ${specsHtml}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Harakat tugmalari -->
                    <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                        ${isOutOfStock ? `
                            <button disabled class="w-full py-3 bg-slate-200 text-slate-500 font-semibold rounded-xl cursor-not-allowed">
                                Hozirda omborda qolmagan
                            </button>
                        ` : `
                            <button onclick="UlashCatalog.quickAddToCart('${product.id}'); UlashCatalog.closeProductModal();" class="flex-1 py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl transition flex items-center justify-center gap-2 border border-blue-200">
                                <span>🛒</span>
                                <span>Savatchaga qo‘shish</span>
                            </button>
                            <button onclick="UlashCatalog.buyNow('${product.id}')" class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                <span>⚡</span>
                                <span>Bir bosishda xarid qilish</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeProductModal() {
        const modal = document.getElementById('product-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    buyNow(productId) {
        window.ulashStore.addToCart(productId, 1);
        this.closeProductModal();
        if (window.ulashApp) {
            window.ulashApp.navigateTo('checkout');
        }
    },

    resetFilters() {
        this.selectedCategory = 'all';
        this.searchQuery = '';
        this.onlyDiscounted = false;
        this.sortBy = 'default';

        const searchInputs = document.querySelectorAll('.global-search-input');
        searchInputs.forEach(i => i.value = '');

        this.renderCategoriesNav();
        this.renderProducts();
    },

    // --- Savatcha hisoblagich va Modal ---
    renderCartCounter() {
        const summary = window.ulashStore.getCartSummary();
        const badgeEls = document.querySelectorAll('.cart-badge-count');
        badgeEls.forEach(badge => {
            badge.textContent = summary.totalItems;
            if (summary.totalItems > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });

        const totalEls = document.querySelectorAll('.cart-total-header');
        totalEls.forEach(el => {
            el.textContent = UlashStore.formatPrice(summary.subtotal);
        });
    },

    openCartModal() {
        this.renderCartModalContent();
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    },

    closeCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    renderCartModalContent() {
        const container = document.getElementById('cart-modal-items');
        const summaryContainer = document.getElementById('cart-modal-summary');
        if (!container || !summaryContainer) return;

        const summary = window.ulashStore.getCartSummary();
        const items = summary.items;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="py-12 text-center">
                    <div class="w-20 h-20 mx-auto mb-3 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl">
                        🛒
                    </div>
                    <h4 class="font-bold text-slate-800 text-lg mb-1">Savatchangiz bo‘sh</h4>
                    <p class="text-slate-500 text-xs mb-4">Katalogdan o‘zingizga ma’qul mahsulotlarni tanlang</p>
                    <button onclick="UlashCatalog.closeCartModal(); window.ulashApp.navigateTo('home')" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700">
                        Xaridni boshlash
                    </button>
                </div>
            `;
            summaryContainer.innerHTML = '';
            return;
        }

        // Bepul yetkazib berish progressi
        const percentFree = Math.min(100, Math.round((summary.subtotal / summary.freeDeliveryThreshold) * 100));

        let freeDeliveryBanner = '';
        if (summary.isFreeDelivery) {
            freeDeliveryBanner = `
                <div class="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <span class="text-base">🎉</span>
                    <span>Tabriklaymiz! Siz uchun <b>Yetkazib berish BEPUL!</b></span>
                </div>
            `;
        } else {
            freeDeliveryBanner = `
                <div class="p-3 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                    <div class="flex justify-between font-medium mb-1.5">
                        <span>Bepul yetkazib berishgacha:</span>
                        <span class="font-bold">${UlashStore.formatPrice(summary.remainingForFreeDelivery)}</span>
                    </div>
                    <div class="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                        <div class="bg-blue-600 h-full rounded-full transition-all duration-300" style="width: ${percentFree}%"></div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = freeDeliveryBanner + items.map(item => {
            const p = window.ulashStore.getProductById(item.productId) || item.product;
            const lineTotal = p.price * item.quantity;

            return `
                <div class="flex items-center gap-4 py-3 border-b border-slate-100 last:border-none">
                    <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-xs md:text-sm text-slate-800 truncate" title="${p.name}">${p.name}</h4>
                        <div class="text-xs text-blue-600 font-bold mt-0.5">${UlashStore.formatPrice(p.price)}</div>
                        <div class="text-[11px] text-slate-400">Omborda: ${p.stock} dona</div>
                    </div>
                    
                    <!-- Miqdor o'zgartirish -->
                    <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button onclick="window.ulashStore.updateCartQuantity('${p.id}', ${item.quantity - 1})" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold text-sm">-</button>
                        <span class="w-8 text-center text-xs font-semibold text-slate-800">${item.quantity}</span>
                        <button onclick="window.ulashStore.updateCartQuantity('${p.id}', ${item.quantity + 1})" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold text-sm" ${item.quantity >= p.stock ? 'disabled' : ''}>+</button>
                    </div>

                    <div class="text-right min-w-[80px]">
                        <div class="text-xs font-bold text-slate-800">${UlashStore.formatPrice(lineTotal)}</div>
                        <button onclick="window.ulashStore.removeFromCart('${p.id}')" class="text-rose-500 hover:text-rose-700 text-xs mt-1 transition">O‘chirish</button>
                    </div>
                </div>
            `;
        }).join('');

        summaryContainer.innerHTML = `
            <div class="space-y-2 text-xs pt-2">
                <div class="flex justify-between text-slate-600">
                    <span>Mahsulotlar (${summary.totalItems} ta):</span>
                    <span>${UlashStore.formatPrice(summary.subtotal)}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                    <span>Yetkazib berish xizmati:</span>
                    <span>${summary.deliveryFee === 0 ? '<span class="text-emerald-600 font-bold">BEPUL</span>' : UlashStore.formatPrice(summary.deliveryFee)}</span>
                </div>
                <div class="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                    <span>Jami to‘lov:</span>
                    <span class="text-blue-600 text-base">${UlashStore.formatPrice(summary.total)}</span>
                </div>
            </div>

            <button onclick="UlashCatalog.goToCheckout()" class="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <span>Buyurtmani rasmiylashtirish</span>
                <span>→</span>
            </button>
        `;
    },

    goToCheckout() {
        this.closeCartModal();
        if (window.ulashApp) {
            window.ulashApp.navigateTo('checkout');
        }
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-20 md:bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs md:text-sm font-semibold transition-all transform duration-300 translate-y-4 opacity-0 ${type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'}`;
        toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> <span>${message}</span>`;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        }, 50);

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
};

window.ulashCatalog = UlashCatalog;
