export const MESES_LABEL = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export type ResumenItem = {
  cuenta: string;
  mes: number;
  num_lineas: number;
  total: number;
};

export type ResumenPivotRow = {
  cuenta: string;
  meses: Record<number, { num_lineas: number; total: number }>;
  totalLineas: number;
  totalImporte: number;
};

export const pivotResumen = (items: ResumenItem[]): ResumenPivotRow[] => {
  const map = new Map<string, ResumenPivotRow>();
  items.forEach((it) => {
    if (!map.has(it.cuenta)) {
      map.set(it.cuenta, { cuenta: it.cuenta, meses: {}, totalLineas: 0, totalImporte: 0 });
    }
    const row = map.get(it.cuenta)!;
    row.meses[it.mes] = { num_lineas: it.num_lineas, total: it.total };
    row.totalLineas += it.num_lineas;
    row.totalImporte += it.total;
  });
  return Array.from(map.values()).sort((a, b) => a.cuenta.localeCompare(b.cuenta));
};

export const formatImporte = (n: number) =>
  Number(n).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const anioActual = () => new Date().getFullYear();
