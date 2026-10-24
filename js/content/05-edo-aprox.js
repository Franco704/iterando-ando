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

    {
      id: 'edo-errores',
      module: 'u4',
      title: 'A fondo: pendientes, orden del error y elección del paso h',
      keywords: 'error local global orden truncamiento redondeo paso h pequeño grande pendiente euler heun polígono runge kutta qué ecuaciones resuelven chapra burden error total',
      tldr: 'Todos los métodos de un paso hacen y<sub>i+1</sub> = y<sub>i</sub> + φ·h y se diferencian en <mark>cómo estiman la pendiente φ</mark>. Un método de orden n tiene error local O(h<sup>n+1</sup>) y global O(hⁿ): Euler O(h²) y O(h); Heun y polígono O(h³) y O(h²). Achicar h reduce el error de truncamiento, pero no conviene llevarlo a un extremo: crece el número de pasos y el error de redondeo.',
      goals: ['Comparar cómo calcula la pendiente cada método.', 'Distinguir error local y global y su orden.', 'Justificar la elección de h (pregunta clásica del parcial).', 'Decir qué ecuaciones resuelven los métodos aproximados.'],
      body: `
        <h2>La pendiente: lo único que cambia</h2>
        ${eq('y<sub>i+1</sub> = y<sub>i</sub> + φ h &nbsp;&nbsp; (nuevo valor = valor anterior + pendiente × tamaño de paso)', 'Forma general (Chapra, ec. 25.1)')}
        ${table(['Método', 'Pendiente φ usada en todo el intervalo', 'Error local', 'Error global'], [
          ['Euler', 'La del <b>inicio</b>: f(x<sub>i</sub>, y<sub>i</sub>). Se supone constante en todo el intervalo (recta tangente)', 'O(h²)', 'O(h)'],
          ['Heun', '<b>Promedio</b> de la pendiente al inicio y al final: [f(x<sub>i</sub>, y<sub>i</sub>) + f(x<sub>i+1</sub>, y⁰<sub>i+1</sub>)]/2, con y⁰ predicho por Euler (predictor-corrector)', 'O(h³)', 'O(h²)'],
          ['Polígono mejorado (punto medio)', 'La del <b>punto medio</b>: f(x<sub>i+1/2</sub>, y<sub>i+1/2</sub>), con y<sub>i+1/2</sub> predicho por Euler con medio paso', 'O(h³)', 'O(h²)'],
          ['Runge Kutta 4', 'Promedio ponderado (k₁ + 2k₂ + 2k₃ + k₄)/6 de cuatro pendientes', 'O(h⁵)', 'O(h⁴)'],
        ])}
        ${note('Respuesta modelo (1P 2025 A y B): “En Euler la pendiente se calcula al inicio del intervalo y se considera constante en todo el intervalo. Como la curva no es recta, eso produce un error de truncamiento. Las mejoras son Heun, que promedia la pendiente del inicio con una estimada al final (predictor-corrector), y el polígono mejorado, que usa la pendiente estimada en el punto medio. Se realizan para obtener una mejor estimación de la pendiente en el intervalo y bajar el error de O(h²) a O(h³) por paso.”', 'exam')}
        <h2>Error local y error global</h2>
        <p>Chapra (sección 25.1.1) separa dos cosas. El <strong>error de truncamiento local</strong> es el que comete el método en <em>un</em> paso, suponiendo que partió del valor exacto. El <strong>error de truncamiento global</strong> es el acumulado al final: además del error del último paso arrastra los de todos los anteriores, porque cada paso arranca de un valor ya aproximado.</p>
        <p>Para Euler, el error local sale del primer término descartado de Taylor, f′(x<sub>i</sub>, y<sub>i</sub>) h²/2!, y es O(h²). Como para llegar de x₀ a x<sub>f</sub> hacen falta (x<sub>f</sub> − x₀)/h pasos, se acumulan del orden de (1/h)·h² = h: el global es O(h). La regla general de Chapra: “un método de n-ésimo orden dará resultados perfectos si la solución de la EDO es un polinomio de n-ésimo grado. Además, el error de truncamiento local será O(h<sup>n+1</sup>) y el global, O(hⁿ)”.</p>
        ${table(['Si h se divide por 2…', 'Euler (orden 1)', 'Heun o polígono (orden 2)', 'RK4 (orden 4)'], [['el error local se divide por', '4', '8', '32'], ['el error global se divide por', '2', '4', '16']])}
        ${note('Consecuencias que Chapra saca para Euler: 1) se puede reducir el error disminuyendo h; 2) si la solución es una recta (segunda derivada nula), Euler es exacto. Del mismo modo, Heun es exacto si la solución es una parábola: por eso en el 1P 2025 B (dy/dx cúbica, solución de grado 4) el polígono no da exacto.', 'tip')}
        <h2>¿h muy pequeño o muy grande?</h2>
        <p>Muy grande, nunca: el error de truncamiento crece con h y el método puede hasta cambiar el comportamiento de la solución. En el 1P 2024 (tema 2), Heun con h = 0,6 da y(2,8) ≈ 8,45 cuando el valor verdadero es ≈ 3,42.</p>
        <p>Pero tampoco “lo más chico posible”. Burden (sección 5.2, teorema 5.10) incluye el redondeo δ de cada operación y obtiene una cota del error del tipo</p>
        ${eq(`E(h) = ${frac('h M', '2')} + ${frac('δ', 'h')} &nbsp;&nbsp; ⟹ &nbsp;&nbsp; mínimo en h = √(2δ/M)`, 'Truncamiento + redondeo (Burden 5.2)')}
        ${h.chart({ x: [0, 1], y: [0, 2.2], xl: 'h', yl: 'error', ticks: { x: [0.25, 0.5, 0.75] }, curves: [{ f: (x) => x, cls: 'c-tan', dash: true, label: 'truncamiento' }, { f: (x) => 0.03 / x, cls: 'c-s', dash: true, label: 'redondeo', at: 0.04 }, { f: (x) => x + 0.03 / x, cls: 'c-root', label: 'error total' }], points: [{ x: Math.sqrt(0.03), y: 2 * Math.sqrt(0.03), cls: 'c-root', label: 'h óptimo', pos: 'se' }] }, 'El truncamiento baja con h, el redondeo sube al hacer más pasos. El error total tiene un mínimo (Chapra 4.3 lo llama punto de rendimientos decrecientes).')}
        <p>Chapra (sección 4.3, error numérico total) llega a lo mismo: al achicar h el error de truncamiento disminuye, pero aumentan los cálculos y con ellos el redondeo. <strong>Respuesta para el parcial</strong>: conviene un h pequeño, porque el error de truncamiento es proporcional a una potencia de h, pero sin exagerar: más pasos significan más tiempo de cálculo y más error de redondeo. En la práctica se resuelve con h y con h/2 y se comparan: si casi no cambia, el paso alcanza.</p>
        <h2>¿Qué ecuaciones resuelven?</h2>
        <p>Ecuaciones diferenciales <strong>ordinarias de primer orden con valor inicial</strong>: dy/dx = f(x, y), y(x₀) = y₀. No hace falta que sean lineales ni de coeficientes constantes: esa es su gran ventaja frente a Laplace. Lo que entregan no es una fórmula de y sino una <strong>tabla de valores</strong> aproximados. Las de orden superior se reescriben como un sistema de ecuaciones de primer orden y se aplica el mismo método a cada una (Chapra, sección 25.4).</p>
        ${lab(0)}`,
      labs: [{ type: 'ode', problem: 'a2', h: 1, methods: ['E', 'H', 'P'], title: 'Probá h grande y h chico', intro: 'Empezá con h = 1 y bajalo de a mitades. Mirá cuánto se acerca cada método a la referencia: Euler mejora de a la mitad; Heun y el polígono, de a un cuarto.' }],
      quiz: [
        { q: 'En Euler, la pendiente usada en todo el intervalo es…', o: ['el promedio inicio-final', 'la del inicio del intervalo', 'la del punto medio', 'la del final'], a: 1, e: 'Se supone constante e igual a f(x_i, y_i).' },
        { q: 'El error de truncamiento local de Heun es…', o: ['O(h)', 'O(h²)', 'O(h³)', 'O(h⁵)'], a: 2, e: 'Es de segundo orden: local O(h³), global O(h²).' },
        { q: 'Si con Euler se divide h por 2, el error global al final…', o: ['se divide por 4', 'se divide por 2', 'no cambia', 'se duplica'], a: 1, e: 'Global O(h).' },
        { q: '¿Por qué no conviene tomar h extremadamente pequeño?', o: ['Porque el método diverge', 'Porque crece el número de operaciones y el error de redondeo', 'Porque el error de truncamiento aumenta', 'Porque cambia el orden del método'], a: 1, e: 'Burden 5.2: E(h) = hM/2 + δ/h tiene un mínimo.' },
        { q: 'Los métodos de un paso de la Unidad 4 resuelven…', o: ['solo ecuaciones lineales', 'EDO de primer orden con valor inicial, lineales o no', 'solo ecuaciones de segundo orden', 'ecuaciones en derivadas parciales'], a: 1, e: 'No necesitan linealidad.' },
        { q: 'Heun es exacto cuando la solución verdadera es…', o: ['una recta solamente', 'un polinomio de grado ≤ 2', 'una exponencial', 'nunca'], a: 1, e: 'Método de orden 2 (Chapra 25.1.1).' },
      ],
      sources: [
        { title: 'Métodos numéricos para ingenieros', ref: 'Chapra y Canale, 5ª ed., secciones 4.3, 25.1 y 25.2', points: ['Forma general y_{i+1} = y_i + φh (ec. 25.1).', 'Error local O(h²) y global O(h) de Euler; un método de orden n tiene local O(h^{n+1}) y global O(hⁿ).', 'Heun como predictor-corrector y método del punto medio (polígono mejorado), ambos de segundo orden.', 'Error numérico total: compromiso entre truncamiento y redondeo.'] },
        { title: 'Análisis numérico', ref: 'Burden, Faires y Burden, 10ª ed., sección 5.2', points: ['Teorema 5.9: cota del error global de Euler, proporcional a h.', 'Teorema 5.10: con redondeo δ el error se acota por hM/2 + δ/h; h óptimo = √(2δ/M).'] },
      ],
    },
  );
})();
