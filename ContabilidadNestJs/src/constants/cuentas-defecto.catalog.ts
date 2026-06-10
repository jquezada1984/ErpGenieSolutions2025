export type CuentaDefectoCatalogItem = {
  tipo_operacion: string;
  seccion: string;
  label: string;
};

export const CATALOGO_CUENTAS_DEFECTO: CuentaDefectoCatalogItem[] = [
  { tipo_operacion: 'TERCERO_CLIENTE', seccion: 'TERCEROS_USUARIOS', label: 'Cuenta utilizada para terceros "clientes"' },
  { tipo_operacion: 'TERCERO_PROVEEDOR', seccion: 'TERCEROS_USUARIOS', label: 'Cuenta utilizada para terceros "proveedores"' },
  { tipo_operacion: 'TERCERO_USUARIO', seccion: 'TERCEROS_USUARIOS', label: 'Cuenta utilizada por defecto para terceros "usuarios"' },
  { tipo_operacion: 'PRODUCTO_VENTA_NACIONAL', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos vendidos (nacional)' },
  { tipo_operacion: 'PRODUCTO_VENTA_EXPORTACION', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos vendidos y exportados' },
  { tipo_operacion: 'PRODUCTO_COMPRA_NACIONAL', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos comprados (nacional)' },
  { tipo_operacion: 'PRODUCTO_COMPRA_IMPORTACION', seccion: 'PRODUCTO', label: 'Cuenta predeterminada para productos comprados e importados' },
  { tipo_operacion: 'SERVICIO_VENTA_NACIONAL', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios vendidos (nacional)' },
  { tipo_operacion: 'SERVICIO_VENTA_EXPORTACION', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios vendidos y exportados' },
  { tipo_operacion: 'SERVICIO_COMPRA_NACIONAL', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios comprados (nacional)' },
  { tipo_operacion: 'SERVICIO_COMPRA_IMPORTACION', seccion: 'SERVICIO', label: 'Cuenta predeterminada para servicios comprados e importados' },
  { tipo_operacion: 'IVA_VENTA', seccion: 'OTROS', label: 'Cuenta predeterminada para IVA en ventas' },
  { tipo_operacion: 'IVA_COMPRA', seccion: 'OTROS', label: 'Cuenta predeterminada para IVA en compras' },
  { tipo_operacion: 'IVA_PAGO', seccion: 'OTROS', label: 'Cuenta predeterminada para pago de IVA' },
  { tipo_operacion: 'TRANSITORIA_BANCARIA', seccion: 'OTROS', label: 'Cuenta transitoria para transferencias bancarias' },
  { tipo_operacion: 'DONACION', seccion: 'OTROS', label: 'Cuenta para registro de donaciones' },
  { tipo_operacion: 'PRESTAMO_CAPITAL', seccion: 'OTROS', label: 'Cuenta predeterminada para capital (préstamos)' },
  { tipo_operacion: 'PRESTAMO_INTERES', seccion: 'OTROS', label: 'Cuenta predeterminada para intereses (préstamos)' },
  { tipo_operacion: 'PRESTAMO_SEGURO', seccion: 'OTROS', label: 'Cuenta predeterminada para seguro (préstamos)' },
  { tipo_operacion: 'FONDOS_SIN_ASIGNAR', seccion: 'OTROS', label: 'Cuenta para fondos sin asignar' },
  { tipo_operacion: 'ANTICIPO_CLIENTE', seccion: 'ANTICIPOS', label: 'Cuenta predeterminada para anticipos de clientes' },
  { tipo_operacion: 'ANTICIPO_PROVEEDOR', seccion: 'ANTICIPOS', label: 'Cuenta predeterminada para anticipos a proveedores' },
];
