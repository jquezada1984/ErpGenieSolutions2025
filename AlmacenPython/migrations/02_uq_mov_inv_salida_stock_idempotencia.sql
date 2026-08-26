-- Protección de idempotencia SALIDA DE STOCK v1.
-- NO ejecutar en fase 7A. Aplicación controlada: fase 7A.1.
-- NO modifica índices de STOCK_INICIAL ni ENTRADA_STOCK.

CREATE UNIQUE INDEX IF NOT EXISTS uq_mov_inv_salida_stock_idempotencia
ON public.movimiento_inventario (id_empresa, modulo_origen, id_origen)
WHERE modulo_origen = 'SALIDA_STOCK'
  AND tipo_movimiento = 'SALIDA'
  AND id_origen IS NOT NULL;
