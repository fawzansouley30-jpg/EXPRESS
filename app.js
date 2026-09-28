const grid=document.getElementById("productsGrid"),empty=document.getElementById("empty"),search=document.getElementById("search"),search2=document.getElementById("search2"),sort=document.getElementById("sort"),count=document.getElementById("count");
let all=[],category="Tous";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const num=v=>{const n=parseFloat(String(v??"").replace(/[^\d.,]/g,"").replace(",","."));return Number.isFinite(n)?n:null};
function setQuery(v){search.value=v;search2.value=v;render()}
function render(){
 const q=(search.value||search2.value).trim().toLowerCase();
 let list=all.filter(p=>(category==="Tous"||p.category===category)&&(!q||[p.name,p.description,p.category].some(x=>String(x??"").toLowerCase().includes(q))));
 if(sort.value==="name")list.sort((a,b)=>String(a.name).localeCompare(String(b.name),"fr"));
 if(sort.value==="priceUp")list.sort((a,b)=>(num(a.price)??999999)-(num(b.price)??999999));
 if(sort.value==="priceDown")list.sort((a,b)=>(num(b.price)??-1)-(num(a.price)??-1));
 count.textContent=`${list.length} produit${list.length>1?"s":""}`;
 grid.innerHTML="";empty.style.display=list.length?"none":"block";
 if(!list.length){empty.textContent="Aucun produit ne correspond à votre recherche.";return}
 list.forEach((p,i)=>{
   const d=document.createElement("article");d.className="card";
   const label=i===0?"-20%":i===1?"Populaire":i===2?"Nouveau":"À découvrir";
   d.innerHTML=`<a class="product-image" href="${esc(p.affiliate_link)}" target="_blank" rel="noopener sponsored"><img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="${i<5?"eager":"lazy"}"><span class="badge ${i===1?"orange":i===2?"green":""}">${label}</span><button class="heart" type="button">♡</button></a>
   <div class="card-body"><small>${esc(p.category||"Produit")}</small><h3>${esc(p.name)}</h3><div class="meta">★ <b>4.8</b> <span>• Sélection EXPRESS</span></div>${p.price?`<div class="price">${esc(p.price)}</div>`:""}<p>${esc(p.description||"Produit sélectionné par EXPRESS.")}</p><a class="buy" href="${esc(p.affiliate_link)}" target="_blank" rel="noopener sponsored">Acheter →</a></div>`;
   d.querySelector(".heart").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();e.currentTarget.classList.toggle("liked")});
   grid.appendChild(d);
 });
}
async function load(){try{const {data,error}=await supabaseClient.from("products").select("id,name,category,price,description,image_url,affiliate_link,created_at").order("created_at",{ascending:false});if(error)throw error;all=data||[];render()}catch(e){console.error(e);empty.textContent="Impossible de charger les produits pour le moment."}}
search.addEventListener("input",()=>{search2.value=search.value;render()});search2.addEventListener("input",()=>{search.value=search2.value;render()});sort.addEventListener("change",render);
document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.category;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.category===category));render()}));
document.getElementById("searchBtn").onclick=()=>document.getElementById("products").scrollIntoView({behavior:"smooth"});
load();