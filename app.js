const KEY="express_products_v2";
function getProducts(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function render(){
 const box=document.getElementById("products"),empty=document.getElementById("empty"); if(!box)return;
 const ps=getProducts(); box.innerHTML=""; empty.style.display=ps.length?"none":"block";
 ps.forEach(p=>{const x=document.createElement("article");x.className="product";
 x.innerHTML=`<img class="product-img" src="${p.image}" alt="${esc(p.name)}"><div class="product-body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.name)}</h3>${p.price?`<strong class="price">${esc(p.price)}</strong>`:""}<p>${esc(p.description)}</p><a class="small-btn" href="${p.link}" target="_blank" rel="noopener">Acheter →</a></div>`;box.appendChild(x)})
}
render();