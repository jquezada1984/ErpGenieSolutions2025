-- =====================================================
-- TRANSFERENCIAS ENTRE CUENTAS BANCARIAS / CAJAS
-- Ejecutar UNA VEZ en pgAdmin / Supabase.
-- Crea cabecera + vínculo en movimiento_bancario (par atómico).
-- =====================================================

CREATE TABLE IF NOT EXISTS transferencia_bancaria (
    id_transferencia_bancaria uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa uuid NOT NULL,
    id_cuenta_origen uuid NOT NULL REFERENCES cuenta_bancaria (id_cuenta_bancaria),
    id_cuenta_destino uuid NOT NULL REFERENCES cuenta_bancaria (id_cuenta_bancaria),
    importe numeric(15, 2) NOT NULL,
    fecha_operacion date NOT NULL,
    fecha_valor date,
    concepto varchar(500),
    referencia varchar(100),
    estado boolean NOT NULL DEFAULT true,
    created_by uuid,
    updated_by uuid,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_transferencia_importe_positivo CHECK (importe > 0),
    CONSTRAINT chk_transferencia_cuentas_distintas CHECK (id_cuenta_origen <> id_cuenta_destino)
);

CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_empresa
    ON transferencia_bancaria (id_empresa);

CREATE INDEX IF NOT EXISTS idx_transferencia_bancaria_fecha
    ON transferencia_bancaria (fecha_operacion DESC);

ALTER TABLE movimiento_bancario
    ADD COLUMN IF NOT EXISTS id_transferencia_bancaria uuid
        REFERENCES transferencia_bancaria (id_transferencia_bancaria);

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_transferencia
    ON movimiento_bancario (id_transferencia_bancaria)
    WHERE id_transferencia_bancaria IS NOT NULL;

COMMENT ON TABLE transferencia_bancaria IS 'Transferencias internas entre cuentas; genera par de movimientos vinculados';
