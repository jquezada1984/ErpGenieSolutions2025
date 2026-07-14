-- =====================================================
-- PERMISOS DE MENÚ BANCO Y CAJAS PARA EL PERFIL
-- =====================================================
-- Inserta en perfil_menu_permiso los ítems de la sección
-- "Banco y cajas" para que aparezca en barra y sidebar.
-- Ejecutar después de menu-banco-cajas.sql
-- =====================================================

INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, mi.id_item, true
FROM perfil p
CROSS JOIN menu_item mi
INNER JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Banco y cajas'
  AND mi.estado = true
  AND ms.estado = true
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = true;
