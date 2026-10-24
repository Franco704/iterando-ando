/* Unidad 5 (segunda parte): raíces de ecuaciones, métodos abiertos. Apunte "Raíces de Ecuaciones" y clase "Métodos Abiertos". TP 6, ejercicios 3, 4 y 5. */
(() => {
  const { LESSONS, h, num: N } = window.GUIDE;
  const { note, def, table, eq, frac, lab, flow, chart, num } = h;
  const T = N.T;
  const f3a = (x) => x - 4 * Math.sin(x), d3a = (x) => 1 - 4 * Math.cos(x);
  const f4a = (x) => Math.cos(x) + 0.5, d4a = (x) => -Math.sin(x);
  const f4c = (x) => x ** 3 - 100, d4c = (x) => 3 * x * x;
  const f1a = (x) => -2.1 + 6.21 * x - 3.9 * x * x + 0.667 * x ** 3, d1a = (x) => 6.21 - 7.8 * x + 2.001 * x * x;
  const f5a = (x) => 4 * x * x - Math.exp(-x) - 1, f5c = (x) => x ** 3 - x * x - 2 * x + 1;
  // Telaraña de punto fijo para la lección: g(x) = e^(−x), x₀ = 0,2
  const web = N.fixed((x) => Math.exp(-x), 0.2, { n: 6 });

  LESSONS.push(
    {
      id: 'punto-fijo',
      module: 'u5a',
      title: 'Método de punto fijo',
      keywords: 'punto fijo iteración simple x = g(x) convergencia derivada g prima menor que uno telaraña divergencia',
      tldr: 'Se reordena f(x) = 0 como <mark>x = g(x)</mark> y se itera x<sub>i+1</sub> = g(x<sub>i</sub>). La raíz es el punto donde y = g(x) corta a la recta y = x. Converge si cerca de la raíz <strong>|g′(x)| &lt; 1</strong>: la pendiente de g tiene que ser menor que la de la recta y = x.',
      goals: ['Construir funciones g a partir de f.', 'Aplicar la condición de convergencia |g′(x)| &lt; 1.', 'Resolver el TP 6, ejercicio 3, y explicar por qué a veces diverge.'],
      body: `
        ${def('Métodos abiertos', 'Se basan en fórmulas que requieren de un solo valor de x o de un par de ellos, pero que no necesariamente encierran a la raíz. Por lo cual, a veces divergen o se alejan de la raíz a medida que crece el número de iteraciones. Sin embargo, cuando convergen, en general lo hacen mucho más rápido que los métodos cerrados.', 'Apunte de la cátedra.')}
        <h2>Despejar x = g(x)</h2>
        <p>Se reordena la ecuación para que x quede sola en el primer miembro, por álgebra o <strong>sumando x a ambos lados</strong>. Del apunte: sen x + x³ = 0 ⟹ x = sen x + x³ + x. Hay muchas g posibles para la misma f, y no todas sirven.</p>
        ${eq('x<sub>i+1</sub> = g(x<sub>i</sub>) &nbsp;&nbsp; |ε<sub>a</sub>| = |(x<sub>i+1</sub> − x<sub>i</sub>)/x<sub>i+1</sub>| · 100', 'Iteración de punto fijo')}
        <h2>La telaraña</h2>
        ${chart({ x: [0, 1], y: [0, 1], w: 340, h: 300, ticks: { x: [0.2, 0.4, 0.6, 0.8], y: [0.2, 0.4, 0.6, 0.8] }, curves: [{ f: (x) => x, cls: 'c-tan', dash: true, label: 'y = x' }, { f: (x) => Math.exp(-x), cls: 'c-g', label: 'g(x) = e^(−x)' }],
          segs: web.flatMap((r) => [{ from: [r.x, r.x], to: [r.x, r.xn], cls: 'c-root' }, { from: [r.x, r.xn], to: [r.xn, r.xn], cls: 'c-root' }]), points: [{ x: 0.5671, y: 0.5671, cls: 'c-root', label: 'raíz', pos: 'se' }] }, 'Desde x₀ = 0,2: subir a la curva g, ir horizontal hasta y = x, subir otra vez… Como −1 < g′ < 0, la telaraña gira en espiral hacia la raíz.')}
        ${table(['g′ cerca de la raíz', 'Comportamiento'], [['0 &lt; g′ &lt; 1', 'Converge en escalera (monótona)'], ['−1 &lt; g′ &lt; 0', 'Converge en espiral (oscilando)'], ['g′ &gt; 1', 'Diverge en escalera'], ['g′ &lt; −1', 'Diverge en espiral']])}
        ${note('El método de punto fijo converge si en la región de interés <strong>|g′(x)| &lt; 1</strong>, es decir, si la magnitud de la pendiente de g(x) es menor que la pendiente de la recta y = x. Es <em>la</em> pregunta teórica de este método.', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'roots', fn: 'p3c', method: 'fp', methods: ['fp'], title: 'Punto fijo y telaraña', intro: 'Elegí la función y el x₀. Probá x − 4 sen x con x₀ = 2,47 (diverge, como en clase) y x² − 0,5 con x₀ = 0,7 y con x₀ = −0,7.' }],
      exercises: [
        { title: 'Punto fijo con 1 % de error', official: '6.3', level: 3, prompt: '<p>Usar punto fijo para calcular los ceros con un error del 1 %: a) f(x) = x − 4 sen x en (0, π); b) f(x) = x² − 0,5; c) f(x) = e<sup>−x</sup> − x; d) f(x) = x³ − 100.</p>', hints: ['Antes de iterar, calculá g′ cerca de la raíz.', 'Si una g diverge, probá otra despejando distinto.'],
          solution: { explain: `<h4>a) g(x) = 4 sen x, x₀ = 2,47 (clase)</h4>${T.fixed((x) => 4 * Math.sin(x), 2.47, { n: 4 })}
            <p><b>Diverge</b>: g′(x) = 4 cos x y g′(2,47) ≈ −3,13, |g′| &gt; 1. Despejando de otra forma, sen x = x/4 ⟹ x = π − arcsen(x/4) (se usa π − … porque la raíz está en el segundo cuadrante). Ahora |g′(2,47)| = (1/4)/√(1 − x²/16) ≈ 0,32 &lt; 1:</p>${T.fixed((x) => Math.PI - Math.asin(x / 4), 2, { tol: 1 })}
            <h4>b) g(x) = x² + x − 0,5 (sumando x)</h4><p>Con x₀ = 0,7 (clase) diverge: g′(x) = 2x + 1 ≈ 2,41 cerca de 0,707.</p>${T.fixed((x) => x * x + x - 0.5, 0.7, { n: 4 })}<p>Con x₀ = −0,7 converge a la raíz negativa: g′(−0,707) ≈ −0,41.</p>${T.fixed((x) => x * x + x - 0.5, -0.7, { tol: 1 })}<p>Para la raíz positiva sirve g(x) = x − (x² − 0,5)/2, con g′ = 1 − x ≈ 0,29:</p>${T.fixed((x) => x - (x * x - 0.5) / 2, 0.5, { tol: 1 })}
            <h4>c) g(x) = e<sup>−x</sup>, x₀ = 0,5 (clase)</h4>${T.fixed((x) => Math.exp(-x), 0.5, { tol: 1 })}<p>g′ = −e<sup>−x</sup> ≈ −0,57: converge oscilando. Raíz ≈ 0,5671.</p>
            <h4>d) g(x) = 10/√x (de x³ = 100 ⟹ x = √(100/x)), x₀ = 4</h4>${T.fixed((x) => 10 / Math.sqrt(x), 4, { tol: 1 })}<p>g′ = −5x<sup>−3/2</sup> ≈ −0,5 cerca de 4,64. Raíz exacta ∛100 ≈ 4,6416. Ojo: g(x) = 100/x² tiene g′ ≈ −2 y diverge.</p>` } },
      ],
      quiz: [
        { q: 'El punto fijo converge si cerca de la raíz…', o: ['|g′(x)| > 1', '|g′(x)| < 1', 'g′(x) = 0 siempre', 'f′(x) < 1'], a: 1, e: 'La pendiente de g menor (en magnitud) que la de y = x.' },
        { q: 'Gráficamente, la raíz es el punto donde…', o: ['g corta al eje x', 'g corta a la recta y = x', 'f tiene un máximo', 'g′ = 0'], a: 1, e: 'Si x = g(x), el punto está sobre y = x.' },
        { q: 'Si −1 < g′ < 0, las iteraciones…', o: ['divergen', 'convergen en escalera', 'convergen oscilando en espiral', 'se quedan quietas'], a: 2, e: 'Quedan alternadamente a cada lado de la raíz.' },
        { q: 'Con g(x) = 4 sen x y x₀ = 2,47 el método diverge porque…', o: ['x₀ está lejos', '|g′(2,47)| ≈ 3,1 > 1', 'f no cambia de signo', 'falta la derivada de f'], a: 1, e: 'Hay que despejar otra g.' },
        { q: 'Para una misma f(x) = 0…', o: ['hay una sola g', 'puede haber muchas g, y no todas convergen', 'g siempre es f + x', 'g no depende de f'], a: 1, e: 'Elegir bien g es parte del método.' },
      ],
      sources: [{ title: 'Apunte y clase: Métodos abiertos', ref: 'Cátedra de Matemática Superior', points: ['Punto fijo y condición |g′(x)| < 1.', 'TP 6, 3a (diverge), 3b y 3c resueltos en clase.'] }],
    },

    {
      id: 'newton-raphson',
      module: 'u5a',
      title: 'Método de Newton Raphson',
      keywords: 'newton raphson tangente derivada convergencia cuadrática falla derivada cero punto de inflexión',
      tldr: 'Desde x<sub>i</sub> se traza la <mark>tangente</mark> a la curva; donde corta al eje está la nueva aproximación: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)/f′(x<sub>i</sub>). Es el método más usado: cerca de la raíz duplica los dígitos correctos en cada paso. Falla cuando f′ es próxima a cero.',
      goals: ['Deducir la fórmula geométricamente.', 'Aplicar el método (TP 6, ejercicio 4).', 'Reconocer las situaciones en que falla.'],
      body: `
        <h2>Deducción geométrica</h2>
        <p>La pendiente de la tangente en (x<sub>i</sub>, f(x<sub>i</sub>)) es f′(x<sub>i</sub>). Esa tangente corta al eje en x<sub>i+1</sub>, así que:</p>
        ${eq(`f′(x<sub>i</sub>) = ${frac('f(x<sub>i</sub>) − 0', 'x<sub>i</sub> − x<sub>i+1</sub>')} &nbsp; ⟹ &nbsp; x<sub>i+1</sub> = x<sub>i</sub> − ${frac('f(x<sub>i</sub>)', 'f′(x<sub>i</sub>)')}`, 'Fórmula de Newton Raphson')}
        ${chart({ x: [1.6, 3.2], y: [-1.2, 2.8], w: 420, h: 280, ticks: { x: [2, 2.5, 3], y: [-1, 1, 2] }, curves: [{ f: f3a, cls: 'c-f', label: 'f(x) = x − 4 sen x' }],
          segs: [{ from: [3, f3a(3)], to: [3 - f3a(3) / d3a(3), 0], cls: 'c-root' }, { from: [3 - f3a(3) / d3a(3), 0], to: [3 - f3a(3) / d3a(3), f3a(3 - f3a(3) / d3a(3))], cls: 'c-tan pl-faint' }],
          points: [{ x: 3, y: f3a(3), cls: 'c-g', label: '(x₀, f(x₀))', pos: 'w' }, { x: 3 - f3a(3) / d3a(3), y: 0, cls: 'c-root', label: 'x₁', pos: 's' }, { x: 2.4746, y: 0, cls: 'c-ok', label: 'raíz', pos: 'n' }] }, 'Con x₀ = 3 la tangente ya cae en x₁ ≈ 2,509, muy cerca de la raíz 2,4746.')}
        <p>También sale de Taylor: f(x<sub>i+1</sub>) ≈ f(x<sub>i</sub>) + f′(x<sub>i</sub>)(x<sub>i+1</sub> − x<sub>i</sub>); igualando a 0 y despejando se obtiene lo mismo. De esa deducción sale que el error en cada paso es proporcional al <strong>cuadrado</strong> del error anterior: <strong>convergencia cuadrática</strong>.</p>
        ${lab(0)}
        <h2>Ejemplo de clase: TP 6, 4b con x₀ = 2,47</h2>
        ${T.newton(f3a, d3a, 2.47, { n: 3 })}
        <p>En dos iteraciones ε<sub>a</sub> ≈ 0,0003 %. Compará con el punto fijo de la misma función, que divergía.</p>
        <h2>Cuándo falla</h2>
        ${table(['Situación', 'Qué pasa'], [
          ['f′(x<sub>i</sub>) ≈ 0 (cerca de un máximo o mínimo)', 'La tangente es casi horizontal y manda x<sub>i+1</sub> muy lejos'],
          ['Punto de inflexión cerca de la raíz', 'Las iteraciones pueden oscilar sin converger'],
          ['x₀ lejos de la raíz', 'Puede saltar a otra raíz o diverger'],
          ['Raíz múltiple', 'Converge, pero lento (lineal)'],
          ['f′ difícil de calcular', 'Es el motivo del método de la secante'],
        ])}
        ${note('Newton Raphson necesita <strong>la derivada</strong> de f. En el parcial escribila antes de empezar la tabla, y verificá que f′(x₀) no sea casi 0.', 'exam')}`,
      labs: [{ type: 'roots', fn: 'p3a', method: 'nr', methods: ['nr'], title: 'Newton Raphson: tangente tras tangente', intro: 'Cada iteración traza la tangente en el punto actual. Probá x₀ cerca de un máximo o mínimo de f (donde f′ ≈ 0) y mirá adónde salta.' }],
      exercises: [
        { title: 'Newton Raphson con 1 % de error', official: '6.4', level: 2, prompt: '<p>a) h(x) = cos x + 1/2 en [0, 2π]; b) f(x) = x − 4 sen x en (0, π); c) f(x) = x³ − 100; d) f(x) = −2,1 + 6,21x − 3,9x² + 0,667x³.</p>', hints: ['a) h′(x) = −sen x. Hay dos raíces en [0, 2π].', 'd) f′(x) = 6,21 − 7,8x + 2,001x².'],
          solution: { explain: `<h4>a) x₀ = 2 (clase)</h4>${T.newton(f4a, d4a, 2, { tol: 1 })}<p>Con una iteración más ε<sub>a</sub> ≈ 0,1 %; la raíz exacta es 2π/3 ≈ 2,0944. La otra raíz, desde x₀ = 4:</p>${T.newton(f4a, d4a, 4, { tol: 0.1 })}<p>4π/3 ≈ 4,1888.</p>
            <h4>b) x₀ = 2,47 (clase)</h4>${T.newton(f3a, d3a, 2.47, { n: 2 })}
            <h4>c) x₀ = 5</h4>${T.newton(f4c, d4c, 5, { tol: 1 })}<p>∛100 ≈ 4,6416.</p>
            <h4>d) x₀ = 0,5</h4>${T.newton(f1a, d1a, 0.5, { tol: 1 })}<p>Las otras raíces salen con x₀ = 2,2 y x₀ = 3,5.</p>` } },
      ],
      quiz: [
        { q: 'La fórmula de Newton Raphson es…', o: ['x_{i+1} = x_i − f′(x_i)/f(x_i)', 'x_{i+1} = x_i − f(x_i)/f′(x_i)', 'x_{i+1} = g(x_i)', 'x_{i+1} = (x_i + x_f)/2'], a: 1, e: 'Intersección de la tangente con el eje.' },
        { q: 'Newton Raphson se porta mal cuando…', o: ['f′(x) es próxima a cero', 'f es un polinomio', 'x₀ está cerca de la raíz', 'la raíz es simple'], a: 0, e: 'La tangente casi horizontal lanza la iteración lejos.' },
        { q: 'Su velocidad de convergencia cerca de una raíz simple es…', o: ['lineal', 'cuadrática', 'nula', 'igual a la bisección'], a: 1, e: 'El número de dígitos correctos se duplica aproximadamente.' },
        { q: 'Newton Raphson es un método…', o: ['cerrado', 'abierto que usa un valor inicial', 'abierto que usa dos valores', 'de interpolación'], a: 1, e: 'Solo x₀.' },
        { q: 'Para f(x) = x³ − 100 y x₀ = 5, x₁ = …', o: ['4,5', '4,6667', '4,8', '5,333'], a: 1, e: '5 − 25/75 = 4,6667.' },
      ],
      sources: [{ title: 'Apunte y clase: Método de Newton Raphson', ref: 'Cátedra de Matemática Superior', points: ['Deducción geométrica por la tangente.', 'Falla cuando la derivada es próxima a cero.', 'TP 6, 4a y 4b resueltos en clase.'] }],
    },

    {
      id: 'secante',
      module: 'u5a',
      title: 'Método de la secante',
      keywords: 'secante diferencia dividida derivada aproximada dos valores iniciales comparación regla falsa reemplazo secuencial',
      tldr: 'Es Newton Raphson con la derivada reemplazada por una <mark>diferencia dividida</mark>: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)(x<sub>i−1</sub> − x<sub>i</sub>)/(f(x<sub>i−1</sub>) − f(x<sub>i</sub>)). Usa dos valores, como la regla falsa, pero los <strong>reemplaza en secuencia estricta</strong>: no garantiza encerrar la raíz, puede diverger, y cuando converge es más rápido.',
      goals: ['Deducir la fórmula desde Newton.', 'Explicar la diferencia con la regla falsa (pregunta de teórico).', 'Resolver el TP 6, ejercicio 5.'],
      body: `
        <p>A veces f′ es difícil de evaluar. Se aproxima por la pendiente de la recta que pasa por los dos últimos puntos:</p>
        ${eq(`f′(x<sub>i</sub>) ≈ ${frac('f(x<sub>i−1</sub>) − f(x<sub>i</sub>)', 'x<sub>i−1</sub> − x<sub>i</sub>')}`, 'Diferencia dividida')}
        ${eq(`x<sub>i+1</sub> = x<sub>i</sub> − ${frac('f(x<sub>i</sub>)(x<sub>i−1</sub> − x<sub>i</sub>)', 'f(x<sub>i−1</sub>) − f(x<sub>i</sub>)')}`, 'Fórmula de la secante')}
        <p>Requiere dos puntos iniciales, pero como <strong>no se exige que f cambie de signo</strong> entre ellos, no se lo clasifica como método cerrado.</p>
        ${lab(0)}
        <h2>Secante contra regla falsa</h2>
        <p>Las dos fórmulas son prácticamente la misma: ambas proyectan una recta entre dos puntos hasta el eje. La diferencia fundamental está en <strong>qué valor se reemplaza</strong>:</p>
        ${table(['', 'Regla falsa', 'Secante'], [
          ['Reemplazo', 'x<sub>r</sub> reemplaza al extremo cuya f tiene el mismo signo que f(x<sub>r</sub>)', 'Secuencia estricta: x<sub>i+1</sub> reemplaza a x<sub>i</sub> y x<sub>i</sub> a x<sub>i−1</sub>'],
          ['¿Encierra la raíz?', 'Siempre', 'No necesariamente: los dos pueden quedar del mismo lado'],
          ['Convergencia', 'Siempre converge (en la práctica)', 'Puede diverger'],
          ['Velocidad', 'Más lenta: un extremo suele quedar fijo', 'Cuando converge, más rápida'],
        ])}
        ${note('Lo que hace que la regla falsa nunca diverja (un extremo fijo que mantiene la raíz encerrada) es justamente lo que la hace más lenta: su ventaja es su desventaja. Es una conclusión del apunte que se suele pedir.', 'exam')}
        <h2>Ejemplo de clase: TP 6, 5a</h2>
        <p>f(x) = 4x² − e<sup>−x</sup> − 1 con x₋₁ = 0,5 y x₀ = 1.</p>
        ${T.secant(f5a, 0.5, 1, { n: 4 })}
        <p>La primera iteración coincide con la regla falsa (los dos usan la misma recta), pero desde la segunda la secante usa los dos puntos más recientes y se acelera.</p>`,
      labs: [{ type: 'roots', fn: 'p5a', method: 'sec', methods: ['sec', 'rf'], title: 'Secante contra regla falsa', intro: 'Misma función, mismos dos valores. Alterná el método y compará: la secante descarta siempre el punto más viejo; la regla falsa, el del mismo signo.' }],
      exercises: [
        { title: 'Secante y regla falsa, cuatro iteraciones', official: '6.5', level: 2, prompt: '<p>Con 4 iteraciones y el error en cada una, comparar cuál método es más conveniente: a) f(x) = 4x² − e<sup>−x</sup> − 1; b) f(x) = x³ − 100; c) f(x) = x³ − x² − 2x + 1.</p>',
          solution: { explain: [['a', f5a, 0.5, 1], ['b', f4c, 4, 5], ['c', f5c, 0, 1]].map(([k, f, a, b]) => `<h4>${k}) Regla falsa en [${num(a)}; ${num(b)}]</h4>${T.closed('rf', f, a, b, { n: 4 })}<h4>${k}) Secante con x₋₁ = ${num(a)}, x₀ = ${num(b)}</h4>${T.secant(f, a, b, { n: 4 })}`).join('')
            + '<p><b>Conclusión</b>: en a) y b) la secante llega más rápido a errores chicos (en b la regla falsa deja fijo x<sub>f</sub> = 5). En c) la regla falsa gana porque la curva casi no se dobla en [0; 1] y la secante arranca más lejos. Ninguno es mejor siempre: la secante es más rápida cuando converge; la regla falsa, más segura.</p>' } },
      ],
      quiz: [
        { q: 'El método de la secante aproxima f′ con…', o: ['una diferencia dividida entre los dos últimos puntos', 'la tangente', 'el punto medio', 'g′(x)'], a: 0, e: '(f(x_{i−1}) − f(x_i))/(x_{i−1} − x_i).' },
        { q: '¿Por qué la secante no es un método cerrado?', o: ['porque usa un solo valor', 'porque no exige que f cambie de signo entre los dos valores', 'porque necesita f′', 'porque siempre diverge'], a: 1, e: 'Los dos puntos pueden estar del mismo lado.' },
        { q: 'La diferencia fundamental entre secante y regla falsa es…', o: ['la fórmula', 'la forma en que se reemplazan los valores', 'el criterio de paro', 'la cantidad de valores iniciales'], a: 1, e: 'Secuencia estricta contra reemplazo por signo.' },
        { q: 'Cuando la secante converge, comparada con la regla falsa es…', o: ['más lenta', 'más rápida', 'igual', 'no se puede comparar'], a: 1, e: 'La regla falsa se frena por el extremo fijo.' },
      ],
      sources: [{ title: 'Apunte y clase: Método de la Secante', ref: 'Cátedra de Matemática Superior', points: ['Deducción desde Newton Raphson.', 'Comparación con la regla falsa.', 'TP 6, 5a por regla falsa y por secante resuelto en clase.'] }],
    },

    {
      id: 'comparacion-raices',
      module: 'u5a',
      title: 'Comparación de los cinco métodos',
      keywords: 'comparación métodos cerrados abiertos velocidad convergencia elegir método resumen',
      tldr: 'Cerrados: <mark>seguros y lentos</mark>. Abiertos: <mark>rápidos pero sin garantía</mark>. En la práctica se combinan: unas iteraciones de bisección para acercarse y después Newton o secante para terminar.',
      goals: ['Comparar los cinco métodos en convergencia, velocidad y requisitos.', 'Elegir un método según el problema.'],
      body: `
        ${table(['Método', 'Tipo', 'Necesita', 'Converge', 'Velocidad'], [
          ['Bisección', 'Cerrado', 'x<sub>i</sub>, x<sub>f</sub> con cambio de signo', 'Siempre', 'Lineal: el intervalo se divide por 2'],
          ['Regla falsa', 'Cerrado', 'x<sub>i</sub>, x<sub>f</sub> con cambio de signo', 'Siempre', 'Más rápida que bisección (salvo curvas muy dobladas)'],
          ['Punto fijo', 'Abierto', 'x₀ y una g con |g′| &lt; 1', 'Solo si |g′| &lt; 1', 'Lineal'],
          ['Newton Raphson', 'Abierto', 'x₀ y f′(x)', 'Si x₀ está cerca y f′ ≠ 0', 'Cuadrática'],
          ['Secante', 'Abierto', 'x₋₁, x₀ (sin cambio de signo)', 'No garantizado', 'Casi tan rápida como Newton'],
        ])}
        ${lab(0)}
        ${lab(1)}
        ${note('Respuesta modelo para “compare los métodos”: nombrar la familia, si encierran o no la raíz, qué datos piden, si garantizan convergencia y la velocidad. Y respaldarlo con la cantidad de iteraciones de un ejemplo concreto.', 'exam')}`,
      labs: [{ type: 'race', fn: 'p3c', title: 'Carrera de métodos', intro: 'Los cinco métodos sobre la misma función, con valores iniciales parecidos. El eje vertical es el error en escala logarítmica.' },
        { type: 'classify', title: '¿Qué método es?', buckets: ['Bisección', 'Regla falsa', 'Punto fijo', 'Newton Raphson', 'Secante'], items: [
          { t: 'Usa la tangente a la curva', b: 3 }, { t: 'Siempre divide el intervalo en dos partes iguales', b: 0 }, { t: 'Converge si |g′(x)| &lt; 1', b: 2 },
          { t: 'Une f(x<sub>i</sub>) y f(x<sub>f</sub>) con una recta y mantiene la raíz encerrada', b: 1 }, { t: 'Aproxima la derivada con dos puntos y los reemplaza en secuencia estricta', b: 4 },
          { t: 'Falla cuando f′(x) es próxima a cero', b: 3 }, { t: 'Se puede saber de antemano cuántas iteraciones necesita', b: 0, why: 'n ≥ log₂(Δx₀/E).' },
        ] }],
      quiz: [
        { q: '¿Qué método garantiza la convergencia?', o: ['Newton Raphson', 'Secante', 'Bisección', 'Punto fijo'], a: 2, e: 'Los cerrados siempre convergen.' },
        { q: 'Si no se puede calcular f′, el abierto más rápido es…', o: ['Newton Raphson', 'Secante', 'Punto fijo', 'Bisección'], a: 1, e: 'Aproxima la derivada.' },
        { q: '¿Cuál necesita reescribir la ecuación como x = g(x)?', o: ['Bisección', 'Regla falsa', 'Punto fijo', 'Secante'], a: 2, e: 'Iteración x_{i+1} = g(x_i).' },
        { q: 'Una estrategia práctica robusta es…', o: ['solo Newton', 'bisección para acercarse y Newton para terminar', 'solo punto fijo', 'secante con un valor'], a: 1, e: 'Combina seguridad y velocidad.' },
      ],
      sources: [{ title: 'Apunte: Raíces de Ecuaciones', ref: 'Cátedra de Matemática Superior', points: ['Comparación entre métodos cerrados y abiertos.'] }, { title: 'Métodos Numéricos para Ingenieros', ref: 'Chapra y Canale, cap. 6', points: ['Convergencia lineal y cuadrática.'] }],
    },

    {
      id: 'abiertos-convergencia',
      module: 'u5a',
      title: 'A fondo: orden de convergencia y cuál método abierto es mejor',
      keywords: 'métodos abiertos particularidad orden de convergencia lineal cuadrática superlineal error newton punto fijo g prima secante modificada raíces múltiples divergencia mejor método abierto chapra burden',
      tldr: 'Los métodos abiertos parten de <mark>uno o dos valores que no necesitan encerrar la raíz</mark>: cuando convergen son mucho más rápidos que los cerrados, pero pueden diverger. Su velocidad se mide con el <strong>orden de convergencia</strong>: punto fijo es lineal (E<sub>i+1</sub> ≈ g′·E<sub>i</sub>), Newton Raphson es cuadrático (E<sub>i+1</sub> ≈ −f″/(2f′)·E<sub>i</sub>²) y la secante queda en el medio.',
      goals: ['Explicar la particularidad de los métodos abiertos.', 'Definir orden de convergencia y aplicarlo a punto fijo, Newton y secante.', 'Argumentar cuál es el mejor método abierto (2P 2025).'],
      body: `
        <h2>La particularidad de los métodos abiertos</h2>
        ${def('Métodos abiertos', 'Se basan en fórmulas que requieren únicamente de un solo valor de inicio x o que empiecen con un par de ellos, pero que no necesariamente encierran la raíz. Éstos, algunas veces, divergen o se alejan de la raíz verdadera a medida que se avanza en el cálculo. Sin embargo, cuando los métodos abiertos convergen, en general lo hacen mucho más rápido que los métodos cerrados.', 'Chapra y Canale, 5ª ed., introducción al capítulo 6.')}
        <h2>Orden de convergencia</h2>
        <p>Burden (sección 2.4) define: una sucesión p<sub>n</sub> → p converge con <strong>orden α</strong> si |p<sub>n+1</sub> − p| / |p<sub>n</sub> − p|<sup>α</sup> → λ (una constante). Con α = 1 la convergencia es <strong>lineal</strong>: el error se multiplica por λ en cada paso. Con α = 2 es <strong>cuadrática</strong>: el error nuevo es proporcional al <em>cuadrado</em> del anterior, y la cantidad de cifras correctas aproximadamente se duplica en cada iteración.</p>
        <h3>Punto fijo: lineal</h3>
        <p>Chapra (cuadro 6.1) resta x<sub>r</sub> = g(x<sub>r</sub>) de x<sub>i+1</sub> = g(x<sub>i</sub>) y usa el teorema del valor medio:</p>
        ${eq('E<sub>i+1</sub> = g′(ξ) · E<sub>i</sub>', 'ξ entre x_i y la raíz')}
        <p>Si |g′| &lt; 1 el error se achica en cada paso (converge); si |g′| &gt; 1 crece (diverge). Si g′ &gt; 0 la aproximación se acerca de un solo lado (monótona); si g′ &lt; 0 salta de un lado al otro (oscilante, la “telaraña”). Burden lo formaliza en el teorema 2.4 del punto fijo.</p>
        ${note('Con 2x³ + 4x − 3 = 0 (2P tema B) hay dos despejes posibles. g(x) = (3 − 2x³)/4 tiene g′(raíz) ≈ −0,59: converge oscilando, lento. g(x) = ∛((3 − 4x)/2) tiene g′(raíz) ≈ −1,70: diverge. Mismo problema, distinto despeje, distinto resultado. Por eso se elige la g mirando |g′|.', 'tip')}
        <h3>Newton Raphson: cuadrático</h3>
        ${eq(`E<sub>t,i+1</sub> = −${frac('f″(x<sub>r</sub>)', '2 f′(x<sub>r</sub>)')} E<sub>t,i</sub>²`, 'Chapra, ec. 6.13')}
        ${table(['Iteración (2P tema B, x₀ = 1)', 'x<sub>i+1</sub>', 'Error verdadero |x<sub>i+1</sub> − x<sub>r</sub>|', 'E<sub>i+1</sub> / E<sub>i</sub>²'], [
          ['1', '0,7', '7,3 × 10⁻²', '—'], ['2', '0,629971', '3,1 × 10⁻³', '0,58'], ['3', '0,626851', '5,8 × 10⁻⁶', '0,59'], ['4', '0,6268452758', '2,0 × 10⁻¹¹', '0,59'],
        ])}
        <p>El cociente se estabiliza en f″/(2f′) = 12x<sub>r</sub>/(2(6x<sub>r</sub>² + 4)) ≈ 0,59, como predice la fórmula, y las cifras correctas pasan de 1 a 2, 5 y 10.</p>
        <p>Las <strong>desventajas</strong> (Chapra, sección 6.2.2): divide por f′, así que falla si f′(x<sub>i</sub>) ≈ 0 (máximos y mínimos locales); un punto de inflexión cerca de la raíz lo hace diverger; puede oscilar alrededor de un extremo o saltar a otra raíz lejana; y con raíces múltiples su convergencia baja a lineal (sección 6.4). Además hay que calcular la derivada, que no siempre es fácil.</p>
        <h3>Secante: superlineal</h3>
        <p>Reemplaza f′ por la pendiente entre los dos últimos puntos, así que no necesita derivar. Su orden es aproximadamente 1,62 (entre lineal y cuadrático): en el 2P tema B, con x₋₁ = 0 y x₀ = 1, los errores verdaderos son 1,3·10⁻¹; 2,7·10⁻²; 2,0·10⁻³; 3,2·10⁻⁵; 3,8·10⁻⁸. Chapra (sección 6.3.3) propone también la <strong>secante modificada</strong>, que usa un solo valor y una perturbación δ: f′ ≈ [f(x<sub>i</sub> + δx<sub>i</sub>) − f(x<sub>i</sub>)]/(δx<sub>i</sub>).</p>
        ${note('Diferencia con la regla falsa (Chapra 6.3.1): las dos fórmulas son iguales, pero la regla falsa elige qué punto reemplazar mirando el signo (la raíz sigue encerrada) y la secante reemplaza siempre el más viejo. Por eso la secante puede diverger y la regla falsa no.', '')}
        <h2>¿Cuál es el mejor método abierto?</h2>
        ${note('Respuesta modelo (2P 2025 A): “Los métodos abiertos necesitan uno (punto fijo, Newton) o dos (secante) valores iniciales que no tienen por qué encerrar la raíz; no garantizan convergencia, pero cuando convergen son mucho más rápidos que los cerrados. Punto fijo despeja x = g(x) e itera x<sub>i+1</sub> = g(x<sub>i</sub>); converge si |g′(x)| &lt; 1, con convergencia lineal. Newton Raphson traza la tangente en (x<sub>i</sub>, f(x<sub>i</sub>)) y toma su corte con el eje: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)/f′(x<sub>i</sub>); converge cuadráticamente, pero necesita la derivada y falla si f′ ≈ 0. La secante aproxima la derivada con los dos últimos puntos: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)(x<sub>i−1</sub> − x<sub>i</sub>)/(f(x<sub>i−1</sub>) − f(x<sub>i</sub>)); es casi tan rápida como Newton y no necesita derivar. El mejor es Newton Raphson por su convergencia cuadrática, siempre que la derivada sea sencilla y x₀ esté cerca de la raíz; si la derivada es difícil de calcular, la secante.”', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'roots', fn: 'pxa', method: 'nr', methods: ['nr', 'sec'], title: 'Newton y secante en el 2P tema A', intro: 'f(x) = 3x³ + 2x − 4. Con Newton desde x₀ = 1 hacen falta 2 iteraciones para ε_a < 1 %. Cambiá a la secante (x₋₁ = 0, x₀ = 1) y compará; después probá un x₀ cerca de 0, donde la tangente es casi horizontal.' }],
      quiz: [
        { q: 'En convergencia cuadrática, si un error es 10⁻³, el siguiente es del orden de…', o: ['10⁻³', '10⁻⁴', '10⁻⁶', '10⁻⁹'], a: 2, e: 'E_{i+1} ∝ E_i².' },
        { q: 'El punto fijo converge si…', o: ['|g′(x)| < 1 cerca de la raíz', 'g′(x) > 1', 'f′(x) = 0', 'f cambia de signo'], a: 0, e: 'E_{i+1} = g′(ξ) E_i.' },
        { q: 'Si −1 < g′ < 0 cerca de la raíz, el punto fijo…', o: ['diverge', 'converge oscilando', 'converge de un solo lado', 'converge cuadráticamente'], a: 1, e: 'El signo negativo hace saltar de un lado al otro.' },
        { q: 'Newton Raphson pierde la convergencia cuadrática cuando…', o: ['la raíz es simple', 'la raíz es múltiple', 'f es un polinomio', 'x₀ está cerca'], a: 1, e: 'Chapra 6.4: con raíces múltiples f′ también se anula en la raíz.' },
        { q: 'La secante se prefiere a Newton cuando…', o: ['se quiere garantizar la convergencia', 'la derivada es difícil o costosa de calcular', 'hay una sola iteración', 'f no cambia de signo'], a: 1, e: 'Aproxima f′ con dos puntos.' },
        { q: 'Una particularidad de los métodos abiertos es que…', o: ['siempre convergen', 'no necesitan que los valores iniciales encierren la raíz', 'necesitan f(a)·f(b) < 0', 'son más lentos que los cerrados'], a: 1, e: 'Y por eso pueden diverger.' },
      ],
      sources: [
        { title: 'Métodos numéricos para ingenieros', ref: 'Chapra y Canale, 5ª ed., capítulo 6', points: ['Definición de métodos abiertos y comparación con los cerrados.', 'Cuadro 6.1: E_{i+1} = g′(ξ)E_i (convergencia lineal del punto fijo).', 'Ec. 6.13: convergencia cuadrática de Newton; 6.2.2 desventajas; 6.4 raíces múltiples.', '6.3.1 secante contra falsa posición; 6.3.3 secante modificada.'] },
        { title: 'Análisis numérico', ref: 'Burden, Faires y Burden, 10ª ed., secciones 2.2 a 2.4', points: ['Teorema 2.4 (punto fijo).', 'Definición de orden de convergencia α; convergencia lineal y cuadrática.'] },
      ],
    },
  );
})();
