-- Migration to add missing fields to menu_item table
-- Based on the entity definition

-- Add es_clickable field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS es_clickable BOOLEAN DEFAULT false;

-- Add muestra_badge field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS muestra_badge BOOLEAN DEFAULT false;

-- Add badge_text field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS badge_text VARCHAR(50);

-- Add created_by field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS created_by VARCHAR(100);

-- Add created_at field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

-- Add updated_by field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(100);

-- Add updated_at field
ALTER TABLE public.menu_item
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Update existing records to have default values
UPDATE public.menu_item 
SET es_clickable = CASE WHEN ruta IS NOT NULL AND ruta != '' THEN true ELSE false END
WHERE es_clickable IS NULL;

UPDATE public.menu_item 
SET muestra_badge = false
WHERE muestra_badge IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_item_es_clickable ON public.menu_item (es_clickable);
CREATE INDEX IF NOT EXISTS idx_menu_item_muestra_badge ON public.menu_item (muestra_badge);
CREATE INDEX IF NOT EXISTS idx_menu_item_created_by ON public.menu_item (created_by);
