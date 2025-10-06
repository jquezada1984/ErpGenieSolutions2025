-- Script de ejemplo para poblar la tabla menu_item con datos jerárquicos
-- Este script demuestra cómo crear la estructura del menú ordenado

-- Primero, asegurémonos de que tenemos una sección de administración
INSERT INTO menu_seccion (id_seccion, nombre, icono, orden, estado)
VALUES (
    '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1',
    'Administración',
    'bi bi-gear',
    1,
    true
) ON CONFLICT (id_seccion) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- Limpiar datos existentes para la sección de administración (opcional)
-- DELETE FROM menu_item WHERE id_seccion = '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1';

-- Insertar items principales (sin parent_id) - ORDEN 1
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id)
VALUES 
    ('4269c173-112e-4592-9bf7-3496a68fd84a', 'Empresa', '/empresa', 'bi bi-building', 1, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', NULL),
    ('5269c173-112e-4592-9bf7-3496a68fd84b', 'Sucursal', '/sucursal', 'bi bi-shop', 2, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', NULL),
    ('6269c173-112e-4592-9bf7-3496a68fd84c', 'Menú', '/menu', 'bi bi-list', 3, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', NULL),
    ('7269c173-112e-4592-9bf7-3496a68fd84d', 'Perfil', '/perfil', 'bi bi-person-badge', 4, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', NULL),
    ('8269c173-112e-4592-9bf7-3496a68fd84e', 'Usuario', '/usuario', 'bi bi-people', 5, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', NULL);

-- Insertar submenús para Empresa (parent_id = '4269c173-112e-4592-9bf7-3496a68fd84a')
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id)
VALUES 
    ('a269c173-112e-4592-9bf7-3496a68fd84a', 'Lista de Empresas', '/empresa/lista', 'bi bi-list-ul', 1, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '4269c173-112e-4592-9bf7-3496a68fd84a'),
    ('b269c173-112e-4592-9bf7-3496a68fd84a', 'Nueva Empresa', '/empresa/nueva', 'bi bi-plus-circle', 2, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '4269c173-112e-4592-9bf7-3496a68fd84a'),
    ('c269c173-112e-4592-9bf7-3496a68fd84a', 'Configuración', '/empresa/config', 'bi bi-gear', 3, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '4269c173-112e-4592-9bf7-3496a68fd84a');

-- Insertar submenús para Sucursal (parent_id = '5269c173-112e-4592-9bf7-3496a68fd84b')
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id)
VALUES 
    ('d269c173-112e-4592-9bf7-3496a68fd84a', 'Lista de Sucursales', '/sucursal/lista', 'bi bi-list-ul', 1, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '5269c173-112e-4592-9bf7-3496a68fd84b'),
    ('e269c173-112e-4592-9bf7-3496a68fd84a', 'Nueva Sucursal', '/sucursal/nueva', 'bi bi-plus-circle', 2, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '5269c173-112e-4592-9bf7-3496a68fd84b'),
    ('f269c173-112e-4592-9bf7-3496a68fd84a', 'Mapa de Sucursales', '/sucursal/mapa', 'bi bi-geo-alt', 3, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '5269c173-112e-4592-9bf7-3496a68fd84b');

-- Insertar submenús para Menú (parent_id = '6269c173-112e-4592-9bf7-3496a68fd84c')
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id)
VALUES 
    ('g269c173-112e-4592-9bf7-3496a68fd84a', 'Gestión de Menús', '/menu/gestion', 'bi bi-menu-button-wide', 1, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '6269c173-112e-4592-9bf7-3496a68fd84c'),
    ('h269c173-112e-4592-9bf7-3496a68fd84a', 'Permisos de Menú', '/menu/permisos', 'bi bi-shield-check', 2, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '6269c173-112e-4592-9bf7-3496a68fd84c');

-- Insertar submenús para Perfil (parent_id = '7269c173-112e-4592-9bf7-3496a68fd84d')
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id)
VALUES 
    ('i269c173-112e-4592-9bf7-3496a68fd84a', 'Lista de Perfiles', '/perfil/lista', 'bi bi-list-ul', 1, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '7269c173-112e-4592-9bf7-3496a68fd84d'),
    ('j269c173-112e-4592-9bf7-3496a68fd84a', 'Nuevo Perfil', '/perfil/nuevo', 'bi bi-plus-circle', 2, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '7269c173-112e-4592-9bf7-3496a68fd84d'),
    ('k269c173-112e-4592-9bf7-3496a68fd84a', 'Asignar Permisos', '/perfil/permisos', 'bi bi-key', 3, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '7269c173-112e-4592-9bf7-3496a68fd84d');

-- Insertar submenús para Usuario (parent_id = '8269c173-112e-4592-9bf7-3496a68fd84e')
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id)
VALUES 
    ('l269c173-112e-4592-9bf7-3496a68fd84a', 'Lista de Usuarios', '/usuario/lista', 'bi bi-list-ul', 1, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '8269c173-112e-4592-9bf7-3496a68fd84e'),
    ('m269c173-112e-4592-9bf7-3496a68fd84a', 'Nuevo Usuario', '/usuario/nuevo', 'bi bi-plus-circle', 2, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '8269c173-112e-4592-9bf7-3496a68fd84e'),
    ('n269c173-112e-4592-9bf7-3496a68fd84a', 'Roles de Usuario', '/usuario/roles', 'bi bi-person-badge', 3, true, '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', '8269c173-112e-4592-9bf7-3496a68fd84e');

-- Verificar la estructura creada
SELECT 
    mi.id_item,
    mi.etiqueta,
    mi.ruta,
    mi.icono,
    mi.orden,
    mi.parent_id,
    CASE 
        WHEN mi.parent_id IS NULL THEN 'Item Principal'
        ELSE 'Submenú'
    END as tipo,
    ms.nombre as seccion
FROM menu_item mi
JOIN menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE mi.id_seccion = '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1'
ORDER BY 
    CASE WHEN mi.parent_id IS NULL THEN mi.orden ELSE 999 END,
    mi.parent_id,
    mi.orden;
