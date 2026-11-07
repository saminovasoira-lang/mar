# ULASH MARKET — Zamonaviy Onlayn Gipermarket va Yetkazib Berish Tizimi

**ULASH MARKET** — Yandex Market va Uzum Market uslubidagi, oq-ko‘k (Light Design) ranglar gammasida yaratilgan, to‘liq responsive va real-vaqtda o‘zaro sinxronlashuvchi zamonaviy onlayn savdo va yetkazib berish platformasi.

---

## 🌟 Loyiha Imkoniyatlari va Bo‘limlar

### 1. Asosiy Tizim va Dizayn
- **Light Design (Oq-ko‘k ranglar)**: Yandex Market estetikasiga mos, toza, zamonaviy va ko‘zga qulay interfeys.
- **100% Moslashuvchan (Responsive)**: Kompyuter, noutbuk, planshet va smartfonlar (pastki mobil menyu bilan) uchun moslangan.
- **Yagona Reaktiv Holat (Unified Store)**: `localStorage` va `BroadcastChannel` orqali bir vaqtning o‘zida bir nechta oyna yoki brauzer tablarida (Mijoz, Kuryer, Admin) ma’lumotlar sahifani yangilamasdan (real-time) yangilanadi.

### 2. Login va Autentifikatsiya
- **Telefon raqami** (`+998 XX XXX-XX-XX`) yoki **Gmail** orqali kirish.
- **Rollar**:
  - **Foydalanuvchi (Mijoz)** — tovarlar xarid qilish va buyurtma holatini kuzatish.
  - **Kuryer** — yangi buyurtmalarni qabul qilish va yetkazish.
- **Direktor (Admin) Kirishi**:
  - Standart login oynasida **ko‘rinmaydi** (yashirin).
  - Maxsus maxfiy parol bilan kiriladi (**Standart parol**: `admin123`).
  - Kirish yo‘llari:
    1. Sayt yuqori yoki pastki qismidagi maxfiy qulf belgisi `🔒`.
    2. Klaviatura kombinatsiyasi: `Ctrl + Shift + A`.
    3. URL orqali: `#admin-secret` yoki ekrandagi suzuvchi rol almashtirgich.

### 3. Foydalanuvchi (Mijoz) Paneli
- **Bosh sahifa**: Slayder bannerlar, aksiyalar, kun takliflari va afzalliklar.
- **Mahsulotlar Katalogi**: 7 ta asosiy kategoriya (Smartfonlar, Noutbuklar, Maishiy texnika, Kiyim-kechak, Oziq-ovqat, Go'zallik, Sport).
- **Qidiruv va Saralash**: Jonli qidiruv (nomi, brendi), narx bo‘yicha va faqat chegirmalarni ko‘rsatish.
- **Mahsulot kartochkasi va Quick View**: Rasmi, brendi, kafolati, ombordagi soni, reytingi va to‘liq tavsifi.
- **Savatcha (Cart)**: Mahsulot sonini boshqarish, bepul yetkazib berish progress bari va yakuniy hisob-kitob.
- **Buyurtma rasmiylashtirish (Checkout)**:
  - Mijoz ismi va telefon raqami.
  - **Interaktiv xaritada manzilni tanlash**: markerni kerakli nuqtaga surish imkoniyati.
  - **Eng yaqin filialni avtomatik aniqlash**: Haversine formulasi orqali eng yaqin ombor-filial tanlanadi va xaritada ko'rsatiladi.
  - To‘lov usullari: Naqd pul, Click / Payme, Terminal.
- **Buyurtmalar tarixi va Jonli Kuzatuv (Live Tracking)**:
  - 5 bosqichli real-vaqt stepperi:
    1. `Yangi buyurtma`
    2. `Kuryer qabul qildi` (kuryer ismi va telefoni ko‘rinadi)
    3. `Yo‘lda` (xaritada kuryer harakati va yo‘nalish chizig‘i)
    4. `Yetkazib berildi` (muvaffaqiyatli topshirildi)
    5. `Bekor qilindi`
  - Kuryerga bir bosishda qo‘ng‘iroq qilish tugmasi (`tel:`).

### 4. Yetkazib Berish va Kuryer Paneli
- **Yangi buyurtmalar hovuzi**: Buyurtma tushishi bilan barcha kuryerlarga ko‘rinadi.
- **Qulflash mexanizmi (Order Lock)**: Bir kuryer buyurtmani qabul qilishi bilanoq, buyurtma boshqa kuryerlarga yopiladi va uning shaxsiy buyurtmalariga o‘tadi.
- **Faol buyurtmalar**: Mijoz telefoni, manzili, filialdan olish nuqtasi va mahsulotlar tarkibi.
- **Holatni boshqarish**:
  - `Yo‘lga chiqdim` ➔ holat `Yo‘lda`ga o‘tadi.
  - `Mijozga yetkazdim` ➔ holat `Yetkazib berildi`ga o‘tadi, bayramona salyut otiladi va kuryer balansiga komissiya (+12 000 so‘m) yoziladi.
- **Tarix va daromad hisoboti**: Barcha yetkazilgan buyurtmalar va umumiy ishlangan pul.

### 5. Direktor (Admin) Boshqaruv Paneli
- **Dashboard**:
  - Umumiy savdo aylanmasi (UZS), kunlik/oylik o‘sish ko‘rsatkichlari.
  - Buyurtmalar, mahsulotlar va kuryerlar soni.
  - **Chart.js grafiklari**: haftalik savdo dinamikasi va daromad grafigi.
  - Filiallar bo‘yicha buyurtmalar taqsimoti.
- **Mahsulotlar va Ombor (CRUD)**:
  - Yangi mahsulot qo‘shish (nom, brend, kategoriya, narx, chegirma %, ombor miqdori, rasm URL, tavsif).
  - Mahsulotni tahrirlash va ombordagi qoldiqni yangilash.
  - Mahsulotni o‘chirish.
- **Buyurtmalar nazorati**:
  - Holatlar bo‘yicha filtrlash.
  - Buyurtma tafsilotlarini ko‘rish va kuryerlarni qo‘lda qayta biriktirish.
  - Buyurtmani bekor qilish (ombor mahsulot soni avtomatik tiklanadi).
- **Kuryerlarni boshqarish**: Yangi kuryer qo‘shish, transporti, reytingi va ishlagan mablag‘ini ko‘rish.
- **Filiallarni boshqarish**: Filiallar ro‘yxati, mudirlar, ish vaqti va koordinatalar.
- **Tizim sozlamalari**: Yetkazib berish narxi (15 000 so‘m), bepul yetkazish chegarasi (350 000 so‘m), kuryer komissiyasi va maxfiy admin paroli.

### 6. Filiallar va Xarita Tizimi
- Toshkent bo‘ylab 4 ta yirik tayyorlov markazlari va omborlar:
  1. **Chilonzor Markaziy Filiali** (Qatortol ko'chasi 45)
  2. **Yunusobod Filiali** (Amir Temur shoh ko'chasi 112)
  3. **Mirzo Ulug‘bek Filiali** (Buyuk Ipak Yo'li 78)
  4. **Sergeli Filiali** (Yangisergeli ko'chasi 24)
- Leaflet.js va OpenStreetMap orqali internetda bepul va cheklovsiz ishlaydigan interaktiv xarita.

---

## 📁 Loyiha Tuzilishi

```
mar/
├── index.html          # Asosiy veb-ilova (Barcha sahifalar, modallar va navigatsiya)
├── server.py           # Python 3 standart serveri (Hech qanday o'rnatishlarsiz)
├── start.bat           # Windows uchun 1-bosishda ishga tushiruvchi fayl
├── README.md           # To'liq hujjatlar va qo'llanma
├── css/
│   └── styles.css      # Oq-ko'k Light dizayn, animatsiyalar, xarita va bosma styllari
└── js/
    ├── data.js         # Dastlabki tovarlar, filiallar, kuryerlar va buyurtmalar
    ├── store.js        # Markazlashtirilgan reaktiv Store (LocalStorage + BroadcastChannel)
    ├── map.js          # Leaflet xarita, eng yaqin filialni hisoblash (Haversine)
    ├── catalog.js      # Katalog, qidiruv, savatcha va tezkor ko'rish
    ├── checkout.js     # Buyurtma rasmiylashtirish, xaritada manzil tanlash
    ├── courier.js      # Kuryer kabineti, qabul qilish, marshrut va hisobot
    ├── admin.js        # Direktor boshqaruv paneli, statistika, mahsulotlar CRUD
    └── app.js          # Asosiy router, rollar, autentifikatsiya va buyurtma kuzatuvi
```

---

## 🚀 Ishga Tushirish

### 1-usul: `start.bat` orqali (Eng osoni)
1. Loyiha papkasidagi `start.bat` faylini ikki marta bosing.
2. Server `http://localhost:8000` manzilida ishga tushadi va brauzeringiz avtomatik ochiladi.

### 2-usul: Python orqali
Konsolda / PowerShell da buyruqni bajaring:
```bash
python server.py
```
So‘ng brauzerda oching: [http://localhost:8000](http://localhost:8000)

### 3-usul: To‘g‘ridan-to‘g‘ri brauzerda ochish
Hech qanday serversiz `index.html` faylini istalgan brauzerda ochsangiz ham barcha funksiyalar (katalog, savatcha, xarita, kuryer, admin) 100% to‘liq ishlaydi!

---

## 🧪 Qanday Sinab Ko‘rish Mumkin? (Tezkor Qo‘llanma)

1. **Mijoz sifatida**:
   - Bosh sahifada tovarlarni ko‘ring yoki qidiring.
   - Mahsulotni savatchaga qo‘shing va "Buyurtmani rasmiylashtirish"ga o‘ting.
   - Xaritada uyingiz manzilini belgilang — tizim sizga eng yaqin filialni avtomatik hisoblab beradi.
   - "Tasdiqlash" tugmasini bosing ➔ yangi buyurtma yaratiladi va salyut otiladi.
2. **Kuryer sifatida**:
   - Yuqori menyudan yoki ekranning chap-pastki burchagidagi rol tugmasidan **"Kuryer"**ga o‘ting.
   - "Yangi buyurtmalar" bo‘limida yangi tushgan buyurtmani ko‘rasiz.
   - "Buyurtmani qabul qilish" tugmasini bosing ➔ buyurtma sizga biriktiriladi.
   - "Yo‘lga chiqdim" va so‘ng "Mijozga yetkazdim" tugmalarini bosing.
3. **Direktor (Admin) sifatida**:
   - `Ctrl + Shift + A` bosing yoki yuqoridagi `🔒` qulf belgisini bosing.
   - Parolga `admin123` kiriting.
   - Dashboardda umumiy savdo statistikasi, grafiklar, ombor CRUD va kuryerlar nazorati ochiladi!
