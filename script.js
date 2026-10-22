const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const books=[
{id:1,title:"Clean Code",author:"Robert C. Martin",category:"Computer Science",year:2008,cover:"▤",tone:""},
{id:2,title:"Introduction to Algorithms",author:"Thomas H. Cormen et al.",category:"Computer Science",year:2022,cover:"⌘",tone:"c2"},
{id:3,title:"Designing Data-Intensive Applications",author:"Martin Kleppmann",category:"Data Science",year:2017,cover:"✧",tone:"c3"},
{id:4,title:"The Pragmatic Programmer",author:"David Thomas & Andrew Hunt",category:"Engineering",year:2019,cover:"⌁",tone:"c4"},
{id:5,title:"Atomic Design",author:"Brad Frost",category:"Design",year:2016,cover:"◈",tone:"c2"},
{id:6,title:"Business Model Generation",author:"Alexander Osterwalder",category:"Business",year:2010,cover:"▧",tone:"c3"},
{id:7,title:"Python Crash Course",author:"Eric Matthes",category:"Computer Science",year:2023,cover:"Py",tone:""},
{id:8,title:"Hands-On Machine Learning",author:"Aurélien Géron",category:"Data Science",year:2022,cover:"✦",tone:"c4"},
{id:9,title:"Engineering Mathematics",author:"K. A. Stroud",category:"Engineering",year:2013,cover:"∑",tone:"c3"}
];
const defaultRequests=[
{title:"Introduction to Algorithms",author:"T. Cormen",by:"Prof. S. Patil",department:"Computer Science",date:"2026-10-19",status:"Pending review",quantity:2},
{title:"Hands-On Machine Learning",author:"A. Géron",by:"Library Admin",department:"Data Science",date:"2026-10-18",status:"Approved",quantity:1},
{title:"The Pragmatic Programmer",author:"D. Thomas",by:"Prof. A. Deshmukh",department:"Engineering",date:"2026-10-16",status:"Ordered",quantity:3},
{title:"Atomic Design",author:"B. Frost",by:"Design Faculty",department:"Design",date:"2026-10-14",status:"Received",quantity:1}
];
let requests;
try{requests=JSON.parse(localStorage.getItem("dl_requests"))||defaultRequests}catch(e){requests=defaultRequests}
const save=()=>localStorage.setItem("dl_requests",JSON.stringify(requests));
function statusClass(s){return s==="Received"?"received":s==="Approved"?"approved":s==="Ordered"?"ordered":"pending"}
function cover(b){return `<div class="book-cover ${b.tone||""}">${b.cover}</div>`}
function requestRows(list){return list.map(r=>`<tr><td>${esc(r.title)}</td><td>${esc(r.by||"Library Admin")}</td><td>${esc(r.department)}</td><td>${esc(r.date)}</td><td><span class="pill ${statusClass(r.status)}">${esc(r.status)}</span></td></tr>`).join("")||'<tr><td colspan="5">No requests found.</td></tr>'}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderRequests(){const q=($("#requestSearch")?.value||"").toLowerCase(), st=$("#statusFilter")?.value||"all";const list=requests.filter(r=>(r.title+" "+r.department+" "+r.status).toLowerCase().includes(q)&&(st==="all"||r.status===st));$("#requestRows").innerHTML=requestRows(list);$("#recentRows").innerHTML=requests.slice(0,4).map(r=>`<tr><td>${esc(r.title)}</td><td>${esc(r.department)}</td><td><span class="pill ${statusClass(r.status)}">${esc(r.status)}</span></td></tr>`).join("");$("#statOpen").textContent=requests.filter(r=>r.status!=="Received").length}
function bookCard(b){return `<article class="book-card">${cover(b)}<div class="book-info"><h3>${esc(b.title)}</h3><p>${esc(b.author)} · ${b.year}</p><span class="category">${esc(b.category)}</span><button data-book-request="${b.id}">＋ Request this book</button></div></article>`}
function renderBooks(){let q=($("#catalogSearch")?.value||"").toLowerCase(),cat=$("#categoryFilter")?.value||"all";let list=books.filter(b=>(b.title+" "+b.author+" "+b.category).toLowerCase().includes(q)&&(cat==="all"||b.category===cat));$("#bookGrid").innerHTML=list.map(bookCard).join("")||'<div class="empty">No books match your search.</div>';$("#recommendGrid").innerHTML=books.filter(b=>[1,3,7,8,4,5].includes(b.id)).map(bookCard).join("");$("#recommendList").innerHTML=[books[2],books[7],books[0]].map(b=>`<div class="recommend-item">${cover(b)}<div><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div></div>`).join("")}
function go(view){$$(".page").forEach(p=>p.classList.toggle("active",p.id===view));$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===view));$("#pageCrumb").textContent=({dashboard:"Dashboard",catalog:"Book catalogue",requests:"Procurement requests",recommendations:"Recommendations"})[view]||"Dashboard";$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
function openModal(book){$("#modalBackdrop").classList.add("open");const f=$("#requestForm");f.reset();if(book){const b=books.find(x=>x.id===Number(book));if(b){f.elements.title.value=b.title;f.elements.author.value=b.author;f.elements.department.value=b.category}}}
function closeModal(){$("#modalBackdrop").classList.remove("open")}
let toastTimer;function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800)}
$$("[data-view]").forEach(el=>el.addEventListener("click",()=>go(el.dataset.view)));
$$("[data-action='new-request']").forEach(el=>el.addEventListener("click",()=>openModal()));
document.addEventListener("click",e=>{const b=e.target.closest("[data-book-request]");if(b)openModal(b.dataset.bookRequest)});
$("#requestForm").addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget,d=new FormData(f);requests.unshift({title:d.get("title"),author:d.get("author"),by:"Library Admin",department:d.get("department"),date:new Date().toISOString().slice(0,10),status:"Pending review",quantity:Number(d.get("quantity")),priority:d.get("priority"),reason:d.get("reason")});save();renderRequests();renderBooks();closeModal();go("requests");toast("Book request submitted successfully.")});
$("#closeModal").onclick=closeModal;$("#cancelModal").onclick=closeModal;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
$("#catalogSearch").addEventListener("input",renderBooks);$("#categoryFilter").addEventListener("change",renderBooks);$("#requestSearch").addEventListener("input",renderRequests);$("#statusFilter").addEventListener("change",renderRequests);$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");$("#helpBtn").onclick=()=>toast("Demo version: requests are saved in this browser.");
$("#today").textContent=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
renderBooks();renderRequests();