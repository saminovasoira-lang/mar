/**
 * ULASH MARKET - Xarita va Filiallar Logistikasi (Map & Logistics)
 * OpenStreetMap & Leaflet.js orqali interaktiv xaritalar va eng yaqin filialni aniqlash
 */

const UlashMap = {
    maps: {},
    markers: {},

    // Toshkent markaz koordinatalari
    TASHKENT_CENTER: [41.2995, 69.2401],

    // Filiallar umumiy xaritasini ishga tushirish
    initBranchesMap(containerId = 'branches-map') {
        const container = document.getElementById(containerId);
        if (!container) return null;

        // Agar mavjud bo'lsa tozalash
        if (this.maps[containerId]) {
            this.maps[containerId].remove();
        }

        const map = L.map(containerId, {
            scrollWheelZoom: false
        }).setView(this.TASHKENT_CENTER, 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap hissadorlari | ULASH MARKET',
            maxZoom: 19
        }).addTo(map);

        this.maps[containerId] = map;
        this.renderBranchMarkers(map);

        setTimeout(() => map.invalidateSize(), 300);
        return map;
    },

    renderBranchMarkers(map) {
        const branches = window.ulashStore.getBranches();
        const bounds = [];

        branches.forEach(branch => {
            const marker = L.marker([branch.lat, branch.lng], {
                icon: L.divIcon({
                    className: 'custom-branch-marker',
                    html: `<div class="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white"><i data-lucide="store" class="w-5 h-5">🏬</i></div>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                })
            }).addTo(map);

            const popupContent = `
                <div class="p-2 min-w-[220px]">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h4 class="font-bold text-slate-800 text-sm">${branch.name}</h4>
                    </div>
                    <p class="text-xs text-slate-600 mb-1 leading-relaxed"><i class="text-blue-600 font-semibold">Manzil:</i> ${branch.address}</p>
                    <p class="text-xs text-slate-600 mb-1"><i class="text-blue-600 font-semibold">Ish vaqti:</i> ${branch.workingHours}</p>
                    <p class="text-xs text-slate-600 mb-2"><i class="text-blue-600 font-semibold">Telefon:</i> <a href="tel:${branch.phone}" class="text-blue-600 underline font-medium">${branch.phone}</a></p>
                    <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Mudir: ${branch.manager}</span>
                        <span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold">Ulash Express</span>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
            bounds.push([branch.lat, branch.lng]);
        });

        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    },

    // Buyurtma berish sahifasida manzilni xaritada tanlash
    initCheckoutMapPicker(containerId, initialLat = 41.2800, initialLng = 69.2200, onLocationSelected) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        if (this.maps[containerId]) {
            this.maps[containerId].remove();
        }

        const map = L.map(containerId).setView([initialLat, initialLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap | ULASH MARKET',
            maxZoom: 19
        }).addTo(map);

        this.maps[containerId] = map;

        // Filiallarni ko'rsatamiz (ko'k rangli)
        const branches = window.ulashStore.getBranches();
        branches.forEach(b => {
            L.circleMarker([b.lat, b.lng], {
                radius: 8,
                fillColor: '#2563eb',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map).bindTooltip(`Filial: ${b.shortName || b.name}`, { permanent: false });
        });

        // Foydalanuvchi tanlagan joylashuv (Qizil harakatlanuvchi marker)
        let userMarker = L.marker([initialLat, initialLng], {
            draggable: true,
            icon: L.divIcon({
                className: 'custom-user-marker',
                html: `<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-2 border-white ring-4 ring-red-200">📍</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(map);

        const updatePosition = (lat, lng) => {
            userMarker.setLatLng([lat, lng]);
            const nearestBranch = window.ulashStore.findNearestBranch(lat, lng);
            if (onLocationSelected) {
                onLocationSelected({
                    lat,
                    lng,
                    nearestBranch
                });
            }
        };

        // Boshlang'ich hisoblash
        updatePosition(initialLat, initialLng);

        // Marker surilganda
        userMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            updatePosition(pos.lat, pos.lng);
        });

        // Xaritaga bosilganda
        map.on('click', (e) => {
            updatePosition(e.latlng.lat, e.latlng.lng);
        });

        setTimeout(() => map.invalidateSize(), 300);
        return map;
    },

    // Buyurtmani kuzatish xaritasi (Kuryer harakati va yo'l chizig'i)
    initOrderTrackingMap(containerId, branchLat, branchLng, customerLat, customerLng, courierLat, courierLng, status) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        if (this.maps[containerId]) {
            this.maps[containerId].remove();
        }

        const map = L.map(containerId, { scrollWheelZoom: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap | ULASH Express',
            maxZoom: 19
        }).addTo(map);

        this.maps[containerId] = map;

        // 1. Filial markeri
        const branchMarker = L.marker([branchLat, branchLng], {
            icon: L.divIcon({
                className: 'branch-track-icon',
                html: `<div class="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded shadow-md border border-white">🏬 Filial Ombori</div>`,
                iconAnchor: [40, 15]
            })
        }).addTo(map);

        // 2. Mijoz manzili markeri
        const customerMarker = L.marker([customerLat, customerLng], {
            icon: L.divIcon({
                className: 'cust-track-icon',
                html: `<div class="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-md border border-white">📍 Qabul Qiluvchi</div>`,
                iconAnchor: [45, 15]
            })
        }).addTo(map);

        // 3. Kuryer markeri (agar buyurtma qabul qilingan yoki yo'lda bo'lsa)
        let activePoints = [[branchLat, branchLng], [customerLat, customerLng]];

        if (status === 'Yo‘lda' || status === 'Kuryer qabul qildi') {
            const currentCourierPos = courierLat && courierLng ? [courierLat, courierLng] : [
                (branchLat + customerLat) / 2 + 0.003,
                (branchLng + customerLng) / 2 + 0.002
            ];

            L.marker(currentCourierPos, {
                icon: L.divIcon({
                    className: 'courier-track-icon',
                    html: `<div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white text-lg animate-bounce">🛵</div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                })
            }).addTo(map).bindTooltip("Kuryer harakatlanmoqda", { permanent: true, direction: 'top' });

            activePoints.push(currentCourierPos);
        }

        // Yo'nalish chizig'i
        const routeLine = L.polyline([[branchLat, branchLng], [customerLat, customerLng]], {
            color: '#2563eb',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.7
        }).addTo(map);

        map.fitBounds(activePoints, { padding: [40, 40] });
        setTimeout(() => map.invalidateSize(), 300);
        return map;
    }
};

window.ulashMap = UlashMap;
