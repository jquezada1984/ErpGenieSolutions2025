-- =====================================================
-- SENTENCIAS SQL PARA AGREGAR MÓDULOS FINANCIERO Y CONTABILIDAD
-- =====================================================
-- Este script crea las secciones de menú y todos los items
-- para los módulos Financiero y Contabilidad
-- =====================================================

-- =====================================================
-- MÓDULO FINANCIERO
-- =====================================================

-- Crear la sección de Financiero
INSERT INTO menu_seccion (id_seccion, nombre, icono, orden, estado)
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
    'a1b2c3d4-e5f6-4789-a012-345678901234',
    'Facturas a clientes',
    NULL,
    'bi bi-file-earmark-text',
    1,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    false,
    NULL,
    NOW(),
    NULL,
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 2. Facturas proveedor (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'b2c3d4e5-f6a7-4890-b123-456789012345',
    'Facturas proveedor',
    NULL,
    'bi bi-file-earmark-text',
    2,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    false,
    NULL,
    NOW(),
    NULL,
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 3. Pedidos facturables (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'c3d4e5f6-a7b8-4901-c234-567890123456',
    'Pedidos facturables',
    '/financiero/pedidos-facturables',
    'bi bi-file-earmark-text',
    3,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    true,
    NULL,
    NOW(),
    NULL,
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
    'd4e5f6a7-b8c9-4012-d345-678901234567',
    'Donaciones',
    '/financiero/donaciones',
    'bi bi-file-earmark-text',
    4,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    true,
    NULL,
    NOW(),
    NULL,
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
    'e5f6a7b8-c9d0-4123-e456-789012345678',
    'Impuestos | Gastos especi...',
    NULL,
    'bi bi-file-earmark-text',
    5,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    false,
    NULL,
    NOW(),
    NULL,
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 6. Salarios (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'f6a7b8c9-d0e1-4234-f567-890123456789',
    'Salarios',
    NULL,
    'bi bi-wallet2',
    6,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    false,
    NULL,
    NOW(),
    NULL,
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 7. Préstamos (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'a7b8c9d0-e1f2-4345-a678-901234567890',
    'Préstamos',
    NULL,
    'bi bi-banknote',
    7,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    false,
    NULL,
    NOW(),
    NULL,
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 8. Pagos varios (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'b8c9d0e1-f2a3-4456-b789-012345678901',
    'Pagos varios',
    NULL,
    'bi bi-file-earmark-text',
    8,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    false,
    NULL,
    NOW(),
    NULL,
    NOW()
) ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- 9. Márgenes (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'c9d0e1f2-a3b4-4567-c890-123456789012',
    'Márgenes',
    '/financiero/margenes',
    'bi bi-calculator',
    9,
    true,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NULL,
    true,
    NULL,
    NOW(),
    NULL,
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
    ('1a2b3c4d-5e6f-4789-a012-345678901234', 'Nueva factura', '/financiero/facturas-clientes/nueva', 'bi bi-plus-circle', 1, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'a1b2c3d4-e5f6-4789-a012-345678901234', true, NULL, NOW(), NULL, NOW()),
    ('2b3c4d5e-6f7a-4890-b123-456789012345', 'Listado', '/financiero/facturas-clientes/listado', 'bi bi-list-ul', 2, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'a1b2c3d4-e5f6-4789-a012-345678901234', true, NULL, NOW(), NULL, NOW()),
    ('3c4d5e6f-7a8b-4901-c234-567890123456', 'Listado de plantillas', '/financiero/facturas-clientes/plantillas', 'bi bi-file-earmark-text', 3, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'a1b2c3d4-e5f6-4789-a012-345678901234', true, NULL, NOW(), NULL, NOW()),
    ('4d5e6f7a-8b9c-4012-d345-678901234567', 'Pagos', '/financiero/facturas-clientes/pagos', 'bi bi-credit-card', 4, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'a1b2c3d4-e5f6-4789-a012-345678901234', true, NULL, NOW(), NULL, NOW()),
    ('5e6f7a8b-9c0d-4123-e456-789012345678', 'Estadísticas', '/financiero/facturas-clientes/estadisticas', 'bi bi-graph-up', 5, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'a1b2c3d4-e5f6-4789-a012-345678901234', true, NULL, NOW(), NULL, NOW())
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
    ('6f7a8b9c-0d1e-4234-f567-890123456789', 'Nueva factura', '/financiero/facturas-proveedor/nueva', 'bi bi-plus-circle', 1, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b2c3d4e5-f6a7-4890-b123-456789012345', true, NULL, NOW(), NULL, NOW()),
    ('7a8b9c0d-1e2f-4345-a678-901234567890', 'Listado', '/financiero/facturas-proveedor/listado', 'bi bi-list-ul', 2, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b2c3d4e5-f6a7-4890-b123-456789012345', true, NULL, NOW(), NULL, NOW()),
    ('8b9c0d1e-2f3a-4456-b789-012345678901', 'Listado de plantillas', '/financiero/facturas-proveedor/plantillas', 'bi bi-file-earmark-text', 3, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b2c3d4e5-f6a7-4890-b123-456789012345', true, NULL, NOW(), NULL, NOW()),
    ('9c0d1e2f-3a4b-4567-c890-123456789012', 'Pagos', '/financiero/facturas-proveedor/pagos', 'bi bi-credit-card', 4, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b2c3d4e5-f6a7-4890-b123-456789012345', true, NULL, NOW(), NULL, NOW()),
    ('0d1e2f3a-4b5c-4678-d901-234567890123', 'Estadísticas', '/financiero/facturas-proveedor/estadisticas', 'bi bi-graph-up', 5, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b2c3d4e5-f6a7-4890-b123-456789012345', true, NULL, NOW(), NULL, NOW())
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
    ('1e2f3a4b-5c6d-4789-e012-345678901234', 'Impuestos sociales/fiscales', '/financiero/impuestos/sociales-fiscales', 'bi bi-file-earmark-text', 1, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'e5f6a7b8-c9d0-4123-e456-789012345678', true, NULL, NOW(), NULL, NOW()),
    ('2f3a4b5c-6d7e-4890-f123-456789012345', 'IGST', '/financiero/impuestos/igst', 'bi bi-file-earmark-text', 2, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'e5f6a7b8-c9d0-4123-e456-789012345678', true, NULL, NOW(), NULL, NOW()),
    ('3a4b5c6d-7e8f-4901-a234-567890123456', 'CGST', '/financiero/impuestos/cgst', 'bi bi-file-earmark-text', 3, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'e5f6a7b8-c9d0-4123-e456-789012345678', true, NULL, NOW(), NULL, NOW()),
    ('4b5c6d7e-8f9a-4012-b345-678901234567', 'SGST', '/financiero/impuestos/sgst', 'bi bi-file-earmark-text', 4, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'e5f6a7b8-c9d0-4123-e456-789012345678', true, NULL, NOW(), NULL, NOW())
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
    ('5c6d7e8f-9a0b-4123-c456-789012345678', 'Nuevo', '/financiero/salarios/nuevo', 'bi bi-plus-circle', 1, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f6a7b8c9-d0e1-4234-f567-890123456789', true, NULL, NOW(), NULL, NOW()),
    ('6d7e8f9a-0b1c-4234-d567-890123456789', 'Listado', '/financiero/salarios/listado', 'bi bi-list-ul', 2, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f6a7b8c9-d0e1-4234-f567-890123456789', true, NULL, NOW(), NULL, NOW()),
    ('7e8f9a0b-1c2d-4345-e678-901234567890', 'Pagos', '/financiero/salarios/pagos', 'bi bi-credit-card', 3, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f6a7b8c9-d0e1-4234-f567-890123456789', true, NULL, NOW(), NULL, NOW()),
    ('8f9a0b1c-2d3e-4456-f789-012345678901', 'Estadísticas', '/financiero/salarios/estadisticas', 'bi bi-graph-up', 4, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f6a7b8c9-d0e1-4234-f567-890123456789', true, NULL, NOW(), NULL, NOW())
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
    ('9a0b1c2d-3e4f-4567-a890-123456789012', 'Nuevo Préstamo', '/financiero/prestamos/nuevo', 'bi bi-plus-circle', 1, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'a7b8c9d0-e1f2-4345-a678-901234567890', true, NULL, NOW(), NULL, NOW())
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
    ('0b1c2d3e-4f5a-4678-b901-234567890123', 'Nuevo', '/financiero/pagos-varios/nuevo', 'bi bi-plus-circle', 1, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b8c9d0e1-f2a3-4456-b789-012345678901', true, NULL, NOW(), NULL, NOW()),
    ('1c2d3e4f-5a6b-4789-c012-345678901234', 'Listado', '/financiero/pagos-varios/listado', 'bi bi-list-ul', 2, true, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b8c9d0e1-f2a3-4456-b789-012345678901', true, NULL, NOW(), NULL, NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- =====================================================
-- MÓDULO CONTABILIDAD
-- =====================================================

-- Insertar la sección de Contabilidad
INSERT INTO public.menu_seccion (id_seccion, nombre, orden, icono, estado) 
VALUES (
    gen_random_uuid(),
    'Contabilidad',
    7, -- Orden después de Financiera
    'fas fa-calculator',
    true
) ON CONFLICT (nombre) DO UPDATE SET
    orden = EXCLUDED.orden,
    icono = EXCLUDED.icono,
    estado = EXCLUDED.estado;

-- Insertar los items principales del menú de Contabilidad
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    ms.id_seccion,
    'Configuración',
    'fas fa-cog',
    '/contabilidad/configuracion',
    false, -- No es clickable, tiene submenús
    1,
    true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Contabilidad'
ON CONFLICT DO NOTHING;

-- Insertar Transferencia en contabilidad
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    ms.id_seccion,
    'Transferencia en contabilidad',
    'fas fa-exchange-alt',
    '/contabilidad/transferencia',
    false, -- No es clickable, tiene submenús
    2,
    true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Contabilidad'
ON CONFLICT DO NOTHING;

-- Insertar Contabilidad
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    ms.id_seccion,
    'Contabilidad',
    'fas fa-book',
    '/contabilidad',
    false, -- No es clickable, tiene submenús
    3,
    true
FROM public.menu_seccion ms
WHERE ms.nombre = 'Contabilidad'
ON CONFLICT DO NOTHING;

-- =====================================================
-- SUBMENÚS DE CONFIGURACIÓN
-- =====================================================

-- Insertar submenús de Configuración
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'General',
    'fas fa-sliders-h',
    '/contabilidad/configuracion/general',
    true,
    1,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Diarios contables',
    'fas fa-journal-whills',
    '/contabilidad/configuracion/diarios',
    true,
    2,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Modelos de planes contables',
    'fas fa-layer-group',
    '/contabilidad/configuracion/modelos-planes',
    true,
    3,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Plan contable',
    'fas fa-sitemap',
    '/contabilidad/configuracion/plan-contable',
    true,
    4,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Plan de cuentas individuales',
    'fas fa-list-alt',
    '/contabilidad/configuracion/cuentas-individuales',
    true,
    5,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Periodo contable',
    'fas fa-calendar-alt',
    '/contabilidad/configuracion/periodo',
    true,
    6,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cuentas contables por defecto',
    'fas fa-cogs',
    '/contabilidad/configuracion/cuentas-defecto',
    true,
    7,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cuentas Bancarias',
    'fas fa-university',
    '/contabilidad/configuracion/cuentas-bancarias',
    true,
    8,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cuentas de IVA',
    'fas fa-percentage',
    '/contabilidad/configuracion/cuentas-iva',
    true,
    9,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cuentas de impuestos',
    'fas fa-receipt',
    '/contabilidad/configuracion/cuentas-impuestos',
    true,
    10,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cuentas contables de productos',
    'fas fa-box',
    '/contabilidad/configuracion/cuentas-productos',
    true,
    11,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cerrar cuentas',
    'fas fa-lock',
    '/contabilidad/configuracion/cerrar-cuentas',
    true,
    12,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Grupo personalizado de cuentas',
    'fas fa-layer-group',
    '/contabilidad/configuracion/grupos-personalizados',
    true,
    13,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Configuración'
ON CONFLICT DO NOTHING;

-- =====================================================
-- SUBMENÚS DE TRANSFERENCIA EN CONTABILIDAD
-- =====================================================

-- Insertar submenús de Transferencia
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Contabilizar facturas a clientes',
    'fas fa-file-invoice',
    '/contabilidad/transferencia/facturas-clientes',
    true,
    1,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Transferencia en contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Contabilizar facturas de proveedores',
    'fas fa-file-invoice-dollar',
    '/contabilidad/transferencia/facturas-proveedores',
    true,
    2,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Transferencia en contabilidad'
ON CONFLICT DO NOTHING;

-- Insertar Registro en contabilidad (con submenús)
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Registro en contabilidad',
    'fas fa-book-open',
    '/contabilidad/transferencia/registro',
    false, -- No es clickable, tiene submenús
    3,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Transferencia en contabilidad'
ON CONFLICT DO NOTHING;

-- Insertar submenús de Registro en contabilidad
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Ventas (Diario de ventas - vent...)',
    'fas fa-shopping-cart',
    '/contabilidad/transferencia/registro/ventas',
    true,
    1,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Registro en contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Compras (Diario de compras - ...)',
    'fas fa-shopping-bag',
    '/contabilidad/transferencia/registro/compras',
    true,
    2,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Registro en contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Banco (Diario financiero)',
    'fas fa-university',
    '/contabilidad/transferencia/registro/banco',
    true,
    3,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Registro en contabilidad'
ON CONFLICT DO NOTHING;

-- Insertar Exportar documentos de origen
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Exportar documentos de origen',
    'fas fa-download',
    '/contabilidad/transferencia/exportar-documentos',
    true,
    4,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Transferencia en contabilidad'
ON CONFLICT DO NOTHING;

-- =====================================================
-- SUBMENÚS DE CONTABILIDAD
-- =====================================================

-- Insertar submenús de Contabilidad
INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Libro Mayor',
    'fas fa-book',
    '/contabilidad/libro-mayor',
    true,
    1,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Diarios',
    'fas fa-journal-whills',
    '/contabilidad/diarios',
    true,
    2,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Saldo de la cuenta',
    'fas fa-balance-scale',
    '/contabilidad/saldo-cuenta',
    true,
    3,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Exportar contabilidad',
    'fas fa-file-export',
    '/contabilidad/exportar',
    true,
    4,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Cerrar',
    'fas fa-lock',
    '/contabilidad/cerrar',
    true,
    5,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Contabilidad'
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_item (
    id_item, 
    id_seccion, 
    parent_id,
    etiqueta, 
    icono, 
    ruta, 
    es_clickable, 
    orden, 
    estado
)
SELECT 
    gen_random_uuid(),
    mi.id_seccion,
    mi.id_item,
    'Informes',
    'fas fa-chart-bar',
    '/contabilidad/informes',
    true,
    6,
    true
FROM public.menu_item mi
JOIN public.menu_seccion ms ON mi.id_seccion = ms.id_seccion
WHERE ms.nombre = 'Contabilidad' AND mi.etiqueta = 'Contabilidad'
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
