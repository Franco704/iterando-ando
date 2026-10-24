// Autocomprobación del contenido: carga todos los temas y valida su estructura. Uso: node tests/content.test.js
const assert = require('assert');
global.window = {};
const files = ['content/_helpers', 'labs/core', 'labs/num', 'labs/math', 'content/01-complejos', 'content/02-laplace', 'content/03-edo-laplace', 'content/04-transferencia', 'content/05-edo-aprox', 'content/06-cerrados', 'content/07-abiertos', 'content/08-interpolacion', 'content/09-regresion', 'content/10-fourier', 'content/formulas', 'content/parciales'];
files.forEach((f) => require(`../js/${f}.js`));
const { LESSONS, MODULES, LABS, FORMULAS, EXAMS } = window.GUIDE;
const ids = new Set();
for (const l of LESSONS) {
  assert(!ids.has(l.id), `id repetido ${l.id}`); ids.add(l.id);
  assert(MODULES.some((m) => m.id === l.module), `módulo inexistente en ${l.id}`);
  for (const c of l.labs || []) assert(LABS[c.type], `lab ${c.type} en ${l.id}`);
  for (const q of l.quiz || []) assert(q.a >= 0 && q.a < q.o.length, `respuesta fuera de rango en ${l.id}: ${q.q}`);
  for (const e of l.exercises || []) assert(!e.official || /^\d+\.\d+$/.test(e.official), `official mal en ${l.id}`);
  const placed = [...l.body.matchAll(/data-lab="(\d+)"/g)].map((m) => +m[1]);
  placed.forEach((i) => assert(l.labs && l.labs[i], `lab(${i}) sin definir en ${l.id}`));
  assert(!/NaN|undefined/.test(l.body + JSON.stringify(l.exercises || [])), `NaN/undefined en ${l.id}`);
}
// Parciales: cada etiqueta exam apunta a un ítem existente y cada ítem tiene su resolución
const items = new Set(EXAMS.flatMap((e) => e.items.map(([k]) => `${e.id}#${k}`)));
const tagged = LESSONS.flatMap((l) => [...(l.exercises || []), ...(l.quiz || [])].flatMap((x) => x.exam || []));
tagged.forEach((k) => assert(items.has(k), `etiqueta de parcial inexistente: ${k}`));
items.forEach((k) => assert(tagged.includes(k), `ítem de parcial sin resolver: ${k}`));
MODULES.forEach((m) => assert(LESSONS.some((l) => l.module === m.id), `módulo sin lecciones ${m.id}`));
FORMULAS.forEach((f) => assert(MODULES.some((m) => m.id === f.m), `fórmula con módulo inexistente ${f.n}`));
const n = (k) => LESSONS.reduce((a, l) => a + (l[k]?.length || 0), 0);
console.log(`contenido OK: ${EXAMS.length} parciales (${items.size} ítems), ${LESSONS.length} lecciones, ${n('labs')} laboratorios, ${n('quiz')} preguntas, ${n('exercises')} ejercicios`);
