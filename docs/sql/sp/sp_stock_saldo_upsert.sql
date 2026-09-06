-- Upsert saldo en stock_item_almacen (no genera movimiento).
CREATE OR REPLACE FUNCTION sp_stock_saldo_upsert(
  p_id_empresa uuid,
  p_id_item uuid,
  p_id_almacen uuid,
  p_stock_fisico numeric DEFAULT NULL,
  p_stock_reservado numeric DEFAULT NULL,
  p_stock_alerta numeric DEFAULT NULL,
  p_stock_deseado numeric DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_row public.stock_item_almacen%ROWTYPE;
  v_fisico numeric(12,2);
  v_reservado numeric(12,2);
BEGIN
  IF p_id_empresa IS NULL OR p_id_item IS NULL OR p_id_almacen IS NULL THEN
    RAISE EXCEPTION 'id_empresa, id_item e id_almacen son requeridos';
  END IF;

  INSERT INTO public.stock_item_almacen (
    id_stock_producto_almacen, id_empresa, id_item, id_almacen,
    stock_fisico, stock_reservado, stock_virtual, stock_disponible,
    stock_alerta, stock_deseado, created_by, updated_by, created_at, updated_at, estado
  ) VALUES (
    gen_random_uuid(), p_id_empresa, p_id_item, p_id_almacen,
    COALESCE(p_stock_fisico, 0), COALESCE(p_stock_reservado, 0),
    COALESCE(p_stock_fisico, 0), COALESCE(p_stock_fisico, 0) - COALESCE(p_stock_reservado, 0),
    p_stock_alerta, p_stock_deseado, p_user_id, p_user_id, now(), now(), true
  )
  ON CONFLICT (id_item, id_almacen) DO UPDATE
  SET
    stock_fisico = COALESCE(p_stock_fisico, stock_item_almacen.stock_fisico),
    stock_reservado = COALESCE(p_stock_reservado, stock_item_almacen.stock_reservado),
    stock_alerta = COALESCE(p_stock_alerta, stock_item_almacen.stock_alerta),
    stock_deseado = COALESCE(p_stock_deseado, stock_item_almacen.stock_deseado),
    updated_by = COALESCE(p_user_id, stock_item_almacen.updated_by),
    updated_at = now()
  RETURNING * INTO v_row;

  v_fisico := v_row.stock_fisico;
  v_reservado := v_row.stock_reservado;

  UPDATE public.stock_item_almacen
  SET
    stock_virtual = v_fisico,
    stock_disponible = v_fisico - v_reservado,
    updated_at = now()
  WHERE id_stock_producto_almacen = v_row.id_stock_producto_almacen
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
END;
$$;
