// Una lección: teoría con sus laboratorios, preguntas, ejercicios de los TP y de los parciales, bibliografía y navegación.
import { $, esc } from '../nucleo/dom.js';
import { LECCIONES, PREGUNTAS, examenPorId, modulo, parcial, leccionesDe } from '../temario/indice.js';
import { montarLaboratorio } from '../laboratorios/indice.js';
import { montarCuestionario } from '../estudio/opcion-multiple.js';
import { hechas, alternarHecha } from '../estudio/progreso.js';
import { glifo } from '../animaciones/entrada.js';
import { pintarRiel } from '../ui/armazon.js';

const NIVEL = { 1: 'Básico', 2: 'Intermedio', 3: 'Desafío' };
// Chips con los exámenes donde se tomó un ejercicio (sin repetir)
const chipsExamen = (lista) => [...new Set(lista.map((k) => examenPorId[k.split('#')[0]]).filter(Boolean))]
  .map((e) => `<a class="chip" href="#/parciales">${e.short}</a>`).join('');

export function ejercicios(l) {
  let practica = 0;
  return (l.exercises || []).map((ex) => {
    const px = !ex.official && ex.exam;
    // Soluciones con código: archivos con nombre y lenguaje
    const archivos = (ex.solution.files || []).map((f) => `<div class="sol-file">${f.name ? `<p class="file-name">${f.name}</p>` : ''}<pre class="code" data-lang="${f.lang}">${esc(f.code.trim())}</pre></div>`).join('');
    const tag = ex.tag || (ex.official ? `TP ${ex.official.split('.')[0]}, ejercicio ${ex.official.split('.')[1]}` : px ? 'Ejercicio de parcial' : `Práctica ${++practica}`);
    return `
      <article class="exercise${ex.official ? ' official' : px ? ' parcial' : ''}">
        <header class="ex-head"><span class="ex-tag${px ? ' px' : ''}">${tag}</span>${ex.level ? `<span class="ex-level" data-level="${ex.level}">${NIVEL[ex.level]}</span>` : ''}</header>
        ${ex.exam ? `<p class="ex-exams"><span class="chip">${ex.official ? 'También tomado en' : 'Tomado en'}</span>${chipsExamen(ex.exam)}</p>` : ''}
        <h3>${ex.title}</h3>
        <div class="ex-prompt">${ex.prompt}</div>
        ${ex.hints ? `<details class="hint"><summary>Ver pistas</summary><ul>${ex.hints.map((h) => `<li>${h}</li>`).join('')}</ul></details>` : ''}
        <details class="solution"><summary>Ver solución</summary><div class="sol-body">${ex.solution.explain ? `<div class="sol-explain">${ex.solution.explain}</div>` : ''}${archivos}</div></details>
      </article>`;
  }).join('');
}

const fuentes = (l) => (l.sources || []).map((s) => `
  <details class="source">
    <summary><span>${s.title}</span><span class="host">${s.url ? new URL(s.url).hostname.replace('www.', '') : s.ref || ''}</span></summary>
    <div class="source-body"><ul>${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>${s.url ? `<p><a href="${s.url}" target="_blank" rel="noopener">Abrir la fuente</a></p>` : ''}</div>
  </details>`).join('');

export function vistaLeccion(main, idx) {
  const l = LECCIONES[idx];
  const m = modulo(l.module);
  const u = parcial(m.unit);
  const prev = LECCIONES[idx - 1], next = LECCIONES[idx + 1];
  const labs = l.labs || [];
  document.body.dataset.unit = m.unit;
  document.title = `${l.title}, Iterando Ando`;

  // Laboratorios que el cuerpo no ubica van al final de la teoría
  const donde = l.body + (l.exercises || []).map((e) => e.prompt).join('');
  const ubicados = new Set([...donde.matchAll(/data-lab="(\d+)"/g)].map((x) => +x[1]));
  const resto = labs.map((_, i) => i).filter((i) => !ubicados.has(i)).map((i) => `<div class="lab-mount" data-lab="${i}"></div>`).join('');
  const ej = ejercicios(l), bib = fuentes(l);
  const quiz = PREGUNTAS.filter((q) => q.lesson === l);
  const delModulo = leccionesDe(m.id);

  main.innerHTML = `
    <article class="lesson">
      <header class="lesson-head">
        <p class="crumb"><span class="chip-parcial">${u.title}</span><a href="#/${delModulo[0].id}">Unidad ${m.tema}: ${m.title}</a></p>
        <div class="lesson-glyph" aria-hidden="true">${glifo(m.id)}</div>
        <h1>${l.title}</h1>
        <p class="lesson-pos">Lección ${delModulo.indexOf(l) + 1} de ${delModulo.length} de la unidad, ${idx + 1} de ${LECCIONES.length} de la materia</p>
      </header>
      <p class="tldr">${l.tldr}</p>
      ${l.goals ? `<div class="goals"><p>Al terminar vas a poder:</p><ul>${l.goals.map((g) => `<li>${g}</li>`).join('')}</ul></div>` : ''}
      <div class="body">${l.body}${resto}</div>
      ${quiz.length ? '<section class="check-sec" id="comprobar"><h2>Comprobá lo que entendiste</h2><p class="sec-lede">Elegí una respuesta: la corrección es inmediata. Lo que falles queda guardado para repasar.</p><div class="quiz-mount"></div></section>' : ''}
      ${ej ? `<section class="practice" id="ejercicios"><h2>Ejercicios</h2><p class="sec-lede">Resolvelos en papel, con calculadora, antes de abrir la solución. Equivocarse acá es gratis.</p>${ej}</section>` : ''}
      ${bib ? `<section class="sources" id="bibliografia"><h2>Bibliografía</h2><p class="sec-lede">Qué dice cada fuente sobre este tema.</p>${bib}</section>` : ''}
      <div class="done-row">
        <button class="btn done-btn" type="button" aria-pressed="${hechas.has(l.id)}">${hechas.has(l.id) ? 'Lección completada' : 'Marcar como completada'}</button>
      </div>
      <nav class="pager" aria-label="Lecciones">
        ${prev ? `<a class="prev" href="#/${prev.id}"><small>Anterior</small><strong>${prev.title}</strong></a>` : '<span></span>'}
        ${next ? `<a class="next" href="#/${next.id}"><small>Siguiente</small><strong>${next.title}</strong></a>` : `<a class="next" href="#/quiz/${m.id}"><small>Para cerrar</small><strong>Cuestionario del módulo</strong></a>`}
      </nav>
    </article>`;

  main.querySelectorAll('.lab-mount').forEach((el) => { const cfg = labs[+el.dataset.lab]; if (cfg) montarLaboratorio(el, cfg); });
  if (quiz.length) montarCuestionario($('.quiz-mount', main), quiz, { mode: 'inline' });
  $('.done-btn', main).addEventListener('click', (e) => {
    const on = alternarHecha(l.id);
    e.currentTarget.setAttribute('aria-pressed', on);
    e.currentTarget.textContent = on ? 'Lección completada' : 'Marcar como completada';
  });
  pintarRiel(main);
}
