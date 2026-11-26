// Portada: Newton Raphson real sobre x³ − 100 (calculado con src/metodos/numericos.js), con las cifras correctas de cada iterado;
// después, los dos parciales con sus unidades y su avance, los parciales reales y las otras guías.
import { num } from '../nucleo/formato.js';
import { plot } from '../temario/redaccion.js';
import { N } from '../metodos/numericos.js';
import { PARCIALES, MODULOS, LECCIONES, PREGUNTAS, EXAMENES, EJERCICIOS, leccionesDe, modulosDe, etiqueta } from '../temario/indice.js';
import { hechas, hechasDe, aciertos, paraRepasar, siguienteLeccion } from '../estudio/progreso.js';
import { OTRAS_GUIAS } from '../estudio/otras-guias.js';
import { icono } from '../ui/iconos.js';

const REPO = 'https://github.com/Franco704/iterando-ando';
const SUB = '₀₁₂₃₄₅₆₇₈₉';

// Iterados de Newton con sus cifras correctas marcadas: cerca de la raíz, cada vuelta las duplica
function newton() {
  const f = (x) => x ** 3 - 100, raiz = Math.cbrt(100);
  const pasos = N.newton(f, (x) => 3 * x * x, 8, { n: 5 });
  const exacta = raiz.toFixed(9);
  const fila = (x, k, e) => {
    const s = x.toFixed(9);
    let c = 0;
    while (c < s.length && s[c] === exacta[c]) c++;
    const cifras = s.slice(0, c).replace('.', '').length;
    return `<li style="--k:${k}"><span class="it-n">x${SUB[k]}</span><span class="it-x"><b>${s.slice(0, c).replace('.', ',')}</b>${s.slice(c).replace('.', ',')}</span><span class="it-c${cifras ? '' : ' cero'}">${cifras ? `${cifras} ${cifras === 1 ? 'cifra correcta' : 'cifras correctas'}` : 'ninguna correcta'}</span><span class="it-e">${e == null ? '' : `ε<sub>a</sub> ${num(e, e < 0.01 ? 6 : 2)} %`}</span></li>`;
  };
  const grafico = plot({ x: [3.4, 8.6], y: [-70, 450], w: 420, h: 250, alt: `Newton Raphson sobre x³ − 100 desde 8: ${pasos.map((p) => num(p.xn, 4)).join(', ')}`,
    ticks: { x: [4, 5, 6, 7, 8] },
    curves: [{ f, cls: 'c-f', label: 'f(x) = x³ − 100', at: 6.4 }],
    segs: pasos.slice(0, 4).flatMap((p) => [{ from: [p.x, p.fx], to: [p.xn, 0], cls: 'c-root' }, { from: [p.xn, 0], to: [p.xn, f(p.xn)], cls: 'c-tan pl-faint' }]),
    points: [...pasos.slice(0, 3).map((p, k) => ({ x: p.x, y: p.fx, cls: 'c-g', r: 4, label: `x${SUB[k]}`, pos: 'nw' })), { x: raiz, y: 0, cls: 'c-root', label: '∛100', pos: 's' }] });
  return `
    <figure class="iteracion">
      <div class="iteracion-grafico">${grafico}</div>
      <ol class="iterados">${fila(8, 0, null)}${pasos.map((p, k) => fila(p.xn, k + 1, p.e)).join('')}</ol>
      <figcaption>Newton Raphson sobre f(x) = x³ − 100 desde x₀ = 8, calculado con el mismo código que los laboratorios. La raíz es ∛100 = ${num(raiz, 9)}: con ${pasos.length} tangentes el error relativo baja de ${num(pasos[0].e, 1)} % a ${num(pasos.at(-1).e, 6)} %, y cerca de la raíz cada iteración duplica las cifras correctas. <a href="#/newton-raphson">Probá con otra función</a></figcaption>
    </figure>`;
}

function filaModulo(m) {
  const total = leccionesDe(m.id).length, h = hechasDe(m.id), a = aciertos(m.id);
  return `<li><a class="mod" href="#/${leccionesDe(m.id)[0].id}">
    <span class="mod-tag">${etiqueta(m)}</span>
    <span class="mod-tit">${m.title}</span>
    <span class="mod-blurb">${m.blurb[0].toUpperCase()}${m.blurb.slice(1)}.</span>
    <span class="mod-estado"><span class="mod-medidor" aria-hidden="true"><span style="width:${(h / total) * 100}%"></span></span><small>${h === total ? 'Completa' : h ? `${h} de ${total} lecciones` : `${total} lecciones`}${a != null ? `, ${a} % de aciertos` : ''}</small></span>
  </a></li>`;
}

export function vistaInicio(main) {
  document.title = 'Iterando Ando, guía de Matemática Superior';
  const sigue = siguienteLeccion();
  const nLabs = LECCIONES.reduce((n, l) => n + (l.labs?.length || 0), 0);
  const nTP = EJERCICIOS.filter(({ ex }) => ex.official).length, nPx = EJERCICIOS.filter(({ ex }) => ex.exam).length;
  const repasar = paraRepasar().length;
  const flojo = MODULOS.map((m) => ({ m, s: aciertos(m.id) })).filter((x) => x.s != null && x.s < 70).sort((a, b) => a.s - b.s)[0];
  const cuantas = (u) => Math.min(20, modulosDe(u.id).reduce((n, m) => n + PREGUNTAS.filter((q) => q.module === m.id).length, 0));
  const tps = (u) => [...new Set(modulosDe(u.id).map((m) => m.tp))];

  main.innerHTML = `
    <article class="inicio">
      <section class="hero">
        <div class="hero-texto">
          <p class="hero-materia">Matemática Superior 2026, UTN-FRT</p>
          <h1>Iteración por iteración</h1>
          <p class="lede">Los parciales son teórico-prácticos: hay que saber definir, deducir y calcular. Esta guía junta la teoría de la cátedra con gráficas que se mueven: ${LECCIONES.length} lecciones, ${nLabs} laboratorios, ${PREGUNTAS.length} preguntas de repaso y ${EJERCICIOS.length} ejercicios resueltos paso a paso, ${nTP} de los TP y ${nPx} de ${EXAMENES.length} parciales reales.</p>
          <div class="hero-acciones">
            <a class="btn primary" href="#/${sigue.id}">${hechas.size ? 'Seguir con' : 'Empezar con'} “${sigue.title}”</a>
            ${repasar ? `<a class="btn" href="#/repaso">Repasar ${repasar} ${repasar === 1 ? 'pregunta fallada' : 'preguntas falladas'}</a>` : '<a class="btn" href="#/parciales">Ver los parciales resueltos</a>'}
          </div>
          ${flojo ? `<p class="flojo">Tu punto más flojo por ahora es <a href="#/quiz/${flojo.m.id}">${flojo.m.title}</a>, con ${flojo.s} % de aciertos.</p>` : ''}
        </div>
        ${newton()}
      </section>

      <a class="reales" href="#/parciales">
        <span class="reales-n">${EXAMENES.length}</span>
        <span class="reales-t"><b>Parciales reales, resueltos</b>${EXAMENES.reduce((a, e) => a + e.items.length, 0)} ítems con su teoría y lo que más se repite.</span>
      </a>

      ${PARCIALES.map((u) => `
        <section class="parcial" data-u="${u.id}" aria-labelledby="t-${u.id}">
          <header class="parcial-cabeza">
            <h2 id="t-${u.id}">${u.title}<span>${u.name}</span></h2>
            <p>Trabajos prácticos ${tps(u).join(', ').replace(/, (\d+)$/, ' y $1')}.</p>
            <a class="btn sm" href="#/simulacro/${u.id}">Simulacro: ${cuantas(u)} preguntas</a>
          </header>
          <ul class="mods">${modulosDe(u.id).map(filaModulo).join('')}</ul>
        </section>`).join('')}

      <section class="practica" aria-labelledby="t-practica">
        <h2 id="t-practica">Para practicar</h2>
        <ul>
          ${[
            ['#/parciales', 'parciales', 'Parciales resueltos', 'Ítem por ítem, con lo que más se repite y qué temas pesan más.'],
            ['#/graficas', 'graficas', 'Taller de gráficas', 'El plano complejo, Laplace, las iteraciones, interpolación, regresión y Fourier.'],
            ['#/formulas', 'formulas', 'Fórmulas', 'Todo lo que hay que saber calcular, tema por tema.'],
            ['#/apuntes', 'apuntes', 'Resúmenes de Juana Vicente', 'La teoría de cada parcial en PDF, con el alcance que dio la cátedra.'],
            ['#/simulacro', 'simulacro', 'Simulacro', 'Veinte preguntas de un parcial, corregidas al final.'],
            ['#/repaso', 'repasar', 'Repasar', 'Las preguntas que fallaste, hasta que las aciertes.'],
          ].map(([h, i, t, d]) => `<li><a href="${h}">${icono(i, 22)}<span><b>${t}</b>${d}</span></a></li>`).join('')}
        </ul>
      </section>

      <section class="como" aria-labelledby="t-como">
        <h2 id="t-como">Cómo estudiar con esta guía</h2>
        <ol>
          <li>Leé la teoría de cada lección en orden: cada tema se apoya en el anterior.</li>
          <li>En cada laboratorio, anticipá qué va a pasar antes de mover el control o tocar “Siguiente iteración”. Así se entrena el parcial.</li>
          <li>Respondé las preguntas del final. Las que falles van a la sección <a href="#/repaso">Repasar</a>.</li>
          <li>Resolvé los ejercicios de los TP con lápiz, papel y calculadora antes de abrir la solución. Las tablas de iteraciones de las soluciones usan los mismos valores iniciales que la clase.</li>
          <li>Al cerrar un tema, hacé su cuestionario. Antes de cada parcial, resolvé los <a href="#/parciales">parciales reales</a>, después el simulacro y la hoja de <a href="#/formulas">fórmulas</a>.</li>
        </ol>
        <p class="atajos">Atajos de teclado: <kbd>←</kbd> y <kbd>→</kbd> para moverte entre lecciones, <kbd>/</kbd> para buscar.</p>
      </section>

      <section class="otras" aria-labelledby="t-otras">
        <div class="repo">
          <div><h2>El código está abierto</h2><p>Si encontrás un error o querés proponer una pregunta, abrí un issue en el repositorio.</p></div>
          <a class="btn" href="${REPO}" target="_blank" rel="noopener">Ver el repositorio en GitHub</a>
        </div>
        <h2 id="t-otras">Otras guías de la UTN</h2>
        ${OTRAS_GUIAS.map((g) => `<h3>${g.anio}</h3><ul class="guias">${g.guias.map(([n, d, slug]) => `<li><a href="https://franco704.github.io/${slug}/" target="_blank" rel="noopener"><b>${n}</b><span>${d}</span></a><a class="guia-repo" href="https://github.com/Franco704/${slug}" target="_blank" rel="noopener" aria-label="Repositorio de ${n}">Repositorio</a></li>`).join('')}</ul>`).join('')}
      </section>
    </article>`;
  return null;
}
