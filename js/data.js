/**
 * ULASH MARKET - Dastlabki Tizim Ma'lumotlari (Initial Seed Data)
 * Kategoriyalar, Mahsulotlar, Filiallar, Kuryerlar va Dastlabki Buyurtmalar
 */

const INITIAL_CATEGORIES = [
    { id: 'smartfonlar', name: 'Smartfon va gadjetlar', icon: 'smartphone', badge: 'Ommabop', color: 'blue' },
    { id: 'noutbuklar', name: 'Noutbuk va kompyuterlar', icon: 'laptop', badge: 'Top', color: 'indigo' },
    { id: 'maishiy-texnika', name: 'Maishiy texnika', icon: 'tv', badge: 'Kafolatli', color: 'sky' },
    { id: 'kiyim', name: 'Kiyim va poyabzallar', icon: 'shirt', badge: 'Trend', color: 'rose' },
    { id: 'oziq-ovqat', name: 'Oziq-ovqat va ichimliklar', icon: 'shopping-bag', badge: 'Tezkor', color: 'emerald' },
    { id: 'gozallik', name: "Go'zallik va salomatlik", icon: 'sparkles', badge: 'Original', color: 'amber' },
    { id: 'sport', name: 'Sport va hordiq', icon: 'dumbbell', badge: 'Yangi', color: 'cyan' }
];

const INITIAL_PRODUCTS = [
    {
        id: 'p-1',
        name: 'iPhone 16 Pro Max 256GB Natural Titanium',
        brand: 'Apple',
        category: 'smartfonlar',
        price: 16500000,
        originalPrice: 18200000,
        discountPercent: 9,
        stock: 14,
        rating: 4.9,
        reviewsCount: 148,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        description: "Eng so'nggi A18 Pro chipiga ega flagman smartfon. Titan korpus, 48 MP asosiy kamera, 5x optik zoom va ajoyib avtonomlik. 1 yil rasmiy kafolat bilan.",
        isFeatured: true,
        badge: 'Xit savdo',
        specs: {
            "Ekran": "6.9 dyuym Super Retina XDR OLED, 120Hz",
            "Protsessor": "Apple A18 Pro (3 nm)",
            "Doimiy xotira": "256 GB",
            "Kamera": "48 MP + 48 MP + 12 MP",
            "Batareya": "4685 mA/soat, tezkor quvvatlash"
        }
    },
    {
        id: 'p-2',
        name: 'Samsung Galaxy S24 Ultra 12/512GB Titanium Gray',
        brand: 'Samsung',
        category: 'smartfonlar',
        price: 14200000,
        originalPrice: 16000000,
        discountPercent: 11,
        stock: 9,
        rating: 4.8,
        reviewsCount: 92,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        description: "Galaxy AI imkoniyatlari bilan boyitilgan titan korpusli super-flagman. S-Pen qalami, 200MP kamera va yorqin 2600 nit AMOLED displey.",
        isFeatured: true,
        badge: 'AI Tavsiya',
        specs: {
            "Ekran": "6.8 dyuym Dynamic AMOLED 2X, 120Hz",
            "Protsessor": "Snapdragon 8 Gen 3 for Galaxy",
            "Xotira": "12 GB RAM / 512 GB ROM",
            "Kamera": "200 MP + 50 MP + 12 MP + 10 MP",
            "Batareya": "5000 mA/soat"
        }
    },
    {
        id: 'p-3',
        name: 'MacBook Air 13 M3 8-Core CPU / 16GB / 512GB Space Gray',
        brand: 'Apple',
        category: 'noutbuklar',
        price: 15800000,
        originalPrice: 17500000,
        discountPercent: 10,
        stock: 6,
        rating: 4.95,
        reviewsCount: 84,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        description: "Apple M3 chipi bilan quvvatlangan engil va kuchli ultrabuk. Kun bo'yi quvvatsiz ishlaydi (18 soatgacha). Silent fanless sovutish tizimi.",
        isFeatured: true,
        badge: 'Top Tanlov',
        specs: {
            "Ekran": "13.6 dyuym Liquid Retina Display",
            "Chip": "Apple M3 (8 yadroli CPU, 10 yadroli GPU)",
            "Tezkor xotira": "16 GB birlashgan xotira",
            "SSD xotira": "512 GB tezkor NVMe",
            "Vazni": "1.24 kg"
        }
    },
    {
        id: 'p-4',
        name: 'Asus ROG Strix G16 i7-13650HX / RTX 4060 / 16GB / 1TB',
        brand: 'Asus',
        category: 'noutbuklar',
        price: 17200000,
        originalPrice: 19800000,
        discountPercent: 13,
        stock: 4,
        rating: 4.85,
        reviewsCount: 57,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
        description: "Eng og'ir zamonaviy o'yinlar va 3D modellashtirish uchun mo'ljallangan qudratli o'yin noutbuki. 165Hz tezkor ROG Nebula displey.",
        isFeatured: false,
        badge: 'Gaming',
        specs: {
            "Ekran": "16 dyuym WUXGA 165Hz 100% sRGB",
            "Protsessor": "Intel Core i7-13650HX (14 yadro)",
            "Videokarta": "NVIDIA GeForce RTX 4060 8GB GDDR6",
            "Xotira": "16 GB DDR5 / 1 TB PCIe 4.0 SSD",
            "Sovutish": "Suyuq metall sovutish ROG Intelligent"
        }
    },
    {
        id: 'p-5',
        name: 'Artel Grand Inverter Konditsioner 12000 BTU',
        brand: 'Artel',
        category: 'maishiy-texnika',
        price: 4950000,
        originalPrice: 5600000,
        discountPercent: 12,
        stock: 18,
        rating: 4.7,
        reviewsCount: 115,
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
        description: "A+++ energiya tejamkor Inverter texnologiyali konditsioner. 35 kv.m xonani bir zumda sovitadi yoki isitadi. Wi-Fi orqali smartfon bilan boshqarish.",
        isFeatured: true,
        badge: 'Kafolat 3 yil',
        specs: {
            "Maydon": "35 kv.m gacha",
            "Kompressor": "GMCC Toshiba Inverter",
            "Energiya sinfi": "A+++",
            "Shovqin darajasi": "22 dB (o'ta sokin)",
            "Qo'shimcha": "Ionizator, Wi-Fi smart boshqaruv"
        }
    },
    {
        id: 'p-6',
        name: 'Shivaki NoFrost Sovutgich HD-430FWEN White',
        brand: 'Shivaki',
        category: 'maishiy-texnika',
        price: 6400000,
        originalPrice: 7200000,
        discountPercent: 11,
        stock: 8,
        rating: 4.75,
        reviewsCount: 76,
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
        description: "To'liq No Frost texnologiyasiga ega ikki kamerali zamonaviy sovutgich. Multi Air Flow havoni bir tekis taqsimlash tizimi va Fresh Zone zonasi.",
        isFeatured: false,
        badge: 'No Frost',
        specs: {
            "Umumiy hajm": "330 litr",
            "Muzlatish quvvati": "4.5 kg/kun",
            "Energiya sarfi": "A+ klass",
            "Rang": "Klassik oq",
            "O'lchamlari": "185 x 60 x 65 sm"
        }
    },
    {
        id: 'p-7',
        name: 'Sony WH-1000XM5 Shovqinni bekor qiluvchi quloqchin',
        brand: 'Sony',
        category: 'smartfonlar',
        price: 4300000,
        originalPrice: 4800000,
        discountPercent: 10,
        stock: 12,
        rating: 4.9,
        reviewsCount: 164,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        description: "Sohadagi eng ilg'or faol shovqin bekor qilish (ANC) tizimi. 30 soatgacha to'xtovsiz musiqa tinglash imkoniyati va kristaldek toza mikrofon ovozi.",
        isFeatured: true,
        badge: 'Premium Ovoz',
        specs: {
            "Ulanish turi": "Bluetooth 5.2 va 3.5mm Aux",
            "Batareya": "30 soat ANC bilan, 40 soat ANC siz",
            "Tez quvvatlash": "3 daqiqada 3 soat ishlaydi",
            "Og'irligi": "250 gramm"
        }
    },
    {
        id: 'p-8',
        name: 'Nike Air Max 270 Black & White Original Krossovka',
        brand: 'Nike',
        category: 'kiyim',
        price: 1450000,
        originalPrice: 1900000,
        discountPercent: 24,
        stock: 22,
        rating: 4.8,
        reviewsCount: 189,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        description: "Kundalik yurish va yugurish uchun yumshoq Air Max yostiqchali original krossovka. Nafas oluvchi to'rli material va sirpanmaydigan taglik.",
        isFeatured: true,
        badge: '-24% Chegirma',
        specs: {
            "Material": "Nafas oluvchi tekstil va poliuretan",
            "Amortizatsiya": "Max Air 270 pnevmatik kamera",
            "Mavjud o'lchamlar": "39, 40, 41, 42, 43, 44",
            "Fasl": "Bahor / Yoz / Kuz"
        }
    },
    {
        id: 'p-9',
        name: 'Erkaklar uchun Klassik Paxta Kostyum-Shim Navy Blue',
        brand: 'Zara',
        category: 'kiyim',
        price: 1850000,
        originalPrice: 2300000,
        discountPercent: 20,
        stock: 11,
        rating: 4.65,
        reviewsCount: 42,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        description: "Yuqori sifatli Turkiya matosidan tikilgan zamonaviy slim-fit bichimli kostyum-shim. To'y, tantanalar va ish uchrashuvlari uchun ideal.",
        isFeatured: false,
        badge: 'Klassika',
        specs: {
            "Tarkibi": "70% paxta, 25% viskoza, 5% elastan",
            "Bichimi": "Slim Fit",
            "Rang": "To'q ko'k (Navy)",
            "Kafolat": "Formasini yo'qotmaydi"
        }
    },
    {
        id: 'p-10',
        name: 'Lattafe Asad Eau de Parfum 100ml Erkaklar Atiri',
        brand: 'Lattafa',
        category: 'gozallik',
        price: 390000,
        originalPrice: 550000,
        discountPercent: 29,
        stock: 28,
        rating: 4.88,
        reviewsCount: 230,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
        description: "Sharqona qora qahva, vanil va xushbo'y ziravorlar notalari bilan boyitilgan, 24 soatdan ortiq saqlanuvchi hashamatli erkaklar parfyumi.",
        isFeatured: true,
        badge: 'Bestseller',
        specs: {
            "Hajmi": "100 ml",
            "Turi": "Eau De Parfum (Parfyum suvi)",
            "Mustahkamligi": "24 soatgacha shleyfli",
            "Ishlab chiqarilgan": "BAA (Dubay)"
        }
    },
    {
        id: 'p-11',
        name: 'Dyson Airwrap Multi-Styler Complete Long Soch Shakllantirgich',
        brand: 'Dyson',
        category: 'gozallik',
        price: 7200000,
        originalPrice: 8100000,
        discountPercent: 11,
        stock: 5,
        rating: 4.96,
        reviewsCount: 95,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        description: "Haddan tashqari qizdirmasdan soch turmaklovchi Coanda effekti. Sochni bir vaqtning o'zida quritadi va jiloli to'lqin hosil qiladi.",
        isFeatured: true,
        badge: 'Top Brend',
        specs: {
            "Quvvat": "1300 Vt",
            "Harorat nazorati": "Sekundiga 40 marta o'lchanadi",
            "Nasatkalar": "6 xil professional nasadka",
            "Kafolat": "2 yil xalqaro kafolat"
        }
    },
    {
        id: 'p-12',
        name: 'Rio Mare Zaytun moyidagi Tuns balig‘i 3x80g (Italiya)',
        brand: 'Rio Mare',
        category: 'oziq-ovqat',
        price: 98000,
        originalPrice: 120000,
        discountPercent: 18,
        stock: 65,
        rating: 4.9,
        reviewsCount: 312,
        image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
        description: "Toza zaytun moyida konservalangan, tabiiy oqsil va Omega-3 ga boy xushbo'y tuns balig'i filesi. Salatlar va pishiriqlar uchun a'lo tanlov.",
        isFeatured: false,
        badge: 'Italiya',
        specs: {
            "Og'irligi": "3 dona x 80 gramm",
            "Tarkibi": "Sariq qanotli tunes, zaytun moyi, tuz",
            "Yaroqlilik muddati": "3 yil"
        }
    },
    {
        id: 'p-13',
        name: 'Lavazza Qualita Oro Tabiiy Donli Qahva 1kg',
        brand: 'Lavazza',
        category: 'oziq-ovqat',
        price: 320000,
        originalPrice: 380000,
        discountPercent: 16,
        stock: 35,
        rating: 4.85,
        reviewsCount: 177,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        description: "100% Markaziy va Janubiy Amerika Arabikasi donalari. Gullar va mevali nozik notalarga ega bo'lgan klassik italyancha espresso qahvasi.",
        isFeatured: false,
        badge: '100% Arabica',
        specs: {
            "Og'irligi": "1000 gramm (1 kg)",
            "Qovurilish darajasi": "O'rtacha (Medium Roast)",
            "Turi": "Butun donli qahva"
        }
    },
    {
        id: 'p-14',
        name: 'Xiaomi Electric Scooter 4 Pro Elektr Samokat 25km/soat',
        brand: 'Xiaomi',
        category: 'sport',
        price: 6800000,
        originalPrice: 7900000,
        discountPercent: 14,
        stock: 7,
        rating: 4.78,
        reviewsCount: 88,
        image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80',
        description: "Bir zaryad bilan 55 km masofani bosib o'tuvchi yangi avlod elektr samokati. 10 dyuymli tubeless mustahkam g'ildiraklar va ikki tomonlama disk tormoz.",
        isFeatured: true,
        badge: 'Tezkor Shahar',
        specs: {
            "Tezlik": "25 km/soat gacha",
            "Yurish masofasi": "55 km gacha",
            "Maksimal yuk": "120 kg",
            "Akkumulyator": "12400 mA/soat, 474 Vt/soat"
        }
    },
    {
        id: 'p-15',
        name: 'Fitnes Gantellar To‘plami 2x15kg Xrom Qoplamali',
        brand: 'Torneo',
        category: 'sport',
        price: 850000,
        originalPrice: 1100000,
        discountPercent: 23,
        stock: 19,
        rating: 4.7,
        reviewsCount: 64,
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
        description: "Uy sharoitida shug'ullanish uchun yig'iladigan qulay xromlangan gantellar to'plami. Maxsus qulflar va qulay ushlagich bilan to'liq xavfsiz.",
        isFeatured: false,
        badge: 'Sport',
        specs: {
            "Jami og'irligi": "30 kg (har biri 15 kg)",
            "Material": "Yuqori sifatli xromli po'lat",
            "Qoplamasi": "Sirpanmaydigan rezinali ushlagich"
        }
    },
    {
        id: 'p-16',
        name: 'Sony PlayStation 5 Slim 1TB + 2 ta DualSense Joystik',
        brand: 'Sony',
        category: 'noutbuklar',
        price: 7400000,
        originalPrice: 8200000,
        discountPercent: 10,
        stock: 10,
        rating: 4.97,
        reviewsCount: 204,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
        description: "Ultra ixcham o'lchamli yangi PS5 Slim versiyasi. 1TB tezkor SSD xotira va to'plamda 2 ta original oq rangli DualSense geympadi bilan.",
        isFeatured: true,
        badge: 'Xit Sotuv',
        specs: {
            "Xotira": "1 TB ultra-tezkor NVMe SSD",
            "Ruxsat": "4K 120Hz va 8K qo'llab-quvvatlaydi",
            "Komplekt": "Konsol + 2 ta DualSense + HDMI 2.1 kabel"
        }
    }
];

const INITIAL_BRANCHES = [
    {
        id: 'br-1',
        name: 'Chilonzor Markaziy Filiali',
        shortName: 'Chilonzor',
        address: "Toshkent sh., Chilonzor tumani, Qatortol ko'chasi 45-uy (Chilonzor Savdo Markazi yonida)",
        district: 'Chilonzor',
        phone: '+998 71 200-11-22',
        workingHours: '08:00 - 23:00',
        lat: 41.2721,
        lng: 69.2045,
        manager: 'Sherzod Boboyev',
        activeOrdersCount: 4,
        isWarehouse: true
    },
    {
        id: 'br-2',
        name: 'Yunusobod Filiali',
        shortName: 'Yunusobod',
        address: "Toshkent sh., Yunusobod tumani, Amir Temur shoh ko'chasi 112-uy (Metro Shahriston)",
        district: 'Yunusobod',
        phone: '+998 71 200-33-44',
        workingHours: '08:00 - 23:00',
        lat: 41.3542,
        lng: 69.2889,
        manager: 'Aziz Mahmudov',
        activeOrdersCount: 3,
        isWarehouse: true
    },
    {
        id: 'br-3',
        name: 'Mirzo Ulug‘bek Filiali',
        shortName: 'M.Ulug‘bek',
        address: "Toshkent sh., Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li ko'chasi 78-uy",
        district: "Mirzo Ulug'bek",
        phone: '+998 71 200-55-66',
        workingHours: '08:30 - 22:30',
        lat: 41.3267,
        lng: 69.3312,
        manager: 'Kamola Saidova',
        activeOrdersCount: 2,
        isWarehouse: true
    },
    {
        id: 'br-4',
        name: 'Sergeli Yangi Hayot Filiali',
        shortName: 'Sergeli',
        address: "Toshkent sh., Sergeli tumani, Yangisergeli ko'chasi 24-uy (5-metro bekati)",
        district: 'Sergeli',
        phone: '+998 71 200-77-88',
        workingHours: '08:00 - 22:00',
        lat: 41.2238,
        lng: 69.2215,
        manager: 'Otabek Xoliqov',
        activeOrdersCount: 2,
        isWarehouse: true
    }
];

const INITIAL_COURIERS = [
    {
        id: 'cour-1',
        name: 'Sardor Aliyev',
        phone: '+998 90 123-45-67',
        email: 'sardor.kuryer@gmail.com',
        transport: 'Skuter (Honda Dio)',
        rating: 4.95,
        completedOrders: 142,
        earningsTotal: 1704000,
        status: 'online', // online, busy, offline
        currentLocation: { lat: 41.278, lng: 69.215 },
        assignedBranchId: 'br-1'
    },
    {
        id: 'cour-2',
        name: 'Jasur Karimov',
        phone: '+998 93 987-65-43',
        email: 'jasur.kuryer@gmail.com',
        transport: 'Chevrolet Spark (Oq)',
        rating: 4.88,
        completedOrders: 98,
        earningsTotal: 1176000,
        status: 'online',
        currentLocation: { lat: 41.350, lng: 69.282 },
        assignedBranchId: 'br-2'
    },
    {
        id: 'cour-3',
        name: 'Bobur Rahimov',
        phone: '+998 97 555-44-33',
        email: 'bobur.kuryer@gmail.com',
        transport: 'Elektr Velosiped',
        rating: 4.91,
        completedOrders: 64,
        earningsTotal: 768000,
        status: 'online',
        currentLocation: { lat: 41.320, lng: 69.325 },
        assignedBranchId: 'br-3'
    }
];

const INITIAL_USERS = [
    {
        id: 'usr-1',
        name: 'Anvar Qosimov',
        phone: '+998 90 555-11-22',
        email: 'anvar@gmail.com',
        role: 'user',
        defaultAddress: "Chilonzor 7-mavze, 12-uy, 45-xonadon",
        district: 'Chilonzor',
        lat: 41.2750,
        lng: 69.2100,
        registeredAt: '2026-01-15'
    },
    {
        id: 'usr-2',
        name: 'Dilnoza Karimova',
        phone: '+998 94 333-22-11',
        email: 'dilnoza@gmail.com',
        role: 'user',
        defaultAddress: "Yunusobod 14-mavze, 5-uy, 18-xonadon",
        district: 'Yunusobod',
        lat: 41.3580,
        lng: 69.2850,
        registeredAt: '2026-02-01'
    }
];

const INITIAL_ORDERS = [
    {
        id: 'ORD-1092',
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 min oldin
        customer: {
            name: 'Anvar Qosimov',
            phone: '+998 90 555-11-22',
            address: "Chilonzor 7-mavze, 12-uy, 45-xonadon (Orientir: 173-maktab ro'parasida)",
            district: 'Chilonzor',
            lat: 41.2750,
            lng: 69.2100
        },
        items: [
            {
                productId: 'p-1',
                name: 'iPhone 16 Pro Max 256GB Natural Titanium',
                price: 16500000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
            },
            {
                productId: 'p-7',
                name: 'Sony WH-1000XM5 Shovqinni bekor qiluvchi quloqchin',
                price: 4300000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
            }
        ],
        subtotal: 20800000,
        deliveryFee: 0, // Bepul yetkazib berish chegarasidan oshgan
        discountApplied: 0,
        total: 20800000,
        paymentMethod: 'Click / Payme',
        paymentStatus: 'To‘langan',
        branchId: 'br-1',
        branchName: 'Chilonzor Markaziy Filiali',
        distanceKm: 1.8,
        status: 'Kuryer qabul qildi', // 'Yangi buyurtma' | 'Kuryer qabul qildi' | 'Yo‘lda' | 'Yetkazib berildi' | 'Bekor qilindi'
        courierId: 'cour-1',
        courierName: 'Sardor Aliyev',
        courierPhone: '+998 90 123-45-67',
        statusHistory: [
            { status: 'Yangi buyurtma', time: new Date(Date.now() - 1000 * 60 * 18).toISOString(), note: 'Mijoz tomonidan buyurtma berildi' },
            { status: 'Kuryer qabul qildi', time: new Date(Date.now() - 1000 * 60 * 12).toISOString(), note: 'Kuryer Sardor Aliyev buyurtmani qabul qildi' }
        ]
    },
    {
        id: 'ORD-1093',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min oldin
        customer: {
            name: 'Dilnoza Karimova',
            phone: '+998 94 333-22-11',
            address: "Yunusobod 14-mavze, 5-uy, 18-xonadon",
            district: 'Yunusobod',
            lat: 41.3580,
            lng: 69.2850
        },
        items: [
            {
                productId: 'p-10',
                name: 'Lattafe Asad Eau de Parfum 100ml Erkaklar Atiri',
                price: 390000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80'
            },
            {
                productId: 'p-13',
                name: 'Lavazza Qualita Oro Tabiiy Donli Qahva 1kg',
                price: 320000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
            }
        ],
        subtotal: 710000,
        deliveryFee: 0,
        discountApplied: 0,
        total: 710000,
        paymentMethod: 'Naqd pul (kuryerga)',
        paymentStatus: 'Kutilmoqda',
        branchId: 'br-2',
        branchName: 'Yunusobod Filiali',
        distanceKm: 2.1,
        status: 'Yangi buyurtma',
        courierId: null,
        courierName: null,
        courierPhone: null,
        statusHistory: [
            { status: 'Yangi buyurtma', time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), note: 'Kuryer qabul qilishi kutilmoqda' }
        ]
    },
    {
        id: 'ORD-1088',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 soat oldin
        customer: {
            name: 'Olimjon Vohidov',
            phone: '+998 91 777-88-99',
            address: "Mirzo Ulug'bek, Qorasuv 4-mavze, 23-uy",
            district: "Mirzo Ulug'bek",
            lat: 41.3310,
            lng: 69.3380
        },
        items: [
            {
                productId: 'p-8',
                name: 'Nike Air Max 270 Black & White Original Krossovka',
                price: 1450000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
            }
        ],
        subtotal: 1450000,
        deliveryFee: 0,
        discountApplied: 0,
        total: 1450000,
        paymentMethod: 'Click / Payme',
        paymentStatus: 'To‘langan',
        branchId: 'br-3',
        branchName: "Mirzo Ulug‘bek Filiali",
        distanceKm: 1.2,
        status: 'Yetkazib berildi',
        courierId: 'cour-3',
        courierName: 'Bobur Rahimov',
        courierPhone: '+998 97 555-44-33',
        statusHistory: [
            { status: 'Yangi buyurtma', time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), note: 'Buyurtma rasmiylashtirildi' },
            { status: 'Kuryer qabul qildi', time: new Date(Date.now() - 1000 * 60 * 110).toISOString(), note: 'Kuryer qabul qildi' },
            { status: 'Yo‘lda', time: new Date(Date.now() - 1000 * 60 * 80).toISOString(), note: 'Kuryer manzilga qarab yo‘lga chiqdi' },
            { status: 'Yetkazib berildi', time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), note: 'Mijozga topshirildi' }
        ]
    }
];

const INITIAL_SETTINGS = {
    storeName: 'ULASH MARKET',
    tagline: 'O‘zbekistondagi eng tezkor va qulay onlayn gipermarket',
    baseDeliveryFee: 15000, // so'm
    freeDeliveryThreshold: 350000, // so'm dan yuqori bepul
    courierCommission: 12000, // har bir buyurtma uchun kuryer daromadi
    adminSecretPin: 'admin123',
    supportPhone: '+998 71 200-00-00',
    telegramBot: '@ulash_market_bot'
};
