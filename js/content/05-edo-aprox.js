/* Unidad 4: Métodos aproximados para EDO (métodos de un paso). Apunte "Resolución de EDO por Métodos Aproximados" y clase. TP 5.
   Las tablas de las soluciones se calculan con num.js (verificado contra la clase en tests/num.test.js). */
(() => {
  const { LESSONS, h, num: N } = window.GUIDE;
  const { note, def, table, eq, frac, lab, flow, chart } = h;
  const fa = (x, y) => y * x * x - 1, fb = (x, y) => y * Math.log(x + 1), f2a = (x, y) => y * x * x - y, f3 = (x, y) => 2 * x - 3 * y + 1;
  const tabs = (ms, f, x0, y0, xe, hs) => hs.map((hh) => `<p><b>h = ${h.num(hh)}</b></p>${N.T.ode(ms, f, x0, y0, hh, xe)}`).join('');
  // Pendientes de Euler para el gráfico de la lección: dy/dx = y x² − y, h = 0,5
  const eu = N.ode('E', f2a, 0, 1, 0.5, 2), ref = N.exact(f2a, 0, 1, 2);

  LESSONS.push(
    {
      id: 'euler',
      module: 'u4',
      title: 'Método de Euler',
      keywords: 'euler método de un paso tangente paso h error truncamiento redondeo taylor orden',
      tldr: 'Euler avanza por la <mark>recta tangente</mark>: y<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>) h. Es la serie de Taylor cortada en el término de la primera derivada, por eso el error que comete en cada paso es del orden de h².',
      goals: ['Deducir Euler geométricamente y con Taylor.', 'Distinguir error de redondeo y de truncamiento.', 'Resolver el TP 5, ejercicio 1.'],
      body: `
        <p>Se quiere resolver dy/dx = f(x, y) con una condición inicial y(x₀) = y₀, pero sin encontrar la fórmula de y: solo sus valores en x₀, x₀ + h, x₀ + 2h… Son <strong>métodos de un paso</strong>: cada valor nuevo se calcula con el anterior.</p>
        ${eq('y<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>) · h', 'Método de Euler')}
        <p><strong>Geometría</strong>: en (x<sub>i</sub>, y<sub>i</sub>) la pendiente de la solución es f(x<sub>i</sub>, y<sub>i</sub>). Se prolonga la recta tangente una distancia h y donde corta a x<sub>i+1</sub> está el <strong>valor predicho</strong>. Como la curva no es recta, hay una diferencia con el <strong>valor verdadero</strong>.</p>
        ${chart({ x: [0, 2], y: [0, 2.1], ticks: { x: [0.5, 1, 1.5, 2], y: [0.5, 1, 1.5, 2] }, curves: [{ pts: ref.map((p) => [p.x, p.y]), cls: 'c-f', label: 'valor verdadero' }, { pts: eu.map((p) => [p.x, p.y]), cls: 'c-s', label: 'Euler' }], points: eu.map((p) => ({ x: p.x, y: p.y, cls: 'c-s', r: 4 })) }, 'TP 5, 2a con h = 0,5: Euler sigue tangentes y se va separando de la solución verdadera.')}
        <h2>Los dos errores</h2>
        ${table(['Error', 'Origen'], [['De redondeo', 'El número finito de cifras con que se calcula'], ['De truncamiento', 'La naturaleza del método: se aproxima la curva con una recta']])}
        <p>Desarrollando y(x<sub>i+1</sub>) en serie de Taylor alrededor de x<sub>i</sub>:</p>
        ${eq(`y<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>) h + ${frac('f′(x<sub>i</sub>, y<sub>i</sub>)', '2!')} h² + … + R<sub>n</sub>`)}
        <p>Euler se queda con los dos primeros términos. Como h es chico, los términos descartados decrecen con el orden y alcanza con el primero para estimar el error:</p>
        ${eq(`ε<sub>a</sub> = ${frac('f′(x<sub>i</sub>, y<sub>i</sub>)', '2!')} h² &nbsp; ⟹ &nbsp; ε<sub>a</sub> = O(h²)`, 'Error de truncamiento local')}
        ${note('Achicar h a la mitad divide el error de cada paso por 4. Pero como hacen falta el doble de pasos, el error acumulado al final solo se divide por 2 (Euler es un método de primer orden global). En el TP se ve comparando h = 1, 0,5 y 0,25.', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'ode', problem: 'a1', h: 0.5, methods: ['E'], title: 'Euler contra la referencia', intro: 'Cambiá el paso h y la ecuación. Euler se va por la tangente: cuanto más curva la solución, más se aleja.' }],
      exercises: [
        { title: 'Euler con tres pasos distintos', official: '5.1', level: 2, prompt: '<p>Resolver con Euler desde x = 0 hasta x = 2, con y(0) = 1, para h = 1; 0,5 y 0,25: a) dy/dx = y x² − 1; b) dy/dx = y ln(x + 1).</p>', hints: ['Con h = 0,5 en a): y(0,5) = 1 + f(0, 1)·0,5 = 1 + (−1)(0,5) = 0,5.'],
          solution: { explain: `<p>Primer paso de a) con h = 0,5 (como en clase): f(0; 1) = 1·0 − 1 = −1, y(0,5) = 1 − 0,5 = 0,5. Luego f(0,5; 0,5) = 0,5·0,25 − 1 = −0,875, y(1) = 0,5 − 0,4375 = 0,0625. Y así hasta y(2) = −1,36328.</p>
            <p>La columna “Referencia” es Runge Kutta 4 con paso muy chico: hace de valor verdadero para ver cómo mejora Euler al achicar h.</p>
            <h4>a) dy/dx = y x² − 1</h4>${tabs(['E'], fa, 0, 1, 2, [1, 0.5, 0.25])}<h4>b) dy/dx = y ln(x + 1)</h4>${tabs(['E'], fb, 0, 1, 2, [1, 0.5, 0.25])}` } },
      ],
      quiz: [
        { q: 'La fórmula de Euler es…', o: ['y_{i+1} = y_i + f(x_{i+1}, y_{i+1}) h', 'y_{i+1} = y_i + f(x_i, y_i) h', 'y_{i+1} = y_i + h', 'y_{i+1} = f(x_i, y_i)'], a: 1, e: 'Usa la pendiente al principio del intervalo.' },
        { q: 'Euler corresponde a la serie de Taylor truncada…', o: ['en el primer término', 'después del término de la primera derivada', 'en el término de orden 4', 'no tiene relación'], a: 1, e: 'y_i + y′_i h; el primer término descartado da el error.' },
        { q: 'El error de truncamiento local de Euler es…', o: ['O(h)', 'O(h²)', 'O(h³)', 'O(h⁴)'], a: 1, e: 'ε = f′/2! h².' },
        { q: 'El error por usar un número finito de cifras se llama…', o: ['de truncamiento', 'de redondeo', 'relativo', 'de interpolación'], a: 1, e: 'El de truncamiento viene del método.' },
        { q: 'Si y′ = −3y + … y h = 0,5, Euler puede oscilar porque…', o: ['h es demasiado grande para lo rápido que cambia la solución', 'falta una condición inicial', 'la ecuación es no lineal', 'Euler no sirve para lineales'], a: 0, e: 'Con 1 − 3h = −0,5 la aproximación cambia de signo en cada paso (TP 5, 3).' },
      ],
      sources: [{ title: 'Apunte: Resolución de EDO por métodos aproximados', ref: 'Cátedra de Matemática Superior', points: ['Método de Euler, errores de redondeo y truncamiento.', 'TP 5, 1a con h = 0,5 resuelto en clase.'] }],
    },

    {
      id: 'heun-poligono',
      module: 'u4',
      title: 'Heun y polígono mejorado',
      keywords: 'heun predictor corrector trapecio polígono mejorado euler modificado punto medio pendiente promedio',
      tldr: 'La falla de Euler es usar la pendiente del <em>principio</em> del intervalo para todo el intervalo. <mark>Heun</mark> promedia la pendiente del principio y la del final (predictor-corrector). El <mark>polígono mejorado</mark> usa la pendiente del punto medio. Ambos tienen error local O(h³).',
      goals: ['Escribir y aplicar Heun como predictor-corrector.', 'Escribir y aplicar el polígono mejorado.', 'Resolver el TP 5, ejercicios 2 y 3.'],
      body: `
        <h2>Heun: promediar dos pendientes</h2>
        ${table(['Paso', 'Fórmula', 'Qué hace'], [
          ['Predictor', 'y⁰<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>) h', 'Un paso de Euler: una estimación provisoria del final'],
          ['Corrector', `y<sub>i+1</sub> = y<sub>i</sub> + ${frac('f(x<sub>i</sub>, y<sub>i</sub>) + f(x<sub>i+1</sub>, y⁰<sub>i+1</sub>)', '2')} h`, 'Avanza con el promedio de la pendiente inicial y la final'],
        ])}
        <p>El supraíndice 0 marca que y⁰ es una predicción intermedia. La correctora es la <strong>regla del trapecio</strong>; por eso su error es ε = −f″(ξ)h³/12, con ξ entre x<sub>i</sub> y x<sub>i+1</sub>: <strong>O(h³)</strong>.</p>
        <p><b>Ejemplo de clase</b> (TP 5, 2a con h = 1): f(x, y) = y x² − y. Predictor: f(0, 1) = −1 ⟹ y⁰(1) = 0. Corrector: f(1, 0) = 0 ⟹ y(1) = 1 + (−1 + 0)/2 · 1 = 0,5. Segundo paso: f(1; 0,5) = 0 ⟹ y⁰(2) = 0,5; f(2; 0,5) = 1,5 ⟹ y(2) = 0,5 + (0 + 1,5)/2 = 1,25.</p>
        <h2>Polígono mejorado (Euler modificado): la pendiente del medio</h2>
        ${eq(`y<sub>i+½</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>) ${frac('h', '2')} &nbsp;⟹&nbsp; y<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i+½</sub>, y<sub>i+½</sub>) h`, 'Polígono mejorado')}
        <p>Se usa Euler para llegar a la <strong>mitad</strong> del intervalo, se calcula ahí la pendiente y con ella se da el paso completo desde x<sub>i</sub>. La pendiente del punto medio es una aproximación válida de la pendiente promedio del intervalo. Error local O(h³).</p>
        ${lab(0)}
        ${note('Heun y polígono mejorado son dos miembros de la familia de Runge Kutta de segundo orden: por eso la cátedra no estudia RK2 aparte.', 'tip')}`,
      labs: [{ type: 'ode', problem: 'a2', h: 0.5, methods: ['E', 'H', 'P'], title: 'Euler, Heun y polígono mejorado', intro: 'Con la misma h, comparalos con la referencia. Probá h = 1: Heun y el polígono todavía andan razonablemente; Euler no.' }],
      exercises: [
        { title: 'Heun y polígono mejorado con tres pasos', official: '5.2', level: 2, prompt: '<p>Resolver con Heun y con el polígono mejorado desde x = 0 hasta x = 2, con y(0) = 1, para h = 1; 0,5 y 0,25: a) dy/dx = y x² − y; b) dy/dx = y ln(x + 1).</p>',
          solution: { explain: `<h4>a) dy/dx = y x² − y</h4>${tabs(['H', 'P'], f2a, 0, 1, 2, [1, 0.5, 0.25])}<h4>b) dy/dx = y ln(x + 1)</h4>${tabs(['H', 'P'], fb, 0, 1, 2, [1, 0.5, 0.25])}<p>La solución exacta de a) es y = e<sup>x³/3 − x</sup>, y(2) = e<sup>2/3</sup> ≈ 1,9477.</p>` } },
        { title: 'Comparar los tres métodos', official: '5.3', level: 2, prompt: '<p>Resolver con Euler, Heun y polígono mejorado dy/dx = 2x − 3y + 1 desde x = 1 hasta x = 2, con y(1) = 5 y h = 0,5.</p>', hints: ['Paso 1 de Euler: f(1; 5) = 2 − 15 + 1 = −12, y(1,5) = 5 − 6 = −1.'],
          solution: { explain: `${N.T.ode(['E', 'H', 'P'], f3, 1, 5, 0.5, 2)}<p>La solución exacta es y = 2x/3 + 1/9 + (38/9) e<sup>3(1 − x)</sup>, y(2) ≈ 1,6547. Euler da y(1,5) = −1: con h = 0,5 el factor 1 − 3h = −0,5 hace que la aproximación salte de signo. Para esta ecuación h = 0,5 es demasiado grande. Heun y polígono coinciden porque f es lineal en x y en y.</p>` } },
      ],
      quiz: [
        { q: 'En Heun, la ecuación predictora es…', o: ['un paso de Euler', 'la regla de Simpson', 'el punto medio', 'Runge Kutta 4'], a: 0, e: 'y⁰ = y_i + f(x_i, y_i) h.' },
        { q: 'El corrector de Heun usa la pendiente…', o: ['del inicio', 'del final', 'promedio entre inicio y final', 'del punto medio'], a: 2, e: 'Es la regla del trapecio.' },
        { q: 'El polígono mejorado evalúa la pendiente en…', o: ['x_i', 'x_{i+1}', 'x_i + h/2', 'x_i + 2h'], a: 2, e: 'El punto medio del intervalo.' },
        { q: 'El error local de Heun y del polígono mejorado es…', o: ['O(h)', 'O(h²)', 'O(h³)', 'O(h⁵)'], a: 2, e: 'Un orden más que Euler.' },
        { q: 'Heun se llama método predictor-corrector porque…', o: ['predice con Euler y corrige con la pendiente promedio', 'usa dos pasos h', 'corrige la condición inicial', 'calcula el error'], a: 0, e: 'Primero predice y⁰, después corrige.' },
      ],
      sources: [{ title: 'Apunte: Modificaciones y mejoras al método de Euler', ref: 'Cátedra de Matemática Superior', points: ['Heun: predictor, corrector y error −f″(ξ)h³/12.', 'Polígono mejorado o Euler modificado.', 'TP 5, 2a con h = 1 resuelto en clase.'] }],
    },

    {
      id: 'runge-kutta',
      module: 'u4',
      title: 'Métodos de Runge Kutta de tercer y cuarto orden',
      keywords: 'runge kutta tercer cuarto orden rk3 rk4 función incremento k1 k2 k3 k4 pendientes ponderadas',
      tldr: 'Runge Kutta logra la exactitud de Taylor de orden alto <mark>sin calcular derivadas superiores</mark>: promedia varias pendientes k evaluadas dentro del intervalo. El RK4 clásico pondera k₁, 2k₂, 2k₃, k₄ entre 6 y tiene error local O(h⁵).',
      goals: ['Escribir la forma general con la función incremento.', 'Aplicar RK3 y RK4.', 'Explicar por qué no hay un único RK2.'],
      body: `
        ${eq('y<sub>i+1</sub> = y<sub>i</sub> + Φ(x<sub>i</sub>, y<sub>i</sub>, h) · h &nbsp;&nbsp; Φ = a₁k₁ + a₂k₂ + … + a<sub>n</sub>k<sub>n</sub>', 'Forma general')}
        <p>Φ es la <strong>función incremento</strong>: una pendiente promedio sobre el intervalo. Cada k es la pendiente f evaluada en un punto que se construye con las k anteriores.</p>
        <h2>¿Por qué no se estudia RK2?</h2>
        <p>Al deducir RK de segundo orden queda un sistema de <strong>3 ecuaciones con 4 incógnitas</strong>: no hay solución única, sino una familia. Fijando una constante salen las otras; Heun y el polígono mejorado son dos miembros de esa familia. Para RK3 queda un sistema de 6 ecuaciones con 8 incógnitas: hay que fijar 2.</p>
        <h2>Runge Kutta de tercer orden</h2>
        ${eq(`y<sub>i+1</sub> = y<sub>i</sub> + ${frac('k₁ + 4k₂ + k₃', '6')} h`, 'RK3, error O(h⁴)')}
        <p>k₁ = f(x<sub>i</sub>, y<sub>i</sub>); k₂ = f(x<sub>i</sub> + h/2, y<sub>i</sub> + k₁h/2); k₃ = f(x<sub>i</sub> + h, y<sub>i</sub> − k₁h + 2k₂h).</p>
        <h2>Runge Kutta de cuarto orden (clásico)</h2>
        ${eq(`y<sub>i+1</sub> = y<sub>i</sub> + ${frac('k₁ + 2k₂ + 2k₃ + k₄', '6')} h`, 'RK4, error O(h⁵)')}
        ${table(['Pendiente', 'Dónde se evalúa'], [['k₁ = f(x<sub>i</sub>, y<sub>i</sub>)', 'Al principio (como Euler)'], ['k₂ = f(x<sub>i</sub> + h/2, y<sub>i</sub> + k₁h/2)', 'En el medio, llegando con k₁'], ['k₃ = f(x<sub>i</sub> + h/2, y<sub>i</sub> + k₂h/2)', 'En el medio, llegando con k₂'], ['k₄ = f(x<sub>i</sub> + h, y<sub>i</sub> + k₃h)', 'Al final, llegando con k₃']])}
        <p>Las pendientes del medio pesan el doble: es la regla de Simpson aplicada a la pendiente.</p>
        <h3>Un paso de RK4 en el TP 5, ejercicio 3</h3>
        <p>f(x, y) = 2x − 3y + 1, x₀ = 1, y₀ = 5, h = 0,5. k₁ = f(1; 5) = −12. k₂ = f(1,25; 5 − 3) = f(1,25; 2) = −2,5. k₃ = f(1,25; 5 − 0,625) = f(1,25; 4,375) = −9,625. k₄ = f(1,5; 5 − 4,8125) = f(1,5; 0,1875) = 3,4375.</p>
        ${eq('y(1,5) = 5 + (−12 − 5 − 19,25 + 3,4375)/6 · 0,5 = 2,2656', 'Verdadero: 2,0532 (error 10 %)')}
        <p>Con h = 0,5 incluso RK4 pierde precisión en esta ecuación (la solución cae muy rápido), pero no oscila como Euler. Con h = 0,25 el error ya es menor al 1 %.</p>
        ${lab(0)}
        ${table(['Método', 'Evaluaciones de f por paso', 'Error local', 'Error global'], [['Euler', '1', 'O(h²)', 'O(h)'], ['Heun / polígono', '2', 'O(h³)', 'O(h²)'], ['RK3', '3', 'O(h⁴)', 'O(h³)'], ['RK4', '4', 'O(h⁵)', 'O(h⁴)']])}`,
      labs: [{ type: 'ode', problem: 'b1', h: 1, methods: ['E', 'H', 'RK3', 'RK4'], title: 'Todos los métodos juntos', intro: 'Con h = 1 (¡solo dos pasos!) RK4 ya casi coincide con la referencia. Activá y desactivá métodos para comparar.' }],
      quiz: [
        { q: 'RK4 pondera las pendientes como…', o: ['(k₁ + k₂ + k₃ + k₄)/4', '(k₁ + 2k₂ + 2k₃ + k₄)/6', '(k₁ + 4k₂ + k₃)/6', '(k₁ + k₄)/2'], a: 1, e: 'Las del medio pesan doble.' },
        { q: 'La ventaja de Runge Kutta sobre Taylor de orden alto es que…', o: ['no necesita condición inicial', 'no requiere calcular derivadas superiores', 'es exacto', 'usa menos pasos siempre'], a: 1, e: 'Solo evalúa f en varios puntos.' },
        { q: 'RK de segundo orden no es único porque…', o: ['no converge', 'queda un sistema de 3 ecuaciones con 4 incógnitas', 'depende de h', 'es igual a Euler'], a: 1, e: 'Hay una familia; Heun y polígono son dos de sus miembros.' },
        { q: 'El error local de RK4 es…', o: ['O(h²)', 'O(h³)', 'O(h⁴)', 'O(h⁵)'], a: 3, e: 'Global O(h⁴).' },
        { q: 'En RK3, k₃ se evalúa en…', o: ['x_i + h/2', 'x_i + h', 'x_i', 'x_i + 2h'], a: 1, e: 'k₃ = f(x_i + h, y_i − k₁h + 2k₂h).' },
      ],
      sources: [{ title: 'Apunte: Métodos de Runge Kutta', ref: 'Cátedra de Matemática Superior', points: ['Forma general con función incremento.', 'RK3 (error O(h⁴)) y RK4 clásico.'] }],
    },
  );
})();
