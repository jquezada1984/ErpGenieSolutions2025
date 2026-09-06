-- Menú Fase 0: hub Configuración clickable + Empresa/Organización
-- Idempotente.

UPDATE public.menu_item mi
SET ruta = '/configuracion',
    es_clickable = true,
    icono = COALESCE(mi.icono, 'bi bi-gear'),
    updated_at = NOW()
FROM public.menu_seccion ms
WHERE ms.id_seccion = mi.id_seccion
  AND ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL;

-- Empresa / Organización (orden 0, primero)
INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  gen_random_uuid(),
  mi.id_seccion,
  mi.id_item,
  'Empresa / Organización',
  'bi bi-building',
  '/configuracion/empresa',
  true,
  0,
  true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.menu_item hijo
    WHERE hijo.parent_id = mi.id_item
      AND (hijo.ruta = '/configuracion/empresa' OR hijo.etiqueta = 'Empresa / Organización')
  )
LIMIT 1;

-- Reordenar hijos conocidos
UPDATE public.menu_item hijo
SET orden = CASE hijo.ruta
  WHEN '/configuracion/empresa' THEN 0
  WHEN '/configuracion/diccionarios' THEN 1
  WHEN '/configuracion/paneles' THEN 2
  WHEN '/configuracion/alertas' THEN 3
  WHEN '/configuracion/seguridad' THEN 4
  WHEN '/configuracion/emails' THEN 5
  ELSE hijo.orden
END,
updated_at = NOW()
FROM public.menu_item padre
JOIN public.menu_seccion ms ON ms.id_seccion = padre.id_seccion
WHERE padre.id_item = hijo.parent_id
  AND ms.nombre = 'Inicio'
  AND padre.etiqueta = 'Configuración'
  AND padre.parent_id IS NULL
  AND hijo.ruta LIKE '/configuracion/%';

-- Permisos admin para Empresa
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.ruta = '/configuracion/empresa'
  AND (
    LOWER(TRIM(p.nombre)) = 'admin'
    OR LOWER(p.nombre) LIKE '%admin%'
  )
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = EXCLUDED.permitido;

-- También permiso al hub /configuracion (padre)
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, mi.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item mi
JOIN public.menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND (
    LOWER(TRIM(p.nombre)) = 'admin'
    OR LOWER(p.nombre) LIKE '%admin%'
  )
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = EXCLUDED.permitido;
