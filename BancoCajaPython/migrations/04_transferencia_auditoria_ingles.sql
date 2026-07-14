-- =====================================================
-- Alinear transferencia_bancaria al patrón ERP (inglés)
-- Estado actual: created_at + creado_por + anulado_por + anulado_en
-- Objetivo: created_by, updated_by, created_at, updated_at
-- Esquema: public — ejecutar UNA VEZ en pgAdmin
-- =====================================================

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone;

-- Migrar datos desde columnas del parche anterior
UPDATE public.transferencia_bancaria
SET created_by = creado_por
WHERE created_by IS NULL AND creado_por IS NOT NULL;

UPDATE public.transferencia_bancaria
SET updated_by = anulado_por,
    updated_at = anulado_en
WHERE estado = false
  AND anulado_por IS NOT NULL
  AND updated_by IS NULL;

-- Quitar columnas en español
ALTER TABLE public.transferencia_bancaria
    DROP COLUMN IF EXISTS creado_por;

ALTER TABLE public.transferencia_bancaria
    DROP COLUMN IF EXISTS anulado_por;

ALTER TABLE public.transferencia_bancaria
    DROP COLUMN IF EXISTS anulado_en;

-- Default updated_at en filas nuevas (opcional)
UPDATE public.transferencia_bancaria
SET updated_at = created_at
WHERE updated_at IS NULL;

COMMENT ON COLUMN public.transferencia_bancaria.created_by IS 'Usuario que creó la transferencia';
COMMENT ON COLUMN public.transferencia_bancaria.updated_by IS 'Último usuario; al anular (estado=false) = quien anuló';
COMMENT ON COLUMN public.transferencia_bancaria.updated_at IS 'Última actualización; al anular = momento de anulación';
