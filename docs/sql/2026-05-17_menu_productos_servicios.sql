-- Menú: sección "Productos | Servicios" (módulo items)
-- Reutiliza la sección vacía "Servicios" del seed (065855e9-6c56-427d-bb22-793718cc304e).
--
-- Rutas (prefijo obligatorio items/):
--   /items/productos
--   /items/productos/nuevo
--   /items/productos/editar/:id
--   /items/servicios
--   /items/servicios/nuevo
--   /items/servicios/editar/:id
--
-- Tras ejecutar: cerrar sesión y volver a entrar para refrescar permisos del menú.

-- 1) Renombrar sección y icono (estilo captura: cubo / módulo ítems)
UPDATE public.menu_seccion
SET
  nombre = 'Productos | Servicios',
  icono = 'bi bi-box-seam',
  orden = 3,
  estado = true
WHERE id_seccion = '065855e9-6c56-427d-bb22-793718cc304e'::uuid;

-- Si la sección no existe (BD sin seed), créala:
INSERT INTO public.menu_seccion (id_seccion, nombre, orden, icono, estado)
SELECT
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'Productos | Servicios',
  3,
  'bi bi-box-seam',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_seccion WHERE id_seccion = '065855e9-6c56-427d-bb22-793718cc304e'::uuid
);

-- 2) Ítems de menú (padre + hijos)
-- Padre: Productos
INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000001'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  NULL,
  'Productos',
  'bi bi-box',
  NULL,
  false,
  10,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000001'::uuid
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000002'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000001'::uuid,
  'Listado',
  'bi bi-list',
  '/items/productos',
  true,
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/items/productos'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000003'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000001'::uuid,
  'Nuevo producto',
  'bi bi-plus-circle',
  '/items/productos/nuevo',
  true,
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/items/productos/nuevo'
);

-- Padre: Servicios
INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000010'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  NULL,
  'Servicios',
  'bi bi-briefcase',
  NULL,
  false,
  20,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000010'::uuid
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000011'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000010'::uuid,
  'Listado',
  'bi bi-list',
  '/items/servicios',
  true,
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/items/servicios'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000012'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000010'::uuid,
  'Nuevo servicio',
  'bi bi-plus-circle',
  '/items/servicios/nuevo',
  true,
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/items/servicios/nuevo'
);

-- 3) Permisos perfil admin: toda la sección Productos | Servicios
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.id_seccion = '065855e9-6c56-427d-bb22-793718cc304e'::uuid
  AND i.estado = true
  AND (
    LOWER(TRIM(p.nombre)) = 'admin'
    OR LOWER(p.nombre) LIKE '%admin%'
  )
ON CONFLICT (id_perfil, id_item) DO UPDATE
  SET permitido = EXCLUDED.permitido;
