

// 0) (CDN일 때 자주 나는 마커 아이콘 404 방지)
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// map
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
map.setView([-43.0, 171.0], 7); // ⭐️basic show

// 2) popup
function popupHtml(feature) {
    const p = feature.properties || {};
    const name = p.name || 'Unknown site';


    const id = p.OBJECTID ?? p.OBJECTED ?? feature.id;


    const link = id ? `content.html?id=${encodeURIComponent(id)}` : null;
    return `
    <div class="popup">
    <h4>${name}</h4>
    ${link ? `<a href="${link}">Open details</a>` : ''}
    </div>
`;
}

// 3) GeoJSON -> all marker
fetch('./data/DOC_campsites.geojson')
    .then(res => res.json())
    .then(data => {
        const features = data?.features || [];

        // 커스텀 아이콘 만들기
        const campIcon = L.icon({
            iconUrl: './image/icon/camp-marker.svg', //icon
            iconSize: [20, 20],   // icon size
            iconAnchor: [16, 32],   // position
            popupAnchor: [0, -32]    // open popup
        });



        // amm marker
        const layer = L.geoJSON(features, {
            pointToLayer: (feature, latlng) => L.marker(latlng, { icon: campIcon }),
            onEachFeature: (feature, marker) => {
                marker.bindPopup(popupHtml(feature));
            }
        }).addTo(map);


    })
    .catch(err => {
        console.error('Failed to load GeoJSON:', err);
    });


setTimeout(() => map.invalidateSize(), 0);
