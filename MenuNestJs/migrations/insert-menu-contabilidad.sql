-- =====================================================
-- SENTENCIAS SQL PARA AGREGAR MÓDULO CONTABILIDAD
-- =====================================================
-- Este script crea la sección de menú y todos los items
-- para el módulo de Contabilidad
-- =====================================================

-- =====================================================
-- MÓDULO CONTABILIDAD
-- =====================================================

-- Crear la sección de Contabilidad
INSERT INTO menu_seccion (id_seccion, nombre, icono, orden, estado)
VALUES (
    'c1d2e3f4-5678-4321-a987-654321098765',
    'Contabilidad',
    'bi bi-calculator',
    7,
    true
) ON CONFLICT (id_seccion) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- MENÚS PRINCIPALES DEL MÓDULO CONTABILIDAD
-- ===========================================

-- 1. Configuración (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'c1d2e3f4-5678-4321-a987-654321098701',
    'Configuración',
    NULL,
    'bi bi-gear',
    1,
    true,
    'c1d2e3f4-5678-4321-a987-654321098765',
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

-- 2. Transferencia en contabilidad (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'c1d2e3f4-5678-4321-a987-654321098702',
    'Transferencia en contabilidad',
    NULL,
    'bi bi-arrow-left-right',
    2,
    true,
    'c1d2e3f4-5678-4321-a987-654321098765',
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

-- 3. Contabilidad (Item principal)
INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES (
    'c1d2e3f4-5678-4321-a987-654321098703',
    'Contabilidad',
    NULL,
    'bi bi-journal-text',
    3,
    true,
    'c1d2e3f4-5678-4321-a987-654321098765',
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

-- ===========================================
-- SUBMENÚS DE CONFIGURACIÓN
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('c1d2e3f4-5678-4321-a987-654321098711', 'General', '/contabilidad/configuracion/general', 'bi bi-sliders', 1, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098712', 'Diarios contables', '/contabilidad/configuracion/diarios', 'bi bi-journal-bookmark', 2, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098713', 'Modelos de planes contables', '/contabilidad/configuracion/modelos-planes', 'bi bi-diagram-3', 3, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098714', 'Plan contable', '/contabilidad/configuracion/plan-contable', 'bi bi-diagram-2', 4, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098715', 'Plan de cuentas individuales', '/contabilidad/configuracion/cuentas-individuales', 'bi bi-list-ul', 5, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098716', 'Periodo contable', '/contabilidad/configuracion/periodo', 'bi bi-calendar', 6, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098717', 'Cuentas contables por defecto', '/contabilidad/configuracion/cuentas-defecto', 'bi bi-gear-wide', 7, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098718', 'Cuentas Bancarias', '/contabilidad/configuracion/cuentas-bancarias', 'bi bi-bank', 8, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098719', 'Cuentas de IVA', '/contabilidad/configuracion/cuentas-iva', 'bi bi-percent', 9, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-65432109871a', 'Cuentas de impuestos', '/contabilidad/configuracion/cuentas-impuestos', 'bi bi-receipt', 10, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-65432109871b', 'Cuentas contables de productos', '/contabilidad/configuracion/cuentas-productos', 'bi bi-box', 11, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-65432109871c', 'Cerrar cuentas', '/contabilidad/configuracion/cerrar-cuentas', 'bi bi-lock', 12, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-65432109871d', 'Grupo personalizado de cuentas', '/contabilidad/configuracion/grupos-personalizados', 'bi bi-diagram-3-fill', 13, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098701', true, NULL, NOW(), NULL, NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE TRANSFERENCIA EN CONTABILIDAD
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('c1d2e3f4-5678-4321-a987-654321098721', 'Contabilizar facturas a clientes', '/contabilidad/transferencia/facturas-clientes', 'bi bi-file-earmark-text', 1, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098702', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098722', 'Contabilizar facturas de proveedores', '/contabilidad/transferencia/facturas-proveedores', 'bi bi-file-earmark-text-fill', 2, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098702', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098723', 'Registro en contabilidad', NULL, 'bi bi-book', 3, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098702', false, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098724', 'Exportar documentos de origen', '/contabilidad/transferencia/exportar-documentos', 'bi bi-download', 4, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098702', true, NULL, NOW(), NULL, NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE REGISTRO EN CONTABILIDAD
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('c1d2e3f4-5678-4321-a987-654321098731', 'Ventas (Diario de ventas)', '/contabilidad/transferencia/registro/ventas', 'bi bi-cart', 1, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098723', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098732', 'Compras (Diario de compras)', '/contabilidad/transferencia/registro/compras', 'bi bi-bag', 2, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098723', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098733', 'Banco (Diario financiero)', '/contabilidad/transferencia/registro/banco', 'bi bi-bank2', 3, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098723', true, NULL, NOW(), NULL, NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- ===========================================
-- SUBMENÚS DE CONTABILIDAD
-- ===========================================

INSERT INTO menu_item (id_item, etiqueta, ruta, icono, orden, estado, id_seccion, parent_id, es_clickable, created_by, created_at, updated_by, updated_at)
VALUES 
    ('c1d2e3f4-5678-4321-a987-654321098741', 'Libro Mayor', '/contabilidad/libro-mayor', 'bi bi-journal-text', 1, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098703', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098742', 'Diarios', '/contabilidad/diarios', 'bi bi-journal-bookmark', 2, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098703', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098743', 'Saldo de la cuenta', '/contabilidad/saldo-cuenta', 'bi bi-scale', 3, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098703', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098744', 'Exportar contabilidad', '/contabilidad/exportar', 'bi bi-file-earmark-arrow-down', 4, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098703', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098745', 'Cerrar', '/contabilidad/cerrar', 'bi bi-lock-fill', 5, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098703', true, NULL, NOW(), NULL, NOW()),
    ('c1d2e3f4-5678-4321-a987-654321098746', 'Informes', '/contabilidad/informes', 'bi bi-graph-up', 6, true, 'c1d2e3f4-5678-4321-a987-654321098765', 'c1d2e3f4-5678-4321-a987-654321098703', true, NULL, NOW(), NULL, NOW())
ON CONFLICT (id_item) DO UPDATE SET
    etiqueta = EXCLUDED.etiqueta,
    ruta = EXCLUDED.ruta,
    icono = EXCLUDED.icono,
    orden = EXCLUDED.orden,
    estado = EXCLUDED.estado;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
