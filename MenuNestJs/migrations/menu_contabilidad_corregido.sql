-- =====================================================
-- INSERCIÓN DE MENÚ DE CONTABILIDAD
-- =====================================================

-- Insertar la sección de Contabilidad
INSERT INTO public.menu_seccion (id_seccion, nombre, orden, icono, estado) 
VALUES (
    gen_random_uuid(),
    'Contabilidad',
    7, -- Orden después de Financiera
    'fas fa-calculator',
    true
) ON CONFLICT (nombre) DO NOTHING;

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
