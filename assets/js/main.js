// ==========================
// NAVBAR LOADER
// ==========================
fetch("components/navbar.html")
.then(res => res.text())
.then(data => {
  const nav = document.getElementById("navbar");
  if(nav){
    nav.innerHTML = data;

    setTimeout(()=>{
      const path = window.location.pathname.split("/").pop();
      const currentPage = path === "" ? "index.html" : path;

      document.querySelectorAll(".nav-link").forEach(link=>{
        if(link.getAttribute("href") === currentPage){
          link.classList.add("active","fw-bold");
        }
      });
    },100);
  }
});



/* =================================================
   DEFAULT LOST ITEMS
================================================= */
const lostItems = [
{
id:"1",
name:"Brown Wallet",
location:"Library",
date:"9 Feb 2026",
category:"accessories",
description:"Leather wallet containing cards and cash.",
image:"assets/images/lost-items/wallet.jpg",
email:"finder@college.com"
},
{
id:"2",
name:"UNO Cards",
location:"Cafeteria",
date:"8 Feb 2026",
category:"games",
description:"UNO playing cards deck.",
image:"assets/images/lost-items/UNO.jpg",
email:"finder2@college.com"
},
{
id:"3",
name:"College ID Card",
location:"Main Gate",
date:"7 Feb 2026",
category:"documents",
description:"Student ID card found near gate.",
image:"assets/images/lost-items/idcard.jpg",
email:"finder3@college.com"
}
];



/* =================================================
   DEFAULT FOUND ITEMS
================================================= */
const foundItems = [
{
id:"101",
name:"Blue Water Bottle",
location:"Sports Ground",
date:"10 Feb 2026",
category:"accessories",
description:"Plastic blue bottle with black cap.",
image:"assets/images/found-items/bottle.jpg",
email:"finder4@college.com"
},
{
id:"102",
name:"Calculator",
location:"Engineering Block",
date:"9 Feb 2026",
category:"electronics",
description:"Scientific calculator found near classroom.",
image:"assets/images/found-items/calculator.jpg",
email:"finder5@college.com"
},
{
id:"103",
name:"Headphones",
location:"Library",
date:"8 Feb 2026",
category:"electronics",
description:"Black wired headphones.",
image:"assets/images/found-items/headphones.jpg",
email:"finder6@college.com"
}
];



/* =================================================
   LOAD USER REPORTED ITEMS FROM STORAGE
================================================= */

const reports = JSON.parse(localStorage.getItem("reportedItems")) || [];

let dynamicLost  = [...lostItems];
let dynamicFound = [...foundItems];

reports.forEach((r)=>{

const newItem = {
id: String(r.id),
isUserReport: true,
person: r.person || "Unknown",
name: r.name,
location: r.location,
date: r.date,
category: r.category || "other",
description: r.description,
image: r.image || "assets/images/no-image.png",
email: r.email
};

if(r.type === "Lost")  dynamicLost.push(newItem);
if(r.type === "Found") dynamicFound.push(newItem);

});



/* =================================================
   RENDER LOST PAGE
================================================= */

const lostContainer = document.getElementById("lostItemsContainer");
const itemCount     = document.getElementById("itemCount");
const emptyMessage  = document.getElementById("emptyMessage");

if(lostContainer){
  dynamicLost.forEach(item=>{
    lostContainer.innerHTML += createCard(item,"danger");
  });

  if(itemCount) itemCount.innerText = `${dynamicLost.length} item(s) found`;

  if(!lostContainer.innerHTML.trim()){
    emptyMessage?.classList.remove("d-none");
  }
}



/* =================================================
   RENDER FOUND PAGE
================================================= */

const foundContainer = document.getElementById("foundItemsContainer");

if(foundContainer){
  dynamicFound.forEach(item=>{
    foundContainer.innerHTML += createCard(item,"success");
  });

  if(itemCount) itemCount.innerText = `${dynamicFound.length} item(s) found`;

  if(!foundContainer.innerHTML.trim()){
    emptyMessage?.classList.remove("d-none");
  }
}



/* =================================================
   CARD TEMPLATE
================================================= */

function createCard(item, color){

item.id = String(item.id);

let collectedList = JSON.parse(localStorage.getItem("collectedItems")) || [];
collectedList = collectedList.map(String);

const isCollected = collectedList.includes(item.id);

return `
<div class="col-12 col-sm-6 col-md-4">
  <div class="card shadow-sm h-100 rounded-4 ${isCollected ? 'opacity-50' : ''}">

    <img
      src="${item.image}"
      class="card-img-top"
      style="cursor:zoom-in;"
      onclick="openLightbox('${item.image}')"
    >

    <div class="card-body">

      <h5 class="fw-bold">
        ${item.name}
        ${isCollected ? `<span class="badge bg-success ms-2">Collected</span>` : ''}
      </h5>

      ${item.category ? `<p class="mb-1"><span class="badge bg-secondary text-capitalize">${item.category}</span></p>` : ''}

      <p class="mb-1"><strong>Location:</strong> ${item.location}</p>
      <p><strong>Date:</strong> ${item.date}</p>

      ${
        !isCollected
        ? `<a href="view-details.html?id=${item.id}"
             class="btn btn-${color} w-100 mb-2">
             View Details
           </a>`
        : ''
      }

      ${
        !isCollected
        ? `<button type="button" onclick="markCollected('${item.id}')"
             class="btn btn-success w-100 mb-2">
             Mark Collected
           </button>`
        : ''
      }

    </div>

  </div>
</div>
`;

}



/* =================================================
   VIEW DETAILS
================================================= */

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(id){

let item =
dynamicLost.find(i=>String(i.id)===String(id)) ||
dynamicFound.find(i=>String(i.id)===String(id));

if(item){

if(document.getElementById("itemImage"))
document.getElementById("itemImage").src=item.image;

if(document.getElementById("itemName"))
document.getElementById("itemName").textContent=item.name;

if(document.getElementById("itemLocation"))
document.getElementById("itemLocation").textContent=item.location;

if(document.getElementById("itemDate"))
document.getElementById("itemDate").textContent=item.date;

if(document.getElementById("itemDesc"))
document.getElementById("itemDesc").textContent=item.description;

window.currentItem=item;

}

}



/* =================================================
   CONTACT
================================================= */

function contactFinder(){

if(!window.currentItem){
alert("Contact info unavailable");
return;
}

const subject = encodeURIComponent(
"Regarding Item: "+window.currentItem.name
);

const body = encodeURIComponent(
"Hello,\n\nI believe this item belongs to me.\n\nItem: "
+window.currentItem.name
);

window.location.href =
`mailto:${window.currentItem.email}?subject=${subject}&body=${body}`;

}



/* ==========================
   MARK COLLECTED
========================== */

function markCollected(id){

id = String(id);

let collected = JSON.parse(localStorage.getItem("collectedItems")) || [];
collected = collected.map(String);

if(!collected.includes(id)){
collected.push(id);
}

localStorage.setItem("collectedItems",JSON.stringify(collected));

location.reload();

}



/* ==========================
   LIGHTBOX
========================== */

function openLightbox(src){

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0,0,0,0.88);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    animation: fadeIn 0.2s ease;
  `;

  const img = document.createElement("img");
  img.src = src;
  img.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    object-fit: contain;
  `;

  const hint = document.createElement("p");
  hint.textContent = "Click anywhere or press Esc to close";
  hint.style.cssText = `
    position: absolute;
    bottom: 20px;
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
    margin: 0;
  `;

  overlay.addEventListener("click", () => overlay.remove());

  document.addEventListener("keydown", function handler(e){
    if(e.key === "Escape"){
      overlay.remove();
      document.removeEventListener("keydown", handler);
    }
  });

  overlay.appendChild(img);
  overlay.appendChild(hint);
  document.body.appendChild(overlay);
}



// ===============================
// SEARCH & FILTER — LOST PAGE
// ===============================

const searchInput    = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

if(lostContainer && searchInput){

  function filterLostItems(){

    const searchValue   = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value.toLowerCase();

    const filteredItems = dynamicLost.filter(item => {

      const name = item.name?.toLowerCase()        || "";
      const desc = item.description?.toLowerCase() || "";
      const loc  = item.location?.toLowerCase()    || "";
      const cat  = item.category?.toLowerCase()    || "other";

      const matchesSearch =
        name.includes(searchValue) ||
        desc.includes(searchValue) ||
        loc.includes(searchValue);

      const matchesCategory =
        categoryValue === "" || cat === categoryValue;

      return matchesSearch && matchesCategory;
    });

    lostContainer.innerHTML = "";

    if(filteredItems.length === 0){
      emptyMessage?.classList.remove("d-none");
      if(itemCount) itemCount.innerText = "0 items found";
      return;
    }

    emptyMessage?.classList.add("d-none");
    if(itemCount) itemCount.innerText = `${filteredItems.length} item(s) found`;

    filteredItems.forEach(item => {
      lostContainer.innerHTML += createCard(item, "danger");
    });
  }

  searchInput.addEventListener("input",     filterLostItems);
  categoryFilter.addEventListener("change", filterLostItems);
}



// ===============================
// SEARCH & FILTER — FOUND PAGE
// ===============================

if(foundContainer && searchInput){

  function filterFoundItems(){

    const searchValue   = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value.toLowerCase();

    const filteredItems = dynamicFound.filter(item => {

      const name = item.name?.toLowerCase()        || "";
      const desc = item.description?.toLowerCase() || "";
      const loc  = item.location?.toLowerCase()    || "";
      const cat  = item.category?.toLowerCase()    || "other";

      const matchesSearch =
        name.includes(searchValue) ||
        desc.includes(searchValue) ||
        loc.includes(searchValue);

      const matchesCategory =
        categoryValue === "" || cat === categoryValue;

      return matchesSearch && matchesCategory;
    });

    foundContainer.innerHTML = "";

    if(filteredItems.length === 0){
      emptyMessage?.classList.remove("d-none");
      if(itemCount) itemCount.innerText = "0 items found";
      return;
    }

    emptyMessage?.classList.add("d-none");
    if(itemCount) itemCount.innerText = `${filteredItems.length} item(s) found`;

    filteredItems.forEach(item => {
      foundContainer.innerHTML += createCard(item, "success");
    });
  }

  searchInput.addEventListener("input",     filterFoundItems);
  categoryFilter.addEventListener("change", filterFoundItems);
}