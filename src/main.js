// Raíz de composición: conecta el armazón, las rutas y las vistas.
import { $, irA } from './nucleo/dom.js';
import { rutaActual } from './nucleo/router.js';
import { LECCIONES, modulo } from './temario/indice.js';
import { entrada } from './animaciones/entrada.js';
import { montarArmazon, pintarIndice, cerrarMenu, enfocarBusqueda } from './ui/armazon.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaLeccion } from './vistas/leccion.js';
import { vistaCuestionarioModulo, vistaSimulacro, vistaRepaso } from './vistas/cuestionarios.js';
import { vistaParciales, vistaFormulas, vistaGraficas, vistaApuntes } from './vistas/recursos.js';

const main = $('#principal');
montarArmazon();

let primeraCarga = true;
let limpiar = null;   // la portada deja un reloj andando
async function resolver() {
  const id = rutaActual();
  const idx = LECCIONES.findIndex((l) => l.id === id);
  // Pantalla de entrada al cambiar de módulo; si mientras tanto cambió la ruta, gana la nueva
  if (idx !== -1) { await entrada(id, primeraCarga); if (rutaActual() !== id) return; }
  primeraCarga = false;
  limpiar?.(); limpiar = null;
  delete document.body.dataset.unit;
  $('#riel').innerHTML = '';
  const [raiz, arg] = [id.split('/')[0], id.split('/').slice(1).join('/')];
  if (idx !== -1) vistaLeccion(main, idx);
  else if (raiz === 'quiz' && modulo(arg)) vistaCuestionarioModulo(main, modulo(arg));
  else if (raiz === 'simulacro') vistaSimulacro(main, arg);
  else if (raiz === 'repaso') vistaRepaso(main);
  else if (raiz === 'parciales') vistaParciales(main);
  else if (raiz === 'formulas') vistaFormulas(main);
  else if (raiz === 'graficas') vistaGraficas(main);
  else if (raiz === 'apuntes') vistaApuntes(main);
  else limpiar = vistaInicio(main);
  document.body.dataset.view = idx !== -1 ? 'leccion' : main.querySelector('.inicio') ? 'inicio' : raiz;
  pintarIndice();
  cerrarMenu();
  scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

addEventListener('hashchange', resolver);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { cerrarMenu(); return; }
  if (e.target.closest('input, textarea, select, [contenteditable]') || e.altKey || e.ctrlKey || e.metaKey) return;
  const idx = LECCIONES.findIndex((l) => l.id === rutaActual());
  if (e.key === 'ArrowRight' && idx > -1 && idx < LECCIONES.length - 1) location.hash = `#/${LECCIONES[idx + 1].id}`;
  if (e.key === 'ArrowLeft' && idx > 0) location.hash = `#/${LECCIONES[idx - 1].id}`;
  if (e.key === '/') { e.preventDefault(); enfocarBusqueda(); }
});
// Enlaces dentro de la misma página (#seccion): se desplazan sin tocar la ruta
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]:not([href^="#/"]):not([data-salto])');
  const destino = a && a.getAttribute('href').length > 1 && document.getElementById(a.getAttribute('href').slice(1));
  if (!destino) return;
  e.preventDefault();
  irA(destino);
});
resolver();
