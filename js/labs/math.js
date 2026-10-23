/* Laboratorios de gráficas de Matemática Superior. Cada uno redibuja un plot() de _helpers.js al mover un control;
   la primera vista se anima y los redibujos posteriores no. Los cálculos vienen de num.js. */
(() => {
  const L = window.GUIDE.LABS;
  const { plot, num } = window.GUIDE.h;
  const N = window.GUIDE.num;
  const PI = Math.PI;

  // Deslizadores: defs = [{ id, label, min, max, step, value, fmt? }]
  function sliders(el, defs, onChange) {
    const v = Object.fromEntries(defs.map((d) => [d.id, d.value]));
    el.insertAdjacentHTML('beforeend', `<div class="sl-grid">${defs.map((d) => `
      <label class="sl"><span class="sl-l">${d.label}</span>
        <input type="range" data-id="${d.id}" min="${d.min}" max="${d.max}" step="${d.step || 1}" value="${d.value}">
        <output data-o="${d.id}">${d.fmt ? d.fmt(d.value) : num(d.value)}</output></label>`).join('')}</div>`);
    el.querySelectorAll('.sl input').forEach((inp) => inp.addEventListener('input', () => {
      const d = defs.find((x) => x.id === inp.dataset.id);
      v[d.id] = +inp.value;
      el.querySelector(`[data-o="${d.id}"]`).textContent = d.fmt ? d.fmt(v[d.id]) : num(v[d.id]);
      onChange(v, d.id);
    }));
    return v;
  }
  // Grupo de botones excluyentes: opts = [[valor, texto]]
  function toggle(el, label, opts, val, onChange, where = 'beforeend') {
    el.insertAdjacentHTML(where, `<div class="toggle" role="group" aria-label="${label}">${opts.map(([k, t]) => `<button type="button" data-k="${k}" aria-pressed="${k === val}">${t}</button>`).join('')}</div>`);
    const box = where === 'afterbegin' ? el.querySelector('.toggle') : [...el.querySelectorAll('.toggle')].at(-1);
    box.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      onChange(b.dataset.k);
    }));
  }
  const select = (id, label, opts, val) => `<label class="lab-sel"><span>${label}</span><select data-s="${id}">${opts.map(([k, t]) => `<option value="${k}" ${k === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
  const chips = (arr) => `<div class="rd">${arr.filter(Boolean).map(([k, val, cls]) => `<span class="chip ${cls || ''}"><b>${k}</b> <span>${val}</span></span>`).join('')}</div>`;
  const shell = (el) => { el.insertAdjacentHTML('beforeend', '<div class="pl-host"></div><div class="lab-read" aria-live="polite"></div>'); return [el.querySelector('.pl-host'), el.querySelector('.lab-read')]; };
  const range = (vals, pad = 0.12, min = -Infinity, max = Infinity) => {
    const f = vals.filter(Number.isFinite).map((v) => Math.min(max, Math.max(min, v)));
    let lo = Math.min(...f), hi = Math.max(...f);
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    const p = (hi - lo) * pad;
    return [lo - p, hi + p];
  };
  const niceTicks = ([a, b], n = 5) => {
    const raw = (b - a) / n, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw);
    const out = [];
    for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  };
  const cx = (re, im, k = 3) => `${num(re, k)} ${im < 0 ? '−' : '+'} ${num(Math.abs(im), k)} i`;
  const deg = (r) => (r * 180) / PI;
  const sub = (b, i) => `${b}<tspan dy="4" font-size="10">${i}</tspan>`;

  /* ---------- Plano complejo ----------
     cfg.mode: 'forms' (un número y sus cuatro formas) | 'ops' (operaciones entre dos) | 'roots' (raíces n-ésimas) */
  L.complex = (el, cfg) => {
    const mode = cfg.mode || 'forms';
    let op = cfg.op || '+';
    let host, read, first = true;
    const defs = mode === 'ops'
      ? [{ id: 'a', label: 'Re z₁', min: -5, max: 5, step: 0.5, value: 3 }, { id: 'b', label: 'Im z₁', min: -5, max: 5, step: 0.5, value: 2 },
        { id: 'c', label: 'Re z₂', min: -5, max: 5, step: 0.5, value: -1 }, { id: 'd', label: 'Im z₂', min: -5, max: 5, step: 0.5, value: 2 }]
      : [{ id: 'a', label: 'Parte real a', min: -6, max: 6, step: 0.5, value: cfg.a ?? 2 }, { id: 'b', label: 'Parte imaginaria b', min: -6, max: 6, step: 0.5, value: cfg.b ?? 3.5 },
        ...(mode === 'roots' ? [{ id: 'n', label: 'Índice n de la raíz', min: 2, max: 8, step: 1, value: 3 }] : [])];
    const draw = (v) => {
      const { a, b } = v;
      const r = Math.hypot(a, b), th = Math.atan2(b, a);
      const spec = { x: [-7, 7], y: [-7, 7], w: 380, h: 380, xl: 'Re', yl: 'Im', anim: first, ticks: { x: [-6, -4, -2, 2, 4, 6], y: [-6, -4, -2, 2, 4, 6] }, arrows: [], points: [], segs: [], curves: [], texts: [], guides: [] };
      let rows = [];
      const arc = (t0, t1, rad, cls) => spec.curves.push({ pts: Array.from({ length: 41 }, (_, k) => { const t = t0 + ((t1 - t0) * k) / 40; return [rad * Math.cos(t), rad * Math.sin(t)]; }), cls });
      if (mode === 'forms') {
        spec.arrows.push({ from: [0, 0], to: [a, b], cls: 'c-f' });
        spec.points.push({ x: a, y: b, cls: 'c-f', label: 's', pos: b >= 0 ? 'ne' : 'se' }, { x: a, y: -b, cls: 'pl-old', r: 4, label: 's̄', pos: b >= 0 ? 'se' : 'ne' });
        spec.segs.push({ from: [a, b], to: [a, -b], cls: 'pl-faint c-tan' });
        spec.guides.push({ x: a, y: b, xt: num(a), yt: num(b) });
        if (r > 0.01) arc(0, th, Math.min(1.4, r * 0.6), 'c-root');
        const quad = a > 0 && b >= 0 ? 'I' : a <= 0 && b > 0 ? 'II' : a < 0 && b <= 0 ? 'III' : 'IV';
        const base = a === 0 ? 90 : deg(Math.atan(Math.abs(b / a)));
        rows = [['Binómica', `s = ${cx(a, b, 2)}`, 'acc'], ['Módulo', `r = √(${num(a)}² + ${num(b)}²) = ${num(r, 4)}`],
          ['Argumento', `θ = ${num(deg(th), 2)}° = ${num(th, 4)} rad (cuadrante ${quad})`],
          ['Polar', `${num(r, 3)} (cos ${num(deg(th), 1)}° + i sen ${num(deg(th), 1)}°)`], ['Exponencial', `${num(r, 3)} e<sup>${num(th, 3)} i</sup>`], ['Conjugado', `s̄ = ${cx(a, -b, 2)}`]];
        read.innerHTML = chips(rows) + (a < 0 ? `<p class="lab-note">tg⁻¹(b/a) da ${num(deg(Math.atan(b / a)), 2)}°, pero el punto está en el cuadrante ${quad}: hay que ${b >= 0 ? 'sumarle' : 'restarle'} 180°. Por eso conviene dibujar el número antes de calcular el ángulo.</p>` : `<p class="lab-note">Ángulo de referencia: tg⁻¹(|b|/|a|) = ${num(base, 2)}°.</p>`);
      } else if (mode === 'ops') {
        const { c, d } = v;
        const res = op === '+' ? [a + c, b + d] : op === '−' ? [a - c, b - d] : op === '×' ? [a * c - b * d, a * d + b * c] : [(a * c + b * d) / (c * c + d * d), (b * c - a * d) / (c * c + d * d)];
        const R = Math.max(7, ...res.map((q) => Math.abs(q) * 1.15));
        Object.assign(spec, { x: [-R, R], y: [-R, R], ticks: { x: niceTicks([-R, R]), y: niceTicks([-R, R]) } });
        spec.arrows.push({ from: [0, 0], to: [a, b], cls: 'c-f' }, { from: [0, 0], to: [c, d], cls: 'c-g' });
        if (Number.isFinite(res[0])) spec.arrows.push({ from: [0, 0], to: res, cls: 'c-root' });
        spec.points.push({ x: a, y: b, cls: 'c-f', label: 'z₁' }, { x: c, y: d, cls: 'c-g', label: 'z₂' });
        if (Number.isFinite(res[0])) spec.points.push({ x: res[0], y: res[1], cls: 'c-root', label: `z₁ ${op} z₂`, pos: 'e' });
        if (op === '+') spec.segs.push({ from: [a, b], to: res, cls: 'c-g pl-faint' }, { from: [c, d], to: res, cls: 'c-f pl-faint' });
        const r1 = Math.hypot(a, b), r2 = Math.hypot(c, d), t1 = deg(Math.atan2(b, a)), t2 = deg(Math.atan2(d, c));
        rows = [['z₁', cx(a, b, 2)], ['z₂', cx(c, d, 2)], ['Resultado', Number.isFinite(res[0]) ? cx(res[0], res[1]) : 'no se divide por 0', 'acc']];
        const how = { '+': 'Se suman partes reales con reales e imaginarias con imaginarias: es la regla del paralelogramo.',
          '−': 'Se restan componente a componente: z₁ − z₂ = z₁ + (−z₂).',
          '×': `Distributiva con i² = −1. En polar se ve mejor: los módulos se multiplican (${num(r1, 2)} · ${num(r2, 2)} = ${num(r1 * r2, 2)}) y los ángulos se suman (${num(t1, 1)}° + ${num(t2, 1)}° = ${num(t1 + t2, 1)}°).`,
          '÷': `Se multiplica numerador y denominador por el conjugado del denominador (${cx(c, -d, 2)}), así el denominador queda real: c² + d² = ${num(c * c + d * d, 2)}. En polar: módulos se dividen, ángulos se restan.` }[op];
        read.innerHTML = chips(rows) + `<p class="lab-note">${how}</p>`;
      } else {
        const n = v.n, rr = r ** (1 / n);
        const R = Math.max(r, rr) * 1.25 + 0.5;
        Object.assign(spec, { x: [-R, R], y: [-R, R], ticks: { x: niceTicks([-R, R], 4), y: niceTicks([-R, R], 4) } });
        spec.arrows.push({ from: [0, 0], to: [a, b], cls: 'c-f' });
        spec.points.push({ x: a, y: b, cls: 'c-f', label: 's' });
        arc(0, 2 * PI, rr, 'c-tan pl-dash');
        const roots = Array.from({ length: n }, (_, k) => { const t = (th + 2 * PI * k) / n; return [rr * Math.cos(t), rr * Math.sin(t)]; });
        roots.forEach((q, k) => { spec.points.push({ x: q[0], y: q[1], cls: 'c-root', label: `w${'₀₁₂₃₄₅₆₇'[k]}` }); spec.segs.push({ from: q, to: roots[(k + 1) % n], cls: 'c-root pl-faint' }); });
        read.innerHTML = chips([['Módulo de cada raíz', `${num(r, 3)}<sup>1/${n}</sup> = ${num(rr, 4)}`, 'acc'], ['Separación', `360° / ${n} = ${num(360 / n, 2)}°`]])
          + `<p class="lab-note">w<sub>k</sub> = r<sup>1/n</sup> [cos((θ + 2kπ)/n) + i sen((θ + 2kπ)/n)], k = 0, …, ${n - 1}: ${roots.map((q, k) => `w${'₀₁₂₃₄₅₆₇'[k]} = ${cx(q[0], q[1], 3)}`).join('; ')}. Las ${n} raíces forman un polígono regular.</p>`;
      }
      host.innerHTML = plot(spec);
      first = false;
    };
    if (mode === 'ops') toggle(el, 'Operación', [['+', 'Suma'], ['−', 'Resta'], ['×', 'Producto'], ['÷', 'Cociente']], op, (k) => { op = k; draw(v); }, 'afterbegin');
    const v = sliders(el, defs, (vv) => draw(vv));
    [host, read] = shell(el);
    draw(v);
  };

  /* ---------- Laplace como área: F(s) = ∫ e^(−st) f(t) dt ---------- */
  const LFN = {
    one: { l: 'f(t) = 1', f: () => 1, F: (s) => 1 / s, Fl: '1/s', sig: 0 },
    t: { l: 'f(t) = t', f: (t) => t, F: (s) => 1 / s ** 2, Fl: '1/s²', sig: 0 },
    t2: { l: 'f(t) = t²', f: (t) => t * t, F: (s) => 2 / s ** 3, Fl: '2!/s³', sig: 0 },
    exp: { l: 'f(t) = e<sup>−t</sup>', f: (t) => Math.exp(-t), F: (s) => 1 / (s + 1), Fl: '1/(s + 1)', sig: -1 },
    sin: { l: 'f(t) = sen 2t', f: (t) => Math.sin(2 * t), F: (s) => 2 / (s * s + 4), Fl: '2/(s² + 4)', sig: 0 },
    cos: { l: 'f(t) = cos 2t', f: (t) => Math.cos(2 * t), F: (s) => s / (s * s + 4), Fl: 's/(s² + 4)', sig: 0 },
  };
  L.laplace = (el, cfg) => {
    let fn = cfg.fn || 'one';
    el.insertAdjacentHTML('beforeend', `<div class="lab-row">${select('fn', 'Función', Object.entries(LFN).map(([k, o]) => [k, o.l.replace(/<[^>]+>/g, '').replace('e−t', 'e^(−t)')]), fn)}</div>`);
    const v = sliders(el, [{ id: 's', label: 'Valor de s', min: 0.1, max: 4, step: 0.05, value: 1 }, { id: 'a', label: 'Traslación: multiplicar por e^(a t), a =', min: -1, max: 1, step: 0.1, value: 0 }], () => draw());
    const [host, read] = shell(el);
    let first = true;
    const integ = (g, T = 80, m = 4000) => { const h = T / m; let s = g(0) + g(T); for (let k = 1; k < m; k++) s += (k % 2 ? 4 : 2) * g(k * h); return (s * h) / 3; };
    const draw = () => {
      const o = LFN[fn], { s, a } = v;
      const g = (t) => Math.exp(a * t) * o.f(t), w = (t) => Math.exp(-s * t) * g(t);
      const conv = s - a > Math.max(o.sig, 0) || (o.sig < 0 && s - a > o.sig);
      const pts = Array.from({ length: 161 }, (_, k) => [(8 * k) / 160, w((8 * k) / 160)]);
      const spec = { x: [0, 8], y: [-1.2, 2.6], xl: 't', yl: '', anim: first, ticks: { x: [2, 4, 6, 8], y: [-1, 1, 2] },
        areas: [{ pts: [[0, 0], ...pts.map(([x, y]) => [x, Math.max(-1.3, Math.min(2.7, y))]), [8, 0]], cls: 'a-f' }],
        curves: [...(a ? [{ f: o.f, cls: 'c-tan', ghost: true, label: 'f(t)', at: 6.6 }] : []), { f: g, cls: 'c-g', label: a ? 'e^(at) f(t)' : 'f(t)', at: 6.4 }, { f: (t) => Math.exp(-s * t), cls: 'c-tan', dash: true, label: 'e^(−st)', at: 1.2 }, { f: w, cls: 'c-f', label: 'e^(−st)·f', at: 0.6, n: 200 }] };
      host.innerHTML = plot(spec);
      first = false;
      const area = integ(w);
      read.innerHTML = conv
        ? chips([['Área bajo e^(−st)·f(t)', num(area, 4), 'acc'], ['Fórmula de la tabla', `${a ? `F(s − a) = ${o.Fl.replace(/s/g, `(s − ${num(a)})`)}` : `F(s) = ${o.Fl}`} = ${num(o.F(s - a), 4)}`, 'ok']])
          + `<p class="lab-note">La transformada en s = ${num(s)} es exactamente el área pintada. Mové s: cuanto más grande, más rápido apaga e<sup>−st</sup> a la función y más chica es el área.${a ? ` Multiplicar por e<sup>${num(a)}t</sup> equivale a evaluar la misma F en s − a: es la propiedad de traslación.` : ''}</p>`
        : chips([['La integral no converge', `hace falta s &gt; ${num(Math.max(o.sig, 0) + a)}`, 'warn']]) + '<p class="lab-note">Con este s, e<sup>−st</sup> no alcanza a apagar a la función: el área crece sin límite y la transformada no existe en ese punto.</p>';
    };
    el.querySelector('[data-s="fn"]').addEventListener('change', (e) => { fn = e.target.value; draw(); });
    draw();
  };

  /* ---------- Respuesta al escalón de un sistema de segundo orden ---------- */
  L.response = (el, cfg) => {
    let kind = cfg.kind || 'real';
    const [host, read] = shell(el);
    const sim = (a1, a0, k, T) => { // y'' + a1 y' + a0 y = k·u(t), y(0) = y'(0) = 0, por RK4
      const h = T / 600, out = [[0, 0]];
      let y = 0, z = 0;
      const F = (yy, zz) => [zz, k - a1 * zz - a0 * yy];
      for (let i = 1; i <= 600; i++) {
        const k1 = F(y, z), k2 = F(y + (h * k1[0]) / 2, z + (h * k1[1]) / 2), k3 = F(y + (h * k2[0]) / 2, z + (h * k2[1]) / 2), k4 = F(y + h * k3[0], z + h * k3[1]);
        y += (h * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0])) / 6; z += (h * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])) / 6;
        out.push([i * h, y]);
      }
      return out;
    };
    let first = true;
    const draw = () => {
      let pts, poles, rows, note, T = 8;
      if (kind === 'real') {
        const { p1, p2 } = vr;
        poles = [[-p1, 0], [-p2, 0]];
        pts = sim(p1 + p2, p1 * p2, p1 * p2, T);
        const same = Math.abs(p1 - p2) < 1e-9;
        const R1 = same ? null : p2 / (p1 - p2), R2 = same ? null : -p1 / (p1 - p2);
        rows = [['P(s)', `${num(p1 * p2, 2)} / [(s + ${num(p1)})(s + ${num(p2)})]`], ['Polos', `s = −${num(p1)} y s = −${num(p2)}`, 'acc']];
        note = same ? `Polo doble en s = −${num(p1)}: y(t) = 1 − e<sup>−${num(p1)}t</sup>(1 + ${num(p1)} t).`
          : `Y(s) = P(s)·(1/s) = R₀/s + R₁/(s + ${num(p1)}) + R₂/(s + ${num(p2)}) con R₀ = 1, R₁ = ${num(R1, 4)}, R₂ = ${num(R2, 4)}. Entonces y(t) = 1 ${R1 < 0 ? '−' : '+'} ${num(Math.abs(R1), 4)} e<sup>−${num(p1)}t</sup> ${R2 < 0 ? '−' : '+'} ${num(Math.abs(R2), 4)} e<sup>−${num(p2)}t</sup>. Polos reales negativos: la salida sube sin oscilar y se estabiliza.`;
      } else {
        const { z, w } = vc;
        const disc = z * z - 1;
        poles = disc >= 0 ? [[-z * w + w * Math.sqrt(disc), 0], [-z * w - w * Math.sqrt(disc), 0]] : [[-z * w, w * Math.sqrt(-disc)], [-z * w, -w * Math.sqrt(-disc)]];
        T = 12;
        pts = sim(2 * z * w, w * w, w * w, T);
        const kindTxt = z < 0 ? 'inestable: polos en el semiplano derecho, la oscilación crece' : z === 0 ? 'oscilación pura: polos sobre el eje imaginario' : z < 1 ? 'subamortiguado: polos complejos, oscila y se apaga' : z === 1 ? 'amortiguamiento crítico: polo doble real' : 'sobreamortiguado: polos reales distintos, no oscila';
        rows = [['P(s)', `ω² / (s² + 2ζω s + ω²) = ${num(w * w, 2)} / (s² + ${num(2 * z * w, 2)} s + ${num(w * w, 2)})`], ['Polos', poles.map((q) => cx(q[0], q[1], 2)).join(' y '), 'acc'], ['Tipo', kindTxt, z < 0 ? 'warn' : 'ok']];
        note = 'La parte real del polo dice si la respuesta se apaga (negativa) o explota (positiva); la parte imaginaria, con qué frecuencia oscila.';
      }
      const yr = range(pts.map((p) => p[1]).concat([0, 1.2]), 0.08, -3, 4);
      const spec = { x: [0, T], y: yr, xl: 't', yl: 'y(t)', anim: first, ticks: { x: niceTicks([0, T], 4), y: niceTicks(yr, 4) },
        hlines: [{ y: 1, cls: 'c-tan pl-dash', label: 'u(t) = 1' }], curves: [{ pts, cls: 'c-f', label: 'y(t)' }] };
      const pr = Math.max(4, ...poles.flat().map((q) => Math.abs(q) * 1.25));
      const sp = { x: [-pr, pr], y: [-pr, pr], w: 220, h: 220, xl: 'σ', yl: 'jω', anim: first, areas: [{ pts: [[0, -pr], [pr, -pr], [pr, pr], [0, pr]], cls: 'a-bad' }],
        points: poles.map((q, i) => ({ x: q[0], y: q[1], cls: 'c-root', label: i ? '' : 'polos', pos: 'nw' })), texts: [{ x: pr * 0.5, y: pr * 0.82, t: 'inestable', cls: 'c-err' }] };
      host.innerHTML = `<div class="pl-pair"><div>${plot(spec)}</div><div>${plot(sp)}</div></div>`;
      first = false;
      read.innerHTML = chips(rows) + `<p class="lab-note">${note}</p>`;
    };
    toggle(el, 'Tipo de polos', [['real', 'Polos reales'], ['cplx', 'Polos complejos']], kind, (k) => { kind = k; el.querySelector('.sl-r').hidden = k !== 'real'; el.querySelector('.sl-c').hidden = k === 'real'; draw(); }, 'afterbegin');
    const boxR = document.createElement('div'); boxR.className = 'sl-r';
    const boxC = document.createElement('div'); boxC.className = 'sl-c';
    host.before(boxR, boxC);
    const vr = sliders(boxR, [{ id: 'p1', label: 'Primer polo en s = −p₁, p₁ =', min: 0.2, max: 6, step: 0.1, value: cfg.p1 ?? 1 }, { id: 'p2', label: 'Segundo polo en s = −p₂, p₂ =', min: 0.2, max: 6, step: 0.1, value: cfg.p2 ?? 4 }], draw);
    const vc = sliders(boxC, [{ id: 'z', label: 'Amortiguamiento ζ', min: -0.2, max: 2, step: 0.05, value: 0.3 }, { id: 'w', label: 'Frecuencia natural ω', min: 0.5, max: 4, step: 0.1, value: 2 }], draw);
    boxC.hidden = kind === 'real'; boxR.hidden = kind !== 'real';
    draw();
  };

  /* ---------- EDO: métodos de un paso contra la referencia ---------- */
  const ODES = {
    a1: { l: 'dy/dx = y x² − 1, y(0) = 1', f: (x, y) => y * x * x - 1, x0: 0, y0: 1, xe: 2 },
    b1: { l: 'dy/dx = y ln(x + 1), y(0) = 1', f: (x, y) => y * Math.log(x + 1), x0: 0, y0: 1, xe: 2 },
    a2: { l: 'dy/dx = y x² − y, y(0) = 1', f: (x, y) => y * x * x - y, x0: 0, y0: 1, xe: 2 },
    e3: { l: 'dy/dx = 2x − 3y + 1, y(1) = 5', f: (x, y) => 2 * x - 3 * y + 1, x0: 1, y0: 5, xe: 2 },
  };
  const MCLS = { E: 'c-s', H: 'c-g', P: 'c-eq', RK3: 'c-x', RK4: 'c-ok' };
  L.ode = (el, cfg) => {
    let pid = cfg.problem || 'a1', h = cfg.h || 0.5;
    const on = new Set(cfg.methods || ['E', 'H']);
    el.insertAdjacentHTML('beforeend', `<div class="lab-row">${select('p', 'Ecuación (TP 5)', Object.entries(ODES).map(([k, o]) => [k, o.l]), pid)}
      ${select('h', 'Paso h', [[1, '1'], [0.5, '0,5'], [0.25, '0,25'], [0.1, '0,1']].map(([k, t]) => [String(k), t]), String(h))}</div>
      <div class="lab-row" role="group" aria-label="Métodos">${Object.keys(MCLS).map((m) => `<label class="seg"><input type="checkbox" value="${m}" ${on.has(m) ? 'checked' : ''}><span>${N.NAMES[m]}</span></label>`).join('')}</div>`);
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const o = ODES[pid], ref = N.exact(o.f, o.x0, o.y0, o.xe);
      const runs = [...on].map((m) => ({ m, pts: N.ode(m, o.f, o.x0, o.y0, h, o.xe) }));
      const yr = range([...ref.map((p) => p.y), ...runs.flatMap((r) => r.pts.map((p) => p.y))], 0.1, -8, 8);
      const spec = { x: [o.x0, o.xe], y: yr, anim: first, ticks: { x: niceTicks([o.x0, o.xe], 4), y: niceTicks(yr, 4) },
        curves: [{ pts: ref.map((p) => [p.x, p.y]), cls: 'c-f', label: 'referencia' }, ...runs.map((r) => ({ pts: r.pts.map((p) => [p.x, p.y]), cls: MCLS[r.m] }))],
        points: runs.flatMap((r) => r.pts.map((p) => ({ x: p.x, y: p.y, r: 3.5, cls: MCLS[r.m] }))) };
      host.innerHTML = plot(spec);
      first = false;
      const yt = ref.at(-1).y;
      read.innerHTML = chips([['Referencia y(' + num(o.xe) + ')', num(yt, 5), 'acc'], ...runs.map((r) => [N.NAMES[r.m], `${num(r.pts.at(-1).y, 5)} (error ${num(Math.abs((yt - r.pts.at(-1).y) / yt) * 100, 2)} %)`, MCLS[r.m].replace('c-', 'm-')])])
        + `<p class="lab-note">La referencia es Runge Kutta 4 con un paso mil veces más chico: hace de “valor verdadero”. Achicá h y mirá cómo cada método se pega a ella; los de mayor orden se pegan antes.</p>`;
    };
    el.querySelector('[data-s="p"]').addEventListener('change', (e) => { pid = e.target.value; draw(); });
    el.querySelector('[data-s="h"]').addEventListener('change', (e) => { h = +e.target.value; draw(); });
    el.querySelectorAll('.seg input').forEach((c) => c.addEventListener('change', () => { c.checked ? on.add(c.value) : on.delete(c.value); draw(); }));
    draw();
  };

  /* ---------- Raíces: iteración por iteración con la geometría de cada método ---------- */
  const RFN = {
    p1a: { l: 'f(x) = −2,1 + 6,21x − 3,9x² + 0,667x³', f: (x) => -2.1 + 6.21 * x - 3.9 * x * x + 0.667 * x ** 3, df: (x) => 6.21 - 7.8 * x + 2.001 * x * x, x: [-0.2, 4.2], y: [-2.5, 3], init: { a: 0.4, b: 0.6, x0: 0.5, x1: 1 } },
    p2a: { l: 'f(x) = x³ − x² − 2x + 1', f: (x) => x ** 3 - x * x - 2 * x + 1, df: (x) => 3 * x * x - 2 * x - 2, x: [-1.6, 2.2], y: [-2, 2.5], init: { a: 0.4, b: 0.8, x0: 0, x1: 1 } },
    p1c: { l: 'f(x) = x³ − 3x² + 5', f: (x) => x ** 3 - 3 * x * x + 5, df: (x) => 3 * x * x - 6 * x, x: [-3, 3], y: [-15, 10], init: { a: -2, b: -1, x0: -1.5, x1: -1 } },
    p3a: { l: 'f(x) = x − 4 sen x', f: (x) => x - 4 * Math.sin(x), df: (x) => 1 - 4 * Math.cos(x), g: (x) => 4 * Math.sin(x), gl: 'g(x) = 4 sen x', x: [0, 3.5], y: [-3, 4.5], init: { a: 2, b: 3, x0: 2.47, x1: 2.5 } },
    p3b: { l: 'f(x) = x² − 0,5', f: (x) => x * x - 0.5, df: (x) => 2 * x, g: (x) => x * x + x - 0.5, gl: 'g(x) = x² + x − 0,5', x: [-1.5, 1.5], y: [-1, 1.8], init: { a: 0, b: 1, x0: 0.7, x1: 1 } },
    p3c: { l: 'f(x) = e^(−x) − x', f: (x) => Math.exp(-x) - x, df: (x) => -Math.exp(-x) - 1, g: (x) => Math.exp(-x), gl: 'g(x) = e^(−x)', x: [-0.2, 1.4], y: [-1.2, 1.4], init: { a: 0, b: 1, x0: 0.5, x1: 1 } },
    p4a: { l: 'h(x) = cos x + 1/2', f: (x) => Math.cos(x) + 0.5, df: (x) => -Math.sin(x), g: (x) => x + Math.cos(x) + 0.5, gl: 'g(x) = x + cos x + 1/2', x: [0, 6.3], y: [-0.8, 1.8], init: { a: 1.5, b: 3, x0: 2, x1: 2.5 } },
    p4c: { l: 'f(x) = x³ − 100', f: (x) => x ** 3 - 100, df: (x) => 3 * x * x, g: (x) => 10 / Math.sqrt(x), gl: 'g(x) = 10/√x', x: [0, 6], y: [-110, 120], init: { a: 4, b: 5, x0: 4, x1: 5 } },
    p5a: { l: 'f(x) = 4x² − e^(−x) − 1', f: (x) => 4 * x * x - Math.exp(-x) - 1, df: (x) => 8 * x + Math.exp(-x), x: [-0.2, 1.2], y: [-2.5, 3.5], init: { a: 0.5, b: 1, x0: 1, x1: 1 } },
  };
  const MN = { bis: 'Bisección', rf: 'Regla falsa', fp: 'Punto fijo', nr: 'Newton Raphson', sec: 'Secante' };
  L.roots = (el, cfg) => {
    let fid = cfg.fn || 'p2a', m = cfg.method || 'bis', k = 0;
    const allowed = cfg.methods || Object.keys(MN);
    const fnOpts = () => Object.entries(RFN).filter(([, o]) => m !== 'fp' || o.g).map(([key, o]) => [key, o.l]);
    el.insertAdjacentHTML('beforeend', `<div class="lab-row"><span class="fnsel"></span>${allowed.length > 1 ? select('m', 'Método', allowed.map((x) => [x, MN[x]]), m) : ''}</div>
      <div class="lab-row inits"></div>
      <div class="lab-row"><button class="btn sm primary" type="button" data-act="step">Siguiente iteración</button><button class="btn sm" type="button" data-act="run"><span>Iterar hasta ε<sub>a</sub> &lt; 1 %</span></button><button class="btn sm" type="button" data-act="reset">Reiniciar</button></div>`);
    const [host, read] = shell(el);
    const tbl = document.createElement('div'); tbl.className = 'iter-table'; el.append(tbl);
    const P = {};
    const renderInputs = () => {
      const o = RFN[fid];
      if (!o.g && m === 'fp') fid = 'p3c';
      const names = m === 'bis' || m === 'rf' ? [['a', 'x<sub>i</sub>'], ['b', 'x<sub>f</sub>']] : m === 'sec' ? [['x0', 'x<sub>i−1</sub>'], ['x1', 'x<sub>i</sub>']] : [['x0', 'x<sub>0</sub>']];
      const o2 = RFN[fid];
      el.querySelector('.fnsel').innerHTML = select('f', 'Función (TP 6)', fnOpts(), fid);
      el.querySelector('[data-s="f"]').addEventListener('change', (e) => { fid = e.target.value; Object.keys(P).forEach((q) => delete P[q]); renderInputs(); });
      el.querySelector('.inits').innerHTML = names.map(([id, t]) => `<label class="lab-sel"><span>${t}</span><input type="number" step="any" data-i="${id}" value="${P[id] ?? (m === 'sec' && id === 'x0' ? o2.init.a : o2.init[id])}"></label>`).join('');
      el.querySelectorAll('[data-i]').forEach((inp) => inp.addEventListener('change', () => { P[inp.dataset.i] = +inp.value; k = 0; draw(); }));
      k = 0; draw();
    };
    const val = (id) => +el.querySelector(`[data-i="${id}"]`).value;
    const runRows = (n) => {
      const o = RFN[fid];
      if (m === 'bis' || m === 'rf') return N.closed(m, o.f, val('a'), val('b'), { n });
      if (m === 'fp') return N.fixed(o.g, val('x0'), { n });
      if (m === 'nr') return N.newton(o.f, o.df, val('x0'), { n });
      return N.secant(o.f, val('x0'), val('x1'), { n });
    };
    let first = true;
    const draw = () => {
      const o = RFN[fid];
      const rows = k ? runRows(k) : [];
      const last = rows.at(-1);
      const spec = { x: o.x, y: o.y, anim: first, ticks: { x: niceTicks(o.x, 5), y: niceTicks(o.y, 4) }, curves: [], points: [], segs: [], areas: [], vlines: [] };
      const ok = (x) => Number.isFinite(x) && x > o.x[0] - 50 && x < o.x[1] + 50;
      if (m === 'fp') {
        Object.assign(spec, { yl: 'y', y: o.x, ticks: { x: niceTicks(o.x, 5), y: niceTicks(o.x, 5) } });
        spec.curves.push({ f: (x) => x, cls: 'c-tan', dash: true, label: 'y = x' }, { f: o.g, cls: 'c-g', label: o.gl, n: 160 });
        let x = val('x0');
        spec.points.push({ x, y: 0, cls: 'c-root', label: 'x₀', pos: 's' });
        rows.forEach((r) => { if (ok(r.xn)) spec.segs.push({ from: [r.x, r.x], to: [r.x, r.xn], cls: 'c-root' }, { from: [r.x, r.xn], to: [r.xn, r.xn], cls: 'c-root' }); });
        if (rows.length) spec.segs.unshift({ from: [rows[0].x, 0], to: [rows[0].x, rows[0].x], cls: 'c-root pl-faint' });
      } else {
        spec.curves.push({ f: o.f, cls: 'c-f', label: 'f(x)', n: 200 });
        if ((m === 'bis' || m === 'rf')) {
          const a = last ? last.a : val('a'), b = last ? last.b : val('b');
          spec.areas.push({ pts: [[a, o.y[0]], [b, o.y[0]], [b, o.y[1]], [a, o.y[1]]], cls: 'a-f' });
          spec.points.push({ x: a, y: o.f(a), cls: 'c-g', label: sub('x', 'i'), pos: 'nw' }, { x: b, y: o.f(b), cls: 'c-g', label: sub('x', 'f'), pos: 'ne' });
          if (m === 'rf') spec.segs.push({ from: [a, o.f(a)], to: [b, o.f(b)], cls: 'c-g' });
          if (last) spec.points.push({ x: last.xr, y: 0, cls: 'c-root', label: sub('x', 'r'), pos: 's' }), spec.segs.push({ from: [last.xr, 0], to: [last.xr, last.fr], cls: 'c-root pl-faint' });
        } else if (m === 'nr') {
          rows.forEach((r, i) => {
            const cls = i === rows.length - 1 ? 'c-root' : 'c-root pl-faint';
            spec.segs.push({ from: [r.x, 0], to: [r.x, r.fx], cls: 'c-tan pl-faint' });
            if (ok(r.xn)) spec.segs.push({ from: [r.x - (r.x - r.xn) * 1.6, r.fx - r.fx * 1.6], to: [r.x + (r.x - r.xn) * 0.6, r.fx + r.fx * 0.6], cls });
            spec.points.push({ x: r.x, y: r.fx, r: 4, cls: 'c-g' });
          });
          spec.points.push({ x: last ? last.xn : val('x0'), y: 0, cls: 'c-root', label: last ? `x${'₀₁₂₃₄₅₆₇₈₉'[Math.min(9, rows.length)]}` : 'x₀', pos: 's' });
        } else {
          const x0 = last ? last.x0 : val('x0'), x1 = last ? last.x1 : val('x1');
          spec.points.push({ x: x0, y: o.f(x0), cls: 'c-g', label: sub('x', 'i−1'), pos: 'nw' }, { x: x1, y: o.f(x1), cls: 'c-g', label: sub('x', 'i'), pos: 'ne' });
          if (last && ok(last.xn)) {
            const lo = Math.min(x0, x1, last.xn), hi = Math.max(x0, x1, last.xn), sl = (o.f(x1) - o.f(x0)) / (x1 - x0);
            spec.segs.push({ from: [lo - 0.2, o.f(x1) + sl * (lo - 0.2 - x1)], to: [hi + 0.2, o.f(x1) + sl * (hi + 0.2 - x1)], cls: 'c-root' });
            spec.points.push({ x: last.xn, y: 0, cls: 'c-root', label: sub('x', 'i+1'), pos: 's' });
          }
        }
      }
      host.innerHTML = plot(spec);
      first = false;
      const est = last ? (last.xr ?? last.xn) : null;
      const errs = rows.map((r) => r.e).filter((e) => e != null);
      const div = errs.length >= 3 && errs.slice(-3).every((e, i, arr) => !i || e > arr[i - 1]) || (est != null && !ok(est));
      read.innerHTML = chips([['Iteración', k], est != null && ['Aproximación', num(est, 6), 'acc'], last?.e != null && ['ε<sub>a</sub>', `${num(last.e, 4)} %`, last.e < 1 ? 'ok' : ''],
        est != null && ['f(aprox.)', num(RFN[fid].f(est), 6)], div && ['Atención', 'el método se está alejando: diverge', 'warn']])
        + (k ? '' : `<p class="lab-note">${{ bis: 'El intervalo sombreado encierra a la raíz porque f cambia de signo en sus extremos. Cada iteración lo parte al medio.', rf: 'La cuerda une f(x<sub>i</sub>) con f(x<sub>f</sub>); donde corta al eje está la nueva aproximación. Un extremo suele quedar fijo.', fp: 'Despejamos x = g(x). La raíz es donde la curva g cruza la recta y = x. La telaraña converge si |g′(x)| &lt; 1 cerca de la raíz.', nr: 'Desde x<sub>0</sub> se traza la tangente a la curva; donde corta al eje está la siguiente aproximación.', sec: 'Como Newton, pero la tangente se reemplaza por la recta que pasa por los dos últimos puntos. No necesita encerrar a la raíz.' }[m]}</p>`);
      const head = m === 'bis' || m === 'rf' ? ['i', 'x<sub>i</sub>', 'x<sub>f</sub>', 'x<sub>r</sub>', 'f(x<sub>r</sub>)', 'ε<sub>a</sub>'] : m === 'fp' ? ['i', 'x<sub>i</sub>', 'g(x<sub>i</sub>)', 'ε<sub>a</sub>'] : m === 'nr' ? ['i', 'x<sub>i</sub>', 'f(x<sub>i</sub>)', 'f′(x<sub>i</sub>)', 'x<sub>i+1</sub>', 'ε<sub>a</sub>'] : ['i', 'x<sub>i−1</sub>', 'x<sub>i</sub>', 'x<sub>i+1</sub>', 'ε<sub>a</sub>'];
      const D = N.d, E = N.pct;
      tbl.innerHTML = rows.length ? window.GUIDE.h.table(head, rows.map((r) => m === 'bis' || m === 'rf' ? [r.i, D(r.a), D(r.b), `<b>${D(r.xr, 6)}</b>`, D(r.fr), E(r.e)] : m === 'fp' ? [r.i, D(r.x, 6), `<b>${D(r.xn, 6)}</b>`, E(r.e)] : m === 'nr' ? [r.i, D(r.x, 6), D(r.fx), D(r.d), `<b>${D(r.xn, 6)}</b>`, E(r.e)] : [r.i, D(r.x0), D(r.x1), `<b>${D(r.xn, 6)}</b>`, E(r.e)])) : '';
    };
    el.querySelector('[data-act="step"]').addEventListener('click', () => { if (k < 40) k++; draw(); });
    el.querySelector('[data-act="run"]').addEventListener('click', () => { const r = runRows(40); const j = r.findIndex((q) => q.e != null && q.e < 1); k = j === -1 ? Math.min(12, r.length) : j + 1; draw(); });
    el.querySelector('[data-act="reset"]').addEventListener('click', () => { k = 0; draw(); });
    el.querySelector('[data-s="m"]')?.addEventListener('change', (e) => { m = e.target.value; Object.keys(P).forEach((q) => delete P[q]); renderInputs(); });
    renderInputs();
  };

  /* ---------- Carrera: εa por iteración para los cinco métodos ---------- */
  L.race = (el, cfg) => {
    let fid = cfg.fn || 'p3c';
    el.insertAdjacentHTML('beforeend', `<div class="lab-row">${select('f', 'Función', Object.entries(RFN).filter(([, o]) => o.g).map(([k, o]) => [k, o.l]), fid)}</div>`);
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const o = RFN[fid], i = o.init;
      const runs = { bis: N.closed('bis', o.f, i.a, i.b, { n: 12 }), rf: N.closed('rf', o.f, i.a, i.b, { n: 12 }), fp: N.fixed(o.g, i.x0, { n: 12 }), nr: N.newton(o.f, o.df, i.x0, { n: 12 }), sec: N.secant(o.f, i.a, i.b, { n: 12 }) };
      const cls = { bis: 'c-s', rf: 'c-eq', fp: 'c-x', nr: 'c-g', sec: 'c-ok' };
      const lg = (e) => Math.max(-8, Math.log10(Math.max(e, 1e-8)));
      const curves = Object.entries(runs).map(([k, r]) => ({ pts: r.filter((q) => q.e != null && Number.isFinite(q.e)).map((q) => [q.i, lg(q.e)]), cls: cls[k] }));
      const spec = { x: [0, 12.5], y: [-8.5, 3], xl: 'iteración', yl: 'ε<sub>a</sub>', anim: first, ticks: { x: [2, 4, 6, 8, 10, 12] },
        hlines: [{ y: 0, cls: 'c-tan pl-dash', label: '1 %' }], texts: [2, -2, -4, -6, -8].map((y) => ({ x: 0.15, y: y + 0.15, t: `10${String(y).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c])} %`, cls: 'pl-tick', anchor: 'start' })),
        curves, points: curves.flatMap((c) => c.pts.map(([x, y]) => ({ x, y, r: 3.2, cls: c.cls }))) };
      host.innerHTML = plot(spec);
      first = false;
      const it = (r) => { const j = r.findIndex((q) => q.e != null && q.e < 1); return j === -1 ? 'más de 12' : j + 1; };
      read.innerHTML = chips(Object.entries(runs).map(([k, r]) => [MN[k], `${it(r)} iteraciones hasta 1 %`, cls[k].replace('c-', 'm-')]))
        + `<p class="lab-note">El eje vertical es logarítmico: cada escalón es un dígito más de precisión. Newton baja en picada (convergencia cuadrática: duplica los dígitos correctos en cada paso); la secante lo sigue de cerca; bisección baja siempre al mismo ritmo, a la mitad por iteración.</p>`;
    };
    el.querySelector('[data-s="f"]').addEventListener('change', (e) => { fid = e.target.value; draw(); });
    draw();
  };

  /* ---------- Interpolación: Newton y Lagrange de grado 1 y 2 ---------- */
  const ISETS = {
    sen: { l: 'TP 7, 1: puntos de sen x', xs: [0, 0.7, 1.5, 2.3], ys: [0, 0.64, 0.99, 0.74], f: Math.sin, fl: 'sen x', x0: 1 },
    a: { l: 'TP 7, 2a', xs: [1, 2, 3, 5, 7, 8], ys: [3, 5, 7, 11, 15, 17], x0: 4 },
    b: { l: 'TP 7, 2b', xs: [-1, 0, 3, 4, 5], ys: [2, 0, 10, 17, 26], x0: 2 },
    c: { l: 'TP 7, 2c', xs: [1, 2, 3, 5, 7, 8, 10, 12, 13, 14], ys: [4, 7, 10, 16, 22, 25, 31, 37, 40, 43], x0: 11 },
  };
  L.interp = (el, cfg) => {
    let sid = cfg.set || 'sen', g = cfg.deg || 1, how = cfg.how || 'newton';
    el.insertAdjacentHTML('beforeend', `<div class="lab-row">${select('d', 'Datos', Object.entries(ISETS).map(([k, o]) => [k, o.l]), sid)}</div>`);
    toggle(el, 'Grado', [['1', 'Lineal (2 puntos)'], ['2', 'Cuadrática (3 puntos)']], String(g), (k) => { g = +k; draw(); });
    toggle(el, 'Forma', [['newton', 'Diferencias divididas'], ['lagrange', 'Lagrange']], how, (k) => { how = k; draw(); });
    const box = document.createElement('div'); el.append(box);
    let v;
    const mkSlider = () => {
      const o = ISETS[sid];
      box.innerHTML = '';
      v = sliders(box, [{ id: 'x', label: 'Valor a estimar x', min: o.xs[0], max: o.xs.at(-1), step: 0.05, value: o.x0 }], draw);
    };
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const o = ISETS[sid], x = v.x;
      // Los g + 1 datos más cercanos a x, consecutivos, como en clase
      let j = o.xs.findIndex((q) => q > x); if (j === -1) j = o.xs.length - 1; if (j === 0) j = 1;
      let i0 = j - 1;
      if (g === 2) i0 = j - 1 > 0 && (j >= o.xs.length - 1 || x - o.xs[j - 1] < o.xs[j] - x) ? j - 2 : j - 1;
      i0 = Math.max(0, Math.min(o.xs.length - g - 1, i0));
      const xs = o.xs.slice(i0, i0 + g + 1), ys = o.ys.slice(i0, i0 + g + 1);
      const p = N.newtonPoly(xs, ys), fx = p(x);
      const xr = [o.xs[0] - 0.3, o.xs.at(-1) + 0.3], yr = range([...o.ys, fx]);
      const spec = { x: xr, y: yr, anim: first, ticks: { x: niceTicks(xr, 6), y: niceTicks(yr, 4) }, curves: [], points: [], guides: [{ x, y: fx, xt: num(x), yt: num(fx, 4) }] };
      if (o.f) spec.curves.push({ f: o.f, cls: 'c-tan', dash: true, label: o.fl });
      spec.curves.push({ f: p, cls: 'c-root', ghost: true }, { f: p, dom: [xs[0], xs.at(-1)], cls: 'c-root', label: g === 1 ? 'f₁(x)' : 'f₂(x)' });
      o.xs.forEach((q, k) => spec.points.push({ x: q, y: o.ys[k], r: k >= i0 && k <= i0 + g ? 5 : 3.5, cls: k >= i0 && k <= i0 + g ? 'c-f' : 'pl-old' }));
      spec.points.push({ x, y: fx, cls: 'c-root', label: `f(${num(x)}) ≈ ${num(fx, 4)}` , pos: 'nw' });
      host.innerHTML = plot(spec);
      first = false;
      const dd = N.divided(xs, ys);
      const detail = how === 'newton'
        ? `b₀ = f(${num(xs[0])}) = ${num(dd[0][0], 5)}; b₁ = f[x₁, x₀] = ${num(dd[1][0], 5)}${g === 2 ? `; b₂ = f[x₂, x₁, x₀] = ${num(dd[2][0], 5)}` : ''}.<br>f${g === 1 ? '₁' : '₂'}(${num(x)}) = ${num(dd[0][0], 4)} + ${num(dd[1][0], 4)}(${num(x)} − ${num(xs[0])})${g === 2 ? ` ${dd[2][0] < 0 ? '−' : '+'} ${num(Math.abs(dd[2][0]), 4)}(${num(x)} − ${num(xs[0])})(${num(x)} − ${num(xs[1])})` : ''} = <b>${num(fx, 5)}</b>`
        : `${xs.map((_, i) => `L${'₀₁₂'[i]}(${num(x)}) = ${num(N.lagrangeL(xs, i, x), 5)}`).join('; ')}.<br>f${g === 1 ? '₁' : '₂'}(${num(x)}) = ${xs.map((_, i) => `${num(N.lagrangeL(xs, i, x), 4)} · ${num(ys[i])}`).join(' + ')} = <b>${num(fx, 5)}</b>`;
      read.innerHTML = chips([['Puntos usados', xs.map((q) => num(q)).join(', '), 'acc'], ['Estimación', num(fx, 5), 'acc'],
        o.f && ['Valor verdadero', `${o.fl.replace('x', num(x))} = ${num(o.f(x), 5)}`], o.f && ['Error relativo', `${num(Math.abs((o.f(x) - fx) / o.f(x)) * 100, 2)} %`, 'warn']])
        + `<p class="lab-note">${detail}</p><p class="lab-note">Newton y Lagrange dan <b>el mismo polinomio</b>: por n + 1 puntos pasa uno solo de grado n. Cambia solo la forma de escribirlo.</p>`;
    };
    el.querySelector('[data-s="d"]').addEventListener('change', (e) => { sid = e.target.value; mkSlider(); draw(); });
    mkSlider();
    draw();
  };

  /* ---------- Regresión por mínimos cuadrados ---------- */
  const RSETS = {
    a: { l: 'TP 8, a', xs: [1, 2, 3, 5, 6], ys: [4.1, 5, 7.9, 10, 39] },
    b: { l: 'TP 8, b', xs: [1, 2, 3, 4, 5, 6, 7], ys: [0.5, 2.5, 2, 4, 3.5, 6, 5.5] },
    c: { l: 'TP 8, c', xs: [1, 3, 5, 7, 10, 12, 13, 16, 18, 20], ys: [3, 2, 6, 5, 8, 7, 10, 9, 12, 10] },
    d: { l: 'TP 8, d', xs: [1, 3, 5, 6, 8, 10, 12], ys: [1.5, 2.5, 3.5, 4, 5, 6, 7] },
    e: { l: 'TP 8, e', xs: [2, 3, 5, 7, 9, 10, 11], ys: [4, 9, 25, 49, 81, 100, 121] },
  };
  L.regression = (el, cfg) => {
    let sid = cfg.set || 'b', g = cfg.deg || 1, res = true;
    el.insertAdjacentHTML('beforeend', `<div class="lab-row">${select('d', 'Datos', Object.entries(RSETS).map(([k, o]) => [k, o.l]), sid)}<label class="seg"><input type="checkbox" checked data-r><span>Mostrar residuos</span></label></div>`);
    toggle(el, 'Modelo', [['1', 'Recta'], ['2', 'Parábola']], String(g), (k) => { g = +k; draw(); });
    const [host, read] = shell(el);
    let first = true;
    const draw = () => {
      const o = RSETS[sid], r = N.regression(o.xs, o.ys, g);
      const xr = [Math.min(0, o.xs[0] - 0.5), o.xs.at(-1) + 0.8], yr = range([...o.ys, 0, r.fit(xr[1])], 0.1);
      const spec = { x: xr, y: yr, anim: first, ticks: { x: niceTicks(xr, 6), y: niceTicks(yr, 4) },
        hlines: [{ y: r.ym, cls: 'c-tan pl-dash', label: 'ȳ' }], curves: [{ f: r.fit, cls: 'c-root', label: g === 1 ? 'y = a₀ + a₁x' : 'y = a₀ + a₁x + a₂x²' }],
        segs: res ? o.xs.map((x, i) => ({ from: [x, o.ys[i]], to: [x, r.fit(x)], cls: 'c-s' })) : [], points: o.xs.map((x, i) => ({ x, y: o.ys[i], cls: 'c-f', r: 4.5 })) };
      host.innerHTML = plot(spec);
      first = false;
      const coef = r.a.map((c, k) => `a${'₀₁₂'[k]} = ${num(c, 5)}`).join(' · ');
      read.innerHTML = chips([['Modelo', coef, 'acc'], ['S<sub>r</sub>', num(r.Sr, 4)], ['S<sub>t</sub>', num(r.St, 4)], ['s<sub>y</sub>', num(r.sy, 4)], ['s<sub>y/x</sub>', num(r.syx, 4), r.syx < r.sy ? 'ok' : 'warn'], ['r²', num(r.r2, 4), 'acc'], ['r', num(Math.sqrt(Math.max(0, r.r2)), 4)]])
        + `<p class="lab-note">Los segmentos rojos son los residuos: mínimos cuadrados elige la curva que hace mínima la suma de sus cuadrados, S<sub>r</sub>. Como s<sub>y/x</sub> ${r.syx < r.sy ? '&lt;' : '≥'} s<sub>y</sub>, el modelo ${r.syx < r.sy ? 'sí' : 'no'} mejora a usar solo el promedio. r² = ${num(r.r2 * 100, 1)} %: esa parte de la variabilidad de y la explica el modelo.${sid === 'a' ? ' El dato (6; 39) se aleja mucho del resto: un solo valor atípico tira la recta hacia arriba.' : ''}</p>`;
    };
    el.querySelector('[data-s="d"]').addEventListener('change', (e) => { sid = e.target.value; draw(); });
    el.querySelector('[data-r]').addEventListener('change', (e) => { res = e.target.checked; draw(); });
    draw();
  };

  /* ---------- Fourier: sumas parciales y coeficientes ---------- */
  const FFN = {
    sq: { l: 'Onda cuadrada: −1 en (−π, 0), 1 en (0, π)', f: (x) => (x < 0 ? -1 : 1), c: -PI, L: PI, br: [0] },
    saw: { l: 'f(x) = x en (−π, π)', f: (x) => x, c: -PI, L: PI, br: [] },
    par: { l: 'f(x) = x² en (−π, π)', f: (x) => x * x, c: -PI, L: PI, br: [] },
    half: { l: 'f(x) = 0 en (−π, 0), x en (0, π)', f: (x) => (x < 0 ? 0 : x), c: -PI, L: PI, br: [0] },
    t1a: { l: 'TP 9, 1a: 0 en (−5, 0), 3 en (0, 5)', f: (x) => (x < 0 ? 0 : 3), c: -5, L: 5, br: [0] },
    t1c: { l: 'TP 9, 1c: 8 en (0, 2), −8 en (2, 4)', f: (x) => (x < 2 ? 8 : -8), c: 0, L: 2, br: [2] },
    t1e: { l: 'TP 9, 1e: |x| en (−4, 4)', f: (x) => Math.abs(x), c: -4, L: 4, br: [0] },
    t1h: { l: 'TP 9, 1h: x en (0, 4), 8 − x en (4, 8)', f: (x) => (x < 4 ? x : 8 - x), c: 0, L: 4, br: [4] },
  };
  L.fourier = (el, cfg) => {
    let fid = cfg.fn || 'sq';
    el.insertAdjacentHTML('beforeend', `<div class="lab-row">${select('f', 'Función', Object.entries(FFN).map(([k, o]) => [k, o.l]), fid)}</div>`);
    const v = sliders(el, [{ id: 'n', label: 'Cantidad de armónicos N', min: 1, max: 40, step: 1, value: cfg.n || 3 }], () => draw());
    const [host, read] = shell(el);
    let first = true, cache = {};
    const draw = () => {
      const o = FFN[fid], P = 2 * o.L;
      const F = (cache[fid] ||= N.fourier(o.f, o.c, o.L, 40, o.br));
      const per = (x) => o.f(o.c + ((((x - o.c) % P) + P) % P));
      const xr = [o.c - o.L, o.c + 3 * o.L];
      const ys = Array.from({ length: 101 }, (_, k) => per(o.c + (P * k) / 100));
      const yr = range([...ys, ...ys.map((y) => y * 1.18)], 0.08);
      // Función original por tramos (sin unir los saltos)
      const pieces = [];
      for (let p0 = o.c - P; p0 < xr[1]; p0 += P) [o.c, ...o.br, o.c + P].forEach((a, i, arr) => { if (i < arr.length - 1) { const s = p0 - o.c + a, e = p0 - o.c + arr[i + 1]; pieces.push({ pts: Array.from({ length: 41 }, (_, k) => { const x = s + ((e - s) * k) / 40; return [x, o.f(Math.min(arr[i + 1] - 1e-9, Math.max(a + 1e-9, a + (x - s))))]; }), cls: 'c-tan', dash: true }); } });
      const spec = { x: xr, y: yr, anim: first, ticks: { x: niceTicks(xr, 6), y: niceTicks(yr, 4) }, curves: [...pieces, { f: (x) => F.sum(x, v.n), cls: 'c-root', label: `S${v.n}(x)`, n: 500 }] };
      const M = Math.min(12, 40), mx = Math.max(...F.a.slice(1, M + 1).map(Math.abs), ...F.b.slice(1, M + 1).map(Math.abs), 1e-6);
      const bars = { x: [0, M + 1], y: [-mx * 1.2, mx * 1.2], w: 440, h: 180, xl: 'n', yl: '', anim: first, ticks: { x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        segs: Array.from({ length: M }, (_, k) => k + 1).flatMap((n) => [{ from: [n - 0.15, 0], to: [n - 0.15, F.a[n]], cls: `c-f bar${n > v.n ? ' pl-faint' : ''}` }, { from: [n + 0.15, 0], to: [n + 0.15, F.b[n]], cls: `c-s bar${n > v.n ? ' pl-faint' : ''}` }]),
        texts: [{ x: M - 2.5, y: mx * 1.05, t: 'aₙ', cls: 'c-f' }, { x: M - 1, y: mx * 1.05, t: 'bₙ', cls: 'c-s' }] };
      host.innerHTML = plot(spec) + `<div class="pl-host-2">${plot(bars)}</div>`;
      first = false;
      const z = (q) => (Math.abs(q) < 1e-6 ? 0 : q);
      const allA0 = F.a.slice(1).every((q) => Math.abs(q) < 1e-6), allB0 = F.b.slice(1).every((q) => Math.abs(q) < 1e-6);
      read.innerHTML = chips([['a₀/2', num(z(F.a[0] / 2), 4), 'acc'], ...[1, 2, 3].map((n) => [`a${'₁₂₃'[n - 1]}, b${'₁₂₃'[n - 1]}`, `${num(z(F.a[n]), 4)} ; ${num(z(F.b[n]), 4)}`]),
        allB0 && ['Simetría', 'todos los bₙ = 0: función par, serie de cosenos', 'ok'], allA0 && ['Simetría', 'todos los aₙ = 0: función impar (más una constante), serie de senos', 'ok']])
        + `<p class="lab-note">Período 2L = ${num(P, 3)}. Con ${v.n} armónico${v.n > 1 ? 's' : ''} la suma parcial ya copia la forma; en los saltos converge al promedio de los límites laterales y deja un sobrepico de ~9 % que no desaparece al sumar más términos (fenómeno de Gibbs).</p>`;
    };
    el.querySelector('[data-s="f"]').addEventListener('change', (e) => { fid = e.target.value; draw(); });
    draw();
  };
})();
