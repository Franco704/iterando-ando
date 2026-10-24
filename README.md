# Iterando Ando

Guía de estudio de **Matemática Superior 2026 (UTN-FRT, Ingeniería en Sistemas de Información)**, armada con los apuntes de la cátedra, las clases y los trabajos prácticos. Los parciales son teórico-prácticos: cada lección tiene la teoría (definiciones y deducciones de los apuntes y de la bibliografía: Chapra y Canale, Burden), laboratorios interactivos, preguntas de repaso y los ejercicios de los TP y de los parciales resueltos.

- **Primer parcial**: números complejos (TP 1), transformada de Laplace (TP 2), ecuaciones diferenciales con Laplace (TP 3), función de transferencia (TP 4) y métodos aproximados para EDO (TP 5).
- **Segundo parcial**: raíces de ecuaciones con métodos cerrados y abiertos (TP 6), interpolación (TP 7), regresión por mínimos cuadrados (TP 8) y series de Fourier (TP 9).
- **Parciales resueltos** (`#/parciales`): 8 parciales reales (5 del primero y 3 del segundo, 2024-2025), 71 ítems resueltos con su teoría y un ranking de lo que más se repite.
- **Teoría a fondo**: una lección nueva por unidad basada en Chapra y Canale (5ª ed.) y Burden (10ª ed.): ecuación característica, alcance de Laplace, problema de valor inicial, invariancia en el tiempo, error local y global y elección de h, errores y cifras significativas, orden de convergencia, unicidad y error de interpolación, criterios de regresión y ortogonalidad de Fourier.
- 39 lecciones, 35 laboratorios (plano complejo, la transformada como área, respuesta al escalón, Euler/Heun/RK paso a paso, raíces iteración por iteración, carrera de métodos, interpolación, regresión y sumas de Fourier), 193 preguntas, simulacro por parcial, repaso de falladas, taller de gráficas y hoja de fórmulas.
- Las tablas de iteraciones de las soluciones (TP 5, 6, 7 y 8) se calculan en la página con el mismo código que los laboratorios y los mismos valores iniciales que la clase. Las soluciones simbólicas (TP 2, 3, 4 y 9) se verificaron con SymPy.

Sitio en GitHub Pages: [franco704.github.io/iterando-ando](https://franco704.github.io/iterando-ando/)

No necesita instalación: es HTML, CSS y JavaScript. Abrí `index.html`. El progreso se guarda en el navegador.

Pruebas: `node tests/num.test.js` (métodos numéricos contra los resultados de clase) y `node tests/content.test.js` (estructura del contenido y que cada ítem de parcial tenga su resolución).

## También probá

- [Backeando Ando](https://franco704.github.io/backeando-ando/) ([repositorio](https://github.com/Franco704/backeando-ando))
- [Fronteando Ando](https://franco704.github.io/fronteando-ando/) ([repositorio](https://github.com/Franco704/fronteando-ando))
- [Diseñando Ando](https://franco704.github.io/disenando-ando/) ([repositorio](https://github.com/Franco704/disenando-ando))
- [Economizar](https://franco704.github.io/economizar/) ([repositorio](https://github.com/Franco704/economizar))
- [Modulando Ando](https://franco704.github.io/modulando-ando/) ([repositorio](https://github.com/Franco704/modulando-ando))
- [Probando Ando](https://franco704.github.io/probando-ando/) ([repositorio](https://github.com/Franco704/probando-ando))

## Agradecimientos

A **Mateo Rusconi**, autor original de las animaciones que esta guía hereda de Backeando Ando: la pantalla de entrada a cada tema, los glifos animados de las lecciones y los microefectos de los cuestionarios vienen de su "Laboratorio Frontend DSW".
