/* Motor de la guía: índice, rutas por hash, progreso, cuestionarios, repaso, simulacros por parcial, parciales reales resueltos, taller de gráficas, fórmulas y laboratorios. */
(() => {
  const { UNITS, LESSONS, LABS, EXAMS } = window.GUIDE;
  // Solo los módulos que ya tienen lecciones cargadas
  const MODULES = window.GUIDE.MODULES.filter((m) => LESSONS.some((l) => l.module === m.id));
  const $ = (s, el = document) => el.querySelector(s);
  // Guías hermanas: página publicada y repositorio de cada una
  const SIBLINGS = [
    ['Backeando Ando', 'Desarrollo de software backend (C#, ASP.NET, EF Core)', 'backeando-ando'],
    ['Fronteando Ando', 'Desarrollo frontend (HTML, CSS, JavaScript, React)', 'fronteando-ando'],
    ['Diseñando Ando', 'Diseño de Sistemas de Información (UML, GRASP, GoF)', 'disenando-ando'],
    ['Economizar', 'Economía (micro y macro con gráficas)', 'economizar'],
    ['Modulando Ando', 'Comunicación de Datos (señales, Shannon, errores, modulación)', 'modulando-ando'],
    ['Probando Ando', 'Probabilidad y Estadística (Bayes, distribuciones, intervalos, tests)', 'probando-ando'],
  ];
  const main = $('#main');
  const toc = $('#toc');
  const rail = $('#rail');
  const sidebar = $('#sidebar');
  const scrim = $('#scrim');
  const menuBtn = $('#menuBtn');

  // ---------- Almacenamiento (puede fallar en modo privado) ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  let done = new Set(store.get('ms-done', []));
  // Resultado por pregunta: { [qid]: { ok, tries } }. qid = leccion:indice
  let answers = store.get('ms-answers', {});
  let best = store.get('ms-best', {});
  const saveAnswers = () => store.set('ms-answers', answers);

  // Todas las preguntas con su id, módulo y lección
  const QUESTIONS = LESSONS.flatMap((l) => (l.quiz || []).map((q, i) => ({ ...q, id: `${l.id}:${i}`, lesson: l, module: l.module })));
  const qById = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
  // Parciales reales: cada ejercicio con exam: ['1p-2024-1#2a'] queda enlazado al ítem 2a de ese parcial
  const examById = Object.fromEntries(EXAMS.map((e) => [e.id, e]));
  const EXS = LESSONS.flatMap((l) => (l.exercises || []).map((ex) => ({ ex, l })));
  const examChips = (list) => list.map((k) => examById[k.split('#')[0]]).filter(Boolean)
    .filter((e, i, a) => a.indexOf(e) === i).map((e) => `<a class="chip acc" href="#/parciales">${e.short}</a>`).join('');

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- Índice ----------
  const lessonsOf = (modId) => LESSONS.filter((l) => l.module === modId);
  const modOf = (id) => MODULES.find((m) => m.id === id);
  const modDone = (m) => lessonsOf(m.id).filter((l) => done.has(l.id)).length;

  function renderToc(filter = '') {
    const q = norm(filter.trim());
    let html = '';
    let n = 0;
    for (const u of UNITS) {
      let unitHtml = '';
      for (const mod of MODULES.filter((m) => m.unit === u.id)) {
        const items = LESSONS.map((l, i) => ({ l, i })).filter(({ l }) => l.module === mod.id);
        const visible = items.filter(({ l }) => !q || norm(`${l.title} ${l.keywords || ''} ${mod.title}`).includes(q));
        n += visible.length;
        if (!visible.length) continue;
        const open = q || visible.some(({ l }) => l.id === currentId()) || currentId() === `quiz/${mod.id}`;
        unitHtml += `<details class="toc-module" ${open ? 'open' : ''}>
          <summary><span><small class="toc-tema">Unidad ${mod.tema} · TP ${mod.tp}</small> ${mod.title}</span><span class="toc-count">${modDone(mod)}/${items.length}</span></summary>
          <ol>${visible.map(({ l, i }) => `<li><a class="toc-link${done.has(l.id) ? ' is-done' : ''}" href="#/${l.id}" data-id="${l.id}">
            <span class="n">${i + 1}</span><span class="t">${l.title}</span><span class="check" aria-hidden="true"></span>${done.has(l.id) ? '<span class="sr-only"> (completada)</span>' : ''}</a></li>`).join('')}
            ${q ? '' : `<li><a class="toc-link toc-quiz" href="#/quiz/${mod.id}" data-id="quiz/${mod.id}"><span class="n" aria-hidden="true">?</span><span class="t">Cuestionario del módulo</span>${best[mod.id] != null ? `<span class="toc-score">${best[mod.id]}%</span>` : ''}</a></li>`}
          </ol></details>`;
      }
      if (unitHtml) html += `<section class="toc-unit" data-u="${u.id}"><h2>${u.title}<span>${u.name}</span></h2>${unitHtml}</section>`;
    }
    toc.innerHTML = n ? html : `<p class="toc-empty">No hay temas con “${esc(filter)}”. Probá con otra palabra.</p>`;
    markCurrent();
  }
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function markCurrent() {
    const id = currentId();
    toc.querySelectorAll('.toc-link').forEach((a) => {
      if (a.dataset.id === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function updateProgress() {
    const total = LESSONS.length;
    const count = LESSONS.filter((l) => done.has(l.id)).length;
    $('#progressFill').style.width = `${(count / total) * 100}%`;
    $('#progressText').textContent = `${count} de ${total}`;
    const pending = reviewIds().length;
    const badge = $('#reviewCount');
    badge.hidden = !pending;
    badge.textContent = pending;
  }
  const reviewIds = () => Object.keys(answers).filter((id) => qById[id] && !answers[id].ok);

  // ---------- Rutas ----------
  const currentId = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''));

  let firstLoad = true;
  async function route() {
    const id = currentId();
    const idx = LESSONS.findIndex((l) => l.id === id);
    // Pantalla de entrada al cambiar de módulo; si mientras tanto cambió el hash, gana la ruta nueva
    if (idx !== -1) { await ANIM.intro(id, firstLoad); if (currentId() !== id) return; }
    firstLoad = false;
    rail.innerHTML = '';
    document.body.dataset.view = 'page';
    delete document.body.dataset.unit;
    if (idx !== -1) renderLesson(idx);
    else if (id.startsWith('quiz/') && modOf(id.slice(5))) renderModuleQuiz(modOf(id.slice(5)));
    else if (id === 'repaso') renderReview();
    else if (id.startsWith('simulacro')) renderExam(UNITS.find((u) => u.id === id.slice(10)));
    else if (id === 'graficas') renderGraphs();
    else if (id === 'formulas') renderFormulas();
    else if (id === 'parciales') renderParciales();
    else renderHome();
    renderToc($('#search').value);   // abre el módulo de la página actual
    closeMenu();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // ---------- Portada: el curso como un recorrido del plano complejo a Fourier ----------
  function moduleScore(modId) {
    const qs = QUESTIONS.filter((q) => q.module === modId && answers[q.id]);
    if (qs.length < 3) return null;
    return Math.round((qs.filter((q) => answers[q.id].ok).length / qs.length) * 100);
  }

  function renderHome() {
    document.title = 'Iterando Ando';
    document.body.dataset.view = 'home';
    const resume = LESSONS.find((l) => !done.has(l.id)) || LESSONS[0];
    const curMod = resume.module;
    const curIdx = MODULES.findIndex((m) => m.id === curMod);
    const nEx = LESSONS.reduce((a, l) => a + (l.exercises?.length || 0), 0);
    const nOfficial = LESSONS.reduce((a, l) => a + (l.exercises || []).filter((e) => e.official).length, 0);
    const nLabs = LESSONS.reduce((a, l) => a + (l.labs?.length || 0), 0);
    const nPx = EXS.filter(({ ex }) => ex.exam).length;

    const stops = MODULES.map((m, i) => {
      const total = lessonsOf(m.id).length;
      const d = modDone(m);
      const state = d === total ? 'done' : i === curIdx ? 'current' : i < curIdx ? 'partial' : '';
      return `<li class="stop ${state}" style="--p:${total ? d / total : 0}">
        <a href="#/${lessonsOf(m.id)[0].id}"><span class="stop-dot" aria-hidden="true"></span><span class="stop-name">${m.stop}</span><span class="sr-only">: ${m.title}, ${d} de ${total} lecciones</span></a></li>`;
    }).join('');

    // Punto débil: módulo con peor resultado en preguntas respondidas
    const scored = MODULES.map((m) => ({ m, s: moduleScore(m.id) })).filter((x) => x.s != null).sort((a, b) => a.s - b.s);
    const weak = scored[0] && scored[0].s < 70 ? scored[0] : null;

    const units = UNITS.map((u) => `
      <section class="home-unit" data-u="${u.id}">
        <h2><span class="unit-tag">${u.title}</span>${u.name}</h2>
        <ul class="mod-list">${MODULES.filter((m) => m.unit === u.id).map((m) => {
          const total = lessonsOf(m.id).length; const d = modDone(m); const s = moduleScore(m.id);
          return `<li><a href="#/${lessonsOf(m.id)[0].id}">
            <span class="mod-title"><span class="mod-n">Unidad ${m.tema} · TP ${m.tp}</span>${m.title}</span>
            <span class="mod-blurb">${total} lecciones: ${m.blurb}</span>
            <span class="mod-meter" aria-hidden="true"><span style="width:${(d / total) * 100}%"></span></span>
            <span class="mod-meta">${d === total ? 'Completo' : d ? `${d} de ${total} hechas` : 'Sin empezar'}${s != null ? `, ${s}% de aciertos` : ''}</span>
          </a></li>`;
        }).join('')}</ul>
      </section>`).join('');

    const h = window.GUIDE.h;
    // Newton Raphson sobre f(x) = x²/4 − 2 desde x₀ = 5,6: tangente tras tangente hasta la raíz √8
    const hf = (x) => (x * x) / 4 - 2, steps = window.GUIDE.num.newton(hf, (x) => x / 2, 5.6, { n: 3 });
    const heroPlot = h.plot({ x: [0, 6.2], y: [-2.5, 6.5], w: 360, h: 260, alt: 'Newton Raphson: tangentes sucesivas hasta la raíz',
      curves: [{ f: hf, cls: 'c-f', label: 'f(x)' }],
      segs: steps.flatMap((r) => [{ from: [r.x, r.fx], to: [r.xn, 0], cls: 'c-root' }, { from: [r.xn, 0], to: [r.xn, hf(r.xn)], cls: 'c-tan pl-faint' }]),
      points: [...steps.map((r, i) => ({ x: r.x, y: r.fx, cls: 'c-g', r: 4, label: `x${'₀₁₂'[i]}`, pos: 'nw' })), { x: Math.sqrt(8), y: 0, cls: 'c-root', label: 'raíz', pos: 's' }] });
    const nP = (u) => QUESTIONS.filter((q) => modOf(q.module).unit === u).length;
    main.innerHTML = `
      <article class="home">
        <header class="hero">
          <div class="hero-grid">
            <div>
              <p class="hero-kicker">Matemática Superior 2026 · UTN-FRT · Ingeniería en Sistemas, 3er nivel</p>
              <h1>Matemática Superior, <em>iteración por iteración</em>.</h1>
              <p class="lede">Los parciales son teórico-prácticos: hay que saber definir, deducir y calcular. Esta guía junta la teoría de la cátedra con gráficas que se mueven: ${LESSONS.length} lecciones, ${nLabs} laboratorios interactivos, ${QUESTIONS.length} preguntas de repaso y ${nEx} ejercicios resueltos paso a paso: ${nOfficial} de los trabajos prácticos y ${nPx} de <a href="#/parciales">${EXAMS.length} parciales reales</a> de la cátedra.</p>
            </div>
            <div class="hero-plot" aria-hidden="true">${heroPlot}</div>
          </div>
          <ol class="route" aria-label="Recorrido del curso">
            <li class="end" aria-hidden="true"><span class="verb">i² = −1</span></li>
            ${stops}
            <li class="end ok" aria-hidden="true"><span class="verb">Σ</span></li>
          </ol>
          <div class="hero-actions">
            <a class="btn primary" href="#/${resume.id}">${done.size ? 'Seguir con' : 'Empezar con'} “${resume.title}”</a>
            <a class="btn" href="#/parciales">Parciales resueltos</a>
            <a class="btn" href="#/graficas">Taller de gráficas</a>
            <a class="btn" href="#/formulas">Fórmulas</a>
            <button class="btn" type="button" data-act="also">También probá…</button>
            ${reviewIds().length ? `<a class="btn" href="#/repaso">Repasar ${reviewIds().length} preguntas falladas</a>` : ''}
          </div>
          ${weak ? `<p class="weak">Tu punto más flojo por ahora es <a href="#/quiz/${weak.m.id}">${weak.m.title}</a>, con ${weak.s}% de aciertos. Conviene repasarlo antes de seguir.</p>` : ''}
        </header>
        <div class="exam-cards">
          ${UNITS.map((u) => `<a class="exam-card" data-u="${u.id}" href="#/simulacro/${u.id}"><span class="ec-k">${u.title}</span><span class="ec-t">Simulacro de ${u.name}</span><span class="ec-m">${Math.min(20, nP(u.id))} preguntas de ${nP(u.id)}, corregido al final</span></a>`).join('')}
          <a class="exam-card" data-u="px" href="#/parciales"><span class="ec-k">Parciales reales</span><span class="ec-t">Lo que toma la cátedra</span><span class="ec-m">${EXAMS.length} parciales, ${nPx} ejercicios resueltos y lo que más se repite</span></a>
        </div>
        ${units}
        <section class="home-links">
          <h2 class="also-h" id="tambien">También probá:</h2>
          <ul class="also">${SIBLINGS.map(([n, d, slug]) => `<li><a class="also-main" href="https://franco704.github.io/${slug}/" target="_blank" rel="noopener"><b>${n}</b><span>${d}</span></a><a class="also-repo" href="https://github.com/Franco704/${slug}" target="_blank" rel="noopener" aria-label="Repositorio de ${n}">repositorio</a></li>`).join('')}</ul>
        </section>
        <section class="home-how">
          <h2>Cómo estudiar con esta guía</h2>
          <ol>
            <li>Leé la teoría de cada lección en orden: cada tema se apoya en el anterior.</li>
            <li>En cada laboratorio, anticipá qué va a pasar antes de mover el control o tocar “Siguiente iteración”. Así se entrena el parcial.</li>
            <li>Respondé las preguntas del final. Las que falles van a la sección <a href="#/repaso">Repasar</a>.</li>
            <li>Resolvé los ejercicios de los TP con lápiz, papel y calculadora antes de abrir la solución. Las tablas de iteraciones de las soluciones usan los mismos valores iniciales que la clase.</li>
            <li>Al cerrar un tema, hacé su cuestionario. Antes de cada parcial, resolvé los <a href="#/parciales">parciales reales</a>, después el simulacro y la hoja de <a href="#/formulas">fórmulas</a>.</li>
          </ol>
          <p class="kbd-line">Atajos: <kbd>←</kbd> <kbd>→</kbd> para moverte entre lecciones, <kbd>/</kbd> para buscar.</p>
        </section>
      </article>`;
    // El paquete recorre la ruta una sola vez y se detiene en el módulo actual
    const route = $('.route', main);
    route.style.setProperty('--cols', MODULES.length + 2);
    route.style.setProperty('--stop', curIdx + 1);
    $('[data-act="also"]', main).addEventListener('click', () => $('#tambien').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
    requestAnimationFrame(() => route.classList.add('go'));
  }

  // ---------- Lección ----------
  function renderSources(l) {
    return (l.sources || []).map((s) => `
      <details class="source">
        <summary><span>${s.title}</span><span class="host">${s.url ? new URL(s.url).hostname.replace('www.', '') : s.ref || ''}</span></summary>
        <div class="source-body">
          <ul>${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>
          ${s.url ? `<p><a href="${s.url}" target="_blank" rel="noopener">Abrir la fuente</a></p>` : ''}
        </div>
      </details>`).join('');
  }

  const LEVEL = { 1: 'Básico', 2: 'Intermedio', 3: 'Desafío' };
  function renderExercises(l) {
    let practice = 0;
    return (l.exercises || []).map((ex) => {
      const s = ex.solution;
      const files = (s.files || []).map((f) => `
        <div class="sol-file">
          ${f.name ? `<p class="file-name">${f.name}</p>` : ''}
          <pre class="code" data-lang="${f.lang}">${esc(f.code.trim())}</pre>
        </div>`).join('');
      const tag = ex.tag || (ex.official ? `TP ${ex.official.split('.')[0]}, ejercicio ${ex.official.split('.')[1]}` : ex.exam ? 'Ejercicio de parcial' : `Práctica ${++practice}`);
      const px = !ex.official && ex.exam;
      return `
        <article class="exercise${ex.official ? ' official' : px ? ' parcial' : ''}">
          <header class="ex-head">
            <span class="ex-tag${px ? ' px' : ''}">${tag}</span>
            ${ex.level ? `<span class="ex-level" data-level="${ex.level}">${LEVEL[ex.level]}</span>` : ''}
          </header>
          ${ex.exam ? `<p class="ex-exams">${ex.official ? '<span class="chip">También tomado en</span>' : '<span class="chip">Tomado en</span>'}${examChips(ex.exam)}</p>` : ''}
          <h3>${ex.title}</h3>
          <div class="ex-prompt">${ex.prompt}</div>
          ${ex.hints ? `<details class="hint"><summary>Ver pistas</summary><ul>${ex.hints.map((h) => `<li>${h}</li>`).join('')}</ul></details>` : ''}
          <details class="solution">
            <summary>Ver solución</summary>
            <div class="sol-body">
              ${s.explain ? `<div class="sol-explain">${s.explain}</div>` : ''}
              ${files}
            </div>
          </details>
        </article>`;
    }).join('');
  }

  function renderLesson(idx) {
    const l = LESSONS[idx];
    const mod = modOf(l.module);
    const prev = LESSONS[idx - 1];
    const next = LESSONS[idx + 1];
    const labs = l.labs || [];
    document.body.dataset.unit = mod.unit;
    document.title = `${l.title}, Iterando Ando`;

    // Laboratorios no ubicados en el cuerpo se agregan al final de la teoría
    const where = l.body + (l.exercises || []).map((e) => e.prompt).join('');
    const placed = new Set([...where.matchAll(/data-lab="(\d+)"/g)].map((m) => +m[1]));
    const rest = labs.map((_, i) => i).filter((i) => !placed.has(i)).map((i) => `<div class="lab-mount" data-lab="${i}"></div>`).join('');
    const exercises = renderExercises(l);
    const sources = renderSources(l);
    const quiz = QUESTIONS.filter((q) => q.lesson === l);

    main.innerHTML = `
      <article class="lesson">
        <div class="lesson-glyph" aria-hidden="true">${ANIM.glyph(mod.id)}</div>
        <p class="crumb"><span class="unit-tag sm">${UNITS.find((u) => u.id === mod.unit).title}</span> <a href="#/${lessonsOf(mod.id)[0].id}">Unidad ${mod.tema}: ${mod.title}</a>, lección ${idx + 1} de ${LESSONS.length}</p>
        <h1>${l.title}</h1>
        <p class="tldr">${l.tldr}</p>
        ${l.goals ? `<div class="goals"><p>Al terminar vas a poder:</p><ul>${l.goals.map((g) => `<li>${g}</li>`).join('')}</ul></div>` : ''}
        <div class="body">${l.body}${rest}</div>
        ${quiz.length ? `<section class="check-sec" id="comprobar"><h2>Comprobá lo que entendiste</h2><p class="sec-lede">Elegí una respuesta: la corrección es inmediata. Lo que falles queda guardado para repasar.</p><div class="quiz-mount"></div></section>` : ''}
        ${exercises ? `<section class="practice" id="ejercicios"><h2>Ejercicios</h2><p class="sec-lede">Resolvelos en papel, con calculadora, antes de abrir la solución. Equivocarse acá es gratis.</p>${exercises}</section>` : ''}
        ${sources ? `<section class="sources" id="bibliografia"><h2>Bibliografía</h2><p class="sec-lede">Qué dice cada fuente sobre este tema.</p>${sources}</section>` : ''}
        <div class="done-row">
          <button class="btn done-btn" id="doneBtn" type="button" aria-pressed="${done.has(l.id)}">${done.has(l.id) ? 'Lección completada' : 'Marcar como completada'}</button>
        </div>
        <nav class="pager" aria-label="Lecciones">
          ${prev ? `<a class="prev" href="#/${prev.id}"><small>Anterior</small><strong>${prev.title}</strong></a>` : '<span></span>'}
          ${next ? `<a class="next" href="#/${next.id}"><small>Siguiente</small><strong>${next.title}</strong></a>` : `<a class="next" href="#/quiz/${mod.id}"><small>Para cerrar</small><strong>Cuestionario del módulo</strong></a>`}
        </nav>
      </article>`;

    main.querySelectorAll('.lab-mount').forEach((el) => {
      const cfg = labs[+el.dataset.lab];
      if (cfg) mountLab(el, cfg);
    });
    if (quiz.length) renderQuiz($('.quiz-mount', main), quiz, { mode: 'inline' });

    $('#doneBtn').addEventListener('click', (e) => {
      done.has(l.id) ? done.delete(l.id) : done.add(l.id);
      store.set('ms-done', [...done]);
      const on = done.has(l.id);
      e.currentTarget.setAttribute('aria-pressed', on);
      e.currentTarget.textContent = on ? 'Lección completada' : 'Marcar como completada';
      renderToc($('#search').value);
      updateProgress();
    });
    renderRail();
  }

  // Índice de la página a la derecha (pantallas anchas)
  function renderRail() {
    const hs = [...main.querySelectorAll('.lesson > .body > h2, .lesson > section > h2')];
    if (hs.length < 3) return;
    hs.forEach((h, i) => { if (!h.id) h.id = `s-${i}-${norm(h.textContent).replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`; });
    rail.innerHTML = `<p>En esta lección</p><ol>${hs.map((h) => `<li><a href="#${h.id}" data-target="${h.id}">${h.textContent}</a></li>`).join('')}</ol>`;
    rail.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.target).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }));
    const links = new Map([...rail.querySelectorAll('a')].map((a) => [a.dataset.target, a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.removeAttribute('aria-current'));
          links.get(en.target.id)?.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    hs.forEach((h) => io.observe(h));
  }

  // ---------- Cuestionarios ----------
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // mode 'inline': corrige cada pregunta al responder. 'exam': corrige todo al final.
  function renderQuiz(el, qs, { mode, onFinish } = {}) {
    const letters = 'ABCDEF';
    // Las opciones se muestran en orden aleatorio para que la posición no delate la respuesta
    const order = Object.fromEntries(qs.map((q) => [q.id, shuffle(q.o.map((_, i) => i))]));
    el.innerHTML = `<ol class="quiz ${mode}">${qs.map((q, n) => `
      <li class="q" data-id="${q.id}">
        <fieldset>
          <legend><span class="q-n">${n + 1}.</span> ${q.q}${q.exam ? '<span class="q-src px">tomada en parcial</span>' : ''}${mode === 'exam' || mode === 'review' ? `<span class="q-from">${q.lesson.title}</span>` : ''}</legend>
          <div class="q-opts">${order[q.id].map((i, k) => `
            <label class="opt"><input type="radio" name="q-${q.id}" value="${i}"><span class="opt-l" aria-hidden="true">${letters[k]}</span><span class="opt-t">${q.o[i]}</span></label>`).join('')}
          </div>
          <div class="q-feedback" aria-live="polite"></div>
        </fieldset>
      </li>`).join('')}</ol>
      ${mode === 'exam' ? '<div class="exam-actions"><button class="btn primary" type="button" data-act="grade">Corregir</button><p class="exam-left"></p></div><div class="exam-result" aria-live="polite"></div>' : ''}`;

    const record = (q, ok) => {
      const prev = answers[q.id] || { tries: 0 };
      answers[q.id] = { ok, tries: prev.tries + 1 };
      saveAnswers();
      updateProgress();
    };
    const showFeedback = (li, q, chosen) => {
      const ok = chosen === q.a;
      li.classList.add(ok ? 'is-ok' : 'is-bad');
      li.querySelectorAll('.opt').forEach((lab) => {
        const input = lab.querySelector('input');
        const i = +input.value;
        if (i === q.a) lab.classList.add('right');
        else if (i === chosen) lab.classList.add('wrong');
        input.disabled = true;
      });
      const correctLetter = letters[order[q.id].indexOf(q.a)];
      li.querySelector('.q-feedback').innerHTML = `<p><strong>${ok ? 'Correcto.' : chosen < 0 ? `Sin responder: la respuesta es la ${correctLetter}.` : `Incorrecto: la respuesta es la ${correctLetter}.`}</strong> ${q.e || ''}</p>
        ${!ok ? `<p class="q-link"><a href="#/${q.lesson.id}">Releer “${q.lesson.title}”</a></p>` : ''}`;
      return ok;
    };

    if (mode !== 'exam') {
      el.querySelectorAll('.q').forEach((li) => {
        const q = qById[li.dataset.id];
        li.addEventListener('change', (e) => {
          const ok = showFeedback(li, q, +e.target.value);
          record(q, ok);
        });
      });
      return;
    }

    const left = $('.exam-left', el);
    const updateLeft = () => {
      const n = el.querySelectorAll('.q input:checked').length;
      left.textContent = n < qs.length ? `Respondiste ${n} de ${qs.length}.` : 'Respondiste todas.';
    };
    el.addEventListener('change', updateLeft);
    updateLeft();
    $('[data-act="grade"]', el).addEventListener('click', (e) => {
      let ok = 0;
      const byMod = {};
      el.querySelectorAll('.q').forEach((li) => {
        const q = qById[li.dataset.id];
        const chosen = li.querySelector('input:checked');
        const good = chosen ? showFeedback(li, q, +chosen.value) : (showFeedback(li, q, -1), false);
        record(q, good);
        ok += good;
        (byMod[q.module] ||= { ok: 0, n: 0 }).n++;
        if (good) byMod[q.module].ok++;
      });
      const pct = Math.round((ok / qs.length) * 100);
      e.currentTarget.remove();
      left.remove();
      const C = 2 * Math.PI * 52;   // circunferencia del anillo
      const rows = Object.entries(byMod).map(([m, r]) => `<li><span>${modOf(m).title}</span><span>${r.ok} de ${r.n}</span></li>`).join('');
      $('.exam-result', el).innerHTML = `
        <div class="score ${pct >= 60 ? 'pass' : 'fail'}">
          <svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${pct}% de respuestas correctas"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" style="--c:${C};stroke-dasharray:${C};stroke-dashoffset:${C * (1 - pct / 100)}"/><text x="60" y="69">${pct}%</text></svg>
          <p>${ok} de ${qs.length} correctas. ${pct >= 80 ? 'Muy bien: este tema está firme.' : pct >= 60 ? 'Aprobado, pero repasá las que fallaste.' : 'Todavía no: volvé a las lecciones marcadas y repetí.'}</p>
          ${Object.keys(byMod).length > 1 ? `<ul class="score-mods">${rows}</ul>` : ''}
          <p><a class="btn" href="#/${currentId()}" data-act="again">Hacer otro intento</a></p>
        </div>`;
      $('[data-act="again"]', el).addEventListener('click', (ev) => { ev.preventDefault(); route(); });
      onFinish?.(pct);
      $('.exam-result', el).scrollIntoView({ block: 'center' });
    });
  }


  function renderModuleQuiz(mod) {
    document.title = `Cuestionario: ${mod.title}`;
    document.body.dataset.unit = mod.unit;
    const pool = QUESTIONS.filter((q) => q.module === mod.id);
    // Prioriza las que fallaste o nunca respondiste
    const weight = (q) => (answers[q.id]?.ok === false ? 0 : answers[q.id] ? 2 : 1);
    const qs = shuffle(pool).sort((a, b) => weight(a) - weight(b)).slice(0, 15);
    main.innerHTML = `
      <article class="lesson quiz-page">
        <p class="crumb"><a href="#/${lessonsOf(mod.id)[0].id}">${mod.title}</a>, cuestionario</p>
        <h1>Cuestionario: ${mod.title}</h1>
        <p class="tldr">${qs.length} preguntas de las ${pool.length} del módulo. Aparecen primero las que fallaste y las que nunca respondiste. ${best[mod.id] != null ? `Tu mejor resultado: ${best[mod.id]}%.` : ''}</p>
        <div class="quiz-mount"></div>
      </article>`;
    renderQuiz($('.quiz-mount', main), qs, {
      mode: 'exam',
      onFinish: (pct) => { best[mod.id] = Math.max(best[mod.id] ?? 0, pct); store.set('ms-best', best); renderToc($('#search').value); },
    });
  }

  function renderReview() {
    document.title = 'Repasar, Iterando Ando';
    const ids = reviewIds();
    const qs = ids.map((id) => qById[id]);
    main.innerHTML = `
      <article class="lesson quiz-page">
        <p class="crumb">Práctica personalizada</p>
        <h1>Repasar</h1>
        ${qs.length ? `<p class="tldr">Estas son las ${qs.length} preguntas que respondiste mal la última vez. Cuando aciertes una, sale de la lista.</p><div class="quiz-mount"></div>`
          : `<p class="tldr">No tenés preguntas pendientes. Cada vez que falles una, en una lección o en un cuestionario, aparece acá para que la vuelvas a intentar.</p>
             <p><a class="btn primary" href="#/simulacro/p1">Simulacro del 1er parcial</a> <a class="btn" href="#/simulacro/p2">Simulacro del 2do parcial</a></p>`}
      </article>`;
    if (qs.length) renderQuiz($('.quiz-mount', main), qs, { mode: 'review' });
  }

  function renderExam(unit) {
    if (!unit) { location.replace(`#/simulacro/${MODULES.find((m) => m.id === (LESSONS.find((l) => !done.has(l.id)) || LESSONS[0]).module).unit}`); return; }
    document.title = `Simulacro ${unit.title.toLowerCase()}, Iterando Ando`;
    document.body.dataset.unit = unit.id;
    const mods = MODULES.filter((m) => m.unit === unit.id);
    // Reparte las preguntas entre los temas del parcial para que ninguno domine
    const byMod = mods.map((m) => shuffle(QUESTIONS.filter((q) => q.module === m.id))).filter((a) => a.length);
    const qs = [];
    for (let i = 0; qs.length < 20 && byMod.some((a) => a[i]); i++) byMod.forEach((a) => a[i] && qs.length < 20 && qs.push(a[i]));
    const other = UNITS.find((u) => u !== unit);
    main.innerHTML = `
      <article class="lesson quiz-page">
        <p class="crumb">Práctica personalizada · <a href="#/simulacro/${other.id}">ir al simulacro del ${other.title.toLowerCase()}</a></p>
        <h1>Simulacro del ${unit.title.toLowerCase()}</h1>
        <p class="tldr">${qs.length} preguntas mezcladas de ${unit.name} (TP ${[...new Set(mods.map((m) => m.tp))].join(', ')}). Respondé todas y corregí al final. Esto entrena la parte <mark>teórica</mark>; la práctica se entrena con los ejercicios de los TP de cada lección y en el <a href="#/graficas">taller de gráficas</a>.</p>
        <div class="quiz-mount"></div>
      </article>`;
    renderQuiz($('.quiz-mount', main), shuffle(qs), { mode: 'exam' });
  }

  // ---------- Taller de gráficas: todos los laboratorios de gráficas juntos, por parcial ----------
  const GRAPH_LABS = ['complex', 'laplace', 'response', 'ode', 'roots', 'race', 'interp', 'regression', 'fourier'];
  function renderGraphs() {
    document.title = 'Taller de gráficas, Iterando Ando';
    const all = LESSONS.flatMap((l) => (l.labs || []).filter((c) => GRAPH_LABS.includes(c.type)).map((c) => ({ c, l, m: modOf(l.module) })));
    main.innerHTML = `
      <article class="lesson graphs-page">
        <p class="crumb">Para el parcial</p>
        <h1>Taller de gráficas</h1>
        <p class="tldr">Las ${all.length} gráficas interactivas de la guía en un solo lugar. Para cada una: <mark>predecí</mark> el resultado (hacia dónde va la iteración, cuánto da el área, si converge), después mové el control y comprobá. Al lado de cada una está la lección donde se explica.</p>
        ${UNITS.map((u) => `<section class="graph-unit" data-u="${u.id}"><h2><span class="unit-tag">${u.title}</span>${u.name}</h2>
          ${all.filter((x) => x.m.unit === u.id).map((x, i) => `<div class="graph-item"><p class="graph-from">Unidad ${x.m.tema} · <a href="#/${x.l.id}">${x.l.title}</a></p><div class="lab-mount" data-g="${all.indexOf(x)}"></div></div>`).join('')}
        </section>`).join('')}
      </article>`;
    main.querySelectorAll('[data-g]').forEach((el) => mountLab(el, all[+el.dataset.g].c));
  }

  // ---------- Fórmulas: hoja de repaso armada desde GUIDE.FORMULAS ----------
  function renderFormulas() {
    document.title = 'Fórmulas, Iterando Ando';
    const F = window.GUIDE.FORMULAS || [];
    main.innerHTML = `
      <article class="lesson formulas-page">
        <p class="crumb">Para el parcial</p>
        <h1>Fórmulas</h1>
        <p class="tldr">Todo lo que hay que saber calcular, tema por tema. Tocá el nombre del tema para ir a la lección donde se explica cada fórmula.</p>
        ${UNITS.map((u) => `<section data-u="${u.id}"><h2><span class="unit-tag">${u.title}</span>${u.name}</h2>
          ${MODULES.filter((m) => m.unit === u.id && F.some((f) => f.m === m.id)).map((m) => `<h3><a href="#/${lessonsOf(m.id)[0].id}">Unidad ${m.tema}: ${m.title}</a></h3>
            <div class="cards">${F.filter((f) => f.m === m.id).map((f) => `<div class="card"><b>${f.n}</b><div class="f">${f.f}</div>${f.d ? `<p class="muted-s">${f.d}</p>` : ''}</div>`).join('')}</div>`).join('')}
        </section>`).join('')}
      </article>`;
  }

  // ---------- Parciales reales: cada ítem con su resolución y lo que más se repite ----------
  function renderParciales() {
    document.title = 'Parciales resueltos, Iterando Ando';
    const withExam = EXS.filter(({ ex }) => ex.exam);
    const n = withExam.reduce((a, { ex }) => a + ex.exam.length, 0);
    // Ranking: ejercicios que aparecen en más de un parcial
    const nExams = (ex) => new Set(ex.exam.map((k) => k.split('#')[0])).size;
    const top = withExam.filter(({ ex }) => nExams(ex) > 1).sort((a, b) => nExams(b.ex) - nExams(a.ex));
    const byMod = MODULES.map((m) => ({ m, k: withExam.filter(({ l }) => l.module === m.id).reduce((a, { ex }) => a + ex.exam.length, 0) })).filter((x) => x.k).sort((a, b) => b.k - a.k);
    const item = (e, [num, text]) => {
      const hit = withExam.find(({ ex }) => ex.exam.includes(`${e.id}#${num}`));
      return `<details class="exam-q"><summary>${num}. ${text}${hit ? ` <small>· Unidad ${modOf(hit.l.module).tema}</small>` : ''}</summary>
        ${hit ? `${renderExercises({ exercises: [hit.ex] })}<p class="q-link"><a href="#/${hit.l.id}">Ver la teoría: “${hit.l.title}”</a></p>` : '<p class="muted-s">Sin resolución cargada.</p>'}</details>`;
    };
    main.innerHTML = `
      <article class="lesson exams-page">
        <p class="crumb">Para el parcial</p>
        <h1>Parciales resueltos</h1>
        <p class="tldr">Los ${EXAMS.length} parciales de la cátedra que tenemos, ítem por ítem y resueltos como se espera en el examen. Cada ejercicio tiene una parte práctica (calcular) y una teórica (definir, justificar): la cátedra repite casi las mismas preguntas teóricas, por eso conviene empezar por las que <mark>se repiten</mark>.</p>
        <h2>Lo que más se repite</h2>
        <ol class="freq">${top.map(({ ex, l }) => `<li><span class="n">×${nExams(ex)}</span><span><a href="#/${l.id}">${ex.title}</a><small>Unidad ${modOf(l.module).tema} · ${[...new Set(ex.exam.map((k) => examById[k.split('#')[0]]?.short))].join(', ')}</small></span></li>`).join('')}</ol>
        <h2>Qué temas pesan más</h2>
        <ol class="freq">${byMod.map(({ m, k }) => `<li><span class="n">${k}</span><span><a href="#/${lessonsOf(m.id)[0].id}">Unidad ${m.tema}: ${m.title}</a><small>${k === 1 ? 'ítem' : 'ítems'} de ${n} en total</small></span></li>`).join('')}</ol>
        ${UNITS.map((u) => { const ex = EXAMS.filter((e) => e.unit === u.id); return ex.length ? `<section data-u="${u.id}"><h2><span class="unit-tag">${u.title}</span>${u.name}</h2>
          ${ex.map((e) => `<details class="exam-block" data-u="${u.id}"><summary><b>${e.title}</b><span>${e.sub} · ${e.items.length} ítems</span></summary>
            <div class="exam-body">${e.note ? `<p class="muted-s">${e.note}</p>` : ''}${e.items.map((it) => item(e, it)).join('')}</div></details>`).join('')}</section>` : ''; }).join('')}
      </article>`;
  }

  // ---------- Laboratorios ----------
  function mountLab(el, cfg) {
    const fn = LABS[cfg.type];
    if (!fn) { el.innerHTML = `<p class="note warn">Laboratorio desconocido: ${esc(cfg.type)}</p>`; return; }
    el.innerHTML = `<section class="lab" aria-label="Laboratorio: ${esc(cfg.title)}">
      <header class="lab-head"><span class="lab-kind">Laboratorio</span><h3 class="lab-title">${cfg.title}</h3></header>
      ${cfg.intro ? `<p class="lab-intro">${cfg.intro}</p>` : ''}
      <div class="lab-body"></div></section>`;
    try { fn($('.lab-body', el), cfg, { esc }); }
    catch (err) { $('.lab-body', el).innerHTML = `<p class="note warn">No se pudo iniciar el laboratorio: ${esc(err.message)}</p>`; console.error(err); }
  }

  // ---------- Menú móvil ----------
  function openMenu() { sidebar.classList.add('open'); scrim.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { sidebar.classList.remove('open'); scrim.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', () => (sidebar.classList.contains('open') ? closeMenu() : openMenu()));
  scrim.addEventListener('click', closeMenu);

  // ---------- Tema ----------
  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('ms-theme', root.dataset.theme); } catch {}
  });

  // ---------- Teclado ----------
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, [contenteditable]') || e.altKey || e.ctrlKey || e.metaKey) return;
    const idx = LESSONS.findIndex((l) => l.id === currentId());
    if (e.key === 'ArrowRight' && idx > -1 && idx < LESSONS.length - 1) location.hash = `#/${LESSONS[idx + 1].id}`;
    if (e.key === 'ArrowLeft' && idx > 0) location.hash = `#/${LESSONS[idx - 1].id}`;
    if (e.key === 'Escape') closeMenu();
    if (e.key === '/') { e.preventDefault(); openMenu(); $('#search').focus(); }
  });

  $('#search').addEventListener('input', (e) => renderToc(e.target.value));
  window.addEventListener('hashchange', route);
  renderToc();
  updateProgress();
  route();
})();
