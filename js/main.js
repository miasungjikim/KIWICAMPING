// NAV slide (from w3School)

//open
function toggleMenu() {
  const navi = document.getElementById("navi");
  if (!navi) return;
  navi.classList.toggle("active");
}
//close 
function closeMenu(e) {
  if (e && e.preventDefault) e.preventDefault();
  const navi = document.getElementById("navi");
  if (!navi) return;
  navi.classList.remove("active");
}
// expose to inline handlers 
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;


//CONNECT GEOJSON to index.html
const contentIndex = document.querySelector('main');
let ALL_SITES = [];

function renderCards(list) {
  if (!Array.isArray(list)) return;

  //reset .content-box
  contentIndex.innerHTML = '';

  list.forEach(f => {
    const p = f.properties || {};
    const id = p.OBJECTED ?? p.OBJECTID ?? f.id;

    const FALLBACK_IMG = './image/site1.jpg';
    //make .content-box as div 
    const contentCard = document.createElement('div');
    contentCard.className = 'content-box';

    //make content 
    contentCard.innerHTML = `
      <img src="${p.introductionThumbnail || FALLBACK_IMG}" 
          alt="${p.name || 'camping-site-image'}" 
          class="site" />
      <div>
        <h2>${p.name || ''}</h2>
        <img src="./image/icon/favorite-noncheck.svg" alt="favorite" class="favorite-check" data-id="${id}"/>
      </div>
      <p>${p.place || ''}</p>
      <p>${p.region || ''}</p>
    `;

    contentIndex.appendChild(contentCard);

    //After click, go to the content.html
    contentCard.addEventListener('click', (e) => {
      if (e.target.closest('img.favorite-check')) return; //⭐️favorite - no click area for content-box
      if (!id) return;
      location.href = `content.html?id=${encodeURIComponent(id)}`;
    });
  });

  window.syncFavoriteIcons && window.syncFavoriteIcons();
}

fetch('./data/DOC_campsites.geojson')
  .then(res => res.json())
  .then(data => {
    const features = (data.features || []).slice(0, 200);
    //test
    console.log(features[0].geometry.coordinates);

    // 전역 저장
    ALL_SITES = features;

    // 초기 렌더
    renderCards(ALL_SITES);

    // 필터 이벤트 연결
    bindNavFilters();
  })
  //check loading error of json file
  .catch(err => console.log('Loading Error: Json file'));


//⭐️⭐️NAV FILTER


function prop(site, key) {
  const p = site?.properties ?? site;
  return p?.[key] ?? "";
}

// FILTER
function applyFilters() {
  const regionsEl = document.getElementById("regions");
  const selectedRegion = regionsEl?.value?.trim() || "All Region";

  const bookableEl = document.getElementById("suit2");
  const bookableChecked = !!(bookableEl && bookableEl.checked);

  let list = Array.isArray(ALL_SITES) ? [...ALL_SITES] : [];

  // 1) Region
  if (selectedRegion && selectedRegion !== "All Region") {
    list = list.filter((s) => {
      const region = prop(s, "region") || prop(s, "Region");
      return region === selectedRegion;
    });
  }

  // 2) Bookable
  if (bookableChecked) {
    list = list.filter((s) => {
      const b = (prop(s, "bookable") || prop(s, "Bookable") || "").toString();
      return b.toUpperCase() === "YES";
    });
  }

  renderCards(list);
}


// event binding
function bindNavFilters() {
  // nav in search button
  const searchBtn =
    document.getElementById("searchBtn") || document.querySelector("#navi button");

  if (!searchBtn) return;

  searchBtn.addEventListener("click", (e) => {
    // form submit prevent
    if (e && e.preventDefault) e.preventDefault();


    applyFilters();

    // 2) close nav slide
    if (typeof closeMenu === "function") closeMenu();

    // 3) main focus
    try {
      document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
      document.querySelector("main")?.focus?.();
    } catch (_) { }
  });
}

