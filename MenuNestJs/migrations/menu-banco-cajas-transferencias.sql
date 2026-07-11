-- =====================================================
-- MENÚ: Transferencias entre cuentas (Banco y cajas)
-- Ejecutar UNA VEZ si ya tiene el menú base de banco-cajas.
-- Después: permisos-banco-cajas-para-perfil.sql (o asignar manualmente).
-- =====================================================

INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Transferencias', 'fas fa-random', '/banco-cajas/transferencias', true, 3, true
FROM menu_seccion ms
WHERE ms.nombre = 'Banco y cajas'
  AND NOT EXISTS (
    SELECT 1 FROM menu_item mi
    WHERE mi.id_seccion = ms.id_seccion AND mi.ruta = '/banco-cajas/transferencias'
  )
LIMIT 1;
