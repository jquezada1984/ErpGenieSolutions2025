-- Referencia de esquema Almacenes/Kardex v1 (BD viva Supabase).
-- NO ejecutar CREATE TABLE si las tablas ya existen. Solo documentación / regeneración de dump.
--
-- Tablas núcleo: almacen, stock_item_almacen, movimiento_inventario,
--   transferencia_stock, transferencia_stock_detalle,
--   cambio_masivo_stock, cambio_masivo_stock_detalle
-- Relacionadas: inventario, inventario_detalle, item_lote_serie
--
-- NOTA: docs/BaseDatos.sql está DESACTUALIZADO:
--   - Falta cambio_masivo_stock / cambio_masivo_stock_detalle
--   - Falta almacen.id_provincia en el CREATE del dump
-- Fuente de verdad: BD viva + este archivo + docs/planes/PLAN_KARDEX_STOCK_MULTIEMPRESA.md

/*
CREATE TABLE public.cambio_masivo_stock (
  id_cambio_masivo_stock uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  id_empresa uuid NOT NULL,
  id_almacen uuid NOT NULL,
  id_origen uuid NOT NULL,
  fecha_movimiento date NOT NULL,
  referencia varchar(100),
  concepto text,
  estado_operacion varchar(30) NOT NULL DEFAULT 'BORRADOR',
  estado boolean NOT NULL DEFAULT true,
  created_by uuid,
  updated_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT uq_cambio_masivo_stock_empresa_origen UNIQUE (id_empresa, id_origen)
);

CREATE TABLE public.cambio_masivo_stock_detalle (
  id_cambio_masivo_stock_detalle uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  id_cambio_masivo_stock uuid NOT NULL
    REFERENCES public.cambio_masivo_stock(id_cambio_masivo_stock) ON DELETE RESTRICT,
  id_item uuid NOT NULL,
  tipo_ajuste varchar(20) NOT NULL,
  cantidad numeric(12,2) NOT NULL,
  estado boolean NOT NULL DEFAULT true,
  created_by uuid,
  updated_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ck_cambio_masivo_stock_detalle_cantidad_positiva CHECK (cantidad > 0),
  CONSTRAINT ck_cambio_masivo_stock_detalle_tipo_ajuste
    CHECK (tipo_ajuste IN ('POSITIVO', 'NEGATIVO')),
  CONSTRAINT uq_cambio_masivo_stock_detalle_cabecera_item
    UNIQUE (id_cambio_masivo_stock, id_item)
);
*/

-- Vocabulario (no reinventar):
-- tipo_movimiento: INICIAL, ENTRADA, SALIDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, TRF_SALIDA, TRF_ENTRADA
-- modulo_origen: STOCK_INICIAL, ENTRADA_STOCK, SALIDA_STOCK, AJUSTE_STOCK, CAMBIO_MASIVO_STOCK, TRANSFERENCIA_STOCK
-- transferencia estado_transferencia: BORRADOR → COMPLETADA
-- cambio_masivo estado_operacion: BORRADOR → COMPLETADA
-- cambio_masivo_detalle.tipo_ajuste: POSITIVO | NEGATIVO → AJUSTE_POSITIVO | AJUSTE_NEGATIVO
