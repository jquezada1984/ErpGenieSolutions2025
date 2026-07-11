export const TIPOS_CUENTA = [
  { value: 'ahorro', label: 'Cuenta bancaria de ahorros' },
  { value: 'corriente', label: 'Cuenta corriente, cheque o tarjeta de crédito' },
  { value: 'caja_efectivo', label: 'Cuenta caja/efectivo' },
] as const;

/** Medios de pago en transferencia interna (equivalente Dolibarr c_paiement) */
export const TIPOS_PAGO_TRANSFERENCIA = [
  { value: 'cheque', label: 'Cheque' },
  { value: 'domiciliacion', label: 'Domiciliación' },
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia_bancaria', label: 'Transferencia bancaria' },
] as const;

export type TipoPagoTransferencia = (typeof TIPOS_PAGO_TRANSFERENCIA)[number]['value'];

export const labelTipoPagoTransferencia = (v?: string) =>
  TIPOS_PAGO_TRANSFERENCIA.find((t) => t.value === v)?.label || v || '—';

export const ESTADOS_CUENTA = [
  { value: 'abierta', label: 'Abierto' },
  { value: 'cerrada', label: 'Cerrado' },
] as const;
