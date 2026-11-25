# Iterando Ando

Guía de estudio de **Matemática Superior 2026 (UTN-FRT, Ingeniería en Sistemas de Información)**, armada con los apuntes de la cátedra, las clases y los trabajos prácticos. Los parciales son teórico-prácticos: cada lección tiene la teoría (definiciones y deducciones de los apuntes y de la bibliografía: Chapra y Canale, Burden), laboratorios interactivos, preguntas de repaso y los ejercicios de los TP y de los parciales resueltos.

- **Primer parcial** (carmín): números complejos (TP 1), transformada de Laplace (TP 2), ecuaciones diferenciales con Laplace (TP 3), función de transferencia (TP 4) y métodos aproximados para EDO (TP 5).
- **Segundo parcial** (azul petróleo): raíces de ecuaciones con métodos cerrados y abiertos (TP 6), interpolación (TP 7), regresión por mínimos cuadrados (TP 8) y series de Fourier (TP 9).
- **Parciales resueltos** (`#/parciales`): 8 parciales reales (5 del primero y 3 del segundo, 2024-2025), 71 ítems resueltos con su teoría y un ranking de lo que más se repite.
- **Teoría a fondo**: una lección nueva por unidad basada en Chapra y Canale (5ª ed.) y Burden (10ª ed.): ecuación característica, alcance de Laplace, problema de valor inicial, invariancia en el tiempo, error local y global y elección de h, errores y cifras significativas, orden de convergencia, unicidad y error de interpolación, criterios de regresión y ortogonalidad de Fourier.
- 39 lecciones, 35 laboratorios (plano complejo, la transformada como área, respuesta al escalón, Euler/Heun/RK paso a paso, raíces iteración por iteración, carrera de métodos, interpolación, regresión y sumas de Fourier), 193 preguntas, simulacro por parcial, repaso de falladas, taller de gráficas y hoja de fórmulas.
- Las tablas de iteraciones de las soluciones (TP 5, 6, 7 y 8) se calculan en la página con el mismo código que los laboratorios y los mismos valores iniciales que la clase. Las soluciones simbólicas (TP 2, 3, 4 y 9) se verificaron con SymPy.

Sitio en GitHub Pages: [franco704.github.io/iterando-ando](https://franco704.github.io/iterando-ando/)

No necesita instalación ni compilación: es HTML, CSS y JavaScript con módulos ES. Como los navegadores no cargan módulos desde `file://`, para verla en tu compu levantá un servidor estático en la carpeta (por ejemplo `python3 -m http.server`) y abrí `http://localhost:8000`. El progreso se guarda en el navegador (claves `ms-*`, las mismas de siempre).

Pruebas: `npm test` corre `node tests/metodos.test.js` (métodos numéricos contra los resultados de clase) y `node tests/contenido.test.js` (estructura del contenido y que cada ítem de parcial tenga su resolución).

## Cómo está organizado

La estructura cuenta de qué trata la materia (arquitectura *screaming*):

```
index.html              armazón: barra, índice, dock inferior en móvil
src/main.js             raíz de composición: rutas por hash (#/<lección>, #/quiz/<unidad>, #/simulacro/<parcial>, #/parciales, …) y vistas
src/temario/            lecciones por parcial (primer-parcial/ y segundo-parcial/, un archivo por unidad), catálogo, ayudantes de redacción e índice
src/metodos/            los métodos numéricos de la materia, puros y probados: raíces, EDO, interpolación, regresión y Fourier
src/examenes/           parciales reales resueltos (suman ejercicios a las lecciones)
src/laboratorios/       gráficas interactivas, laboratorios genéricos e índice que los monta
src/estudio/            progreso, preguntas, fórmulas y otras guías
src/vistas/             inicio, lección, cuestionarios (módulo, simulacro, repaso) y recursos (parciales, fórmulas, gráficas)
src/animaciones/        pantalla de entrada a cada unidad y glifo de cada lección
src/ui/ src/nucleo/     armazón e íconos; DOM, almacenamiento, formato y rutas
styles/                 tokens, base, armazón, contenido, estudio, laboratorios, vistas y animaciones
```

El diseño es *mobile-first*: en el celular todo se alcanza desde el dock inferior (Inicio, Índice, Parciales, Simulacro, Repasar) y el cajón, con el buscador, todas las herramientas y el índice completo; desde 1024 px el índice queda fijo y las herramientas pasan a la barra superior, y desde 1280 px aparece el riel con las secciones de la lección. La portada abre con Newton Raphson real sobre x³ − 100, con las cifras correctas de cada iterado (calculado con `src/metodos/`). Tipografía: Schibsted Grotesk para títulos e interfaz, STIX Two Text para leer y DM Mono para los números.

## Cargar una unidad o un parcial

1. Una lección nueva va en `src/temario/<parcial>/<tema>.js` (`LESSONS.push({ id, module, … })` y `export default LESSONS`), importado en orden en `src/temario/lecciones.js`; un módulo nuevo, en `src/temario/catalogo.js`.
2. Un parcial nuevo va en `src/examenes/parciales-reales.js`: el examen en `EXAMS` y, para cada ítem, un ejercicio con `exam: ['<id>#<ítem>']` en la lección que corresponda. El test falla si un ítem queda sin resolver.

Los ids de las lecciones y el orden de sus preguntas son los que guardan el progreso: agregar al final, nunca reordenar.

## También probá

### 2.º año

- [Integrando Ando](https://franco704.github.io/integrando-ando/): Análisis Matemático II ([repositorio](https://github.com/Franco704/integrando-ando))
- [Operando Ando](https://franco704.github.io/operando-ando/): Sistemas Operativos ([repositorio](https://github.com/Franco704/operando-ando))

### 3.er año

- [Backeando Ando](https://franco704.github.io/backeando-ando/): Desarrollo de Software, backend ([repositorio](https://github.com/Franco704/backeando-ando))
- [Fronteando Ando](https://franco704.github.io/fronteando-ando/): Desarrollo de Software, frontend ([repositorio](https://github.com/Franco704/fronteando-ando))
- [Diseñando Ando](https://franco704.github.io/disenando-ando/): Diseño de Sistemas de Información ([repositorio](https://github.com/Franco704/disenando-ando))
- [Modulando Ando](https://franco704.github.io/modulando-ando/): Comunicación de Datos ([repositorio](https://github.com/Franco704/modulando-ando))
- [Probando Ando](https://franco704.github.io/probando-ando/): Probabilidad y Estadística ([repositorio](https://github.com/Franco704/probando-ando))
- [Economizar](https://franco704.github.io/economizar/): Economía ([repositorio](https://github.com/Franco704/economizar))

## Agradecimientos

A **Mateo Rusconi**, autor original de las animaciones que esta guía hereda de Backeando Ando: la pantalla de entrada a cada tema, los glifos animados de las lecciones y los microefectos de los cuestionarios vienen de su "Laboratorio Frontend DSW".
