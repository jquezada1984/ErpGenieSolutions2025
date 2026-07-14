-- Fase 4 operativa: marcar líneas exportadas a sistema contable externo

ALTER TABLE public.movimiento_contable
  ADD COLUMN IF NOT EXISTS fecha_exportacion timestamp without time zone;

ALTER TABLE public.asiento_contable
  ADD COLUMN IF NOT EXISTS fecha_exportacion timestamp without time zone;

COMMENT ON COLUMN public.movimiento_contable.fecha_exportacion IS 'Fecha en que la línea fue exportada al sistema contable externo';
COMMENT ON COLUMN public.asiento_contable.fecha_exportacion IS 'Fecha de exportación a nivel cabecera (opcional)';
