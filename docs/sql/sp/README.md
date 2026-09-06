# Stored procedures (PostgreSQL)

Los servicios **Python** y **C#/.NET** solo invocan objetos de esta carpeta (o migraciones del servicio). No incrustar `SELECT`/`INSERT`/`UPDATE`/`DELETE` en el código.

Ver [docs/ACCESO_BD_SOLO_SP.md](../ACCESO_BD_SOLO_SP.md).

Convención de nombre: `sp_{dominio}_{accion}.sql`.

## Kardex / Almacenes (2026-08)

| Función | Uso |
|---------|-----|
| `sp_almacen_crear` / `sp_almacen_actualizar` | CRUD almacén |
| `sp_stock_saldo_upsert` | Upsert saldo sin movimiento |
| `sp_movimiento_inventario_crear` | Movimiento + actualiza `stock_item_almacen` |
| `sp_transferencia_stock_crear` / `_completar` | BORRADOR → TRF_SALIDA + TRF_ENTRADA |
| `sp_cambio_masivo_crear` / `_completar` | BORRADOR → AJUSTE_* |
| `sp_inventario_cerrar` | Cierre físico → AJUSTE_* |
| `sp_lote_serie_upsert` | Alta/actualización lote-serie |
| `sp_stock_a_fecha` | Saldo reconstruido a una fecha |
| `sp_stock_reposicion` | Ítems bajo stock mínimo |
| `sp_stock_valoracion_pmp` | Valoración aproximada (PMP / precio compra) |
| `sp_contabilidad_procesar_ajuste_inventario` | Asiento diario INV + `id_asiento_contable` |

## Configuración empresa / instancia (2026-09)

| Función | Uso |
|---------|-----|
| `sp_empresa_config_obtener` / `_guardar` | Paneles, alertas, emails (JSONB por empresa) |
| `sp_instancia_config_obtener` / `_guardar_seguridad` | Seguridad de instancia (solo GLOBAL) |

Tablas: `empresa_config`, `instancia_config`. SQL: `docs/sql/2026-09-05_empresa_config.sql`.

Aplicar FKs primero: `docs/sql/almacenes_v1_fks_cambio_masivo.sql`.
Helper opcional: `docs/sql/sp/_apply_kardex_sps.py`.
Menú UI: `docs/sql/2026-08-31_menu_kardex_stock.sql` (incluye Consultas stock).
