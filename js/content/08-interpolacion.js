/* Unidad 6 (primera parte): interpolación. Apunte "Interpolación" y clase. TP 7.
   Los valores se calculan con num.js (verificado contra la clase: f₂(1) = 0,818922). */
(() => {
  const { LESSONS, h, num: N } = window.GUIDE;
  const { note, def, table, eq, frac, lab, chart, num } = h;
  const XS = [0, 0.7, 1.5, 2.3], YS = [0, 0.64, 0.99, 0.74];
  // Tabla de diferencias divididas por columnas
  const ddTable = (xs, ys) => {
    const dd = N.divided(xs, ys);
    return table(['x<sub>i</sub>', 'f(x<sub>i</sub>)', 'Primera f[ , ]', 'Segunda f[ , , ]'], xs.map((x, i) => [num(x), num(ys[i], 4), dd[1]?.[i] != null ? num(dd[1][i], 5) : '', dd[2]?.[i] != null ? num(dd[2][i], 5) : '']));
  };
  // Estimación con los puntos dados y error contra el valor verdadero si se conoce
  const est = (xs, ys, x, f) => { const v = N.newtonPoly(xs, ys)(x); return f ? `${num(v, 5)} (verdadero ${num(f(x), 5)}, error ${num(Math.abs((f(x) - v) / f(x)) * 100, 2)} %)` : num(v, 5); };
  const T2 = [
    ['a', [1, 2, 3, 5, 7, 8], [3, 5, 7, 11, 15, 17], [[4, [3, 5], [2, 3, 5]], [7.5, [7, 8], [5, 7, 8]]]],
    ['b', [-1, 0, 3, 4, 5], [2, 0, 10, 17, 26], [[2, [0, 3], [0, 3, 4]], [5.5, [4, 5], [3, 4, 5]]]],
    ['c', [1, 2, 3, 5, 7, 8, 10, 12, 13, 14], [4, 7, 10, 16, 22, 25, 31, 37, 40, 43], [[11, [10, 12], [10, 12, 13]], [6, [5, 7], [5, 7, 8]]]],
  ];
  const pick = (xs, ys, sel) => [sel, sel.map((x) => ys[xs.indexOf(x)])];

  LESSONS.push(
    {
      id: 'interp-newton',
      module: 'u6i',
      title: 'Interpolación con diferencias divididas de Newton',
      keywords: 'interpolación polinomio único diferencias divididas newton lineal cuadrática coeficientes b error',
      tldr: 'Interpolar es estimar valores <mark>entre</mark> datos conocidos con el único polinomio de grado n que pasa por n + 1 puntos. Newton lo escribe como f<sub>n</sub>(x) = b₀ + b₁(x − x₀) + b₂(x − x₀)(x − x₁) + …, donde cada b es una diferencia dividida.',
      goals: ['Enunciar la unicidad del polinomio de interpolación.', 'Calcular diferencias divididas y los coeficientes b.', 'Resolver el TP 7, ejercicios 1 y 2.'],
      body: `
        ${def('Polinomio de interpolación', 'Para n + 1 puntos existe uno y sólo un polinomio de n-ésimo orden que pasa a través de todos los puntos. El polinomio de interpolación consiste en determinar ese único polinomio, que proporciona una fórmula para calcular los valores intermedios.', 'Apunte de la cátedra, Interpolación.')}
        <p>Hay una sola recta por dos puntos y una sola parábola por tres, pero muchas formas de escribirlas. La materia ve dos: <strong>Newton</strong> y <strong>Lagrange</strong>.</p>
        <h2>Interpolación lineal</h2>
        <p>Por triángulos semejantes entre la recta y los puntos (x₀, f(x₀)), (x₁, f(x₁)):</p>
        ${eq(`f₁(x) = f(x₀) + ${frac('f(x₁) − f(x₀)', 'x₁ − x₀')} (x − x₀)`, 'Interpolación lineal')}
        <p>El cociente es la pendiente de la recta y, a la vez, una aproximación de la primera derivada: la <strong>primera diferencia dividida</strong> f[x₁, x₀]. Cuanto más chico el intervalo, mejor la aproximación.</p>
        <h2>Interpolación cuadrática</h2>
        ${eq('f₂(x) = b₀ + b₁(x − x₀) + b₂(x − x₀)(x − x₁)', 'Parábola de Newton')}
        ${eq(`b₀ = f(x₀) &nbsp;&nbsp; b₁ = f[x₁, x₀] = ${frac('f(x₁) − f(x₀)', 'x₁ − x₀')} &nbsp;&nbsp; b₂ = f[x₂, x₁, x₀] = ${frac('f[x₂, x₁] − f[x₁, x₀]', 'x₂ − x₀')}`)}
        <p>Los dos primeros términos son la recta; el término b₂(x − x₀)(x − x₁) agrega la <strong>curvatura</strong>. b₂ aproxima la segunda derivada. Agregar un punto no obliga a recalcular nada: solo se suma un término. Es la gran ventaja de la forma de Newton.</p>
        ${lab(0)}
        <h2>Ejemplo de clase: TP 7, 1 (datos de sen x)</h2>
        ${ddTable(XS, YS)}
        <p><b>f(1) lineal</b> con 0,7 y 1,5: 0,64 + (0,99 − 0,64)/0,8 · 0,3 = ${est([0.7, 1.5], [0.64, 0.99], 1, Math.sin)}.</p>
        <p><b>f(1) cuadrática</b> con 0; 0,7; 1,5: b₀ = 0, b₁ = 0,91429, b₂ = −0,31786: ${est([0, 0.7, 1.5], [0, 0.64, 0.99], 1, Math.sin)}.</p>
        ${chart({ x: [-0.1, 2.6], y: [-0.1, 1.15], ticks: { x: [0.5, 1, 1.5, 2, 2.5], y: [0.5, 1] }, curves: [{ f: Math.sin, cls: 'c-tan', dash: true, label: 'sen x' }, { f: N.newtonPoly([0, 0.7, 1.5], [0, 0.64, 0.99]), cls: 'c-root', label: 'f₂(x)', dom: [0, 2.3] }, { f: N.newtonPoly([0.7, 1.5], [0.64, 0.99]), cls: 'c-g', label: 'f₁', dom: [0.5, 1.7] }],
          points: XS.map((x, i) => ({ x, y: YS[i], cls: 'c-f' })) }, 'La parábola (naranja) copia la curvatura de sen x mucho mejor que la recta (violeta).')}
        <h2>Error de la interpolación</h2>
        ${eq('R<sub>n</sub> = f<sup>(n+1)</sup>(ξ)/(n + 1)! · (x − x₀)(x − x₁)…(x − x<sub>n</sub>)', 'Análogo al resto de Taylor')}
        <p>Como normalmente f no se conoce, se usa una diferencia dividida en su lugar. Si se dispone de un dato más, x<sub>n+1</sub>:</p>
        ${eq('R<sub>n</sub> ≅ f[x<sub>n+1</sub>, x<sub>n</sub>, …, x₀] (x − x₀)(x − x₁)…(x − x<sub>n</sub>)', 'Error estimado')}
        ${note('Para interpolar se eligen los puntos <strong>más cercanos</strong> al valor buscado y que lo rodeen. Estimar fuera del rango de los datos (extrapolar) es mucho menos confiable.', 'exam')}`,
      labs: [{ type: 'interp', set: 'sen', deg: 1, how: 'newton', title: 'Recta o parábola de Newton', intro: 'Mové el valor a estimar. Los puntos azules grandes son los que se usan. Pasá a cuadrática y compará el error contra sen x.' }],
      exercises: [
        { title: 'Valores de sen x', official: '7.1', level: 2, prompt: '<p>Con los puntos x: 0; 0,7; 1,5; 2,3 y y: 0; 0,64; 0,99; 0,74, calcular f(1) y f(2) con diferencias divididas de Newton, lineal y cuadrática. Comparar con sen x.</p>',
          solution: { explain: table(['', 'Puntos', 'Estimación'], [
            ['f(1) lineal', '0,7; 1,5', est([0.7, 1.5], [0.64, 0.99], 1, Math.sin)], ['f(1) cuadrática', '0; 0,7; 1,5', est([0, 0.7, 1.5], [0, 0.64, 0.99], 1, Math.sin)],
            ['f(2) lineal', '1,5; 2,3', est([1.5, 2.3], [0.99, 0.74], 2, Math.sin)], ['f(2) cuadrática', '0,7; 1,5; 2,3', est([0.7, 1.5, 2.3], [0.64, 0.99, 0.74], 2, Math.sin)],
          ]) + '<p>Todos coinciden con la clase. Para f(2) cuadrática: b₀ = 0,64, b₁ = 0,4375, b₂ = −0,46875.</p>' } },
        { title: 'Recta y parábola para tres tablas', official: '7.2', level: 2, prompt: '<p>a) x: 1, 2, 3, 5, 7, 8; f: 3, 5, 7, 11, 15, 17. Calcular f(4) y f(7,5). b) x: −1, 0, 3, 4, 5; f: 2, 0, 10, 17, 26. Calcular f(2) y f(5,5). c) x: 1, 2, 3, 5, 7, 8, 10, 12, 13, 14; f: 4, 7, 10, 16, 22, 25, 31, 37, 40, 43. Calcular f(11) y f(6).</p>', hints: ['Mirá las primeras diferencias divididas de a) y c): son todas iguales.'],
          solution: { explain: T2.map(([k, xs, ys, cases]) => `<h4>${k})</h4>${table(['x', 'Lineal (puntos)', 'Cuadrática (puntos)'], cases.map(([x, l, q]) => { const [lx, ly] = pick(xs, ys, l), [qx, qy] = pick(xs, ys, q); return [num(x), `${est(lx, ly, x)} (${l.map((v) => num(v)).join('; ')})`, `${est(qx, qy, x)} (${q.map((v) => num(v)).join('; ')})`]; }))}`).join('')
            + '<p>En a) y c) los datos están sobre una recta (f = 2x + 1 y f = 3x + 1): la segunda diferencia dividida da 0 y la parábola coincide con la recta. En b) f(5,5) es una <b>extrapolación</b> (5,5 está fuera de los datos); los puntos 3, 4, 5 siguen x² + 1, por eso la cuadrática da 31,25.</p>' } },
      ],
      quiz: [
        { q: '¿Cuántos polinomios de grado 2 pasan por 3 puntos (con x distintos)?', o: ['ninguno', 'uno', 'dos', 'infinitos'], a: 1, e: 'Para n + 1 puntos hay uno y solo uno de grado n.' },
        { q: 'b₁ en la forma de Newton es…', o: ['f(x₀)', 'la primera diferencia dividida f[x₁, x₀]', 'la segunda diferencia dividida', 'la derivada exacta'], a: 1, e: 'La pendiente de la recta entre x₀ y x₁.' },
        { q: 'El término b₂(x − x₀)(x − x₁)…', o: ['es la recta', 'introduce la curvatura', 'es el error', 'siempre vale 0'], a: 1, e: 'Convierte la recta en parábola.' },
        { q: 'Si la segunda diferencia dividida es 0…', o: ['hay un error', 'los tres puntos están alineados', 'no se puede interpolar', 'la parábola es vertical'], a: 1, e: 'b₂ = 0 y queda la recta.' },
        { q: 'Una ventaja de la forma de Newton es que…', o: ['no usa los datos', 'agregar un punto solo suma un término', 'no tiene error', 'sirve para extrapolar siempre'], a: 1, e: 'Los b anteriores no cambian.' },
      ],
      sources: [{ title: 'Apunte y clase: Interpolación', ref: 'Cátedra de Matemática Superior', points: ['Polinomio único, diferencias divididas, lineal y cuadrática.', 'Error de truncamiento y su estimación con un dato adicional.', 'TP 7, 1 resuelto en clase.'] }],
    },

    {
      id: 'interp-lagrange',
      module: 'u6i',
      title: 'Polinomios de interpolación de Lagrange',
      keywords: 'lagrange polinomio L_i producto interpolación lineal cuadrática comparación newton',
      tldr: 'Lagrange es una <mark>reformulación</mark> del polinomio de Newton que evita las diferencias divididas: f<sub>n</sub>(x) = Σ L<sub>i</sub>(x) f(x<sub>i</sub>), donde cada L<sub>i</sub> vale 1 en x<sub>i</sub> y 0 en los demás datos. Da exactamente el mismo polinomio.',
      goals: ['Escribir los L<sub>i</sub> lineales y cuadráticos.', 'Resolver el TP 7, ejercicio 3.', 'Comparar Newton y Lagrange.'],
      body: `
        ${eq(`f<sub>n</sub>(x) = Σ<sub>i=0</sub><sup>n</sup> L<sub>i</sub>(x) f(x<sub>i</sub>) &nbsp;&nbsp; L<sub>i</sub>(x) = Π<sub>j≠i</sub> ${frac('x − x<sub>j</sub>', 'x<sub>i</sub> − x<sub>j</sub>')}`, 'Forma general')}
        <h2>Lineal</h2>
        ${eq(`f₁(x) = ${frac('x − x₁', 'x₀ − x₁')} f(x₀) + ${frac('x − x₀', 'x₁ − x₀')} f(x₁)`)}
        <h2>Cuadrática</h2>
        ${eq(`f₂(x) = ${frac('(x − x₁)(x − x₂)', '(x₀ − x₁)(x₀ − x₂)')} f(x₀) + ${frac('(x − x₀)(x − x₂)', '(x₁ − x₀)(x₁ − x₂)')} f(x₁) + ${frac('(x − x₀)(x − x₁)', '(x₂ − x₀)(x₂ − x₁)')} f(x₂)`)}
        <p>Cada L<sub>i</sub> es un polinomio que vale <strong>1 en su propio dato y 0 en los otros</strong>. Por eso la suma pasa exactamente por todos los puntos. Un buen control: los L<sub>i</sub>(x) siempre suman 1.</p>
        <p><b>Ejemplo de clase</b> (TP 7, f(1) lineal con 0,7 y 1,5): L₀ = (1 − 1,5)/(0,7 − 1,5) = 0,625; L₁ = (1 − 0,7)/(1,5 − 0,7) = 0,375. f₁(1) = 0,625·0,64 + 0,375·0,99 = 0,77125. Igual que con Newton.</p>
        ${lab(0)}
        ${table(['', 'Newton', 'Lagrange'], [['Cálculo previo', 'Tabla de diferencias divididas', 'Ninguno'], ['Agregar un punto', 'Se suma un término', 'Hay que rehacer todos los L<sub>i</sub>'], ['Estimar el error', 'Natural, con una diferencia dividida más', 'R<sub>n</sub> = f[x, x<sub>n</sub>, …, x₀] Π(x − x<sub>i</sub>)'], ['Resultado', 'El mismo polinomio', 'El mismo polinomio']])}
        ${note('Si en el parcial te piden “por Newton y por Lagrange”, el valor tiene que dar igual. Si no da igual, hay un error de cuentas.', 'exam')}`,
      labs: [{ type: 'interp', set: 'b', deg: 2, how: 'lagrange', title: 'Los pesos de Lagrange', intro: 'Cada dato pesa L_i(x). Mové x y mirá cómo se reparten los pesos; cerca de un dato, su peso se acerca a 1.' }],
      exercises: [
        { title: 'Lagrange para los datos del TP 7', official: '7.3', level: 2, prompt: '<p>Usando Lagrange, encontrar los polinomios de primer y segundo grado para los datos de los ejercicios 1 y 2.</p>',
          solution: { explain: `<p>Con los mismos puntos elegidos, los valores coinciden con los del ejercicio anterior (es el mismo polinomio). Por ejemplo, f(1) cuadrática con 0; 0,7; 1,5:</p>
            <p>L₀ = (1 − 0,7)(1 − 1,5)/((0 − 0,7)(0 − 1,5)) = ${num(N.lagrangeL([0, 0.7, 1.5], 0, 1), 5)}; L₁ = (1 − 0)(1 − 1,5)/((0,7)(0,7 − 1,5)) = ${num(N.lagrangeL([0, 0.7, 1.5], 1, 1), 5)}; L₂ = (1)(1 − 0,7)/((1,5)(0,8)) = ${num(N.lagrangeL([0, 0.7, 1.5], 2, 1), 5)}.</p>
            <p>f₂(1) = ${num(N.lagrangeL([0, 0.7, 1.5], 0, 1), 4)}·0 + ${num(N.lagrangeL([0, 0.7, 1.5], 1, 1), 4)}·0,64 + ${num(N.lagrangeL([0, 0.7, 1.5], 2, 1), 4)}·0,99 = <b>${num(N.newtonPoly([0, 0.7, 1.5], [0, 0.64, 0.99])(1), 6)}</b>. Los L suman 1 ✓.</p>
            <p>Para el 2b, f(2) con 0, 3, 4: L₀ = (2 − 3)(2 − 4)/((0 − 3)(0 − 4)) = 1/6; L₁ = (2)(2 − 4)/((3)(3 − 4)) = 4/3; L₂ = (2)(2 − 3)/((4)(4 − 3)) = −1/2. f₂(2) = 0 + (4/3)·10 − (1/2)·17 = <b>4,8333</b>.</p>` } },
      ],
      quiz: [
        { q: 'L₀(x₀) vale…', o: ['0', '1', 'f(x₀)', 'x₀'], a: 1, e: 'Cada L_i vale 1 en su dato y 0 en los demás.' },
        { q: 'Newton y Lagrange, con los mismos puntos, dan…', o: ['polinomios distintos', 'el mismo polinomio', 'distinto grado', 'Lagrange siempre es más exacto'], a: 1, e: 'El polinomio de interpolación es único.' },
        { q: 'La ventaja de Lagrange es que…', o: ['no necesita diferencias divididas', 'es más fácil agregar puntos', 'no tiene error', 'sirve para regresión'], a: 0, e: 'Es una reformulación que las evita.' },
        { q: 'Para interpolación lineal, L₁(x) = …', o: ['(x − x₁)/(x₀ − x₁)', '(x − x₀)/(x₁ − x₀)', 'x₁ − x₀', '1'], a: 1, e: 'Vale 1 en x₁ y 0 en x₀.' },
      ],
      sources: [{ title: 'Apunte y clase: Polinomios de Lagrange', ref: 'Cátedra de Matemática Superior', points: ['Forma general, lineal y cuadrática.', 'TP 7, 3 (f(1) lineal y cuadrática) en clase.'] }],
    },
  );
})();
