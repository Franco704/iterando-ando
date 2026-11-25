// Armazón de la página: barra superior, cajón con el índice, dock inferior (móvil) y riel con las secciones de la lección.
// Mobile-first: en pantallas chicas todo se alcanza desde el dock y el cajón; desde 1024 px el índice queda fijo al costado.
import { $, esc, norm, irA } from '../nucleo/dom.js';
import { rutaActual } from '../nucleo/router.js';
import { PARCIALES, MODULOS, LECCIONES, leccionesDe, etiqueta } from '../temario/indice.js';
import { hechas, mejores, hechasDe, paraRepasar, alCambiarProgreso } from '../estudio/progreso.js';
import { icono } from './iconos.js';

const cajon = $('#cajon');
const velo = $('#velo');
const botonMenu = $('#botonMenu');
const indice = $('#indice');
const buscar = $('#buscar');
const escritorio = matchMedia('(min-width: 1024px)');

// Las mismas herramientas en la barra (escritorio), en el cajón y, las principales, en el dock
const HERRAMIENTAS = [
  ['#/parciales', 'Parciales', 'parciales'],
  ['#/graficas', 'Gráficas', 'graficas'],
  ['#/formulas', 'Fórmulas', 'formulas'],
  ['#/simulacro', 'Simulacro', 'simulacro'],
  ['#/repaso', 'Repasar', 'repasar'],
];
const DOCK = [['#/', 'Inicio', 'inicio'], [null, 'Índice', 'indice'], ['#/parciales', 'Parciales', 'parciales'], ['#/simulacro', 'Simulacro', 'simulacro'], ['#/repaso', 'Repasar', 'repasar']];
const contador = '<span class="contador" data-repaso hidden></span>';

// ---------- Cajón (en móvil y tablet es un panel modal; en escritorio, una columna fija) ----------
export function abrirMenu() {
  if (escritorio.matches) return;
  cajon.classList.add('abierto');
  cajon.inert = false;
  velo.hidden = false;
  document.body.classList.add('sin-scroll');
  document.querySelectorAll('[aria-controls="cajon"]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  $('#cerrarCajon').focus();
}
export function cerrarMenu() {
  const estaba = cajon.classList.contains('abierto');
  cajon.classList.remove('abierto');
  cajon.inert = !escritorio.matches;
  velo.hidden = true;
  document.body.classList.remove('sin-scroll');
  document.querySelectorAll('[aria-controls="cajon"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  if (estaba && cajon.contains(document.activeElement)) botonMenu.focus();
}
export const enfocarBusqueda = () => { abrirMenu(); buscar.focus(); };

// ---------- Índice por parcial, con buscador ----------
export function pintarIndice() {
  const q = norm(buscar.value.trim());
  const actual = rutaActual();
  let html = '', n = 0;
  for (const u of PARCIALES) {
    let mods = '';
    for (const m of MODULOS.filter((x) => x.unit === u.id)) {
      const todas = leccionesDe(m.id);
      const visibles = todas.filter((l) => !q || norm(`${l.title} ${l.keywords || ''} ${m.title}`).includes(q));
      n += visibles.length;
      if (!visibles.length) continue;
      const abierto = q || visibles.some((l) => l.id === actual) || actual === `quiz/${m.id}`;
      mods += `<details class="ind-mod" ${abierto ? 'open' : ''}>
        <summary><span class="ind-tag">${etiqueta(m)}</span><span class="ind-tit">${m.title}</span><span class="ind-cuenta">${hechasDe(m.id)}/${todas.length}</span></summary>
        <ol>${visibles.map((l) => `<li><a class="ind-link${hechas.has(l.id) ? ' hecha' : ''}" href="#/${l.id}" data-id="${l.id}">
          <span class="ind-n">${LECCIONES.indexOf(l) + 1}</span><span>${l.title}</span>${hechas.has(l.id) ? '<span class="sr-only"> (completada)</span>' : ''}</a></li>`).join('')}
          ${q ? '' : `<li><a class="ind-link ind-quiz" href="#/quiz/${m.id}" data-id="quiz/${m.id}"><span class="ind-n" aria-hidden="true">?</span><span>Cuestionario del módulo</span>${mejores[m.id] != null ? `<span class="ind-nota">${mejores[m.id]}%</span>` : ''}</a></li>`}
        </ol></details>`;
    }
    if (mods) html += `<section class="ind-parcial" data-u="${u.id}"><h2>${u.title}<span>${u.name}</span></h2>${mods}</section>`;
  }
  indice.innerHTML = n ? html : `<p class="ind-vacio">No hay temas con “${esc(buscar.value)}”. Probá con otra palabra.</p>`;
  marcarActual();
}

function marcarActual() {
  const actual = rutaActual();
  const ruta = `#/${actual}`;
  indice.querySelectorAll('.ind-link').forEach((a) => a.toggleAttribute('aria-current', a.dataset.id === actual));
  document.querySelectorAll('.barra-enlaces a, .herramientas a, .dock a').forEach((a) => {
    const h = a.getAttribute('href');
    const activa = h === '#/' ? actual === '' : ruta === h || ruta.startsWith(`${h}/`);
    a.toggleAttribute('aria-current', activa);
  });
}

// ---------- Avance general y contador de preguntas para repasar ----------
function pintarAvance() {
  const total = LECCIONES.length;
  const hechasN = LECCIONES.filter((l) => hechas.has(l.id)).length;
  $('#avance').innerHTML = `<span class="avance-barra"><span style="width:${(hechasN / total) * 100}%"></span></span><span class="avance-txt">${hechasN} de ${total} lecciones</span>`;
  const pendientes = paraRepasar().length;
  document.querySelectorAll('[data-repaso]').forEach((b) => { b.hidden = !pendientes; b.textContent = pendientes; });
  const dockRepaso = $('.dock a[href="#/repaso"]');
  dockRepaso?.setAttribute('aria-label', pendientes ? `Repasar, ${pendientes} preguntas pendientes` : 'Repasar');
}

// ---------- Riel: secciones de la lección actual (pantallas anchas) ----------
let observador = null;
export function pintarRiel(main) {
  const riel = $('#riel');
  observador?.disconnect();
  riel.innerHTML = '';
  const hs = [...main.querySelectorAll('.lesson > .body > h2, .lesson > section > h2')];
  if (hs.length < 3) return;
  hs.forEach((h, i) => { if (!h.id) h.id = `s-${i}-${norm(h.textContent).replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`; });
  riel.innerHTML = `<p>En esta lección</p><ol>${hs.map((h) => `<li><a href="#${h.id}" data-target="${h.id}">${h.textContent}</a></li>`).join('')}</ol>`;
  const enlaces = new Map([...riel.querySelectorAll('a')].map((a) => [a.dataset.target, a]));
  riel.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    irA(document.getElementById(a.dataset.target));
  });
  observador = new IntersectionObserver((entradas) => entradas.forEach((en) => {
    if (!en.isIntersecting) return;
    enlaces.forEach((a) => a.removeAttribute('aria-current'));
    enlaces.get(en.target.id)?.setAttribute('aria-current', 'true');
  }), { rootMargin: '0px 0px -70% 0px' });
  hs.forEach((h) => observador.observe(h));
}

// ---------- Montaje ----------
export function montarArmazon() {
  botonMenu.innerHTML = icono('menu', 22);
  $('#cerrarCajon').innerHTML = icono('cerrar', 22);
  $('#botonTema').innerHTML = icono('luna', 20);
  $('#barraEnlaces').innerHTML = HERRAMIENTAS.map(([h, t]) => `<a href="${h}">${t}${h === '#/repaso' ? contador : ''}</a>`).join('');
  $('#herramientas').innerHTML = [['#/', 'Inicio', 'inicio'], ...HERRAMIENTAS].map(([h, t, i]) => `<li><a href="${h}">${icono(i, 18)}<span>${t}</span>${h === '#/repaso' ? contador : ''}</a></li>`).join('');
  $('#dock').innerHTML = DOCK.map(([h, t, i]) => (h
    ? `<a href="${h}">${icono(i, 22)}<span>${t}</span>${h === '#/repaso' ? contador : ''}</a>`
    : `<button type="button" aria-controls="cajon" aria-expanded="false" data-act="indice">${icono(i, 22)}<span>${t}</span></button>`)).join('');

  botonMenu.addEventListener('click', () => (cajon.classList.contains('abierto') ? cerrarMenu() : abrirMenu()));
  $('#dock [data-act="indice"]').addEventListener('click', abrirMenu);
  $('#cerrarCajon').addEventListener('click', cerrarMenu);
  velo.addEventListener('click', cerrarMenu);
  // Elegir un enlace del cajón lo cierra aunque la ruta no cambie
  cajon.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarMenu(); });
  buscar.addEventListener('input', pintarIndice);
  escritorio.addEventListener('change', cerrarMenu);

  $('#botonTema').addEventListener('click', () => {
    const raiz = document.documentElement;
    const oscuro = raiz.dataset.theme ? raiz.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    raiz.dataset.theme = oscuro ? 'light' : 'dark';
    try { localStorage.setItem('ms-theme', raiz.dataset.theme); } catch {}
  });

  alCambiarProgreso(() => { pintarAvance(); pintarIndice(); });
  cerrarMenu();
  pintarAvance();
}
