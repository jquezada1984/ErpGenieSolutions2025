-- Diarios contables estándar por empresa (solo si no existen)
INSERT INTO diario_contable (id_diario_contable, id_empresa, codigo, nombre, tipo_diario, estado)
SELECT gen_random_uuid(), e.id_empresa, d.codigo, d.nombre, d.tipo_diario, true
FROM empresa e
CROSS JOIN (
  VALUES
    ('AC', 'Diario de compras - compras y devoluciones', 'COMPRAS'),
    ('AN', 'Tiene un nuevo diario', 'GANANCIAS_RETENIDAS'),
    ('BQ', 'Diario financiero', 'BANCO'),
    ('ER', 'Diario informe de gastos', 'GASTOS'),
    ('INV', 'Diario de inventario', 'INVENTARIO'),
    ('OD', 'Diario general', 'OPERACIONES_VARIAS'),
    ('VT', 'Diario de ventas - ventas y devoluciones', 'VENTAS')
) AS d(codigo, nombre, tipo_diario)
WHERE e.id_empresa <> 'a0000000-0000-4000-8000-000000000001'
ON CONFLICT (id_empresa, codigo) DO NOTHING;
