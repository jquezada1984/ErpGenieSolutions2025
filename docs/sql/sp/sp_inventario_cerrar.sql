-- Cierra inventario físico ABIERTO → genera AJUSTE_* por diferencias y marca CERRADO.
-- p_lineas opcional: si se envían, upsert inventario_detalle antes de cerrar
--   [{id_item, stock_contado, id_lote_serie?, observacion?}]
CREATE OR REPLACE FUNCTION sp_inventario_cerrar(
  p_id_empresa uuid,
  p_id_inventario uuid,
  p_lineas jsonb DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_inv public.inventario%ROWTYPE;
  v_linea jsonb;
  v_det RECORD;
  v_sistema numeric(12,2);
  v_contado numeric(12,2);
  v_diff numeric(12,2);
  v_tipo varchar;
  v_costo numeric(15,2);
  v_movs jsonb := '[]'::jsonb;
  v_out jsonb;
  v_id_item uuid;
BEGIN
  SELECT * INTO v_inv
  FROM public.inventario
  WHERE id_inventario = p_id_inventario AND id_empresa = p_id_empresa
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'inventario no encontrado';
  END IF;
  IF UPPER(v_inv.estado_inventario) NOT IN ('ABIERTO', 'EN_PROCESO') THEN
    RAISE EXCEPTION 'solo se cierra inventario ABIERTO/EN_PROCESO (estado=%)', v_inv.estado_inventario;
  END IF;

  IF p_lineas IS NOT NULL THEN
    FOR v_linea IN SELECT * FROM jsonb_array_elements(p_lineas)
    LOOP
      v_id_item := (v_linea->>'id_item')::uuid;
      v_contado := COALESCE((v_linea->>'stock_contado')::numeric, 0);
      SELECT COALESCE(s.stock_fisico, 0) INTO v_sistema
      FROM public.stock_item_almacen s
      WHERE s.id_item = v_id_item AND s.id_almacen = v_inv.id_almacen;
      v_sistema := COALESCE(v_sistema, 0);
      v_diff := v_contado - v_sistema;

      -- Actualiza línea existente del mismo ítem o inserta nueva
      UPDATE public.inventario_detalle
      SET
        stock_sistema = v_sistema,
        stock_contado = v_contado,
        diferencia = v_diff,
        observacion = COALESCE(v_linea->>'observacion', observacion),
        updated_by = COALESCE(p_user_id, updated_by),
        updated_at = now(),
        estado = true
      WHERE id_inventario = v_inv.id_inventario
        AND id_item = v_id_item
        AND estado = true;

      IF NOT FOUND THEN
        INSERT INTO public.inventario_detalle (
          id_inventario_detalle, id_inventario, id_item, id_lote_serie,
          stock_sistema, stock_contado, diferencia, observacion,
          created_by, updated_by, created_at, updated_at, estado
        ) VALUES (
          gen_random_uuid(), v_inv.id_inventario, v_id_item,
          NULLIF(v_linea->>'id_lote_serie', '')::uuid,
          v_sistema, v_contado, v_diff, v_linea->>'observacion',
          p_user_id, p_user_id, now(), now(), true
        );
      END IF;
    END LOOP;
  END IF;

  -- Si no había detalle y no se enviaron líneas, error
  IF NOT EXISTS (
    SELECT 1 FROM public.inventario_detalle
    WHERE id_inventario = v_inv.id_inventario AND estado = true
  ) THEN
    RAISE EXCEPTION 'inventario sin detalle; agregue líneas antes de cerrar';
  END IF;

  FOR v_det IN
    SELECT * FROM public.inventario_detalle
    WHERE id_inventario = v_inv.id_inventario AND estado = true
  LOOP
    v_diff := COALESCE(v_det.diferencia, v_det.stock_contado - v_det.stock_sistema);
    IF v_diff = 0 THEN
      CONTINUE;
    END IF;
    IF v_diff > 0 THEN
      v_tipo := 'AJUSTE_POSITIVO';
    ELSE
      v_tipo := 'AJUSTE_NEGATIVO';
    END IF;

    SELECT COALESCE(precio_compra, 0) INTO v_costo
    FROM public.item WHERE id_item = v_det.id_item;

    v_out := sp_movimiento_inventario_crear(
      p_id_empresa := p_id_empresa,
      p_id_item := v_det.id_item,
      p_id_almacen := v_inv.id_almacen,
      p_tipo_movimiento := v_tipo,
      p_cantidad := ABS(v_diff),
      p_costo_unitario := v_costo,
      p_fecha_movimiento := CURRENT_DATE,
      p_referencia := v_inv.inventario_ref,
      p_concepto := COALESCE(v_inv.observacion, 'Cierre inventario físico'),
      p_modulo_origen := 'AJUSTE_STOCK',
      p_id_origen := v_inv.id_inventario,
      p_id_lote_serie := v_det.id_lote_serie,
      p_user_id := p_user_id,
      p_permitir_negativo := false
    );
    v_movs := v_movs || jsonb_build_array(v_out);
  END LOOP;

  UPDATE public.inventario
  SET
    estado_inventario = 'CERRADO',
    fecha_cierre = now(),
    updated_by = COALESCE(p_user_id, updated_by),
    updated_at = now()
  WHERE id_inventario = v_inv.id_inventario;

  RETURN jsonb_build_object(
    'id_inventario', v_inv.id_inventario,
    'estado_inventario', 'CERRADO',
    'movimientos', v_movs
  );
END;
$$;
