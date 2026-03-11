-- Procedimiento: Estado de Resultados (Income Statement)
-- Esquema: asiento_contable (id_asiento_contable, id_empresa, fecha_asiento, estado),
--          movimiento_contable (id_asiento_contable, id_cuenta_contable, debe, haber),
--          cuenta_contable (id_cuenta_contable, tipo_cuenta).

CREATE OR REPLACE FUNCTION estado_resultados(
  p_empresa_id  UUID,
  p_fecha_desde DATE,
  p_fecha_hasta DATE
)
RETURNS TABLE (
  tipo_cuenta   VARCHAR(50),
  total         NUMERIC(15,2),
  resultado     NUMERIC(15,2)
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_ingresos NUMERIC(15,2) := 0;
  v_gastos   NUMERIC(15,2) := 0;
BEGIN
  -- Ingresos: cuentas tipo INGRESO -> (haber - debe)
  SELECT COALESCE(SUM(m.haber - m.debe), 0) INTO v_ingresos
  FROM public.movimiento_contable m
  INNER JOIN public.asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
  INNER JOIN public.cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
  WHERE a.id_empresa = p_empresa_id
    AND a.estado = 'APROBADO'
    AND a.fecha_asiento >= p_fecha_desde
    AND a.fecha_asiento <= p_fecha_hasta
    AND c.tipo_cuenta = 'INGRESO';

  -- Gastos: cuentas tipo GASTO -> (debe - haber)
  SELECT COALESCE(SUM(m.debe - m.haber), 0) INTO v_gastos
  FROM public.movimiento_contable m
  INNER JOIN public.asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
  INNER JOIN public.cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
  WHERE a.id_empresa = p_empresa_id
    AND a.estado = 'APROBADO'
    AND a.fecha_asiento >= p_fecha_desde
    AND a.fecha_asiento <= p_fecha_hasta
    AND c.tipo_cuenta = 'GASTO';

  tipo_cuenta := 'INGRESO';
  total       := v_ingresos;
  resultado   := NULL;
  RETURN NEXT;

  tipo_cuenta := 'GASTO';
  total       := v_gastos;
  resultado   := NULL;
  RETURN NEXT;

  tipo_cuenta := 'RESULTADO';
  total       := v_ingresos - v_gastos;
  resultado   := v_ingresos - v_gastos;
  RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION estado_resultados IS 'Estado de resultados: ingresos, gastos y resultado del periodo (solo asientos APROBADO)';
