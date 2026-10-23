/* Animaciones: pantalla de entrada al cambiar de tema y glifo animado en la cabecera de cada lección.
   Adaptadas del "Laboratorio Frontend DSW" de Mateo Rusconi. Expone window.ANIM; app.js lo usa en route() y renderLesson(). */
(() => {
  const { LESSONS, MODULES, UNITS } = window.GUIDE;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');

  // Cadena de pasos que se enciende etapa por etapa en la pantalla de entrada
  const PIPES = {
    u1: ['a + bi', 'r, θ', 'r e^(iθ)', 'Operar'],
    u2: ['f(t)', 'ℒ', 'F(s)', 'ℒ⁻¹', 'f(t)'],
    u2e: ['EDO', 'ℒ + cond. iniciales', 'Y(s)', 'Residuos', 'y(t)'],
    u3: ['U(s)', 'P(s)', 'Y(s) = P·U', 'Polos', 'y(t)'],
    u4: ['y′ = f(x, y)', 'Pendiente', 'Paso h', 'y_{i+1}'],
    u5c: ['f(xi)·f(xf) < 0', 'xr', '¿Qué mitad?', 'εa < δ'],
    u5a: ['x₀', 'Tangente / g(x)', 'x₁', '¿Converge?'],
    u6i: ['n + 1 puntos', 'Diferencias divididas', 'fₙ(x)'],
    u6r: ['Datos con error', 'mín Σ E²', 'a₀, a₁', 'r²'],
    u7: ['f periódica', '2L', 'a₀, aₙ, bₙ', 'Σ armónicos'],
  };

  // trap = la confusión típica del tema
  const TRAPS = {
    u1: 'La calculadora da tg⁻¹(b/a) entre −90° y 90°. Si a &lt; 0 hay que <b>sumar 180°</b>: dibujá el número antes de dar el ángulo.',
    u2: 'e<sup>−2t</sup> es a = −2: se reemplaza s por <b>s + 2</b>, no por s − 2. La transformada del producto no es el producto de las transformadas.',
    u2e: 'ℒ{y″} = s²Y − s·y(0) − y′(0): los <b>signos menos</b> de las condiciones iniciales y multiplicar por el coeficiente de y′ son los errores más comunes.',
    u3: 'La función de transferencia se define con <b>condiciones iniciales cero</b>. La salida va al denominador; la entrada, al numerador.',
    u4: 'Achicar h a la mitad divide por 4 el error de <b>cada paso</b> de Euler, pero el error acumulado solo por 2.',
    u5c: 'El cambio de signo garantiza <b>al menos</b> una raíz, no una sola. Y sin cambio de signo puede haber raíces (dobles o en número par).',
    u5a: 'Punto fijo converge solo si <b>|g′(x)| &lt; 1</b>. Newton falla si f′(x) ≈ 0. La secante no encierra a la raíz: no es un método cerrado.',
    u6i: 'Newton y Lagrange dan <b>el mismo polinomio</b>. Si te da distinto, hay un error de cuentas.',
    u6r: 's<sub>y/x</sub> divide por <b>n − 2</b> (recta) y s<sub>y</sub> por n − 1. Un r² alto no prueba que el modelo sea el correcto.',
    u7: 'Primero identificá <b>2L = período</b>. Si f es par, bₙ = 0; si es impar, aₙ = 0: mirá la simetría antes de integrar.',
  };

  // Un SVG de 150×120 por tema. Sin animación (reduced-motion) cada uno queda en un estado final legible.
  const d = (s) => `style="animation-delay:${s}s"`;
  const AX = '<path d="M12 8V108H142" class="gx-strong"/>';
  const GLYPHS = {
    u1: `<path d="M75 8V112M12 60H138" class="gx-line"/><circle cx="75" cy="60" r="42" class="gx-pend gx-dash"/>
      <g class="gx-spin"><path d="M75 60L117 60" class="gx-acc-s"/><circle cx="117" cy="60" r="6" class="gx-eqf"/></g><text x="128" y="20" class="gx-t gx-tc">ℂ</text>`,
    u2: `${AX}<path d="M14 20C40 70 70 96 140 104" class="gx-dem gx-draw" pathLength="1"/><path d="M14 104L140 104" class="gx-sup gx-draw" ${d(0.3)} pathLength="1"/>
      <path d="M14 20C40 70 70 96 140 104L140 106H14Z" class="gx-soft gx-grow-y"/><text x="100" y="40" class="gx-t gx-tc">∫ e^(−st) f</text>`,
    u2e: ['y″ − y = t', 's²Y − s + 2 − Y', 'Y = 1/(s+1) − 1/s²', 'y = e⁻ᵗ − t'].map((t, i) => `<text x="75" y="64" class="gx-t gx-ink gx-kw4" ${d(i * 1.2)}>${t}</text>`).join('')
      + '<rect x="6" y="40" width="138" height="38" rx="10" class="gx-pend"/>',
    u3: `<path d="M8 60H46M104 60H142" class="gx-strong"/><rect x="46" y="38" width="58" height="44" rx="8" class="gx-soft"/><text x="75" y="64" class="gx-t gx-tc">P(s)</text>
      <circle cx="10" cy="60" r="5" class="gx-eqf gx-flow"/><text x="22" y="48" class="gx-t gx-ink">U</text><text x="128" y="48" class="gx-t gx-ink">Y</text>`,
    u4: `${AX}<path d="M14 100C50 96 90 70 140 16" class="gx-dem gx-draw" pathLength="1"/>
      ${[[14, 100, 46, 99], [46, 99, 78, 92], [78, 92, 110, 76], [110, 76, 140, 52]].map(([a, b, c, e], i) => `<g class="gx-pop" ${d(0.5 + i * 0.35)}><path d="M${a} ${b}L${c} ${e}" class="gx-sup"/><circle cx="${c}" cy="${e}" r="4" class="gx-sup-f"/></g>`).join('')}`,
    u5c: `<path d="M12 60H142" class="gx-strong"/><path d="M12 100C50 96 70 70 82 60S120 20 140 14" class="gx-dem"/>
      ${[[16, 124], [16, 70], [43, 43], [70, 22]].map(([x, w], i) => `<rect x="${x + 8}" y="${74 + i * 9}" width="${w - 14}" height="6" rx="3" class="gx-acc gx-pop" ${d(i * 0.45)}/>`).join('')}
      <circle cx="82" cy="60" r="5" class="gx-eqf gx-pop" ${d(1.9)}/>`,
    u5a: `<path d="M12 70H142" class="gx-strong"/><path d="M20 112C60 108 96 90 140 12" class="gx-dem"/>
      <path d="M140 12L96 70" class="gx-acc-s gx-draw" pathLength="1"/><path d="M96 70V88" class="gx-line gx-dash"/>
      <path d="M96 88L83 70" class="gx-acc-s gx-draw" ${d(0.8)} pathLength="1"/><circle cx="82" cy="70" r="5" class="gx-eqf gx-pop" ${d(1.4)}/><text x="30" y="30" class="gx-t gx-tc">x − f/f′</text>`,
    u6i: `${AX}${[[20, 92], [50, 50], [90, 40], [128, 72]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" class="gx-dem-f gx-pop" ${d(i * 0.25)}/>`).join('')}
      <path d="M20 92C34 60 44 50 50 50S78 34 90 40S118 58 128 72" class="gx-acc-s gx-draw" ${d(0.9)} pathLength="1"/>`,
    u6r: `${AX}${[[22, 94], [36, 82], [50, 88], [64, 66], [78, 70], [92, 52], [106, 56], [120, 36], [134, 40]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4" class="gx-dem-f gx-pop" ${d(i * 0.12)}/>`).join('')}
      <path d="M16 98L140 30" class="gx-acc-s gx-draw" ${d(1.1)} pathLength="1"/>`,
    u7: `<path d="M8 60H142" class="gx-line"/><path d="M10 84V36H42V84H74V36H106V84H138V36" class="gx-strong gx-dash"/>
      <path d="${Array.from({ length: 65 }, (_, k) => { const x = 10 + k * 2, t = ((x - 10) / 64) * Math.PI * 2; const y = 60 - 24 * (4 / Math.PI) * (Math.sin(t) + Math.sin(3 * t) / 3 + Math.sin(5 * t) / 5); return `${k ? 'L' : 'M'}${x} ${y.toFixed(1)}`; }).join('')}" class="gx-acc-s gx-draw" pathLength="1"/>`,
  };
  const glyph = (modId) => (GLYPHS[modId] ? `<svg viewBox="0 0 150 120" focusable="false">${GLYPHS[modId]}</svg>` : '');

  // Pantalla de entrada: se cierra sola, con un clic o con cualquier tecla
  function interstitial(n, title, mod) {
    return new Promise((res) => {
      const unit = UNITS.find((u) => u.id === mod.unit);
      const tag = `Unidad ${mod.tema} · TP ${mod.tp} · ${unit.title}`;
      const stages = PIPES[mod.id];
      const el = document.createElement('div');
      el.className = 'inter';
      el.dataset.u = mod.unit;
      el.tabIndex = -1;
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', `Lección ${n}: ${title.replace(/<[^>]*>/g, '')}`);
      el.innerHTML = `<div class="inter-box">
        <p class="inter-typed" style="--steps:${tag.length}" aria-hidden="true">${tag}</p>
        <h2>${mod.title}</h2>
        <p class="inter-pipe" aria-hidden="true">${stages.map((s, i) => `${i ? '<span class="ar">→</span>' : ''}<span class="s" ${d((0.35 + i * 0.16).toFixed(2))}>${s}</span>`).join('')}</p>
        <p class="inter-trap"><span class="lbl">Error típico en el parcial</span>${TRAPS[mod.id]}</p>
        <p class="inter-hint">Tocá o presioná una tecla para entrar</p>
      </div>`;
      let closed = false;
      const end = (e) => {
        if (closed) return;
        closed = true;
        // La tecla que cierra no llega a los atajos de la guía (flechas, /, Escape)
        if (e?.type === 'keydown') { e.preventDefault(); e.stopPropagation(); }
        window.removeEventListener('keydown', end, true);
        el.classList.add('out');
        setTimeout(() => el.remove(), 330);
        res();
      };
      el.addEventListener('click', end);
      window.addEventListener('keydown', end, true);
      document.body.append(el);
      el.focus();
      setTimeout(end, 3200);
    });
  }

  // Al entrar a una lección de otro tema. skip = true solo registra el tema (primera carga).
  let lastModule = null;
  function intro(lessonId, skip) {
    const i = LESSONS.findIndex((l) => l.id === lessonId);
    const mod = MODULES.find((m) => m.id === LESSONS[i]?.module);
    if (!mod || mod.id === lastModule) return Promise.resolve();
    lastModule = mod.id;
    if (skip || RM.matches || !PIPES[mod.id]) return Promise.resolve();
    return interstitial(i + 1, LESSONS[i].title, mod);
  }

  window.ANIM = { intro, glyph };
})();
