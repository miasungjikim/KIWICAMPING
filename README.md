# 🏕️ KIWICAMPING  

A mobile-first camping web app that shows Department of Conservation (DOC) campsites in New Zealand.  
The app allows users to browse campsites, view details, check maps, and save favourites.  

🔗 **Live demo:** [https://miasungjikim.github.io/KIWICAMPING/](https://miasungjikim.github.io/KIWICAMPING/)  

---

## ✨ Features  

- **Dynamic Data Loading**: Campsite information is loaded from the official DOC GeoJSON dataset.  
- **Search and Filters**: Search by campsite name and filter by region or bookable sites.  
- **Responsive Layout**: Designed for iPhone 12 screen (390 px) and planned for full responsive updates.  
- **Map Integration**: Interactive Leaflet maps show all sites on the map page and highlight a single site on the detail page.  
- **Favourites**: Save and manage campsites with session storage.  
- **Footer Navigation**: Consistent footer navigation with active-page highlight.  

---

## 📂 Project Structure  
KIWICAMPING/
<pre>
```
│── index.html # Home page with search & filters
│── content.html # Detail page for one campsite
│── map.html # Map page with Leaflet markers
│── saved.html # Saved (favourites) page
│── info.html # Info resources page
│
├── css/
│ ├── reset.css
│ ├── common.css
│ ├── main.css
│ ├── content.css
│ ├── map.css
│ ├── saved.css
│ └── info.css
│
├── js/
│ ├── main.js # Data loading, rendering, search & filters
│ ├── content.js # Detail page logic + map
│ ├── map.js # Map page with all campsites
│ ├── saved.js # Manage saved campsites
│ ├── favorite.js # Session storage for favourites
│ └── common.js # Footer navigation highlight
│
└── data/
└── DOC_campsites.geojson
```
</pre>
---

## 🛠 Tools & Techniques  

- **Design**: Figma (low-fidelity on paper → high-fidelity in Figma)  
- **IDE**: Visual Studio Code  
- **Version Control**: GitHub (7 commits, 14 deployments)  
- **Deployment**: GitHub Pages  
- **Documentation**: Microsoft Word  

---

## 🚀 Getting Started  

1. Clone the repository:  
   ```bash
   git clone https://github.com/miasungjikim/KIWICAMPING.git

