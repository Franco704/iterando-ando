/* Unidad 2 (2.6): Ecuaciones diferenciales y su resolución con Laplace. Apunte "Ecuaciones Diferenciales" y clase. TP 3. */
(() => {
  const { LESSONS, h } = window.GUIDE;
  const { note, def, table, eq, frac, lab, flow, chart } = h;

  LESSONS.push(
    {
      id: 'edo-clasificacion',
      module: 'u2e',
      title: 'Ecuaciones diferenciales: tipo, orden, grado y linealidad',
      keywords: 'ecuación diferencial ordinaria parcial orden grado lineal no lineal variable dependiente independiente',
      tldr: 'Una ecuación diferencial es una igualdad que involucra <mark>derivadas</mark>. Se clasifica por <strong>tipo</strong> (ordinaria o parcial), <strong>orden</strong> (la derivada más alta), <strong>grado</strong> (la potencia de esa derivada) y <strong>linealidad</strong> (si y y sus derivadas aparecen solo a la primera potencia, sin productos ni funciones trascendentes de y).',
      goals: ['Clasificar una ecuación diferencial (pregunta teórica clásica).'],
      body: `
        ${def('Ecuación diferencial', 'Es cualquier igualdad algebraica o trascendental que involucra diferenciales o derivadas.', 'Apunte de la cátedra, Ecuaciones Diferenciales.')}
        <p>Muchas leyes físicas se escriben así. La segunda ley de Newton: f = M dv/dt, donde v es la variable dependiente y t la independiente.</p>
        ${table(['Criterio', 'Clases', 'Ejemplo'], [
          ['Tipo', '<b>Ordinaria</b>: una sola variable independiente, derivadas totales. <b>Parcial</b>: dos o más variables independientes, derivadas parciales.', 'f = M dv/dt (ordinaria); ∂²y/∂t² = a² ∂²y/∂x² (parcial, ecuación de onda)'],
          ['Orden', 'La derivada de mayor orden que aparece', '(d³y/dx³)² + (d²y/dx²)⁵ + y/(x² + 1) = eᶻ es de orden 3'],
          ['Grado', 'El exponente de la derivada de mayor orden', 'La misma ecuación es de grado 2'],
          ['Linealidad', '<b>Lineal</b>: y y sus derivadas a la primera potencia, sin productos entre ellas ni funciones trascendentes de y. Si no, <b>no lineal</b>.', '(dy/dt)² + y = 0 y d²y/dt² + cos y = 0 son no lineales'],
        ])}
        ${note('El grado se mira en la derivada de <strong>mayor orden</strong>, no en la de mayor exponente. En el ejemplo del apunte, (d²y/dx²)⁵ tiene exponente 5 pero no es la derivada más alta: el grado es 2.', 'warn')}
        ${note('Laplace resuelve directamente las ecuaciones <strong>ordinarias, lineales y de coeficientes constantes</strong>: son las del TP 3. Las no lineales se atacan con métodos numéricos (Unidad 4).', 'exam')}
        ${lab(0)}`,
      labs: [{ type: 'classify', title: '¿Lineal o no lineal?', buckets: ['Lineal', 'No lineal'], items: [
        { t: 'y″ − 3y′ + 2y = 4e<sup>2t</sup>', b: 0, why: 'Las funciones de t del segundo miembro no afectan la linealidad.' },
        { t: '(dy/dt)² + y = 0', b: 1, why: 'La derivada está al cuadrado.' },
        { t: 'd²y/dt² + cos y = 0', b: 1, why: 'cos y es una función trascendente de la variable dependiente.' },
        { t: 'y″ + t² y′ − y = sen t', b: 0, why: 'Coeficientes variables en t, pero lineal en y.' },
        { t: 'y y′ = 1', b: 1, why: 'Producto de y por su derivada.' },
        { t: 'y′ = y x² − 1', b: 0, why: 'Es lineal en y (TP 5).' },
      ] }],
      quiz: [
        { q: 'd³y/dx³ + (y″)⁵ = x es de orden… y grado…', o: ['3 y 1', '2 y 5', '3 y 5', '5 y 3'], a: 0, e: 'Orden 3; la tercera derivada está a la primera potencia.' },
        { q: 'Una ecuación con derivadas parciales respecto de x y t es…', o: ['ordinaria', 'parcial', 'lineal siempre', 'de grado 2'], a: 1, e: 'Hay dos variables independientes.' },
        { q: 'y″ + sen(y) = 0 es…', o: ['lineal', 'no lineal', 'parcial', 'de orden 1'], a: 1, e: 'sen y es trascendente en la variable dependiente.' },
        { q: 'En f = M dv/dt, la variable independiente es…', o: ['v', 't', 'f', 'M'], a: 1, e: 'Se deriva respecto de t.' },
      ],
      sources: [{ title: 'Apunte: Ecuaciones Diferenciales', ref: 'Cátedra de Matemática Superior', points: ['Definición, clasificación por tipo, orden y grado.', 'Ejemplos de ecuaciones no lineales.'] }],
    },

    {
      id: 'edo-laplace',
      module: 'u2e',
      title: 'Resolver EDO con la transformada de Laplace',
      keywords: 'resolver ecuación diferencial laplace condiciones iniciales residuos y(t) solución procedimiento',
      tldr: 'Se transforman los dos miembros, se reemplazan las <mark>condiciones iniciales</mark>, se despeja Y(s), se expande en fracciones simples (residuos) y se antitransforma. Las condiciones iniciales entran solas: no hay constantes que ajustar al final.',
      goals: ['Aplicar el procedimiento completo.', 'Resolver los 12 ejercicios del TP 3.'],
      body: `
        ${flow('ℒ a ambos miembros', 'Reemplazar y(0), y′(0)', 'Agrupar y despejar Y(s)', 'Fracciones simples', 'ℒ⁻¹ → y(t)')}
        <h2>Ejemplo completo: TP 3, ejercicio 1</h2>
        <p>y″ − y = t, con y(0) = 1, y′(0) = −2.</p>
        <p><b>1. Transformar.</b> s²Y − s y(0) − y′(0) − Y = 1/s².</p>
        <p><b>2. Reemplazar condiciones.</b> s²Y − s + 2 − Y = 1/s².</p>
        <p><b>3. Despejar.</b> Y(s)(s² − 1) = 1/s² + s − 2 = (s³ − 2s² + 1)/s², entonces</p>
        ${eq(`Y(s) = ${frac('s³ − 2s² + 1', 's² (s + 1)(s − 1)')} = ${frac('R₋₁', 's + 1')} + ${frac('R₁', 's − 1')} + ${frac('A₁', 's')} + ${frac('A₂', 's²')}`)}
        <p><b>4. Residuos.</b> R₋₁ = (−1 − 2 + 1)/(1·(−2)) = 1. R₁ = (1 − 2 + 1)/(1·2) = 0. A₂ = [(s³ − 2s² + 1)/((s + 1)(s − 1))]<sub>s=0</sub> = 1/(−1) = −1. A₁ = d/ds[(s³ − 2s² + 1)/(s² − 1)]<sub>s=0</sub> = [(3s² − 4s)(s² − 1) − (s³ − 2s² + 1)·2s]/(s² − 1)² en s = 0 = 0.</p>
        ${eq(`Y(s) = ${frac('1', 's + 1')} − ${frac('1', 's²')} &nbsp; ⟹ &nbsp; <b>y(t) = e<sup>−t</sup> − t</b>`)}
        <p><b>Verificación</b> (siempre conviene): y(0) = 1 ✓; y′ = −e<sup>−t</sup> − 1, y′(0) = −2 ✓; y″ − y = e<sup>−t</sup> − e<sup>−t</sup> + t = t ✓.</p>
        ${chart({ x: [0, 3], y: [-3.2, 1.3], xl: 't', yl: 'y', ticks: { x: [1, 2, 3], y: [-3, -2, -1, 1] }, curves: [{ f: (t) => Math.exp(-t) - t, cls: 'c-f', label: 'y = e^(−t) − t' }], points: [{ x: 0, y: 1, cls: 'c-root', label: 'y(0) = 1' }], segs: [{ from: [0, 1], to: [0.5, 0], cls: 'c-root' }], texts: [{ x: 0.95, y: 0.25, t: 'pendiente y′(0) = −2', cls: 'c-root' }] }, 'La solución arranca en y(0) = 1 con pendiente −2, como exigen las condiciones iniciales.')}
        <h2>Ejemplo con traslación en el segundo miembro: TP 3, ejercicio 3</h2>
        <p>y″ + 2y′ − 3y = e<sup>t</sup> senh t, y(0) = 0, y′(0) = 1. Por traslación, ℒ{e<sup>t</sup> senh t} = 1/((s − 1)² − 1) = 1/(s(s − 2)).</p>
        ${eq(`Y(s)(s² + 2s − 3) = ${frac('1', 's(s − 2)')} + 1 = ${frac('(s − 1)²', 's(s − 2)')} &nbsp; ⟹ &nbsp; Y(s) = ${frac('(s − 1)²', 's(s − 2)(s + 3)(s − 1)')}`)}
        <p>El factor (s − 1) se simplifica (su residuo da 0). R₀ = 1/6, R₂ = 1/10, R₋₃ = −4/15:</p>
        ${eq('y(t) = 1/6 + (1/10) e<sup>2t</sup> − (4/15) e<sup>−3t</sup>')}
        ${note('Errores típicos: olvidar el signo menos de las condiciones iniciales (ℒ{y″} = s²Y − s y(0) − y′(0)), no multiplicar por el coeficiente de y′ los términos de su condición inicial (2[sY − y(0)]), y no verificar al final.', 'warn')}
        ${lab(0)}`,
      labs: [{ type: 'order', title: 'Ordená el procedimiento', items: ['Aplicar ℒ a ambos miembros de la ecuación', 'Reemplazar las condiciones iniciales y(0) y y′(0)', 'Sacar factor común Y(s) y despejarla', 'Expandir Y(s) en fracciones simples calculando los residuos', 'Aplicar la transformada inversa término a término', 'Verificar que y(t) cumple la ecuación y las condiciones iniciales'], explain: 'Ese es el esquema de todo el TP 3 y del primer parcial en la parte de ecuaciones diferenciales.' }],
      exercises: [
        { title: 'Ejercicios 1 a 6', official: '3.1', level: 2, prompt: '<p>1) y″ − y = t; y(0) = 1, y′(0) = −2. 2) y″ − 3y′ + 2y = 4e<sup>2t</sup>; y(0) = −3, y′(0) = 5. 3) y″ + 2y′ − 3y = e<sup>t</sup> senh t; y(0) = 0, y′(0) = 1. 4) y″ − 3y′ + 2y = t²e<sup>t</sup>; y(0) = y′(0) = 0. 5) y″ − 9y = cosh 2t; y(0) = 1, y′(0) = −1. 6) y″ − 4y = 9t; y(0) = 0, y′(0) = 7.</p>', hints: ['2) el segundo miembro tiene polo en s = 2, que también es raíz de s² − 3s + 2: queda un polo doble.', '4) ℒ{t²eᵗ} = 2/(s − 1)³ y s² − 3s + 2 = (s − 1)(s − 2): polo cuádruple en s = 1.'],
          solution: { explain: table(['', 'Y(s)', 'y(t)'], [
            ['1', '(s³ − 2s² + 1)/(s²(s + 1)(s − 1))', 'e<sup>−t</sup> − t'],
            ['2', '(−3s² + 20s − 24)/((s − 1)(s − 2)²)', '−7e<sup>t</sup> + 4e<sup>2t</sup> + 4t e<sup>2t</sup>'],
            ['3', '(s − 1)/(s(s − 2)(s + 3))', '1/6 + (1/10)e<sup>2t</sup> − (4/15)e<sup>−3t</sup>'],
            ['4', '2/((s − 1)⁴(s − 2))', '2e<sup>2t</sup> − (2 + 2t + t² + t³/3) e<sup>t</sup>'],
            ['5', '[s/(s² − 4) + s − 1]/(s² − 9)', '(13/30)e<sup>3t</sup> + (23/30)e<sup>−3t</sup> − (1/10)e<sup>2t</sup> − (1/10)e<sup>−2t</sup> = (13/30)e<sup>3t</sup> + (23/30)e<sup>−3t</sup> − (1/5) cosh 2t'],
            ['6', '(7s² + 9)/(s²(s² − 4))', '−(9/4)t + (37/16)e<sup>2t</sup> − (37/16)e<sup>−2t</sup> = −(9/4)t + (37/8) senh 2t'],
          ]) } },
        { title: 'Ejercicios 7 a 12', official: '3.7', level: 2, prompt: '<p>7) y″ − 3y′ + 2y = 4t + 12e<sup>−t</sup>; y(0) = 6, y′(0) = −1. 8) y″ − 5y′ + 4y = 125t²; y(0) = y′(0) = 0. 9) y″ − y = 8 cosh t; y(0) = 1, y′(0) = −1. 10) y″ − y = e<sup>t</sup>; y(0) = y′(0) = 0. 11) y″ − 4y = 2; y(0) = y′(0) = 0. 12) y″ − 6y′ + 5y = e<sup>−2t</sup>; y(0) = y′(0) = 0.</p>', hints: ['9) y 10): el segundo miembro “resuena” con la homogénea (polo repetido en s = 1): aparece t eᵗ.'],
          solution: { explain: table(['', 'y(t)'], [
            ['7', '3 + 2t + 3e<sup>t</sup> − 2e<sup>2t</sup> + 2e<sup>−t</sup>'],
            ['8', '(125/4)t² + (625/8)t + 2625/32 − (250/3)e<sup>t</sup> + (125/96)e<sup>4t</sup>'],
            ['9', 'e<sup>−t</sup> + 2t e<sup>t</sup> − 2t e<sup>−t</sup> = e<sup>−t</sup> + 4t senh t'],
            ['10', '(1/2)t e<sup>t</sup> − (1/4)e<sup>t</sup> + (1/4)e<sup>−t</sup>'],
            ['11', '−1/2 + (1/4)e<sup>2t</sup> + (1/4)e<sup>−2t</sup> = (cosh 2t − 1)/2'],
            ['12', '(1/21)e<sup>−2t</sup> − (1/12)e<sup>t</sup> + (1/28)e<sup>5t</sup>'],
          ]) + '<p>Control rápido en todos: reemplazá t = 0 y tiene que dar y(0).</p>' } },
      ],
      quiz: [
        { q: 'Al transformar 2y′ con y(0) = 3 se obtiene…', o: ['2sY − 3', '2sY − 6', '2sY + 6', 'sY − 6'], a: 1, e: '2[sY − y(0)] = 2sY − 6.' },
        { q: 'Después de despejar Y(s), el paso siguiente es…', o: ['derivar', 'expandir en fracciones simples', 'integrar en t', 'reemplazar s = 0'], a: 1, e: 'Para llevar cada término a la tabla.' },
        { q: '¿Por qué con Laplace no hay que calcular constantes al final?', o: ['Porque no hay constantes', 'Porque las condiciones iniciales entran al transformar las derivadas', 'Porque s es complejo', 'Porque se usa la tabla'], a: 1, e: 'ℒ{y″} = s²Y − s y(0) − y′(0).' },
        { q: 'Si y(t) = e^(−t) − t, entonces y′(0) vale…', o: ['1', '−1', '−2', '0'], a: 2, e: 'y′ = −e^(−t) − 1.' },
      ],
      sources: [{ title: 'Clase: Ecuaciones Diferenciales', ref: 'Cátedra de Matemática Superior', points: ['TP 3, ejercicios 1 y 3 resueltos por residuos.'] }],
    },
  );
})();
