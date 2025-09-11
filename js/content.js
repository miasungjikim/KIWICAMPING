const params = new URLSearchParams(location.search); //params = parameter
const targetID = params.get('id');

const imgEl = document.querySelector('.img-box img'); //El = Element
const titleEl = document.querySelector('.title-box h2');
const infoBox = document.querySelector('.big-box .content-box');
const paras = infoBox.querySelectorAll('p');

const FALLBACK_IMG = './image/site1.jpg';



fetch('./data/DOC_campsites.geojson')
    .then(r => r.json())
    .then(data => {
        const features = data.features || [];
        const f = features.find(x => String(x.properties?.OBJECTED ?? x.id) === String(targetID));
        if (!f) { infoBox.innerHTML = '<h3>Site Information</h3><p>Not found.</p>'; return; }

        const p = f.properties || {};
        const safe = v => (v == null ? '' : String(v));

        //Put Image,Title
        imgEl.src = p.introductionThumbnail || FALLBACK_IMG;
        imgEl.alt = p.name || 'site';
        titleEl.textContent = p.name || '';
    

        // P
        // 0: introduction
        if (paras[0]) paras[0].textContent = safe(p.introduction);
        // 1: place
        if (paras[1]) paras[1].textContent = 'Place : ' + safe(p.place);
        // 2: region
        if (paras[2]) paras[2].textContent = 'Region : ' + safe(p.region);
        // 3: landscape
        if (paras[3]) paras[3].textContent = 'Landscape : ' + safe(p.landscape);
        // 4: access
        if (paras[4]) paras[4].textContent = 'Access : ' + safe(p.access);
        // 5: bookable
        if (paras[6]) paras[6].textContent = 'Bookable : ' + safe(p.bookable);

        // Last pL facilities 
        const lastP = paras[paras.length - 1];
        if (lastP) lastP.textContent = 'Facilities : ' + safe(p.facilities);
    })
    .catch(() => {
        infoBox.innerHTML = '<h3>Site Information</h3><p>Load error.</p>';

    });

//FAVORITE
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const heart = document.querySelector('img.favorite-check');
    if (!heart || !id) return;

    heart.dataset.id = id;

    window.syncFavoriteIcons && window.syncFavoriteIcons();
});

// MAP
fetch('./data/DOC_campsites.geojson')
    .then(res => res.json())
    .then(data => {
        const features = data?.features || [];
        const f = features.find(x => String(x.properties?.OBJECTED ?? x.id) === String(targetID));
        
        const p = f.geometry;

        console.log(p);
        console.log(p.coordinates[0]);
        console.log(p.coordinates[1]);


        const map = L.map('map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 16,
        }).addTo(map);
        map.setView([p.coordinates[1], p.coordinates[0]], 12); // ⭐️basic show

        setTimeout(() => map.invalidateSize(), 0);

        

        
        // making custom icon 
        const campIcon = L.icon({
            iconUrl: './image/icon/camp-marker.svg', //icon
            iconSize: [20, 20],   // icon size
            iconAnchor: [16, 32],   // position
            popupAnchor: [0, -32]    // open popup
        });

        var p1 = p.coordinates[1];


        const popup = L.popup({ className: 'custom-popup-style' })
        .setLatLng([p.coordinates[1], p.coordinates[0]])
        .setContent("HERE IS CAMPING SITE")
        .openOn(map);






        // // amm marker
        // const layer = L.geoJSON(features, {
        //     pointToLayer: (feature, latlng) => L.marker(latlng, { icon: campIcon }),
        //     onEachFeature: (feature, marker) => {
        //         marker.bindPopup(popupHtml(feature));
        //     }
        // }).addTo(map);

        const circle = L.circle([p.coordinates[1], p.coordinates[0]], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 400
    }).addTo(map);




    })
    .catch(err => {
        console.error('Failed to load GeoJSON:', err);
    });



    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    

    function popupHtml(feature) {
        const p = feature.properties || {};
        const name = p.name || 'Unknown site';


    const id = p.OBJECTID ?? p.OBJECTED ?? feature.id;


    const link = id ? `content.html?id=${encodeURIComponent(id)}` : null;
    return `
    <div class="popup">
    <h4>${name}</h4>
    </div>
`;
}





   





