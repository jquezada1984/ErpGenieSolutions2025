export type CuentaDefectoMeta = {
  tipo_operacion: string;
  seccion: 'TERCEROS_USUARIOS' | 'PRODUCTO' | 'SERVICIO' | 'OTROS' | 'ANTICIPOS';
  label: string;
};

export const SECCIONES_CUENTA_DEFECTO: Record<string, string> = {
  TERCEROS_USUARIOS: 'Terceros | Usuarios',
  PRODUCTO: 'Producto',
  SERVICIO: 'Servicio',
  OTROS: 'Otros',
  ANTICIPOS: 'Anticipos',
};

export const CATALOGO_CUENTAS_DEFECTO: CuentaDefectoMeta[] = [
  { tipo_operacion: 'TERCERO_CLIENTE', seccion: 'TERCEROS_USUARIOS', label: 'Cuenta (del Plan Contable) utilizada para terceros "clientes"' },
  { tipo_operacion: 'TERCERO_PROVEEDOR', seccion: 'TERCEROS_USUARIOS', label: 'Cuenta (del Plan Contable) utilizada para los terceros "proveedores"' },
  { tipo_operacion: 'TERCERO_USUARIO', seccion: 'TERCEROS_USUARIOS', label: 'Cuenta (del Plan Contable) utilizada por defecto para terceros "usuarios"' },
  { tipo_operacion: 'PRODUCTO_VENTA_NACIONAL', seccion: 'PRODUCTO', label: 'Cuenta que se usará como predeterminada para los productos vendidos' },
  { tipo_operacion: 'PRODUCTO_VENTA_EXPORTACION', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos vendidos y exportados' },
  { tipo_operacion: 'PRODUCTO_COMPRA_NACIONAL', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos comprados dentro del mismo país' },
  { tipo_operacion: 'PRODUCTO_COMPRA_IMPORTACION', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos comprados e importados' },
  { tipo_operacion: 'SERVICIO_VENTA_NACIONAL', seccion: 'SERVICIO', label: 'Cuenta predeterminada para los servicios vendidos' },
  { tipo_operacion: 'SERVICIO_VENTA_EXPORTACION', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios vendidos y exportados' },
  { tipo_operacion: 'SERVICIO_COMPRA_NACIONAL', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios comprados dentro del mismo país' },
  { tipo_operacion: 'SERVICIO_COMPRA_IMPORTACION', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios comprados e importados' },
  { tipo_operacion: 'IVA_VENTA', seccion: 'OTROS', label: 'Cuenta predeterminada para el IVA en ventas' },
  { tipo_operacion: 'IVA_COMPRA', seccion: 'OTROS', label: 'Cuenta predeterminada para el IVA en compras' },
  { tipo_operacion: 'IVA_PAGO', seccion: 'OTROS', label: 'Cuenta predeterminada para el pago del IVA' },
  { tipo_operacion: 'TRANSITORIA_BANCARIA', seccion: 'OTROS', label: 'Cuenta transitoria para transferencias bancarias' },
  { tipo_operacion: 'DONACION', seccion: 'OTROS', label: 'Cuenta para registro de donaciones' },
  { tipo_operacion: 'PRESTAMO_CAPITAL', seccion: 'OTROS', label: 'Cuenta predeterminada para capital (módulo préstamos)' },
  { tipo_operacion: 'PRESTAMO_INTERES', seccion: 'OTROS', label: 'Cuenta predeterminada para intereses (módulo préstamos)' },
  { tipo_operacion: 'PRESTAMO_SEGURO', seccion: 'OTROS', label: 'Cuenta predeterminada para seguro (módulo préstamos)' },
  { tipo_operacion: 'FONDOS_SIN_ASIGNAR', seccion: 'OTROS', label: 'Cuenta para fondos recibidos o pagados sin asignar' },
  { tipo_operacion: 'ANTICIPO_CLIENTE', seccion: 'ANTICIPOS', label: 'Cuenta predeterminada para anticipos de clientes' },
  { tipo_operacion: 'ANTICIPO_PROVEEDOR', seccion: 'ANTICIPOS', label: 'Cuenta predeterminada para anticipos a proveedores' },
];
