/* Unidad 1: Números complejos. Apunte "Números Complejos" y clase. TP 1 (ejercicios 1 a 5). */
(() => {
  const { LESSONS, h } = window.GUIDE;
  const { note, def, table, eq, frac, lab, flow } = h;

  LESSONS.push(
    {
      id: 'complejos-formas',
      module: 'u1',
      title: 'Qué es un número complejo y sus formas',
      keywords: 'complejo unidad imaginaria i binómica par ordenado polar trigonométrica módulo argumento ángulo cuadrante conjugado imaginario puro',
      tldr: 'Un número complejo es <mark>s = a + bi</mark>, con i² = −1. Se puede escribir como par ordenado (a, b), en forma binómica a + bi, en forma polar r(cos θ + i sen θ) o en forma exponencial r e<sup>iθ</sup>. Pasar de una a otra es mirar un triángulo rectángulo en el plano.',
      goals: ['Representar un complejo en el plano de Argand.', 'Calcular módulo y argumento sin equivocar el cuadrante.', 'Pasar de binómica a polar y viceversa (TP 1, ejercicios 3 y 4).'],
      body: `
        <p>No existe ningún número real que cumpla x² + 1 = 0: el cuadrado de un real nunca es negativo. Para poder resolver esas ecuaciones se agrega un número nuevo, la <strong>unidad imaginaria</strong> i, con la propiedad que la define:</p>
        ${eq('i² = −1', 'Unidad imaginaria')}
        ${def('Número complejo', 'Se puede representar un número complejo como una expresión s = a + b i, donde a y b son números reales, i la unidad imaginaria con la propiedad que i² = −1. a se llama parte real y b parte imaginaria.', 'Apunte de la cátedra, Números Complejos.')}
        <h2>Las cuatro formas</h2>
        ${table(['Forma', 'Escritura', 'Cuándo conviene'], [
          ['Par ordenado', '(a, b)', 'Para graficar: a en el eje real, b en el imaginario'],
          ['Binómica', 'a + bi', 'Para sumar y restar'],
          ['Polar o trigonométrica', 'r (cos θ + i sen θ)', 'Para multiplicar, dividir, potencias y raíces'],
          ['Exponencial', 'r e<sup>iθ</sup>', 'La forma compacta de la polar, gracias a la fórmula de Euler'],
        ])}
        <p>En el plano complejo (o de Argand), el número s = a + bi es un punto. Si se une ese punto con el origen se forma un triángulo rectángulo: la hipotenusa es el <strong>módulo</strong> r y el ángulo con el eje real es el <strong>argumento</strong> θ.</p>
        ${eq(`r = √(a² + b²) &nbsp;&nbsp; θ = tg<sup>−1</sup> ${frac('b', 'a')} &nbsp;&nbsp; a = r cos θ &nbsp;&nbsp; b = r sen θ`, 'De binómica a polar y vuelta')}
        ${lab(0)}
        <h2>La trampa del cuadrante</h2>
        <p>La calculadora devuelve tg<sup>−1</sup> entre −90° y 90°: no distingue (1, 1) de (−1, −1), porque b/a da lo mismo. Por eso <strong>primero se dibuja el número</strong>, y después se ajusta el ángulo:</p>
        ${table(['Cuadrante', 'Signos', 'Argumento'], [['I', 'a &gt; 0, b &gt; 0', 'θ = tg⁻¹(b/a)'], ['II', 'a &lt; 0, b &gt; 0', 'θ = 180° − tg⁻¹|b/a|'], ['III', 'a &lt; 0, b &lt; 0', 'θ = 180° + tg⁻¹|b/a| (o −180° + …)'], ['IV', 'a &gt; 0, b &lt; 0', 'θ = −tg⁻¹|b/a| (o 360° − …)']])}
        ${note('En el TP 1, ejercicio 4d, s = −3: el módulo es 3 y tg⁻¹(0/−3) = tg⁻¹(0) daría 0°, pero el punto está sobre el semieje real negativo. El argumento es <strong>180°</strong>: s = 3 (cos 180° + i sen 180°).', 'exam')}
        <h2>Definiciones que se toman en el teórico</h2>
        <ul>
          <li><strong>Igualdad</strong>: a + bi = c + di si y solo si a = c y b = d.</li>
          <li><strong>Imaginario puro</strong>: parte real cero, por ejemplo 3i.</li>
          <li><strong>Conjugado</strong>: mismo número con la parte imaginaria cambiada de signo. Si s = a + bi, s̄ = a − bi. Geométricamente es el reflejo respecto del eje real.</li>
        </ul>`,
      labs: [{ type: 'complex', mode: 'forms', title: 'Un complejo y sus formas', intro: 'Mové a y b. Mirá cómo cambian el módulo y el ángulo, y en qué cuadrante hay que corregir el resultado de la calculadora.' }],
      exercises: [
        { title: 'Graficar complejos', official: '1.3', level: 1, prompt: '<p>Representar gráficamente: a) 3 + 4i; b) 6 − 2i; c) (−3 + 5i) + (4 + 2i) + (6 − 3i) + (−4 − 2i); d) 6 (cos 240° + i sen 240°); e) 4 e<sup>3πi/5</sup>; f) 2 e<sup>πi/4</sup>.</p>', hints: ['Los dados en polar o exponencial conviene pasarlos a binómica: a = r cos θ, b = r sen θ.', 'En c) primero se suma todo.'],
          solution: { explain: `<p>Cada número es un punto (a, b) del plano:</p>${table(['', 'Binómica', 'Punto', 'Cuadrante'], [['a', '3 + 4i', '(3; 4)', 'I'], ['b', '6 − 2i', '(6; −2)', 'IV'], ['c', '(−3 + 4 + 6 − 4) + (5 + 2 − 3 − 2)i = 3 + 2i', '(3; 2)', 'I'], ['d', '6 cos 240° + 6i sen 240° = −3 − 5,196i', '(−3; −5,196)', 'III'], ['e', '4 cos 108° + 4i sen 108° = −1,236 + 3,804i', '(−1,236; 3,804)', 'II'], ['f', '2 cos 45° + 2i sen 45° = 1,414 + 1,414i', '(1,414; 1,414)', 'I']])}<p>3π/5 rad = 108° y π/4 rad = 45°.</p>` } },
        { title: 'Pasar a forma polar', official: '1.4', level: 2, prompt: '<p>Expresar en forma polar: a) 2 + 2√3 i; b) −5 + 5i; c) −√6 − √2 i; d) −3.</p>', hints: ['Dibujá cada uno antes de calcular el ángulo.'],
          solution: { explain: table(['', 'r', 'Ángulo de referencia', 'Cuadrante', 'Polar'], [
            ['a', '√(4 + 12) = 4', 'tg⁻¹(2√3/2) = tg⁻¹√3 = 60°', 'I', '4 (cos 60° + i sen 60°)'],
            ['b', '√(25 + 25) = 5√2 ≈ 7,071', 'tg⁻¹(5/5) = 45°', 'II', '5√2 (cos 135° + i sen 135°)'],
            ['c', '√(6 + 2) = 2√2 ≈ 2,828', 'tg⁻¹(√2/√6) = 30°', 'III', '2√2 (cos 210° + i sen 210°)'],
            ['d', '3', 'tg⁻¹(0) = 0°', 'semieje real negativo', '3 (cos 180° + i sen 180°)'],
          ]) + '<p>En c) el ángulo también se puede dar como −150°: es el mismo punto.</p>' } },
      ],
      quiz: [
        { q: '¿Qué propiedad define a la unidad imaginaria?', o: ['i = −1', 'i² = −1', 'i² = 1', '√i = −1'], a: 1, e: 'Es lo que permite resolver x² + 1 = 0.' },
        { q: 'El módulo de s = −6 + 8i es…', o: ['2', '10', '14', '√28'], a: 1, e: 'r = √(36 + 64) = 10.' },
        { q: 'El argumento de s = −1 − i es…', o: ['45°', '135°', '225°', '−45°'], a: 2, e: 'Está en el tercer cuadrante: 180° + 45° = 225° (o −135°). La calculadora daría 45°.' },
        { q: 'El conjugado de 3 − 4i es…', o: ['−3 + 4i', '3 + 4i', '−3 − 4i', '4 − 3i'], a: 1, e: 'Solo cambia el signo de la parte imaginaria.' },
        { q: 'Un imaginario puro es un complejo con…', o: ['parte imaginaria cero', 'parte real cero', 'módulo 1', 'argumento 0'], a: 1, e: 'Por ejemplo 3i.' },
        { q: '¿Qué forma conviene para multiplicar y dividir?', o: ['Binómica', 'Polar o exponencial', 'Par ordenado', 'Da igual'], a: 1, e: 'Los módulos se multiplican y los argumentos se suman.' },
      ],
      sources: [{ title: 'Apunte: Números Complejos', ref: 'Cátedra de Matemática Superior, UTN-FRT', points: ['Formas: par ordenado, binómica, polar y exponencial.', 'r = √(x² + y²), x = r cos θ, y = r sen θ.', 'Definiciones de igualdad, imaginario puro y conjugado.'] }],
    },

    {
      id: 'complejos-operaciones',
      module: 'u1',
      title: 'Operaciones con números complejos',
      keywords: 'suma resta multiplicación producto división cociente conjugado potencia moivre raíz enésima',
      tldr: 'Suma y resta: componente a componente. Producto: distributiva usando i² = −1. Cociente: se multiplica arriba y abajo por el <mark>conjugado del denominador</mark>. Potencias y raíces: en forma polar (De Moivre).',
      goals: ['Operar en binómica (TP 1, ejercicio 1).', 'Evaluar expresiones con varios complejos (ejercicio 2).', 'Calcular potencias y raíces con la forma polar.'],
      body: `
        <h2>Suma, resta y producto</h2>
        ${eq('(a + bi) ± (c + di) = (a ± c) + (b ± d) i', 'Suma y resta')}
        ${eq('(a + bi)(c + di) = ac + adi + bci + bd i² = (ac − bd) + (ad + bc) i', 'Producto')}
        <p>No hay que memorizar la fórmula del producto: es aplicar la distributiva y reemplazar i² por −1.</p>
        <h2>Cociente: el truco del conjugado</h2>
        <p>Un número de la forma c + di en el denominador no se puede “separar”. Pero (c + di)(c − di) = c² + d², que es real. Entonces se multiplica arriba y abajo por el conjugado del denominador:</p>
        ${eq(`${frac('a + bi', 'c + di')} = ${frac('(a + bi)(c − di)', '(c + di)(c − di)')} = ${frac('ac + bd', 'c² + d²')} + ${frac('bc − ad', 'c² + d²')} i`, 'Cociente')}
        ${lab(0)}
        <h2>Potencias y raíces: forma polar</h2>
        <p>En polar, multiplicar es multiplicar módulos y sumar ángulos. Repetirlo n veces da la fórmula de De Moivre:</p>
        ${eq('s<sup>n</sup> = r<sup>n</sup> (cos nθ + i sen nθ)', 'Potencia')}
        ${eq(`s<sup>1/n</sup> = r<sup>1/n</sup> [cos ${frac('θ + 2kπ', 'n')} + i sen ${frac('θ + 2kπ', 'n')}] &nbsp; k = 0, 1, …, n − 1`, 'Raíz enésima')}
        <p>Un complejo distinto de cero tiene exactamente <strong>n raíces enésimas</strong>, todas con el mismo módulo y separadas 360°/n: forman un polígono regular.</p>
        ${lab(1)}
        ${note('Si el cociente da un denominador complejo, el ejercicio no terminó: el resultado siempre se entrega como a + bi.', 'warn')}`,
      labs: [{ type: 'complex', mode: 'ops', title: 'Operaciones en el plano', intro: 'Elegí la operación y mové z₁ y z₂. La suma es un paralelogramo; el producto rota y estira.' },
        { type: 'complex', mode: 'roots', a: 0, b: 8, title: 'Raíces enésimas', intro: 'Las n raíces de s caen sobre una circunferencia de radio r^(1/n), igualmente espaciadas.' }],
      exercises: [
        { title: 'Operaciones en binómica', official: '1.1', level: 1, prompt: '<p>a) (3 + 2i) + (−7 − i); b) (8 − 6i) − (2i − 7); c) (5 + 3i) + {(−1 + 2i) + (7 − 5i)}; d) (2 − 3i)(4 + 2i); e) (−1 + 2i){(7 − 5i)(5 − 4i)}; f) (5 + 3i)/(3 − 4i); g) (3 − 2i)/(−1 + i).</p>', hints: ['En b) cuidado con el signo: −(2i − 7) = −2i + 7.', 'En f) y g) multiplicá por el conjugado del denominador.'],
          solution: { explain: `${table(['', 'Desarrollo', 'Resultado'], [
            ['a', '(3 − 7) + (2 − 1)i', '−4 + i'], ['b', '8 − 6i − 2i + 7', '15 − 8i'], ['c', '5 + 3i + 6 − 3i', '11'],
            ['d', '8 + 4i − 12i − 6i² = 8 − 8i + 6', '14 − 8i'], ['e', '(7 − 5i)(5 − 4i) = 35 − 28i − 25i + 20i² = 15 − 53i; (−1 + 2i)(15 − 53i) = −15 + 53i + 30i − 106i²', '91 + 83i'],
            ['f', '(5 + 3i)(3 + 4i) / (9 + 16) = (15 + 20i + 9i − 12)/25', '3/25 + 29/25 i'], ['g', '(3 − 2i)(−1 − i) / (1 + 1) = (−3 − 3i + 2i + 2i²)/2 = (−5 − i)/2', '−5/2 − 1/2 i'],
          ])}` } },
        { title: 'Valor numérico de expresiones', official: '1.2', level: 2, prompt: '<p>Si s₁ = 2 + i, s₂ = 3 − 2i, s₃ = −1/2 + (√3/2) i, hallar: a) s₁³ − 3s₁² + 4s₁ − 8; b) |3s₁ − 4s₂|; c) (s̄₃)²; d) |(2s₂ + s₁ − 5 − i)/(2s₁ − s₂ + 3 − i)|².</p>', hints: ['s₁² = 3 + 4i y s₁³ = s₁² · s₁.', 'En b) las barras indican módulo.'],
          solution: { explain: `<p><b>a)</b> s₁² = 4 + 4i + i² = 3 + 4i; s₁³ = (3 + 4i)(2 + i) = 2 + 11i. Entonces 2 + 11i − 9 − 12i + 8 + 4i − 8 = <b>−7 + 3i</b>.</p>
            <p><b>b)</b> 3s₁ − 4s₂ = 6 + 3i − 12 + 8i = −6 + 11i; módulo √(36 + 121) = <b>√157 ≈ 12,53</b>.</p>
            <p><b>c)</b> s̄₃ = −1/2 − (√3/2) i; (s̄₃)² = 1/4 + (√3/2) i + (3/4) i² = <b>−1/2 + (√3/2) i</b>. Es s₃ otra vez: s₃ es una raíz cúbica de la unidad.</p>
            <p><b>d)</b> Numerador: 6 − 4i + 2 + i − 5 − i = 3 − 4i. Denominador: 4 + 2i − 3 + 2i + 3 − i = 4 + 3i. |3 − 4i|² / |4 + 3i|² = 25/25 = <b>1</b>.</p>` } },
      ],
      quiz: [
        { q: '(2 + 3i)(2 − 3i) = …', o: ['4 − 9i', '13', '−5', '4 + 9'], a: 1, e: 'Un número por su conjugado da a² + b² = 4 + 9.' },
        { q: 'Para dividir (a + bi)/(c + di) se multiplica numerador y denominador por…', o: ['c + di', 'c − di', 'a − bi', 'i'], a: 1, e: 'El conjugado del denominador, para que quede c² + d² real.' },
        { q: 'Al multiplicar dos complejos en forma polar…', o: ['se suman módulos y se multiplican ángulos', 'se multiplican módulos y se suman ángulos', 'se multiplican ambos', 'se suman ambos'], a: 1, e: 'r₁r₂ [cos(θ₁ + θ₂) + i sen(θ₁ + θ₂)].' },
        { q: '¿Cuántas raíces cúbicas tiene 8i?', o: ['1', '2', '3', 'infinitas'], a: 2, e: 'n raíces enésimas, separadas 120°.' },
        { q: 'i³ es igual a…', o: ['i', '−i', '1', '−1'], a: 1, e: 'i³ = i² · i = −i.' },
      ],
      sources: [{ title: 'Apunte: Números Complejos', ref: 'Cátedra de Matemática Superior', points: ['Operaciones: suma, resta, multiplicación, división, raíz y potencia.', 'Ejercicios resueltos en clase: 1c, 1e, 1f, 2b, 2c.'] }],
    },

    {
      id: 'formula-euler',
      module: 'u1',
      title: 'Fórmula de Euler y forma exponencial',
      keywords: 'euler exponencial taylor mc laurin serie demostración e^iθ e^s',
      tldr: 'La <mark>fórmula de Euler</mark> e<sup>iθ</sup> = cos θ + i sen θ se demuestra desarrollando e<sup>x</sup>, sen θ y cos θ en serie de Mc Laurin. Gracias a ella, r(cos θ + i sen θ) = r e<sup>iθ</sup> y e<sup>a + bi</sup> = e<sup>a</sup>(cos b + i sen b).',
      goals: ['Demostrar la fórmula de Euler con series (pregunta teórica típica).', 'Escribir un complejo en forma exponencial (TP 1, ejercicio 5).'],
      body: `
        ${def('Serie de Taylor', 'Toda función continua y derivable en un punto se puede expresar mediante una suma infinita de términos en función de sus derivadas: f(x) = Σ fⁿ(x₀)(x − x₀)ⁿ / n!. Cuando se desarrolla en x₀ = 0 se llama serie de Mc Laurin.', 'Apunte de la cátedra.')}
        <h2>La demostración en tres pasos</h2>
        ${flow('Desarrollar e<sup>x</sup> en x = 0 y reemplazar x = iθ', 'Desarrollar cos θ y sen θ en x = 0', 'Sumar cos θ + i sen θ y comparar')}
        ${eq('e<sup>x</sup> = 1 + x + x²/2! + x³/3! + x⁴/4! + …', 'Mc Laurin de eˣ')}
        <p>Con x = iθ y usando i² = −1, i³ = −i, i⁴ = 1:</p>
        ${eq('e<sup>iθ</sup> = 1 + iθ − θ²/2! − iθ³/3! + θ⁴/4! + iθ⁵/5! − …', '(1)')}
        <p>Las derivadas sucesivas de sen θ en 0 son 0, 1, 0, −1, 0, 1… y las de cos θ son 1, 0, −1, 0, 1… Entonces:</p>
        ${eq('sen θ = θ − θ³/3! + θ⁵/5! − … &nbsp;&nbsp; cos θ = 1 − θ²/2! + θ⁴/4! − …', 'Mc Laurin de seno y coseno')}
        ${eq('cos θ + i sen θ = 1 + iθ − θ²/2! − iθ³/3! + θ⁴/4! + iθ⁵/5! − …', '(2)')}
        <p>Las series (1) y (2) son idénticas término a término. Queda demostrado:</p>
        ${eq('e<sup>iθ</sup> = cos θ + i sen θ', 'Fórmula de Euler')}
        ${note('Si θ = π: e<sup>iπ</sup> = −1, es decir e<sup>iπ</sup> + 1 = 0. Une los cinco números más importantes de la matemática.', 'tip')}
        <h2>Forma exponencial</h2>
        <p>Reemplazando en la forma polar: <strong>s = r(cos θ + i sen θ) = r e<sup>iθ</sup></strong>, con θ en radianes. Y la exponencial de un complejo s = x + iy se separa así:</p>
        ${eq('e<sup>s</sup> = e<sup>x + iy</sup> = e<sup>x</sup> · e<sup>iy</sup> = e<sup>x</sup> (cos y + i sen y)', 'Exponencial de un complejo')}
        ${note('En el TP 1, ejercicio 5, la cátedra pide “expresar según la forma exponencial” calculando <strong>e<sup>s</sup> = e<sup>x</sup>(cos y + i sen y)</strong> a partir de la forma binómica de s. Por ejemplo, para s = −3 − 5,22i: e<sup>s</sup> = e<sup>−3</sup>(cos(−5,22) + i sen(−5,22)). Conviene saber escribir las dos: r e<sup>iθ</sup> y e<sup>s</sup>.', 'exam')}`,
      exercises: [
        { title: 'Forma exponencial de los complejos del ejercicio 3', official: '1.5', level: 2, prompt: '<p>Expresar los números complejos del ejercicio 3 según la forma exponencial.</p>', hints: ['Pasá cada uno a binómica s = x + iy y aplicá e<sup>s</sup> = e<sup>x</sup>(cos y + i sen y), con y en radianes.'],
          solution: { explain: table(['', 's = x + iy', 'r e^(iθ)', 'e^s = e^x (cos y + i sen y)'], [
            ['a', '3 + 4i', '5 e<sup>0,9273 i</sup>', 'e³ (cos 4 + i sen 4)'], ['b', '6 − 2i', '6,325 e<sup>−0,3218 i</sup>', 'e⁶ (cos(−2) + i sen(−2))'],
            ['c', '3 + 2i', '3,606 e<sup>0,5880 i</sup>', 'e³ (cos 2 + i sen 2)'], ['d', '−3 − 5,196i', '6 e<sup>4,1888 i</sup> (240°)', 'e<sup>−3</sup> (cos(−5,196) + i sen(−5,196))'],
            ['e', '−1,236 + 3,804i', '4 e<sup>1,885 i</sup> (3π/5)', 'e<sup>−1,236</sup> (cos 3,804 + i sen 3,804)'], ['f', '1,414 + 1,414i', '2 e<sup>0,7854 i</sup> (π/4)', 'e<sup>1,414</sup> (cos 1,414 + i sen 1,414)'],
          ]) + '<p>La última columna es la que resolvió la cátedra en clase (ejemplos d y f).</p>' } },
      ],
      quiz: [
        { q: 'La fórmula de Euler dice que e^(iθ) = …', o: ['cos θ − i sen θ', 'cos θ + i sen θ', 'sen θ + i cos θ', 'e^θ (cos θ + i)'], a: 1, e: 'Se demuestra con las series de Mc Laurin.' },
        { q: 'La serie de Mc Laurin es la serie de Taylor desarrollada en…', o: ['x = 1', 'x = 0', 'x = π', 'cualquier punto'], a: 1, e: 'f(x) = Σ fⁿ(0) xⁿ / n!.' },
        { q: 'e^(2 + 3i) es igual a…', o: ['e²(cos 3 + i sen 3)', 'e³(cos 2 + i sen 2)', '2 e^(3i) + 1', 'e^5'], a: 0, e: 'eˣ⁺ⁱʸ = eˣ (cos y + i sen y).' },
        { q: 'En la demostración, ¿qué propiedad de i se usa para separar los términos reales e imaginarios?', o: ['i = √−1 solamente', 'las potencias de i se repiten: i, −1, −i, 1', 'i es real', '|i| = 0'], a: 1, e: 'i² = −1, i³ = −i, i⁴ = 1, y el ciclo se repite.' },
        { q: '¿Cuánto vale e^(iπ)?', o: ['1', '−1', 'i', '0'], a: 1, e: 'cos π + i sen π = −1.' },
      ],
      sources: [{ title: 'Apunte: Números Complejos', ref: 'Cátedra de Matemática Superior', points: ['Demostración de la fórmula de Euler por serie de Mc Laurin.', 'Forma exponencial: e^s = e^x (cos y + i sen y).'] }],
    },

    {
      id: 'complejos-polinomios',
      module: 'u1',
      title: 'A fondo: raíces complejas de polinomios y ecuación característica',
      keywords: 'teorema fundamental del álgebra raíces complejas conjugadas polinomio ecuación característica discriminante sobreamortiguado crítico subamortiguado chapra burden',
      tldr: 'Los complejos aparecen solos en el resto de la materia: un polinomio de grado n con coeficientes reales tiene <mark>n raíces</mark> (contando multiplicidad) y las complejas vienen en <strong>pares conjugados</strong> λ ± μi. Con la fórmula de Euler, cada par se convierte en e<sup>λt</sup>(cos μt, sen μt): por eso en Laplace y en la función de transferencia aparecen oscilaciones.',
      goals: ['Enunciar el teorema fundamental del álgebra y la regla de los pares conjugados.', 'Relacionar el discriminante de la ecuación característica con la forma de la solución.', 'Usar la fórmula de Euler para pasar de exponenciales complejas a senos y cosenos.'],
      body: `
        ${def('Teorema fundamental del álgebra', 'Si P(x) es un polinomio de grado n ≥ 1 con coeficientes reales o complejos, entonces P(x) = 0 tiene por lo menos una raíz (posiblemente compleja).', 'Burden, Faires y Burden, Análisis numérico, 10ª ed., teorema 2.16.')}
        <p>Aplicándolo una y otra vez (se divide P por (x − x₁) y el cociente vuelve a tener una raíz) se llega al corolario 2.17 de Burden: P se factoriza como a<sub>n</sub>(x − x₁)<sup>m₁</sup>(x − x₂)<sup>m₂</sup>…(x − x<sub>k</sub>)<sup>m<sub>k</sub></sup> con m₁ + … + m<sub>k</sub> = n. Chapra lo resume en tres reglas (sección 7.1):</p>
        ${table(['Regla', 'Consecuencia práctica'], [
          ['Una ecuación de grado n tiene n raíces reales o complejas (no necesariamente distintas)', 'El denominador de grado 2 de una función de transferencia siempre tiene 2 polos: reales distintos, uno doble o dos complejos'],
          ['Si n es impar, hay al menos una raíz real', 'Un polinomio cúbico como los del 2do parcial (3x³ + 2x − 4) siempre cruza el eje x: hay raíz para buscar con bisección o Newton'],
          ['Si los coeficientes son reales, las raíces complejas vienen en pares conjugados λ ± μi', 'Las fracciones simples con polos complejos se agrupan de a dos y dan senos y cosenos reales'],
        ])}
        <h2>Por qué los pares conjugados</h2>
        <p>Si P tiene coeficientes reales y P(z) = 0, al conjugar toda la igualdad se obtiene P(z̄) = 0̄ = 0, porque conjugar una suma o un producto es sumar o multiplicar los conjugados y los coeficientes reales no cambian. Además (x − z)(x − z̄) = x² − 2λx + (λ² + μ²) tiene coeficientes reales: el par entero se puede tratar como un factor cuadrático real, que es justamente lo que se hace al <strong>completar cuadrados</strong> en Laplace.</p>
        <h2>La ecuación característica (Chapra, sección 7.1)</h2>
        <p>Para una ecuación diferencial lineal a y″ + b y′ + c y = 0 se prueba y = e<sup>rt</sup> y queda el polinomio <strong>a r² + b r + c = 0</strong>, la ecuación característica. Sus raíces son exactamente los <strong>polos</strong> que después aparecen en el denominador de Y(s) o de P(s).</p>
        ${table(['Discriminante b² − 4ac', 'Raíces', 'Solución', 'Nombre (Chapra)'], [
          ['&gt; 0', 'reales distintas r₁, r₂', 'c₁e<sup>r₁t</sup> + c₂e<sup>r₂t</sup>', 'sobreamortiguado'],
          ['= 0', 'real doble λ', '(c₁ + c₂t) e<sup>λt</sup>', 'amortiguamiento crítico'],
          ['&lt; 0', 'complejas λ ± μi', 'e<sup>λt</sup>(c₁ cos μt + c₂ sen μt)', 'subamortiguado'],
        ])}
        <p>En el caso complejo, la fórmula de Euler e<sup>iμt</sup> = cos μt + i sen μt convierte c₁e<sup>(λ+μi)t</sup> + c₂e<sup>(λ−μi)t</sup> en senos y cosenos multiplicados por e<sup>λt</sup>: la <strong>parte real λ</strong> decide si la respuesta decae (λ &lt; 0) o crece (λ &gt; 0), y la <strong>parte imaginaria μ</strong> es la frecuencia de oscilación.</p>
        ${note('Ejemplo del 1er parcial 2025 A: y″ + 6y′ + 10y = 5u′ + 15u. La ecuación característica s² + 6s + 10 = 0 tiene discriminante 36 − 40 = −4 &lt; 0 y raíces −3 ± i. La respuesta oscila con frecuencia 1 y se apaga como e<sup>−3t</sup>.', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'classify', title: '¿Cómo son las raíces?', buckets: ['Reales distintas', 'Real doble', 'Complejas conjugadas'], items: [
        { t: 's² + 5s + 4', b: 0, why: '25 − 16 = 9 &gt; 0: raíces −1 y −4.' },
        { t: 's² + 6s + 10', b: 2, why: '36 − 40 = −4 &lt; 0: −3 ± i.' },
        { t: 's² + 10s + 25', b: 1, why: '100 − 100 = 0: −5 doble (1P 2025 A, 1b).' },
        { t: 's² − 2s − 3', b: 0, why: '4 + 12 = 16: raíces 3 y −1.' },
        { t: '2s² + 8s + 26', b: 2, why: '64 − 208 &lt; 0: −2 ± 3i (1P 2024, tema 2).' },
        { t: '3s² + 18s + 30', b: 2, why: '324 − 360 &lt; 0: −3 ± i (1P 2024, tema 1).' },
      ] }],
      quiz: [
        { q: 'Un polinomio de grado 5 con coeficientes reales tiene…', o: ['exactamente 5 raíces reales', 'al menos una raíz real', 'ninguna raíz real necesariamente', 'solo raíces complejas'], a: 1, e: 'Grado impar: al menos una real (Chapra 7.1). Las complejas van de a pares.' },
        { q: 'Si 2 + 3i es raíz de un polinomio de coeficientes reales, también lo es…', o: ['−2 + 3i', '2 − 3i', '3 + 2i', '−2 − 3i'], a: 1, e: 'Su conjugado.' },
        { q: 'Las raíces de s² + 4s + 13 son…', o: ['−2 ± 3i', '2 ± 3i', '−4 y −13', '−2 ± 9i'], a: 0, e: '(−4 ± √(16 − 52))/2 = −2 ± 3i.' },
        { q: 'Con raíces características −1 ± 2i, la respuesta…', o: ['crece oscilando', 'oscila y se apaga como e^(−t)', 'decae sin oscilar', 'es una recta'], a: 1, e: 'Parte real −1: decae. Parte imaginaria 2: oscila con frecuencia 2.' },
        { q: 'La raíz doble de la ecuación característica da una solución del tipo…', o: ['c₁e^(λt) + c₂e^(λt)', '(c₁ + c₂t)e^(λt)', 'c₁ cos λt', 'c₁t²'], a: 1, e: 'Amortiguamiento crítico: aparece el factor t, como el término t e^(pt) de un polo doble en Laplace.' },
      ],
      sources: [
        { title: 'Análisis numérico', ref: 'Burden, Faires y Burden, 10ª ed., sección 2.6', points: ['Teorema 2.16 (fundamental del álgebra) y corolario 2.17 (factorización en n raíces con multiplicidad).', 'Corolario 2.18: dos polinomios de grado ≤ n que coinciden en más de n puntos son iguales (base de la unicidad del polinomio interpolante).'] },
        { title: 'Métodos numéricos para ingenieros', ref: 'Chapra y Canale, 5ª ed., sección 7.1', points: ['Reglas de las raíces de un polinomio (n raíces, al menos una real si n es impar, complejas en pares conjugados).', 'Ecuación característica de una EDO lineal de segundo orden: casos sobreamortiguado, crítico y subamortiguado; uso de la fórmula de Euler.'] },
      ],
    },
  );
})();
