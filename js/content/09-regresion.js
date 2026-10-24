/* Unidad 6 (segunda parte): regresión por mínimos cuadrados. Apunte "Regresión Lineal" y clase. TP 8.
   Sumatorias y resultados calculados con num.js (verificado contra Chapra 17.1, que es el TP 8 b). */
(() => {
  const { LESSONS, h, num: N } = window.GUIDE;
  const { note, def, table, eq, frac, lab, chart, num } = h;
  const SETS = [
    ['a', [1, 2, 3, 5, 6], [4.1, 5, 7.9, 10, 39]],
    ['b', [1, 2, 3, 4, 5, 6, 7], [0.5, 2.5, 2, 4, 3.5, 6, 5.5]],
    ['c', [1, 3, 5, 7, 10, 12, 13, 16, 18, 20], [3, 2, 6, 5, 8, 7, 10, 9, 12, 10]],
    ['d', [1, 3, 5, 6, 8, 10, 12], [1.5, 2.5, 3.5, 4, 5, 6, 7]],
    ['e', [2, 3, 5, 7, 9, 10, 11], [4, 9, 25, 49, 81, 100, 121]],
  ];
  const sums = (xs, ys) => { const S = (f) => xs.reduce((a, x, i) => a + f(x, ys[i]), 0); return [S((x) => x), S((x, y) => y), S((x, y) => x * y), S((x) => x * x)]; };
  const solve = ([k, xs, ys], deg = 1) => {
    const r = N.regression(xs, ys, deg), [sx, sy, sxy, sx2] = sums(xs, ys);
    return `<h4>${k}) n = ${xs.length}</h4>${table(['Σx', 'Σy', 'Σxy', 'Σx²', 'x̄', 'ȳ'], [[num(sx, 4), num(sy, 4), num(sxy, 4), num(sx2, 4), num(sx / xs.length, 4), num(sy / xs.length, 4)]])}
      ${table(['a₀', 'a₁', 'S<sub>r</sub>', 'S<sub>t</sub>', 's<sub>y</sub>', 's<sub>y/x</sub>', 'r²'], [[num(r.a[0], 5), num(r.a[1], 5), num(r.Sr, 4), num(r.St, 4), num(r.sy, 4), num(r.syx, 4), num(r.r2, 4)]])}
      <p>Recta: <b>y = ${num(r.a[0], 4)} ${r.a[1] < 0 ? '−' : '+'} ${num(Math.abs(r.a[1]), 4)} x</b>. ${r.syx < r.sy ? 's<sub>y/x</sub> &lt; s<sub>y</sub>: el ajuste es adecuado' : 's<sub>y/x</sub> ≥ s<sub>y</sub>: la recta no mejora al promedio'}; explica el ${num(r.r2 * 100, 1)} % de la variabilidad.</p>`;
  };
  const B = SETS[1], rb = N.regression(B[1], B[2]);

  LESSONS.push(
    {
      id: 'regresion-lineal',
      module: 'u6r',
      title: 'Regresión lineal por mínimos cuadrados',
      keywords: 'regresión lineal mínimos cuadrados residuo Sr St desviación estándar error estándar de la aproximación coeficiente de determinación correlación',
      tldr: 'Cuando los datos tienen error, no conviene que la curva pase por todos: se busca la recta y = a₀ + a₁x que <mark>minimiza la suma de los cuadrados de los residuos</mark> S<sub>r</sub>. Su calidad se mide con el error estándar s<sub>y/x</sub> y el coeficiente de determinación r².',
      goals: ['Explicar cuándo usar regresión en lugar de interpolación.', 'Deducir las ecuaciones normales.', 'Calcular a₀, a₁, s<sub>y</sub>, s<sub>y/x</sub> y r² (TP 8).'],
      body: `
        <p>La interpolación es inapropiada cuando los datos tienen un error sustancial, como los experimentales: forzar a la curva a pasar por cada punto copia el ruido. La estrategia es una función que siga la <strong>tendencia general</strong> sin coincidir necesariamente con cada punto.</p>
        <h2>El criterio</h2>
        <p>Con el modelo y = a₀ + a₁x + E, el <strong>residuo</strong> de cada dato es E<sub>i</sub> = y<sub>i</sub> − a₀ − a₁x<sub>i</sub>. Trazar la “mejor” recta a ojo es arbitrario; hace falta un criterio:</p>
        ${table(['Criterio', 'Problema'], [['Minimizar Σ E<sub>i</sub>', 'Los residuos positivos y negativos se cancelan: cualquier recta por el centro da 0'], ['Minimizar Σ |E<sub>i</sub>|', 'No da una recta única'], ['<b>Minimizar S<sub>r</sub> = Σ E<sub>i</sub>²</b>', 'Da una única recta: <b>mínimos cuadrados</b>']])}
        ${eq('S<sub>r</sub> = Σ (y<sub>i</sub> − a₀ − a₁x<sub>i</sub>)²', 'Suma de los cuadrados de los residuos')}
        <h2>Ecuaciones normales</h2>
        <p>Se deriva S<sub>r</sub> respecto de cada coeficiente y se iguala a cero:</p>
        ${eq('∂S<sub>r</sub>/∂a₀ = −2 Σ (y<sub>i</sub> − a₀ − a₁x<sub>i</sub>) = 0 &nbsp;&nbsp; ∂S<sub>r</sub>/∂a₁ = −2 Σ [(y<sub>i</sub> − a₀ − a₁x<sub>i</sub>) x<sub>i</sub>] = 0')}
        ${eq('n a₀ + a₁ Σx<sub>i</sub> = Σy<sub>i</sub> &nbsp;&nbsp; a₀ Σx<sub>i</sub> + a₁ Σx<sub>i</sub>² = Σx<sub>i</sub>y<sub>i</sub>', 'Usando Σa₀ = n a₀')}
        ${eq(`a₁ = ${frac('n Σx<sub>i</sub>y<sub>i</sub> − Σx<sub>i</sub> Σy<sub>i</sub>', 'n Σx<sub>i</sub>² − (Σx<sub>i</sub>)²')} &nbsp;&nbsp; a₀ = ȳ − a₁ x̄`, 'Pendiente y ordenada al origen')}
        ${lab(0)}
        <h2>¿Qué tan bueno es el ajuste?</h2>
        ${table(['Medida', 'Fórmula', 'Qué mide'], [
          ['S<sub>t</sub>', 'Σ (y<sub>i</sub> − ȳ)²', 'Dispersión de los datos alrededor de la media, <b>antes</b> de la regresión'],
          ['Desviación estándar s<sub>y</sub>', '√(S<sub>t</sub> / (n − 1))', 'Dispersión alrededor de la media (se pierde 1 grado de libertad por usar ȳ)'],
          ['Error estándar de la aproximación s<sub>y/x</sub>', '√(S<sub>r</sub> / (n − 2))', 'Dispersión alrededor de la recta (se pierden 2 grados por a₀ y a₁)'],
          ['Coeficiente de determinación r²', '(S<sub>t</sub> − S<sub>r</sub>) / S<sub>t</sub>', 'Fracción de la variabilidad explicada por la recta'],
          ['Coeficiente de correlación r', '√r²', 'Lo mismo, en escala 0 a 1'],
        ])}
        <p>Si <strong>s<sub>y/x</sub> &lt; s<sub>y</sub></strong>, la recta es un modelo adecuado. r² = 1 es un ajuste perfecto (S<sub>r</sub> = 0); r² = 0 significa que la recta no mejora nada respecto de usar el promedio.</p>
        <h2>Ejemplo: TP 8, b</h2>
        ${chart({ x: [0, 8], y: [0, 7], ticks: { x: [1, 2, 3, 4, 5, 6, 7], y: [2, 4, 6] }, curves: [{ f: rb.fit, cls: 'c-root', label: 'y = 0,0714 + 0,8393x' }], segs: B[1].map((x, i) => ({ from: [x, B[2][i]], to: [x, rb.fit(x)], cls: 'c-s' })), points: B[1].map((x, i) => ({ x, y: B[2][i], cls: 'c-f' })) }, 'Los residuos (rojo) son las distancias verticales. La recta minimiza la suma de sus cuadrados.')}
        ${note('Un r² alto no prueba que el modelo lineal sea el correcto: los datos del TP 8 e siguen y = x² y aun así la recta da r² ≈ 0,97. Siempre hay que mirar el gráfico de los residuos: si forman una curva, el modelo es inadecuado.', 'warn')}`,
      labs: [{ type: 'regression', set: 'b', deg: 1, title: 'Recta de mínimos cuadrados', intro: 'Cambiá de tabla y mirá los residuos. En la a) hay un dato atípico (6; 39): mirá cuánto tira de la recta.' }],
      exercises: [
        { title: 'Recta, desviación estándar y r²', official: '8.1', level: 2, prompt: '<p>Ajustar una recta por mínimos cuadrados y calcular la desviación estándar y el coeficiente de determinación: a) x: 1, 2, 3, 5, 6; y: 4,1; 5; 7,9; 10; 39. b) x: 1 a 7; y: 0,5; 2,5; 2; 4; 3,5; 6; 5,5. c) x: 1, 3, 5, 7, 10, 12, 13, 16, 18, 20; y: 3, 2, 6, 5, 8, 7, 10, 9, 12, 10. d) x: 1, 3, 5, 6, 8, 10, 12; y: 1,5; 2,5; 3,5; 4; 5; 6; 7. e) x: 2, 3, 5, 7, 9, 10, 11; y: 4, 9, 25, 49, 81, 100, 121.</p>', hints: ['Armá una tabla con columnas x, y, xy, x² y sumá.'],
          solution: { explain: SETS.map((s) => solve(s)).join('') + '<p>La b) es el ejemplo 17.1 de Chapra: a₀ = 0,0714, a₁ = 0,8393, r² = 0,868. En la a) el valor 39 hace que s<sub>y/x</sub> sea enorme. En la e) conviene una parábola (próxima lección).</p>' } },
      ],
      quiz: [
        { q: 'Mínimos cuadrados minimiza…', o: ['la suma de los residuos', 'la suma de los cuadrados de los residuos', 'el residuo máximo', 'la distancia a la media'], a: 1, e: 'S_r = Σ E_i².' },
        { q: 'a₀ = …', o: ['ȳ − a₁ x̄', 'x̄ − a₁ ȳ', 'Σy/Σx', 'S_r/n'], a: 0, e: 'La recta pasa por el punto (x̄, ȳ).' },
        { q: 's_{y/x} divide por n − 2 porque…', o: ['hay dos datos menos', 'se usaron dos coeficientes estimados (a₀ y a₁)', 'es una convención', 'r² lo exige'], a: 1, e: 'Se pierden dos grados de libertad.' },
        { q: 'r² = 0,87 significa que…', o: ['el 87 % de los puntos está sobre la recta', 'la recta explica el 87 % de la variabilidad de y', 'el error es 13 %', 'la pendiente es 0,87'], a: 1, e: '(S_t − S_r)/S_t.' },
        { q: 'La regresión es preferible a la interpolación cuando…', o: ['hay pocos datos exactos', 'los datos tienen error sustancial', 'se quiere pasar por todos los puntos', 'nunca'], a: 1, e: 'Sigue la tendencia sin copiar el ruido.' },
      ],
      sources: [{ title: 'Apunte: Regresión con Mínimos Cuadrados', ref: 'Cátedra de Matemática Superior', points: ['Criterio de mínimos cuadrados y deducción de a₀ y a₁.', 'Desviación estándar, error estándar de la aproximación y r².'] }, { title: 'Métodos Numéricos para Ingenieros', ref: 'Chapra y Canale, cap. 17', points: ['Ejemplo 17.1, mismos datos que el TP 8 b.'] }],
    },

    {
      id: 'regresion-cuadratica',
      module: 'u6r',
      title: 'Regresión cuadrática por mínimos cuadrados',
      keywords: 'regresión cuadrática polinomial parábola mínimos cuadrados ecuaciones normales sistema 3x3',
      tldr: 'Si los datos siguen una curva, se ajusta una <mark>parábola</mark> y = a₀ + a₁x + a₂x² con el mismo criterio: minimizar S<sub>r</sub>. Derivando respecto de los tres coeficientes queda un sistema lineal de 3 × 3.',
      goals: ['Plantear las ecuaciones normales de la regresión cuadrática.', 'Comparar recta y parábola con s<sub>y/x</sub> y r².'],
      body: `
        ${eq('S<sub>r</sub> = Σ (y<sub>i</sub> − a₀ − a₁x<sub>i</sub> − a₂x<sub>i</sub>²)²')}
        <p>Igualando a cero las tres derivadas parciales:</p>
        ${table(['', 'a₀', 'a₁', 'a₂', '='], [['∂/∂a₀', 'n', 'Σx<sub>i</sub>', 'Σx<sub>i</sub>²', 'Σy<sub>i</sub>'], ['∂/∂a₁', 'Σx<sub>i</sub>', 'Σx<sub>i</sub>²', 'Σx<sub>i</sub>³', 'Σx<sub>i</sub>y<sub>i</sub>'], ['∂/∂a₂', 'Σx<sub>i</sub>²', 'Σx<sub>i</sub>³', 'Σx<sub>i</sub>⁴', 'Σx<sub>i</sub>²y<sub>i</sub>']])}
        <p>Es un sistema lineal: se resuelve por Cramer, Gauss o sustitución. El error estándar ahora divide por <strong>n − 3</strong> (tres coeficientes estimados): s<sub>y/x</sub> = √(S<sub>r</sub>/(n − 3)). r² se calcula igual.</p>
        ${lab(0)}
        ${note('Comparar modelos: el que tenga menor s<sub>y/x</sub> (o mayor r²) ajusta mejor. En el TP 8 e la parábola da a₀ = 0, a₁ = 0, a₂ = 1 exactos y r² = 1: los datos son y = x².', 'exam')}`,
      labs: [{ type: 'regression', set: 'e', deg: 2, title: 'Recta contra parábola', intro: 'Con los datos e), alterná entre recta y parábola: los residuos de la recta forman una curva; los de la parábola desaparecen.' }],
      exercises: [
        { title: 'Parábola para los datos e) del TP 8', level: 2, prompt: '<p>Ajustar y = a₀ + a₁x + a₂x² a los datos x: 2, 3, 5, 7, 9, 10, 11; y: 4, 9, 25, 49, 81, 100, 121, y comparar con la recta.</p>',
          solution: { explain: (() => { const [, xs, ys] = SETS[4], q = N.regression(xs, ys, 2), l = N.regression(xs, ys, 1); return `<p>Sumas: n = 7, Σx = 47, Σx² = 389, Σx³ = 3563, Σx⁴ = 34325, Σy = 389, Σxy = 3563, Σx²y = 34325 (como y = x², las sumas se repiten).</p>${table(['Modelo', 'Coeficientes', 's<sub>y/x</sub>', 'r²'], [['Recta', `a₀ = ${num(l.a[0], 4)}, a₁ = ${num(l.a[1], 4)}`, num(l.syx, 4), num(l.r2, 4)], ['Parábola', `a₀ = ${num(q.a[0], 4)}, a₁ = ${num(q.a[1], 4)}, a₂ = ${num(q.a[2], 4)}`, num(q.syx, 4), num(q.r2, 4)]])}`; })() } },
      ],
      quiz: [
        { q: 'La regresión cuadrática lleva a un sistema de…', o: ['2 × 2', '3 × 3', '4 × 4', 'una ecuación'], a: 1, e: 'Una ecuación por coeficiente.' },
        { q: 'En la cuadrática, s_{y/x} divide por…', o: ['n − 1', 'n − 2', 'n − 3', 'n'], a: 2, e: 'Tres coeficientes estimados.' },
        { q: 'Si los residuos de la recta forman una curva sistemática…', o: ['el ajuste es perfecto', 'conviene un modelo no lineal (por ejemplo, una parábola)', 'hay que interpolar', 'r² = 1'], a: 1, e: 'Los residuos tendrían que ser aleatorios.' },
      ],
      sources: [{ title: 'Programa analítico 2026', ref: 'Unidad 6', points: ['6.6 Método de regresión de mínimos cuadrados cuadrático.'] }, { title: 'Métodos Numéricos para Ingenieros', ref: 'Chapra y Canale, sección 17.2', points: ['Regresión polinomial.'] }],
    },

    {
      id: 'regresion-teoria',
      module: 'u6r',
      title: 'A fondo: por qué mínimos cuadrados, error de los datos y del modelo',
      keywords: 'ajuste de curvas cuándo regresión datos confiables ruido por qué mínimos cuadrados criterios minimax residuos error antes después St Sr sy syx coeficiente determinación modelo adecuado linealización exponencial potencia supuestos chapra',
      tldr: 'La regresión se usa cuando los datos <mark>tienen error</mark> y se quiere su tendencia, no pasar por cada punto. Mínimos cuadrados minimiza S<sub>r</sub> = Σ e<sub>i</sub>² porque los otros criterios fallan (los residuos se cancelan, no hay recta única o pesa demasiado un punto raro). El error <strong>antes</strong> de la regresión es S<sub>t</sub> (alrededor de la media) y el de <strong>después</strong>, S<sub>r</sub> (alrededor de la recta): si s<sub>y/x</sub> &lt; s<sub>y</sub> el modelo es adecuado y r² dice cuánto.',
      goals: ['Responder cuándo se usa el ajuste de curvas y qué significa ajustar una recta.', 'Justificar por qué mínimos cuadrados y no otro criterio.', 'Distinguir error de los datos y error del modelo; decidir si el modelo es adecuado y qué hacer si no lo es.'],
      body: `
        <h2>¿Cuándo se ajusta una curva por regresión?</h2>
        <p>Chapra (PT5.1): “si los datos exhiben un grado significativo de error o ruido, la estrategia será obtener una sola curva que represente la tendencia general de los datos. Como cualquier dato individual puede ser incorrecto, no se busca intersecar todos los puntos”. Es lo opuesto a la interpolación, que se usa con datos precisos. Además del ajuste, la regresión sirve para <strong>predecir</strong> (estimar y para otros x) y para <strong>probar hipótesis</strong>: comparar un modelo teórico con mediciones.</p>
        ${note('V o F del 2P 2025 A: “Los datos en regresión lineal no son confiables”. <strong>Verdadero</strong>, en el sentido del libro: la regresión se aplica a datos con error o ruido (mediciones experimentales), y por eso no se obliga a la recta a pasar por cada punto. Si los datos fueran exactos, se interpolaría.', 'exam')}
        <h2>¿Qué significa ajustar por una línea recta?</h2>
        ${eq('y = a₀ + a₁x + e', 'Modelo lineal (Chapra, ec. 17.1)')}
        <p>Encontrar la pendiente a₁ y la ordenada al origen a₀ de la recta que mejor representa la tendencia de los datos, aceptando que cada dato se separa de ella un residuo e<sub>i</sub> = y<sub>i</sub> − (a₀ + a₁x<sub>i</sub>). “Mejor” necesita un criterio.</p>
        <h2>¿Por qué mínimos cuadrados y no otro criterio?</h2>
        ${table(['Criterio', 'Problema (Chapra, sección 17.1.1, figura 17.2)'], [
          ['Minimizar Σ e<sub>i</sub>', 'Los residuos positivos y negativos se cancelan: cualquier recta que pase por el punto medio da suma cero'],
          ['Minimizar Σ |e<sub>i</sub>|', 'No da una recta única: muchas rectas logran el mismo mínimo'],
          ['Minimax: minimizar el mayor |e<sub>i</sub>|', 'Le da excesiva influencia a un solo punto con mucho error'],
          ['<b>Minimizar S<sub>r</sub> = Σ e<sub>i</sub>²</b>', '<b>Supera las tres deficiencias</b>: no hay cancelación, la recta es única y se obtiene con dos ecuaciones lineales (las normales) al derivar e igualar a cero'],
        ])}
        <p>Además, si se cumplen los supuestos estadísticos (Chapra 17.1.6: las x se conocen sin error, las y son independientes, con la misma varianza y distribuidas normalmente), mínimos cuadrados da las mejores estimaciones posibles de a₀ y a₁.</p>
        <h2>Error de los datos y error del modelo</h2>
        ${table(['', 'Antes de la regresión (error de los datos)', 'Después de la regresión (error del modelo)'], [
          ['Suma de cuadrados', 'S<sub>t</sub> = Σ (y<sub>i</sub> − ȳ)²: dispersión alrededor de la media', 'S<sub>r</sub> = Σ (y<sub>i</sub> − a₀ − a₁x<sub>i</sub>)²: dispersión alrededor de la recta'],
          ['Desviación', 's<sub>y</sub> = √(S<sub>t</sub>/(n − 1)), desviación estándar', 's<sub>y/x</sub> = √(S<sub>r</sub>/(n − 2)), error estándar del estimado'],
          ['Qué mide', 'Cuánto varían los datos si se los describe solo con su promedio', 'Cuánto se separan los datos de lo que predice el modelo'],
        ])}
        <p>Chapra (sección 17.1.3) llama a S<sub>t</sub> “el error residual asociado con la variable dependiente antes de la regresión” y a S<sub>r</sub> el que “queda después de la regresión”. La diferencia S<sub>t</sub> − S<sub>r</sub> es la mejora por usar la recta en lugar del promedio; normalizada da el <strong>coeficiente de determinación</strong>:</p>
        ${eq(`r² = ${frac('S<sub>t</sub> − S<sub>r</sub>', 'S<sub>t</sub>')}`, 'Chapra, ec. 17.10')}
        <h2>¿Cómo se sabe si el modelo es adecuado y cuánto?</h2>
        <ol>
          <li><strong>Adecuado</strong>: si s<sub>y/x</sub> &lt; s<sub>y</sub>, la recta describe los datos mejor que el promedio (Chapra, ejemplo 17.2).</li>
          <li><strong>Cuánto</strong>: r² es la fracción de la variabilidad original que explica el modelo. r² = 1 (S<sub>r</sub> = 0) es un ajuste perfecto; r² = 0 (S<sub>r</sub> = S<sub>t</sub>), ninguna mejora.</li>
          <li><strong>Mirar el gráfico</strong>: Chapra advierte que “el solo hecho de que r sea cercana a 1 no necesariamente significa que el ajuste sea bueno”: se puede obtener un r alto con datos curvos. Si los residuos forman un patrón (todos positivos en los extremos y negativos en el medio, por ejemplo), la recta no es el modelo correcto.</li>
        </ol>
        ${note('Ejemplo del 2P tema B: S<sub>t</sub> = 220, s<sub>y</sub> = 6,06 (antes); S<sub>r</sub> = 2,71, s<sub>y/x</sub> = 0,74 (después). Como 0,74 &lt; 6,06 el modelo es adecuado, y r² = 0,988: la recta explica el 98,8 % de la variabilidad.', 'tip')}
        <h2>Si el modelo no es adecuado, ¿qué hacer?</h2>
        <p>Chapra (sección 17.1.5): “el primer paso en cualquier análisis de regresión deberá ser graficar e inspeccionar los datos”. Si la tendencia es curva:</p>
        ${table(['Si los datos parecen…', 'Modelo', 'Se linealiza con', 'Y se ajusta una recta a'], [
          ['crecer o decaer proporcional a sí mismos', 'y = a e<sup>bx</sup>', 'ln y = ln a + b x', '(x, ln y)'],
          ['una potencia', 'y = a x<sup>b</sup>', 'log y = log a + b log x', '(log x, log y)'],
          ['saturar', 'y = a x/(b + x)', '1/y = 1/a + (b/a)(1/x)', '(1/x, 1/y)'],
          ['una curva sin forma conocida', 'polinomio y = a₀ + a₁x + a₂x²', 'regresión polinomial (sección 17.2)', 'tres ecuaciones normales'],
        ])}
        ${note('Respuesta modelo (2P 2025 A, ejercicio 3): “a) Se usa cuando los datos tienen error y se busca una función que muestre su tendencia general, sin pasar por cada punto. b) El error de los datos es la dispersión alrededor de la media, S<sub>t</sub> (s<sub>y</sub>); el error del modelo es la dispersión alrededor de la recta, S<sub>r</sub> (s<sub>y/x</sub>). c) El modelo es adecuado si s<sub>y/x</sub> &lt; s<sub>y</sub>, y r² = (S<sub>t</sub> − S<sub>r</sub>)/S<sub>t</sub> indica qué porcentaje de la variabilidad explica; conviene también graficar los residuos. d) Si no es adecuado, se prueba otro modelo: linealizar (exponencial, potencia) o regresión polinomial.”', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'regression', set: 'pb', deg: 1, title: 'Antes y después de la regresión', intro: 'Datos del 2P tema B. La línea punteada ȳ es el modelo “antes” (S_t mide los desvíos hasta ella); los segmentos rojos son los residuos “después” (S_r). Cambiá a la tabla e del TP 8 para ver residuos con patrón.' }],
      quiz: [
        { q: 'Minimizar Σ eᵢ (sin cuadrados) es un mal criterio porque…', o: ['da números muy grandes', 'los residuos positivos y negativos se cancelan', 'necesita derivadas', 'no se puede calcular'], a: 1, e: 'Cualquier recta por el punto medio da cero.' },
        { q: 'El criterio minimax es inadecuado para regresión porque…', o: ['ignora los datos', 'le da excesiva influencia a un punto con mucho error', 'siempre da una recta horizontal', 'no tiene solución'], a: 1, e: 'Chapra 17.1.1, figura 17.2c.' },
        { q: 'El error “antes de la regresión” es…', o: ['S_r', 'S_t, la dispersión alrededor de la media', 'r²', 'a₁'], a: 1, e: 'S_t = Σ(yᵢ − ȳ)².' },
        { q: 'El modelo lineal es adecuado si…', o: ['s_{y/x} > s_y', 's_{y/x} < s_y', 'a₀ > 0', 'n > 5'], a: 1, e: 'La recta dispersa menos que el promedio.' },
        { q: 'Si y = a e^{bx}, para usar regresión lineal se ajusta una recta a…', o: ['(x, y)', '(x, ln y)', '(ln x, ln y)', '(1/x, 1/y)'], a: 1, e: 'ln y = ln a + bx.' },
        { q: 'r² = 0,95 significa que…', o: ['el 95 % de los puntos están sobre la recta', 'la recta explica el 95 % de la variabilidad de los datos', 'la pendiente es 0,95', 'el error es 5 %'], a: 1, e: 'r² = (S_t − S_r)/S_t.' },
      ],
      sources: [
        { title: 'Métodos numéricos para ingenieros', ref: 'Chapra y Canale, 5ª ed., PT5.1 y capítulo 17', points: ['Regresión para datos con ruido (PT5.1).', 'Criterios inadecuados y mínimos cuadrados (17.1.1).', 'S_t antes y S_r después de la regresión, s_{y/x} < s_y, r² (17.1.3, ejemplo 17.2).', 'Linealización de modelos exponencial, potencia y de razón de crecimiento (17.1.5); supuestos estadísticos (17.1.6); regresión polinomial (17.2).'] },
        { title: 'Apunte: Regresión Lineal', ref: 'Cátedra de Matemática Superior', points: ['Error en la regresión lineal: cantidad de dispersión antes (S_t) y después (S_r) de la regresión.'] },
      ],
    },
  );
})();
