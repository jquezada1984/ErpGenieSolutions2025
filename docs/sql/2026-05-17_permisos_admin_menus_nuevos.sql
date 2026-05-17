-- Permisos de menú: perfil admin → todos los ítems nuevos (Diccionarios + Productos | Servicios)
-- Ejecutar después de:
--   2026-05-17_menu_diccionarios.sql
--   2026-05-17_menu_productos_servicios.sql
--   2026-05-17_menu_inventarios.sql
--
-- Si el permiso ya existía en false, lo deja en true (ON CONFLICT).

INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.estado = true
  AND (
    -- Diccionarios (índice y subpantallas si están en menu_item)
    i.ruta LIKE '/financiero/configuracion/diccionarios%'
    OR i.id_item = 'a1d2c3e4-f5a6-4789-b012-d1cc10a10000'::uuid
    -- Sección Productos | Servicios (todos los ítems de la sección)
    OR i.id_seccion = '065855e9-6c56-427d-bb22-793718cc304e'::uuid
    -- Rutas items (por si id_seccion difiere en otro entorno)
    OR i.ruta LIKE '/items/productos%'
    OR i.ruta LIKE '/items/servicios%'
    OR i.ruta LIKE '/items/inventarios%'
  )
  AND (
    LOWER(TRIM(p.nombre)) = 'admin'
    OR LOWER(p.nombre) LIKE '%admin%'
  )
ON CONFLICT (id_perfil, id_item) DO UPDATE
  SET permitido = EXCLUDED.permitido;

-- Verificación rápida (opcional)
-- SELECT p.nombre, i.etiqueta, i.ruta, pmp.permitido
-- FROM public.perfil_menu_permiso pmp
-- JOIN public.perfil p ON p.id_perfil = pmp.id_perfil
-- JOIN public.menu_item i ON i.id_item = pmp.id_item
-- WHERE LOWER(p.nombre) = 'admin'
--   AND (i.ruta LIKE '/financiero/configuracion/diccionarios%' OR i.ruta LIKE '/items/%')
-- ORDER BY i.ruta;
