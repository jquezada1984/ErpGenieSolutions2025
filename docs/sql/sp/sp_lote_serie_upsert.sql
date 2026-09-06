-- Alta/actualización de lote/serie por ítem+almacén+código.
CREATE OR REPLACE FUNCTION sp_lote_serie_upsert(
  p_id_empresa uuid,
  p_id_item uuid,
  p_id_almacen uuid,
  p_codigo_lote_serie varchar,
  p_fecha_limite_venta date DEFAULT NULL,
  p_fecha_caducidad date DEFAULT NULL,
  p_cantidad_actual numeric DEFAULT 0,
  p_observacion text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_id_lote_serie uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
  v_row public.item_lote_serie%ROWTYPE;
BEGIN
  IF p_id_lote_serie IS NOT NULL THEN
    UPDATE public.item_lote_serie SET
      codigo_lote_serie = COALESCE(NULLIF(trim(p_codigo_lote_serie), ''), codigo_lote_serie),
      fecha_limite_venta = COALESCE(p_fecha_limite_venta, fecha_limite_venta),
      fecha_caducidad = COALESCE(p_fecha_caducidad, fecha_caducidad),
      cantidad_actual = COALESCE(p_cantidad_actual, cantidad_actual),
      observacion = COALESCE(p_observacion, observacion),
      updated_by = COALESCE(p_user_id, updated_by),
      updated_at = now(),
      estado = true
    WHERE id_lote_serie = p_id_lote_serie AND id_empresa = p_id_empresa
    RETURNING id_lote_serie INTO v_id;
    IF v_id IS NULL THEN
      RAISE EXCEPTION 'lote/serie no encontrado';
    END IF;
  ELSE
    SELECT id_lote_serie INTO v_id
    FROM public.item_lote_serie
    WHERE id_empresa = p_id_empresa AND id_item = p_id_item AND id_almacen = p_id_almacen
      AND codigo_lote_serie = trim(p_codigo_lote_serie)
    LIMIT 1;
    IF v_id IS NOT NULL THEN
      UPDATE public.item_lote_serie SET
        fecha_limite_venta = COALESCE(p_fecha_limite_venta, fecha_limite_venta),
        fecha_caducidad = COALESCE(p_fecha_caducidad, fecha_caducidad),
        cantidad_actual = COALESCE(p_cantidad_actual, cantidad_actual),
        observacion = COALESCE(p_observacion, observacion),
        updated_by = COALESCE(p_user_id, updated_by),
        updated_at = now(),
        estado = true
      WHERE id_lote_serie = v_id;
    ELSE
      v_id := gen_random_uuid();
      INSERT INTO public.item_lote_serie (
        id_lote_serie, id_empresa, id_item, id_almacen, codigo_lote_serie,
        fecha_limite_venta, fecha_caducidad, cantidad_actual, observacion,
        created_by, updated_by, created_at, updated_at, estado
      ) VALUES (
        v_id, p_id_empresa, p_id_item, p_id_almacen, trim(p_codigo_lote_serie),
        p_fecha_limite_venta, p_fecha_caducidad, COALESCE(p_cantidad_actual, 0), p_observacion,
        p_user_id, p_user_id, now(), now(), true
      );
    END IF;
  END IF;

  SELECT * INTO v_row FROM public.item_lote_serie WHERE id_lote_serie = v_id;
  RETURN jsonb_build_object(
    'id_lote_serie', v_row.id_lote_serie,
    'id_empresa', v_row.id_empresa,
    'id_item', v_row.id_item,
    'id_almacen', v_row.id_almacen,
    'codigo_lote_serie', v_row.codigo_lote_serie,
    'cantidad_actual', v_row.cantidad_actual,
    'fecha_caducidad', v_row.fecha_caducidad,
    'fecha_limite_venta', v_row.fecha_limite_venta,
    'observacion', v_row.observacion,
    'estado', v_row.estado
  );
END;
$$;
