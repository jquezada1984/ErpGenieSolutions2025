-- Completa transferencia BORRADOR → COMPLETADA generando TRF_SALIDA + TRF_ENTRADA.
CREATE OR REPLACE FUNCTION sp_transferencia_stock_completar(
  p_id_empresa uuid,
  p_id_transferencia_stock uuid,
  p_user_id uuid DEFAULT NULL,
  p_costo_unitario numeric DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_trf public.transferencia_stock%ROWTYPE;
  v_det RECORD;
  v_costo numeric(15,2) := COALESCE(p_costo_unitario, 0);
  v_movs jsonb := '[]'::jsonb;
  v_out jsonb;
  v_item_costo numeric(15,2);
BEGIN
  SELECT * INTO v_trf
  FROM public.transferencia_stock
  WHERE id_transferencia_stock = p_id_transferencia_stock
    AND id_empresa = p_id_empresa
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'transferencia no encontrada';
  END IF;
  IF UPPER(v_trf.estado_transferencia) <> 'BORRADOR' THEN
    RAISE EXCEPTION 'solo se puede completar una transferencia en BORRADOR (estado=%)', v_trf.estado_transferencia;
  END IF;

  FOR v_det IN
    SELECT * FROM public.transferencia_stock_detalle
    WHERE id_transferencia_stock = v_trf.id_transferencia_stock AND estado = true
  LOOP
    SELECT COALESCE(precio_compra, 0) INTO v_item_costo
    FROM public.item WHERE id_item = v_det.id_item;
    IF v_costo > 0 THEN
      v_item_costo := v_costo;
    END IF;

    v_out := sp_movimiento_inventario_crear(
      p_id_empresa := p_id_empresa,
      p_id_item := v_det.id_item,
      p_id_almacen := v_trf.id_almacen_origen,
      p_tipo_movimiento := 'TRF_SALIDA',
      p_cantidad := v_det.cantidad,
      p_costo_unitario := v_item_costo,
      p_fecha_movimiento := (v_trf.fecha_transferencia)::date,
      p_referencia := v_trf.transferencia_ref,
      p_concepto := COALESCE(v_trf.observacion, 'Transferencia stock'),
      p_modulo_origen := 'TRANSFERENCIA_STOCK',
      p_id_origen := v_trf.id_transferencia_stock,
      p_id_almacen_destino := v_trf.id_almacen_destino,
      p_id_lote_serie := v_det.id_lote_serie,
      p_user_id := p_user_id,
      p_permitir_negativo := false
    );
    v_movs := v_movs || jsonb_build_array(v_out);

    v_out := sp_movimiento_inventario_crear(
      p_id_empresa := p_id_empresa,
      p_id_item := v_det.id_item,
      p_id_almacen := v_trf.id_almacen_destino,
      p_tipo_movimiento := 'TRF_ENTRADA',
      p_cantidad := v_det.cantidad,
      p_costo_unitario := v_item_costo,
      p_fecha_movimiento := (v_trf.fecha_transferencia)::date,
      p_referencia := v_trf.transferencia_ref,
      p_concepto := COALESCE(v_trf.observacion, 'Transferencia stock'),
      p_modulo_origen := 'TRANSFERENCIA_STOCK',
      p_id_origen := v_trf.id_transferencia_stock,
      p_id_almacen_destino := v_trf.id_almacen_origen,
      p_id_lote_serie := v_det.id_lote_serie,
      p_user_id := p_user_id,
      p_permitir_negativo := false
    );
    v_movs := v_movs || jsonb_build_array(v_out);
  END LOOP;

  UPDATE public.transferencia_stock
  SET
    estado_transferencia = 'COMPLETADA',
    updated_by = COALESCE(p_user_id, updated_by),
    updated_at = now()
  WHERE id_transferencia_stock = v_trf.id_transferencia_stock;

  RETURN jsonb_build_object(
    'id_transferencia_stock', v_trf.id_transferencia_stock,
    'estado_transferencia', 'COMPLETADA',
    'movimientos', v_movs
  );
END;
$$;
