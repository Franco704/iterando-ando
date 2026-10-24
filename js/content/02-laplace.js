/* Unidad 2: Transformada de Laplace directa e inversa. Apunte "Transformada de Laplace" y clase. TP 2 (ejercicios 1 a 5). */
(() => {
  const { LESSONS, h } = window.GUIDE;
  const { note, def, table, eq, frac, lab, flow } = h;
  const TABLA = table(['', 'f(t)', 'F(s) = ℒ{f(t)}'], [
    ['1', 'Impulso unitario δ(t)', '1'], ['2', 'Escalón unitario 1(t)', `${frac('1', 's')}`], ['3', 'Rampa unitaria t', `${frac('1', 's²')}`],
    ['4', 'Polinomio tⁿ', `${frac('n!', 's<sup>n+1</sup>')}`], ['5', 'Exponencial e<sup>at</sup>', `${frac('1', 's − a')}`],
    ['6', 'sen ωt', `${frac('ω', 's² + ω²')}`], ['7', 'cos ωt', `${frac('s', 's² + ω²')}`], ['8', 'senh ωt', `${frac('ω', 's² − ω²')}`], ['9', 'cosh ωt', `${frac('s', 's² − ω²')}`],
  ]);

  LESSONS.push(
    {
      id: 'laplace-definicion',
      module: 'u2',
      title: 'Definición de la transformada de Laplace',
      keywords: 'transformada laplace definición integral impropia variable compleja s dominio tiempo frecuencia convergencia',
      tldr: 'La transformada de Laplace convierte una función del tiempo f(t) en una función F(s) de la variable compleja s = σ + jω mediante <mark>F(s) = ∫₀^∞ e<sup>−st</sup> f(t) dt</mark>. Convierte derivadas en productos por s: las ecuaciones diferenciales se vuelven algebraicas.',
      goals: ['Enunciar la definición de la transformada y de su inversa.', 'Calcular por definición ℒ{1}, ℒ{t} y ℒ{e^{at}} (TP 2, ejercicio 1).', 'Explicar para qué sirve pasar al dominio s.'],
      body: `
        ${def('Transformada de Laplace', 'Sea f(t) una función real de una variable real t, definida para t &gt; 0. Se llama transformada de Laplace de f(t) a ℒ{f(t)} ≡ F(s) ≡ ∫₀₊^∞ e<sup>−st</sup> f(t) dt, donde s es una variable compleja definida por s = σ + jω, σ y ω variables reales, y la variable real t siempre representa el tiempo.', 'Apunte de la cátedra, Transformada de Laplace.')}
        ${eq(`ℒ{f(t)} = F(s) = ∫<sub>0</sub><sup>∞</sup> e<sup>−st</sup> f(t) dt`, 'Definición')}
        <p>Es una <strong>técnica de transformación</strong> para el análisis de sistemas lineales: relaciona funciones del tiempo con funciones de una variable compleja asociada a la frecuencia. El esquema de trabajo siempre es el mismo:</p>
        ${flow('Problema en t (EDO)', 'ℒ: pasar a s', 'Resolver con álgebra', 'ℒ⁻¹: volver a t')}
        <h2>Una interpretación visual</h2>
        <p>Para cada valor de s, F(s) es un número: el <strong>área bajo e<sup>−st</sup>·f(t)</strong>. El factor e<sup>−st</sup> “apaga” la función a medida que t crece; si f crece más rápido de lo que e<sup>−st</sup> la apaga, la integral diverge y la transformada no existe para ese s.</p>
        ${lab(0)}
        <h2>Tres transformadas por definición</h2>
        <h3>ℒ{1}</h3>
        ${eq(`∫<sub>0</sub><sup>∞</sup> e<sup>−st</sup> dt = [−${frac('e<sup>−st</sup>', 's')}]<sub>0</sub><sup>∞</sup> = 0 + ${frac('1', 's')} = ${frac('1', 's')} &nbsp; (s &gt; 0)`)}
        <h3>ℒ{t}: por partes</h3>
        <p>Con u = t, du = dt, dv = e<sup>−st</sup>dt, v = −e<sup>−st</sup>/s:</p>
        ${eq(`∫<sub>0</sub><sup>∞</sup> t e<sup>−st</sup> dt = [−${frac('t e<sup>−st</sup>', 's')}]<sub>0</sub><sup>∞</sup> + ${frac('1', 's')} ∫<sub>0</sub><sup>∞</sup> e<sup>−st</sup> dt = 0 + ${frac('1', 's')} · ${frac('1', 's')} = ${frac('1', 's²')}`)}
        <p>El primer término es 0 porque t/e<sup>st</sup> → 0 cuando t → ∞ (L'Hôpital: 1/(s e<sup>st</sup>) → 0).</p>
        <h3>ℒ{e<sup>at</sup>}</h3>
        ${eq(`∫<sub>0</sub><sup>∞</sup> e<sup>−st</sup> e<sup>at</sup> dt = ∫<sub>0</sub><sup>∞</sup> e<sup>−(s−a)t</sup> dt = ${frac('1', 's − a')} &nbsp; (s &gt; a)`)}
        <h2>La inversa</h2>
        ${def('Transformada inversa de Laplace', 'Sea F(s) la transformada de Laplace de una función f(t), para t &gt; 0. La transformada inversa es ℒ⁻¹{F(s)} ≡ f(t) = (1 / 2πj) ∫ de c − j∞ a c + j∞ de F(s) e<sup>st</sup> ds.', 'Apunte de la cátedra.')}
        ${note('En la práctica la integral de inversión no se calcula: se lleva F(s) a formas de la tabla (con propiedades y fracciones simples) y se lee f(t). Pero la definición puede aparecer en el teórico.', 'exam')}`,
      labs: [{ type: 'laplace', fn: 'one', title: 'La transformada es un área', intro: 'Elegí f(t) y mové s. El número F(s) es el área sombreada; compará con la fórmula de la tabla.' }],
      exercises: [
        { title: 'Transformadas por definición', official: '2.1', level: 2, prompt: '<p>Obtener por definición: a) ℒ{1}; b) ℒ{t}; c) ℒ{e<sup>at</sup>}.</p>', hints: ['b) sale por partes.', 'c) junta los exponentes: e<sup>−(s−a)t</sup>.'], solution: { explain: '<p>a) 1/s (s &gt; 0). b) 1/s² (s &gt; 0). c) 1/(s − a) (s &gt; a). El desarrollo completo está en la teoría de esta lección.</p>' } },
      ],
      quiz: [
        { q: 'La transformada de Laplace se define como…', o: ['∫₀^∞ e^(st) f(t) dt', '∫₀^∞ e^(−st) f(t) dt', '∫₋∞^∞ f(t) dt', 'df/dt evaluada en s'], a: 1, e: 'El núcleo es e^(−st).' },
        { q: 'La variable s es…', o: ['real positiva', 'compleja, s = σ + jω', 'el tiempo', 'entera'], a: 1, e: 'Por eso se habla del dominio de la frecuencia compleja.' },
        { q: 'ℒ{e^(3t)} existe solo si…', o: ['s > 0', 's > 3', 's < 3', 'siempre'], a: 1, e: 'e^(−(s−3)t) tiene que decrecer.' },
        { q: '¿Para qué sirve la transformada en esta materia?', o: ['Para derivar más rápido', 'Para convertir ecuaciones diferenciales lineales en algebraicas', 'Para calcular raíces', 'Para interpolar'], a: 1, e: 'Las derivadas pasan a ser productos por s.' },
        { q: 'Al calcular ℒ{t} por definición se usa…', o: ['sustitución trigonométrica', 'integración por partes', 'fracciones simples', 'series'], a: 1, e: 'u = t, dv = e^(−st) dt.' },
      ],
      sources: [{ title: 'Apunte y clase: Transformada de Laplace', ref: 'Cátedra de Matemática Superior', points: ['Definición directa e inversa.', 'TP 2, ejercicio 1 resuelto en clase (a y b).'] }],
    },

    {
      id: 'laplace-propiedades',
      module: 'u2',
      title: 'Tabla y propiedades de la transformada',
      keywords: 'tabla linealidad traslación compleja desplazamiento derivadas condiciones iniciales seno coseno senh cosh polinomio',
      tldr: 'Con la <mark>tabla</mark> y tres propiedades se transforma casi todo: <strong>linealidad</strong> (la transformada de una combinación es la combinación de transformadas), <strong>traslación</strong> (multiplicar por e<sup>at</sup> es reemplazar s por s − a) y <strong>derivadas</strong> (ℒ{f′} = sF(s) − f(0)).',
      goals: ['Usar la tabla de la cátedra.', 'Aplicar linealidad, traslación y derivadas (TP 2, ejercicio 2).'],
      body: `
        <h2>Tabla de la cátedra</h2>
        ${TABLA}
        <h2>Linealidad</h2>
        ${eq('ℒ{c₁f₁(t) + c₂f₂(t)} = c₁F₁(s) + c₂F₂(s)', 'También vale para la inversa')}
        <p>Ejemplo del apunte: ℒ{4t² − 3 cos 2t + 5e<sup>−t</sup>} = 4·2!/s³ − 3·s/(s² + 4) + 5/(s + 1) = 8/s³ − 3s/(s² + 4) + 5/(s + 1).</p>
        <h2>Traslación compleja</h2>
        ${eq('ℒ{e<sup>at</sup> f(t)} = F(s − a)', 'Primer teorema de traslación')}
        <p>Se transforma f(t) sin la exponencial y después se cambia cada s por (s − a). Ejemplo: ℒ{cos 3t} = s/(s² + 9), entonces ℒ{e<sup>2t</sup> cos 3t} = (s − 2)/((s − 2)² + 9).</p>
        ${note('Cuidado con el signo: e<sup>−2t</sup> corresponde a a = −2, y se reemplaza s por s + 2. Es el error más común del TP 2.', 'warn')}
        ${lab(0)}
        <h2>Transformada de las derivadas</h2>
        ${eq('ℒ{f′(t)} = sF(s) − f(0⁺)', 'Primera derivada')}
        ${eq('ℒ{f″(t)} = s²F(s) − s f(0⁺) − f′(0⁺)', 'Segunda derivada')}
        ${eq('ℒ{fⁿ(t)} = sⁿF(s) − sⁿ⁻¹f(0⁺) − sⁿ⁻²f′(0⁺) − … − fⁿ⁻¹(0⁺)', 'Generalización')}
        <p>Las condiciones iniciales entran solas en la ecuación: esta es la propiedad que hace que Laplace resuelva ecuaciones diferenciales. Ejemplo: f(t) = sen 3t, f(0) = 0, f′(0) = 3: ℒ{f″} = s²·3/(s² + 9) − 0 − 3 = −27/(s² + 9), que es ℒ{−9 sen 3t}. ✓</p>`,
      labs: [{ type: 'laplace', fn: 'cos', title: 'Traslación: multiplicar por e^(at)', intro: 'Mové el control de traslación: multiplicar f(t) por e^(at) cambia el área exactamente como evaluar F en s − a.' }],
      exercises: [
        { title: 'Transformadas aplicando propiedades', official: '2.2', level: 2, prompt: '<p>a) ℒ{4e<sup>5t</sup> + 6t³ − 3 sen 4t + 2 cos 2t}; b) ℒ{3e<sup>t</sup> − 2t⁴ + 5 sen 2t − 3 cos 5t}; c) ℒ{t² e<sup>3t</sup>}; d) ℒ{e<sup>−2t</sup> sen 4t}; e) ℒ{e<sup>4t</sup> cosh 5t}; f) ℒ{e<sup>−2t</sup>(3 cos 6t − 5 sen 6t)}; g) ℒ{e<sup>5t</sup>(2 cosh 4t + 3 senh 5t)}; h) ℒ{3 cosh 4t − 2t⁶ + 5 sen 6t − 7e<sup>−4t</sup>}; i) ℒ{e<sup>3t</sup> senh 2t}; j) ℒ{e<sup>−3t</sup> cos 2t}.</p>', hints: ['a, b y h: linealidad y tabla.', 'c a g, i, j: traslación.'],
          solution: { explain: table(['', 'Resultado'], [
            ['a', '4/(s − 5) + 36/s⁴ − 12/(s² + 16) + 2s/(s² + 4)'], ['b', '3/(s − 1) − 48/s⁵ + 10/(s² + 4) − 3s/(s² + 25)'],
            ['c', '2/(s − 3)³'], ['d', '4/((s + 2)² + 16) = 4/(s² + 4s + 20)'], ['e', '(s − 4)/((s − 4)² − 25) = (s − 4)/(s² − 8s − 9)'],
            ['f', '[3(s + 2) − 30]/((s + 2)² + 36) = (3s − 24)/(s² + 4s + 40)'], ['g', '2(s − 5)/((s − 5)² − 16) + 15/((s − 5)² − 25)'],
            ['h', '3s/(s² − 16) − 1440/s⁷ + 30/(s² + 36) − 7/(s + 4)'], ['i', '2/((s − 3)² − 4) = 2/(s² − 6s + 5)'], ['j', '(s + 3)/((s + 3)² + 4) = (s + 3)/(s² + 6s + 13)'],
          ]) + '<p>En b), 2·4! = 48; en h), 2·6! = 1440. Resueltos en clase: b, c, i.</p>' } },
      ],
      quiz: [
        { q: 'ℒ{e^(−2t) cos 3t} = …', o: ['(s − 2)/((s − 2)² + 9)', '(s + 2)/((s + 2)² + 9)', 's/(s² + 9) − 2', '3/((s + 2)² + 9)'], a: 1, e: 'a = −2: s se reemplaza por s + 2.' },
        { q: 'ℒ{t³} = …', o: ['3/s⁴', '6/s⁴', '1/s³', '6/s³'], a: 1, e: 'n!/sⁿ⁺¹ = 3!/s⁴.' },
        { q: 'ℒ{y″(t)} = …', o: ['s²Y(s)', 's²Y(s) − s y(0) − y′(0)', 's²Y(s) − y(0) − s y′(0)', 'sY(s) − y(0)'], a: 1, e: 'Generalización de la transformada de la derivada.' },
        { q: 'ℒ{senh 2t} = …', o: ['2/(s² + 4)', '2/(s² − 4)', 's/(s² − 4)', '1/(s − 2)'], a: 1, e: 'ω/(s² − ω²).' },
        { q: 'La propiedad de linealidad dice que…', o: ['ℒ{f·g} = F·G', 'ℒ{c₁f₁ + c₂f₂} = c₁F₁ + c₂F₂', 'ℒ{f′} = sF', 'ℒ{e^(at)f} = F(s − a)'], a: 1, e: 'La transformada del producto NO es el producto de las transformadas.' },
      ],
      sources: [{ title: 'Apunte: Transformada de Laplace', ref: 'Cátedra de Matemática Superior', points: ['Tabla resumida de 9 transformadas.', 'Linealidad, traslación compleja y transformada de las derivadas.'] }],
    },

    {
      id: 'escalon-rampa-impulso',
      module: 'u2',
      title: 'Escalón, rampa e impulso unitario',
      keywords: 'escalón unitario heaviside rampa impulso delta dirac entrada señal prueba',
      tldr: 'Son las tres <mark>señales de prueba</mark> de los sistemas: el escalón u(t) (encender algo y dejarlo), la rampa t·u(t) (una entrada que crece a ritmo constante) y el impulso δ(t) (un golpe instantáneo). Sus transformadas son 1/s, 1/s² y 1.',
      goals: ['Definir escalón, rampa e impulso y dar sus transformadas.', 'Relacionar las tres por derivación.'],
      body: `
        ${table(['Señal', 'Definición', 'ℒ', 'Interpretación'], [
          ['Escalón unitario u(t) o 1(t)', 'u(t) = 1 si t ≥ 0; 0 si t &lt; 0', '1/s', 'Encender una llave y dejarla encendida'],
          ['Rampa unitaria', 'r(t) = t · u(t)', '1/s²', 'Una entrada que aumenta a velocidad constante'],
          ['Impulso unitario δ(t)', 'Pulso de área 1 y duración → 0', '1', 'Un golpe instantáneo; “contiene todas las frecuencias”'],
        ])}
        ${h.chart({ x: [-1, 4], y: [-0.3, 2.2], xl: 't', yl: '', w: 440, h: 230, alt: 'Escalón, rampa e impulso', ticks: { x: [1, 2, 3] },
          curves: [{ pts: [[-1, 0], [0, 0]], cls: 'c-f' }, { pts: [[0, 1], [4, 1]], cls: 'c-f', label: 'u(t)', at: 3 }, { pts: [[0, 0], [2.2, 2.2]], cls: 'c-g', label: 'r(t) = t', at: 1.6 }],
          arrows: [{ from: [0, 0], to: [0, 2], cls: 'c-root' }], texts: [{ x: 0.35, y: 2, t: 'δ(t)', cls: 'c-root' }] }, 'Escalón (azul), rampa (violeta) e impulso (naranja, se dibuja como una flecha de área 1).')}
        <p>Las tres están encadenadas: la derivada de la rampa es el escalón y la “derivada” del escalón es el impulso. En s, derivar es multiplicar por s: 1/s² → 1/s → 1.</p>
        ${note('En el TP 4 la entrada es el escalón u(t) = 1 si t ≥ 0. Por eso Y(s) = P(s) · (1/s): aparece siempre un polo en s = 0, que da el valor final de la respuesta.', 'exam')}`,
      quiz: [
        { q: 'ℒ{u(t)} = …', o: ['1', '1/s', '1/s²', 's'], a: 1, e: 'El escalón es la constante 1 para t ≥ 0.' },
        { q: 'ℒ{δ(t)} = …', o: ['0', '1', '1/s', '∞'], a: 1, e: 'El impulso unitario transforma en 1.' },
        { q: 'La rampa unitaria es…', o: ['la derivada del escalón', 'la integral del escalón', 'el impulso', 'e^t'], a: 1, e: 'Su derivada es el escalón.' },
        { q: 'Con entrada escalón, Y(s) = P(s) multiplicado por…', o: ['1', 's', '1/s', '1/s²'], a: 2, e: 'U(s) = 1/s.' },
      ],
      sources: [{ title: 'Tabla de la cátedra', ref: 'Anexo de los TP 2, 3 y 4', points: ['Impulso unitario → 1, paso unitario → 1/s, rampa → 1/s².'] }],
    },

    {
      id: 'laplace-inversa',
      module: 'u2',
      title: 'Transformada inversa: llevar a la tabla',
      keywords: 'inversa antitransformada completar cuadrados ajustar constantes separar numerador traslación inversa',
      tldr: 'Para invertir se lleva F(s) a formas de la tabla con tres trucos: <mark>ajustar constantes</mark> (multiplicar y dividir para que aparezca n! o ω), <strong>separar el numerador</strong> en términos y <strong>completar cuadrados</strong> en el denominador para usar la traslación.',
      goals: ['Invertir transformadas directas de tabla (TP 2, ejercicio 3).', 'Invertir aplicando propiedades (ejercicio 4).'],
      body: `
        <h2>Truco 1: ajustar constantes</h2>
        <p>ℒ⁻¹{1/(s² + 9)}: en la tabla, sen 3t ↔ 3/(s² + 9). Falta un 3 arriba: se multiplica y divide por 3.</p>
        ${eq(`ℒ⁻¹{${frac('1', 's² + 9')}} = ${frac('1', '3')} ℒ⁻¹{${frac('3', 's² + 9')}} = ${frac('1', '3')} sen 3t`)}
        <p>Igual con potencias: ℒ⁻¹{1/s⁴} = (1/3!) ℒ⁻¹{3!/s⁴} = t³/6.</p>
        <h2>Truco 2: separar el numerador</h2>
        <p>Si arriba hay una suma, se parte en fracciones: (2s − 18)/(s² + 9) = 2·s/(s² + 9) − 6·3/(s² + 9) → 2 cos 3t − 6 sen 3t.</p>
        <h2>Truco 3: coeficiente principal distinto de 1</h2>
        <p>Primero se saca factor común para que s² quede solo: 6s/(16s² + 9) = (6/16)·s/(s² + 9/16) → (3/8) cos(3t/4).</p>
        <h2>Truco 4: completar cuadrados y traslación inversa</h2>
        ${flow('Completar cuadrado: s² + bs + c = (s + b/2)² + k', 'Escribir el numerador en función de (s + b/2)', 'Leer e<sup>−(b/2)t</sup> por cos o sen')}
        ${eq(`${frac('6s − 4', 's² − 4s + 20')} = ${frac('6(s − 2) + 8', '(s − 2)² + 16')} = 6${frac('s − 2', '(s − 2)² + 16')} + 2${frac('4', '(s − 2)² + 16')} → 6e<sup>2t</sup> cos 4t + 2e<sup>2t</sup> sen 4t`, 'TP 2, 4c')}
        ${note('Si el denominador completado queda (s − a)² <strong>menos</strong> algo, se usan senh y cosh; si queda <strong>más</strong>, sen y cos. Si el discriminante es positivo también se puede factorizar y hacer fracciones simples: dan lo mismo (cosh y senh son combinaciones de exponenciales).', 'tip')}`,
      exercises: [
        { title: 'Inversas directas de tabla', official: '2.3', level: 1, prompt: '<p>a) 1/(s − a); b) 1/sⁿ⁺¹; c) a/(s² + a²); d) s/(s² + a²); e) a/(s² − a²); f) s/(s² − a²); g) 1/(s² + 9); h) 1/s⁴; i) s/(s² − 16); j) 4/(s − 2); k) s/(s² + 2); l) 1/(s² − 3).</p>',
          solution: { explain: table(['', 'f(t)', '', 'f(t)'], [['a', 'e<sup>at</sup>', 'g', '(1/3) sen 3t'], ['b', 'tⁿ / n!', 'h', 't³ / 6'], ['c', 'sen at', 'i', 'cosh 4t'], ['d', 'cos at', 'j', '4e<sup>2t</sup>'], ['e', 'senh at', 'k', 'cos √2 t'], ['f', 'cosh at', 'l', '(1/√3) senh √3 t']]) } },
        { title: 'Inversas aplicando propiedades', official: '2.4', level: 3, prompt: '<p>a) (5s + 4)/s² − (2s − 18)/(s² + 9) + 30/s⁴; b) 6/(2s − 3) − (3 + 4s)/(9s² − 16) + (8 − 6s)/(16s² + 9); c) (6s − 4)/(s² − 4s + 20); d) (4s + 12)/(s² + 8s + 16); e) (3s + 7)/(s² − 2s − 3); f) (3s − 8)/(4s² + 25); g) (5s − 10)/(9s² − 16); h) (3s − 8)/(s² + 4) − (4s − 24)/(s² − 16).</p>', hints: ['b) sacá factor común del coeficiente de s y s² en cada término.', 'd) s² + 8s + 16 = (s + 4)²; escribí 4s + 12 = 4(s + 4) − 4.'],
          solution: { explain: table(['', 'f(t)'], [
            ['a', '5 + 4t − 2 cos 3t + 6 sen 3t + 5t³'],
            ['b', '3e<sup>3t/2</sup> − (1/4) senh(4t/3) − (4/9) cosh(4t/3) + (2/3) sen(3t/4) − (3/8) cos(3t/4)'],
            ['c', '6e<sup>2t</sup> cos 4t + 2e<sup>2t</sup> sen 4t'], ['d', '4e<sup>−4t</sup> − 4t e<sup>−4t</sup>'],
            ['e', '3e<sup>t</sup> cosh 2t + 5e<sup>t</sup> senh 2t = 4e<sup>3t</sup> − e<sup>−t</sup>'], ['f', '(3/4) cos(5t/2) − (4/5) sen(5t/2)'],
            ['g', '(5/9) cosh(4t/3) − (5/6) senh(4t/3)'], ['h', '3 cos 2t − 4 sen 2t − 4 cosh 4t + 6 senh 4t'],
          ]) + '<p>En clase el 4c se resolvió con numerador 6s − 3: da 6e<sup>2t</sup> cos 4t + (9/4) e<sup>2t</sup> sen 4t. Con el enunciado del TP (6s − 4) el segundo coeficiente es 2.</p>' } },
      ],
      quiz: [
        { q: 'ℒ⁻¹{1/(s² + 4)} = …', o: ['sen 2t', '(1/2) sen 2t', 'cos 2t', '2 sen 2t'], a: 1, e: 'Falta el 2 arriba: se divide por 2.' },
        { q: 'ℒ⁻¹{(s + 1)/((s + 1)² + 9)} = …', o: ['e^(t) cos 3t', 'e^(−t) cos 3t', 'cos 3t − 1', 'e^(−t) sen 3t'], a: 1, e: 'Traslación con a = −1.' },
        { q: 's² + 6s + 13 completado es…', o: ['(s + 3)² + 4', '(s + 6)² + 13', '(s + 3)² + 13', '(s − 3)² + 4'], a: 0, e: '(s + 3)² = s² + 6s + 9; faltan 4.' },
        { q: 'ℒ⁻¹{6/s⁴} = …', o: ['6t³', 't³', 't⁴/4', '6t⁴'], a: 1, e: '6/s⁴ = 3!/s⁴ → t³.' },
        { q: 'Si el denominador completado es (s − 2)² − 9, en la inversa aparecen…', o: ['sen y cos', 'senh y cosh', 'solo polinomios', 'impulsos'], a: 1, e: 'Con signo menos: funciones hiperbólicas (o exponenciales).' },
      ],
      sources: [{ title: 'Clase: Transformada de Laplace', ref: 'Cátedra de Matemática Superior', points: ['TP 2, ejercicio 3 a, b, g, h y ejercicio 4 a, b, c resueltos en clase.'] }],
    },

    {
      id: 'fracciones-simples',
      module: 'u2',
      title: 'Fracciones simples y residuos',
      keywords: 'fracciones parciales simples residuos polos simples múltiples repetidos complejos expansión heaviside',
      tldr: 'Cuando F(s) es un cociente de polinomios con denominador factorizable, se expande en <mark>fracciones simples</mark>. Cada coeficiente se calcula con el <strong>método de los residuos</strong>: R = [(s − p) F(s)] evaluado en s = p. Los polos repetidos piden derivar.',
      goals: ['Calcular residuos de polos simples.', 'Tratar polos múltiples con derivadas.', 'Resolver el TP 2, ejercicio 5.'],
      body: `
        <h2>Polos y forma de la expansión</h2>
        <p>Los <strong>polos</strong> de F(s) = N(s)/D(s) son las raíces de D(s). El grado de N tiene que ser menor que el de D (si no, primero se divide). Cada factor del denominador aporta términos:</p>
        ${table(['Factor en D(s)', 'Términos', 'Antitransformada'], [
          ['(s − p) simple', 'R / (s − p)', 'R e<sup>pt</sup>'],
          ['(s − p)³ triple', 'A₁/(s − p) + A₂/(s − p)² + A₃/(s − p)³', '(A₁ + A₂t + A₃t²/2) e<sup>pt</sup>'],
          ['s² + bs + c sin raíces reales', '(Bs + C)/(s² + bs + c)', 'completar cuadrado: e<sup>αt</sup>(cos, sen)'],
        ])}
        <h2>Residuo de un polo simple</h2>
        ${eq('R<sub>p</sub> = [(s − p) · F(s)]<sub>s = p</sub>', 'Se “tapa” el factor (s − p) y se reemplaza s = p')}
        <p>Ejemplo (TP 2, 5a): ${frac('3s + 7', '(s − 3)(s + 1)')} = ${frac('R₃', 's − 3')} + ${frac('R₋₁', 's + 1')}.</p>
        ${eq(`R₃ = ${frac('3·3 + 7', '3 + 1')} = 4 &nbsp;&nbsp; R₋₁ = ${frac('3(−1) + 7', '−1 − 3')} = −1 &nbsp; ⟹ &nbsp; f(t) = 4e<sup>3t</sup> − e<sup>−t</sup>`)}
        <h2>Polo de multiplicidad m</h2>
        <p>Para un polo p de orden m, el coeficiente de 1/(s − p)<sup>m−k</sup> es:</p>
        ${eq(`A<sub>m−k</sub> = ${frac('1', 'k!')} ${frac('d<sup>k</sup>', 'ds<sup>k</sup>')} [(s − p)<sup>m</sup> F(s)]<sub>s = p</sub>`, 'k = 0, 1, …, m − 1')}
        <p>Para el término de mayor potencia (k = 0) no hay que derivar; para el siguiente, una derivada; para el siguiente, la segunda derivada dividida por 2!.</p>
        ${note('El método de los residuos es el que usa la cátedra para todo el TP 3 y el TP 4: hay que dominarlo. Un control rápido: la suma de los residuos de los polos simples de F(s) es igual al cociente de los coeficientes principales cuando grado(D) = grado(N) + 1.', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'order', title: 'Pasos de las fracciones simples', items: ['Verificar que el grado del numerador sea menor que el del denominador', 'Factorizar el denominador y hallar los polos', 'Escribir la expansión con una fracción por cada polo (y potencias si se repite)', 'Calcular cada residuo tapando el factor y evaluando en el polo', 'Antitransformar cada término con la tabla'], explain: 'Si el grado del numerador no es menor, primero se divide: la parte entera da impulsos y sus derivadas.' }],
      exercises: [
        { title: 'Inversas por fracciones parciales', official: '2.5', level: 3, prompt: '<p>a) (3s + 7)/(s² − 2s − 3); b) (2s² − 4)/((s + 1)(s − 2)(s − 3)); c) (5s² − 15s − 11)/((s + 1)(s − 2)³); d) (3s + 1)/((s − 1)(s² + 1)); e) (s² + 2s + 3)/((s² + 2s + 1)(s² + 6s + 5)); g) (s + 1)/(6s² + 7s + 2).</p>', hints: ['c) polo triple en s = 2: dos derivadas.', 'e) (s² + 2s + 1)(s² + 6s + 5) = (s + 1)³(s + 5).', 'g) 6s² + 7s + 2 = (2s + 1)(3s + 2).'],
          solution: { explain: `${table(['', 'Expansión', 'f(t)'], [
            ['a', '4/(s − 3) − 1/(s + 1)', '4e<sup>3t</sup> − e<sup>−t</sup>'],
            ['b', '−1/6 /(s + 1) − 4/3 /(s − 2) + 7/2 /(s − 3)', '−(1/6)e<sup>−t</sup> − (4/3)e<sup>2t</sup> + (7/2)e<sup>3t</sup>'],
            ['c', '−1/3 /(s + 1) + 1/3 /(s − 2) + 4/(s − 2)² − 7/(s − 2)³', '−(1/3)e<sup>−t</sup> + (1/3 + 4t − (7/2)t²) e<sup>2t</sup>'],
            ['d', '2/(s − 1) − (2s − 1)/(s² + 1)', '2e<sup>t</sup> − 2 cos t + sen t'],
            ['e', '9/32 /(s + 1) − 1/8 /(s + 1)² + 1/2 /(s + 1)³ − 9/32 /(s + 5)', '(9/32 − t/8 + t²/4) e<sup>−t</sup> − (9/32) e<sup>−5t</sup>'],
            ['g', '(1/2)/(s + 1/2) − (1/3)/(s + 2/3)', '(1/2)e<sup>−t/2</sup> − (1/3)e<sup>−2t/3</sup>'],
          ])}<p><b>Detalle de c)</b>: R₋₁ = (5 + 15 − 11)/(−3)³ = −1/3. A₃ = [(5s² − 15s − 11)/(s + 1)]<sub>s=2</sub> = −21/3 = −7. A₂ = d/ds[(5s² − 15s − 11)/(s + 1)]<sub>s=2</sub> = [(10s − 15)(s + 1) − (5s² − 15s − 11)]/(s + 1)² = (15 + 21)/9 = 4. A₁ = (1/2!) d²/ds²[…]<sub>s=2</sub> = 1/3 (o, más rápido: la suma de los coeficientes de 1/(s − p) simples debe dar 0, porque grado(D) − grado(N) = 2).</p>` } },
      ],
      quiz: [
        { q: 'El residuo de F(s) = 5/((s − 1)(s + 4)) en s = 1 es…', o: ['5', '1', '−1', '5/3'], a: 1, e: '5/(1 + 4) = 1.' },
        { q: 'Un polo doble en s = −2 aporta los términos…', o: ['A/(s + 2)', 'A₁/(s + 2) + A₂/(s + 2)²', 'A/(s + 2)²', '(As + B)/(s + 2)'], a: 1, e: 'Una fracción por cada potencia.' },
        { q: 'ℒ⁻¹{1/(s + 3)²} = …', o: ['e^(−3t)', 't e^(−3t)', 't² e^(−3t)', 'e^(−3t)/2'], a: 1, e: 'Traslación de 1/s² → t.' },
        { q: 'Antes de expandir en fracciones simples, el grado del numerador debe ser…', o: ['mayor que el del denominador', 'menor que el del denominador', 'igual', 'cero'], a: 1, e: 'Si no, primero se hace la división de polinomios.' },
      ],
      sources: [{ title: 'Clase: EDO con Laplace', ref: 'Cátedra de Matemática Superior', points: ['Cálculo de residuos R y coeficientes A para polos múltiples con derivadas.'] }],
    },

    {
      id: 'laplace-teoria',
      module: 'u2',
      title: 'A fondo: la teoría de Laplace que se toma en el parcial',
      keywords: 'teoría propiedades transformada qué ecuaciones resuelve lineales coeficientes constantes existencia orden exponencial polo residuo múltiple parcial',
      tldr: 'Casi todos los 1er parciales preguntan lo mismo: <mark>qué propiedades conocés y qué ecuaciones resuelve Laplace</mark>. Respuesta corta: suma algebraica, linealidad, traslación y transformada de las derivadas; resuelve ecuaciones diferenciales <strong>ordinarias, lineales y de coeficientes constantes</strong>, de cualquier orden, con sus condiciones iniciales. No resuelve “cualquier” ecuación: las no lineales quedan afuera.',
      goals: ['Responder con precisión las preguntas teóricas de la Unidad 2.', 'Justificar por qué Laplace no sirve para ecuaciones no lineales.', 'Definir polo y escribir la fórmula de residuos múltiples.'],
      body: `
        <h2>Las propiedades, con su “para qué”</h2>
        ${table(['Propiedad', 'Enunciado', 'Para qué sirve'], [
          ['Suma algebraica', 'ℒ{f₁ ± f₂} = F₁ ± F₂', 'Transformar término a término'],
          ['Linealidad', 'ℒ{c₁f₁ + c₂f₂} = c₁F₁ + c₂F₂ (también para ℒ⁻¹)', 'Sacar las constantes afuera; ajustar constantes en la inversa'],
          ['Traslación (en s)', 'ℒ{e<sup>at</sup> f(t)} = F(s − a)', 'Exponencial por seno, coseno, senh, cosh o potencia; completar cuadrados en la inversa'],
          ['Derivadas', 'ℒ{f′} = sF − f(0); ℒ{f″} = s²F − s f(0) − f′(0); ℒ{f⁽ⁿ⁾} = sⁿF − sⁿ⁻¹f(0) − … − f⁽ⁿ⁻¹⁾(0)', 'Convierte la ecuación diferencial en algebraica e incorpora las condiciones iniciales'],
        ])}
        ${note('Lo que <strong>no</strong> es una propiedad: la transformada de un producto no es el producto de las transformadas. ℒ{t · sen t} ≠ ℒ{t} · ℒ{sen t}. Por eso solo e<sup>at</sup> “sale” de un producto, y lo hace como traslación.', 'warn')}
        <h2>¿Qué ecuaciones resuelve?</h2>
        ${def('Respuesta de la cátedra', 'Resuelven ecuaciones diferenciales de cualquier orden pero solo lineales.', 'Preguntas de Matemática Superior, 1er cuatrimestre (material de la cátedra).')}
        <p>Para que el método funcione de punta a punta tienen que pasar tres cosas, y cada una explica una restricción:</p>
        ${flow('Cada término tiene que transformarse en algo con Y(s): solo pasa si y, y′, y″ aparecen sumados y multiplicados por constantes', 'Al despejar, Y(s) tiene que quedar como cociente de polinomios en s', 'Ese cociente tiene que invertirse con tabla, propiedades y fracciones simples')}
        ${table(['Ecuación', '¿Laplace?', 'Por qué'], [
          ['y″ + 7y′ + 12y = t', 'Sí', 'Ordinaria, lineal, coeficientes constantes'],
          ['y″ − 3y′ − 4y = e<sup>−2t</sup> + 4e<sup>t</sup>', 'Sí', 'El segundo miembro solo tiene que tener transformada; puede ser cualquier función de t'],
          ['y′ + y² = 0', 'No', 'No lineal: ℒ{y²} no se puede escribir en función de Y(s)'],
          ['y″ + sen y = 0 (péndulo)', 'No', 'No lineal; Chapra (PT7.1) muestra que se linealiza con sen y ≈ y o se resuelve numéricamente'],
          ['∂u/∂t = ∂²u/∂x²', 'No directamente', 'Es una ecuación en derivadas parciales'],
        ])}
        <p>Chapra lo plantea desde el otro lado (PT7.1): “la importancia práctica de las EDO lineales es que se resuelven analíticamente. En cambio, la mayoría de las ecuaciones no lineales no pueden resolverse de manera exacta”. Para esas están los <a href="#/euler">métodos aproximados</a> de la Unidad 4.</p>
        ${note('Pregunta del 1P 2024 (tema 2): “¿Con la Transformada de Laplace se puede resolver cualquier tipo de ecuación diferencial? Explique”. Respuesta: <strong>no</strong>. Solo las ordinarias lineales (con coeficientes constantes, que son las que se ven en la materia); además, el segundo miembro y la solución tienen que tener transformada. Las no lineales se resuelven con métodos numéricos.', 'exam')}
        <h2>¿Cuándo existe la transformada?</h2>
        <p>La integral ∫₀^∞ e<sup>−st</sup> f(t) dt converge si f es <strong>continua por tramos</strong> (un número finito de saltos finitos en cada intervalo) y de <strong>orden exponencial</strong>: |f(t)| ≤ M e<sup>ct</sup> para t grande. Así, para s &gt; c, el factor e<sup>−st</sup> le gana a f. Todas las funciones de la tabla cumplen (polinomios, exponenciales, senos, cosenos, hiperbólicas). Una que no: e<sup>t²</sup>, que crece más rápido que cualquier exponencial.</p>
        <h2>Polos y residuos múltiples</h2>
        ${def('Polo', 'En una función racional F(s) = p(s)/q(s), con q(s) = (s − s₁)(s − s₂)…(s − s<sub>n</sub>), los valores s₁, s₂, …, s<sub>n</sub> se denominan polos de la función.', 'Resumen de la cátedra, Expansión en fracciones parciales.')}
        <p>Son los valores de s que anulan el denominador y hacen que F(s) tienda a infinito. Los <strong>ceros</strong>, en cambio, anulan el numerador. Para un polo simple el residuo es R = [(s − p) F(s)]<sub>s=p</sub>. Para un <strong>polo de multiplicidad m</strong>:</p>
        ${eq(`F(s) = ${frac('A₁', 's − p')} + ${frac('A₂', '(s − p)²')} + … + ${frac('A<sub>m</sub>', '(s − p)<sup>m</sup>')} + … &nbsp;&nbsp; A<sub>m−k</sub> = ${frac('1', 'k!')} ${frac('d<sup>k</sup>', 'ds<sup>k</sup>')} [(s − p)<sup>m</sup> F(s)]<sub>s=p</sub>`, 'Residuos múltiples, k = 0, 1, …, m − 1')}
        <p>Y cada término vuelve al tiempo con la tabla y la traslación: A<sub>j</sub>/(s − p)<sup>j</sup> → A<sub>j</sub> t<sup>j−1</sup> e<sup>pt</sup>/(j − 1)!.</p>
        ${lab(0)}`,
      labs: [{ type: 'classify', title: '¿Se resuelve con Laplace?', buckets: ['Sí', 'No'], items: [
        { t: 'y″ + 5y′ + 6y = 3e<sup>t</sup> + e<sup>2t</sup>', b: 0, why: 'Lineal y de coeficientes constantes (1P 2024, tema 2).' },
        { t: 'y y′ = 1', b: 1, why: 'Producto de y por su derivada: no lineal.' },
        { t: 'y‴ − y = 8 cosh t', b: 0, why: 'Cualquier orden sirve si es lineal.' },
        { t: '(y′)² + y = 0', b: 1, why: 'Derivada al cuadrado: no lineal.' },
        { t: 'y″ + 4y = sen 2t', b: 0, why: 'Lineal; aparece un polo doble ±2i (resonancia).' },
        { t: 'y′ = e<sup>y</sup>', b: 1, why: 'Función trascendente de la variable dependiente.' },
      ] }],
      quiz: [
        { q: 'La transformada de Laplace resuelve directamente ecuaciones diferenciales…', o: ['de primer orden solamente', 'ordinarias lineales de cualquier orden', 'no lineales de segundo orden', 'en derivadas parciales'], a: 1, e: 'Respuesta de la cátedra: cualquier orden, pero solo lineales.' },
        { q: '¿Por qué Laplace no sirve para y′ + y² = 0?', o: ['Porque es de primer orden', 'Porque ℒ{y²} no se expresa en función de Y(s)', 'Porque no tiene condiciones iniciales', 'Porque e^(−st) no converge'], a: 1, e: 'La transformada no “pasa” a través de productos ni potencias de y.' },
        { q: 'ℒ{t · cos t} = ℒ{t} · ℒ{cos t}…', o: ['Verdadero', 'Falso'], a: 1, e: 'La transformada de un producto no es el producto de transformadas.' },
        { q: 'Un polo de F(s) es…', o: ['una raíz del numerador', 'una raíz del denominador', 'el coeficiente principal', 'un valor de t'], a: 1, e: 'Donde F(s) → ∞.' },
        { q: 'Para un polo triple, el coeficiente de 1/(s − p) se calcula con…', o: ['ninguna derivada', 'una derivada', 'la segunda derivada dividida por 2!', 'la tercera derivada'], a: 2, e: 'k = 2: (1/2!) d²/ds²[(s − p)³F(s)] en s = p.' },
        { q: 'e^(t²) no tiene transformada de Laplace porque…', o: ['no es continua', 'no es de orden exponencial', 'es par', 'vale 1 en t = 0'], a: 1, e: 'Crece más rápido que cualquier e^(ct).' },
      ],
      sources: [
        { title: 'Resumen y preguntas del 1er parcial', ref: 'Material de la cátedra (carpeta Parciales)', points: ['Propiedades: suma algebraica, linealidad, linealidad de la inversa, traslación y transformada de las derivadas.', '“Resuelven ecuaciones diferenciales de cualquier orden pero solo lineales.”', 'Definición de polo en la expansión en fracciones parciales.'] },
        { title: 'Métodos numéricos para ingenieros', ref: 'Chapra y Canale, 5ª ed., PT7.1', points: ['Las EDO lineales se resuelven analíticamente; la mayoría de las no lineales, no.', 'Linealización del péndulo (sen θ ≈ θ) y la alternativa numérica.'] },
      ],
    },
  );
})();
