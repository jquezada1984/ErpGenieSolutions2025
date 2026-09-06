-- Crea movimiento de inventario y actualiza stock_item_almacen.
-- tipo_movimiento: INICIAL, ENTRADA, SALIDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, TRF_SALIDA, TRF_ENTRADA
CREATE OR REPLACE FUNCTION sp_movimiento_inventario_crear(
  p_id_empresa uuid,
  p_id_item uuid,
  p_id_almacen uuid,
  p_tipo_movimiento varchar,
  p_cantidad numeric,
  p_costo_unitario numeric DEFAULT 0,
  p_fecha_movimiento date DEFAULT CURRENT_DATE,
  p_referencia varchar DEFAULT NULL,
  p_concepto text DEFAULT NULL,
  p_modulo_origen varchar DEFAULT NULL,
  p_id_origen uuid DEFAULT NULL,
  p_id_almacen_destino uuid DEFAULT NULL,
  p_id_lote_serie uuid DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_permitir_negativo boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_tipo varchar := UPPER(TRIM(p_tipo_movimiento));
  v_signo numeric;
  v_delta numeric;
  v_costo_u numeric(15,2) := COALESCE(p_costo_unitario, 0);
  v_costo_t numeric(15,2);
  v_id uuid := gen_random_uuid();
  v_stock public.stock_item_almacen%ROWTYPE;
  v_nuevo_fisico numeric(12,2);
  v_mov public.movimiento_inventario%ROWTYPE;
  v_modulo varchar;
BEGIN
  IF p_id_empresa IS NULL OR p_id_item IS NULL OR p_id_almacen IS NULL THEN
    RAISE EXCEPTION 'id_empresa, id_item e id_almacen son requeridos';
  END IF;
  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'cantidad debe ser > 0';
  END IF;

  IF v_tipo NOT IN (
    'INICIAL', 'ENTRADA', 'SALIDA',
    'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO',
    'TRF_SALIDA', 'TRF_ENTRADA'
  ) THEN
    RAISE EXCEPTION 'tipo_movimiento inválido: %', v_tipo;
  END IF;

  IF v_tipo IN ('INICIAL', 'ENTRADA', 'AJUSTE_POSITIVO', 'TRF_ENTRADA') THEN
    v_signo := 1;
  ELSE
    v_signo := -1;
  END IF;

  v_delta := v_signo * p_cantidad;
  v_costo_t := ROUND(v_costo_u * p_cantidad, 2);

  v_modulo := COALESCE(
    NULLIF(TRIM(p_modulo_origen), ''),
    CASE v_tipo
      WHEN 'INICIAL' THEN 'STOCK_INICIAL'
      WHEN 'ENTRADA' THEN 'ENTRADA_STOCK'
      WHEN 'SALIDA' THEN 'SALIDA_STOCK'
      WHEN 'AJUSTE_POSITIVO' THEN 'AJUSTE_STOCK'
      WHEN 'AJUSTE_NEGATIVO' THEN 'AJUSTE_STOCK'
      WHEN 'TRF_SALIDA' THEN 'TRANSFERENCIA_STOCK'
      WHEN 'TRF_ENTRADA' THEN 'TRANSFERENCIA_STOCK'
    END
  );

  -- Upsert saldo
  INSERT INTO public.stock_item_almacen (
    id_stock_producto_almacen, id_empresa, id_item, id_almacen,
    stock_fisico, stock_reservado, stock_virtual, stock_disponible,
    created_by, updated_by, created_at, updated_at, estado
  ) VALUES (
    gen_random_uuid(), p_id_empresa, p_id_item, p_id_almacen,
    0, 0, 0, 0, p_user_id, p_user_id, now(), now(), true
  )
  ON CONFLICT (id_item, id_almacen) DO NOTHING;

  SELECT * INTO v_stock
  FROM public.stock_item_almacen
  WHERE id_item = p_id_item AND id_almacen = p_id_almacen
  FOR UPDATE;

  v_nuevo_fisico := v_stock.stock_fisico + v_delta;
  IF v_nuevo_fisico < 0 AND NOT COALESCE(p_permitir_negativo, false) THEN
    RAISE EXCEPTION 'stock insuficiente (disponible %, solicitado %)', v_stock.stock_fisico, p_cantidad;
  END IF;

  UPDATE public.stock_item_almacen
  SET
    stock_fisico = v_nuevo_fisico,
    stock_virtual = v_nuevo_fisico,
    stock_disponible = v_nuevo_fisico - stock_reservado,
    updated_by = COALESCE(p_user_id, updated_by),
    updated_at = now()
  WHERE id_stock_producto_almacen = v_stock.id_stock_producto_almacen;

  INSERT INTO public.movimiento_inventario (
    id_movimiento_inventario, id_empresa, id_item, tipo_movimiento,
    cantidad, costo_unitario, costo_total, fecha_movimiento,
    referencia, concepto, id_almacen, id_lote_serie,
    modulo_origen, id_origen, id_almacen_destino,
    updated_by, created_at, updated_at, estado
  ) VALUES (
    v_id, p_id_empresa, p_id_item, v_tipo,
    p_cantidad, v_costo_u, v_costo_t, COALESCE(p_fecha_movimiento, CURRENT_DATE),
    p_referencia, p_concepto, p_id_almacen, p_id_lote_serie,
    v_modulo, p_id_origen, p_id_almacen_destino,
    p_user_id, now(), now(), true
  )
  RETURNING * INTO v_mov;

  RETURN to_jsonb(v_mov);
END;
$$;
