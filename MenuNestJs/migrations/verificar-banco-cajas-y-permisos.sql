-- =====================================================
-- VERIFICACIÓN: Menú Banco y cajas y permisos
-- =====================================================

-- 1) Sección
SELECT id_seccion, nombre, orden, icono, estado
FROM menu_seccion
WHERE nombre = 'Banco y cajas';

-- 2) Ítems de la sección
SELECT mi.etiqueta, mi.ruta, mi.orden, mi.estado,
       padre.etiqueta AS padre
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
LEFT JOIN menu_item padre ON padre.id_item = mi.parent_id
WHERE ms.nombre = 'Banco y cajas'
ORDER BY mi.parent_id NULLS FIRST, mi.orden;

-- 3) Permisos por perfil
SELECT p.nombre AS perfil, COUNT(pmp.id_item) AS permisos_banco_cajas
FROM perfil p
LEFT JOIN perfil_menu_permiso pmp ON pmp.id_perfil = p.id_perfil AND pmp.permitido = true
LEFT JOIN menu_item mi ON mi.id_item = pmp.id_item
LEFT JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion AND ms.nombre = 'Banco y cajas'
GROUP BY p.id_perfil, p.nombre;

-- Si permisos_banco_cajas = 0, ejecutar permisos-banco-cajas-para-perfil.sql
