// Autocomprobación de js/labs/num.js contra los resultados de clase y de Python. Uso: node tests/num.test.js
const assert = require('assert');
global.window = {};
require('../js/content/_helpers.js'); require('../js/labs/num.js');
const N = window.GUIDE.num, near = (a, b, t = 1e-4) => assert(Math.abs(a - b) < t, `${a} ≠ ${b}`);
const f2a = (x) => x ** 3 - x ** 2 - 2 * x + 1;
near(N.closed('bis', f2a, 0.4, 0.8, { tol: 1 }).at(-1).xr, 0.446875);          // 7 iteraciones hasta < 1 %
near(N.closed('rf', f2a, 0.4, 0.8, { n: 2 }).at(-1).xr, 0.44507);
near(N.fixed((x) => Math.exp(-x), 0.5, { tol: 1 }).at(-1).xn, 0.568438);
near(N.newton((x) => x - 4 * Math.sin(x), (x) => 1 - 4 * Math.cos(x), 2.47, { n: 2 }).at(-1).xn, 2.474577, 1e-5);
near(N.secant((x) => 4 * x * x - Math.exp(-x) - 1, 0.5, 1, { n: 4 }).at(-1).xn, 0.620062);
near(N.ode('E', (x, y) => y * x * x - 1, 0, 1, 0.5, 2).at(-1).y, -1.36328);   // clase TP 5, 1a
near(N.ode('H', (x, y) => y * x * x - y, 0, 1, 1, 2).at(-1).y, 1.25);          // clase TP 5, 2a
near(N.ode('P', (x, y) => y * Math.log(x + 1), 0, 1, 0.25, 2).at(-1).y, 3.60226);
near(N.exact((x, y) => 2 * x - 3 * y + 1, 1, 5, 2).at(-1).y, 1.6546565);
near(N.newtonPoly([0, 0.7, 1.5], [0, 0.64, 0.99])(1), 0.818922, 1e-5);        // clase TP 7, 1b
near(N.lagrangeL([0.7, 1.5], 0, 1) * 0.64 + N.lagrangeL([0.7, 1.5], 1, 1) * 0.99, 0.77125);
const r = N.regression([1, 2, 3, 4, 5, 6, 7], [0.5, 2.5, 2, 4, 3.5, 6, 5.5]);
near(r.a[0], 0.0714286); near(r.a[1], 0.8392857); near(r.r2, 0.868318, 1e-5);   // Chapra 17.1
near(N.regression([2, 3, 5, 7, 9, 10, 11], [4, 9, 25, 49, 81, 100, 121], 2).a[2], 1);
const F = N.fourier((x) => (x < 0 ? 0 : 3), -5, 5, 3, [0]);
near(F.a[0], 3, 1e-3); near(F.b[1], 6 / Math.PI, 1e-3); near(F.b[2], 0, 1e-3);   // TP 9, 1a
console.log('num.js: todo OK');
