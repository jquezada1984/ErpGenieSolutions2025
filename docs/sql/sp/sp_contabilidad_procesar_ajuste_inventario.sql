-- Contabiliza movimientos AJUSTE_* de un origen (inventario físico o cambio masivo)
-- en diario INV. Actualiza movimiento_inventario.id_asiento_contable.
-- Cuentas: PRODUCTO_INVENTARIO + PRODUCTO_AJUSTE_MERMA / PRODUCTO_AJUSTE_SOBRANTE
--   (fallback: PRODUCTO_COMPRA_NACIONAL como inventario; merma/sobrante usan la misma si no hay específicas).
CREATE OR REPLACE FUNCTION sp_contabilidad_procesar_ajuste_inventario(
  p_id_empresa uuid,
  p_id_origen uuid,
  p_modulo_origen varchar DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_id_diario uuid;
  v_cta_inv uuid;
  v_cta_merma uuid;
  v_cta_sobrante uuid;
  v_cta_contra uuid;
  v_mov RECORD;
  v_id_asiento uuid;
  v_numero varchar;
  v_anio int;
  v_cnt int;
  v_monto numeric(15,2);
  v_concepto text;
  v_asientos int := 0;
  v_ids jsonb := '[]'::jsonb;
  v_fecha date;
BEGIN
  SELECT id_diario_contable INTO v_id_diario
  FROM public.diario_contable
  WHERE id_empresa = p_id_empresa AND codigo = 'INV' AND estado = true
  LIMIT 1;
  IF v_id_diario IS NULL THEN
    RAISE EXCEPTION 'Diario INV no encontrado para la empresa';
  END IF;

  SELECT id_cuenta_contable INTO v_cta_inv
  FROM public.cuenta_contable_defecto
  WHERE id_empresa = p_id_empresa AND tipo_operacion = 'PRODUCTO_INVENTARIO'
    AND estado = true AND id_cuenta_contable IS NOT NULL
  LIMIT 1;
  IF v_cta_inv IS NULL THEN
    SELECT id_cuenta_contable INTO v_cta_inv
    FROM public.cuenta_contable_defecto
    WHERE id_empresa = p_id_empresa AND tipo_operacion = 'PRODUCTO_COMPRA_NACIONAL'
      AND estado = true AND id_cuenta_contable IS NOT NULL
    LIMIT 1;
  END IF;
  IF v_cta_inv IS NULL THEN
    RAISE EXCEPTION 'Configure cuenta PRODUCTO_INVENTARIO (o PRODUCTO_COMPRA_NACIONAL) por defecto';
  END IF;

  SELECT id_cuenta_contable INTO v_cta_merma
  FROM public.cuenta_contable_defecto
  WHERE id_empresa = p_id_empresa AND tipo_operacion = 'PRODUCTO_AJUSTE_MERMA'
    AND estado = true AND id_cuenta_contable IS NOT NULL
  LIMIT 1;
  v_cta_merma := COALESCE(v_cta_merma, v_cta_inv);

  SELECT id_cuenta_contable INTO v_cta_sobrante
  FROM public.cuenta_contable_defecto
  WHERE id_empresa = p_id_empresa AND tipo_operacion = 'PRODUCTO_AJUSTE_SOBRANTE'
    AND estado = true AND id_cuenta_contable IS NOT NULL
  LIMIT 1;
  v_cta_sobrante := COALESCE(v_cta_sobrante, v_cta_inv);

  FOR v_mov IN
    SELECT m.*
    FROM public.movimiento_inventario m
    WHERE m.id_empresa = p_id_empresa
      AND m.id_origen = p_id_origen
      AND m.estado = true
      AND m.tipo_movimiento IN ('AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO')
      AND m.id_asiento_contable IS NULL
      AND (p_modulo_origen IS NULL OR m.modulo_origen = p_modulo_origen)
    ORDER BY m.fecha_movimiento, m.created_at
  LOOP
    v_monto := COALESCE(v_mov.costo_total, v_mov.cantidad * v_mov.costo_unitario, 0);
    IF v_monto <= 0 THEN
      -- Sin costo: asiento por cantidad * 0 no aporta; marcar omitido
      CONTINUE;
    END IF;

    v_fecha := v_mov.fecha_movimiento;
    v_anio := EXTRACT(YEAR FROM v_fecha)::int;
    SELECT COUNT(*)::int INTO v_cnt
    FROM public.asiento_contable
    WHERE id_empresa = p_id_empresa AND EXTRACT(YEAR FROM fecha_asiento) = v_anio;
    v_numero := 'INV-' || v_anio::text || '-' || lpad((v_cnt + 1)::text, 6, '0');
    v_id_asiento := gen_random_uuid();
    v_concepto := COALESCE(v_mov.concepto, v_mov.referencia, 'Ajuste inventario')
      || ' [' || v_mov.tipo_movimiento || ']';

    IF v_mov.tipo_movimiento = 'AJUSTE_NEGATIVO' THEN
      -- Faltante/merma: Debe gasto merma · Haber inventario
      v_cta_contra := v_cta_merma;
      INSERT INTO public.asiento_contable (
        id_asiento_contable, id_empresa, id_diario_contable, numero_asiento,
        fecha_asiento, concepto, referencia, total_debe, total_haber, estado
      ) VALUES (
        v_id_asiento, p_id_empresa, v_id_diario, v_numero,
        v_fecha, v_concepto, COALESCE(v_mov.referencia, ''), v_monto, v_monto, 'APROBADO'
      );
      INSERT INTO public.movimiento_contable (
        id_movimiento_contable, id_asiento_contable, id_cuenta_contable,
        concepto, debe, haber, orden
      ) VALUES
        (gen_random_uuid(), v_id_asiento, v_cta_contra, v_concepto, v_monto, 0, 1),
        (gen_random_uuid(), v_id_asiento, v_cta_inv, v_concepto, 0, v_monto, 2);
    ELSE
      -- Sobrante: Debe inventario · Haber ingreso/ajuste
      v_cta_contra := v_cta_sobrante;
      INSERT INTO public.asiento_contable (
        id_asiento_contable, id_empresa, id_diario_contable, numero_asiento,
        fecha_asiento, concepto, referencia, total_debe, total_haber, estado
      ) VALUES (
        v_id_asiento, p_id_empresa, v_id_diario, v_numero,
        v_fecha, v_concepto, COALESCE(v_mov.referencia, ''), v_monto, v_monto, 'APROBADO'
      );
      INSERT INTO public.movimiento_contable (
        id_movimiento_contable, id_asiento_contable, id_cuenta_contable,
        concepto, debe, haber, orden
      ) VALUES
        (gen_random_uuid(), v_id_asiento, v_cta_inv, v_concepto, v_monto, 0, 1),
        (gen_random_uuid(), v_id_asiento, v_cta_contra, v_concepto, 0, v_monto, 2);
    END IF;

    UPDATE public.movimiento_inventario
    SET id_asiento_contable = v_id_asiento, updated_at = now()
    WHERE id_movimiento_inventario = v_mov.id_movimiento_inventario;

    v_asientos := v_asientos + 1;
    v_ids := v_ids || jsonb_build_array(v_id_asiento);
  END LOOP;

  RETURN jsonb_build_object(
    'asientos_creados', v_asientos,
    'ids_asiento', v_ids,
    'id_origen', p_id_origen
  );
END;
$$;
