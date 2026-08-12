-- =====================================================
-- PERMISOS MENÚ CONFIGURACIÓN (INICIO) PARA PERFILES
-- =====================================================
-- Inserta en perfil_menu_permiso los ítems del agrupador
-- "Configuración" bajo la sección Inicio.
-- Ejecutar después de menu-inicio-configuracion.sql
-- =====================================================

INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, mi.id_item, true
FROM perfil p
CROSS JOIN menu_item mi
INNER JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND (
    (mi.etiqueta = 'Configuración' AND mi.parent_id IS NULL)
    OR mi.ruta IN (
      '/configuracion/diccionarios',
      '/configuracion/paneles',
      '/configuracion/alertas',
      '/configuracion/seguridad',
      '/configuracion/emails'
    )
  )
  AND mi.estado = true
  AND ms.estado = true
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = true;
