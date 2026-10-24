/* Parciales reales de la cátedra (carpeta Parciales/): registro de cada examen con sus ítems y la resolución de cada uno,
   cargada como ejercicio en la lección que le corresponde. exam: ['1p-2024-1#2a'] = ítem 2a del 1er parcial 2024, tema 1.
   Los ítems que se repiten entre parciales (mismo tipo de ejercicio o misma pregunta teórica) comparten un ejercicio.
   Resultados simbólicos verificados con SymPy; tablas de iteraciones calculadas en la página con num.js. */
(() => {
  const { LESSONS, EXAMS, h, num: N } = window.GUIDE;
  const { table, note, eq, frac, num, chart } = h;
  const lesson = (id) => { const l = LESSONS.find((x) => x.id === id); if (!l) throw new Error(`Lección inexistente: ${id}`); return l; };
  const add = (id, ...exs) => { const l = lesson(id); l.exercises = [...(l.exercises || []), ...exs]; };
  const PI = Math.PI;

  EXAMS.push(
    { id: '1p-2025-a', unit: 'p1', short: '1P 2025 A', title: 'Primer parcial 2025, tema A', sub: 'lunes 22/09/2025 · comisión 3K3',
      items: [['1a', 'ℒ{2e<sup>5t</sup> sen 3t + 4 cos 5t + 3t²}'], ['1b', 'ℒ⁻¹{(3s + 15)/(s² + 10s + 25) + 3/((s − 3)² + 9) − 24/s⁵}'], ['1c', '¿Qué propiedades de la transformada de Laplace conoce y qué tipo de ecuaciones diferenciales puede resolver?'],
        ['2a', 'Resolver y″ + 7y′ + 12y = t, con y(0) = 1 y y′(0) = −1'], ['2b', '¿Qué es una ecuación diferencial? ¿Qué tipos conoce y cuándo es lineal? ¿Qué significan las condiciones iniciales?'],
        ['3a', 'Función de transferencia de y″ + 6y′ + 10y = 5u′ + 15u con condiciones iniciales cero'], ['3b', 'V o F: la función de transferencia relaciona la transformada de la entrada con la de la salida'], ['3c', 'V o F: se puede obtener la función de transferencia con tan solo una condición inicial distinta de cero'],
        ['4a', 'Euler: dy/dx = 4x³ − 9x² + 4x − 7, de x = 1 a x = 2, y(1) = 2, h = 0,5'], ['4b', 'En Euler, ¿cómo se considera la pendiente en todo el intervalo? ¿Qué modificaciones y mejoras conoce y por qué se realizan?']] },
    { id: '1p-2025-b', unit: 'p1', short: '1P 2025 B', title: 'Primer parcial 2025, tema B', sub: 'lunes 22/09/2025 · comisión 3K3',
      items: [['1a', 'ℒ{4e<sup>2t</sup> sen 7t + 9 cos 6t + 5t³}'], ['1b', 'ℒ⁻¹{6/((s − 4)² + 36) − (4s + 3)/(2s² − 18) − 24/s³}'], ['1c', '¿Qué propiedades de la transformada de Laplace conoce y qué tipo de ecuaciones diferenciales puede resolver?'],
        ['2a', 'Resolver y″ + 7y′ + 12y = t, con y(0) = 1 y y′(0) = −1'], ['2b', 'V o F: una EDO no representa una razón de cambio; una EDO es no lineal cuando hay potencias, funciones trascendentales o productos de las variables independientes'],
        ['3a', 'Función de transferencia de y″ + 5y′ + 4y = 6u′ + 18u con condiciones iniciales cero'], ['3b', 'V o F: la función de transferencia relaciona la transformada de la entrada con la de la salida'], ['3c', 'V o F: se puede obtener la función de transferencia con tan solo una condición inicial distinta de cero'],
        ['4a', 'Polígono mejorado: dy/dx = 4x³ − 5x² + 4x − 9, de x = 1 a x = 2, y(1) = 5, h = 0,5'], ['4b', 'En Euler, ¿cómo se considera la pendiente en todo el intervalo? ¿Qué modificaciones y mejoras conoce y por qué se realizan?']] },
    { id: '1p-2024-1', unit: 'p1', short: '1P 2024 T1', title: 'Primer parcial 2024, tema 1', sub: '2024 · comisión 3K1',
      note: 'La hoja de los ejercicios 3 y 4 se asoció a este tema por el papel de la foto; el enunciado no la identifica.',
      items: [['1a', 'Sin fracciones parciales: ℒ⁻¹{s/(3s² + 18s + 30) + 24/s⁵}'], ['1b', 'ℒ{−2t³ + 5e<sup>−t</sup> senh 3t}'], ['1c', '¿A qué se denomina polo? ¿Cuál es la expresión que rige el cálculo de residuos múltiples?'],
        ['2a', 'Resolver y″ − 3y′ − 4y = e<sup>−2t</sup> + 4e<sup>t</sup>, con y(0) = 2 y y′(0) = −1'], ['2b', '¿Qué tipo de ecuaciones diferenciales se pueden resolver con la transformada de Laplace?'],
        ['3a', 'Polígono mejorado: dy/dx = yx + y(x² − 1), x de 1 a 1,9, h = 0,3, y(1) = 1'], ['3b', 'En Euler y Heun, ¿cómo se calcula la pendiente? ¿Cuál es el orden del error? Para disminuir el error, ¿conviene h muy pequeño o muy grande?'],
        ['4a', 'Función de transferencia de y″ + y′ − 6y = 5u′ + 4u y respuesta a u(t) = t (t ≥ 0)'], ['4b', '¿Qué significa que las ecuaciones diferenciales sean invariantes en el tiempo?']] },
    { id: '1p-2024-2', unit: 'p1', short: '1P 2024 T2', title: 'Primer parcial 2024, tema 2', sub: '2024',
      items: [['1a', 'Sin fracciones parciales: ℒ⁻¹{3/(2s² + 8s + 26) + 36/s⁴}'], ['1b', 'ℒ{6t² − 6e<sup>t</sup> cosh 3t}'], ['1c', '¿Con la transformada de Laplace se puede resolver cualquier tipo de ecuación diferencial? Explique'],
        ['2a', 'Resolver y″ + 5y′ + 6y = 3e<sup>t</sup> + e<sup>2t</sup>, con y(0) = 1 y y′(0) = 1'], ['2b', '¿Cuál es la clasificación de las ecuaciones diferenciales según su orden y qué significa dicho orden?'],
        ['3a', 'Heun: dy/dx = x³ − 2yx, x de 1 a 2,8, h = 0,6, y(1) = 2'], ['3b', 'En Heun y polígono mejorado, ¿cómo se calcula la pendiente? ¿Orden del error? ¿Qué ecuaciones se resuelven con los métodos aproximados?'],
        ['4a', 'Función de transferencia de y″ − 2y′ − 3y = 3u′ − 4u y respuesta a u(t) = t (t ≥ 0)'], ['4b', '¿De qué depende la respuesta en el tiempo y(t) (la transformada inversa de Y(s))?']] },
    { id: '1p-sf', unit: 'p1', short: '1P sin fecha', title: 'Primer parcial (sin fecha)', sub: 'cuatro ejercicios con teoría y práctica',
      items: [['1a', 'ℒ{7e<sup>−4t</sup> cosh 2t + 8e<sup>−3t</sup> sen 2t + 3t⁴ − 2}'], ['1b', 'ℒ⁻¹{(3s + 8)/(4s² + 64) − (4s + 3)/(2s² − 18) + 18/s⁴}'], ['1c', '¿Qué propiedades de la transformada conoce y qué tipo de ecuaciones diferenciales puede resolver?'],
        ['2a', 'Resolver y″ + 7y′ + 12y = t, con y(0) = 1 y y′(0) = −1'], ['2b', '¿Qué es una ecuación diferencial? ¿Qué tipos conoce y cuándo es lineal? ¿Qué significan las condiciones iniciales?'],
        ['3a', 'Función de transferencia de y″ + 5y′ + 4y = 6u′ + 18u con condiciones iniciales cero'], ['3b', 'Defina función de transferencia y qué condiciones iniciales debe cumplir una ecuación diferencial para obtenerla. ¿Qué significan?'],
        ['4a', 'En Euler, ¿cómo se considera la pendiente en todo el intervalo? ¿Qué modificaciones y mejoras conoce y por qué se realizan?'], ['4b', 'Euler: dy/dx = 4x³ − 9x² + 4y − 5, de x = 1 a x = 2, y(1) = 2, h = 0,5']] },

    { id: '2p-a', unit: 'p2', short: '2P tema A', title: 'Segundo parcial, tema A', sub: 'sin fecha · cuatro ejercicios con a) teoría y b) práctica',
      items: [['1a', '¿Qué particularidad tienen los métodos cerrados? ¿Cuáles conoce? ¿Cuál es el mejor y por qué?'], ['1b', 'Raíz positiva más pequeña de 3x³ + 2x − 4 = 0 por cualquier método abierto, con error del 1 %'],
        ['2a', '¿Cuándo y para qué se usan los métodos de interpolación? ¿Hay más de un polinomio? Explique diferencias divididas de Newton'], ['2b', 'Lagrange de 1° y 2° orden: f(2,5) y f(10,5) con x = 0, 2, 3, 4, 5, 6, 10 y f = 0, 7, 9, 11, 13, 15, 23'],
        ['3a', '¿Cuándo se usan los métodos de ajuste de curvas? ¿Por qué mínimos cuadrados? ¿Qué significa ajustar por una recta?'], ['3b', 'Recta de mínimos cuadrados y error antes y después: x = 1…7, y = 7, 10, 13, 16, 19, 22, 25'],
        ['4a', 'Coeficientes y serie de Fourier de f = 0 en (−π, 0), 3 en (0, π)'], ['4b', '¿Para qué se usa la serie de Fourier en ingeniería? ¿Qué condiciones debe cumplir f para que la serie converja?']] },
    { id: '2p-b', unit: 'p2', short: '2P tema B', title: 'Segundo parcial, tema B', sub: 'sin fecha · mismo formato que el tema A',
      items: [['1a', '¿Qué particularidad tienen los métodos cerrados? ¿Cuáles conoce? ¿Cuál es el mejor y por qué?'], ['1b', 'Raíz positiva más pequeña de 2x³ + 4x − 3 = 0 por cualquier método abierto, con error del 1 %'],
        ['2a', '¿Cuándo y para qué se usan los métodos de interpolación? ¿Hay más de un polinomio? Explique diferencias divididas de Newton'], ['2b', 'Lagrange de 1° y 2° orden: f(2,5) y f(10,5) con x = 0, 2, 3, 4, 5, 7, 10 y f = 2, 5, 8, 11, 12, 14, 23'],
        ['3a', '¿Cuándo se usan los métodos de ajuste de curvas? ¿Por qué mínimos cuadrados? ¿Qué significa ajustar por una recta?'], ['3b', 'Recta de mínimos cuadrados y error antes y después: x = 1…7, y = 7, 10, 12, 14, 17, 21, 24'],
        ['4a', 'Coeficientes y serie de Fourier de f = 0 en (−π, 0), 5 en (0, π)'], ['4b', '¿Para qué se usa la serie de Fourier en ingeniería? ¿Qué condiciones debe cumplir f para que la serie converja?']] },
    { id: '2p-2025', unit: 'p2', short: '2P 2025 A', title: 'Segundo parcial 2025, tema A', sub: '2025 · “Justifique ampliamente la respuesta sin omitir detalles”',
      items: [['1a', 'Una raíz positiva de f(x) = 5x³ − 3x² − x − 6 por un método cerrado, con 1 % o menos de error y al menos 3 aproximaciones'], ['1b', '¿Qué particularidad tienen los métodos abiertos? ¿Cuáles conoce? Explíquelos. ¿Cuál es el mejor y por qué?'],
        ['2a', 'Coeficientes y primeros términos de la serie de Fourier de f = 0 en (−π, 0), 3 en (0, π). Sugerencia: graficar y analizar la paridad'], ['2b', '¿Para qué se usa la serie de Fourier en ingeniería? ¿Qué condiciones debe cumplir f para que la serie converja?'],
        ['3a', 'Recta de mínimos cuadrados, error antes y después y eficiencia del método: x = 3…9, y = 6, 9, 12, 15, 18, 21, 24'], ['3b', 'V o F: los datos en regresión lineal no son confiables. ¿Cuándo se usa el ajuste de curvas? ¿Error de los datos y del modelo? ¿Cuándo es adecuado el modelo y qué hacer si no?'],
        ['4a', 'Lagrange de 1° y 2° orden: f(7) y f(15) con x = 1, 3, 5, 6, 9, 10, 11, 13 y f = 5, 7, 10, 13, 16, 19, 23, 25'], ['4b', '¿Cuándo y para qué se usan los métodos de interpolación? ¿Hay más de un polinomio? Explique Lagrange detalladamente']] },
  );

  // ---------- Unidad 2: Laplace ----------
  add('laplace-propiedades', {
    exam: ['1p-2025-a#1a', '1p-2025-b#1a', '1p-2024-1#1b', '1p-2024-2#1b', '1p-sf#1a'], level: 2, title: 'Transformadas directas de los parciales',
    prompt: '<p>Aplicando propiedades, calcular: a) ℒ{2e<sup>5t</sup> sen 3t + 4 cos 5t + 3t²} (1P 2025 A); b) ℒ{4e<sup>2t</sup> sen 7t + 9 cos 6t + 5t³} (1P 2025 B); c) ℒ{−2t³ + 5e<sup>−t</sup> senh 3t} (1P 2024 T1); d) ℒ{6t² − 6e<sup>t</sup> cosh 3t} (1P 2024 T2); e) ℒ{7e<sup>−4t</sup> cosh 2t + 8e<sup>−3t</sup> sen 2t + 3t⁴ − 2} (1P sin fecha).</p>',
    hints: ['Linealidad: cada término por separado, con su constante afuera.', 'Con e<sup>at</sup>: transformá la función sin la exponencial y reemplazá s por s − a.'],
    solution: { explain: `<p><b>Procedimiento</b> (con a): ℒ{sen 3t} = 3/(s² + 9) → por traslación con a = 5, ℒ{e<sup>5t</sup> sen 3t} = 3/((s − 5)² + 9) → por linealidad, 2·3 = 6 arriba. ℒ{cos 5t} = s/(s² + 25). ℒ{t²} = 2!/s³.</p>
      ${table(['', 'Resultado', 'Con el denominador desarrollado'], [
        ['a', '6/((s − 5)² + 9) + 4s/(s² + 25) + 6/s³', '6/(s² − 10s + 34) + 4s/(s² + 25) + 6/s³'],
        ['b', '28/((s − 2)² + 49) + 9s/(s² + 36) + 30/s⁴', '28/(s² − 4s + 53) + 9s/(s² + 36) + 30/s⁴'],
        ['c', '−12/s⁴ + 15/((s + 1)² − 9)', '−12/s⁴ + 15/(s² + 2s − 8)'],
        ['d', '12/s³ − 6(s − 1)/((s − 1)² − 9)', '12/s³ − 6(s − 1)/(s² − 2s − 8)'],
        ['e', '7(s + 4)/((s + 4)² − 4) + 16/((s + 3)² + 4) + 72/s⁵ − 2/s', '7(s + 4)/(s² + 8s + 12) + 16/(s² + 6s + 13) + 72/s⁵ − 2/s'],
      ])}
      <p>Constantes que se suelen errar: 5·3! = 30 (b), 2·3! = 12 (c), 3·4! = 72 (e), y la constante −2, que es −2·ℒ{1} = −2/s. En c) y e), e<sup>−t</sup> y e<sup>−4t</sup> trasladan a s + 1 y s + 4.</p>` },
  });
  add('laplace-inversa', {
    exam: ['1p-2025-a#1b', '1p-2025-b#1b', '1p-2024-1#1a', '1p-2024-2#1a', '1p-sf#1b'], level: 3, title: 'Transformadas inversas de los parciales (sin fracciones parciales)',
    prompt: '<p>Aplicando propiedades: a) ℒ⁻¹{(3s + 15)/(s² + 10s + 25) + 3/((s − 3)² + 9) − 24/s⁵} (1P 2025 A); b) ℒ⁻¹{6/((s − 4)² + 36) − (4s + 3)/(2s² − 18) − 24/s³} (1P 2025 B); c) ℒ⁻¹{s/(3s² + 18s + 30) + 24/s⁵} (1P 2024 T1); d) ℒ⁻¹{3/(2s² + 8s + 26) + 36/s⁴} (1P 2024 T2); e) ℒ⁻¹{(3s + 8)/(4s² + 64) − (4s + 3)/(2s² − 18) + 18/s⁴} (1P sin fecha).</p>',
    hints: ['a) s² + 10s + 25 es un cuadrado perfecto y el numerador es 3(s + 5): se simplifica.', 'c) y d) sacá factor común el coeficiente de s² y completá cuadrados.', '(4s + 3)/(2s² − 18): factor común 2 abajo y separá el numerador en un término con s y otro sin s.'],
    solution: { explain: `<h4>a) 1P 2025 A</h4>${eq(`${frac('3(s + 5)', '(s + 5)²')} = ${frac('3', 's + 5')} → 3e<sup>−5t</sup>; &nbsp; ${frac('3', '(s − 3)² + 9')} → e<sup>3t</sup> sen 3t; &nbsp; ${frac('24', 's⁵')} = ${frac('4!', 's⁵')} → t⁴`)}
      <p><b>f(t) = 3e<sup>−5t</sup> + e<sup>3t</sup> sen 3t − t⁴</b></p>
      <h4>b) 1P 2025 B</h4>${eq(`${frac('4s + 3', '2(s² − 9)')} = 2·${frac('s', 's² − 9')} + ${frac('1', '2')}·${frac('3', 's² − 9')} → 2 cosh 3t + ½ senh 3t; &nbsp; ${frac('24', 's³')} = 12·${frac('2!', 's³')} → 12t²`)}
      <p><b>f(t) = e<sup>4t</sup> sen 6t − 2 cosh 3t − ½ senh 3t − 12t²</b> (equivale a e<sup>4t</sup> sen 6t − (5/4)e<sup>3t</sup> − (3/4)e<sup>−3t</sup> − 12t²).</p>
      <h4>c) 1P 2024 T1</h4>${eq(`${frac('s', '3(s² + 6s + 10)')} = ${frac('1', '3')}·${frac('(s + 3) − 3', '(s + 3)² + 1')} → ${frac('1', '3')} e<sup>−3t</sup> cos t − e<sup>−3t</sup> sen t`)}
      <p>Y 24/s⁵ → t⁴. <b>f(t) = (1/3) e<sup>−3t</sup> cos t − e<sup>−3t</sup> sen t + t⁴</b></p>
      <h4>d) 1P 2024 T2</h4>${eq(`${frac('3', '2(s² + 4s + 13)')} = ${frac('1', '2')}·${frac('3', '(s + 2)² + 9')} → ½ e<sup>−2t</sup> sen 3t; &nbsp; ${frac('36', 's⁴')} = 6·${frac('3!', 's⁴')} → 6t³`)}
      <p><b>f(t) = ½ e<sup>−2t</sup> sen 3t + 6t³</b></p>
      <h4>e) 1P sin fecha</h4>${eq(`${frac('3s + 8', '4(s² + 16)')} = ${frac('3', '4')}·${frac('s', 's² + 16')} + ${frac('1', '2')}·${frac('4', 's² + 16')} → ¾ cos 4t + ½ sen 4t; &nbsp; ${frac('18', 's⁴')} = 3·${frac('3!', 's⁴')} → 3t³`)}
      <p>El término del medio es el mismo que en b). <b>f(t) = ¾ cos 4t + ½ sen 4t − 2 cosh 3t − ½ senh 3t + 3t³</b></p>
      ${note('“Sin fracciones parciales” quiere decir: ajustar constantes, separar el numerador y completar cuadrados. En a) la trampa es no ver que (3s + 15)/(s + 5)² se simplifica; si se hacen residuos sale lo mismo, pero más largo.', 'tip')}` },
  });
  add('laplace-teoria', {
    exam: ['1p-2025-a#1c', '1p-2025-b#1c', '1p-sf#1c', '1p-2024-1#2b', '1p-2024-2#1c'], level: 1, title: 'Propiedades de la transformada y qué ecuaciones resuelve',
    prompt: '<p>a) ¿Qué propiedades de la transformada de Laplace conoce y qué tipo de ecuaciones diferenciales puede resolver? (1P 2025 A y B, sin fecha). b) ¿Qué tipo de ecuaciones diferenciales se pueden resolver con la transformada de Laplace? (1P 2024 T1). c) ¿Se puede resolver cualquier tipo de ecuación diferencial? Explique (1P 2024 T2).</p>',
    solution: { explain: `<p><b>Propiedades</b> (con F = ℒ{f}): suma algebraica ℒ{f₁ ± f₂} = F₁ ± F₂; linealidad ℒ{c₁f₁ + c₂f₂} = c₁F₁ + c₂F₂, que también vale para la inversa; traslación ℒ{e<sup>at</sup>f(t)} = F(s − a); transformada de las derivadas ℒ{f′} = sF − f(0), ℒ{f″} = s²F − s f(0) − f′(0) y en general ℒ{f⁽ⁿ⁾} = sⁿF − sⁿ⁻¹f(0) − … − f⁽ⁿ⁻¹⁾(0).</p>
      <p><b>Qué resuelve</b>: ecuaciones diferenciales <b>ordinarias lineales</b> (de coeficientes constantes) de <b>cualquier orden</b>, con sus condiciones iniciales. La propiedad de las derivadas convierte la ecuación diferencial en una ecuación algebraica en s, se despeja Y(s) y se antitransforma.</p>
      <p><b>¿Cualquier ecuación?</b> No. Las <b>no lineales</b> (con y², y·y′, sen y…) no se pueden resolver, porque la transformada de un producto o de una potencia de y no se escribe en función de Y(s). Tampoco las ecuaciones en derivadas parciales en forma directa, ni casos donde el segundo miembro no tenga transformada (funciones que no son de orden exponencial, como e<sup>t²</sup>). Las no lineales se resuelven con los métodos aproximados de la Unidad 4. Desarrollo completo en la teoría de esta lección.</p>` },
  });
  add('fracciones-simples', {
    exam: ['1p-2024-1#1c'], level: 1, title: 'Polo y residuos múltiples (1P 2024)',
    prompt: '<p>¿A qué se denomina polo? ¿Cuál es la expresión que rige el cálculo de residuos múltiples?</p>',
    solution: { explain: `<p><b>Polo</b>: en una función racional F(s) = p(s)/q(s), con el denominador factorizado q(s) = (s − s₁)(s − s₂)…(s − s<sub>n</sub>), los valores s₁, …, s<sub>n</sub> se llaman polos: son las raíces del denominador, los valores de s donde F(s) se hace infinita. Cada polo aporta un término a la expansión en fracciones simples y, al antitransformar, un término e<sup>s<sub>k</sub>t</sup> a f(t).</p>
      <p><b>Residuos múltiples</b>: si p es un polo de multiplicidad m, F(s) contiene A₁/(s − p) + A₂/(s − p)² + … + A<sub>m</sub>/(s − p)<sup>m</sup>, y los coeficientes se calculan con</p>
      ${eq(`A<sub>m−k</sub> = ${frac('1', 'k!')} ${frac('d<sup>k</sup>', 'ds<sup>k</sup>')} [(s − p)<sup>m</sup> F(s)]<sub>s=p</sub>, &nbsp; k = 0, 1, …, m − 1`)}
      <p>El de mayor potencia (k = 0) se obtiene sin derivar; el siguiente con una derivada; el siguiente con la segunda derivada dividida por 2!. Para un polo simple queda R = [(s − p)F(s)]<sub>s=p</sub>. Ejemplo resuelto: el polo doble s = 0 en los ejercicios de rampa de la función de transferencia.</p>` },
  });

  // ---------- Unidad 2: ecuaciones diferenciales ----------
  add('edo-laplace', {
    exam: ['1p-2025-a#2a', '1p-2025-b#2a', '1p-sf#2a', '1p-2024-1#2a', '1p-2024-2#2a'], level: 3, title: 'Ecuaciones diferenciales de los parciales',
    prompt: '<p>Resolver con Laplace: a) y″ + 7y′ + 12y = t, y(0) = 1, y′(0) = −1 (1P 2025 A y B, sin fecha: la misma en tres parciales); b) y″ − 3y′ − 4y = e<sup>−2t</sup> + 4e<sup>t</sup>, y(0) = 2, y′(0) = −1 (1P 2024 T1); c) y″ + 5y′ + 6y = 3e<sup>t</sup> + e<sup>2t</sup>, y(0) = 1, y′(0) = 1 (1P 2024 T2).</p>',
    hints: ['a) s² + 7s + 12 = (s + 3)(s + 4) y el segundo miembro aporta 1/s²: polo doble en 0.', 'b) s² − 3s − 4 = (s − 4)(s + 1); c) s² + 5s + 6 = (s + 2)(s + 3). Todos los polos son simples.'],
    solution: { explain: `<h4>a) y″ + 7y′ + 12y = t</h4>
      <p>s²Y − s y(0) − y′(0) + 7[sY − y(0)] + 12Y = 1/s² → s²Y − s + 1 + 7sY − 7 + 12Y = 1/s².</p>
      ${eq(`Y(s)(s² + 7s + 12) = ${frac('1', 's²')} + s + 6 &nbsp;⟹&nbsp; Y(s) = ${frac('s³ + 6s² + 1', 's²(s + 3)(s + 4)')}`)}
      ${table(['Polo', 'Coeficiente', 'Cálculo'], [
        ['−3', 'R₋₃ = 28/9', '(−27 + 54 + 1)/((−3)²·(1)) = 28/9'],
        ['−4', 'R₋₄ = −33/16', '(−64 + 96 + 1)/((−4)²·(−1)) = −33/16'],
        ['0 (doble)', 'A₂ = 1/12', '[(s³ + 6s² + 1)/(s² + 7s + 12)]<sub>s=0</sub> = 1/12'],
        ['0 (doble)', 'A₁ = −7/144', 'd/ds[(s³ + 6s² + 1)/(s² + 7s + 12)]<sub>s=0</sub> = (0·12 − 1·7)/12² = −7/144'],
      ])}
      <p><b>y(t) = t/12 − 7/144 + (28/9) e<sup>−3t</sup> − (33/16) e<sup>−4t</sup></b>. Control: y(0) = (−7 + 448 − 297)/144 = 1 ✓.</p>
      <h4>b) y″ − 3y′ − 4y = e<sup>−2t</sup> + 4e<sup>t</sup></h4>
      <p>s²Y − 2s + 1 − 3(sY − 2) − 4Y = 1/(s + 2) + 4/(s − 1) → Y(s − 4)(s + 1) = (5s + 7)/((s + 2)(s − 1)) + 2s − 7.</p>
      ${eq(`Y(s) = ${frac('2s³ − 5s² − 6s + 21', '(s − 4)(s + 1)(s + 2)(s − 1)')}`)}
      <p>R₄ = 45/(5·6·3) = 1/2; R₋₁ = 20/((−5)(1)(−2)) = 2; R₋₂ = −3/((−6)(−1)(−3)) = 1/6; R₁ = 12/((−3)(2)(3)) = −2/3.</p>
      <p><b>y(t) = ½ e<sup>4t</sup> + 2e<sup>−t</sup> + (1/6) e<sup>−2t</sup> − (2/3) e<sup>t</sup></b>. Control: ½ + 2 + 1/6 − 2/3 = 2 ✓.</p>
      <h4>c) y″ + 5y′ + 6y = 3e<sup>t</sup> + e<sup>2t</sup></h4>
      <p>s²Y − s − 1 + 5(sY − 1) + 6Y = 3/(s − 1) + 1/(s − 2) → Y(s + 2)(s + 3) = (4s − 7)/((s − 1)(s − 2)) + s + 6.</p>
      ${eq(`Y(s) = ${frac('s³ + 3s² − 12s + 5', '(s − 1)(s − 2)(s + 2)(s + 3)')}`)}
      <p>R₁ = −3/((−1)(3)(4)) = 1/4; R₂ = 1/(1·4·5) = 1/20; R₋₂ = 33/((−3)(−4)(1)) = 11/4; R₋₃ = 41/((−4)(−5)(−1)) = −41/20.</p>
      <p><b>y(t) = ¼ e<sup>t</sup> + (1/20) e<sup>2t</sup> + (11/4) e<sup>−2t</sup> − (41/20) e<sup>−3t</sup></b>. Control: 0,25 + 0,05 + 2,75 − 2,05 = 1 ✓.</p>` },
  });
  add('edo-teoria', {
    exam: ['1p-2025-a#2b', '1p-sf#2b', '1p-2024-2#2b'], level: 1, title: 'Qué es una EDO, tipos, linealidad, orden y condiciones iniciales',
    prompt: '<p>a) ¿Qué es una ecuación diferencial? ¿Qué tipos conoce y cuándo es lineal? ¿Qué significan las condiciones iniciales? (1P 2025 A y sin fecha). b) ¿Cuál es la clasificación de las ecuaciones diferenciales según su orden y qué significa dicho orden? (1P 2024 T2).</p>',
    solution: { explain: `<p><b>Definición</b>: una ecuación diferencial es cualquier igualdad algebraica o trascendental que involucra diferenciales o derivadas. Relaciona razones de cambio de variables (por ejemplo f = M dv/dt).</p>
      <p><b>Tipos</b>: <i>ordinaria</i> si la variable dependiente es función de una sola variable independiente (derivadas totales); <i>parcial</i> si depende de dos o más (derivadas parciales). Se clasifican además por <i>orden</i> (la derivada de mayor orden que aparece), <i>grado</i> (exponente de esa derivada) y <i>linealidad</i>.</p>
      <p><b>Lineal</b>: cuando la variable dependiente y sus derivadas aparecen a la primera potencia, sin productos entre ellas ni funciones trascendentes de ellas: a<sub>n</sub>(x)y⁽ⁿ⁾ + … + a₁(x)y′ + a₀(x)y = f(x). Si algún término tiene potencias, productos o funciones trascendentales de la variable dependiente, es no lineal.</p>
      <p><b>Orden</b>: primer orden (y′ es la derivada más alta), segundo orden (y″), …, orden n. El orden indica cuántas veces habría que integrar para resolverla y, por lo tanto, cuántas constantes arbitrarias tiene la solución general y <b>cuántas condiciones iniciales</b> hacen falta para una solución única.</p>
      <p><b>Condiciones iniciales</b>: son los valores conocidos de la función y de sus derivadas en el instante inicial (y(0), y′(0), …): el estado del sistema al comenzar el estudio. Fijan las constantes de la solución general y eligen una única curva de la familia. En Laplace entran al transformar las derivadas.</p>` },
  }, {
    exam: ['1p-2025-b#2b'], level: 1, title: 'Verdadero o falso sobre EDO (1P 2025 B)',
    prompt: '<p>a) Una ecuación diferencial ordinaria no representa una razón de cambio de una variable con respecto a otra. b) Una ecuación diferencial ordinaria es no lineal cuando hay potencias, funciones trascendentales o productos de las variables independientes.</p>',
    solution: { explain: '<p>a) <b>Falso</b>: la derivada dy/dx es la razón de cambio de la variable dependiente respecto de la independiente; una EDO relaciona justamente esas razones de cambio.</p><p>b) <b>Falso</b>: la linealidad se define sobre la variable <b>dependiente</b> y sus derivadas. y″ + x²y = sen x tiene una potencia y una función trascendente de x (la independiente) y es lineal; y″ + y² = 0 es no lineal.</p>' },
  });

  // ---------- Unidad 3: función de transferencia ----------
  add('ft-definicion', {
    exam: ['1p-2025-a#3a', '1p-2025-b#3a', '1p-sf#3a'], level: 1, title: 'Funciones de transferencia de los parciales',
    prompt: '<p>Con condiciones iniciales cero: a) y″ + 6y′ + 10y = 5u′ + 15u (1P 2025 A); b) y″ + 5y′ + 4y = 6u′ + 18u (1P 2025 B y sin fecha).</p>',
    solution: { explain: `<p>a) s²Y + 6sY + 10Y = 5sU + 15U → Y(s² + 6s + 10) = U(5s + 15):</p>
      ${eq(`P(s) = ${frac('Y(s)', 'U(s)')} = ${frac('5s + 15', 's² + 6s + 10')} = ${frac('5(s + 3)', '(s + 3)² + 1')}`)}
      <p>Cero: s = −3. Polos: s = −3 ± i (complejos conjugados con parte real negativa: el sistema oscila y se estabiliza).</p>
      <p>b) Y(s² + 5s + 4) = U(6s + 18):</p>
      ${eq(`P(s) = ${frac('6s + 18', 's² + 5s + 4')} = ${frac('6(s + 3)', '(s + 1)(s + 4)')}`)}
      <p>Cero: s = −3. Polos: s = −1 y s = −4 (reales negativos: estable, sin oscilación).</p>` },
  });
  add('ft-respuesta', {
    exam: ['1p-2024-1#4a', '1p-2024-2#4a'], level: 3, title: 'Función de transferencia y respuesta a la rampa (1P 2024)',
    prompt: '<p>Con condiciones iniciales cero, hallar P(s) y la respuesta en el tiempo para u(t) = t si t ≥ 0 (u = 0 si t &lt; 0): a) y″ + y′ − 6y = 5u′ + 4u (tema 1); b) y″ − 2y′ − 3y = 3u′ − 4u (tema 2).</p>',
    hints: ['La entrada es la rampa: U(s) = 1/s². Y(s) = P(s)/s² tiene un polo doble en s = 0.'],
    solution: { explain: `<h4>a) Tema 1</h4>
      ${eq(`P(s) = ${frac('5s + 4', 's² + s − 6')} = ${frac('5s + 4', '(s + 3)(s − 2)')} &nbsp;&nbsp; Y(s) = ${frac('5s + 4', 's²(s + 3)(s − 2)')}`)}
      ${table(['Polo', 'Coeficiente'], [['0 (doble)', 'A₂ = 4/(3·(−2)) = −2/3; A₁ = d/ds[(5s + 4)/(s² + s − 6)]<sub>s=0</sub> = (5·(−6) − 4·1)/36 = −17/18'], ['−3', 'R₋₃ = (−15 + 4)/(9·(−5)) = 11/45'], ['2', 'R₂ = 14/(4·5) = 7/10']])}
      <p><b>y(t) = −(2/3)t − 17/18 + (11/45)e<sup>−3t</sup> + (7/10)e<sup>2t</sup></b>. Control: y(0) = (−85 + 22 + 63)/90 = 0 ✓ (condiciones iniciales cero).</p>
      <h4>b) Tema 2</h4>
      ${eq(`P(s) = ${frac('3s − 4', 's² − 2s − 3')} = ${frac('3s − 4', '(s − 3)(s + 1)')} &nbsp;&nbsp; Y(s) = ${frac('3s − 4', 's²(s − 3)(s + 1)')}`)}
      ${table(['Polo', 'Coeficiente'], [['0 (doble)', 'A₂ = −4/(−3) = 4/3; A₁ = d/ds[(3s − 4)/(s² − 2s − 3)]<sub>s=0</sub> = (3·(−3) − (−4)(−2))/9 = −17/9'], ['3', 'R₃ = 5/(9·4) = 5/36'], ['−1', 'R₋₁ = −7/(1·(−4)) = 7/4']])}
      <p><b>y(t) = (4/3)t − 17/9 + (5/36)e<sup>3t</sup> + (7/4)e<sup>−t</sup></b>. Control: y(0) = (−68 + 5 + 63)/36 = 0 ✓.</p>
      ${note('En los dos temas P(s) tiene un polo positivo (2 y 3): el término exponencial crece sin límite y el sistema es inestable. El polo doble de la rampa da la parte forzada A₁ + A₂t.', 'tip')}` },
  });
  add('ft-teoria', {
    exam: ['1p-2025-a#3b', '1p-2025-a#3c', '1p-2025-b#3b', '1p-2025-b#3c'], level: 1, title: 'Verdadero o falso sobre la función de transferencia (1P 2025)',
    prompt: '<p>a) La función de transferencia relaciona la transformada de Laplace de la entrada de un sistema con la transformada de Laplace de la salida. b) Se puede obtener la función de transferencia de un sistema a partir de las ecuaciones diferenciales de la entrada y la salida con tan solo una condición inicial distinta de cero.</p>',
    solution: { explain: '<p>a) <b>Verdadero</b>: por definición P(s) = Y(s)/U(s), el cociente entre la transformada de la salida y la de la entrada (con condiciones iniciales cero).</p><p>b) <b>Falso</b>: el concepto se aplica a ecuaciones lineales, invariantes en el tiempo y con <b>todas</b> las condiciones iniciales iguales a cero. Con una sola distinta de cero, Y(s) = P(s)U(s) + (términos de la condición inicial), y el cociente Y/U pasa a depender de la entrada: deja de ser una propiedad del sistema.</p>' },
  }, {
    exam: ['1p-sf#3b', '1p-2024-1#4b', '1p-2024-2#4b'], level: 2, title: 'Definición, condiciones, invariancia y de qué depende la respuesta',
    prompt: '<p>a) Defina función de transferencia y qué condiciones iniciales debe cumplir una ecuación diferencial para poder obtenerla. ¿Qué significan esas condiciones? (1P sin fecha). b) ¿Qué significa que las ecuaciones diferenciales sean invariantes en el tiempo? (1P 2024 T1). c) ¿De qué depende la respuesta en el tiempo y(t)? (1P 2024 T2).</p>',
    solution: { explain: `<p>a) La función de transferencia P(s) es la transformada de Laplace de la salida sobre la transformada de Laplace de la entrada: P(s) = Y(s)/U(s). Se aplica a ecuaciones diferenciales lineales, invariantes en el tiempo y con <b>condiciones iniciales cero</b> (y, sus derivadas, u y sus derivadas valen 0 en t = 0). Significan que el sistema está en reposo cuando se empieza a estudiarlo: así la salida se debe solo a la entrada y Y(s) = P(s)U(s).</p>
      <p>b) Que los coeficientes de la ecuación diferencial son <b>constantes</b>: el sistema se comporta igual sin importar cuándo se aplique la entrada (si u(t) produce y(t), u(t − τ) produce y(t − τ)). Es lo que permite transformar cada a<sub>k</sub>y⁽ᵏ⁾ en a<sub>k</sub>sᵏY(s), sacar factor común Y(s) y obtener P(s) como cociente de polinomios fijo.</p>
      <p>c) y(t) = ℒ⁻¹{P(s)U(s)} depende tanto de los <b>polos y ceros de la función de transferencia</b> como de los <b>polos y ceros de la entrada</b>. Los polos de U(s) dan la respuesta forzada (con la rampa, A₁ + A₂t) y los de P(s) la respuesta natural o transitoria (exponenciales y oscilaciones, que deciden la estabilidad); los ceros modifican los residuos.</p>` },
  });

  // ---------- Unidad 4: métodos aproximados ----------
  const fEa = (x) => 4 * x ** 3 - 9 * x * x + 4 * x - 7, fEs = (x, y) => 4 * x ** 3 - 9 * x * x + 4 * y - 5;
  const fPb = (x) => 4 * x ** 3 - 5 * x * x + 4 * x - 9, fP1 = (x, y) => y * x + y * (x * x - 1), fH2 = (x, y) => x ** 3 - 2 * y * x;
  // Detalle de cada paso con las pendientes intermedias que guarda num.ode
  const steps = (m, f, x0, y0, hh, xe) => {
    const r = N.ode(m, f, x0, y0, hh, xe), d = (v) => num(v, 6);
    const head = { E: ['x<sub>i</sub>', 'y<sub>i</sub>', 'f(x<sub>i</sub>, y<sub>i</sub>)', 'y<sub>i+1</sub>'], H: ['x<sub>i</sub>', 'y<sub>i</sub>', 'k₁ = f(x<sub>i</sub>, y<sub>i</sub>)', 'y⁰<sub>i+1</sub> (predictor)', 'k₂ = f(x<sub>i+1</sub>, y⁰<sub>i+1</sub>)', 'y<sub>i+1</sub>'], P: ['x<sub>i</sub>', 'y<sub>i</sub>', 'k₁ = f(x<sub>i</sub>, y<sub>i</sub>)', 'y<sub>i+1/2</sub>', 'f(x<sub>i+1/2</sub>, y<sub>i+1/2</sub>)', 'y<sub>i+1</sub>'] }[m];
    return table(head, r.slice(1).map((p, i) => {
      const q = r[i], k = p.k;
      return m === 'E' ? [num(q.x, 2), d(q.y), d(k.f), `<b>${d(p.y)}</b>`] : m === 'H' ? [num(q.x, 2), d(q.y), d(k.k1), d(k.p), d(k.k2), `<b>${d(p.y)}</b>`] : [num(q.x, 2), d(q.y), d(k.k1), d(k.ym), d(k.km), `<b>${d(p.y)}</b>`];
    }));
  };
  add('euler', {
    exam: ['1p-2025-a#4a', '1p-sf#4b'], level: 2, title: 'Euler en los parciales',
    prompt: '<p>Resolver con Euler desde x = 1 hasta x = 2 con h = 0,5: a) dy/dx = 4x³ − 9x² + 4x − 7, y(1) = 2 (1P 2025 A); b) dy/dx = 4x³ − 9x² + 4y − 5, y(1) = 2 (1P sin fecha).</p>',
    hints: ['a) f(1) = 4 − 9 + 4 − 7 = −8, entonces y(1,5) = 2 + (−8)(0,5) = −2.', 'b) Ojo: ahora f depende de y (4y), hay que usar el y de cada paso.'],
    solution: { explain: `<h4>a) 1P 2025 A</h4>${steps('E', fEa, 1, 2, 0.5, 2)}
      <p><b>y(2) ≈ −5,875</b>. Como f solo depende de x, se puede integrar: y = x⁴ − 3x³ + 2x² − 7x + 9, y(1,5) = −2,0625 y y(2) = −5. Error relativo verdadero en x = 2: |(−5 + 5,875)/(−5)| = 17,5 %.</p>
      <h4>b) 1P sin fecha</h4>${steps('E', fEs, 1, 2, 0.5, 2)}
      <p><b>y(2) ≈ −2,875</b>. Con un paso mucho más chico (columna Referencia, RK4) la solución da cerca de −36,6: el término 4y hace que la solución cambie muy rápido y con h = 0,5 Euler queda muy lejos. Es el ejemplo perfecto de por qué hay que achicar h o usar un método de mayor orden.</p>
      ${N.T.ode(['E', 'H', 'RK4'], fEs, 1, 2, 0.5, 2)}` },
  });
  add('heun-poligono', {
    exam: ['1p-2025-b#4a', '1p-2024-1#3a', '1p-2024-2#3a'], level: 3, title: 'Heun y polígono mejorado en los parciales',
    prompt: '<p>a) Polígono mejorado: dy/dx = 4x³ − 5x² + 4x − 9, de x = 1 a x = 2, y(1) = 5, h = 0,5 (1P 2025 B). b) Polígono mejorado: dy/dx = yx + y(x² − 1), x<sub>i</sub> = 1, x<sub>f</sub> = 1,9, h = 0,3, y(1) = 1 (1P 2024 T1). c) Heun: dy/dx = x³ − 2yx, x<sub>i</sub> = 1, x<sub>f</sub> = 2,8, h = 0,6, y(1) = 2 (1P 2024 T2).</p>',
    hints: ['Polígono: y<sub>i+1/2</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>)·h/2 y después y<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i+1/2</sub>, y<sub>i+1/2</sub>)·h.', 'Heun: predictor y⁰ = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>)h; corrector y<sub>i+1</sub> = y<sub>i</sub> + [f(x<sub>i</sub>, y<sub>i</sub>) + f(x<sub>i+1</sub>, y⁰)]h/2.'],
    solution: { explain: `<h4>a) 1P 2025 B (polígono mejorado)</h4>
      <p>Primer paso: k₁ = f(1) = 4 − 5 + 4 − 9 = −6; y<sub>1/2</sub> = 5 − 6·0,25 = 3,5 (no se usa porque f no depende de y); f(1,25) = 7,8125 − 7,8125 + 5 − 9 = −4; y(1,5) = 5 − 4·0,5 = 3.</p>
      ${steps('P', fPb, 1, 5, 0.5, 2)}
      <p><b>y(2) ≈ 5,0625</b>. Exacto: y = x⁴ − (5/3)x³ + 2x² − 9x + 38/3 da y(2) = 16/3 ≈ 5,3333 (error 5,1 %). No es exacto porque la solución es de grado 4 y el polígono es de orden 2.</p>
      <h4>b) 1P 2024 T1 (polígono mejorado)</h4>
      <p>Primer paso: k₁ = f(1; 1) = 1 + 0 = 1; y<sub>1/2</sub> = 1 + 1·0,15 = 1,15; f(1,15; 1,15) = 1,15·1,15 + 1,15·(1,3225 − 1) = 1,693375; y(1,3) = 1 + 1,693375·0,3 = 1,508013.</p>
      ${steps('P', fP1, 1, 1, 0.3, 1.9)}
      <p><b>y(1,9) ≈ 8,0777</b>. La ecuación es de variables separables: dy/y = (x² + x − 1)dx, y = e<sup>x³/3 + x²/2 − x + 1/6</sup>, y(1,9) ≈ 10,570. El error (23,6 %) se debe al paso grande frente a una solución que crece como exponencial de x³.</p>
      <h4>c) 1P 2024 T2 (Heun)</h4>
      <p>Primer paso: k₁ = f(1; 2) = 1 − 4 = −3; predictor y⁰ = 2 − 3·0,6 = 0,2; k₂ = f(1,6; 0,2) = 4,096 − 0,64 = 3,456; y(1,6) = 2 + (−3 + 3,456)/2·0,6 = 2,1368.</p>
      ${steps('H', fH2, 1, 2, 0.6, 2.8)}
      <p><b>y(2,8) ≈ 8,4456</b>, pero la referencia con paso chico da ≈ 3,422.</p>
      ${N.T.ode(['H', 'P', 'RK4'], fH2, 1, 2, 0.6, 2.8)}
      ${note('Con h = 0,6 el predictor de Heun se va muy lejos (el término −2yx es grande) y el corrector no alcanza a compensarlo. Conclusión para la parte teórica: el orden del método no sirve de nada si h es demasiado grande para la rapidez con que cambia la solución.', 'warn')}` },
  }, {
    exam: ['1p-2025-a#4b', '1p-2025-b#4b', '1p-sf#4a'], level: 1, title: 'La pendiente en Euler y sus mejoras',
    prompt: '<p>En el método de Euler, ¿cómo se considera la pendiente en todo el intervalo? ¿Qué modificaciones y mejoras conoce del método de Euler y por qué se las realiza?</p>',
    solution: { explain: '<p>En Euler la pendiente se calcula en el <b>punto inicial</b> del intervalo, f(x<sub>i</sub>, y<sub>i</sub>), y se supone <b>constante en todo el intervalo</b>: se avanza por la recta tangente, y<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>)h. Como la solución es curva, se comete un error de truncamiento local O(h²) (Euler es la serie de Taylor cortada después del término de la primera derivada).</p><p><b>Mejoras</b>: 1) <b>Heun</b> (Euler mejorado): calcula dos pendientes, al inicio y al final del intervalo (la del final con el y predicho por Euler), y las promedia: esquema predictor-corrector. 2) <b>Polígono mejorado</b> (Euler modificado): predice con Euler el valor en el punto medio del intervalo y usa la pendiente de ese punto medio para todo el paso.</p><p><b>Por qué</b>: el error fundamental de Euler es usar solo la derivada al principio del intervalo. Las dos modificaciones estiman mejor la pendiente promedio del intervalo y bajan el error local a O(h³) (global O(h²)), con lo que para el mismo h la aproximación es mucho mejor.</p>' },
  });
  add('edo-errores', {
    exam: ['1p-2024-1#3b', '1p-2024-2#3b'], level: 2, title: 'Pendiente, orden del error, elección de h y qué ecuaciones resuelven',
    prompt: '<p>a) En Euler y Heun, ¿cómo se calcula la pendiente? ¿Cuál es el orden del error en ambos? Para disminuir el error, ¿conviene un paso h muy pequeño o muy grande? (1P 2024 T1). b) En Heun y polígono mejorado, ¿cómo se calcula la pendiente? ¿Orden del error? ¿Qué tipo de ecuaciones se resuelven con los métodos aproximados vistos? (1P 2024 T2).</p>',
    solution: { explain: `<p><b>Pendientes</b>: Euler usa f(x<sub>i</sub>, y<sub>i</sub>), la del inicio, constante en el intervalo. Heun promedia la del inicio y la del final: [f(x<sub>i</sub>, y<sub>i</sub>) + f(x<sub>i+1</sub>, y⁰<sub>i+1</sub>)]/2, con y⁰<sub>i+1</sub> = y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>)h (predictor-corrector). El polígono mejorado usa la del punto medio: f(x<sub>i</sub> + h/2, y<sub>i</sub> + f(x<sub>i</sub>, y<sub>i</sub>)h/2).</p>
      <p><b>Orden del error</b>: Euler, error de truncamiento local O(h²) y global O(h). Heun y polígono, local O(h³) y global O(h²): por eso son mejores.</p>
      <p><b>¿h pequeño o grande?</b> Pequeño, porque el error de truncamiento es proporcional a una potencia de h (al dividir h por 2 el error global de Euler se divide por 2 y el de Heun por 4). Pero no excesivamente pequeño: aumentan los pasos, el tiempo de cálculo y el error de redondeo acumulado; el error total tiene un mínimo (Burden 5.2: E(h) = hM/2 + δ/h).</p>
      <p><b>Qué ecuaciones resuelven</b>: ecuaciones diferenciales ordinarias de primer orden con valor inicial, dy/dx = f(x, y), y(x₀) = y₀, sean lineales o no lineales (a diferencia de Laplace). Dan una tabla de valores aproximados de y, no una fórmula.</p>` },
  });

  // ---------- Unidad 5: raíces ----------
  const fA = (x) => 3 * x ** 3 + 2 * x - 4, fB = (x) => 2 * x ** 3 + 4 * x - 3, fC = (x) => 5 * x ** 3 - 3 * x * x - x - 6;
  add('cerrados-teoria', {
    exam: ['2p-a#1a', '2p-b#1a'], level: 1, title: 'Particularidad de los métodos cerrados y cuál es mejor',
    prompt: '<p>¿Los métodos cerrados qué particularidad tienen? ¿Qué métodos cerrados conoce? Explique. ¿Para usted cuál de los métodos cerrados es el mejor y por qué?</p>',
    solution: { explain: '<p><b>Particularidad</b>: aprovechan que la función cambia de signo en la vecindad de una raíz. Necesitan un intervalo [x<sub>i</sub>, x<sub>f</sub>] con f(x<sub>i</sub>)·f(x<sub>f</sub>) &lt; 0, que encierra la raíz (teorema de Bolzano); en cada iteración el intervalo se reduce y la raíz sigue encerrada. Por eso <b>siempre convergen</b>, aunque más lentamente que los abiertos.</p><p><b>Bisección</b>: x<sub>r</sub> = (x<sub>i</sub> + x<sub>f</sub>)/2; se evalúa f(x<sub>i</sub>)·f(x<sub>r</sub>): si es negativo la raíz está en [x<sub>i</sub>, x<sub>r</sub>] (x<sub>f</sub> = x<sub>r</sub>), si es positivo en [x<sub>r</sub>, x<sub>f</sub>] (x<sub>i</sub> = x<sub>r</sub>). Se repite hasta ε<sub>a</sub> = |(x<sub>r</sub><sup>nuevo</sup> − x<sub>r</sub><sup>anterior</sup>)/x<sub>r</sub><sup>nuevo</sup>|·100 &lt; ε<sub>s</sub>.</p><p><b>Regla falsa</b>: une (x<sub>i</sub>, f(x<sub>i</sub>)) y (x<sub>f</sub>, f(x<sub>f</sub>)) con una recta y toma su corte con el eje x: x<sub>r</sub> = x<sub>f</sub> − f(x<sub>f</sub>)(x<sub>i</sub> − x<sub>f</sub>)/(f(x<sub>i</sub>) − f(x<sub>f</sub>)) (se deduce por triángulos semejantes). El reemplazo del extremo es igual que en bisección.</p><p><b>El mejor</b>: en general la <b>regla falsa</b>, porque tiene en cuenta la magnitud de f(x<sub>i</sub>) y f(x<sub>f</sub>), no solo su signo, y converge en menos iteraciones. Excepción: funciones muy curvas donde un extremo queda fijo (convergencia unilateral, ej. x¹⁰ − 1); ahí la bisección es preferible, además de permitir calcular de antemano el número de iteraciones (n = log₂(Δx₀/E)). Desarrollo y ejemplo en la teoría de esta lección.</p>' },
  });
  add('newton-raphson', {
    exam: ['2p-a#1b', '2p-b#1b'], level: 2, title: 'Raíz positiva más pequeña con un método abierto (2P temas A y B)',
    prompt: '<p>Encontrar la raíz positiva más pequeña con un error del 1 % por cualquier método abierto: a) 3x³ + 2x − 4 = 0 (tema A); b) 2x³ + 4x − 3 = 0 (tema B).</p>',
    hints: ['Tabulá f en 0; 0,5; 1… para ubicar la raíz.', 'f′(x) = 9x² + 2 (A) o 6x² + 4 (B) es siempre positiva: f es creciente y tiene una sola raíz real.'],
    solution: { explain: `<p><b>Ubicación</b>. a) f(0) = −4, f(0,5) = −2,625, f(1) = 1: la raíz está en (0,5; 1). b) f(0) = −3, f(0,5) = −0,75, f(1) = 3: raíz en (0,5; 1). En los dos casos f′ &gt; 0 para todo x, así que f es estrictamente creciente y esa es la <b>única</b> raíz real: es la positiva más pequeña.</p>
      <p><b>Newton Raphson</b> con x₀ = 1: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)/f′(x<sub>i</sub>).</p>
      <h4>a) 3x³ + 2x − 4, f′ = 9x² + 2</h4>${N.T.newton(fA, (x) => 9 * x * x + 2, 1, { tol: 1 })}
      <p><b>x ≈ 0,9014</b> con ε<sub>a</sub> = 0,85 % &lt; 1 %. Primera iteración: x₁ = 1 − 1/11 = 0,909091.</p>
      <h4>b) 2x³ + 4x − 3, f′ = 6x² + 4</h4>${N.T.newton(fB, (x) => 6 * x * x + 4, 1, { tol: 1 })}
      <p><b>x ≈ 0,6269</b> con ε<sub>a</sub> = 0,50 %. Primera iteración: x₁ = 1 − 3/10 = 0,7.</p>
      <p>Con la secante (x₋₁ = 0, x₀ = 1) en a):</p>${N.T.secant(fA, 0, 1, { tol: 1 })}
      ${note('Cualquier método abierto vale, pero hay que justificar la elección: Newton converge cuadráticamente y la derivada de un polinomio es inmediata. Si se usa punto fijo, hay que mostrar que |g′| &lt; 1 cerca de la raíz.', 'tip')}` },
  });
  add('regla-falsa', {
    exam: ['2p-2025#1a'], level: 2, title: 'Raíz positiva con un método cerrado (2P 2025)',
    prompt: '<p>Calcular por cualquier método cerrado una raíz positiva de f(x) = 5x³ − 3x² − x − 6 con el 1 % o menos de error. Calcular al menos 3 aproximaciones.</p>',
    hints: ['f(1) = −5 y f(2) = 20: hay cambio de signo en [1; 2].'],
    solution: { explain: `<p><b>Intervalo</b>: f(1) = −5 &lt; 0 y f(2) = 20 &gt; 0, f continua: hay una raíz en [1; 2]. (f′ = 15x² − 6x − 1 se anula en x ≈ −0,13 y x ≈ 0,53, y f en esos puntos es negativa, así que es la única raíz real.)</p>
      <h4>Regla falsa</h4>${N.T.closed('rf', fC, 1, 2, { tol: 1 })}
      <p>Primera iteración: x<sub>r</sub> = 2 − 20·(1 − 2)/(−5 − 20) = 2 − 0,8 = 1,2; f(1,2) = −2,88 &lt; 0 → x<sub>i</sub> = 1,2. <b>x ≈ 1,3723</b> en 5 iteraciones (ε<sub>a</sub> = 0,56 %).</p>
      <h4>Bisección (para comparar)</h4>${N.T.closed('bis', fC, 1, 2, { tol: 1 })}
      <p><b>x ≈ 1,3828</b> en 7 iteraciones. La raíz verdadera es 1,37755: los dos cumplen ε<sub>a</sub> &lt; 1 % y la regla falsa lo logra con dos iteraciones menos, como se espera al usar el valor de f.</p>` },
  });
  add('abiertos-convergencia', {
    exam: ['2p-2025#1b'], level: 2, title: 'Particularidad de los métodos abiertos y cuál es mejor (2P 2025)',
    prompt: '<p>a) ¿Los métodos abiertos qué particularidad tienen? b) ¿Qué métodos abiertos conoce? Explíquelos completa y detalladamente. c) ¿Cuál es el mejor método abierto y por qué?</p>',
    solution: { explain: '<p>a) Necesitan uno (punto fijo, Newton Raphson) o dos (secante) valores iniciales que <b>no tienen que encerrar la raíz</b>. No garantizan la convergencia (pueden diverger), pero cuando convergen son mucho más rápidos que los cerrados.</p><p>b) <b>Punto fijo</b>: se reescribe f(x) = 0 como x = g(x) y se itera x<sub>i+1</sub> = g(x<sub>i</sub>); converge si |g′(x)| &lt; 1 cerca de la raíz (E<sub>i+1</sub> = g′(ξ)E<sub>i</sub>, convergencia lineal); gráficamente es la intersección de y = x con y = g(x). <b>Newton Raphson</b>: en (x<sub>i</sub>, f(x<sub>i</sub>)) se traza la tangente y su corte con el eje x es la nueva aproximación: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)/f′(x<sub>i</sub>) (sale de la geometría o de Taylor de primer orden); converge cuadráticamente, pero necesita la derivada y falla si f′ ≈ 0, cerca de puntos de inflexión o con raíces múltiples. <b>Secante</b>: reemplaza la derivada por la pendiente entre los dos últimos puntos: x<sub>i+1</sub> = x<sub>i</sub> − f(x<sub>i</sub>)(x<sub>i−1</sub> − x<sub>i</sub>)/(f(x<sub>i−1</sub>) − f(x<sub>i</sub>)); descarta siempre el punto más viejo, sin mirar signos (a diferencia de la regla falsa); convergencia superlineal (≈ 1,62).</p><p>c) <b>Newton Raphson</b>, por su convergencia cuadrática (las cifras correctas se duplican en cada iteración), cuando la derivada es fácil de obtener y x₀ está razonablemente cerca. Si la derivada es difícil o costosa, la secante, que es casi tan rápida. En el 2P tema A, Newton llega al 1 % en 2 iteraciones; la secante (con 0 y 1) en 4.</p>' },
  });

  // ---------- Unidad 6: interpolación y regresión ----------
  const pick = (xs, ys, sel) => [sel, sel.map((x) => ys[xs.indexOf(x)])];
  // Lagrange con cada peso L_i(x) escrito con los números del ejercicio
  const lag = (xs, ys, sel, x) => {
    const [px, py] = pick(xs, ys, sel), v = N.newtonPoly(px, py)(x);
    const rows = px.map((xi, i) => {
      const L = N.lagrangeL(px, i, x);
      const f = px.filter((_, j) => j !== i).map((xj) => `(${num(x)} − ${num(xj)})/(${num(xi)} − ${num(xj)})`).join(' · ');
      return [num(xi), num(py[i]), f, num(L, 5), num(L * py[i], 5)];
    });
    return `<p><b>Grado ${px.length - 1}</b> con x = ${px.map((t) => num(t)).join(', ')}: f<sub>${px.length - 1}</sub>(${num(x)}) = <b>${num(v, 4)}</b></p>${table(['x<sub>i</sub>', 'f(x<sub>i</sub>)', 'L<sub>i</sub>(x)', 'L<sub>i</sub>', 'L<sub>i</sub>·f(x<sub>i</sub>)'], rows)}`;
  };
  const DA = [[0, 2, 3, 4, 5, 6, 10], [0, 7, 9, 11, 13, 15, 23]], DB = [[0, 2, 3, 4, 5, 7, 10], [2, 5, 8, 11, 12, 14, 23]], DC = [[1, 3, 5, 6, 9, 10, 11, 13], [5, 7, 10, 13, 16, 19, 23, 25]];
  add('interp-lagrange', {
    exam: ['2p-a#2b', '2p-b#2b', '2p-2025#4a'], level: 2, title: 'Lagrange de primer y segundo orden en los parciales',
    prompt: `<p>Aplicando los polinomios de Lagrange de 1° y 2° orden, hallar:</p>
      ${table(['', 'x', 'f(x)', 'Pedido'], [
        ['a) 2P tema A', '0, 2, 3, 4, 5, 6, 10', '0, 7, 9, 11, 13, 15, 23', 'f(2,5) y f(10,5)'],
        ['b) 2P tema B', '0, 2, 3, 4, 5, 7, 10', '2, 5, 8, 11, 12, 14, 23', 'f(2,5) y f(10,5)'],
        ['c) 2P 2025 A', '1, 3, 5, 6, 9, 10, 11, 13', '5, 7, 10, 13, 16, 19, 23, 25', 'f(7) y f(15)'],
      ])}`,
    hints: ['Elegí los puntos más cercanos al valor buscado; para la recta, los dos que lo rodean.', 'f(10,5) y f(15) caen fuera de la tabla: es extrapolación. Usá los puntos del extremo y decilo en la respuesta.'],
    solution: { explain: `<p>L<sub>i</sub>(x) = Π<sub>j≠i</sub> (x − x<sub>j</sub>)/(x<sub>i</sub> − x<sub>j</sub>) y f<sub>n</sub>(x) = Σ L<sub>i</sub>(x) f(x<sub>i</sub>). Los pesos L<sub>i</sub> suman 1 (control rápido).</p>
      <h4>a) Tema A</h4>${lag(...DA, [2, 3], 2.5)}${lag(...DA, [2, 3, 4], 2.5)}${lag(...DA, [6, 10], 10.5)}${lag(...DA, [5, 6, 10], 10.5)}
      <p>Los datos de x = 2 a 10 están sobre la recta y = 2x + 3, por eso la parábola coincide con la recta: f(2,5) = 8 y f(10,5) = 24 en los dos órdenes.</p>
      <h4>b) Tema B</h4>${lag(...DB, [2, 3], 2.5)}${lag(...DB, [2, 3, 4], 2.5)}${lag(...DB, [7, 10], 10.5)}${lag(...DB, [5, 7, 10], 10.5)}
      <p>f(2,5) = 6,5 con los dos (2, 3 y 4 están alineados). f(10,5): 24,5 con la recta y 25,2 con la parábola.</p>
      <h4>c) 2P 2025 A</h4>${lag(...DC, [6, 9], 7)}${lag(...DC, [5, 6, 9], 7)}${lag(...DC, [11, 13], 15)}${lag(...DC, [10, 11, 13], 15)}
      <p>f(7): 14 con la recta y 15 con la parábola por 5, 6 y 9 (con 6, 9 y 10 da 13: otra elección de puntos, otro polinomio). f(15): 27 con la recta y 19 con la parábola.</p>
      ${note('f(10,5) (temas A y B) y f(15) (2025) son <b>extrapolaciones</b>: el valor buscado está fuera del rango de la tabla. La gran diferencia entre la recta y la parábola en f(15) muestra que el resultado no es confiable (Chapra 18.5). Conviene escribirlo en el examen.', 'warn')}` },
  });
  add('interp-teoria', {
    exam: ['2p-a#2a', '2p-b#2a', '2p-2025#4b'], level: 1, title: 'Interpolación: cuándo, para qué, unicidad, Newton y Lagrange',
    prompt: '<p>¿Cuándo se utilizan los métodos de interpolación? ¿Para qué se los usa? ¿Hay más de un polinomio de interpolación? Explique el método de diferencias divididas de Newton (temas A y B) o el procedimiento de Lagrange (2025).</p>',
    solution: { explain: `<p><b>Cuándo</b>: cuando los datos son precisos (tablas, mediciones confiables) y se necesitan valores intermedios entre puntos conocidos; la curva debe pasar exactamente por cada dato. <b>Para qué</b>: estimar valores intermedios, reemplazar una función complicada por un polinomio sencillo, y como base de otros métodos (integración numérica, deducción de Heun).</p>
      <p><b>¿Más de un polinomio?</b> Para n + 1 puntos con x distintas existe <b>uno y sólo un</b> polinomio de grado ≤ n que pasa por todos (si hubiera dos, su diferencia sería un polinomio de grado ≤ n con n + 1 raíces, es decir, cero). Newton y Lagrange son dos formas distintas de escribir el mismo polinomio. Sí se obtienen polinomios distintos si se eligen otros puntos de la tabla u otro grado.</p>
      <p><b>Diferencias divididas de Newton</b>: f<sub>n</sub>(x) = b₀ + b₁(x − x₀) + b₂(x − x₀)(x − x₁) + … con b₀ = f(x₀), b₁ = f[x₁, x₀] = (f(x₁) − f(x₀))/(x₁ − x₀), b₂ = f[x₂, x₁, x₀] = (f[x₂, x₁] − f[x₁, x₀])/(x₂ − x₀). Se arma la tabla de diferencias divididas y se toma la diagonal superior. La lineal es la recta por dos puntos; la cuadrática le agrega un término de curvatura. Agregar un punto agrega un término sin rehacer lo anterior, y ese término estima el error.</p>
      <p><b>Lagrange</b>: f<sub>n</sub>(x) = Σ L<sub>i</sub>(x)f(x<sub>i</sub>), con L<sub>i</sub>(x) = Π<sub>j≠i</sub>(x − x<sub>j</sub>)/(x<sub>i</sub> − x<sub>j</sub>). Cada L<sub>i</sub> vale 1 en x<sub>i</sub> y 0 en los demás nodos, así que el polinomio pasa por todos los puntos. Procedimiento: 1) elegir los n + 1 puntos más cercanos al valor buscado; 2) calcular cada L<sub>i</sub>(x) en ese valor; 3) multiplicar por f(x<sub>i</sub>) y sumar. Lineal: f₁(x) = f(x₀)(x − x₁)/(x₀ − x₁) + f(x₁)(x − x₀)/(x₁ − x₀).</p>` },
  });
  const reg = ([k, xs, ys]) => {
    const r = N.regression(xs, ys), S = (f) => xs.reduce((a, x, i) => a + f(x, ys[i]), 0);
    return `<h4>${k}</h4>${table(['n', 'Σx', 'Σy', 'Σxy', 'Σx²', 'x̄', 'ȳ'], [[xs.length, num(S((x) => x)), num(S((x, y) => y)), num(S((x, y) => x * y)), num(S((x) => x * x)), num(S((x) => x) / xs.length, 4), num(S((x, y) => y) / xs.length, 4)]])}
      <p>a₁ = (nΣxy − ΣxΣy)/(nΣx² − (Σx)²) = <b>${num(r.a[1], 5)}</b>; a₀ = ȳ − a₁x̄ = <b>${num(r.a[0], 5)}</b>. Recta: <b>y = ${num(r.a[0], 4)} + ${num(r.a[1], 4)}x</b>.</p>
      ${table(['', 'Suma de cuadrados', 'Desviación'], [['Antes de la regresión (alrededor de ȳ)', `S<sub>t</sub> = ${num(r.St, 4)}`, `s<sub>y</sub> = ${num(r.sy, 4)}`], ['Después de la regresión (alrededor de la recta)', `S<sub>r</sub> = ${num(r.Sr, 4)}`, `s<sub>y/x</sub> = ${num(r.syx, 4)}`]])}
      <p>r² = (S<sub>t</sub> − S<sub>r</sub>)/S<sub>t</sub> = <b>${num(r.r2, 4)}</b>: la recta explica el ${num(r.r2 * 100, 1)} % de la variabilidad.</p>`;
  };
  add('regresion-lineal', {
    exam: ['2p-a#3b', '2p-b#3b', '2p-2025#3a'], level: 2, title: 'Recta de mínimos cuadrados y error antes y después (parciales)',
    prompt: `<p>Ajustar una recta por mínimos cuadrados y calcular el error que se comete antes y después de la regresión. En el 2P 2025 además: evaluar la eficiencia del método.</p>
      ${table(['', 'x', 'y'], [['a) Tema A', '1, 2, 3, 4, 5, 6, 7', '7, 10, 13, 16, 19, 22, 25'], ['b) Tema B', '1, 2, 3, 4, 5, 6, 7', '7, 10, 12, 14, 17, 21, 24'], ['c) 2P 2025 A', '3, 4, 5, 6, 7, 8, 9', '6, 9, 12, 15, 18, 21, 24']])}`,
    solution: { explain: `${reg(['a) Tema A', [1, 2, 3, 4, 5, 6, 7], [7, 10, 13, 16, 19, 22, 25]])}
      <p>Los datos están <b>exactamente</b> sobre y = 4 + 3x: S<sub>r</sub> = 0 y r² = 1. El error después de la regresión es nulo.</p>
      ${reg(['b) Tema B', [1, 2, 3, 4, 5, 6, 7], [7, 10, 12, 14, 17, 21, 24]])}
      <p>s<sub>y/x</sub> = 0,74 &lt; s<sub>y</sub> = 6,06: el modelo lineal es adecuado; el error pasa de S<sub>t</sub> = 220 a S<sub>r</sub> = 2,71.</p>
      ${reg(['c) 2P 2025 A', [3, 4, 5, 6, 7, 8, 9], [6, 9, 12, 15, 18, 21, 24]])}
      <p>Otra vez datos perfectamente lineales: y = −3 + 3x, S<sub>r</sub> = 0. <b>Eficiencia</b>: r² = 1, el modelo explica el 100 % de la variabilidad (el error baja de S<sub>t</sub> = 252, s<sub>y</sub> = 6,48 a cero). Hay que decirlo con cuidado: con datos experimentales reales nunca se obtiene r² = 1; aquí los datos fueron construidos sobre una recta.</p>` },
  });
  add('regresion-teoria', {
    exam: ['2p-a#3a', '2p-b#3a', '2p-2025#3b'], level: 1, title: 'Ajuste de curvas: cuándo, por qué mínimos cuadrados y error del modelo',
    prompt: '<p>a) ¿Cuándo se utilizan los métodos de ajuste de curvas? ¿Por qué se utiliza la regresión con mínimos cuadrados y no otro método? ¿Qué significa ajustar por una línea recta? (temas A y B). b) V o F: los datos en regresión lineal no son confiables. ¿Qué significa el error de los datos y el error del modelo? ¿Cómo se sabe cuándo el modelo es adecuado y cuán adecuado es? Si no es adecuado, ¿qué se debe hacer? (2P 2025).</p>',
    solution: { explain: '<p><b>Cuándo</b>: cuando los datos tienen error o ruido significativo (mediciones) y se busca una función que muestre la tendencia general, sin pasar necesariamente por cada punto. También para predecir y para probar hipótesis (comparar un modelo con datos). <b>V o F</b>: <b>Verdadero</b> en ese sentido: la regresión supone datos con error; si fueran exactos se interpolaría.</p><p><b>Por qué mínimos cuadrados</b>: minimizar la suma de los residuos no sirve (los positivos y negativos se cancelan); minimizar la suma de sus valores absolutos no da una recta única; el criterio minimax le da demasiado peso a un punto con mucho error. Minimizar S<sub>r</sub> = Σe<sub>i</sub>² evita los tres problemas, da una recta única y se resuelve con dos ecuaciones lineales (ecuaciones normales).</p><p><b>Ajustar por una recta</b>: encontrar a₀ y a₁ de y = a₀ + a₁x + e que hacen mínima la suma de los cuadrados de los residuos; a₁ = (nΣxy − ΣxΣy)/(nΣx² − (Σx)²), a₀ = ȳ − a₁x̄.</p><p><b>Error de los datos</b>: la dispersión de los datos alrededor de su media, S<sub>t</sub> = Σ(y<sub>i</sub> − ȳ)² o s<sub>y</sub> = √(S<sub>t</sub>/(n − 1)) (antes de la regresión). <b>Error del modelo</b>: la dispersión alrededor de la recta, S<sub>r</sub> o s<sub>y/x</sub> = √(S<sub>r</sub>/(n − 2)) (después). <b>Adecuado</b> si s<sub>y/x</sub> &lt; s<sub>y</sub>; <b>cuánto</b> lo dice r² = (S<sub>t</sub> − S<sub>r</sub>)/S<sub>t</sub>, el porcentaje de variabilidad explicada, y conviene graficar los residuos. <b>Si no es adecuado</b>: graficar los datos y probar otro modelo: linealizar (exponencial con ln y, potencia con log-log) o regresión polinomial (cuadrática).</p>' },
  });

  // ---------- Unidad 7: Fourier ----------
  const step = (k) => (x) => (x < 0 ? 0 : k), F3 = N.fourier(step(3), -PI, PI, 9, [0]);
  const per = (f) => (x) => f(((((x + PI) % (2 * PI)) + 2 * PI) % (2 * PI)) - PI);
  add('fourier-serie', {
    exam: ['2p-a#4a', '2p-b#4a', '2p-2025#2a'], level: 2, title: 'Serie de Fourier de la función escalón de los parciales',
    prompt: '<p>Encontrar los coeficientes de Fourier y escribir la serie (o sus primeros términos) de f(x) = 0 si −π &lt; x &lt; 0, f(x) = k si 0 &lt; x &lt; π, con k = 3 (tema A y 2P 2025 A) o k = 5 (tema B). Sugerencia del 2025: graficar y analizar la paridad antes de calcular.</p>',
    hints: ['Período 2π: L = π.', 'f − k/2 vale −k/2 y +k/2: es impar.'],
    solution: { explain: `<p><b>Paridad</b>: f no es par ni impar, pero f(x) − k/2 es impar. Entonces se espera a₀/2 = k/2, aₙ = 0 y solo senos.</p>
      ${eq(`a₀ = ${frac('1', 'π')} ∫<sub>0</sub><sup>π</sup> k dx = k &nbsp;⟹&nbsp; ${frac('a₀', '2')} = ${frac('k', '2')}`)}
      ${eq(`aₙ = ${frac('1', 'π')} ∫<sub>0</sub><sup>π</sup> k cos nx dx = ${frac('k', 'nπ')} sen nx |<sub>0</sub><sup>π</sup> = 0`)}
      ${eq(`bₙ = ${frac('1', 'π')} ∫<sub>0</sub><sup>π</sup> k sen nx dx = ${frac('k', 'nπ')} [−cos nx]<sub>0</sub><sup>π</sup> = ${frac('k(1 − (−1)ⁿ)', 'nπ')} = { ${frac('2k', 'nπ')} si n impar; 0 si n par }`)}
      ${eq(`k = 3: &nbsp; f(x) = ${frac('3', '2')} + ${frac('6', 'π')} (sen x + ${frac('sen 3x', '3')} + ${frac('sen 5x', '5')} + …) &nbsp;&nbsp;&nbsp; k = 5: &nbsp; f(x) = ${frac('5', '2')} + ${frac('10', 'π')} (sen x + ${frac('sen 3x', '3')} + ${frac('sen 5x', '5')} + …)`)}
      ${chart({ x: [-PI, 3 * PI], y: [-0.8, 3.8], w: 460, h: 230, ticks: { x: [-3, 3, 6, 9], y: [1.5, 3] }, curves: [{ f: per(step(3)), cls: 'c-tan', dash: true, n: 400 }, { f: (x) => F3.sum(x, 9), cls: 'c-root', label: 'S₉', n: 400 }] }, 'k = 3: suma con los armónicos hasta n = 9 sobre la función (punteada). En x = 0 y x = π la serie da 3/2, el promedio del salto.')}
      <p>Cumple Dirichlet (dos tramos constantes, saltos finitos), así que la serie converge a f donde es continua y a 3/2 (o 5/2) en los saltos.</p>` },
  });
  add('fourier-ingenieria', {
    exam: ['2p-a#4b', '2p-b#4b', '2p-2025#2b'], level: 1, title: 'Para qué sirve la serie de Fourier y cuándo converge',
    prompt: '<p>¿Para qué se utiliza en ingeniería la serie de Fourier? ¿Qué condiciones debe cumplir una función para poder decir que la serie de Fourier converge a dicha función?</p>',
    solution: { explain: '<p><b>Para qué</b>: permite expresar una función periódica (señales sinusoidales, cuadradas, triangulares) como una suma de senos y cosenos de frecuencias armónicas, múltiplos de la fundamental. Se usa en el procesamiento digital de señales y telecomunicaciones (separar una señal en sus componentes de frecuencia, filtrar, modular en una portadora), en la generación de ondas de tensión o corriente por superposición de senoides, en el análisis armónico de una señal, el reforzamiento de señales, acústica, vibraciones, imágenes y compresión de datos.</p><p><b>Convergencia: condiciones de Dirichlet</b>. 1) f(x) está definida y tiene un único valor en (−L, L), salvo en un número finito de puntos. 2) f(x) es periódica de período 2L. 3) f(x) y f′(x) son continuas por intervalos en (−L, L) (un número finito de discontinuidades finitas). Si se cumplen, la serie converge a f(x) en los puntos de continuidad y al promedio [f(x⁺) + f(x⁻)]/2 en los saltos.</p>' },
  });
})();
