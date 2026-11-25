// Práctica con preguntas: cuestionario de un módulo, simulacro de cada parcial y repaso de lo fallado.
import { $, shuffle } from '../nucleo/dom.js';
import { PARCIALES, PREGUNTAS, preguntaPorId, parcial, leccionesDe, modulosDe, modulo } from '../temario/indice.js';
import { montarCuestionario } from '../estudio/opcion-multiple.js';
import { respuestas, mejores, guardarMejor, paraRepasar, siguienteLeccion } from '../estudio/progreso.js';

// Primero las que fallaste, después las que nunca respondiste, al final las que acertaste
const peso = (q) => (respuestas[q.id]?.ok === false ? 0 : respuestas[q.id] ? 2 : 1);

export function vistaCuestionarioModulo(main, m) {
  document.title = `Cuestionario: ${m.title}`;
  document.body.dataset.unit = m.unit;
  const pool = PREGUNTAS.filter((q) => q.module === m.id);
  const qs = shuffle(pool).sort((a, b) => peso(a) - peso(b)).slice(0, 15);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <p class="crumb"><a href="#/${leccionesDe(m.id)[0].id}">Unidad ${m.tema}: ${m.title}</a></p>
      <h1>Cuestionario del módulo</h1>
      <p class="tldr">${qs.length} preguntas de las ${pool.length} del módulo. Aparecen primero las que fallaste y las que nunca respondiste.${mejores[m.id] != null ? ` Tu mejor resultado: ${mejores[m.id]} %.` : ''}</p>
      <div class="quiz-mount"></div>
    </article>`;
  montarCuestionario($('.quiz-mount', main), qs, { mode: 'exam', onFinish: (pct) => guardarMejor(m.id, pct) });
}

export function vistaSimulacro(main, uid) {
  const u = parcial(uid);
  if (!u) { location.replace(`#/simulacro/${modulo(siguienteLeccion().module).unit}`); return; }
  document.title = `Simulacro ${u.title.toLowerCase()}, Iterando Ando`;
  document.body.dataset.unit = u.id;
  const mods = modulosDe(u.id);
  // Reparte las preguntas entre las unidades para que ninguna domine
  const repartir = (pool, max) => {
    const porMod = mods.map((m) => shuffle(pool.filter((q) => q.module === m.id))).filter((a) => a.length);
    const out = [];
    for (let i = 0; out.length < max && porMod.some((a) => a[i]); i++) shuffle(porMod).forEach((a) => a[i] && out.length < max && out.push(a[i]));
    return out;
  };
  const qs = repartir(PREGUNTAS, 20);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <nav class="filtro" aria-label="Elegir el simulacro">${PARCIALES.map((x) => `<a class="btn sm" data-u="${x.id}" href="#/simulacro/${x.id}"${x === u ? ' aria-current="page"' : ''}>${x.title}</a>`).join('')}</nav>
      <h1>Simulacro del ${u.title.toLowerCase()}</h1>
      <p class="tldr">${qs.length} preguntas mezcladas de ${u.name.toLowerCase()} (TP ${[...new Set(mods.map((m) => m.tp))].join(', ')}). Respondé todas y corregí al final. Esto entrena la parte <mark>teórica</mark>; la práctica se entrena con los ejercicios de los TP de cada lección y en el <a href="#/graficas">taller de gráficas</a>.</p>
      <div class="quiz-mount"></div>
    </article>`;
  montarCuestionario($('.quiz-mount', main), shuffle(qs), { mode: 'exam' });
}

export function vistaRepaso(main) {
  document.title = 'Repasar, Iterando Ando';
  const ids = paraRepasar();
  const qs = ids.map((id) => preguntaPorId[id]);
  main.innerHTML = `
    <article class="lesson quiz-page">
      <h1>Repasar</h1>
      ${ids.length ? `<p class="tldr">${ids.length === 1 ? 'Esta es la pregunta que respondiste mal' : `Estas son las ${ids.length} preguntas que respondiste mal`} la última vez. Cuando aciertes una, sale de la lista.</p><div class="quiz-mount"></div>`
        : `<p class="tldr">No tenés preguntas pendientes. Cada vez que falles una, en una lección, un cuestionario o un simulacro, aparece acá para que la vuelvas a intentar.</p>
           <p class="acciones">${PARCIALES.map((u, i) => `<a class="btn${i ? '' : ' primary'}" href="#/simulacro/${u.id}">Simulacro del ${u.title.toLowerCase()}</a>`).join('')}</p>`}
    </article>`;
  if (qs.length) montarCuestionario($('.quiz-mount', main), qs, { mode: 'review' });
}
