-- Protección de idempotencia TRANSFERENCIA DE STOCK v1.
-- NO ejecutar en fase 9C. Aplicación controlada: fase 9C.1.
-- Permite exactamente 1 TRF_SALIDA + 1 TRF_ENTRADA por id_origen.
-- NO modifica índices de STOCK_INICIAL, ENTRADA, SALIDA ni AJUSTE.

CREATE UNIQUE INDEX IF NOT EXISTS uq_mov_inv_transferencia_stock_idempotencia
ON public.movimiento_inventario (id_empresa, id_origen, tipo_movimiento)
WHERE modulo_origen = 'TRANSFERENCIA_STOCK'
  AND id_origen IS NOT NULL;
