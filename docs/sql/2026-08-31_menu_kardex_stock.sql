-- Menú Kardex / Stock / Almacenes (sección Productos | Servicios)
-- Sección: 065855e9-6c56-427d-bb22-793718cc304e
-- Idempotente: no inserta si ya existe id_item o la misma ruta.

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  NULL,
  'Almacenes / Stock',
  'bi bi-box-seam',
  NULL,
  false,
  25,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000031'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Almacenes',
  'bi bi-building',
  '/items/almacenes',
  true, 1, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000031'::uuid
     OR ruta = '/items/almacenes'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000032'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Saldos',
  'bi bi-layers',
  '/items/productos/stocks',
  true, 2, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000032'::uuid
     OR ruta = '/items/productos/stocks'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000033'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Movimientos (Kardex)',
  'bi bi-arrow-left-right',
  '/items/stock/movimientos',
  true, 3, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000033'::uuid
     OR ruta = '/items/stock/movimientos'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000034'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Transferencias',
  'bi bi-truck',
  '/items/stock/transferencias',
  true, 4, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000034'::uuid
     OR ruta = '/items/stock/transferencias'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000035'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Cambio masivo',
  'bi bi-collection',
  '/items/stock/cambio-masivo',
  true, 5, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000035'::uuid
     OR ruta = '/items/stock/cambio-masivo'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000036'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Consultas stock',
  'bi bi-search',
  '/items/stock/consultas',
  true, 6, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000036'::uuid
     OR ruta = '/items/stock/consultas'
);

INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.id_item IN (
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000031'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000032'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000033'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000034'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000035'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000036'::uuid
)
AND (
  LOWER(TRIM(p.nombre)) = 'admin'
  OR LOWER(p.nombre) LIKE '%admin%'
)
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = EXCLUDED.permitido;
