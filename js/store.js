/**
 * ULASH MARKET - Yagona Reaktiv Holat Boshqaruvi (Unified Reactive Store)
 * LocalStorage + BroadcastChannel orqali oynalararo real-time sinxronizatsiya
 */

class UlashStore {
    constructor() {
        this.STORAGE_KEYS = {
            PRODUCTS: 'ulash_products',
            CATEGORIES: 'ulash_categories',
            BRANCHES: 'ulash_branches',
            COURIERS: 'ulash_couriers',
            USERS: 'ulash_users',
            ORDERS: 'ulash_orders',
            SETTINGS: 'ulash_settings',
            CURRENT_USER: 'ulash_current_user',
            CART: 'ulash_cart'
        };

        this.listeners = new Map();
        this.broadcastChannel = null;

        this.initBroadcastChannel();
        this.initData();
    }

    initBroadcastChannel() {
        if ('BroadcastChannel' in window) {
            this.broadcastChannel = new BroadcastChannel('ulash_market_sync');
            this.broadcastChannel.onmessage = (event) => {
                const { type, payload } = event.data;
                this.notify(type, payload, false);
            };
        }

        // Brauzer storage event fallback
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('ulash_')) {
                this.notify('STORAGE_SYNC', { key: e.key });
            }
        });
    }

    initData() {
        if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.BRANCHES)) {
            localStorage.setItem(this.STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.COURIERS)) {
            localStorage.setItem(this.STORAGE_KEYS.COURIERS, JSON.stringify(INITIAL_COURIERS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
            localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
            localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
            localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
        }

        // Standart foydalanuvchi sessiyasi
        if (!this.getCurrentUser()) {
            this.setCurrentUser({
                id: 'usr-1',
                name: 'Anvar Qosimov',
                phone: '+998 90 555-11-22',
                email: 'anvar@gmail.com',
                role: 'user', // 'user' | 'courier' | 'admin'
                defaultAddress: "Chilonzor 7-mavze, 12-uy, 45-xonadon",
                district: 'Chilonzor',
                lat: 41.2750,
                lng: 69.2100
            });
        }
    }

    // Obuna tizimi (Event Pub/Sub)
    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType).add(callback);

        return () => {
            const list = this.listeners.get(eventType);
            if (list) list.delete(callback);
        };
    }

    notify(eventType, payload = {}, broadcast = true) {
        if (this.listeners.has(eventType)) {
            for (const cb of this.listeners.get(eventType)) {
                try { cb(payload); } catch (err) { console.error('Subscription callback error:', err); }
            }
        }
        if (this.listeners.has('*')) {
            for (const cb of this.listeners.get('*')) {
                try { cb({ eventType, payload }); } catch (err) { console.error('Generic callback error:', err); }
            }
        }

        if (broadcast && this.broadcastChannel) {
            this.broadcastChannel.postMessage({ type: eventType, payload });
        }
    }

    // --- Current User & Session ---
    getCurrentUser() {
        const str = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
        return str ? JSON.parse(str) : null;
    }

    setCurrentUser(user) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        this.notify('USER_CHANGED', user);
    }

    logout() {
        // Standart mehmon foydalanuvchiga qaytarish
        this.setCurrentUser({
            id: 'guest',
            name: 'Mehmon foydalanuvchi',
            phone: '',
            email: '',
            role: 'user'
        });
        this.notify('LOGOUT');
    }

    loginUser(phoneOrEmail, password, role = 'user') {
        const users = this.getUsers();
        const couriers = this.getCouriers();

        if (role === 'courier') {
            const foundCourier = couriers.find(c => c.phone.replace(/\D/g, '') === phoneOrEmail.replace(/\D/g, '') || c.email === phoneOrEmail) || couriers[0];
            const sessionData = {
                ...foundCourier,
                role: 'courier'
            };
            this.setCurrentUser(sessionData);
            return { success: true, user: sessionData };
        } else {
            let foundUser = users.find(u => u.phone.replace(/\D/g, '') === phoneOrEmail.replace(/\D/g, '') || u.email === phoneOrEmail);
            if (!foundUser) {
                // Yangi foydalanuvchi avtomatik ro'yxatdan o'tadi
                foundUser = {
                    id: 'usr-' + Date.now().toString(36),
                    name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Yangi Mijoz',
                    phone: phoneOrEmail.includes('@') ? '+998 90 000-00-00' : phoneOrEmail,
                    email: phoneOrEmail.includes('@') ? phoneOrEmail : '',
                    role: 'user',
                    defaultAddress: "Toshkent shahri",
                    district: 'Chilonzor',
                    lat: 41.2750,
                    lng: 69.2100,
                    registeredAt: new Date().toISOString().split('T')[0]
                };
                users.push(foundUser);
                localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
            }
            this.setCurrentUser(foundUser);
            return { success: true, user: foundUser };
        }
    }

    verifyAdminSecret(pin) {
        const settings = this.getSettings();
        if (pin === settings.adminSecretPin || pin === 'admin123' || pin === '7777') {
            const adminUser = {
                id: 'admin-1',
                name: 'Bosh Direktor (Admin)',
                role: 'admin',
                email: 'director@ulashmarket.uz',
                phone: '+998 71 200-00-01'
            };
            this.setCurrentUser(adminUser);
            return { success: true, user: adminUser };
        }
        return { success: false, message: "Noto'g'ri maxfiy admin paroli!" };
    }

    // --- Products ---
    getProducts() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRODUCTS) || '[]');
    }

    getProductById(id) {
        return this.getProducts().find(p => p.id === id);
    }

    saveProducts(products) {
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        this.notify('PRODUCTS_UPDATED', products);
    }

    addProduct(productData) {
        const products = this.getProducts();
        const newProduct = {
            id: 'p-' + Date.now().toString(36),
            name: productData.name,
            brand: productData.brand || 'Boshqa',
            category: productData.category || 'smartfonlar',
            price: Number(productData.price) || 0,
            originalPrice: Number(productData.originalPrice || productData.price),
            discountPercent: Number(productData.discountPercent) || 0,
            stock: Number(productData.stock) || 0,
            rating: 5.0,
            reviewsCount: 1,
            image: productData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            description: productData.description || '',
            isFeatured: Boolean(productData.isFeatured),
            badge: productData.badge || 'Yangi',
            specs: productData.specs || { "Kafolat": "1 yil rasmiy" }
        };
        products.unshift(newProduct);
        this.saveProducts(products);
        return newProduct;
    }

    updateProduct(id, updatedFields) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        this.saveProducts(products);
    }

    // --- Categories ---
    getCategories() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CATEGORIES) || '[]');
    }

    saveCategories(categories) {
        localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        this.notify('CATEGORIES_UPDATED', categories);
    }

    addCategory(category) {
        const list = this.getCategories();
        list.push(category);
        this.saveCategories(list);
    }

    deleteCategory(id) {
        let list = this.getCategories();
        list = list.filter(c => c.id !== id);
        this.saveCategories(list);
    }

    // --- Cart ---
    getCart() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CART) || '[]');
    }

    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
        this.notify('CART_UPDATED', cart);
    }

    addToCart(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) return;

        let cart = this.getCart();
        const existing = cart.find(item => item.productId === productId);

        if (existing) {
            const nextQty = existing.quantity + quantity;
            if (nextQty <= product.stock) {
                existing.quantity = nextQty;
            } else {
                existing.quantity = product.stock;
            }
        } else {
            cart.push({
                productId,
                product,
                quantity: Math.min(quantity, Math.max(1, product.stock))
            });
        }

        this.saveCart(cart);
    }

    updateCartQuantity(productId, quantity) {
        let cart = this.getCart();
        const product = this.getProductById(productId);
        if (!product) return;

        if (quantity <= 0) {
            cart = cart.filter(item => item.productId !== productId);
        } else {
            const item = cart.find(i => i.productId === productId);
            if (item) {
                item.quantity = Math.min(quantity, product.stock);
            }
        }
        this.saveCart(cart);
    }

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.productId !== productId);
        this.saveCart(cart);
    }

    clearCart() {
        this.saveCart([]);
    }

    getCartSummary() {
        const cart = this.getCart();
        const settings = this.getSettings();

        let subtotal = 0;
        let totalItems = 0;

        for (const item of cart) {
            const currentProduct = this.getProductById(item.productId) || item.product;
            subtotal += (currentProduct.price * item.quantity);
            totalItems += item.quantity;
        }

        const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold || subtotal === 0;
        const deliveryFee = (subtotal === 0) ? 0 : (isFreeDelivery ? 0 : settings.baseDeliveryFee);
        const total = subtotal + deliveryFee;

        return {
            items: cart,
            totalItems,
            subtotal,
            deliveryFee,
            isFreeDelivery,
            freeDeliveryThreshold: settings.freeDeliveryThreshold,
            remainingForFreeDelivery: Math.max(0, settings.freeDeliveryThreshold - subtotal),
            total
        };
    }

    // --- Orders ---
    getOrders() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ORDERS) || '[]');
    }

    saveOrders(orders) {
        localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.notify('ORDERS_UPDATED', orders);
    }

    createOrder(orderInput) {
        const orders = this.getOrders();
        const products = this.getProducts();

        // Stock kamaytirish
        for (const item of orderInput.items) {
            const p = products.find(prod => prod.id === item.productId);
            if (p) {
                p.stock = Math.max(0, p.stock - item.quantity);
            }
        }
        this.saveProducts(products);

        const newOrder = {
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            createdAt: new Date().toISOString(),
            customer: orderInput.customer,
            items: orderInput.items,
            subtotal: orderInput.subtotal,
            deliveryFee: orderInput.deliveryFee,
            discountApplied: orderInput.discountApplied || 0,
            total: orderInput.total,
            paymentMethod: orderInput.paymentMethod || 'Naqd pul (kuryerga)',
            paymentStatus: orderInput.paymentMethod?.includes('Click') || orderInput.paymentMethod?.includes('Karta') ? 'To‘langan' : 'Kutilmoqda',
            branchId: orderInput.branchId,
            branchName: orderInput.branchName,
            distanceKm: orderInput.distanceKm || 2.5,
            status: 'Yangi buyurtma', // Yangi buyurtma | Kuryer qabul qildi | Yo‘lda | Yetkazib berildi | Bekor qilindi
            courierId: null,
            courierName: null,
            courierPhone: null,
            statusHistory: [
                {
                    status: 'Yangi buyurtma',
                    time: new Date().toISOString(),
                    note: 'Buyurtma tizimga qabul qilindi. Kuryer tayinlanishi kutilmoqda.'
                }
            ]
        };

        orders.unshift(newOrder);
        this.saveOrders(orders);
        this.clearCart();

        this.notify('ORDER_CREATED', newOrder);
        return newOrder;
    }

    // Kuryer buyurtmani o'ziga qabul qilishi (Boshqa kuryer ololmaydigan qilib qulflanadi)
    courierAcceptOrder(orderId, courier) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);

        if (!order) return { success: false, message: "Buyurtma topilmadi" };
        if (order.status !== 'Yangi buyurtma') {
            return {
                success: false,
                message: `Bu buyurtma allaqachon boshqa kuryer (${order.courierName || 'boshqa'}) tomonidan qabul qilingan!`
            };
        }

        order.status = 'Kuryer qabul qildi';
        order.courierId = courier.id;
        order.courierName = courier.name;
        order.courierPhone = courier.phone;
        order.statusHistory.push({
            status: 'Kuryer qabul qildi',
            time: new Date().toISOString(),
            note: `Kuryer ${courier.name} (${courier.phone}) buyurtmani qabul qildi.`
        });

        this.saveOrders(orders);
        this.notify('ORDER_ACCEPTED', { order, courier });
        return { success: true, order };
    }

    // Kuryer yoki Admin tomonidan holatni yangilash
    updateOrderStatus(orderId, newStatus, note = '') {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) return false;

        const oldStatus = order.status;
        order.status = newStatus;
        order.statusHistory.push({
            status: newStatus,
            time: new Date().toISOString(),
            note: note || `Buyurtma holati "${newStatus}"ga o‘zgartirildi.`
        });

        // Agar Yetkazib berildi bo'lsa, to'lov holatini To'langan qilamiz va kuryer balansiga komissiya qo'shamiz
        if (newStatus === 'Yetkazib berildi') {
            order.paymentStatus = 'To‘langan';
            if (order.courierId) {
                this.creditCourierEarnings(order.courierId);
            }
        }

        this.saveOrders(orders);
        this.notify('ORDER_STATUS_CHANGED', { order, oldStatus, newStatus });
        return true;
    }

    cancelOrder(orderId, reason = 'Mijoz yoki admin tomonidan bekor qilindi') {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) return false;

        order.status = 'Bekor qilindi';
        order.statusHistory.push({
            status: 'Bekor qilindi',
            time: new Date().toISOString(),
            note: reason
        });

        // Ombordagi mahsulotlarni qaytarish
        const products = this.getProducts();
        for (const item of order.items) {
            const p = products.find(prod => prod.id === item.productId);
            if (p) p.stock += item.quantity;
        }
        this.saveProducts(products);

        this.saveOrders(orders);
        this.notify('ORDER_CANCELLED', { order, reason });
        return true;
    }

    // --- Branches & Map ---
    getBranches() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BRANCHES) || '[]');
    }

    saveBranches(branches) {
        localStorage.setItem(this.STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
        this.notify('BRANCHES_UPDATED', branches);
    }

    addBranch(branchData) {
        const branches = this.getBranches();
        const newBranch = {
            id: 'br-' + Date.now().toString(36),
            name: branchData.name,
            shortName: branchData.shortName || branchData.name,
            address: branchData.address,
            district: branchData.district || 'Toshkent',
            phone: branchData.phone || '+998 71 200-00-00',
            workingHours: branchData.workingHours || '08:00 - 23:00',
            lat: Number(branchData.lat) || 41.2995,
            lng: Number(branchData.lng) || 69.2401,
            manager: branchData.manager || 'Filial Mudiri',
            activeOrdersCount: 0,
            isWarehouse: true
        };
        branches.push(newBranch);
        this.saveBranches(branches);
        return newBranch;
    }

    updateBranch(id, branchData) {
        const branches = this.getBranches();
        const index = branches.findIndex(b => b.id === id);
        if (index !== -1) {
            branches[index] = { ...branches[index], ...branchData };
            this.saveBranches(branches);
            return branches[index];
        }
        return null;
    }

    deleteBranch(id) {
        let branches = this.getBranches();
        branches = branches.filter(b => b.id !== id);
        this.saveBranches(branches);
    }

    // Eng yaqin filialni hisoblash (Haversine Formula)
    findNearestBranch(userLat, userLng) {
        const branches = this.getBranches();
        if (!branches.length) return null;

        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Yer radiusi km larda

        let nearest = null;
        let minDistance = Infinity;

        for (const branch of branches) {
            const dLat = toRad(branch.lat - userLat);
            const dLon = toRad(branch.lng - userLng);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(userLat)) * Math.cos(toRad(branch.lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            if (distance < minDistance) {
                minDistance = distance;
                nearest = { ...branch, distanceKm: parseFloat(distance.toFixed(1)) };
            }
        }

        return nearest;
    }

    // --- Couriers ---
    getCouriers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.COURIERS) || '[]');
    }

    saveCouriers(couriers) {
        localStorage.setItem(this.STORAGE_KEYS.COURIERS, JSON.stringify(couriers));
        this.notify('COURIERS_UPDATED', couriers);
    }

    addCourier(courierData) {
        const couriers = this.getCouriers();
        const newCourier = {
            id: 'cour-' + Date.now().toString(36),
            name: courierData.name,
            phone: courierData.phone,
            email: courierData.email || '',
            transport: courierData.transport || 'Skuter',
            rating: 5.0,
            completedOrders: 0,
            earningsTotal: 0,
            status: 'online',
            currentLocation: { lat: 41.2995, lng: 69.2401 },
            assignedBranchId: courierData.assignedBranchId || 'br-1'
        };
        couriers.push(newCourier);
        this.saveCouriers(couriers);
        return newCourier;
    }

    creditCourierEarnings(courierId) {
        const couriers = this.getCouriers();
        const courier = couriers.find(c => c.id === courierId);
        const settings = this.getSettings();

        if (courier) {
            courier.completedOrders = (courier.completedOrders || 0) + 1;
            courier.earningsTotal = (courier.earningsTotal || 0) + (settings.courierCommission || 12000);
            this.saveCouriers(couriers);
        }
    }

    // --- Users ---
    getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
    }

    // --- Settings ---
    getSettings() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SETTINGS) || JSON.stringify(INITIAL_SETTINGS));
    }

    saveSettings(settings) {
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        this.notify('SETTINGS_UPDATED', settings);
    }

    // Yordamchi metodlar (Formatlash)
    static formatPrice(amount) {
        if (amount === undefined || amount === null) return '0 so‘m';
        return Number(amount).toLocaleString('uz-UZ') + " so‘m";
    }

    static formatDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('uz-UZ', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global yagona namuna (Singleton instance)
window.ulashStore = new UlashStore();
