-- =====================================================
-- MENÚ TERCEROS EN BASE DE DATOS
-- =====================================================
-- Crea la sección Terceros y sus ítems (igual que el menú
-- estático del front: Dashboard, Tercero, Cliente, etc.).
-- Ejecutar UNA SOLA VEZ en pgAdmin. Si "Terceros" ya existe
-- y tiene ítems, no volver a ejecutar (se duplicarían ítems).
-- Después ejecutar: permisos-terceros-para-perfil.sql
-- =====================================================

-- 1) Sección Terceros (si no existe)
INSERT INTO menu_seccion (id_seccion, nombre, orden, icono, estado)
SELECT gen_random_uuid(), 'Terceros', 2, 'fas fa-building', true
WHERE NOT EXISTS (SELECT 1 FROM menu_seccion WHERE nombre = 'Terceros');

-- 2) Ítems raíz (parent_id NULL) de Terceros
INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Dashboard', 'fas fa-home', '/dashboard', true, 1, true
FROM menu_seccion ms WHERE ms.nombre = 'Terceros' LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Tercero', 'fas fa-user-tie', NULL, false, 2, true
FROM menu_seccion ms WHERE ms.nombre = 'Terceros' LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Cliente', 'fas fa-user-tie', NULL, false, 3, true
FROM menu_seccion ms WHERE ms.nombre = 'Terceros' LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Cliente Potencial', 'fas fa-user-tie', NULL, false, 4, true
FROM menu_seccion ms WHERE ms.nombre = 'Terceros' LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), ms.id_seccion, 'Contacto/Direccion', 'fas fa-address-book', NULL, false, 5, true
FROM menu_seccion ms WHERE ms.nombre = 'Terceros' LIMIT 1;

-- 3) Submenús de Tercero
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Nuevo tercero', 'fas fa-user-plus', '/terceros/nuevo', true, 1, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Tercero' AND mi.parent_id IS NULL LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Listado tercero', 'fas fa-list', '/terceros', true, 2, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Tercero' AND mi.parent_id IS NULL LIMIT 1;

-- 4) Submenús de Cliente
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Nuevo cliente', 'fas fa-user-plus', '/clientes/nuevo', true, 1, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Cliente' AND mi.parent_id IS NULL LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Listado cliente', 'fas fa-list', '/clientes', true, 2, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Cliente' AND mi.parent_id IS NULL LIMIT 1;

-- 5) Submenús de Cliente Potencial
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Nuevo cliente potencial', 'fas fa-user-plus', '/clientes_potenciales/nuevo', true, 1, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Cliente Potencial' AND mi.parent_id IS NULL LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Listado cliente potencial', 'fas fa-list', '/clientes_potenciales/lista', true, 2, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Cliente Potencial' AND mi.parent_id IS NULL LIMIT 1;

-- 6) Submenús de Contacto/Direccion
INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Nuevo contacto/dirección', 'fas fa-user-plus', '/contactos_direcciones/nuevo', true, 1, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Contacto/Direccion' AND mi.parent_id IS NULL LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Listado contacto/dirección', 'fas fa-list', '/contactos_direcciones/lista', true, 2, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Contacto/Direccion' AND mi.parent_id IS NULL LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Proveedores', 'fas fa-list', '/contactos_direcciones/proveedores', true, 3, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Contacto/Direccion' AND mi.parent_id IS NULL LIMIT 1;

INSERT INTO menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado)
SELECT gen_random_uuid(), mi.id_seccion, mi.id_item, 'Otro', 'fas fa-list', '/contactos_direcciones/otro', true, 4, true
FROM menu_item mi JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
WHERE ms.nombre = 'Terceros' AND mi.etiqueta = 'Contacto/Direccion' AND mi.parent_id IS NULL LIMIT 1;
