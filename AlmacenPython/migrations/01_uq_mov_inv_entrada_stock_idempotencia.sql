-- Protección de idempotencia ENTRADA DE STOCK v1.
-- NO ejecutar en fase 6F. Aplicación controlada: fase 6F.1.
-- NO modifica uq_mov_inv_stock_inicial_idempotencia.

CREATE UNIQUE INDEX IF NOT EXISTS uq_mov_inv_entrada_stock_idempotencia
ON public.movimiento_inventario (id_empresa, modulo_origen, id_origen)
WHERE modulo_origen = 'ENTRADA_STOCK'
  AND tipo_movimiento = 'ENTRADA'
  AND id_origen IS NOT NULL;
