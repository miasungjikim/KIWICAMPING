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
let CURRENT_LIST = [];

const BATCH = 5;
let renderedCount = 0;

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
          class="site" loading="lazy" />
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

function bindLoadMore() {
  const btn = document.getElementById('loadMore');
  if (!btn) return;

  // first:
  if (renderedCount >= CURRENT_LIST.length) {
    btn.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    // next 5
    const next = CURRENT_LIST.slice(renderedCount, renderedCount + BATCH);
    appendCards(next);
    renderedCount += next.length;

    if (renderedCount >= CURRENT_LIST.length) {
      btn.style.display = 'none';
    } else {
      btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  });
}

// rendering
// ⭐️append render - show only 5 (WSC School)
function appendCards(list) {
  if (!Array.isArray(list)) return;

  const loadBox = document.querySelector('.load-more-box');

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
          class="site" loading="lazy" />
      <div>
        <h2>${p.name || ''}</h2>
        <img src="./image/icon/favorite-noncheck.svg" alt="favorite" class="favorite-check" data-id="${id}"/>
      </div>
      <p>${p.place || ''}</p>
      <p>${p.region || ''}</p>
    `;

    if (loadBox && contentIndex.contains(loadBox)) {
      contentIndex.insertBefore(contentCard, loadBox);   // ✅ 버튼 바로 위에 끼워넣기
    } else {
      contentIndex.appendChild(contentCard);
    }

    //After click, go to the content.html
    contentCard.addEventListener('click', (e) => {
      if (e.target.closest('img.favorite-check')) return; //⭐️favorite - no click area for content-box
      if (!id) return;
      location.href = `content.html?id=${encodeURIComponent(id)}`;
    });
  });

  window.syncFavoriteIcons && window.syncFavoriteIcons();
}

// ⭐️⭐️⭐️ clicki binding
function ensureLoadMoreButton() {
  // 버튼이 이미 있으면 그대로 사용
  let btn = document.getElementById('loadMore');
  if (!btn) {
    //make button wrapper
    const box = document.createElement('div');
    box.className = 'load-more-box';

    //make button
    btn = document.createElement('button');
    btn.id = 'loadMore';
    btn.type = 'button';
    btn.textContent = 'Show more';

    //main 맨 아래에 붙이기
    box.appendChild(btn);
    // contentIndex가 <main>이므로, 그 **아래로** 버튼을 append
    contentIndex.appendChild(box);
  }

  // 처음 상태: 더 보여줄 게 없으면 숨김
  if (renderedCount >= CURRENT_LIST.length) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'block';
  }

  // 중복 바인딩 방지 위해 기존 핸들러 제거 후 다시 연결
  btn.replaceWith(btn.cloneNode(true));
  const freshBtn = document.getElementById('loadMore');

  freshBtn.addEventListener('click', () => {
    // 다음 5개
    const next = CURRENT_LIST.slice(renderedCount, renderedCount + BATCH);
    appendCards(next);
    renderedCount += next.length;

    // 끝까지 보여줬으면 버튼 숨김
    if (renderedCount >= CURRENT_LIST.length) {
      freshBtn.style.display = 'none';
    } else {
      // 버튼이 항상 맨 아래로 가도록 스크롤
      freshBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  });
}




fetch('./data/DOC_campsites.geojson')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  })
  .then(data => {
    const features = (data.features || []).slice(0, 300);
    //test
    if (features.length && features[0]?.geometry?.coordinates) {
      console.log(features[0].geometry.coordinates);
    } else {
      console.log('no feature or coordinates');
    }

    // 전역 저장
    ALL_SITES = features;

    // 초기 렌더
    CURRENT_LIST = ALL_SITES;                             // ✅ 현재 세트 지정
    renderedCount = 0;
    contentIndex.innerHTML = '';                          //reset
    appendCards(CURRENT_LIST.slice(0, BATCH));            // 0~4
    renderedCount += Math.min(BATCH, CURRENT_LIST.length);

    //add more
    ensureLoadMoreButton();                               // ✅ CURRENT_LIST 기준 버튼 제어

    // filter event connect
    bindNavFilters();
  })
  //check loading error of json file
  .catch(err => console.log('Loading Error: Json file →', err));


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

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

if (searchForm) {
  // 폼 제출 막기
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();                       // ✅ 페이지 리로드 방지
    console.log('[search submit]', searchInput?.value || '');
    // 다음 단계에서: applySearch(searchInput.value);
    if (window.applySearch) window.applySearch(searchInput.value);
  });
}

if (searchInput) {
  // 인풋에서 엔터 눌러도 제출 막기
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();                     // ✅ form submit 방지
      console.log('[search enter]', searchInput.value);
      // 다음 단계에서: applySearch(searchInput.value);
      if (window.applySearch) window.applySearch(searchInput.value);
    }
  });

}

// ====== NAME-ONLY SEARCH ======
function getName(site) {
  const p = site?.properties || {};
  // 데이터에 따라 대소문자/다른 키일 수도 있으니 몇 가지만 안전하게 체크
  return (p.name ?? p.Name ?? p.SITE_NAME ?? "").toString();
}

function norm(s) {
  return (s ?? "")
    .toString()
    .normalize("NFC")      // 한글/악센트 문자 안전
    .toLowerCase().trim();
}

function applySearch(query) {
  const q = norm(query);

  // 검색어 없으면 전체 보여주기 (원하면 여기서 return으로 '아무것도 안 하기'로 바꿔도 됨)
  const base = Array.isArray(ALL_SITES) ? ALL_SITES : [];
  const list = q
    ? base.filter(f => norm(getName(f)).includes(q))
    : base;

  // 렌더 갱신
  CURRENT_LIST = list;
  renderedCount = 0;
  contentIndex.innerHTML = "";
  appendCards(CURRENT_LIST.slice(0, BATCH));
  renderedCount += Math.min(BATCH, CURRENT_LIST.length);
  ensureLoadMoreButton();

  if (!CURRENT_LIST.length) {
    contentIndex.innerHTML = `<p style="padding:16px;">No results found.</p>`;
  }
}

// 전역 노출
window.applySearch = applySearch;

