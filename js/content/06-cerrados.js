/* Unidad 5 (primera parte, inicio del 2do parcial): raíces de ecuaciones, métodos cerrados. Apunte "Raíces de Ecuaciones" y clase "Métodos Cerrados". TP 6, ejercicios 1 y 2.
   Las tablas de iteraciones se calculan con num.js con los mismos datos de partida que usó la cátedra. */
(() => {
  const { LESSONS, h, num: N } = window.GUIDE;
  const { note, def, table, eq, frac, lab, flow, chart, num } = h;
  const f1a = (x) => -2.1 + 6.21 * x - 3.9 * x * x + 0.667 * x ** 3;
  const f1b = (x) => Math.tan(x) + x - 1, f1c = (x) => x ** 3 - 3 * x * x + 5;
  const P2 = [
    ['a', 'x³ − x² − 2x + 1', (x) => x ** 3 - x * x - 2 * x + 1, 0.4, 0.8],
    ['b', '3x³ + 4x² − 8x − 1', (x) => 3 * x ** 3 + 4 * x * x - 8 * x - 1, 1, 1.2],
    ['c', '4x⁴ + 3x³ − 2x² − 3x − 1', (x) => 4 * x ** 4 + 3 * x ** 3 - 2 * x * x - 3 * x - 1, 0.8, 1],
    ['d', '5x³ − x² − 2x − 1', (x) => 5 * x ** 3 - x * x - 2 * x - 1, 0.8, 1],
    ['e', '3x³ + 4x² − 6', (x) => 3 * x ** 3 + 4 * x * x - 6, 0.8, 1],
  ];
  const scan = (f, xs) => table(['x', ...xs.map((x) => num(x))], [['f(x)', ...xs.map((x) => `<span class="${f(x) < 0 ? 'neg' : 'pos'}">${num(f(x), 3)}</span>`)]]);
  const count = (m, f, a, b) => N.closed(m, f, a, b, { tol: 1 }).length;

  LESSONS.push(
    {
      id: 'raices-intro',
      module: 'u5c',
      title: 'El problema de las raíces y el cambio de signo',
      keywords: 'raíz cero ecuación no lineal teorema bolzano cambio de signo búsqueda incremental tabla de valores error relativo aproximado criterio de paro métodos cerrados abiertos',
      tldr: 'Una raíz de f es un x donde <mark>f(x) = 0</mark>. Muchas ecuaciones (x − 4 sen x = 0, polinomios de grado alto) no tienen fórmula: se aproximan iterando. Si f es continua y <strong>f(x<sub>i</sub>)·f(x<sub>f</sub>) &lt; 0</strong>, hay al menos una raíz entre x<sub>i</sub> y x<sub>f</sub>. Se itera hasta que el error relativo aproximado ε<sub>a</sub> sea menor que una tolerancia.',
      goals: ['Explicar por qué hacen falta métodos numéricos.', 'Ubicar intervalos con cambio de signo con una tabla de valores.', 'Calcular el error relativo aproximado y aplicar un criterio de paro.', 'Distinguir métodos cerrados y abiertos.'],
      body: `
        <p>Para ax² + bx + c = 0 existe la fórmula resolvente. Pero para x − 4 sen x = 0, e<sup>−x</sup> − x = 0 o un polinomio de grado 5 no hay ninguna fórmula que dé la raíz con operaciones finitas. Los métodos numéricos la <strong>aproximan</strong> con una sucesión de valores que se acerca a ella.</p>
        <h2>El principio de los métodos cerrados</h2>
        ${def('Cambio de signo', 'Si f(x) es real y continua en el intervalo de x<sub>i</sub> a x<sub>f</sub>, y f(x<sub>i</sub>) y f(x<sub>f</sub>) tienen signos opuestos, es decir f(x<sub>i</sub>) f(x<sub>f</sub>) &lt; 0, entonces hay al menos una raíz real entre x<sub>i</sub> y x<sub>f</sub>.', 'Apunte de la cátedra, Raíces de Ecuaciones (teorema de Bolzano).')}
        ${chart({ x: [-0.2, 4.2], y: [-2.3, 3], ticks: { x: [1, 2, 3, 4], y: [-2, -1, 1, 2] }, curves: [{ f: f1a, cls: 'c-f', label: 'f(x)' }],
          areas: [[0.4, 0.6], [2, 2.25], [3.25, 3.5]].map(([a, b]) => ({ pts: [[a, -2.3], [b, -2.3], [b, 3], [a, 3]], cls: 'a-f' })),
          points: [0.4612, 2.0406, 3.3453].map((x) => ({ x, y: 0, cls: 'c-root', r: 4.5 })) }, 'TP 6, 1a: f(x) = −2,1 + 6,21x − 3,9x² + 0,667x³ cambia de signo tres veces: tiene tres raíces reales, cada una encerrada en un intervalo.')}
        <h2>Paso 0: encontrar el intervalo (búsqueda incremental)</h2>
        <p>Se arma una <strong>tabla de valores</strong> y se buscan los cambios de signo, como en clase. Para el TP 6, 1a:</p>
        ${scan(f1a, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4])}
        <p>Hay cambios de signo entre 0 y 0,5, entre 2 y 2,5 y entre 3 y 3,5. Afinando la tabla se achica el intervalo: los métodos de búsqueda incremental dividen el intervalo en subintervalos y analizan cada uno.</p>
        ${note('El cambio de signo garantiza <strong>al menos</strong> una raíz, no exactamente una. Y su ausencia no garantiza que no haya raíces: puede haber dos (o un número par) en el intervalo, o una raíz doble que toca el eje sin cruzarlo, como x² = 0. Además f tiene que ser continua: tg x cambia de signo en π/2 sin tener una raíz ahí.', 'warn')}
        <h2>¿Cuándo parar? El error relativo aproximado</h2>
        <p>Como no se conoce la raíz verdadera, no se puede calcular el error verdadero. Se compara cada aproximación con la anterior:</p>
        ${eq(`|ε<sub>a</sub>| = |${frac('x<sub>r</sub><sup>último</sup> − x<sub>r</sub><sup>anterior</sup>', 'x<sub>r</sub><sup>último</sup>')}| · 100`, 'Error relativo aproximado (%)')}
        ${eq('Dado δ (valor prefijado): si |ε<sub>a</sub>| &lt; δ se terminan los cálculos; si no, se sigue iterando', 'Criterio de paro')}
        <p>“Con un error del 1 %” en el TP significa δ = 1 %: se itera hasta que ε<sub>a</sub> &lt; 1 %. En la primera iteración no hay valor anterior: no se calcula error.</p>
        <h2>Dos familias de métodos</h2>
        ${table(['', 'Métodos cerrados', 'Métodos abiertos'], [
          ['Valores iniciales', 'Dos, que <strong>encierran</strong> a la raíz (cambio de signo)', 'Uno (punto fijo, Newton) o dos que no necesitan encerrarla (secante)'],
          ['Convergencia', '<strong>Siempre convergen</strong>: el intervalo se achica en cada iteración', 'Pueden <strong>diverger</strong>'],
          ['Velocidad', 'Lentos', 'Cuando convergen, mucho más rápidos'],
          ['Métodos de la materia', 'Bisección, regla falsa', 'Punto fijo, Newton Raphson, secante'],
        ])}
        ${note('Diferencia clave para el teórico: los cerrados son <strong>convergentes</strong> porque se acercan progresivamente a la raíz a medida que crece el número de iteraciones; los abiertos no garantizan eso.', 'exam')}`,
      exercises: [
        { title: 'Ubicar los intervalos', official: '6.1', level: 1, prompt: '<p>Encontrar intervalos adecuados para las raíces de a) f(x) = −2,1 + 6,21x − 3,9x² + 0,667x³; b) f(x) = tg x + x − 1 en (−π/2, π/2); c) f(x) = x³ − 3x² + 5 en [−3, 3].</p>', hints: ['Armá una tabla de valores y buscá cambios de signo.'],
          solution: { explain: `<p><b>a)</b> Tres cambios de signo (tabla de la teoría): [0,4; 0,6] (la cátedra), [2; 2,5] y [3; 3,5].</p><p><b>b)</b></p>${scan(f1b, [-1.2, -0.6, 0, 0.4, 0.5, 1, 1.4])}<p>Un solo cambio de signo, entre 0,4 y 0,5 (o [0; 1] si se quiere un intervalo más simple). f es creciente en todo el intervalo, así que la raíz es única.</p><p><b>c)</b></p>${scan(f1c, [-3, -2, -1, 0, 1, 2, 3])}<p>Un cambio de signo, entre −2 y −1. Entre 0 y 3 f se mantiene positiva (su mínimo, en x = 2, vale 1).</p>` } },
      ],
      quiz: [
        { q: 'Si f es continua y f(a)·f(b) < 0, entonces…', o: ['hay exactamente una raíz en (a, b)', 'hay al menos una raíz en (a, b)', 'no hay raíces', 'a es raíz'], a: 1, e: 'Teorema de Bolzano: al menos una.' },
        { q: 'f(x) = (x − 1)² en [0, 2]…', o: ['cambia de signo y tiene raíz', 'no cambia de signo pero tiene raíz', 'no tiene raíz', 'tiene dos raíces'], a: 1, e: 'Raíz doble: toca el eje sin cruzarlo. Los cerrados no la detectan.' },
        { q: 'El error relativo aproximado compara…', o: ['la aproximación con la raíz verdadera', 'la última aproximación con la anterior', 'f(x) con 0', 'los extremos del intervalo'], a: 1, e: '|(x_último − x_anterior)/x_último|·100.' },
        { q: 'Una ventaja de los métodos cerrados es que…', o: ['son los más rápidos', 'siempre convergen', 'necesitan un solo valor', 'no necesitan cambio de signo'], a: 1, e: 'El intervalo siempre encierra a la raíz.' },
        { q: '¿Cuál es un método abierto?', o: ['Bisección', 'Regla falsa', 'Newton Raphson', 'Búsqueda incremental'], a: 2, e: 'También punto fijo y secante.' },
      ],
      sources: [{ title: 'Apunte: Raíces de Ecuaciones', ref: 'Cátedra de Matemática Superior', points: ['Métodos cerrados: cambio de signo y búsqueda incremental.', 'Error relativo aproximado y criterio de paro.', 'Métodos abiertos: pueden diverger, pero convergen más rápido.'] }, { title: 'Métodos Numéricos para Ingenieros', ref: 'Chapra y Canale, cap. 5 y 6', points: ['Métodos gráficos, que usan intervalos y abiertos.'] }],
    },

    {
      id: 'biseccion',
      module: 'u5c',
      title: 'Método de bisección',
      keywords: 'bisección corte binario punto medio intervalo algoritmo iteraciones convergencia',
      tldr: 'La <mark>bisección</mark> (corte binario) parte el intervalo en dos mitades iguales: x<sub>r</sub> = (x<sub>i</sub> + x<sub>f</sub>)/2. Se queda con la mitad donde f cambia de signo y repite. Siempre converge, pero lento: cada iteración solo divide el intervalo por 2.',
      goals: ['Aplicar el algoritmo de bisección de la cátedra.', 'Decidir qué extremo se reemplaza con el signo de f(x<sub>i</sub>)·f(x<sub>r</sub>).', 'Resolver el TP 6, ejercicios 1 y 2 (bisección).'],
      body: `
        ${def('Método de bisección', 'Conocido como de corte binario o de partición en dos intervalos iguales, es un método de búsqueda incremental donde el intervalo se divide siempre en dos. Si la función cambia de signo sobre un intervalo, se evalúa el valor de la función en el punto medio. La posición de la raíz se determina situándola en el punto medio del subintervalo dentro del cual ocurre un cambio de signo.', 'Apunte de la cátedra.')}
        <h2>Algoritmo de la cátedra</h2>
        ${flow('Elegir x<sub>i</sub>, x<sub>f</sub> con f(x<sub>i</sub>)f(x<sub>f</sub>) &lt; 0', 'x<sub>r</sub> = (x<sub>i</sub> + x<sub>f</sub>)/2', 'Evaluar f(x<sub>i</sub>)·f(x<sub>r</sub>)', 'Reemplazar un extremo', 'Nuevo x<sub>r</sub> y ε<sub>a</sub>', '¿ε<sub>a</sub> &lt; δ?')}
        ${table(['Si…', 'La raíz está en…', 'Entonces'], [
          ['f(x<sub>i</sub>) · f(x<sub>r</sub>) &lt; 0', 'el primer subintervalo [x<sub>i</sub>, x<sub>r</sub>]', 'x<sub>f</sub> = x<sub>r</sub>'],
          ['f(x<sub>i</sub>) · f(x<sub>r</sub>) &gt; 0', 'el segundo subintervalo [x<sub>r</sub>, x<sub>f</sub>]', 'x<sub>i</sub> = x<sub>r</sub>'],
          ['f(x<sub>i</sub>) · f(x<sub>r</sub>) = 0', 'x<sub>r</sub> es la raíz', 'terminar'],
        ])}
        ${lab(0)}
        <h2>Ejemplo de clase: TP 6, 1a en [0,4; 0,6]</h2>
        ${N.T.closed('bis', f1a, 0.4, 0.6, { n: 4 })}
        <p>Se lee así: x<sub>r</sub> = 0,5 y f(0,4)·f(0,5) &lt; 0, entonces la raíz está en [0,4; 0,5]. Segunda iteración: x<sub>r</sub> = 0,45, ε<sub>a</sub> = |0,45 − 0,5|/0,45 · 100 = 11 %. Y así. La cátedra redondea f a dos decimales; el signo es lo único que importa para decidir.</p>
        <h2>¿Cuántas iteraciones hacen falta?</h2>
        <p>Después de n iteraciones el intervalo mide Δx₀/2ⁿ. Si se quiere que mida menos que una tolerancia absoluta E:</p>
        ${eq(`n ≥ log₂ ${frac('Δx₀', 'E')} = ${frac('log(Δx₀ / E)', 'log 2')}`, 'Iteraciones necesarias (Chapra)')}
        <p>Es la gran ventaja de la bisección: se sabe de antemano cuánto va a tardar, sin importar la forma de f. Para pasar de un intervalo de 1 a uno de 0,001 hacen falta 10 iteraciones (2¹⁰ = 1024).</p>
        ${note('Defecto del método: al dividir siempre por la mitad, <strong>no toma en cuenta la magnitud</strong> de f(x<sub>i</sub>) y f(x<sub>f</sub>). Si f(x<sub>i</sub>) está mucho más cerca de 0, probablemente la raíz esté más cerca de x<sub>i</sub>, pero bisección no lo aprovecha. Eso es lo que corrige la regla falsa.', 'exam')}`,
      labs: [{ type: 'roots', fn: 'p2a', method: 'bis', methods: ['bis'], title: 'Bisección paso a paso', intro: 'Tocá “Siguiente iteración”: la franja sombreada es el intervalo que encierra a la raíz y se parte al medio en cada paso. Probá cambiar los extremos o la función.' }],
      exercises: [
        { title: 'Bisección, cuatro iteraciones', official: '6.1', level: 2, prompt: '<p>Usando bisección, determinar las raíces con 4 iteraciones y calcular el error en cada una: a) −2,1 + 6,21x − 3,9x² + 0,667x³; b) tg x + x − 1 en (−π/2, π/2); c) x³ − 3x² + 5 en [−3, 3].</p>', hints: ['Los intervalos salen del ejercicio de la lección anterior.'],
          solution: { explain: `<h4>a) Las tres raíces</h4><p>[0,4; 0,6] (en clase):</p>${N.T.closed('bis', f1a, 0.4, 0.6, { n: 4 })}<p>[2; 2,5]:</p>${N.T.closed('bis', f1a, 2, 2.5, { n: 4 })}<p>[3; 3,5]:</p>${N.T.closed('bis', f1a, 3, 3.5, { n: 4 })}
            <h4>b) [0; 1]</h4>${N.T.closed('bis', f1b, 0, 1, { n: 4 })}<p>La raíz es ≈ 0,4797: con 4 iteraciones de bisección el error todavía es grande.</p>
            <h4>c) [−2; −1]</h4>${N.T.closed('bis', f1c, -2, -1, { n: 4 })}<p>La raíz es ≈ −1,1038.</p>` } },
        { title: 'Raíz positiva más chica con 1 % de error (bisección)', official: '6.2', level: 2, prompt: '<p>Con bisección, encontrar la raíz positiva más pequeña con un error del 1 %: a) x³ − x² − 2x + 1; b) 3x³ + 4x² − 8x − 1; c) 4x⁴ + 3x³ − 2x² − 3x − 1; d) 5x³ − x² − 2x − 1; e) 3x³ + 4x² − 6.</p>', hints: ['Tabulá desde 0 hacia la derecha y quedate con el primer cambio de signo.', 'b): f(0) = −1 y sigue negativa hasta pasar x = 1. La raíz negativa ≈ −0,119 no sirve.'],
          solution: { explain: P2.map(([k, l, f, a, b]) => `<h4>${k}) ${l} en [${num(a)}; ${num(b)}]</h4>${N.T.closed('bis', f, a, b, { tol: 1 })}`).join('') + '<p>El a) coincide con la clase: x = 0,44375 con ε<sub>a</sub> = 1,4 % en la iteración 6 y la 7 baja de 1 %. (En clase se paró en 1,4 %; estrictamente hay que seguir hasta que ε<sub>a</sub> &lt; 1 %.)</p>' } },
      ],
      quiz: [
        { q: 'En bisección, x_r se calcula como…', o: ['(x_i + x_f)/2', 'x_f − f(x_f)(x_i − x_f)/(f(x_i) − f(x_f))', 'g(x_i)', 'x_i − f(x_i)/f′(x_i)'], a: 0, e: 'El punto medio.' },
        { q: 'Si f(x_i)·f(x_r) > 0, el nuevo intervalo es…', o: ['[x_i, x_r]', '[x_r, x_f]', '[x_i, x_f]', 'se terminó'], a: 1, e: 'x_i y x_r tienen el mismo signo: la raíz está del otro lado.' },
        { q: 'Partiendo de un intervalo de longitud 1, después de 5 iteraciones mide…', o: ['1/5', '1/10', '1/32', '1/25'], a: 2, e: '1/2⁵.' },
        { q: 'El principal defecto de la bisección es…', o: ['puede diverger', 'no usa la magnitud de f en los extremos', 'necesita la derivada', 'no sirve para polinomios'], a: 1, e: 'Por eso es lenta.' },
        { q: 'Con 0,45 y 0,5 como aproximaciones sucesivas, ε_a = …', o: ['5 %', '10 %', '11,1 %', '0,05 %'], a: 2, e: '|0,45 − 0,5|/0,45 · 100.' },
      ],
      sources: [{ title: 'Apunte y clase: Métodos cerrados', ref: 'Cátedra de Matemática Superior', points: ['Algoritmo de bisección en 5 pasos.', 'TP 6, 1a y 2a resueltos en clase.'] }, { title: 'Métodos Numéricos para Ingenieros', ref: 'Chapra y Canale, sección 5.2', points: ['Estimación del número de iteraciones.'] }],
    },

    {
      id: 'regla-falsa',
      module: 'u5c',
      title: 'Método de la regla falsa',
      keywords: 'regla falsa falsa posición cuerda triángulos semejantes interpolación lineal extremo fijo comparación bisección',
      tldr: 'La <mark>regla falsa</mark> une f(x<sub>i</sub>) y f(x<sub>f</sub>) con una recta y toma como nueva aproximación el punto donde esa recta corta al eje: x<sub>r</sub> = x<sub>f</sub> − f(x<sub>f</sub>)(x<sub>i</sub> − x<sub>f</sub>)/(f(x<sub>i</sub>) − f(x<sub>f</sub>)). Usa la magnitud de f: casi siempre converge más rápido que la bisección.',
      goals: ['Deducir la fórmula con triángulos semejantes (teórico).', 'Aplicar el algoritmo.', 'Comparar con bisección (TP 6, ejercicio 2).'],
      body: `
        <p>Es una alternativa mejorada de la bisección. El reemplazo de la curva por una línea recta da una “posición falsa” de la raíz: de ahí el nombre.</p>
        ${lab(0)}
        <h2>Deducción con triángulos semejantes</h2>
        <p>La recta que une (x<sub>i</sub>, f(x<sub>i</sub>)) con (x<sub>f</sub>, f(x<sub>f</sub>)) corta al eje en x<sub>r</sub>. Los triángulos que se forman a cada lado son semejantes:</p>
        ${eq(`${frac('f(x<sub>i</sub>)', 'x<sub>r</sub> − x<sub>i</sub>')} = ${frac('f(x<sub>f</sub>)', 'x<sub>r</sub> − x<sub>f</sub>')}`)}
        <p>Multiplicando en cruz: f(x<sub>i</sub>)(x<sub>r</sub> − x<sub>f</sub>) = f(x<sub>f</sub>)(x<sub>r</sub> − x<sub>i</sub>). Agrupando: x<sub>r</sub>[f(x<sub>i</sub>) − f(x<sub>f</sub>)] = x<sub>f</sub>f(x<sub>i</sub>) − x<sub>i</sub>f(x<sub>f</sub>). Despejando, sumando y restando x<sub>f</sub> y agrupando:</p>
        ${eq(`x<sub>r</sub> = x<sub>f</sub> − ${frac('f(x<sub>f</sub>)(x<sub>i</sub> − x<sub>f</sub>)', 'f(x<sub>i</sub>) − f(x<sub>f</sub>)')}`, 'Fórmula de la regla falsa')}
        <p>El algoritmo es <strong>idéntico al de bisección</strong> salvo la ecuación de x<sub>r</sub>: el x<sub>r</sub> calculado reemplaza al extremo cuya f tiene el mismo signo que f(x<sub>r</sub>), así x<sub>i</sub> y x<sub>f</sub> siempre encierran a la raíz.</p>
        <h2>Ejemplo de clase: TP 6, 2a</h2>
        ${N.T.closed('rf', P2[0][2], 0.4, 0.8, { tol: 1 })}
        <p>Primera iteración: x<sub>r</sub> = 0,8 − (−0,728)(0,4 − 0,8)/(0,104 + 0,728) = 0,45. Con <strong>2 iteraciones</strong> ya tiene ε<sub>a</sub> ≈ 1,1 %, y con 3 baja de 1 %; la bisección necesitó 7.</p>
        <h2>Bisección contra regla falsa en el TP 6, ejercicio 2</h2>
        ${table(['Ecuación', 'Intervalo', 'Iteraciones bisección', 'Iteraciones regla falsa', 'Raíz'], P2.map(([k, l, f, a, b]) => [`${k}) ${l}`, `[${num(a)}; ${num(b)}]`, count('bis', f, a, b), count('rf', f, a, b), num(N.closed('rf', f, a, b, { tol: 0.0001 }).at(-1).xr, 5)]))}
        ${note('La regla falsa no es infalible: si la función es muy curva, uno de los extremos queda <strong>fijo</strong> durante muchas iteraciones y la convergencia se vuelve lenta (a veces más que la bisección). Se ve en el laboratorio con f(x) = x³ − 100 en [4; 5]: x<sub>f</sub> = 5 no se mueve nunca.', 'warn')}`,
      labs: [{ type: 'roots', fn: 'p2a', method: 'rf', methods: ['bis', 'rf'], title: 'Regla falsa contra bisección', intro: 'Con la misma función y el mismo intervalo, contá cuántas iteraciones necesita cada método para bajar de 1 %. Fijate qué extremo se queda quieto en la regla falsa.' }],
      exercises: [
        { title: 'Regla falsa con 1 % de error y comparación', official: '6.2', level: 2, prompt: '<p>Utilizar regla falsa para encontrar la raíz positiva más pequeña, con un error del 1 %, de las ecuaciones a) a e) del ejercicio 2, y comparar con la bisección.</p>',
          solution: { explain: P2.map(([k, l, f, a, b]) => `<h4>${k}) ${l} en [${num(a)}; ${num(b)}]</h4>${N.T.closed('rf', f, a, b, { tol: 1 })}`).join('') + '<p><b>Comparación</b>: ver la tabla de la teoría. En todos los casos la regla falsa necesitó menos iteraciones porque aprovecha cuánto vale f en los extremos.</p>' } },
      ],
      quiz: [
        { q: 'La regla falsa reemplaza la curva por…', o: ['una parábola', 'la recta que une f(x_i) y f(x_f)', 'la tangente', 'el punto medio'], a: 1, e: 'La intersección de esa recta con el eje da x_r.' },
        { q: 'La fórmula se deduce con…', o: ['serie de Taylor', 'triángulos semejantes', 'integración por partes', 'derivadas'], a: 1, e: 'f(x_i)/(x_r − x_i) = f(x_f)/(x_r − x_f).' },
        { q: 'La diferencia entre el algoritmo de bisección y el de regla falsa está en…', o: ['el criterio de paro', 'la ecuación para calcular x_r', 'el reemplazo de extremos', 'el error'], a: 1, e: 'Todo lo demás es idéntico.' },
        { q: 'Una debilidad de la regla falsa es que…', o: ['puede diverger', 'un extremo puede quedar fijo y volverla lenta', 'necesita f′', 'no encierra la raíz'], a: 1, e: 'Pasa con funciones muy curvas.' },
        { q: 'La regla falsa es un método…', o: ['abierto', 'cerrado', 'de un paso', 'de interpolación cuadrática'], a: 1, e: 'Mantiene la raíz encerrada.' },
      ],
      sources: [{ title: 'Apunte: Método de la Regla Falsa', ref: 'Cátedra de Matemática Superior', points: ['Deducción por triángulos semejantes y algoritmo.', 'TP 6, 2a por regla falsa resuelto en clase.'] }],
    },
  );
})();
