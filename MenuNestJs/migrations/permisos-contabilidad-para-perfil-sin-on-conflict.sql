-- =====================================================
-- PERMISOS CONTABILIDAD (sin ON CONFLICT)
-- =====================================================
-- Usar este script si permisos-contabilidad-para-perfil.sql
-- falla con error de "unique constraint" o "ON CONFLICT".
-- =====================================================

INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, mi.id_item, true
FROM perfil p
CROSS JOIN menu_item mi
INNER JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Contabilidad'
  AND mi.estado = true
  AND ms.estado = true
  AND NOT EXISTS (
    SELECT 1 FROM perfil_menu_permiso pmp
    WHERE pmp.id_perfil = p.id_perfil AND pmp.id_item = mi.id_item
  );
