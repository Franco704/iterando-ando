// Número con formato argentino: 1.234,5
export const num = (v, d = 2) => (Math.abs(v) < 1e-9 ? 0 : v).toLocaleString('es-AR', { maximumFractionDigits: d });
