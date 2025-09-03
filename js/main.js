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

fetch('./data/DOC_campsites.geojson')
  .then(res => res.json())
  .then(data => {
    const features = (data.features || []).slice(0, 100);
    //test
    console.log(features[0].geometry.coordinates);

    //reset .content-box
    contentIndex.innerHTML = '';
    features.forEach(f => {
      const p = f.properties || {};
      const id = p.OBJECTED ?? f.id;

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
          <img src="./image/icon/favorite-noncheck.svg" alt="favorite" />
        </div>
        <p>${p.place || ''}</p>
        <p>${p.region || ''}</p>
      `;

      contentIndex.appendChild(contentCard);

      //After click, go to the content.html
      contentCard.addEventListener('click', () => {
        if (!id) return;
        location.href = `content.html?id=${encodeURIComponent(id)}`;
      });

    });
  })
  //check loading error of json file
  .catch(err => console.log('Loading Error: Json file'));



