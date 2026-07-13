-- =====================================================
-- TRANSFERENCIA BANCARIA + reglas ERP moderno (esquema public)
-- =====================================================
-- Patrón acordado:
--   • transferencia_bancaria: cabecera con estado + auditoría de anulación
--   • movimiento_bancario: líneas inmutables; corrección por REVERSA
--     (id_movimiento_reversado → movimiento original). Sin columna estado.
--   • Fecha de reverso = fecha_movimiento de la fila de reversa
-- Ejecutar UNA VEZ en pgAdmin / Supabase.
-- =====================================================

-- 1) Cabecera de transferencia
CREATE TABLE IF NOT EXISTS public.transferencia_bancaria (
    id_transferencia_bancaria uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa uuid NOT NULL,
    id_cuenta_origen uuid NOT NULL
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria),
    id_cuenta_destino uuid NOT NULL
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria),
    fecha_movimiento date NOT NULL,
    numero_documento character varying(100),
    concepto text,
    tipo_movimiento character varying(20) NOT NULL DEFAULT 'transferencia_bancaria',
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

-- Si la tabla ya existía sin auditoría estándar:
ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS created_at timestamp without time zone NOT NULL DEFAULT now();

ALTER TABLE public.transferencia_bancaria
    ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone NOT NULL DEFAULT now();

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

COMMENT ON TABLE public.transferencia_bancaria IS
    'Transferencia interna; par atómico en movimiento_bancario. Anulación: estado=false + reversa de ambas líneas.';

COMMENT ON COLUMN public.transferencia_bancaria.monto IS
    'Importe positivo; movimiento origen = -monto, destino = +monto';

COMMENT ON COLUMN public.transferencia_bancaria.estado IS
    'true=vigente; false=anulada (generar reversas; updated_by/updated_at = auditoría de anulación)';

COMMENT ON COLUMN public.transferencia_bancaria.updated_at IS
    'Última actualización; al anular = momento de anulación';

COMMENT ON COLUMN public.movimiento_bancario.id_movimiento_reversado IS
    'Si NOT NULL: esta fila ES la reversa del movimiento referenciado. No editar montos; corregir con reversa.';


-- 2) Vínculo transferencia → movimientos hijos
ALTER TABLE public.movimiento_bancario
    ADD COLUMN IF NOT EXISTS id_transferencia_bancaria uuid
        REFERENCES public.transferencia_bancaria (id_transferencia_bancaria);

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_transferencia
    ON public.movimiento_bancario (id_transferencia_bancaria)
    WHERE id_transferencia_bancaria IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_reversa
    ON public.movimiento_bancario (id_movimiento_reversado)
    WHERE id_movimiento_reversado IS NOT NULL;

COMMENT ON COLUMN public.movimiento_bancario.id_transferencia_bancaria IS
    'FK cabecera; las dos líneas del par comparten el mismo UUID';


-- =====================================================
-- REGLAS DE NEGOCIO (implementar en servicio Python)
-- =====================================================
--
-- CREAR transferencia (transacción única):
--   1. INSERT transferencia_bancaria (estado=true, created_by)
--   2. INSERT movimiento_bancario origen: monto=-m, tipo_movimiento='transferencia_salida'
--   3. INSERT movimiento_bancario destino: monto=+m, tipo_movimiento='transferencia_entrada'
--      Ambos: mismo id_transferencia_bancaria, fecha_movimiento, concepto
--   4. Actualizar saldo en cuenta_bancaria (origen y destino)
--
-- ANULAR transferencia (transacción única):
--   1. UPDATE transferencia_bancaria SET estado=false, updated_by, updated_at=now()
--   2. Por cada movimiento original del par (sin reversa previa):
--        INSERT reversa con monto opuesto, id_movimiento_reversado=id_original,
--        fecha_movimiento=fecha de anulación, tipo_movimiento='reversa'
--   3. Actualizar saldos
--
-- ANULAR movimiento suelto (sin transferencia):
--   Igual: INSERT reversa; no tocar fila original.
--
-- NO: DELETE físico, editar monto, anular solo una pata de transferencia.
-- =====================================================
