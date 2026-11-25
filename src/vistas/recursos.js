// Recursos para el parcial: parciales reales resueltos, hoja de fórmulas y taller de gráficas.
import { $, irA } from '../nucleo/dom.js';
import { PARCIALES, MODULOS, LECCIONES, EXAMENES, EJERCICIOS, FORMULAS, examenPorId, modulo, leccionesDe } from '../temario/indice.js';
import { montarLaboratorio, DE_GRAFICAS } from '../laboratorios/indice.js';
import { ejercicios } from './leccion.js';

const titulo = (u) => `<h2>${u.title}<span>${u.name}</span></h2>`;
const saltos = (prefijo, lista) => `<nav class="filtro" aria-label="Ir a un parcial">${lista.map((u) => `<a class="btn sm" href="#${prefijo}-${u.id}" data-salto data-u="${u.id}">${u.title}</a>`).join('')}</nav>`;
// Los saltos dentro de la página no cambian la ruta
const activarSaltos = (main) => main.querySelectorAll('[data-salto]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); irA($(a.getAttribute('href'), main)); }));

export function vistaParciales(main) {
  document.title = 'Parciales resueltos, Iterando Ando';
  const conExamen = EJERCICIOS.filter(({ ex }) => ex.exam);
  const n = conExamen.reduce((a, { ex }) => a + ex.exam.length, 0);
  // Ranking: ejercicios que aparecen en más de un examen
  const nEx = (ex) => new Set(ex.exam.map((k) => k.split('#')[0])).size;
  const top = conExamen.filter(({ ex }) => nEx(ex) > 1).sort((a, b) => nEx(b.ex) - nEx(a.ex));
  const porMod = MODULOS.map((m) => ({ m, k: conExamen.filter(({ l }) => l.module === m.id).reduce((a, { ex }) => a + ex.exam.length, 0) })).filter((x) => x.k).sort((a, b) => b.k - a.k);
  const max = porMod[0]?.k || 1;
  const item = (e, [num, texto]) => {
    const hit = conExamen.find(({ ex }) => ex.exam.includes(`${e.id}#${num}`));
    return `<details class="exam-q"><summary>${num}. ${texto}${hit ? ` <small>Unidad ${modulo(hit.l.module).tema}</small>` : ''}</summary>
      ${hit ? `${ejercicios({ exercises: [hit.ex] })}<p class="q-link"><a href="#/${hit.l.id}">Ver la teoría: “${hit.l.title}”</a></p>` : '<p class="muted-s">Sin resolución cargada.</p>'}</details>`;
  };
  const conExamenes = PARCIALES.filter((u) => EXAMENES.some((e) => e.unit === u.id));
  main.innerHTML = `
    <article class="lesson exams-page">
      <h1>Parciales resueltos</h1>
      <p class="tldr">Los ${EXAMENES.length} parciales de la cátedra que tenemos, ítem por ítem y resueltos como se espera en el examen. Cada ejercicio tiene una parte práctica (calcular) y una teórica (definir, justificar): la cátedra repite casi las mismas preguntas teóricas, por eso conviene empezar por las que <mark>se repiten</mark>.</p>
      ${saltos('px', conExamenes)}
      <h2>Lo que más se repite</h2>
      <ol class="freq">${top.map(({ ex, l }) => `<li><span class="n">×${nEx(ex)}</span><span><a href="#/${l.id}">${ex.title}</a><small>Unidad ${modulo(l.module).tema}: ${[...new Set(ex.exam.map((k) => examenPorId[k.split('#')[0]]?.short))].join(', ')}</small></span></li>`).join('')}</ol>
      <h2>Qué temas pesan más</h2>
      <ol class="peso">${porMod.map(({ m, k }) => `<li data-u="${m.unit}"><a href="#/${leccionesDe(m.id)[0].id}">Unidad ${m.tema}: ${m.title}</a><span class="peso-barra" style="--p:${k / max}" aria-hidden="true"></span><small>${k} ${k === 1 ? 'ítem' : 'ítems'} de ${n}</small></li>`).join('')}</ol>
      ${conExamenes.map((u) => `<section data-u="${u.id}" id="px-${u.id}">${titulo(u)}
        ${EXAMENES.filter((e) => e.unit === u.id).map((e) => `<details class="exam-block"><summary><b>${e.title}</b><span>${e.sub}, ${e.items.length} ítems</span></summary>
          <div class="exam-body">${e.note ? `<p class="muted-s">${e.note}</p>` : ''}${e.items.map((it) => item(e, it)).join('')}</div></details>`).join('')}</section>`).join('')}
    </article>`;
  activarSaltos(main);
}

export function vistaFormulas(main) {
  document.title = 'Fórmulas, Iterando Ando';
  const conFichas = (u) => MODULOS.filter((m) => m.unit === u.id && FORMULAS.some((f) => f.m === m.id));
  const lista = PARCIALES.filter((u) => conFichas(u).length);
  main.innerHTML = `
    <article class="lesson formulas-page">
      <h1>Fórmulas</h1>
      <p class="tldr">Todo lo que hay que saber calcular, tema por tema. Tocá el nombre de la unidad para ir a la lección donde se explica cada fórmula.</p>
      ${saltos('f', lista)}
      ${lista.map((u) => `<section data-u="${u.id}" id="f-${u.id}">${titulo(u)}
        ${conFichas(u).map((m) => `<h3><a href="#/${leccionesDe(m.id)[0].id}">Unidad ${m.tema}: ${m.title}</a></h3>
          <dl class="fichas">${FORMULAS.filter((f) => f.m === m.id).map((f) => `<div class="ficha"><dt>${f.n}</dt><dd><span class="f">${f.f}</span>${f.d ? `<small>${f.d}</small>` : ''}</dd></div>`).join('')}</dl>`).join('')}
      </section>`).join('')}
    </article>`;
  activarSaltos(main);
}

export function vistaGraficas(main) {
  document.title = 'Taller de gráficas, Iterando Ando';
  const todos = LECCIONES.flatMap((l) => (l.labs || []).filter((c) => DE_GRAFICAS.includes(c.type)).map((c) => ({ c, l, m: modulo(l.module) })));
  const lista = PARCIALES.filter((u) => !u.all && todos.some((x) => x.m.unit === u.id));
  main.innerHTML = `
    <article class="lesson labs-page">
      <h1>Taller de gráficas</h1>
      <p class="tldr">Las ${todos.length} gráficas interactivas de la guía en un solo lugar. Para cada uno: <mark>predecí</mark> el resultado (hacia dónde va la iteración, cuánto da el área, si converge), después mové el control y comprobá. Arriba de cada uno está la lección donde se explica.</p>
      ${saltos('g', lista)}
      ${lista.map((u) => `<section class="labs-parcial" data-u="${u.id}" id="g-${u.id}">${titulo(u)}
        ${todos.filter((x) => x.m.unit === u.id).map((x) => `<div class="labs-item"><p class="labs-de">Unidad ${x.m.tema}, <a href="#/${x.l.id}">${x.l.title}</a></p><div class="lab-mount" data-g="${todos.indexOf(x)}"></div></div>`).join('')}
      </section>`).join('')}
    </article>`;
  main.querySelectorAll('[data-g]').forEach((el) => montarLaboratorio(el, todos[+el.dataset.g].c));
  activarSaltos(main);
}
