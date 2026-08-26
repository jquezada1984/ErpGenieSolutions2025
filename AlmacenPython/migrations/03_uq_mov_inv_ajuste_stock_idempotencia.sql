-- Protección de idempotencia AJUSTE DE STOCK v1.
-- NO ejecutar en fase 8B. Aplicación controlada: fase 8B.1.
-- NO modifica índices de STOCK_INICIAL, ENTRADA ni SALIDA.

CREATE UNIQUE INDEX IF NOT EXISTS uq_mov_inv_ajuste_stock_idempotencia
ON public.movimiento_inventario (id_empresa, id_origen)
WHERE modulo_origen = 'AJUSTE_STOCK'
  AND id_origen IS NOT NULL;
