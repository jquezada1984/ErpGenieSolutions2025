/**
 * Previsualización monetaria alineada a GastoPython:
 * ROUND_HALF_UP a 2 decimales. Solo UX — el backend recalcula.
 */
export function roundHalfUp(value: number | string | null | undefined, decimals = 2): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const f = 10 ** decimals;
  const x = n * f;
  const sign = x < 0 ? -1 : 1;
  const abs = Math.abs(x);
  const floored = Math.floor(abs + Number.EPSILON);
  const frac = abs - floored;
  const rounded = frac >= 0.5 - Number.EPSILON ? floored + 1 : floored;
  return (sign * rounded) / f;
}

export function money(value: number | string | null | undefined): number {
  return roundHalfUp(value, 2);
}

export function formatMoney(value: number | string | null | undefined): string {
  const n = money(value);
  return n.toLocaleString('es-EC', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatFecha(value?: string | null): string {
  if (!value) return '-';
  const s = String(value).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-');
    return `${d}/${m}/${y}`;
  }
  return s;
}

export type LineaCalcInput = {
  cantidad?: number | string;
  precio_unitario?: number | string;
  descuento?: number | string;
  tasa?: number | string | null;
};

export function calcLinea(input: LineaCalcInput) {
  const qty = Number(input.cantidad) || 0;
  const precio = Number(input.precio_unitario) || 0;
  const desc = money(input.descuento || 0);
  const tasa = Number(input.tasa) || 0;
  const subtotal = money(qty * precio);
  const base = money(Math.max(0, subtotal - desc));
  const valor_impuesto = money((base * tasa) / 100);
  const total = money(base + valor_impuesto);
  return { subtotal, descuento: desc, valor_impuesto, total, base };
}

export function calcCabecera(
  lineas: Array<{ subtotal: number; descuento: number; valor_impuesto: number }>,
) {
  const subtotal = money(lineas.reduce((a, l) => a + money(l.subtotal), 0));
  const descuento = money(lineas.reduce((a, l) => a + money(l.descuento), 0));
  const impuesto = money(lineas.reduce((a, l) => a + money(l.valor_impuesto), 0));
  const total = money(subtotal - descuento + impuesto);
  return { subtotal, descuento, impuesto, total };
}

export const ESTADO_GASTO_BADGE: Record<string, string> = {
  BORRADOR: 'secondary',
  PENDIENTE: 'warning',
  APROBADO: 'success',
  RECHAZADO: 'danger',
  ANULADO: 'dark',
};
