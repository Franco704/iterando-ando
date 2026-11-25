// Progreso del alumno, guardado en el navegador. Las claves ms-* son las de la versión anterior: nadie pierde lo hecho.
import { almacen } from '../nucleo/almacen.js';
import { LECCIONES, PREGUNTAS, preguntaPorId, leccionesDe } from '../temario/indice.js';

export const hechas = new Set(almacen.leer('ms-done', []));
// Resultado por pregunta: { [id]: { ok, tries } }. id = lección:índice
export const respuestas = almacen.leer('ms-answers', {});
export const mejores = almacen.leer('ms-best', {});

const oyentes = new Set();
export const alCambiarProgreso = (fn) => oyentes.add(fn);
const avisar = () => oyentes.forEach((fn) => fn());

export function alternarHecha(id) {
  hechas.has(id) ? hechas.delete(id) : hechas.add(id);
  almacen.guardar('ms-done', [...hechas]);
  avisar();
  return hechas.has(id);
}

export function registrar(q, ok) {
  respuestas[q.id] = { ok, tries: (respuestas[q.id]?.tries || 0) + 1 };
  almacen.guardar('ms-answers', respuestas);
  avisar();
}

export function guardarMejor(modId, pct) {
  mejores[modId] = Math.max(mejores[modId] ?? 0, pct);
  almacen.guardar('ms-best', mejores);
  avisar();
}

export const paraRepasar = () => Object.keys(respuestas).filter((id) => preguntaPorId[id] && !respuestas[id].ok);
export const hechasDe = (modId) => leccionesDe(modId).filter((l) => hechas.has(l.id)).length;
export const siguienteLeccion = () => LECCIONES.find((l) => !hechas.has(l.id)) || LECCIONES[0];

// Porcentaje de aciertos del módulo; null hasta tener al menos 3 respuestas
export function aciertos(modId) {
  const qs = PREGUNTAS.filter((q) => q.module === modId && respuestas[q.id]);
  return qs.length < 3 ? null : Math.round((qs.filter((q) => respuestas[q.id].ok).length / qs.length) * 100);
}
