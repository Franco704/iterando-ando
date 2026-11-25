/* Parciales y módulos (unidades del programa con su TP). Cada lección indica su módulo; cada módulo, su parcial. */
  export const PARCIALES = [
    { id: 'p1', title: 'Primer parcial', name: 'Del tiempo a la frecuencia' },
    { id: 'p2', title: 'Segundo parcial', name: 'Métodos numéricos y Fourier' },
  ];

  // stop = nombre corto para el recorrido de la portada; tema = unidad del programa analítico 2026; tp = trabajo práctico
  export const MODULOS = [
    { id: 'u1', unit: 'p1', tema: '1', tp: 1, title: 'Números complejos', stop: 'ℂ', blurb: 'formas binómica, polar y exponencial, operaciones y fórmula de Euler' },
    { id: 'u2', unit: 'p1', tema: '2', tp: 2, title: 'Transformada de Laplace', stop: 'ℒ', blurb: 'definición, tabla, propiedades, inversa y fracciones simples' },
    { id: 'u2e', unit: 'p1', tema: '2', tp: 3, title: 'Ecuaciones diferenciales con Laplace', stop: 'EDO', blurb: 'clasificación y resolución de EDO lineales con condiciones iniciales' },
    { id: 'u3', unit: 'p1', tema: '3', tp: 4, title: 'Función de transferencia', stop: 'P(s)', blurb: 'definición, polos y ceros, respuesta al escalón' },
    { id: 'u4', unit: 'p1', tema: '4', tp: 5, title: 'Métodos aproximados para EDO', stop: 'Euler', blurb: 'Euler, Heun, polígono mejorado y Runge Kutta' },
    { id: 'u5c', unit: 'p2', tema: '5', tp: 6, title: 'Raíces: métodos cerrados', stop: 'Bisección', blurb: 'cambio de signo, bisección, regla falsa y error relativo' },
    { id: 'u5a', unit: 'p2', tema: '5', tp: 6, title: 'Raíces: métodos abiertos', stop: 'Newton', blurb: 'punto fijo, Newton Raphson, secante y comparación' },
    { id: 'u6i', unit: 'p2', tema: '6', tp: 7, title: 'Interpolación', stop: 'Interp.', blurb: 'diferencias divididas de Newton y Lagrange, lineal y cuadrática' },
    { id: 'u6r', unit: 'p2', tema: '6', tp: 8, title: 'Regresión por mínimos cuadrados', stop: 'Regresión', blurb: 'recta y parábola de mínimos cuadrados, error estándar y r²' },
    { id: 'u7', unit: 'p2', tema: '7', tp: 9, title: 'Series de Fourier', stop: 'Fourier', blurb: 'funciones periódicas, coeficientes, pares e impares' },
  ];

