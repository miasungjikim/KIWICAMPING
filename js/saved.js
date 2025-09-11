// saved.js — saved.html 전용 렌더링
(() => {
    const KEY = 'savedSites';
    const LIST_SEL = '#saved-box';

    const getIds = () => {
        try { return JSON.parse(sessionStorage.getItem(KEY)) || []; }
        catch { return []; }
    };
    const hasId = (id) => getIds().includes(id);

    const tpl = (item) => `
    <div class="saved-box" data-id="${item.id}">
    <img src="${item.thumb}" alt="site" class="site">
    <div class="saved-content-box">
        <h4>${item.name}</h4>
        <p>${item.region || ''}</p>
    </div>
    <img src="./image/icon/favorite-check.svg" alt="favorite" class="favorite-check" data-id="${item.id}">
    </div>
    `;

    async function renderSaved() {
        const container = document.querySelector(LIST_SEL);
        if (!container) return;

        const ids = getIds();
        if (!ids.length) {
            container.innerHTML = `<p>PLEASE CLICK 'FAVORITE ICON(HEART)' AT THE HOMT OR DETAIL PAGE FIRST.</p>`;
            return;
        }

        // LOADING DATA... PLZ
        let data;
        try {
            const res = await fetch('./data/DOC_campsites.geojson');
            data = await res.json();
        } catch {
            container.innerHTML = `<p>cannot loading data</p>`;
            return;
        }

        // id matching
        const features = (data.features || []);
        const items = [];
        for (const f of features) {
            const p = f.properties || {};
            const fid = (p.OBJECTED ?? p.OBJECTID ?? f.id)?.toString(); 
            if (!fid) continue;
            if (!ids.includes(fid)) continue;

            items.push({
                id: fid,
                name: p.name || 'Unknown',
                thumb: p.introductionThumbnail || './image/site1.jpg',
                place: p.place || '',
                region: p.region || ''
            });
        }

        if (!items.length) {
            container.innerHTML = `<p>EMPTY</p>`;
            return;
        }

        container.innerHTML = items.map(tpl).join('');

        // favorite icons
        window.syncFavoriteIcons && window.syncFavoriteIcons();
    }

    // remove saved 
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img.favorite-check');
        if (!img) return;


        setTimeout(() => {
            const id = img.dataset.id;
            if (!id) return;
            if (!hasId(id)) {
                const card = img.closest('.saved-box');
                if (card) card.remove();

                const container = document.querySelector(LIST_SEL);
                if (container && !container.querySelector('.saved-box')) {
                    container.innerHTML = `<p>EMPTY</p>`;
                }
            }
        }, 0);
    });

    document.addEventListener('click', (e) => {
        // IF CLICK HEARD, NO APPCEPT ! 
        if (e.target.closest('img.favorite-check')) return;

        const card = e.target.closest('.saved-box');
        if (!card) return;

        const id = card.dataset.id;
        if (!id) return;

        location.href = `content.html?id=${encodeURIComponent(id)}`;
    });


    //render
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSaved);
    } else {
        renderSaved();
    }





    window.renderSaved = renderSaved;
})();
