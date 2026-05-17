-- Ítem de menú: Diccionarios bajo sección Financiero
-- Sección Financiero: f47ac10b-58cc-4372-a567-0e02b2c3d479

INSERT INTO public.menu_item (
  id_item,
  id_seccion,
  parent_id,
  etiqueta,
  icono,
  ruta,
  es_clickable,
  orden,
  estado
)
SELECT
  'a1d2c3e4-f5a6-4789-b012-d1cc10a10000'::uuid,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  NULL,
  'Diccionarios',
  'bi bi-book',
  '/financiero/configuracion/diccionarios',
  true,
  50,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item WHERE ruta = '/financiero/configuracion/diccionarios'
);

-- Permisos perfil admin (inserta o actualiza si ya existía)
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.ruta = '/financiero/configuracion/diccionarios'
  AND (
    LOWER(TRIM(p.nombre)) = 'admin'
    OR LOWER(p.nombre) LIKE '%admin%'
  )
ON CONFLICT (id_perfil, id_item) DO UPDATE
  SET permitido = EXCLUDED.permitido;
