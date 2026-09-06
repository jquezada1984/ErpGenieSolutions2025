-- FKs faltantes en cambio_masivo_stock / detalle (BD viva ya tiene tablas; dump BaseDatos.sql desactualizado).
-- Idempotente: solo añade constraints si no existen.
-- NO recrea tablas.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_cambio_masivo_stock_empresa'
  ) THEN
    ALTER TABLE public.cambio_masivo_stock
      ADD CONSTRAINT fk_cambio_masivo_stock_empresa
      FOREIGN KEY (id_empresa) REFERENCES public.empresa (id_empresa)
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_cambio_masivo_stock_almacen'
  ) THEN
    ALTER TABLE public.cambio_masivo_stock
      ADD CONSTRAINT fk_cambio_masivo_stock_almacen
      FOREIGN KEY (id_almacen) REFERENCES public.almacen (id_almacen)
      ON DELETE RESTRICT;
  END IF;

  -- Preferible compuesto (id_empresa, id_almacen) alineado a uq_almacen_empresa_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_cambio_masivo_stock_empresa_almacen'
  ) THEN
    ALTER TABLE public.cambio_masivo_stock
      ADD CONSTRAINT fk_cambio_masivo_stock_empresa_almacen
      FOREIGN KEY (id_empresa, id_almacen)
      REFERENCES public.almacen (id_empresa, id_almacen)
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_cambio_masivo_stock_detalle_item'
  ) THEN
    ALTER TABLE public.cambio_masivo_stock_detalle
      ADD CONSTRAINT fk_cambio_masivo_stock_detalle_item
      FOREIGN KEY (id_item) REFERENCES public.item (id_item)
      ON DELETE RESTRICT;
  END IF;
END $$;

-- Nota: docs/BaseDatos.sql NO incluye cambio_masivo_stock ni cambio_masivo_stock_detalle
-- ni almacen.id_provincia. Usar este script + docs/sql/almacenes_v1_schema_ref.sql como referencia.
