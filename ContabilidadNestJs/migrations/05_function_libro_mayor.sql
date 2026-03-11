-- Procedimiento: Libro Mayor por cuenta
-- Esquema: asiento_contable (id_asiento_contable, id_empresa, fecha_asiento, numero_asiento, concepto),
--          movimiento_contable (id_asiento_contable, id_cuenta_contable, debe, haber),
--          cuenta_contable (id_cuenta_contable, tipo_cuenta). Naturaleza se deriva de tipo_cuenta.
-- Elimina versiones anteriores (otra firma) para evitar "function name is not unique".

DROP FUNCTION IF EXISTS public.libro_mayor(INTEGER, INTEGER, DATE, DATE);
DROP FUNCTION IF EXISTS public.libro_mayor(UUID, UUID, DATE, DATE);

CREATE OR REPLACE FUNCTION public.libro_mayor(
  p_empresa_id   UUID,
  p_cuenta_id    UUID,
  p_fecha_desde  DATE,
  p_fecha_hasta  DATE
)
RETURNS TABLE (
  asiento_id    UUID,
  numero        VARCHAR(50),
  fecha         DATE,
  concepto      TEXT,
  debe          NUMERIC(15,2),
  haber         NUMERIC(15,2),
  saldo_acum    NUMERIC(15,2)
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_tipo_cuenta VARCHAR(50);
  v_saldo       NUMERIC(15,2) := 0;
  r             RECORD;
BEGIN
  SELECT c.tipo_cuenta INTO v_tipo_cuenta
  FROM public.cuenta_contable c
  WHERE c.id_cuenta_contable = p_cuenta_id;

  IF v_tipo_cuenta IS NULL THEN
    RETURN;
  END IF;

  FOR r IN
    SELECT
      a.id_asiento_contable AS asiento_id,
      a.numero_asiento AS numero,
      a.fecha_asiento AS fecha,
      a.concepto,
      m.debe,
      m.haber
    FROM public.movimiento_contable m
    INNER JOIN public.asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
    WHERE m.id_cuenta_contable = p_cuenta_id
      AND a.id_empresa = p_empresa_id
      AND a.estado = 'APROBADO'
      AND a.fecha_asiento >= p_fecha_desde
      AND a.fecha_asiento <= p_fecha_hasta
    ORDER BY a.fecha_asiento ASC, a.numero_asiento ASC
  LOOP
    IF v_tipo_cuenta IN ('ACTIVO', 'GASTO', 'COSTO') THEN
      v_saldo := v_saldo + (r.debe - r.haber);
    ELSE
      v_saldo := v_saldo + (r.haber - r.debe);
    END IF;

    asiento_id := r.asiento_id;
    numero     := r.numero;
    fecha      := r.fecha;
    concepto   := r.concepto;
    debe       := r.debe;
    haber      := r.haber;
    saldo_acum := v_saldo;
    RETURN NEXT;
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.libro_mayor(UUID, UUID, DATE, DATE) IS 'Libro mayor por cuenta: movimientos con saldo acumulado (solo asientos APROBADO)';
