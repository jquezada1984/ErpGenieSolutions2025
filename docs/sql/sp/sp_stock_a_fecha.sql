-- Reconstruye stock físico a una fecha a partir del kardex (suma movimientos hasta p_fecha).
CREATE OR REPLACE FUNCTION sp_stock_a_fecha(
  p_id_empresa uuid,
  p_fecha date,
  p_id_almacen uuid DEFAULT NULL,
  p_id_item uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.producto_ref, t.almacen_nombre), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT
      m.id_item,
      i.producto_ref,
      i.etiqueta,
      m.id_almacen,
      a.nombre AS almacen_nombre,
      SUM(
        CASE
          WHEN m.tipo_movimiento IN ('SALIDA', 'AJUSTE_NEGATIVO', 'TRF_SALIDA') THEN -ABS(m.cantidad)
          ELSE ABS(m.cantidad)
        END
      ) AS stock_a_fecha
    FROM public.movimiento_inventario m
    INNER JOIN public.item i ON i.id_item = m.id_item
    LEFT JOIN public.almacen a ON a.id_almacen = m.id_almacen
    WHERE m.id_empresa = p_id_empresa
      AND m.estado = true
      AND m.fecha_movimiento <= p_fecha
      AND (p_id_almacen IS NULL OR m.id_almacen = p_id_almacen)
      AND (p_id_item IS NULL OR m.id_item = p_id_item)
    GROUP BY m.id_item, i.producto_ref, i.etiqueta, m.id_almacen, a.nombre
  ) t;

  RETURN v_result;
END;
$$;
