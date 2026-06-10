export const TIPOS_DIARIO = [
  { value: 'OPERACIONES_VARIAS', label: 'Operaciones varias' },
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'COMPRAS', label: 'Compras' },
  { value: 'BANCO', label: 'Banco' },
  { value: 'GASTOS', label: 'Gastos' },
  { value: 'INVENTARIO', label: 'Inventario' },
  { value: 'GANANCIAS_RETENIDAS', label: 'Ganancias retenidas' },
] as const;

export const labelTipoDiario = (value: string): string =>
  TIPOS_DIARIO.find((t) => t.value === value)?.label || value;
