-- =====================================================
-- MOVIMIENTOS BANCARIOS (líneas de cuenta, estilo Dolibarr)
-- Ejecutar UNA VEZ en pgAdmin / Supabase.
-- importe: positivo = ingreso, negativo = egreso
-- =====================================================

CREATE TABLE IF NOT EXISTS movimiento_bancario (
    id_movimiento_bancario uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_cuenta_bancaria uuid NOT NULL REFERENCES cuenta_bancaria (id_cuenta_bancaria),
    id_empresa uuid NOT NULL,
    fecha_operacion date NOT NULL,
    fecha_valor date,
    importe numeric(15, 2) NOT NULL,
    concepto varchar(500),
    referencia varchar(100),
    id_tercero uuid,
    conciliado boolean NOT NULL DEFAULT false,
    estado boolean NOT NULL DEFAULT true,
    created_by uuid,
    updated_by uuid,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_cuenta
    ON movimiento_bancario (id_cuenta_bancaria);

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_empresa
    ON movimiento_bancario (id_empresa);

CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_fecha
    ON movimiento_bancario (fecha_operacion DESC);

COMMENT ON TABLE movimiento_bancario IS 'Líneas de movimiento por cuenta bancaria/caja';
COMMENT ON COLUMN movimiento_bancario.importe IS 'Positivo=ingreso, negativo=egreso; actualiza cuenta_bancaria.saldo_actual';
