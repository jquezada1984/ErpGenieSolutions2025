export const TIPOS_CUENTA = [
  { value: 'ahorro', label: 'Cuenta bancaria de ahorros' },
  { value: 'corriente', label: 'Cuenta corriente, cheque o tarjeta de crédito' },
  { value: 'caja_efectivo', label: 'Cuenta caja/efectivo' },
] as const;

export const ESTADOS_CUENTA = [
  { value: 'abierta', label: 'Abierto' },
  { value: 'cerrada', label: 'Cerrado' },
] as const;
