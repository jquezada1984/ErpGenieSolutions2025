-- =====================================================
-- RECREAR transferencia_bancaria (tabla vacía)
-- Patrón auditoría ERP: created_by, updated_by, created_at, updated_at
-- Esquema: public — ejecutar UNA VEZ en pgAdmin
-- =====================================================

-- 1) Quitar tabla vacía (y FK desde movimiento_bancario si existía)
DROP TABLE IF EXISTS public.transferencia_bancaria CASCADE;

-- 2) Crear tabla limpia
CREATE TABLE public.transferencia_bancaria (
    id_transferencia_bancaria uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa uuid NOT NULL,
    id_cuenta_origen uuid NOT NULL
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria),
    id_cuenta_destino uuid NOT NULL
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria),
    fecha_movimiento date NOT NULL,
    numero_documento character varying(100),
    concepto text,
    tipo_movimiento character varying(30) NOT NULL DEFAULT 'transferencia_bancaria',
    monto numeric(15, 2) NOT NULL,
    estado boolean NOT NULL DEFAULT true,
    id_asiento_contable uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT chk_transferencia_monto_positivo CHECK (monto > 0),
    CONSTRAINT chk_transferencia_cuentas_distintas CHECK (id_cuenta_origen <> id_cuenta_destino)
);

-- 3) Índices
CREATE INDEX idx_transferencia_bancaria_empresa
    ON public.transferencia_bancaria (id_empresa);

CREATE INDEX idx_transferencia_bancaria_fecha
    ON public.transferencia_bancaria (fecha_movimiento DESC);

CREATE INDEX idx_transferencia_bancaria_origen
    ON public.transferencia_bancaria (id_cuenta_origen);

CREATE INDEX idx_transferencia_bancaria_destino
    ON public.transferencia_bancaria (id_cuenta_destino);

CREATE INDEX idx_transferencia_bancaria_activas
    ON public.transferencia_bancaria (id_empresa, fecha_movimiento DESC)
    WHERE estado = true;

-- 4) Vínculo en movimiento_bancario (recrear columna/FK tras CASCADE)
ALTER TABLE public.movimiento_bancario
    ADD COLUMN IF NOT EXISTS id_transferencia_bancaria uuid
        REFERENCES public.transferencia_bancaria (id_transferencia_bancaria);

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_transferencia
    ON public.movimiento_bancario (id_transferencia_bancaria)
    WHERE id_transferencia_bancaria IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_reversa
    ON public.movimiento_bancario (id_movimiento_reversado)
    WHERE id_movimiento_reversado IS NOT NULL;

-- Quitar vistas si se crearon antes (solo tablas en este proyecto)
DROP VIEW IF EXISTS public.v_transferencia_bancaria_activa;
DROP VIEW IF EXISTS public.v_movimiento_bancario_vigente;

COMMENT ON TABLE public.transferencia_bancaria IS
    'Transferencia interna; par atómico en movimiento_bancario. Anulación: estado=false + updated_by/updated_at + reversas.';
