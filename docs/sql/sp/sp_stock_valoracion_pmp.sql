-- Valoración de stock: qty × PMP aproximado (precio_compra del ítem / último costo movimiento).
CREATE OR REPLACE FUNCTION sp_stock_valoracion_pmp(
  p_id_empresa uuid,
  p_id_almacen uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.producto_ref), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT
      s.id_item,
      i.producto_ref,
      i.etiqueta,
      s.id_almacen,
      a.nombre AS almacen_nombre,
      s.stock_fisico,
      COALESCE(
        (
          SELECT m.costo_unitario
          FROM public.movimiento_inventario m
          WHERE m.id_empresa = s.id_empresa AND m.id_item = s.id_item
            AND m.estado = true AND m.costo_unitario > 0
            AND m.tipo_movimiento IN ('ENTRADA', 'INICIAL', 'AJUSTE_POSITIVO', 'TRF_ENTRADA')
          ORDER BY m.fecha_movimiento DESC, m.created_at DESC
          LIMIT 1
        ),
        i.precio_compra,
        0
      ) AS pmp,
      s.stock_fisico * COALESCE(
        (
          SELECT m.costo_unitario
          FROM public.movimiento_inventario m
          WHERE m.id_empresa = s.id_empresa AND m.id_item = s.id_item
            AND m.estado = true AND m.costo_unitario > 0
            AND m.tipo_movimiento IN ('ENTRADA', 'INICIAL', 'AJUSTE_POSITIVO', 'TRF_ENTRADA')
          ORDER BY m.fecha_movimiento DESC, m.created_at DESC
          LIMIT 1
        ),
        i.precio_compra,
        0
      ) AS valor_total
    FROM public.stock_item_almacen s
    INNER JOIN public.item i ON i.id_item = s.id_item
    LEFT JOIN public.almacen a ON a.id_almacen = s.id_almacen
    WHERE s.id_empresa = p_id_empresa
      AND s.estado = true
      AND s.stock_fisico <> 0
      AND (p_id_almacen IS NULL OR s.id_almacen = p_id_almacen)
  ) t;

  RETURN v_result;
END;
$$;