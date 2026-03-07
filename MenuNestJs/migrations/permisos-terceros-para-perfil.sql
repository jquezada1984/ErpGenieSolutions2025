-- =====================================================
-- PERMISOS DE MENÚ TERCEROS PARA EL PERFIL
-- =====================================================
-- Inserta en perfil_menu_permiso los ítems de la sección
-- "Terceros" para que el menú Terceros esté activo y visible
-- en la barra superior y en el sidebar.
-- Ejecutar en la base de datos que usa la app (pgAdmin).
-- =====================================================

INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, mi.id_item, true
FROM perfil p
CROSS JOIN menu_item mi
INNER JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros'
  AND mi.estado = true
  AND ms.estado = true
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = true;

-- Si falla ON CONFLICT, usar: permisos-terceros-para-perfil-sin-on-conflict.sql
