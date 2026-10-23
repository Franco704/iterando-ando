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
  );
})();
