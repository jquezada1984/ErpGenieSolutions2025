-- Crea cambio masivo BORRADOR. p_lineas: [{id_item, tipo_ajuste: POSITIVO|NEGATIVO, cantidad}]
-- p_id_origen: si NULL, usa el id de cabecera (UNIQUE empresa+origen).
CREATE OR REPLACE FUNCTION sp_cambio_masivo_crear(
  p_id_empresa uuid,
  p_id_almacen uuid,
  p_fecha_movimiento date DEFAULT CURRENT_DATE,
  p_referencia varchar DEFAULT NULL,
  p_concepto text DEFAULT NULL,
  p_lineas jsonb DEFAULT '[]'::jsonb,
  p_id_origen uuid DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid := gen_random_uuid();
  v_origen uuid;
  v_linea jsonb;
  v_detalles jsonb := '[]'::jsonb;
  v_det_id uuid;
  v_tipo varchar;
  v_cant numeric;
BEGIN
  IF p_id_empresa IS NULL OR p_id_almacen IS NULL THEN
    RAISE EXCEPTION 'id_empresa e id_almacen requeridos';
  END IF;

  v_origen := COALESCE(p_id_origen, v_id);

  INSERT INTO public.cambio_masivo_stock (
    id_cambio_masivo_stock, id_empresa, id_almacen, id_origen,
    fecha_movimiento, referencia, concepto, estado_operacion,
    estado, created_by, updated_by, created_at, updated_at
  ) VALUES (
    v_id, p_id_empresa, p_id_almacen, v_origen,
    COALESCE(p_fecha_movimiento, CURRENT_DATE), p_referencia, p_concepto, 'BORRADOR',
    true, p_user_id, p_user_id, now(), now()
  );

  FOR v_linea IN SELECT * FROM jsonb_array_elements(COALESCE(p_lineas, '[]'::jsonb))
  LOOP
    v_tipo := UPPER(TRIM(v_linea->>'tipo_ajuste'));
    v_cant := (v_linea->>'cantidad')::numeric;
    IF v_tipo NOT IN ('POSITIVO', 'NEGATIVO') THEN
      RAISE EXCEPTION 'tipo_ajuste inválido: %', v_tipo;
    END IF;
    IF v_cant IS NULL OR v_cant <= 0 THEN
      RAISE EXCEPTION 'cantidad debe ser > 0';
    END IF;
    IF (v_linea->>'id_item') IS NULL THEN
      RAISE EXCEPTION 'id_item requerido en línea';
    END IF;
    v_det_id := gen_random_uuid();
    INSERT INTO public.cambio_masivo_stock_detalle (
      id_cambio_masivo_stock_detalle, id_cambio_masivo_stock, id_item,
      tipo_ajuste, cantidad, estado, created_by, updated_by, created_at, updated_at
    ) VALUES (
      v_det_id, v_id, (v_linea->>'id_item')::uuid,
      v_tipo, v_cant, true, p_user_id, p_user_id, now(), now()
    );
    v_detalles := v_detalles || jsonb_build_array(jsonb_build_object(
      'id_cambio_masivo_stock_detalle', v_det_id,
      'id_item', v_linea->>'id_item',
      'tipo_ajuste', v_tipo,
      'cantidad', v_cant
    ));
  END LOOP;

  RETURN jsonb_build_object(
    'id_cambio_masivo_stock', v_id,
    'id_origen', v_origen,
    'estado_operacion', 'BORRADOR',
    'detalles', v_detalles
  );
END;
$$;
