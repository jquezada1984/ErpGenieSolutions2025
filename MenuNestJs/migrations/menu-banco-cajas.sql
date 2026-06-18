-- =====================================================
-- MENÚ BANCO Y CAJAS EN BASE DE DATOS
-- =====================================================
-- Crea la sección "Banco y cajas" e ítems del MVP:
--   - Cuentas (listado, nueva)
--   - Catálogo de bancos
-- Ejecutar UNA SOLA VEZ en pgAdmin / Supabase SQL.
-- Si la sección ya existe con ítems, no volver a ejecutar.
-- Después ejecutar: permisos-banco-cajas-para-perfil.sql
-- =====================================================

-- 1) Sección Banco y cajas (si no existe)
INSERT INTO menu_seccion (id_seccion, nombre, orden, icono, estado)
SELECT gen_random_uuid(), 'Banco y cajas', 6, 'fas fa-university', true
WHERE NOT EXISTS (SELECT 1 FROM menu_seccion WHERE nombre = 'Banco y cajas');

-- 2) Ítem raíz: Cuentas (agrupador, sin ruta)
INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Cuentas', 'fas fa-wallet', NULL, false, 1, true
FROM menu_seccion ms
WHERE ms.nombre = 'Banco y cajas'
  AND NOT EXISTS (
    SELECT 1 FROM menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.etiqueta = 'Cuentas' AND mi.parent_id IS NULL
  )
LIMIT 1;

-- 3) Ítem raíz: Bancos (enlace directo al catálogo)
INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Bancos', 'fas fa-landmark', '/banco-cajas/bancos', true, 2, true
FROM menu_seccion ms
WHERE ms.nombre = 'Banco y cajas'
  AND NOT EXISTS (
    SELECT 1 FROM menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.etiqueta = 'Bancos' AND mi.parent_id IS NULL
  )
LIMIT 1;

-- 4) Submenús de Cuentas
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Listado de cuentas', 'fas fa-list', '/banco-cajas/cuentas', true, 1, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Banco y cajas' AND mi.etiqueta = 'Cuentas' AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/banco-cajas/cuentas'
  )
LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Nueva cuenta', 'fas fa-plus', '/banco-cajas/cuentas/nuevo', true, 2, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Banco y cajas' AND mi.etiqueta = 'Cuentas' AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/banco-cajas/cuentas/nuevo'
  )
LIMIT 1;
