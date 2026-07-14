-- =====================================================
-- PARCHE: ya creaste public.transferencia_bancaria en pgAdmin
-- Patrón auditoría ERP: created_by, updated_by, created_at, updated_at
-- Esquema: public
-- =====================================================

-- 1) Auditoría estándar (si faltan)
ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS created_at timestamp without time zone NOT NULL DEFAULT now();

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone NOT NULL DEFAULT now();

-- 2) Vínculo en movimiento_bancario (si falta)
ALTER TABLE public.movimiento_bancario
    ADD COLUMN IF NOT EXISTS id_transferencia_bancaria uuid
        REFERENCES public.transferencia_bancaria (id_transferencia_bancaria);

-- 3) Índices
CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_empresa
    ON public.transferencia_bancaria (id_empresa);

CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_fecha
    ON public.transferencia_bancaria (fecha_movimiento DESC);

CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_origen
    ON public.transferencia_bancaria (id_cuenta_origen);

CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_destino
    ON public.transferencia_bancaria (id_cuenta_destino);

CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_activas
    ON public.transferencia_bancaria (id_empresa, fecha_movimiento DESC)
    WHERE estado = true;

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_transferencia
    ON public.movimiento_bancario (id_transferencia_bancaria)
    WHERE id_transferencia_bancaria IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_reversa
    ON public.movimiento_bancario (id_movimiento_reversado)
    WHERE id_movimiento_reversado IS NOT NULL;

-- Comentarios
COMMENT ON TABLE public.transferencia_bancaria IS
    'Transferencia interna; par atómico en movimiento_bancario. Anulación: estado=false + reversa de ambas líneas.';

COMMENT ON COLUMN public.transferencia_bancaria.updated_by IS
    'Al anular (estado=false): usuario que anuló';

COMMENT ON COLUMN public.movimiento_bancario.id_transferencia_bancaria IS
    'FK cabecera; las dos líneas del par comparten el mismo UUID';

COMMENT ON COLUMN public.movimiento_bancario.id_movimiento_reversado IS
    'Si NOT NULL: esta fila ES la reversa del movimiento referenciado';
