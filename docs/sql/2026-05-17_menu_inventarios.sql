-- Menú: Inventarios (conteo físico) bajo sección Productos | Servicios
-- Sección: 065855e9-6c56-427d-bb22-793718cc304e
--
-- Rutas:
--   /items/inventarios
--   /items/inventarios/nuevo
--   /items/inventarios/editar/:id

-- Padre: Inventarios
INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000020'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  NULL,
  'Inventarios',
  'bi bi-clipboard-check',
  NULL,
  false,
  30,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000020'::uuid
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000021'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000020'::uuid,
  'Listado',
  'bi bi-list',
  '/items/inventarios',
  true,
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/items/inventarios'
);

INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000022'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000020'::uuid,
  'Nuevo inventario',
  'bi bi-plus-circle',
  '/items/inventarios/nuevo',
  true,
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/items/inventarios/nuevo'
);

-- Permisos perfil admin
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.id_seccion = '065855e9-6c56-427d-bb22-793718cc304e'::uuid
  AND (
    i.id_item IN (
      'b1c2d3e4-f5a6-4789-a012-697465000020'::uuid,
      'b1c2d3e4-f5a6-4789-a012-697465000021'::uuid,
      'b1c2d3e4-f5a6-4789-a012-697465000022'::uuid
    )
    OR i.ruta LIKE '/items/inventarios%'
  )
  AND i.estado = true
  AND (
    LOWER(TRIM(p.nombre)) = 'admin'
    OR LOWER(p.nombre) LIKE '%admin%'
  )
ON CONFLICT (id_perfil, id_item) DO UPDATE
  SET permitido = EXCLUDED.permitido;
