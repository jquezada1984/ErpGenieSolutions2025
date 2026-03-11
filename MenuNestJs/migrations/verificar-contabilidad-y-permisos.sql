-- =====================================================
-- VERIFICACIÓN: Menú Contabilidad y permisos
-- =====================================================
-- Ejecutar en pgAdmin para comprobar que existen la sección,
-- los ítems y los permisos. Si algo falla, ver mensajes abajo.
-- =====================================================

-- 1) Sección Contabilidad
SELECT id_seccion, nombre, orden, estado 
FROM menu_seccion 
WHERE nombre = 'Contabilidad';
-- Debe devolver 1 fila con estado = true.

-- 2) Ítems de Contabilidad (al menos los principales)
SELECT mi.id_item, mi.etiqueta, mi.parent_id, mi.orden, mi.estado
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Contabilidad'
ORDER BY mi.orden
LIMIT 20;
-- Debe haber filas. Si no hay, ejecutar menu_contabilidad.sql o similar.

-- 3) Perfiles existentes
SELECT id_perfil, nombre, estado FROM perfil;
-- Anota el id_perfil del rol que usas.

-- 4) Permisos de Contabilidad para cada perfil
SELECT p.nombre AS perfil, COUNT(pmp.id_item) AS permisos_contabilidad
FROM perfil p
LEFT JOIN perfil_menu_permiso pmp ON pmp.id_perfil = p.id_perfil
LEFT JOIN menu_item mi ON mi.id_item = pmp.id_item
LEFT JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion AND ms.nombre = 'Contabilidad'
WHERE p.estado = true
GROUP BY p.id_perfil, p.nombre;
-- permisos_contabilidad debe ser > 0 para el perfil que usas.
-- Si es 0, ejecutar: permisos-contabilidad-para-perfil.sql
