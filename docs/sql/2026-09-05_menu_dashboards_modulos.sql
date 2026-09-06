-- Fase 3: ítems Área/Dashboard al inicio de cada sección (idempotente)

-- Terceros
INSERT INTO public.menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, NULL, 'Área', 'bi bi-speedometer2', '/terceros/dashboard', true, 0, true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Terceros'
  AND NOT EXISTS (
    SELECT 1 FROM public.menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.ruta = '/terceros/dashboard'
  )
LIMIT 1;

-- Producto|Servicio
INSERT INTO public.menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, NULL, 'Área', 'bi bi-speedometer2', '/items/dashboard', true, 0, true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Producto|Servicio'
  AND NOT EXISTS (
    SELECT 1 FROM public.menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.ruta = '/items/dashboard'
  )
LIMIT 1;

-- Financiero
INSERT INTO public.menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, NULL, 'Área', 'bi bi-speedometer2', '/financiero/dashboard', true, 0, true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Financiero'
  AND NOT EXISTS (
    SELECT 1 FROM public.menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.ruta = '/financiero/dashboard'
  )
LIMIT 1;

-- Bancos|Cajas
INSERT INTO public.menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, NULL, 'Área', 'bi bi-speedometer2', '/banco-cajas/dashboard', true, 0, true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Bancos|Cajas'
  AND NOT EXISTS (
    SELECT 1 FROM public.menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.ruta = '/banco-cajas/dashboard'
  )
LIMIT 1;

-- Comercial (si existe la sección)
INSERT INTO public.menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, NULL, 'Área', 'bi bi-speedometer2', '/comercial/dashboard', true, 0, true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Comercial'
  AND NOT EXISTS (
    SELECT 1 FROM public.menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.ruta = '/comercial/dashboard'
  )
LIMIT 1;

-- Permisos admin a las nuevas rutas
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.ruta IN (
  '/terceros/dashboard',
  '/items/dashboard',
  '/financiero/dashboard',
  '/banco-cajas/dashboard',
  '/comercial/dashboard'
)
AND (
  LOWER(TRIM(p.nombre)) = 'admin'
  OR LOWER(p.nombre) LIKE '%admin%'
)
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = EXCLUDED.permitido;
