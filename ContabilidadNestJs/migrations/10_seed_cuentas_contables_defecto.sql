-- Cuentas contables por defecto por empresa (plan activo + códigos EC-SUPERCIAS)
INSERT INTO cuenta_contable_defecto (
  id_cuenta_contable_defecto, id_empresa, tipo_operacion, id_cuenta_contable, descripcion, estado
)
SELECT
  gen_random_uuid(),
  e.id_empresa,
  m.tipo_operacion,
  c.id_cuenta_contable,
  m.descripcion,
  true
FROM empresa e
INNER JOIN LATERAL (
  SELECT id_plan_contable
  FROM plan_contable
  WHERE id_empresa = e.id_empresa AND estado = true
  ORDER BY created_at DESC
  LIMIT 1
) p ON true
CROSS JOIN (
  VALUES
    ('TERCERO_CLIENTE', '10102050101', 'Cuenta utilizada para terceros clientes'),
    ('TERCERO_PROVEEDOR', '20103', 'Cuenta utilizada para terceros proveedores'),
    ('TERCERO_USUARIO', '20108', 'Cuenta utilizada para terceros usuarios'),
    ('PRODUCTO_VENTA_NACIONAL', '40101', 'Productos vendidos nacional'),
    ('PRODUCTO_VENTA_EXPORTACION', '40101', 'Productos vendidos exportación'),
    ('PRODUCTO_COMPRA_NACIONAL', '50101', 'Productos comprados nacional'),
    ('PRODUCTO_COMPRA_IMPORTACION', '50101', 'Productos comprados importación'),
    ('SERVICIO_VENTA_NACIONAL', '40102', 'Servicios vendidos nacional'),
    ('SERVICIO_VENTA_EXPORTACION', '40102', 'Servicios vendidos exportación'),
    ('SERVICIO_COMPRA_NACIONAL', '50202', 'Servicios comprados nacional'),
    ('SERVICIO_COMPRA_IMPORTACION', '50202', 'Servicios comprados importación'),
    ('IVA_VENTA', '2010701', 'IVA en ventas'),
    ('IVA_COMPRA', '1010501', 'IVA en compras'),
    ('IVA_PAGO', '2010701', 'Pago de IVA'),
    ('TRANSITORIA_BANCARIA', '1010103', 'Cuenta transitoria bancaria'),
    ('DONACION', '30605', 'Donaciones'),
    ('PRESTAMO_CAPITAL', '201030101', 'Capital préstamos'),
    ('PRESTAMO_INTERES', '2010605', 'Intereses préstamos'),
    ('PRESTAMO_SEGURO', '2010501', 'Seguro préstamos'),
    ('FONDOS_SIN_ASIGNAR', '1010101', 'Fondos sin asignar'),
    ('ANTICIPO_CLIENTE', '101020603', 'Anticipos clientes'),
    ('ANTICIPO_PROVEEDOR', '1010403', 'Anticipos proveedores')
) AS m(tipo_operacion, codigo_cuenta, descripcion)
INNER JOIN cuenta_contable c
  ON c.id_plan_contable = p.id_plan_contable
 AND c.codigo = m.codigo_cuenta
WHERE e.id_empresa <> 'a0000000-0000-4000-8000-000000000001'
ON CONFLICT (id_empresa, tipo_operacion) DO NOTHING;
