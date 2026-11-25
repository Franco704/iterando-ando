// Preguntas de repaso. Las opciones se barajan para que la posición no delate la respuesta.
import { $, shuffle } from '../nucleo/dom.js';
import { repintar } from '../nucleo/router.js';
import { preguntaPorId, modulo } from '../temario/indice.js';
import { registrar } from './progreso.js';

const LETRAS = 'ABCDEF';

// mode 'inline' / 'review': corrige cada pregunta al responder. 'exam': corrige todo al final. from: false oculta la lección de origen.
export function montarCuestionario(el, qs, { mode, onFinish, from } = {}) {
  const orden = Object.fromEntries(qs.map((q) => [q.id, shuffle(q.o.map((_, i) => i))]));
  el.innerHTML = `<ol class="quiz ${mode}">${qs.map((q, n) => `
    <li class="q" data-id="${q.id}">
      <fieldset>
        <legend><span class="q-n">${n + 1}.</span> ${q.q}${q.exam ? '<span class="q-src px">tomada en parcial</span>' : ''}${q.src ? `<span class="q-src">${q.src}</span>` : ''}${mode !== 'inline' && from !== false ? `<span class="q-from">${q.lesson.title}</span>` : ''}</legend>
        <div class="q-opts">${orden[q.id].map((i, k) => `
          <label class="opt"><input type="radio" name="q-${q.id}" value="${i}"><span class="opt-l" aria-hidden="true">${LETRAS[k]}</span><span class="opt-t">${q.o[i]}</span></label>`).join('')}
        </div>
        <div class="q-feedback" aria-live="polite"></div>
      </fieldset>
    </li>`).join('')}</ol>
    ${mode === 'exam' ? '<div class="exam-actions"><button class="btn primary" type="button" data-act="grade">Corregir</button><p class="exam-left"></p></div><div class="exam-result" aria-live="polite"></div>' : ''}`;

  const corregir = (li, q, elegida) => {
    const ok = elegida === q.a;
    li.classList.add(ok ? 'is-ok' : 'is-bad');
    li.querySelectorAll('.opt').forEach((lab) => {
      const input = $('input', lab), i = +input.value;
      if (i === q.a) lab.classList.add('right');
      else if (i === elegida) lab.classList.add('wrong');
      input.disabled = true;
    });
    const letra = LETRAS[orden[q.id].indexOf(q.a)];
    $('.q-feedback', li).innerHTML = `<p><strong>${ok ? 'Correcto.' : elegida < 0 ? `Sin responder: la respuesta es la ${letra}.` : `Incorrecto: la respuesta es la ${letra}.`}</strong> ${q.e || ''}</p>
      ${!ok ? `<p class="q-link"><a href="#/${q.lesson.id}">Releer “${q.lesson.title}”</a></p>` : ''}`;
    return ok;
  };

  if (mode !== 'exam') {
    el.querySelectorAll('.q').forEach((li) => {
      const q = preguntaPorId[li.dataset.id];
      li.addEventListener('change', (e) => registrar(q, corregir(li, q, +e.target.value)));
    });
    return;
  }

  const faltan = $('.exam-left', el);
  const total = qs.length;
  const contar = () => {
    const n = el.querySelectorAll('.q input:checked').length;
    faltan.textContent = n < total ? `Respondiste ${n} de ${total}.` : 'Respondiste todas.';
  };
  el.addEventListener('change', contar);
  contar();
  $('[data-act="grade"]', el).addEventListener('click', (e) => {
    let ok = 0;
    const porModulo = {};
    const sumar = (q, bien) => { ok += bien; const r = (porModulo[q.module] ||= { ok: 0, n: 0 }); r.n++; if (bien) r.ok++; };
    el.querySelectorAll('.q').forEach((li) => {
      const q = preguntaPorId[li.dataset.id];
      const elegida = $('input:checked', li);
      const bien = corregir(li, q, elegida ? +elegida.value : -1);
      registrar(q, bien);
      sumar(q, bien);
    });
    const pct = Math.round((ok / total) * 100);
    e.currentTarget.remove();
    faltan.remove();
    const C = 2 * Math.PI * 52;
    const filas = Object.entries(porModulo).map(([m, r]) => `<li><span>${modulo(m).title}</span><span>${r.ok} de ${r.n}</span></li>`).join('');
    $('.exam-result', el).innerHTML = `
      <div class="score ${pct >= 60 ? 'pass' : 'fail'}">
        <svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${pct}% de respuestas correctas"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" style="--c:${C};stroke-dasharray:${C};stroke-dashoffset:${C * (1 - pct / 100)}"/><text x="60" y="69">${pct}%</text></svg>
        <p>${ok} de ${total} correctas. ${pct >= 80 ? 'Muy bien: este tema está firme.' : pct >= 60 ? 'Aprobado, pero repasá las que fallaste.' : 'Todavía no: volvé a las lecciones marcadas y repetí.'}</p>
        ${Object.keys(porModulo).length > 1 ? `<ul class="score-mods">${filas}</ul>` : ''}
        <p><button class="btn" type="button" data-act="again">Hacer otro intento</button></p>
      </div>`;
    $('[data-act="again"]', el).addEventListener('click', repintar);
    onFinish?.(pct);
    $('.exam-result', el).scrollIntoView({ block: 'center' });
  });
}
