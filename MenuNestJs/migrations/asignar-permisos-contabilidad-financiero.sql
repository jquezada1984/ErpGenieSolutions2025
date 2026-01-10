-- =====================================================
-- ASIGNAR PERMISOS POR DEFECTO PARA CONTABILIDAD Y FINANCIERO
-- =====================================================
-- Este script asigna permisos a todos los perfiles existentes
-- para todos los items de menú de las secciones Contabilidad y Financiero

-- =====================================================
-- PERMISOS PARA SECCIÓN CONTABILIDAD
-- =====================================================

-- Insertar permisos para todos los perfiles en todos los items de Contabilidad
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT 
    p.id_perfil,
    mi.id_item,
    true as permitido
FROM public.perfil p
CROSS JOIN public.menu_item mi
INNER JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad'
  AND mi.estado = true
  AND p.estado = true
ON CONFLICT (id_perfil, id_item) DO UPDATE SET
    permitido = true;

-- =====================================================
-- PERMISOS PARA SECCIÓN FINANCIERO
-- =====================================================

-- Insertar permisos para todos los perfiles en todos los items de Financiero
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT 
    p.id_perfil,
    mi.id_item,
    true as permitido
FROM public.perfil p
CROSS JOIN public.menu_item mi
INNER JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Financiero'
  AND mi.estado = true
  AND p.estado = true
ON CONFLICT (id_perfil, id_item) DO UPDATE SET
    permitido = true;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Mostrar resumen de permisos asignados
SELECT 
    ms.nombre as seccion,
    COUNT(DISTINCT pmp.id_perfil) as perfiles_con_permisos,
    COUNT(DISTINCT pmp.id_item) as items_con_permisos,
    COUNT(*) as total_permisos
FROM public.perfil_menu_permiso pmp
INNER JOIN public.menu_item mi ON pmp.id_item = mi.id_item
INNER JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre IN ('Contabilidad', 'Financiero')
  AND pmp.permitido = true
GROUP BY ms.nombre
ORDER BY ms.nombre;

-- Mostrar detalle de permisos por perfil y sección
SELECT 
    p.nombre as perfil,
    ms.nombre as seccion,
    COUNT(DISTINCT pmp.id_item) as items_permitidos
FROM public.perfil_menu_permiso pmp
INNER JOIN public.perfil p ON pmp.id_perfil = p.id_perfil
INNER JOIN public.menu_item mi ON pmp.id_item = mi.id_item
INNER JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre IN ('Contabilidad', 'Financiero')
  AND pmp.permitido = true
GROUP BY p.nombre, ms.nombre
ORDER BY p.nombre, ms.nombre;

