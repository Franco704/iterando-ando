// Utilidades mínimas de DOM y texto que usan todas las vistas.
export const $ = (s, el = document) => el.querySelector(s);
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const irA = (el) => el?.scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth' });
