
(() => {
    const KEY = 'savedSites';

    const getIds = () => {
        try { return JSON.parse(sessionStorage.getItem(KEY)) || []; }
        catch { return []; }
    };
    const setIds = (arr) => sessionStorage.setItem(KEY, JSON.stringify(arr));
    const hasId = (id) => getIds().includes(id);

    const toggleId = (id) => {
        const list = getIds();
        const i = list.indexOf(id);
        if (i >= 0) {
            list.splice(i, 1);
            setIds(list);
            return false; // now non-check
        } else {
            list.push(id);
            setIds(list);
            return true;  // now check
        }
    };

    const setIcon = (img, checked) => {
        img.src = checked
            ? './image/icon/favorite-check.svg'
            : './image/icon/favorite-noncheck.svg';
    };

    // favorite initialize 
    function syncFavoriteIcons() {
        document.querySelectorAll('img.favorite-check').forEach(img => {
            const id = img.dataset.id;
            if (!id) return;
            setIcon(img, hasId(id));
        });
    }

    // favorite click event 
    // favorite.js
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img.favorite-check');
        if (!img) return;

        e.preventDefault();
        e.stopPropagation();

        const id = img.dataset.id;
        if (!id) return;

        const nowChecked = toggleId(id);
        setIcon(img, nowChecked);
    }, true);






    // DOM loading, icon initialize,,,
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncFavoriteIcons);
    } else {
        syncFavoriteIcons();
    }


    window.syncFavoriteIcons = syncFavoriteIcons;
})();
