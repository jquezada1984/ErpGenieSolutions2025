-- Alineación menú Kardex con rutas front actuales (Router.tsx).
-- Los UUID b1c2…030–036 ya existían con rutas /items/almacenes/* antiguas.
-- Idempotente: UPDATE por id + INSERT solo si falta la ruta.

-- Padre
UPDATE public.menu_item
SET etiqueta = 'Almacenes / Stock',
    icono = 'bi bi-box-seam',
    ruta = NULL,
    es_clickable = false,
    orden = 25,
    estado = true,
    updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid;

-- Listado almacenes (ya apunta bien; normalizar etiqueta)
UPDATE public.menu_item
SET etiqueta = 'Almacenes',
    icono = 'bi bi-building',
    ruta = '/items/almacenes',
    es_clickable = true,
    orden = 1,
    estado = true,
    updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000032'::uuid;

-- Saldos: reutilizar "Stock actual"
UPDATE public.menu_item
SET etiqueta = 'Saldos',
    icono = 'bi bi-layers',
    ruta = '/items/productos/stocks',
    es_clickable = true,
    orden = 2,
    estado = true,
    updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000036'::uuid;

-- Movimientos kardex
UPDATE public.menu_item
SET etiqueta = 'Movimientos (Kardex)',
    icono = 'bi bi-arrow-left-right',
    ruta = '/items/stock/movimientos',
    es_clickable = true,
    orden = 3,
    estado = true,
    updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000033'::uuid;

-- Transferencias (UUID nuevo; no existía)
INSERT INTO public.menu_item (
  id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, estado
)
SELECT
  'b1c2d3e4-f5a6-4789-a012-697465000037'::uuid,
  '065855e9-6c56-427d-bb22-793718cc304e'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'Transferencias',
  'bi bi-truck',
  '/items/stock/transferencias',
  true, 4, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item
  WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000037'::uuid
     OR ruta = '/items/stock/transferencias'
);

-- Cambio masivo
UPDATE public.menu_item
SET etiqueta = 'Cambio masivo',
    icono = 'bi bi-collection',
    ruta = '/items/stock/cambio-masivo',
    es_clickable = true,
    orden = 5,
    estado = true,
    updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000034'::uuid;

-- Consultas (stock a fecha / reposición / PMP) — reutilizar UUID stock-fecha
UPDATE public.menu_item
SET etiqueta = 'Consultas stock',
    icono = 'bi bi-search',
    ruta = '/items/stock/consultas',
    es_clickable = true,
    orden = 6,
    estado = true,
    updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000035'::uuid;

-- Desactivar entrada legacy sin pantalla en Router actual
UPDATE public.menu_item
SET estado = false, updated_at = NOW()
WHERE id_item = 'b1c2d3e4-f5a6-4789-a012-697465000031'::uuid; -- Nuevo almacén (ruta vieja)

-- Permisos admin
INSERT INTO public.perfil_menu_permiso (id_perfil, id_item, permitido)
SELECT p.id_perfil, i.id_item, true
FROM public.perfil p
CROSS JOIN public.menu_item i
WHERE i.id_item IN (
  'b1c2d3e4-f5a6-4789-a012-697465000030'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000032'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000033'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000034'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000035'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000036'::uuid,
  'b1c2d3e4-f5a6-4789-a012-697465000037'::uuid
)
AND (
  LOWER(TRIM(p.nombre)) = 'admin'
  OR LOWER(p.nombre) LIKE '%admin%'
)
ON CONFLICT (id_perfil, id_item) DO UPDATE SET permitido = EXCLUDED.permitido;
