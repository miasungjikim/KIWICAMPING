// NAV slide (from w3School)

//open
function toggleMenu(){
    const navi = document.getElementById("navi");
    if(!navi) return;
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


