const KEY="express_products_v2";
const $=id=>document.getElementById(id);
function getProducts(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function saveProducts(p){localStorage.setItem(KEY,JSON.stringify(p))}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function render(){
 const box=$("adminProducts"),ps=getProducts();box.innerHTML="";
 if(!ps.length){box.innerHTML='<p class="muted">Aucun produit ajouté.</p>';return}
 ps.forEach((p,i)=>{const d=document.createElement("div");d.className="admin-item";
 d.innerHTML=`<img src="${p.image}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.category)}${p.price?" · "+esc(p.price):""}</small></div><button type="button" class="delete" data-i="${i}">Supprimer</button>`;
 box.appendChild(d)});
 box.querySelectorAll(".delete").forEach(b=>b.onclick=()=>{let p=getProducts();p.splice(+b.dataset.i,1);saveProducts(p);render()})
}
$("productForm").addEventListener("submit",function(e){
 e.preventDefault();
 const file=$("image").files[0];
 if(!file){alert("Choisis une photo.");return}
 const link=$("link").value.trim();
 if(!link){alert("Colle ton lien affilié AliExpress.");return}
 const reader=new FileReader();
 reader.onload=function(){
  const p={name:$("name").value.trim(),category:$("category").value,price:$("price").value.trim(),description:$("description").value.trim(),image:reader.result,link};
  if(!p.name||!p.description){alert("Remplis le nom et la description.");return}
  const all=getProducts();all.push(p);saveProducts(all);$("productForm").reset();render();alert("✅ Produit ajouté avec succès !");
 };
 reader.onerror=()=>alert("Erreur lors de la lecture de la photo.");
 reader.readAsDataURL(file);
});
$("clearAll").onclick=()=>{if(confirm("Supprimer tous les produits ?")){localStorage.removeItem(KEY);render()}};
render();