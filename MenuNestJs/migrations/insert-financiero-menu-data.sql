-- Script para crear el menú del módulo Financiero
-- Basado en las imágenes proporcionadas del sistema ERP

-- Primero, crear la sección de Financiero
INSERT INTO menu_seccion (id_seccion, nombre, icono, orden, estado)
VALUES (
    'financiero-seccion-001',
    'Financiero',
    'bi bi-currency-dollar',
    8,
    true
) ON CONFLICT (id_seccion) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- MENÚS PRINCIPALES DEL MÓDULO FINANCIERO
-- ===========================================

-- 1. Facturas a clientes (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-facturas-clientes-001',
    'Facturas a clientes',
    NULL,
    'bi bi-file-earmark-text',
    1,
    true,
    'financiero-seccion-001',
    NULL,
    false,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 2. Facturas proveedor (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-facturas-proveedor-001',
    'Facturas proveedor',
    NULL,
    'bi bi-file-earmark-text',
    2,
    true,
    'financiero-seccion-001',
    NULL,
    false,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 3. Pedidos facturables (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-pedidos-facturables-001',
    'Pedidos facturables',
    '/financiero/pedidos-facturables',
    'bi bi-file-earmark-text',
    3,
    true,
    'financiero-seccion-001',
    NULL,
    true,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 4. Donaciones (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-donaciones-001',
    'Donaciones',
    '/financiero/donaciones',
    'bi bi-file-earmark-text',
    4,
    true,
    'financiero-seccion-001',
    NULL,
    true,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 5. Impuestos | Gastos especi... (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-impuestos-gastos-001',
    'Impuestos | Gastos especi...',
    NULL,
    'bi bi-file-earmark-text',
    5,
    true,
    'financiero-seccion-001',
    NULL,
    false,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 6. Salarios (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-salarios-001',
    'Salarios',
    NULL,
    'bi bi-wallet2',
    6,
    true,
    'financiero-seccion-001',
    NULL,
    false,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 7. Préstamos (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-prestamos-001',
    'Préstamos',
    NULL,
    'bi bi-banknote',
    7,
    true,
    'financiero-seccion-001',
    NULL,
    false,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 8. Pagos varios (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-pagos-varios-001',
    'Pagos varios',
    NULL,
    'bi bi-file-earmark-text',
    8,
    true,
    'financiero-seccion-001',
    NULL,
    false,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 9. Márgenes (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'fin-margenes-001',
    'Márgenes',
    '/financiero/margenes',
    'bi bi-calculator',
    9,
    true,
    'financiero-seccion-001',
    NULL,
    true,
    'system',
    NOW(),
    'system',
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE FACTURAS A CLIENTES
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('fin-facturas-clientes-nueva', 'Nueva factura', '/financiero/facturas-clientes/nueva', 'bi bi-plus-circle', 1, true, 'financiero-seccion-001', 'fin-facturas-clientes-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-clientes-listado', 'Listado', '/financiero/facturas-clientes/listado', 'bi bi-list-ul', 2, true, 'financiero-seccion-001', 'fin-facturas-clientes-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-clientes-plantillas', 'Listado de plantillas', '/financiero/facturas-clientes/plantillas', 'bi bi-file-earmark-text', 3, true, 'financiero-seccion-001', 'fin-facturas-clientes-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-clientes-pagos', 'Pagos', '/financiero/facturas-clientes/pagos', 'bi bi-credit-card', 4, true, 'financiero-seccion-001', 'fin-facturas-clientes-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-clientes-estadisticas', 'Estadísticas', '/financiero/facturas-clientes/estadisticas', 'bi bi-graph-up', 5, true, 'financiero-seccion-001', 'fin-facturas-clientes-001', true, 'system', NOW(), 'system', NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE FACTURAS PROVEEDOR
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('fin-facturas-proveedor-nueva', 'Nueva factura', '/financiero/facturas-proveedor/nueva', 'bi bi-plus-circle', 1, true, 'financiero-seccion-001', 'fin-facturas-proveedor-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-proveedor-listado', 'Listado', '/financiero/facturas-proveedor/listado', 'bi bi-list-ul', 2, true, 'financiero-seccion-001', 'fin-facturas-proveedor-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-proveedor-plantillas', 'Listado de plantillas', '/financiero/facturas-proveedor/plantillas', 'bi bi-file-earmark-text', 3, true, 'financiero-seccion-001', 'fin-facturas-proveedor-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-proveedor-pagos', 'Pagos', '/financiero/facturas-proveedor/pagos', 'bi bi-credit-card', 4, true, 'financiero-seccion-001', 'fin-facturas-proveedor-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-facturas-proveedor-estadisticas', 'Estadísticas', '/financiero/facturas-proveedor/estadisticas', 'bi bi-graph-up', 5, true, 'financiero-seccion-001', 'fin-facturas-proveedor-001', true, 'system', NOW(), 'system', NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE IMPUESTOS | GASTOS ESPECI...
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('fin-impuestos-sociales-fiscales', 'Impuestos sociales/fiscales', '/financiero/impuestos/sociales-fiscales', 'bi bi-file-earmark-text', 1, true, 'financiero-seccion-001', 'fin-impuestos-gastos-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-impuestos-igst', 'IGST', '/financiero/impuestos/igst', 'bi bi-file-earmark-text', 2, true, 'financiero-seccion-001', 'fin-impuestos-gastos-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-impuestos-cgst', 'CGST', '/financiero/impuestos/cgst', 'bi bi-file-earmark-text', 3, true, 'financiero-seccion-001', 'fin-impuestos-gastos-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-impuestos-sgst', 'SGST', '/financiero/impuestos/sgst', 'bi bi-file-earmark-text', 4, true, 'financiero-seccion-001', 'fin-impuestos-gastos-001', true, 'system', NOW(), 'system', NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE SALARIOS
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('fin-salarios-nuevo', 'Nuevo', '/financiero/salarios/nuevo', 'bi bi-plus-circle', 1, true, 'financiero-seccion-001', 'fin-salarios-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-salarios-listado', 'Listado', '/financiero/salarios/listado', 'bi bi-list-ul', 2, true, 'financiero-seccion-001', 'fin-salarios-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-salarios-pagos', 'Pagos', '/financiero/salarios/pagos', 'bi bi-credit-card', 3, true, 'financiero-seccion-001', 'fin-salarios-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-salarios-estadisticas', 'Estadísticas', '/financiero/salarios/estadisticas', 'bi bi-graph-up', 4, true, 'financiero-seccion-001', 'fin-salarios-001', true, 'system', NOW(), 'system', NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE PRÉSTAMOS
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('fin-prestamos-nuevo', 'Nuevo Préstamo', '/financiero/prestamos/nuevo', 'bi bi-plus-circle', 1, true, 'financiero-seccion-001', 'fin-prestamos-001', true, 'system', NOW(), 'system', NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE PAGOS VARIOS
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('fin-pagos-varios-nuevo', 'Nuevo', '/financiero/pagos-varios/nuevo', 'bi bi-plus-circle', 1, true, 'financiero-seccion-001', 'fin-pagos-varios-001', true, 'system', NOW(), 'system', NOW()),
    ('fin-pagos-varios-listado', 'Listado', '/financiero/pagos-varios/listado', 'bi bi-list-ul', 2, true, 'financiero-seccion-001', 'fin-pagos-varios-001', true, 'system', NOW(), 'system', NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- CONSULTA DE VERIFICACIÓN
-- ===========================================

-- Verificar la estructura creada del menú financiero
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
WHERE mi.id_seccion = 'financiero-seccion-001'
ORDER BY 
    CASE WHEN mi.parent_id IS NULL THEN mi.orden ELSE 999 END,
    mi.parent_id,
    mi.orden;

-- Mostrar solo los items principales
SELECT 
    mi.id_item,
    mi.etiqueta,
    mi.icono,
    mi.orden,
    COUNT(sub.id_item) as cantidad_submenus
FROM menu_item mi
LEFT JOIN menu_item sub ON sub.parent_id = mi.id_item
WHERE mi.id_seccion = 'financiero-seccion-001' 
  AND mi.parent_id IS NULL
GROUP BY mi.id_item, mi.etiqueta, mi.icono, mi.orden
ORDER BY mi.orden;
