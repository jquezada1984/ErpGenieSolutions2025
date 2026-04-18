-- Catálogo comercial: separar etiquetas/categorías por empresa + tipo de ítem (PRODUCT / SERVICE).
-- Compatibilidad: columnas existentes sin cambio; id_tipo_item NULL = registros previos a esta evolución.
-- Tras desplegar, opcionalmente ejecutar un UPDATE por empresa para asignar tipo a filas NULL según negocio.

ALTER TABLE public.item_etiqueta_categoria
  ADD COLUMN IF NOT EXISTS id_tipo_item uuid NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'item_etiqueta_categoria_id_tipo_item_fkey'
  ) THEN
    ALTER TABLE public.item_etiqueta_categoria
      ADD CONSTRAINT item_etiqueta_categoria_id_tipo_item_fkey
      FOREIGN KEY (id_tipo_item) REFERENCES public.tipo_item_catalogo (id_tipo_item)
      ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_item_etiqueta_categoria_empresa_tipo
  ON public.item_etiqueta_categoria (id_empresa, id_tipo_item);

COMMENT ON COLUMN public.item_etiqueta_categoria.id_tipo_item IS
  'Ámbito del catálogo (PRODUCT / SERVICE vía tipo_item_catalogo). NULL = legado antes de separación por tipo.';
