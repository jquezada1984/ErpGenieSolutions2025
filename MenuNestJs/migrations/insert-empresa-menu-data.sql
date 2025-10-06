-- Insert example data for "Empresa" menu item
-- This will make "Empresa" the only main item that appears when querying with the provided SQL

-- First, ensure the section exists
INSERT INTO public.menu_seccion (id_seccion, nombre, icono, orden, estado)
VALUES ('29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', 'Administración', 'bi bi-gear', 1, true)
ON CONFLICT (id_seccion) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  icono = EXCLUDED.icono,
  orden = EXCLUDED.orden,
  estado = EXCLUDED.estado;

-- Insert "Empresa" as the only main menu item (parent_id IS NULL)
INSERT INTO public.menu_item (
  id_item, 
  id_seccion, 
  parent_id, 
  etiqueta, 
  icono, 
  ruta, 
  es_clickable, 
  orden, 
  muestra_badge, 
  badge_text, 
  estado, 
  created_by, 
  created_at, 
  updated_by, 
  updated_at
)
VALUES (
  'a1b2c3d4-e5f6-7890-1234-567890abcdef', 
  '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', 
  NULL, 
  'Empresa', 
  'bi bi-building', 
  NULL, 
  false, 
  1, 
  false, 
  NULL, 
  true, 
  'system', 
  NOW(), 
  'system', 
  NOW()
)
ON CONFLICT (id_item) DO UPDATE SET
  id_seccion = EXCLUDED.id_seccion,
  parent_id = EXCLUDED.parent_id,
  etiqueta = EXCLUDED.etiqueta,
  icono = EXCLUDED.icono,
  ruta = EXCLUDED.ruta,
  es_clickable = EXCLUDED.es_clickable,
  orden = EXCLUDED.orden,
  muestra_badge = EXCLUDED.muestra_badge,
  badge_text = EXCLUDED.badge_text,
  estado = EXCLUDED.estado,
  created_by = EXCLUDED.created_by,
  created_at = EXCLUDED.created_at,
  updated_by = EXCLUDED.updated_by,
  updated_at = EXCLUDED.updated_at;

-- Insert sub-items for "Empresa"
INSERT INTO public.menu_item (
  id_item, 
  id_seccion, 
  parent_id, 
  etiqueta, 
  icono, 
  ruta, 
  es_clickable, 
  orden, 
  muestra_badge, 
  badge_text, 
  estado, 
  created_by, 
  created_at, 
  updated_by, 
  updated_at
)
VALUES 
  (
    'f6a7b8c9-d0e1-2345-6789-0abcdef01234', 
    '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', 
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', 
    'Lista de Empresas', 
    'bi bi-list', 
    '/empresas', 
    true, 
    1, 
    false, 
    NULL, 
    true, 
    'system', 
    NOW(), 
    'system', 
    NOW()
  ),
  (
    '0a1b2c3d-4e5f-6789-0123-4567890abcde', 
    '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', 
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', 
    'Nueva Empresa', 
    'bi bi-plus', 
    '/empresas/nueva', 
    true, 
    2, 
    false, 
    NULL, 
    true, 
    'system', 
    NOW(), 
    'system', 
    NOW()
  ),
  (
    '1b2c3d4e-5f6a-7890-1234-567890abcdef', 
    '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', 
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', 
    'Configuración', 
    'bi bi-gear', 
    '/empresas/config', 
    true, 
    3, 
    false, 
    NULL, 
    true, 
    'system', 
    NOW(), 
    'system', 
    NOW()
  )
ON CONFLICT (id_item) DO UPDATE SET
  id_seccion = EXCLUDED.id_seccion,
  parent_id = EXCLUDED.parent_id,
  etiqueta = EXCLUDED.etiqueta,
  icono = EXCLUDED.icono,
  ruta = EXCLUDED.ruta,
  es_clickable = EXCLUDED.es_clickable,
  orden = EXCLUDED.orden,
  muestra_badge = EXCLUDED.muestra_badge,
  badge_text = EXCLUDED.badge_text,
  estado = EXCLUDED.estado,
  created_by = EXCLUDED.created_by,
  created_at = EXCLUDED.created_at,
  updated_by = EXCLUDED.updated_by,
  updated_at = EXCLUDED.updated_at;

-- Disable other main menu items to ensure only "Empresa" appears
UPDATE public.menu_item 
SET estado = false 
WHERE id_seccion = '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1' 
  AND parent_id IS NULL 
  AND id_item != 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
