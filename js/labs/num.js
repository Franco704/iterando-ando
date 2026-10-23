/* Métodos numéricos de la materia, compartidos por los laboratorios y por las soluciones de los ejercicios.
   Todo error es el error relativo aproximado de la cátedra: εa = |(x_nuevo − x_anterior) / x_nuevo| · 100. */
(() => {
  const { table, num } = window.GUIDE.h;
  const ea = (xn, xo) => (xo == null || xn === 0 ? null : Math.abs((xn - xo) / xn) * 100);
  const stop = (e, o) => o.tol != null && e != null && e < o.tol;

  // Bisección ('bis') y regla falsa ('rf'): el nuevo xr reemplaza al extremo cuya f tiene su mismo signo
  function closed(m, f, a, b, o = {}) {
    const rows = [], n = o.n || 40;
    let old = null;
    for (let i = 1; i <= n; i++) {
      const fa = f(a), fb = f(b);
      const xr = m === 'bis' ? (a + b) / 2 : b - (fb * (a - b)) / (fa - fb);
      const fr = f(xr), e = ea(xr, old);
      rows.push({ i, a, b, fa, fb, xr, fr, e });
      if (fr === 0 || stop(e, o)) break;
      if (fa * fr < 0) b = xr; else a = xr;
      old = xr;
    }
    return rows;
  }
  // Punto fijo: x_{i+1} = g(x_i)
  function fixed(g, x, o = {}) {
    const rows = [];
    for (let i = 1; i <= (o.n || 40); i++) {
      const xn = g(x), e = ea(xn, x);
      rows.push({ i, x, xn, e });
      if (!Number.isFinite(xn) || Math.abs(xn) > 1e6 || stop(e, o)) break;
      x = xn;
    }
    return rows;
  }
  // Newton Raphson: x_{i+1} = x_i − f(x_i) / f'(x_i)
  function newton(f, df, x, o = {}) {
    const rows = [];
    for (let i = 1; i <= (o.n || 40); i++) {
      const fx = f(x), d = df(x), xn = x - fx / d, e = ea(xn, x);
      rows.push({ i, x, fx, d, xn, e });
      if (!Number.isFinite(xn) || stop(e, o)) break;
      x = xn;
    }
    return rows;
  }
  // Secante: x_{i+1} = x_i − f(x_i)(x_{i−1} − x_i) / (f(x_{i−1}) − f(x_i)), reemplazo en secuencia estricta
  function secant(f, x0, x1, o = {}) {
    const rows = [];
    for (let i = 1; i <= (o.n || 40); i++) {
      const f0 = f(x0), f1 = f(x1), xn = x1 - (f1 * (x0 - x1)) / (f0 - f1), e = ea(xn, x1);
      rows.push({ i, x0, x1, f0, f1, xn, e });
      if (!Number.isFinite(xn) || stop(e, o)) break;
      x0 = x1; x1 = xn;
    }
    return rows;
  }

  // EDO de primer orden: 'E' Euler, 'H' Heun, 'P' polígono mejorado, 'RK3', 'RK4'. Devuelve [{ x, y, k }] (k = cálculos intermedios)
  function ode(m, f, x0, y0, h, xe) {
    let x = x0, y = y0;
    const out = [{ x, y }];
    while (x < xe - 1e-9) {
      let k;
      if (m === 'E') { k = { f: f(x, y) }; y += k.f * h; }
      else if (m === 'H') { const k1 = f(x, y), p = y + k1 * h, k2 = f(x + h, p); k = { k1, p, k2 }; y += ((k1 + k2) / 2) * h; }
      else if (m === 'P') { const k1 = f(x, y), ym = y + (k1 * h) / 2, km = f(x + h / 2, ym); k = { k1, ym, km }; y += km * h; }
      else if (m === 'RK3') { const k1 = f(x, y), k2 = f(x + h / 2, y + (h * k1) / 2), k3 = f(x + h, y - h * k1 + 2 * h * k2); k = { k1, k2, k3 }; y += ((k1 + 4 * k2 + k3) / 6) * h; }
      else { const k1 = f(x, y), k2 = f(x + h / 2, y + (h * k1) / 2), k3 = f(x + h / 2, y + (h * k2) / 2), k4 = f(x + h, y + h * k3); k = { k1, k2, k3, k4 }; y += ((k1 + 2 * k2 + 2 * k3 + k4) / 6) * h; }
      x = Math.round((x + h) * 1e9) / 1e9;
      out.push({ x, y, k });
    }
    return out;
  }
  // "Valor verdadero" de referencia: RK4 con paso muy chico
  const exact = (f, x0, y0, xe) => ode('RK4', f, x0, y0, (xe - x0) / 2000, xe);

  // Diferencias divididas: dd[0] = f(x_i), dd[1] = f[x_{i+1}, x_i], ...
  function divided(xs, ys) {
    const dd = [ys.slice()];
    for (let k = 1; k < xs.length; k++) dd.push(dd[k - 1].slice(1).map((v, i) => (v - dd[k - 1][i]) / (xs[i + k] - xs[i])));
    return dd;
  }
  // Polinomio de Newton con los coeficientes b_k = dd[k][0]
  const newtonPoly = (xs, ys) => {
    const b = divided(xs, ys).map((c) => c[0]);
    return (x) => b.reduce((acc, bk, k) => acc + bk * xs.slice(0, k).reduce((p, xi) => p * (x - xi), 1), 0);
  };
  const lagrangeL = (xs, i, x) => xs.reduce((p, xj, j) => (j === i ? p : (p * (x - xj)) / (xs[i] - xj)), 1);

  // Mínimos cuadrados de grado 1 o 2 por ecuaciones normales
  function regression(xs, ys, deg = 1) {
    const n = xs.length, S = (fn) => xs.reduce((a, x, i) => a + fn(x, ys[i]), 0);
    let a;
    if (deg === 1) {
      const sx = S((x) => x), sy = S((x, y) => y), sxy = S((x, y) => x * y), sx2 = S((x) => x * x);
      const a1 = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
      a = [sy / n - (a1 * sx) / n, a1];
    } else {
      const M = [0, 1, 2].map((r) => [0, 1, 2].map((c) => S((x) => x ** (r + c))));
      const v = [0, 1, 2].map((r) => S((x, y) => x ** r * y));
      a = solve3(M, v);
    }
    const fit = (x) => a.reduce((acc, c, k) => acc + c * x ** k, 0);
    const ym = ys.reduce((p, y) => p + y, 0) / n;
    const Sr = S((x, y) => (y - fit(x)) ** 2), St = S((x, y) => (y - ym) ** 2);
    return { a, fit, n, ym, Sr, St, sy: Math.sqrt(St / (n - 1)), syx: Math.sqrt(Sr / (n - deg - 1)), r2: (St - Sr) / St };
  }
  // Cramer para 3×3
  function solve3(M, v) {
    const det = (A) => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    const D = det(M);
    return [0, 1, 2].map((c) => det(M.map((row, r) => row.map((val, k) => (k === c ? v[r] : val)))) / D);
  }

  // Coeficientes de Fourier por Simpson sobre un período [c, c + 2L]; f puede tener saltos (se integra por tramos)
  function fourier(f, c, L, N, breaks = []) {
    const cuts = [c, ...breaks.filter((b) => b > c && b < c + 2 * L), c + 2 * L];
    const integ = (g) => {
      let s = 0;
      for (let j = 0; j < cuts.length - 1; j++) {
        const a = cuts[j], b = cuts[j + 1], m = 200, h = (b - a) / m;
        const at = (x) => g(Math.min(b - 1e-9, Math.max(a + 1e-9, x)));
        let acc = at(a) + at(b);
        for (let k = 1; k < m; k++) acc += (k % 2 ? 4 : 2) * at(a + k * h);
        s += (acc * h) / 3;
      }
      return s;
    };
    const a = [], b = [0];
    for (let n = 0; n <= N; n++) {
      a.push(integ((x) => f(x) * Math.cos((n * Math.PI * x) / L)) / L);
      if (n) b.push(integ((x) => f(x) * Math.sin((n * Math.PI * x) / L)) / L);
    }
    const sum = (x, M = N) => a[0] / 2 + Array.from({ length: M }, (_, k) => k + 1).reduce((s, n) => s + a[n] * Math.cos((n * Math.PI * x) / L) + b[n] * Math.sin((n * Math.PI * x) / L), 0);
    return { a, b, sum };
  }

  // ---------- Tablas para las soluciones (formato argentino, como en clase) ----------
  const d = (v, k = 5) => (v == null ? '—' : num(v, k));
  const pct = (e) => (e == null ? '—' : `${num(e, e < 0.01 ? 4 : 2)} %`);
  const T = {
    closed: (m, f, a, b, o) => table(['i', 'x<sub>i</sub>', 'x<sub>f</sub>', 'x<sub>r</sub>', 'f(x<sub>r</sub>)', 'f(x<sub>i</sub>)·f(x<sub>r</sub>)', 'ε<sub>a</sub>'],
      closed(m, f, a, b, o).map((r) => [r.i, d(r.a), d(r.b), `<b>${d(r.xr, 6)}</b>`, d(r.fr), r.fa * r.fr < 0 ? '&lt; 0 → x<sub>f</sub> = x<sub>r</sub>' : '&gt; 0 → x<sub>i</sub> = x<sub>r</sub>', pct(r.e)])),
    fixed: (g, x, o) => table(['i', 'x<sub>i</sub>', 'x<sub>i+1</sub> = g(x<sub>i</sub>)', 'ε<sub>a</sub>'], fixed(g, x, o).map((r) => [r.i, d(r.x, 6), `<b>${d(r.xn, 6)}</b>`, pct(r.e)])),
    newton: (f, df, x, o) => table(['i', 'x<sub>i</sub>', 'f(x<sub>i</sub>)', 'f′(x<sub>i</sub>)', 'x<sub>i+1</sub>', 'ε<sub>a</sub>'], newton(f, df, x, o).map((r) => [r.i, d(r.x, 6), d(r.fx), d(r.d), `<b>${d(r.xn, 6)}</b>`, pct(r.e)])),
    secant: (f, x0, x1, o) => table(['i', 'x<sub>i−1</sub>', 'x<sub>i</sub>', 'f(x<sub>i−1</sub>)', 'f(x<sub>i</sub>)', 'x<sub>i+1</sub>', 'ε<sub>a</sub>'], secant(f, x0, x1, o).map((r) => [r.i, d(r.x0), d(r.x1), d(r.f0), d(r.f1), `<b>${d(r.xn, 6)}</b>`, pct(r.e)])),
    ode: (ms, f, x0, y0, h, xe) => {
      const ref = exact(f, x0, y0, xe);
      const runs = ms.map((m) => ode(m, f, x0, y0, h, xe));
      return table(['x', ...ms.map((m) => NAMES[m]), 'Referencia'], runs[0].map((p, i) => [num(p.x, 3), ...runs.map((r) => d(r[i].y)), d(ref.find((q) => Math.abs(q.x - p.x) < 1e-6)?.y)]));
    },
  };
  const NAMES = { E: 'Euler', H: 'Heun', P: 'Polígono mejorado', RK3: 'Runge Kutta 3', RK4: 'Runge Kutta 4' };

  window.GUIDE.num = { ea, closed, fixed, newton, secant, ode, exact, divided, newtonPoly, lagrangeL, regression, fourier, T, NAMES, d, pct };
})();
