const API = '/seguro';
const $ = id => document.getElementById(id);
const datos = f => Object.fromEntries(new FormData(f));
async function pedir(url, opt) {
  const r = await fetch(url, opt); const t = await r.text();
  try { return JSON.stringify(JSON.parse(t), null, 2); } catch { return t; }
}
$('fLogin').onsubmit = async e => { e.preventDefault();
  $('rLogin').textContent = await pedir(API + '/login', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos(e.target)) }); };
$('fPedido').onsubmit = async e => { e.preventDefault();
  $('rPedido').textContent = await pedir(API + '/pedidos/' + datos(e.target).id); };
$('fRep').onsubmit = async e => { e.preventDefault();
  $('rRep').textContent = await pedir(API + '/reporte?filtro=' + encodeURIComponent(datos(e.target).filtro)); };
$('fCom').onsubmit = async e => { e.preventDefault();
  await fetch(API + '/comentarios', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos(e.target)) }); e.target.reset(); cargar(); };
async function cargar() {
  const lista = await (await fetch(API + '/comentarios')).json();
  // ✅ A05: textContent muestra el texto tal cual, sin ejecutarlo
  $("lista").replaceChildren(...lista.map(c => {
    const d = document.createElement("div"); d.className = "coment";
    const b = document.createElement("b"); b.textContent = c.autor;
    d.append(b, ": " + c.texto); return d;
  }));
}
cargar();
