/* Unidad 7: Series de Fourier. Apuntes "Series de Fourier" y "Serie de Fourier 2023". TP 9.
   Coeficientes del TP derivados simbólicamente y verificados numéricamente con num.js. */
(() => {
  const { LESSONS, h, num: N } = window.GUIDE;
  const { note, def, table, eq, frac, lab, chart } = h;
  const PI = Math.PI;
  const half = (x) => (x < 0 ? 0 : x);
  const per = (f, c, P) => (x) => f(c + ((((x - c) % P) + P) % P));
  const Fh = N.fourier(half, -PI, PI, 9, [0]);

  LESSONS.push(
    {
      id: 'fourier-periodicas',
      module: 'u7',
      title: 'Funciones periódicas y condiciones de Dirichlet',
      keywords: 'función periódica período continua por intervalos condiciones de dirichlet convergencia puntual salto promedio aplicaciones señales',
      tldr: 'Una función es <mark>periódica</mark> de período P si f(x + P) = f(x) para todo x. La serie de Fourier la escribe como suma de senos y cosenos de frecuencias múltiplas. Si se cumplen las <strong>condiciones de Dirichlet</strong>, la serie converge a f, y en los saltos al promedio de los límites laterales.',
      goals: ['Definir función periódica y continua por intervalos.', 'Enunciar las condiciones de Dirichlet y el teorema de convergencia.', 'Nombrar aplicaciones.'],
      body: `
        <p>En ingeniería se trabaja con señales senoidales, cuadradas y triangulares. La serie de Fourier expresa una función periódica como una <strong>suma infinita de senoides cuyas frecuencias están armónicamente relacionadas</strong>. Se usa en procesamiento de señales, análisis armónico, vibraciones, acústica, óptica, imágenes, compresión de datos y telecomunicaciones.</p>
        ${def('Función periódica', 'Se dice que una función f(x) es periódica, con un período P, si para todo x, f(x + P) = f(x), donde P es una constante positiva.', 'Apunte de la cátedra, Series de Fourier.')}
        <p>sen x tiene períodos 2π, 4π, 6π…; su período fundamental (el menor) es 2π. tg x tiene período π. t, t², e<sup>t</sup> y ln t no son periódicas.</p>
        ${def('Función continua por intervalos', 'Se dice que una función f(x) es continua por intervalos en un trayecto si tiene un número finito de discontinuidades finitas.', 'Apunte de la cátedra.')}
        ${chart({ x: [-7, 7], y: [-1.6, 1.6], w: 460, h: 200, xl: 'x', ticks: { x: [-6, -3, 3, 6], y: [-1, 1] }, curves: [-3, -1, 1].map((k) => ({ pts: [[k * PI, -1], [(k + 1) * PI, -1]], cls: 'c-f' })).concat([-2, 0, 2].map((k) => ({ pts: [[k * PI, 1], [(k + 1) * PI, 1]], cls: 'c-f' }))), points: [-2, -1, 0, 1, 2].map((k) => ({ x: k * PI, y: 0, cls: 'c-root', r: 4 })) }, 'Onda cuadrada de período 2π: continua por intervalos. En cada salto la serie converge al punto medio (naranja).')}
        <h2>Condiciones de Dirichlet</h2>
        <ol>
          <li>f(x) está definida y tiene un valor único, salvo en un número finito de puntos de (−L, L).</li>
          <li>f(x) es periódica con período 2L.</li>
          <li>f(x) y f′(x) son continuas por intervalos en (−L, L).</li>
        </ol>
        <p>Entonces la serie de Fourier converge a f(x) en los puntos de continuidad, y en los puntos de discontinuidad converge a</p>
        ${eq(`${frac('f(x⁺) + f(x⁻)', '2')}`, 'Teorema de convergencia puntual')}
        ${note('Las condiciones de Dirichlet son <strong>suficientes pero no necesarias</strong>: si se cumplen, la convergencia está garantizada; si no, la serie puede converger o no. En los casos de ingeniería normalmente se cumplen.', 'exam')}`,
      quiz: [
        { q: 'f es periódica de período P si…', o: ['f(x + P) = f(x) para todo x', 'f(P) = 0', 'f(x) = f(−x)', 'f(x + P) = −f(x)'], a: 0, e: 'Definición.' },
        { q: '¿Cuál NO es periódica?', o: ['sen x', 'tg x', 'e^x', 'cos 3x'], a: 2, e: 't, t², eᵗ y ln t no son periódicas.' },
        { q: 'En un salto, la serie de Fourier converge a…', o: ['el valor de la izquierda', 'el de la derecha', 'el promedio de los límites laterales', 'cero'], a: 2, e: '(f(x⁺) + f(x⁻))/2.' },
        { q: 'Las condiciones de Dirichlet son…', o: ['necesarias y suficientes', 'suficientes pero no necesarias', 'necesarias pero no suficientes', 'irrelevantes'], a: 1, e: 'Si no se cumplen, la serie puede igual converger.' },
        { q: 'El período fundamental de tg x es…', o: ['2π', 'π', 'π/2', '1'], a: 1, e: 'tg(x + π) = tg x.' },
      ],
      sources: [{ title: 'Apunte: Series de Fourier', ref: 'Cátedra de Matemática Superior', points: ['Funciones periódicas y continuas por intervalos.', 'Condiciones de Dirichlet y teorema de convergencia puntual.', 'Aplicaciones en ingeniería.'] }, { title: 'Análisis de Fourier', ref: 'Spiegel, Schaum', points: ['Fuente de las definiciones y condiciones.'] }],
    },

    {
      id: 'fourier-serie',
      module: 'u7',
      title: 'Coeficientes y serie de Fourier',
      keywords: 'serie de fourier coeficientes a0 an bn período 2L integración por partes armónicos suma parcial gibbs',
      tldr: 'f(x) = <mark>a₀/2 + Σ [aₙ cos(nπx/L) + bₙ sen(nπx/L)]</mark>, con aₙ = (1/L)∫ f(x) cos(nπx/L) dx y bₙ = (1/L)∫ f(x) sen(nπx/L) dx sobre un período de longitud 2L. Calcular la serie es calcular esas integrales, casi siempre por partes.',
      goals: ['Calcular a₀, aₙ y bₙ.', 'Escribir la serie y graficar sumas parciales.', 'Resolver el TP 9, ejercicio 1.'],
      body: `
        ${eq(`f(x) = ${frac('a₀', '2')} + Σ<sub>n=1</sub><sup>∞</sup> [aₙ cos ${frac('nπx', 'L')} + bₙ sen ${frac('nπx', 'L')}]`, 'Serie de Fourier, período 2L')}
        ${eq(`aₙ = ${frac('1', 'L')} ∫<sub>c</sub><sup>c+2L</sup> f(x) cos ${frac('nπx', 'L')} dx &nbsp;&nbsp; bₙ = ${frac('1', 'L')} ∫<sub>c</sub><sup>c+2L</sup> f(x) sen ${frac('nπx', 'L')} dx &nbsp;&nbsp; ${frac('a₀', '2')} = ${frac('1', '2L')} ∫<sub>c</sub><sup>c+2L</sup> f(x) dx`, 'Coeficientes (c cualquier real)')}
        <p>a₀/2 es el <strong>valor medio</strong> de f en un período. Se puede integrar sobre cualquier intervalo de longitud 2L: (−L, L), (0, 2L)… Primero hay que identificar <strong>2L = período</strong>.</p>
        ${note('Dos valores que aparecen en casi todos los ejercicios: sen(nπ) = 0 y cos(nπ) = (−1)ⁿ. Por eso los coeficientes suelen tener (−1)ⁿ y se anulan para n par o impar.', 'tip')}
        <h2>Ejemplo del apunte</h2>
        <p>f(x) = 0 en −π ≤ x ≤ 0, f(x) = x en 0 ≤ x ≤ π, período 2π (L = π).</p>
        ${eq(`${frac('a₀', '2')} = ${frac('1', '2π')} ∫<sub>0</sub><sup>π</sup> x dx = ${frac('π', '4')}`)}
        <p>Por partes (u = x, dv = cos nx dx):</p>
        ${eq(`aₙ = ${frac('1', 'π')} [${frac('x sen nx', 'n')} + ${frac('cos nx', 'n²')}]<sub>0</sub><sup>π</sup> = ${frac('(−1)ⁿ − 1', 'πn²')} = { 0 si n par; −2/(πn²) si n impar }`)}
        ${eq(`bₙ = ${frac('1', 'π')} [−${frac('x cos nx', 'n')} + ${frac('sen nx', 'n²')}]<sub>0</sub><sup>π</sup> = −${frac('cos nπ', 'n')} = ${frac('(−1)ⁿ⁺¹', 'n')}`)}
        ${eq(`f(x) = ${frac('π', '4')} + Σ [−${frac('2', 'π(2n − 1)²')} cos(2n − 1)x + ${frac('(−1)ⁿ⁺¹', 'n')} sen nx]`)}
        ${chart({ x: [-PI, 3 * PI], y: [-0.6, 3.6], w: 460, h: 230, ticks: { x: [-3, 3, 6, 9], y: [1, 2, 3] }, curves: [{ f: per(half, -PI, 2 * PI), cls: 'c-tan', dash: true, n: 400 }, { f: (x) => Fh.sum(x, 9), cls: 'c-root', label: 'S₉', n: 400 }] }, 'Suma parcial con 9 armónicos sobre la función original (punteada). En x = π la serie converge a π/2, el promedio del salto.')}
        <p><b>Suma de una serie numérica.</b> En x = 0 f es continua y vale 0: 0 = π/4 − (2/π)(1 + 1/3² + 1/5² + …). Entonces Σ 1/(2n − 1)² = π²/8.</p>
        ${lab(0)}`,
      labs: [{ type: 'fourier', fn: 'half', n: 3, title: 'Sumas parciales de Fourier', intro: 'Subí N y mirá cómo la suma se pega a la función. Las barras muestran aₙ (azul) y bₙ (rojo). Probá las funciones del TP 9.' }],
      exercises: [
        { title: 'Coeficientes y serie de Fourier', official: '9.1', level: 3, prompt: '<p>a) f = 0 en (−5, 0), 3 en (0, 5). b) f = x² en (0, 2π). c) f = 8 en (0, 2), −8 en (2, 4). d) f = 0 en (−3, 0), 2x en (0, 3). e) f = −x en (−4, 0), x en (0, 4). f) f = 4x en (0, 10). g) f = 2 − x en (0, 4), x − 6 en (4, 8). h) f = x en (0, 4), 8 − x en (4, 8).</p>', hints: ['Primero: 2L = longitud del intervalo, entonces L.', 'Antes de integrar mirá si la función (o f menos una constante) es par o impar: ahorra la mitad del trabajo.'],
          solution: { explain: table(['', 'L', 'a₀/2', 'aₙ', 'bₙ', 'Serie'], [
            ['a', '5', '3/2', '0', '3(1 − (−1)ⁿ)/(nπ)', '3/2 + (6/π) Σ<sub>n impar</sub> (1/n) sen(nπx/5)'],
            ['b', 'π', '4π²/3', '4/n²', '−4π/n', '4π²/3 + Σ [(4/n²) cos nx − (4π/n) sen nx]'],
            ['c', '2', '0', '0', '16(1 − (−1)ⁿ)/(nπ)', '(32/π) Σ<sub>n impar</sub> (1/n) sen(nπx/2)'],
            ['d', '3', '3/2', '6((−1)ⁿ − 1)/(π²n²)', '6(−1)ⁿ⁺¹/(nπ)', '3/2 − (12/π²) Σ<sub>n impar</sub> cos(nπx/3)/n² + (6/π) Σ (−1)ⁿ⁺¹ sen(nπx/3)/n'],
            ['e', '4', '2', '8((−1)ⁿ − 1)/(π²n²)', '0', '2 − (16/π²) Σ<sub>n impar</sub> cos(nπx/4)/n²'],
            ['f', '5', '20', '0', '−40/(nπ)', '20 − (40/π) Σ (1/n) sen(nπx/5)'],
            ['g', '4', '0', '8(1 − (−1)ⁿ)/(π²n²)', '0', '(16/π²) Σ<sub>n impar</sub> cos(nπx/4)/n²'],
            ['h', '4', '2', '8((−1)ⁿ − 1)/(π²n²)', '0', '2 − (16/π²) Σ<sub>n impar</sub> cos(nπx/4)/n²'],
          ]) + '<p>Notá que e) y h) dan la misma serie: |x| en (−4, 4) y la “carpa” x, 8 − x en (0, 8) son la misma onda triangular desplazada un período. Controles: en g), x = 0 da (16/π²)(π²/8) = 2 = f(0) ✓; en a), x = 0 da 3/2, el promedio del salto entre 0 y 3 ✓.</p>' } },
      ],
      quiz: [
        { q: 'Si f tiene período 8, entonces L = …', o: ['8', '4', '2', 'π'], a: 1, e: 'El período es 2L.' },
        { q: 'a₀/2 representa…', o: ['el primer armónico', 'el valor medio de f en un período', 'la amplitud máxima', 'la frecuencia'], a: 1, e: '(1/2L)∫f.' },
        { q: 'cos(nπ) = …', o: ['0', '1', '(−1)ⁿ', '−1'], a: 2, e: 'Vale 1 para n par y −1 para n impar.' },
        { q: 'Las integrales de aₙ y bₙ con f(x) = x se resuelven por…', o: ['sustitución', 'partes', 'fracciones simples', 'tabla de Laplace'], a: 1, e: 'u = x.' },
        { q: 'Al sumar más armónicos cerca de un salto…', o: ['el sobrepico desaparece', 'queda un sobrepico de ~9 % (Gibbs) que se angosta', 'la serie diverge', 'la suma se vuelve constante'], a: 1, e: 'Fenómeno de Gibbs.' },
      ],
      sources: [{ title: 'Apuntes: Series de Fourier', ref: 'Cátedra de Matemática Superior', points: ['Fórmulas de los coeficientes con período 2L.', 'Ejemplo 0 / x en (−π, π) y suma Σ 1/(2n − 1)² = π²/8.'] }],
    },

    {
      id: 'fourier-pares-impares',
      module: 'u7',
      title: 'Funciones pares e impares: series de senos y cosenos',
      keywords: 'función par impar simetría serie de cosenos serie de senos medio rango',
      tldr: 'Si f es <mark>par</mark>, todos los bₙ = 0 y la serie es solo de <strong>cosenos</strong>; si es <mark>impar</mark>, todos los aₙ = 0 y es solo de <strong>senos</strong>. Además las integrales se calculan sobre medio período, multiplicadas por 2.',
      goals: ['Clasificar funciones en pares e impares.', 'Aprovechar la simetría para calcular coeficientes.', 'Resolver el TP 9, ejercicio 2.'],
      body: `
        ${table(['', 'Par', 'Impar'], [
          ['Definición', 'g(−t) = g(t)', 'h(−t) = −h(t)'],
          ['Simetría', 'Respecto del eje y', 'Respecto del origen'],
          ['Ejemplos', 'cos nt, x², |x|', 'sen nt, x, x³'],
          ['∫<sub>−L</sub><sup>L</sup>', '2 ∫<sub>0</sub><sup>L</sup> g(t) dt', '0'],
          ['Serie', `${frac('a₀', '2')} + Σ aₙ cos(nπx/L), con aₙ = ${frac('2', 'L')} ∫<sub>0</sub><sup>L</sup> f cos(nπx/L) dx`, `Σ bₙ sen(nπx/L), con bₙ = ${frac('2', 'L')} ∫<sub>0</sub><sup>L</sup> f sen(nπx/L) dx`],
        ])}
        <p>¿Por qué? f(x)·sen(nπx/L) es impar cuando f es par (par por impar = impar), y su integral en un intervalo simétrico es 0: todos los bₙ se anulan. Con f impar pasa lo mismo con los cosenos.</p>
        <h2>Ejemplo par: f(x) = x² en (−π, π)</h2>
        ${eq(`${frac('a₀', '2')} = ${frac('1', 'π')} ∫<sub>0</sub><sup>π</sup> x² dx = ${frac('π²', '3')} &nbsp;&nbsp; aₙ = ${frac('2', 'π')} ∫<sub>0</sub><sup>π</sup> x² cos nx dx = ${frac('4(−1)ⁿ', 'n²')}`)}
        ${eq(`x² = ${frac('π²', '3')} + 4 Σ ${frac('(−1)ⁿ', 'n²')} cos nx`)}
        <h2>Ejemplo impar: f(x) = x en (−π, π)</h2>
        ${eq(`bₙ = ${frac('2', 'π')} ∫<sub>0</sub><sup>π</sup> x sen nx dx = ${frac('2(−1)ⁿ⁺¹', 'n')} &nbsp;&nbsp; ⟹ &nbsp; x = 2 Σ ${frac('(−1)ⁿ⁺¹', 'n')} sen nx`)}
        ${lab(0)}
        ${note('Antes de integrar, mirá la simetría: si la función es par o impar, la mitad de los coeficientes es 0 sin hacer cuentas. Ojo: una función puede no ser par ni impar pero serlo después de restarle una constante (por ejemplo, el TP 9, 1a menos 3/2 es impar).', 'exam')}`,
      labs: [{ type: 'fourier', fn: 'par', n: 4, title: 'Simetría y coeficientes', intro: 'Con x² (par) las barras rojas bₙ son todas cero; con x (impar) desaparecen las azules aₙ. Compará con la onda cuadrada.' }],
      exercises: [
        { title: 'Clasificar y desarrollar', official: '9.2', level: 2, prompt: '<p>Clasificar en pares o impares y escribir la serie: a) f = 2 en (0, 3), −2 en (−3, 0); b) f = x² en (−π, π); c) f = −1 en (−π, 0), 1 en (0, π).</p>',
          solution: { explain: table(['', 'Simetría', 'Coeficientes', 'Serie'], [
            ['a', 'Impar', 'bₙ = (2/3)∫₀³ 2 sen(nπx/3) dx = 4(1 − (−1)ⁿ)/(nπ)', '(8/π) Σ<sub>n impar</sub> (1/n) sen(nπx/3)'],
            ['b', 'Par', 'a₀/2 = π²/3, aₙ = 4(−1)ⁿ/n²', 'π²/3 + 4 Σ (−1)ⁿ cos(nx)/n²'],
            ['c', 'Impar', 'bₙ = 2(1 − (−1)ⁿ)/(nπ)', '(4/π) Σ<sub>n impar</sub> (1/n) sen nx = (4/π)(sen x + sen 3x/3 + sen 5x/5 + …)'],
          ]) + '<p>En b), con x = π (donde la extensión periódica es continua): π² = π²/3 + 4 Σ 1/n², de donde Σ 1/n² = π²/6.</p>' } },
      ],
      quiz: [
        { q: 'Si f es par, su serie de Fourier tiene…', o: ['solo senos', 'solo cosenos (y a₀)', 'senos y cosenos', 'solo a₀'], a: 1, e: 'Todos los bₙ son 0.' },
        { q: 'f(x) = x³ es…', o: ['par', 'impar', 'ni par ni impar', 'periódica'], a: 1, e: '(−x)³ = −x³.' },
        { q: '∫₋ₗᴸ h(t) dt con h impar vale…', o: ['2∫₀ᴸ h', '0', 'L', 'h(L)'], a: 1, e: 'Las áreas se cancelan.' },
        { q: 'La onda cuadrada −1 en (−π, 0), 1 en (0, π) es…', o: ['par', 'impar', 'ni par ni impar', 'constante'], a: 1, e: 'Simétrica respecto del origen.' },
        { q: 'Para una función par, aₙ = …', o: ['(1/L)∫₀ᴸ f cos', '(2/L)∫₀ᴸ f cos', '0', '(2/L)∫₀ᴸ f sen'], a: 1, e: 'Se integra medio período y se duplica.' },
      ],
      sources: [{ title: 'Apunte: Series de Fourier de funciones pares e impares', ref: 'Cátedra de Matemática Superior', points: ['Ejemplo 2: x² (par), ejemplo 3: x (impar).'] }],
    },
  );
})();
