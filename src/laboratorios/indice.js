// Registro de laboratorios: cada lección pide uno por su tipo (labs: [{ type, title, ... }]).
import { $, esc } from '../nucleo/dom.js';
import { L as genericos } from './genericos.js';
import { L as graficas } from './graficas.js';

export const LABORATORIOS = { ...genericos, ...graficas };
// Los que dibujan: forman el taller de gráficas
export const DE_GRAFICAS = ['complex', 'laplace', 'response', 'ode', 'roots', 'race', 'interp', 'regression', 'fourier'];

export function montarLaboratorio(el, cfg) {
  const fn = LABORATORIOS[cfg.type];
  if (!fn) { el.innerHTML = `<p class="note warn">Laboratorio desconocido: ${esc(cfg.type)}</p>`; return; }
  el.innerHTML = `<section class="lab" aria-label="Laboratorio: ${esc(cfg.title)}">
    <header class="lab-head"><span class="lab-kind">Laboratorio</span><h3 class="lab-title">${cfg.title}</h3></header>
    ${cfg.intro ? `<p class="lab-intro">${cfg.intro}</p>` : ''}
    <div class="lab-body"></div></section>`;
  try { fn($('.lab-body', el), cfg, { esc }); }
  catch (err) { $('.lab-body', el).innerHTML = `<p class="note warn">No se pudo iniciar el laboratorio: ${esc(err.message)}</p>`; console.error(err); }
}
