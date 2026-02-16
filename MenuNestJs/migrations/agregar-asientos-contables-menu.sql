-- =====================================================
-- AGREGAR ASIENTOS CONTABLES AL MENÚ
-- =====================================================
-- Este script agrega el item "Asientos Contables" 
-- como submenú de "Contabilidad"
-- =====================================================

-- Insertar Asientos Contables como submenú de "Contabilidad"
-- Busca dinámicamente la sección y el item padre por nombre
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
SELECT 
    gen_random_uuid(),
    'Asientos Contables',
    '/contabilidad/asientos',
    'bi bi-journal-text',
    0, -- Orden 0 para que quede primero
    true,
    ms.id_seccion,
    mi_contabilidad.id_item, -- Item padre "Contabilidad"
    true,
    NULL,
    NOW(),
    NULL,
    NOW()
FROM menu_seccion ms
INNER JOIN menu_item mi_contabilidad ON mi_contabilidad.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad'
  AND mi_contabilidad.etiqueta = 'Contabilidad'
  AND mi_contabilidad.parent_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM menu_item 
    WHERE etiqueta = 'Asientos Contables' 
      AND id_seccion = ms.id_seccion
  );

-- Actualizar el orden de los demás items para que Asientos Contables quede primero
UPDATE menu_item mi
SET orden = mi.orden + 1
FROM menu_seccion ms
INNER JOIN menu_item mi_contabilidad ON mi_contabilidad.id_seccion = ms.id_seccion
WHERE mi.id_seccion = ms.id_seccion
  AND mi.parent_id = mi_contabilidad.id_item
  AND mi.etiqueta != 'Asientos Contables'
  AND ms.nombre = 'Contabilidad'
  AND mi_contabilidad.etiqueta = 'Contabilidad'
  AND mi_contabilidad.parent_id IS NULL;
