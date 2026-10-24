/* Unidad 3: Función de transferencia. Apunte "Función de Transferencia" y clase. TP 4. */
(() => {
  const { LESSONS, h } = window.GUIDE;
  const { note, def, table, eq, frac, lab, fig } = h;
  const block = fig(`<svg viewBox="0 0 420 90" width="420" role="img" aria-label="Diagrama de bloques: entrada U(s), bloque P(s), salida Y(s)">
    <defs><marker id="bk-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="fill-a"/></marker></defs>
    <line x1="20" y1="45" x2="148" y2="45" class="stroke-a" stroke-width="2.4" marker-end="url(#bk-a)"/><text x="60" y="34" class="t-m">U(s)</text>
    <rect x="152" y="18" width="116" height="54" rx="10" class="box-a"/><text x="210" y="51" text-anchor="middle" class="t-b">P(s)</text>
    <line x1="268" y1="45" x2="398" y2="45" class="stroke-a" stroke-width="2.4" marker-end="url(#bk-a)"/><text x="316" y="34" class="t-m">Y(s)</text></svg>`, 'Diagrama de bloques: la salida es la entrada multiplicada por la función de transferencia, Y(s) = P(s) U(s).');

  LESSONS.push(
    {
      id: 'ft-definicion',
      module: 'u3',
      title: 'Función de transferencia: definición, polos y ceros',
      keywords: 'función de transferencia definición salida entrada condiciones iniciales cero polos ceros sistema lineal invariante diagrama de bloques',
      tldr: 'La función de transferencia es el cociente entre la <mark>transformada de la salida y la transformada de la entrada</mark>, con condiciones iniciales cero: P(s) = Y(s)/U(s). Es un modelo del sistema que no depende de la entrada. Sus <strong>polos</strong> (raíces del denominador) deciden cómo responde.',
      goals: ['Definir la función de transferencia y sus condiciones de validez.', 'Obtenerla a partir de una ecuación diferencial (TP 4, ejercicio 1).', 'Identificar polos y ceros.'],
      body: `
        ${def('Función de transferencia', 'La función de transferencia P(s) de un sistema se define como la transformada de Laplace de la salida sobre la transformada de Laplace de la entrada.', 'Apunte de la cátedra, Función de Transferencia.')}
        ${eq(`P(s) = ${frac('Y(s)', 'U(s)')} = ${frac('b<sub>m</sub>s<sup>m</sup> + b<sub>m−1</sub>s<sup>m−1</sup> + … + b₀', 'a<sub>n</sub>s<sup>n</sup> + a<sub>n−1</sub>s<sup>n−1</sup> + … + a₀')}`, 'Forma general')}
        ${block}
        <h2>Lo que dice la cátedra sobre la función de transferencia</h2>
        <ul>
          <li>Se aplica a sistemas descriptos por <strong>ecuaciones diferenciales lineales, invariantes en el tiempo y con condiciones iniciales cero</strong>.</li>
          <li>Es un <strong>modelo matemático</strong> que relaciona la variable de salida con la de entrada mediante las transformadas de Laplace de las ecuaciones que las describen.</li>
          <li>Si se conoce P(s), se puede estudiar la salida para <strong>diversas formas de entrada</strong> y así comprender la naturaleza del sistema.</li>
          <li>La respuesta y(t) = ℒ⁻¹{P(s) U(s)} depende tanto de los <strong>polos y ceros de la función de transferencia</strong> como de los de la entrada.</li>
        </ul>
        <h2>Polos y ceros</h2>
        <p>Los <strong>ceros</strong> son las raíces del numerador (donde P(s) = 0) y los <strong>polos</strong>, las raíces del denominador (donde P(s) → ∞). El denominador igualado a cero es la <strong>ecuación característica</strong> del sistema.</p>
        <h2>De la ecuación diferencial a P(s)</h2>
        <p>Ejemplo del apunte: y″ + 3y′ + 2y = u + u′. Con condiciones iniciales cero, transformar es cambiar cada derivada por una potencia de s:</p>
        ${eq(`s²Y + 3sY + 2Y = U + sU &nbsp; ⟹ &nbsp; Y(s)(s² + 3s + 2) = U(s)(s + 1) &nbsp; ⟹ &nbsp; P(s) = ${frac('s + 1', 's² + 3s + 2')}`)}
        <p>Polos: s = −1 y s = −2. Cero: s = −1. El cero cancela un polo: P(s) = 1/(s + 2).</p>
        ${note('Los coeficientes de la salida (y, y′, y″) van al <strong>denominador</strong> y los de la entrada (u, u′) al <strong>numerador</strong>. Se invierte fácil si se escribe primero Y(s)·(…) = U(s)·(…).', 'exam')}`,
      exercises: [
        { title: 'Función de transferencia desde la ecuación diferencial', official: '4.1', level: 1, prompt: '<p>Con condiciones iniciales cero: a) ÿ + 7ẏ + 6y = 3u̇ + 6u; b) ÿ + 5ẏ + 4y = 2u̇ + 4u; c) ÿ + 7ẏ + 10y = 10u̇ + 10u; d) ÿ + 7ẏ + 12y = 6u̇ + 21u.</p>',
          solution: { explain: table(['', 'P(s)', 'Factorizada', 'Ceros', 'Polos'], [
            ['a', '(3s + 6)/(s² + 7s + 6)', '3(s + 2)/((s + 1)(s + 6))', '−2', '−1, −6'],
            ['b', '(2s + 4)/(s² + 5s + 4)', '2(s + 2)/((s + 1)(s + 4))', '−2', '−1, −4'],
            ['c', '(10s + 10)/(s² + 7s + 10)', '10(s + 1)/((s + 2)(s + 5))', '−1', '−2, −5'],
            ['d', '(6s + 21)/(s² + 7s + 12)', '3(2s + 7)/((s + 3)(s + 4))', '−3,5', '−3, −4'],
          ]) + '<p>El ítem a) fue resuelto en clase. Los ítems e) y f) del PDF no se pudieron leer completos en la versión digital: se resuelven exactamente igual.</p>' } },
      ],
      quiz: [
        { q: 'La función de transferencia se define como…', o: ['U(s)/Y(s)', 'Y(s)/U(s) con condiciones iniciales cero', 'y(t)/u(t)', 'la derivada de la salida'], a: 1, e: 'Salida sobre entrada, transformadas, con condiciones iniciales nulas.' },
        { q: 'Los polos de P(s) son…', o: ['las raíces del numerador', 'las raíces del denominador', 'los coeficientes', 'los valores de t'], a: 1, e: 'Donde P(s) se hace infinita.' },
        { q: 'La función de transferencia depende de…', o: ['la entrada aplicada', 'solo del sistema', 'las condiciones iniciales', 't'], a: 1, e: 'Es un modelo del sistema; la entrada se multiplica después.' },
        { q: 'Para ÿ + 2ẏ + 5y = u, P(s) = …', o: ['s² + 2s + 5', '1/(s² + 2s + 5)', '(s² + 2s + 5)/s', '5/(s² + 2s)'], a: 1, e: 'Y(s)(s² + 2s + 5) = U(s).' },
      ],
      sources: [{ title: 'Apunte y clase: Función de Transferencia', ref: 'Cátedra de Matemática Superior', points: ['Definición y comentarios (lineal, invariante, condiciones iniciales cero).', 'Ejemplo y″ + 3y′ + 2y = u + u′.', 'TP 4, 1a resuelto en clase.'] }],
    },

    {
      id: 'ft-respuesta',
      module: 'u3',
      title: 'Respuesta en el tiempo y ubicación de los polos',
      keywords: 'respuesta temporal escalón y(t) polos estabilidad amortiguamiento oscilación valor final residuos',
      tldr: 'Con condiciones iniciales cero, <mark>Y(s) = P(s) U(s)</mark> y la respuesta es y(t) = ℒ⁻¹{P(s) U(s)}. Cada polo aporta un término: polos reales negativos → exponenciales que se apagan; complejos → oscilaciones; con parte real positiva → el sistema es inestable.',
      goals: ['Calcular la respuesta al escalón (TP 4, ejercicios 2 y 3).', 'Relacionar la posición de los polos con la forma de y(t).'],
      body: `
        ${eq('Y(s) = P(s) · U(s) &nbsp;&nbsp;⟹&nbsp;&nbsp; y(t) = ℒ⁻¹{P(s) U(s)}', 'Respuesta del sistema')}
        <h2>Ejemplo: TP 4, ejercicio 2a</h2>
        <p>ÿ + 5ẏ + 4y = 4 con condiciones iniciales cero. La entrada es el escalón de altura 4, de transformada 4/s.</p>
        ${eq(`Y(s) = ${frac('4', 's(s + 4)(s + 1)')} = ${frac('R₀', 's')} + ${frac('R₋₄', 's + 4')} + ${frac('R₋₁', 's + 1')}`)}
        <p>R₀ = 4/(4·1) = 1; R₋₄ = 4/((−4)(−3)) = 1/3; R₋₁ = 4/((−1)(3)) = −4/3.</p>
        ${eq('y(t) = 1 + (1/3) e<sup>−4t</sup> − (4/3) e<sup>−t</sup>')}
        <p>El polo de la entrada (s = 0) da el término constante: el <strong>valor final</strong>. Los polos del sistema (−1 y −4) dan exponenciales que se apagan: el <strong>transitorio</strong>. El polo más cercano al eje imaginario (−1) es el más lento y domina la respuesta.</p>
        ${lab(0)}
        <h2>Polos en el plano s</h2>
        ${table(['Polos de P(s)', 'Término en y(t)', 'Comportamiento'], [
          ['Real negativo s = −a', 'e<sup>−at</sup>', 'Se apaga sin oscilar: más rápido cuanto más lejos del eje'],
          ['Complejos σ ± jω con σ &lt; 0', 'e<sup>σt</sup>(A cos ωt + B sen ωt)', 'Oscila y se apaga (subamortiguado)'],
          ['Sobre el eje imaginario ± jω', 'cos ωt, sen ωt', 'Oscila sin apagarse'],
          ['Parte real positiva', 'e<sup>+at</sup>', 'Crece sin límite: <strong>inestable</strong>'],
        ])}
        ${note('Un sistema es estable si todos sus polos tienen parte real negativa (semiplano izquierdo del plano s). Es la conclusión que se pide justificar en el teórico.', 'exam')}`,
      labs: [{ type: 'response', kind: 'real', p1: 1, p2: 4, title: 'Respuesta al escalón según los polos', intro: 'Con polos reales reproduce el TP 4, 2a (polos en −1 y −4). Pasá a polos complejos y bajá ζ: aparece la oscilación; con ζ negativo, la inestabilidad.' }],
      exercises: [
        { title: 'Respuesta en el tiempo con condiciones iniciales cero', official: '4.2', level: 2, prompt: '<p>a) ÿ + 5ẏ + 4y = 4; b) ÿ + 6ẏ + 5y = 5; c) ÿ + 7ẏ + 6y = 6; d) ÿ + 5ẏ + 6y = 6; e) ÿ + 4ẏ + 3y = 3.</p>', hints: ['El segundo miembro constante k es un escalón de altura k: k/s.', 'En todos, R₀ = 1 porque k coincide con el término independiente del denominador.'],
          solution: { explain: table(['', 'Y(s)', 'y(t)'], [
            ['a', '4/(s(s + 1)(s + 4))', '1 − (4/3)e<sup>−t</sup> + (1/3)e<sup>−4t</sup>'],
            ['b', '5/(s(s + 1)(s + 5))', '1 − (5/4)e<sup>−t</sup> + (1/4)e<sup>−5t</sup>'],
            ['c', '6/(s(s + 1)(s + 6))', '1 − (6/5)e<sup>−t</sup> + (1/5)e<sup>−6t</sup>'],
            ['d', '6/(s(s + 2)(s + 3))', '1 − 3e<sup>−2t</sup> + 2e<sup>−3t</sup>'],
            ['e', '3/(s(s + 1)(s + 3))', '1 − (3/2)e<sup>−t</sup> + (1/2)e<sup>−3t</sup>'],
          ]) + '<p>Control: en todos y(0) = 0, como corresponde a condiciones iniciales cero.</p>' } },
        { title: 'Respuesta al escalón desde P(s)', official: '4.3', level: 3, prompt: '<p>d) Y(s)/U(s) = 3(s + 5)(s + 2)/((s + 3)(s + 1)(s + 10)), con u(t) el escalón unitario.</p>', hints: ['Y(s) = P(s)·(1/s): cuatro polos simples.'],
          solution: { explain: `<p>Y(s) = 3(s + 5)(s + 2)/(s(s + 1)(s + 3)(s + 10)).</p>${table(['Polo', 'Residuo'], [['0', '3·5·2/(1·3·10) = 1'], ['−1', '3·4·1/((−1)·2·9) = −2/3'], ['−3', '3·2·(−1)/((−3)(−2)·7) = −1/7'], ['−10', '3·(−5)(−8)/((−10)(−9)(−7)) = −4/21']])}<p><b>y(t) = 1 − (2/3)e<sup>−t</sup> − (1/7)e<sup>−3t</sup> − (4/21)e<sup>−10t</sup></b>. Resuelto en clase. Los ítems a, b, c y e del PDF no se leen completos en la versión digital: se resuelven igual, agregando el polo s = 0 del escalón.</p>` } },
      ],
      quiz: [
        { q: 'Con entrada escalón unitario, Y(s) = …', o: ['P(s)', 'P(s)/s', 's P(s)', 'P(s) + 1/s'], a: 1, e: 'U(s) = 1/s.' },
        { q: 'Un polo en s = −5 aporta a y(t) un término…', o: ['e^(5t)', 'e^(−5t)', 'sen 5t', 't⁵'], a: 1, e: 'R/(s + 5) → R e^(−5t).' },
        { q: 'Si P(s) tiene un polo en s = +2, el sistema es…', o: ['estable', 'inestable', 'oscilatorio amortiguado', 'de primer orden'], a: 1, e: 'e^(2t) crece sin límite.' },
        { q: 'Polos complejos con parte real negativa producen…', o: ['crecimiento', 'oscilación que se apaga', 'una recta', 'un escalón'], a: 1, e: 'e^(σt)(cos ωt, sen ωt) con σ < 0.' },
        { q: 'En la respuesta al escalón, el término constante viene…', o: ['del polo s = 0 de la entrada', 'del cero de P(s)', 'del polo más rápido', 'de la condición inicial'], a: 0, e: 'R₀/s → R₀: es el valor final.' },
      ],
      sources: [{ title: 'Clase: Función de Transferencia', ref: 'Cátedra de Matemática Superior', points: ['TP 4, 2a y 3d resueltos con residuos.'] }],
    },

    {
      id: 'ft-teoria',
      module: 'u3',
      title: 'A fondo: condiciones, invariancia en el tiempo e importancia',
      keywords: 'función de transferencia teoría condiciones iniciales cero invariante en el tiempo lineal superposición importancia de qué depende la respuesta verdadero falso estabilidad bloques en serie',
      tldr: 'La función de transferencia existe solo para sistemas <mark>lineales, invariantes en el tiempo y con condiciones iniciales cero</mark>. Con esas tres condiciones, Y(s)/U(s) no depende de la entrada: es una propiedad del sistema. La respuesta y(t) depende de los polos y ceros de P(s) <strong>y</strong> de los de la entrada U(s).',
      goals: ['Justificar cada una de las tres condiciones.', 'Explicar qué significa “invariante en el tiempo”.', 'Responder los verdadero o falso de los parciales sobre la función de transferencia.'],
      body: `
        <h2>Las tres condiciones y qué pasa si falta una</h2>
        ${table(['Condición', 'Qué significa', 'Si no se cumple…'], [
          ['Lineal', 'Vale la superposición: si u₁ → y₁ y u₂ → y₂, entonces a u₁ + b u₂ → a y₁ + b y₂', 'La transformada no pasa a través de los términos no lineales (y², sen y): no se puede despejar Y(s) como P(s)·U(s)'],
          ['Invariante en el tiempo', 'Los coeficientes de la ecuación diferencial son constantes: el sistema responde igual hoy que mañana', 'Un coeficiente que depende de t (como t·y′) no se transforma en (constante)·sY: P quedaría dependiendo de t'],
          ['Condiciones iniciales cero', 'El sistema arranca “en reposo”: y(0) = y′(0) = … = 0 y u(0) = … = 0', 'Y(s) = P(s)U(s) + (términos de las condiciones iniciales): el cociente Y/U pasa a depender de la entrada'],
        ])}
        <h2>Invariancia en el tiempo</h2>
        <p>Un sistema es <strong>invariante en el tiempo</strong> si un retardo en la entrada produce el mismo retardo en la salida y nada más: si la entrada u(t) produce y(t), la entrada u(t − τ) produce y(t − τ). En una ecuación diferencial eso ocurre cuando los coeficientes a<sub>n</sub>, …, a₀ y b<sub>m</sub>, …, b₀ son <strong>constantes</strong>. Es la condición que permite transformar cada a<sub>k</sub> y⁽ᵏ⁾ en a<sub>k</sub> sᵏ Y(s) y sacar Y(s) factor común.</p>
        ${note('Pregunta del 1P 2024 (tema 1): “En función de transferencia, para trabajar con Laplace, ¿qué significa que las ecuaciones diferenciales sean invariantes en el tiempo?”. Respuesta: que sus coeficientes son constantes (no dependen de t), de modo que el comportamiento del sistema no cambia con el instante en que se aplica la entrada; solo así el cociente Y(s)/U(s) es un polinomio sobre otro, fijo para el sistema.', 'exam')}
        <h2>¿Por qué condiciones iniciales cero?</h2>
        <p>El apunte lo muestra con la forma completa: Y(s) = P(s) U(s) + (términos debidos a los valores iniciales u<sub>0</sub><sup>k</sup>, y<sub>0</sub><sup>k</sup>). Solo si esos términos son cero queda Y(s) = P(s)U(s). Con y(0) = 1, por ejemplo, Y/U = P + 1/U·(algo): cambia con cada entrada y deja de describir al sistema.</p>
        ${table(['Afirmación de parcial', 'V/F', 'Justificación'], [
          ['La función de transferencia relaciona la transformada de Laplace de la entrada de un sistema con la transformada de Laplace de la salida', '<b>V</b>', 'Es su definición: P(s) = Y(s)/U(s), con condiciones iniciales cero'],
          ['Se puede obtener la función de transferencia a partir de las ecuaciones diferenciales de entrada y salida con tan solo una condición inicial distinta de cero', '<b>F</b>', 'Todas las condiciones iniciales deben ser cero; con una sola distinta de cero aparece un término extra y Y/U depende de la entrada'],
          ['La función de transferencia depende de la entrada aplicada', '<b>F</b>', 'Depende solo de los coeficientes de la ecuación (del sistema)'],
          ['La respuesta y(t) depende solo de los polos de P(s)', '<b>F</b>', 'Depende de los polos y ceros de P(s) y de los de U(s)'],
        ])}
        <h2>¿De qué depende la respuesta en el tiempo?</h2>
        ${def('Respuesta en el tiempo', 'y(t) = ℒ⁻¹{P(s) U(s)} es la respuesta de tiempo y puede determinarse encontrando los polos de P(s) U(s). En consecuencia y(t) depende tanto de los polos y ceros de la función de transferencia como de los polos y ceros de la entrada.', 'Apunte de la cátedra, Función de Transferencia.')}
        <p>En la expansión en fracciones simples de P(s)U(s):</p>
        <ul>
          <li>Los <strong>polos de la entrada</strong> dan la <strong>respuesta forzada</strong>: con una rampa (U = 1/s², polo doble en 0) aparecen un término constante y uno en t; con un escalón, solo una constante.</li>
          <li>Los <strong>polos del sistema</strong> dan la <strong>respuesta natural o transitoria</strong>: exponenciales y oscilaciones cuya forma depende solo de P(s).</li>
          <li>Los <strong>ceros</strong> (de P y de U) no agregan términos, pero cambian el tamaño de cada residuo. Un cero que coincide con un polo lo cancela.</li>
        </ul>
        ${note('Ejemplo del 1P 2024 (tema 2): P(s) = (3s − 4)/(s² − 2s − 3) tiene polos −1 y <b>3</b>. Con la rampa, y(t) = (4/3)t − 17/9 + (7/4)e<sup>−t</sup> + (5/36)e<sup>3t</sup>: el polo positivo hace crecer la salida sin límite. Es un sistema <strong>inestable</strong>, y eso lo dicen los polos de P(s), no la entrada.', 'tip')}
        <h2>¿Por qué es importante?</h2>
        <ul>
          <li>Cualquier sistema lineal invariante (eléctrico, mecánico, informático) queda representado por un único cociente de polinomios, sin importar qué entrada se le aplique.</li>
          <li>Permite estudiar la salida Y(s) para <strong>distintas entradas</strong> (escalón, rampa, impulso) con solo multiplicar.</li>
          <li>Los polos dicen, sin resolver nada, si el sistema es estable (todos con parte real negativa), si oscila (complejos) y qué tan rápido responde.</li>
          <li>Sistemas en cadena se combinan multiplicando: si la salida de P₁ es la entrada de P₂, la función de transferencia total es P₁(s)·P₂(s).</li>
        </ul>
        ${lab(0)}`,
      labs: [{ type: 'classify', title: '¿Se puede definir P(s)?', buckets: ['Sí', 'No'], items: [
        { t: 'y″ + 6y′ + 10y = 5u′ + 15u, condiciones iniciales cero', b: 0, why: 'Lineal, coeficientes constantes, en reposo.' },
        { t: 'y″ + 6y′ + 10y = 5u′ + 15u, con y(0) = 1', b: 1, why: 'Una condición inicial distinta de cero alcanza para romper la definición.' },
        { t: 'y″ + t·y′ + y = u', b: 1, why: 'Coeficiente que depende de t: no es invariante en el tiempo.' },
        { t: 'y′ + y² = u', b: 1, why: 'No lineal.' },
        { t: 'y‴ + 2y″ + y = u″ − u, condiciones iniciales cero', b: 0, why: 'El orden no importa.' },
      ] }],
      quiz: [
        { q: '“Invariante en el tiempo” significa que…', o: ['la salida es constante', 'los coeficientes de la ecuación diferencial son constantes', 'la entrada no cambia', 'las condiciones iniciales son cero'], a: 1, e: 'Un retardo en la entrada solo retarda la salida.' },
        { q: 'Con una condición inicial distinta de cero, Y(s)/U(s)…', o: ['sigue siendo P(s)', 'depende también de la entrada', 'vale cero', 'es igual a la condición inicial'], a: 1, e: 'Aparecen términos extra que no son proporcionales a U(s).' },
        { q: 'La respuesta y(t) depende de…', o: ['solo los polos de P(s)', 'solo la entrada', 'los polos y ceros de P(s) y de U(s)', 'solo los ceros'], a: 2, e: 'Apunte de la cátedra.' },
        { q: 'Los polos de la entrada producen…', o: ['la respuesta natural', 'la respuesta forzada', 'la inestabilidad', 'nada'], a: 1, e: 'Por ejemplo, el término constante con el escalón.' },
        { q: 'Si P(s) tiene un polo en s = 2, para cualquier entrada acotada…', o: ['la salida se apaga', 'aparece un término e^(2t) que crece', 'la salida es constante', 'no hay respuesta'], a: 1, e: 'Sistema inestable (salvo que el residuo justo dé cero).' },
      ],
      sources: [
        { title: 'Apunte: Función de Transferencia', ref: 'Cátedra de Matemática Superior', points: ['Y(s) = P(s)U(s) + términos de los valores iniciales; con condiciones nulas, Y(s) = P(s)U(s).', 'y(t) depende de los polos y ceros de P(s) y de U(s).'] },
        { title: 'Resumen y preguntas del 1er parcial', ref: 'Material de la cátedra', points: ['Se aplica a ecuaciones lineales, invariantes en el tiempo y con condiciones iniciales cero.', 'Importancia: estudiar las salidas según las entradas y comprender la naturaleza del sistema.'] },
      ],
    },
  );
})();
