# Plan operativo: Kardex / Stock multiempresa (Genie)

Copia operativa del plan Cursor `plan_kardex_multiempresa_31ccd55a`. Fuente de verdad de esquema: **BD viva** (Supabase), no el dump `docs/BaseDatos.sql` (desactualizado: faltan `cambio_masivo_*` y `almacen.id_provincia`).

Arquitectura detallada: [`arquitectura/Inventario.md`](../../arquitectura/Inventario.md). Rabbit: [`docs/ARQUITECTURA_RABBIT_WORKERS.md`](../ARQUITECTURA_RABBIT_WORKERS.md).

## Vocabulario (obligatorio)

### `movimiento_inventario.tipo_movimiento`

| Código | Significado |
|--------|-------------|
| `INICIAL` | Carga inicial |
| `ENTRADA` | Entrada |
| `SALIDA` | Salida |
| `AJUSTE_POSITIVO` | Sobrante / + |
| `AJUSTE_NEGATIVO` | Faltante / − |
| `TRF_SALIDA` | Salida por transferencia |
| `TRF_ENTRADA` | Entrada por transferencia |

### `movimiento_inventario.modulo_origen`

`STOCK_INICIAL`, `ENTRADA_STOCK`, `SALIDA_STOCK`, `AJUSTE_STOCK`, `CAMBIO_MASIVO_STOCK`, `TRANSFERENCIA_STOCK`

### Estados

- `transferencia_stock.estado_transferencia`: `BORRADOR` → `COMPLETADA`
- `cambio_masivo_stock.estado_operacion`: `BORRADOR` → `COMPLETADA`
- `cambio_masivo_stock_detalle.tipo_ajuste`: `POSITIVO` \| `NEGATIVO` → al completar genera `AJUSTE_POSITIVO` / `AJUSTE_NEGATIVO`

## Tablas núcleo (ya en BD)

`almacen`, `stock_item_almacen`, `movimiento_inventario`, `transferencia_stock`, `transferencia_stock_detalle`, `cambio_masivo_stock`, `cambio_masivo_stock_detalle` (+ `inventario` / `inventario_detalle`, `item_lote_serie`).

## Decisión contable

| Movimiento | Stock/Kardex | Asiento INV |
|------------|--------------|-------------|
| ENTRADA / SALIDA / INICIAL | Sí | No en v1 |
| TRF_* / transferencia | Sí (2 líneas) | **No** |
| cambio_masivo → AJUSTE_* | Sí | Sí si impacto valor |
| Cierre inventario → AJUSTE_* | Sí | Sí → `inventario.ajuste.registrado` |

## Fases (estado)

| Fase | Estado |
|------|--------|
| 0. Docs + FKs | Hecho (aplicado en BD viva) |
| 1. Almacenes + saldos + kardex | Hecho |
| 2. Transferencias | Hecho |
| 2b. Cambio masivo | Hecho |
| 3. Inventario físico + Rabbit INV | Hecho (`sp_contabilidad_procesar_ajuste_inventario`) |
| 4. Lotes / stock a fecha / reposición / PMP | Hecho |

**BD viva (2026-09-05):** SPs + menú alineado (`docs/sql/sp/_apply_kardex_sps.py` + `2026-08-31_menu_kardex_stock_align.sql`). Verificación: `docs/sql/_check_kardex_followup.py`.

## SP (`docs/sql/sp/`)

**Stock / almacenes**

- `sp_almacen_crear` / `sp_almacen_actualizar`
- `sp_stock_saldo_upsert`
- `sp_movimiento_inventario_crear`
- `sp_transferencia_stock_crear` / `sp_transferencia_stock_completar`
- `sp_cambio_masivo_crear` / `sp_cambio_masivo_completar`
- `sp_inventario_cerrar`

**Fase 4**

- `sp_lote_serie_upsert`
- `sp_stock_a_fecha`
- `sp_stock_reposicion`
- `sp_stock_valoracion_pmp`

**Contabilidad**

- `sp_contabilidad_procesar_ajuste_inventario` (diario INV; actualiza `id_asiento_contable`)

## Rutas UI

| Ruta | Uso |
|------|-----|
| `/items/almacenes` | CRUD almacenes |
| `/items/productos/stocks` | Saldos reales |
| `/items/productos/stocks-lotes` | Lotes / series |
| `/items/stock/movimientos` | Kardex |
| `/items/stock/transferencias` | Transferencias |
| `/items/stock/cambio-masivo` | Cambio masivo |
| `/items/stock/consultas` | Stock a fecha / reposición / valoración PMP |
| `/items/inventarios` | Conteo físico (líneas + cierre) |

## Scripts SQL relacionados

- `docs/sql/almacenes_v1_fks_cambio_masivo.sql`
- `docs/sql/almacenes_v1_schema_ref.sql`
- `docs/sql/2026-08-31_menu_kardex_stock.sql`
