-- =====================================================
-- PERMISOS DE MENÚ CONTABILIDAD PARA EL PERFIL
-- =====================================================
-- Inserta en perfil_menu_permiso los ítems de la sección
-- "Contabilidad" para que el menú Contabilidad esté activo.
-- Ejecutar en la base de datos que usa la app (pgAdmin).
-- =====================================================

-- Insertar permisos: un registro por cada ítem de menú de Contabilidad
-- para cada perfil existente (típicamente el único rol).
-- Si la tabla tiene clave primaria (id_perfil, id_item), ON CONFLICT actualiza.
INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, mi.id_item, true
FROM perfil p
CROSS JOIN menu_item mi
INNER JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Contabilidad'
  AND mi.estado = true
  AND ms.estado = true
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = true;

-- Si falla con "no unique constraint", usar solo INSERT ignorando duplicados:
-- INSERT INTO perfil_menu_permiso (id_perfil, id_item, permitido)
-- SELECT p.id_perfil, mi.id_item, true
-- FROM perfil p
-- CROSS JOIN menu_item mi
-- INNER JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
-- WHERE ms.nombre = 'Contabilidad' AND mi.estado = true AND ms.estado = true
--   AND NOT EXISTS (
--     SELECT 1 FROM perfil_menu_permiso pmp
--     WHERE pmp.id_perfil = p.id_perfil AND pmp.id_item = mi.id_item
--   );

-- Ver cuántos permisos se asignaron (opcional):
-- SELECT COUNT(*) FROM perfil_menu_permiso pmp
-- JOIN menu_item mi ON mi.id_item = pmp.id_item
-- JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
-- WHERE ms.nombre = 'Contabilidad' AND pmp.permitido = true;
