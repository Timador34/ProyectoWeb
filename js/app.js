/* Para cambiar una portada, poné tu imagen en la carpeta imagenes/ y cambiá la ruta en img */
const juegos = [
  {id:1, titulo:"Zelda: Tears of the Kingdom", cat:"Aventura", precio:460, img:"imagenes/zelda-svg.jpeg"},
  {id:2, titulo:"Elden Ring", cat:"Acción", precio:385, img:"imagenes/elden-ring-svg.webp"},
  {id:3, titulo:"Minecraft", cat:"Aventura", precio:230, img:"imagenes/minecraft-svg.webp"},
  {id:4, titulo:"Mario Kart 8 Deluxe", cat:"Carreras", precio:460, img:"imagenes/mario-kart-svg.avif"},
  {id:5, titulo:"God of War Ragnarök", cat:"Acción", precio:385, img:"imagenes/god-of-war-svg.jpeg"},
  {id:6, titulo:"Forza Horizon 5", cat:"Carreras", precio:385, img:"imagenes/forza-horizon-5-svg.jpeg"},
  {id:7, titulo:"Stardew Valley", cat:"Indie", precio:115, img:"imagenes/stardew-valley-svg.jpeg"},
  {id:8, titulo:"Hades", cat:"Indie", precio:155, img:"imagenes/hades-svg.png"},
  {id:9, titulo:"Hogwarts Legacy", cat:"Aventura", precio:310, img:"imagenes/hogwarts-legacy-svg.avif"}
];

const Q = n => "Q " + n.toLocaleString("es-GT",{minimumFractionDigits:2,maximumFractionDigits:2});

function portada(g){ return g.img; }

let carrito = {};
try { carrito = JSON.parse(localStorage.getItem("carrito-pixel")) || {}; } catch(e){}
let categoria = "Todos", texto = "";

const $ = id => document.getElementById(id);

function guardar(){ try{ localStorage.setItem("carrito-pixel", JSON.stringify(carrito)); }catch(e){} }

function pintarCatalogo(){
  const lista = juegos.filter(g =>
    (categoria==="Todos" || g.cat===categoria) &&
    g.titulo.toLowerCase().includes(texto.toLowerCase()));
  $("catalogo").innerHTML = lista.length ? lista.map(g => `
    <article class="juego">
      <img src="${portada(g)}" alt="Portada de ${g.titulo}">
      <div class="info">
        <h3>${g.titulo}</h3>
        <small>${g.cat}</small>
        <div class="fila">
          <span class="precio">${Q(g.precio)}</span>
          <button class="agregar" data-add="${g.id}">Agregar</button>
        </div>
      </div>
    </article>`).join("") : `<p class="vacio">No encontramos juegos con esa búsqueda.</p>`;
}

function pintarCarrito(){
  const ids = Object.keys(carrito);
  let total = 0, cuenta = 0;
  $("lista").innerHTML = ids.length ? ids.map(id => {
    const g = juegos.find(j => j.id == id), c = carrito[id];
    total += g.precio * c; cuenta += c;
    return `<div class="item">
      <img src="${portada(g)}" alt="">
      <div>
        <strong>${g.titulo}</strong>
        <span>${Q(g.precio * c)}</span>
        <div class="cant">
          <button data-menos="${id}" aria-label="Quitar uno">−</button>
          <b>${c}</b>
          <button data-mas="${id}" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <button class="quitar" data-quitar="${id}">Quitar</button>
    </div>`;
  }).join("") : `<p class="vacio">Tu carrito está vacío. Agregá un juego del catálogo.</p>`;
  $("total").textContent = Q(total);
  $("contador").textContent = cuenta;
  $("pagar").disabled = !ids.length;
  guardar();
}

function aviso(msg){
  const a = $("aviso"); a.textContent = msg; a.classList.add("ver");
  clearTimeout(aviso.t); aviso.t = setTimeout(() => a.classList.remove("ver"), 1800);
}

function abrir(v){
  $("carrito").classList.toggle("abierto", v);
  $("fondo").classList.toggle("abierto", v);
}

document.addEventListener("click", e => {
  const t = e.target;
  if(t.dataset.add){ carrito[t.dataset.add] = (carrito[t.dataset.add]||0) + 1;
    aviso(juegos.find(j=>j.id==t.dataset.add).titulo + " agregado"); pintarCarrito(); }
  if(t.dataset.mas){ carrito[t.dataset.mas]++; pintarCarrito(); }
  if(t.dataset.menos){ if(--carrito[t.dataset.menos] <= 0) delete carrito[t.dataset.menos]; pintarCarrito(); }
  if(t.dataset.quitar){ delete carrito[t.dataset.quitar]; pintarCarrito(); }
  if(t.dataset.cat){ categoria = t.dataset.cat;
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c===t));
    pintarCatalogo(); }
});
$("buscar").addEventListener("input", e => { texto = e.target.value; pintarCatalogo(); });
$("abrir").onclick = () => abrir(true);
$("cerrar").onclick = $("fondo").onclick = () => abrir(false);
document.addEventListener("keydown", e => { if(e.key==="Escape") abrir(false); });
$("pagar").onclick = () => { carrito = {}; pintarCarrito(); abrir(false); aviso("¡Compra realizada! Gracias por tu pedido."); };

pintarCatalogo();
pintarCarrito();
