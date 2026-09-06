-- Crea transferencia en BORRADOR con líneas (p_lineas jsonb: [{id_item, cantidad, id_lote_serie?}]).
CREATE OR REPLACE FUNCTION sp_transferencia_stock_crear(
  p_id_empresa uuid,
  p_transferencia_ref varchar,
  p_id_almacen_origen uuid,
  p_id_almacen_destino uuid,
  p_fecha_transferencia timestamp DEFAULT now(),
  p_observacion text DEFAULT NULL,
  p_lineas jsonb DEFAULT '[]'::jsonb,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid := gen_random_uuid();
  v_linea jsonb;
  v_detalles jsonb := '[]'::jsonb;
  v_det_id uuid;
  v_cant numeric;
BEGIN
  IF p_id_empresa IS NULL THEN
    RAISE EXCEPTION 'id_empresa requerido';
  END IF;
  IF NULLIF(TRIM(p_transferencia_ref), '') IS NULL THEN
    RAISE EXCEPTION 'transferencia_ref requerido';
  END IF;
  IF p_id_almacen_origen IS NULL OR p_id_almacen_destino IS NULL THEN
    RAISE EXCEPTION 'almacenes origen y destino requeridos';
  END IF;
  IF p_id_almacen_origen = p_id_almacen_destino THEN
    RAISE EXCEPTION 'origen y destino deben ser distintos';
  END IF;

  INSERT INTO public.transferencia_stock (
    id_transferencia_stock, id_empresa, transferencia_ref,
    id_almacen_origen, id_almacen_destino, estado_transferencia,
    fecha_transferencia, observacion, created_by, updated_by,
    created_at, updated_at, estado
  ) VALUES (
    v_id, p_id_empresa, TRIM(p_transferencia_ref),
    p_id_almacen_origen, p_id_almacen_destino, 'BORRADOR',
    COALESCE(p_fecha_transferencia, now()), p_observacion, p_user_id, p_user_id,
    now(), now(), true
  );

  FOR v_linea IN SELECT * FROM jsonb_array_elements(COALESCE(p_lineas, '[]'::jsonb))
  LOOP
    v_cant := (v_linea->>'cantidad')::numeric;
    IF v_cant IS NULL OR v_cant <= 0 THEN
      RAISE EXCEPTION 'cantidad de línea inválida';
    END IF;
    IF (v_linea->>'id_item') IS NULL THEN
      RAISE EXCEPTION 'id_item de línea requerido';
    END IF;
    v_det_id := gen_random_uuid();
    INSERT INTO public.transferencia_stock_detalle (
      id_transferencia_stock_detalle, id_transferencia_stock, id_item,
      id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado
    ) VALUES (
      v_det_id, v_id, (v_linea->>'id_item')::uuid,
      NULLIF(v_linea->>'id_lote_serie', '')::uuid, v_cant,
      p_user_id, p_user_id, now(), now(), true
    );
    v_detalles := v_detalles || jsonb_build_array(jsonb_build_object(
      'id_transferencia_stock_detalle', v_det_id,
      'id_item', v_linea->>'id_item',
      'cantidad', v_cant
    ));
  END LOOP;

  RETURN jsonb_build_object(
    'id_transferencia_stock', v_id,
    'id_empresa', p_id_empresa,
    'transferencia_ref', TRIM(p_transferencia_ref),
    'estado_transferencia', 'BORRADOR',
    'detalles', v_detalles
  );
END;
$$;
