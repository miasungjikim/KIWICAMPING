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

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const heart = document.querySelector('img.favorite-check');
    if (!heart || !id) return;

    heart.dataset.id = id;

    window.syncFavoriteIcons && window.syncFavoriteIcons();
});


