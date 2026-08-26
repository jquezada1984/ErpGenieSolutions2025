-- =====================================================
-- MENÚ LATERAL: Almacenes dentro de Producto|Servicio
-- =====================================================
-- Solo tablas de configuración de menú:
--   menu_item, perfil_menu_permiso
-- NO crea menu_seccion nueva (reutiliza Producto|Servicio).
-- NO crea pantallas ni backend.
-- Idempotente: no duplica si ya existen etiqueta/ruta.
-- Permisos: mismos perfiles que ya tienen "Inventarios".
-- =====================================================

-- 1) Padre: Almacenes (mismo patrón que Inventarios)
INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  ms.id_seccion,
  NULL,
  'Almacenes',
  'bi bi-building',
  NULL,
  false,
  40,
  true
FROM menu_seccion ms
WHERE ms.nombre = 'Producto|Servicio'
  AND NOT EXISTS (
    SELECT 1 FROM menu_item mi
    WHERE mi.id_seccion = ms.id_seccion
      AND mi.etiqueta = 'Almacenes'
      AND mi.parent_id IS NULL
  )
LIMIT 1;

-- 2) Hijos (orden 1..6)
-- Nota de seguridad: no se reordenan hijos ya insertados (031–035).
-- "Stock actual" usa el siguiente orden libre (6) para evitar UPDATE
-- sobre filas existentes y colisiones de orden en BD ya aplicadas.
INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000031'::uuid,
  padre.id_seccion,
  padre.id_item,
  'Nuevo almacén',
  'bi bi-plus-circle',
  '/items/almacenes/nuevo',
  true,
  1,
  true
FROM menu_item padre
JOIN menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE ms.nombre = 'Producto|Servicio'
  AND padre.etiqueta = 'Almacenes'
  AND padre.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item h
    WHERE h.parent_id = padre.id_item AND h.ruta = '/items/almacenes/nuevo'
  )
LIMIT 1;

INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000032'::uuid,
  padre.id_seccion,
  padre.id_item,
  'Listado',
  'bi bi-list',
  '/items/almacenes',
  true,
  2,
  true
FROM menu_item padre
JOIN menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE ms.nombre = 'Producto|Servicio'
  AND padre.etiqueta = 'Almacenes'
  AND padre.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item h
    WHERE h.parent_id = padre.id_item AND h.ruta = '/items/almacenes'
  )
LIMIT 1;

INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000033'::uuid,
  padre.id_seccion,
  padre.id_item,
  'Movimientos',
  'bi bi-arrow-left-right',
  '/items/almacenes/movimientos',
  true,
  3,
  true
FROM menu_item padre
JOIN menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE ms.nombre = 'Producto|Servicio'
  AND padre.etiqueta = 'Almacenes'
  AND padre.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item h
    WHERE h.parent_id = padre.id_item AND h.ruta = '/items/almacenes/movimientos'
  )
LIMIT 1;

INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000034'::uuid,
  padre.id_seccion,
  padre.id_item,
  'Cambio masivo de stock',
  'bi bi-sliders',
  '/items/almacenes/cambio-stock',
  true,
  4,
  true
FROM menu_item padre
JOIN menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE ms.nombre = 'Producto|Servicio'
  AND padre.etiqueta = 'Almacenes'
  AND padre.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item h
    WHERE h.parent_id = padre.id_item AND h.ruta = '/items/almacenes/cambio-stock'
  )
LIMIT 1;

INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000035'::uuid,
  padre.id_seccion,
  padre.id_item,
  'Stock por fecha',
  'bi bi-calendar3',
  '/items/almacenes/stock-fecha',
  true,
  5,
  true
FROM menu_item padre
JOIN menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE ms.nombre = 'Producto|Servicio'
  AND padre.etiqueta = 'Almacenes'
  AND padre.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item h
    WHERE h.parent_id = padre.id_item AND h.ruta = '/items/almacenes/stock-fecha'
  )
LIMIT 1;

INSERT INTO menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000036'::uuid,
  padre.id_seccion,
  padre.id_item,
  'Stock actual',
  'bi bi-box-seam',
  '/items/almacenes/stock-actual',
  true,
  6,
  true
FROM menu_item padre
JOIN menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE ms.nombre = 'Producto|Servicio'
  AND padre.etiqueta = 'Almacenes'
  AND padre.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item h
    WHERE h.parent_id = padre.id_item AND h.ruta = '/items/almacenes/stock-actual'
  )
LIMIT 1;

-- 3) Permisos: mismos perfiles que ya ven Inventarios (padre)
INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT DISTINCT pmp.id_perfil, mi.id_item, true
FROM perfil_menu_permiso pmp
JOIN menu_item inv ON inv.id_item = pmp.id_item
JOIN menu_seccion ms_inv ON ms_inv.id_seccion = inv.id_seccion
JOIN menu_item mi ON mi.id_seccion = inv.id_seccion
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms_inv.nombre = 'Producto|Servicio'
  AND inv.etiqueta = 'Inventarios'
  AND inv.parent_id IS NULL
  AND pmp.permitido = true
  AND ms.nombre = 'Producto|Servicio'
  AND (
    (mi.etiqueta = 'Almacenes' AND mi.parent_id IS NULL)
    OR mi.parent_id IN (
      SELECT a.id_item FROM menu_item a
      JOIN menu_seccion s ON s.id_seccion = a.id_seccion
      WHERE s.nombre = 'Producto|Servicio'
        AND a.etiqueta = 'Almacenes'
        AND a.parent_id IS NULL
    )
  )
  AND NOT EXISTS (
    SELECT 1 FROM perfil_menu_permiso x
    WHERE x.id_perfil = pmp.id_perfil AND x.id_item = mi.id_item
  );
