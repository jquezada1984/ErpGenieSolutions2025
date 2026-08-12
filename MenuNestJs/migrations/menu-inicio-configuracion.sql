-- =====================================================
-- MENÚ CONFIGURACIÓN BAJO SECCIÓN INICIO
-- =====================================================
-- Crea el agrupador "Configuración" y submenús:
--   Diccionarios, Paneles, Alertas, Seguridad, E-Mails
-- Ejecutar UNA SOLA VEZ en pgAdmin / Supabase SQL.
-- Después: permisos-inicio-configuracion-para-perfil.sql
-- =====================================================

-- 1) Agrupador Configuración (padre, sin ruta)
INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Configuración', 'bi bi-gear', NULL, false, 90, true
FROM menu_seccion ms
WHERE ms.nombre = 'Inicio'
  AND NOT EXISTS (
    SELECT 1 FROM menu_item mi
    WHERE mi.id_seccion = ms.id_seccion
      AND mi.etiqueta = 'Configuración'
      AND mi.parent_id IS NULL
  )
LIMIT 1;

-- 2) Diccionarios
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Diccionarios', 'bi bi-book', '/configuracion/diccionarios', true, 1, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/configuracion/diccionarios'
  )
LIMIT 1;

-- 3) Paneles
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Paneles', 'bi bi-grid-3x3-gap', '/configuracion/paneles', true, 2, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/configuracion/paneles'
  )
LIMIT 1;

-- 4) Alertas
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Alertas', 'bi bi-exclamation-triangle', '/configuracion/alertas', true, 3, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/configuracion/alertas'
  )
LIMIT 1;

-- 5) Seguridad
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Seguridad', 'bi bi-shield-lock', '/configuracion/seguridad', true, 4, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/configuracion/seguridad'
  )
LIMIT 1;

-- 6) E-Mails
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'E-Mails', 'bi bi-envelope', '/configuracion/emails', true, 5, true
FROM menu_item mi
JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Inicio'
  AND mi.etiqueta = 'Configuración'
  AND mi.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item hijo
    WHERE hijo.parent_id = mi.id_item AND hijo.ruta = '/configuracion/emails'
  )
LIMIT 1;
