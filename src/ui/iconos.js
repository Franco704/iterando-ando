// Íconos de trazo (24×24). Siempre decorativos: el texto o el aria-label del botón dice qué hacen.
const P = {
  menu: 'M4 7h16M4 12h16M4 17h10',
  cerrar: 'M6 6l12 12M18 6L6 18',
  luna: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  inicio: 'M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z',
  indice: 'M5 6h2M10 6h9M5 12h2M10 12h9M5 18h2M10 18h9',
  lab: 'M3 5h18v12H3zM7 9l3 2-3 2M12 13h4M9 21h6',
  simulacro: 'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2',
  repasar: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  video: 'M4 6h12v12H4zM16 10l4-2v8l-4-2',
  abiertas: 'M4 18l4-1L18 7l-3-3L5 14zM14 5l3 3',
  parciales: 'M6 3h9l3 3v15H6zM9 11l2 2 4-4M9 17h6',
  graficas: 'M3 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0M3 20h18',
  formulas: 'M5 5h14M5 19h14M7 5l6 7-6 7',
  apuntes: 'M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z',
  buscar: 'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM16 16l4 4',
};
export const icono = (n, tam = 20) => `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" aria-hidden="true" focusable="false"><path d="${P[n]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
