//change the color

document.addEventListener("DOMContentLoaded", () => {
 const currentPage = window.location.pathname.split("/").pop();
 console.log(currentPage);
 const links = document.querySelectorAll("footer ul li a");




 links.forEach(link => {
   if(link.getAttribute("href") === currentPage){
     link.parentElement.classList.add("active");
   } else {
     link.parentElement.classList.remove("active");
   }
 });
});