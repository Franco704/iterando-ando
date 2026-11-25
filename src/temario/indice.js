// Todo el temario listo para las vistas. Los parciales reales suman ejercicios al final de cada lección (después de los del TP).
import { PARCIALES, MODULOS } from './catalogo.js';
import { LESSONS } from './lecciones.js';
import { EXAMS } from '../examenes/parciales-reales.js';
import { FORMULAS } from '../estudio/formulas.js';

export { PARCIALES, MODULOS, FORMULAS, EXAMS as EXAMENES };
export const LECCIONES = LESSONS;

// Todas las preguntas con id estable (lección:índice): el progreso guardado depende de estos ids.
export const PREGUNTAS = LECCIONES.flatMap((l) => (l.quiz || []).map((q, i) => ({ ...q, id: `${l.id}:${i}`, lesson: l, module: l.module })));
export const preguntaPorId = Object.fromEntries(PREGUNTAS.map((q) => [q.id, q]));
// Parciales reales: cada ejercicio con exam: ['1p-2024-1#2a'] queda enlazado al ítem 2a de ese parcial
export const examenPorId = Object.fromEntries(EXAMS.map((e) => [e.id, e]));
export const EJERCICIOS = LECCIONES.flatMap((l) => (l.exercises || []).map((ex) => ({ ex, l })));

export const parcial = (id) => PARCIALES.find((u) => u.id === id);
export const modulo = (id) => MODULOS.find((m) => m.id === id);
export const leccionesDe = (modId) => LECCIONES.filter((l) => l.module === modId);
export const modulosDe = (u) => MODULOS.filter((m) => m.unit === u);
export const etiqueta = (m) => `Unidad ${m.tema}, TP ${m.tp}`;
