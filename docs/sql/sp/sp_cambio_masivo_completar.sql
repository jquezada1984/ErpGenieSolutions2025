-- Completa cambio masivo → AJUSTE_POSITIVO / AJUSTE_NEGATIVO (modulo CAMBIO_MASIVO_STOCK).
CREATE OR REPLACE FUNCTION sp_cambio_masivo_completar(
  p_id_empresa uuid,
  p_id_cambio_masivo_stock uuid,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_cab public.cambio_masivo_stock%ROWTYPE;
  v_det RECORD;
  v_tipo_mov varchar;
  v_costo numeric(15,2);
  v_movs jsonb := '[]'::jsonb;
  v_out jsonb;
BEGIN
  SELECT * INTO v_cab
  FROM public.cambio_masivo_stock
  WHERE id_cambio_masivo_stock = p_id_cambio_masivo_stock
    AND id_empresa = p_id_empresa
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'cambio masivo no encontrado';
  END IF;
  IF UPPER(v_cab.estado_operacion) <> 'BORRADOR' THEN
    RAISE EXCEPTION 'solo se puede completar en BORRADOR (estado=%)', v_cab.estado_operacion;
  END IF;

  FOR v_det IN
    SELECT * FROM public.cambio_masivo_stock_detalle
    WHERE id_cambio_masivo_stock = v_cab.id_cambio_masivo_stock AND estado = true
  LOOP
    IF UPPER(v_det.tipo_ajuste) = 'POSITIVO' THEN
      v_tipo_mov := 'AJUSTE_POSITIVO';
    ELSE
      v_tipo_mov := 'AJUSTE_NEGATIVO';
    END IF;

    SELECT COALESCE(precio_compra, 0) INTO v_costo
    FROM public.item WHERE id_item = v_det.id_item;

    v_out := sp_movimiento_inventario_crear(
      p_id_empresa := p_id_empresa,
      p_id_item := v_det.id_item,
      p_id_almacen := v_cab.id_almacen,
      p_tipo_movimiento := v_tipo_mov,
      p_cantidad := v_det.cantidad,
      p_costo_unitario := v_costo,
      p_fecha_movimiento := v_cab.fecha_movimiento,
      p_referencia := v_cab.referencia,
      p_concepto := COALESCE(v_cab.concepto, 'Cambio masivo stock'),
      p_modulo_origen := 'CAMBIO_MASIVO_STOCK',
      p_id_origen := v_cab.id_cambio_masivo_stock,
      p_user_id := p_user_id,
      p_permitir_negativo := false
    );
    v_movs := v_movs || jsonb_build_array(v_out);
  END LOOP;

  UPDATE public.cambio_masivo_stock
  SET
    estado_operacion = 'COMPLETADA',
    updated_by = COALESCE(p_user_id, updated_by),
    updated_at = now()
  WHERE id_cambio_masivo_stock = v_cab.id_cambio_masivo_stock;

  RETURN jsonb_build_object(
    'id_cambio_masivo_stock', v_cab.id_cambio_masivo_stock,
    'estado_operacion', 'COMPLETADA',
    'movimientos', v_movs
  );
END;
$$;
