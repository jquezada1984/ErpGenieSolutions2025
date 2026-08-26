-- FASE 12B.1 — Persistencia Cambio masivo stock v1
-- Diseño congelado 12A.1.
-- SOLO DDL. Sin DML. Sin writers. Sin endpoints.
--
-- Tipos alineados a inspección real:
--   uuid + gen_random_uuid()           (transferencia_stock / detalle)
--   timestamp without time zone + now() (auditoría Transferencia)
--   date                                (movimiento_inventario.fecha_movimiento)
--   varchar(100)                        (movimiento_inventario.referencia)
--   text                                (movimiento_inventario.concepto / observacion)
--   varchar(30)                         (transferencia_stock.estado_transferencia)
--   varchar(20)                         (movimiento_inventario.tipo_movimiento)
--   numeric(12,2)                       (transferencia_stock_detalle.cantidad)
--   boolean DEFAULT true                (patrón Almacenes)
--
-- Nota FK: Transferencia detalle usa NO ACTION implícito (confdeltype='a').
-- Aquí se aplica ON DELETE RESTRICT según diseño 12A.1 (equivalente inmediato).
--
-- Rollback conceptual (NO ejecutar en 12B.1):
--   DROP INDEX IF EXISTS public.uq_mov_inv_cambio_masivo_stock_idempotencia;
--   DROP TABLE IF EXISTS public.cambio_masivo_stock_detalle;
--   DROP TABLE IF EXISTS public.cambio_masivo_stock;

BEGIN;

CREATE TABLE IF NOT EXISTS public.cambio_masivo_stock (
  id_cambio_masivo_stock UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_empresa UUID NOT NULL,
  id_almacen UUID NOT NULL,
  id_origen UUID NOT NULL,
  fecha_movimiento DATE NOT NULL,
  referencia VARCHAR(100) NULL,
  concepto TEXT NULL,
  estado_operacion VARCHAR(30) NOT NULL DEFAULT 'COMPLETADA',
  estado BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NULL,
  updated_by UUID NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  CONSTRAINT uq_cambio_masivo_stock_empresa_origen UNIQUE (id_empresa, id_origen)
);

CREATE TABLE IF NOT EXISTS public.cambio_masivo_stock_detalle (
  id_cambio_masivo_stock_detalle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_cambio_masivo_stock UUID NOT NULL,
  id_item UUID NOT NULL,
  tipo_ajuste VARCHAR(20) NOT NULL,
  cantidad NUMERIC(12, 2) NOT NULL,
  estado BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NULL,
  updated_by UUID NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  CONSTRAINT ck_cambio_masivo_stock_detalle_tipo_ajuste
    CHECK (tipo_ajuste IN ('POSITIVO', 'NEGATIVO')),
  CONSTRAINT ck_cambio_masivo_stock_detalle_cantidad_positiva
    CHECK (cantidad > 0),
  CONSTRAINT uq_cambio_masivo_stock_detalle_cabecera_item
    UNIQUE (id_cambio_masivo_stock, id_item),
  CONSTRAINT fk_cambio_masivo_stock_detalle_cabecera
    FOREIGN KEY (id_cambio_masivo_stock)
    REFERENCES public.cambio_masivo_stock (id_cambio_masivo_stock)
    ON DELETE RESTRICT
);

-- Idempotencia futura: 1 movimiento por detalle (id_origen = PK detalle).
-- No modifica uq_mov_inv_ajuste_stock_idempotencia ni otros índices.
CREATE UNIQUE INDEX IF NOT EXISTS uq_mov_inv_cambio_masivo_stock_idempotencia
ON public.movimiento_inventario (id_empresa, id_origen)
WHERE modulo_origen = 'CAMBIO_MASIVO_STOCK'
  AND id_origen IS NOT NULL;

COMMIT;
