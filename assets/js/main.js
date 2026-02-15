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
description:"Leather wallet containing cards and cash.",
image:"assets/images/lost-items/wallet.jpg",
email:"finder@college.com"
},
{
id:"2",
name:"UNO Cards",
location:"Cafeteria",
date:"8 Feb 2026",
description:"UNO playing cards deck.",
image:"assets/images/lost-items/UNO.jpg",
email:"finder2@college.com"
},
{
id:"3",
name:"College ID Card",
location:"Main Gate",
date:"7 Feb 2026",
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
description:"Plastic blue bottle with black cap.",
image:"assets/images/found-items/bottle.jpg",
email:"finder4@college.com"
},
{
id:"102",
name:"Calculator",
location:"Engineering Block",
date:"9 Feb 2026",
description:"Scientific calculator found near classroom.",
image:"assets/images/found-items/calculator.jpg",
email:"finder5@college.com"
},
{
id:"103",
name:"Headphones",
location:"Library",
date:"8 Feb 2026",
description:"Black wired headphones.",
image:"assets/images/found-items/headphones.jpg",
email:"finder6@college.com"
}
];



/* =================================================
   LOAD USER REPORTED ITEMS FROM STORAGE
================================================= */

const reports = JSON.parse(localStorage.getItem("reportedItems")) || [];

let dynamicLost = [...lostItems];
let dynamicFound = [...foundItems];

reports.forEach((r)=>{

const newItem = {
id: String(r.id),
isUserReport: true,
person: r.person || "Unknown",
name: r.name,
location: r.location,
date: r.date,
description: r.description,
image: r.image || "assets/images/no-image.png",
email: r.email
};


if(r.type === "Lost") dynamicLost.push(newItem);
if(r.type === "Found") dynamicFound.push(newItem);

});



/* =================================================
   RENDER LOST PAGE
================================================= */

const lostContainer = document.getElementById("lostItemsContainer");

if(lostContainer){
dynamicLost.forEach(item=>{
lostContainer.innerHTML += createCard(item,"danger");
});

if(!lostContainer.innerHTML.trim()){
document.getElementById("emptyMessage")?.classList.remove("d-none");
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

if(!foundContainer.innerHTML.trim()){
document.getElementById("emptyMessage")?.classList.remove("d-none");
}
}

/* =================================================
   CARD TEMPLATE
================================================= */

function createCard(item,color){

item.id = String(item.id);

let collectedList = JSON.parse(localStorage.getItem("collectedItems")) || [];
collectedList = collectedList.map(String);

const isCollected = collectedList.includes(item.id);
const isReport = item.isUserReport === true;
return `
<div class="col-md-4">
  <div class="card shadow-sm h-100 rounded-4 ${isCollected ? 'opacity-50' : ''}">

    <img src="${item.image}" class="card-img-top">

    <div class="card-body">

      <h5 class="fw-bold">
        ${item.name}
        ${isCollected ? `<span class="badge bg-success ms-2">Collected</span>` : ''}
      </h5>

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
  ?   `<button onclick="markCollected('${item.id}')" 
         class="btn btn-success w-100 mb-2">
         Mark Collected
      </button>`
      : ''
      }

      <button onclick="deleteReport('${item.id}')" 
        class="btn btn-outline-danger w-100">
        Delete
      </button>


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
   DELETE REPORT
========================== */

function deleteReport(id){

if(!confirm("Delete this reported item?")) return;

let reports = JSON.parse(localStorage.getItem("reportedItems")) || [];

reports = reports.filter(r => String(r.id) !== String(id));

localStorage.setItem("reportedItems",JSON.stringify(reports));

location.reload();

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
