-- Sugiere reposición: stock_fisico < COALESCE(stock_alerta, item.stock_minimo_alerta)
-- o por debajo de stock_deseado.
CREATE OR REPLACE FUNCTION sp_stock_reposicion(
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
  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.faltante DESC), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT
      s.id_stock_producto_almacen,
      s.id_item,
      i.producto_ref,
      i.etiqueta,
      s.id_almacen,
      a.nombre AS almacen_nombre,
      s.stock_fisico,
      COALESCE(s.stock_alerta, i.stock_minimo_alerta, 0) AS umbral_alerta,
      COALESCE(s.stock_deseado, i.stock_deseado, 0) AS stock_deseado,
      GREATEST(
        COALESCE(s.stock_deseado, i.stock_deseado, 0) - s.stock_fisico,
        COALESCE(s.stock_alerta, i.stock_minimo_alerta, 0) - s.stock_fisico,
        0
      ) AS faltante
    FROM public.stock_item_almacen s
    INNER JOIN public.item i ON i.id_item = s.id_item
    LEFT JOIN public.almacen a ON a.id_almacen = s.id_almacen
    WHERE s.id_empresa = p_id_empresa
      AND s.estado = true
      AND i.estado = true
      AND COALESCE(i.inventariable, true) = true
      AND (p_id_almacen IS NULL OR s.id_almacen = p_id_almacen)
      AND (
        s.stock_fisico < COALESCE(s.stock_alerta, i.stock_minimo_alerta, 0)
        OR (
          COALESCE(s.stock_deseado, i.stock_deseado, 0) > 0
          AND s.stock_fisico < COALESCE(s.stock_deseado, i.stock_deseado, 0)
        )
      )
  ) t
  WHERE t.faltante > 0;

  RETURN v_result;
END;
$$;
