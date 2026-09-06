# Inventario / Kardex / Almacenes

Servicios: `InventarioNestJs` (lectura GQL) + `InventarioPython` (escritura REST **solo vía SP**).

```
frontReact → gateway-api → InventarioNestJs | InventarioPython
```

Plan operativo: [`docs/planes/PLAN_KARDEX_STOCK_MULTIEMPRESA.md`](../docs/planes/PLAN_KARDEX_STOCK_MULTIEMPRESA.md).

**Nota:** `docs/BaseDatos.sql` está desactualizado (faltan `cambio_masivo_*` y `almacen.id_provincia`). Esquema vivo + `docs/sql/almacenes_v1_schema_ref.sql`.

## InventarioPython (escritura)

| Método | Path | SP / acción |
|--------|------|-------------|
| POST | `/api/inventario` | Crear cabecera inventario (legado ORM; migrar a SP al tocar) |
| PUT | `/api/inventario/<id>` | Actualizar cabecera |
| POST | `/api/inventario/<id>/cerrar` | `sp_inventario_cerrar` + Rabbit |
| POST | `/api/almacen` | `sp_almacen_crear` |
| PUT | `/api/almacen/<id>` | `sp_almacen_actualizar` |
| POST | `/api/stock/movimiento` | `sp_movimiento_inventario_crear` |
| POST | `/api/stock/saldo` | `sp_stock_saldo_upsert` |
| POST | `/api/stock/transferencia` | `sp_transferencia_stock_crear` |
| POST | `/api/stock/transferencia/<id>/completar` | `sp_transferencia_stock_completar` |
| POST | `/api/stock/cambio-masivo` | `sp_cambio_masivo_crear` |
| POST | `/api/stock/cambio-masivo/<id>/completar` | `sp_cambio_masivo_completar` + Rabbit |
| POST | `/api/stock/lote` | `sp_lote_serie_upsert` |
| POST | `/api/stock/a-fecha` | `sp_stock_a_fecha` |
| POST | `/api/stock/reposicion` | `sp_stock_reposicion` |
| POST | `/api/stock/valoracion-pmp` | `sp_stock_valoracion_pmp` |

## InventarioNestJs (lectura)

| Query | Notas |
|-------|-------|
| `inventariosListado` / `inventarioPorId` / `inventarioLineas` | Conteo físico + detalle |
| `almacenesPorEmpresa` | Filtro `id_empresa` |
| `stockPorEmpresa` | Saldos |
| `movimientosInventario` | Kardex (+ `id_asiento_contable`) |
| `transferenciasStock` / `cambiosMasivosStock` | Documentos |
| `lotesSerie` | Lotes/series |
| `stockAFecha` / `stockReposicion` / `stockValoracionPmp` | Consultas (vía SP) |

## Front

| Ruta | Pantalla |
|------|----------|
| `/items/almacenes` | CRUD almacenes |
| `/items/productos/stocks` | Saldos |
| `/items/productos/stocks-lotes` | Lotes/series |
| `/items/stock/movimientos` | Kardex |
| `/items/stock/transferencias` | Transferencias |
| `/items/stock/cambio-masivo` | Cambio masivo |
| `/items/stock/consultas` | Stock a fecha / reposición / PMP |
| `/items/inventarios*` | Inventario físico (líneas + cierre) |

Multiempresa: `useConfigEmpresaScope` + `ConfigEmpresaBar`.

## Contabilidad / Rabbit

`inventario.ajuste.registrado` → ContabilidadWorker (`inventario.#`) → `sp_contabilidad_procesar_ajuste_inventario` (diario **INV**).
Cuentas: `PRODUCTO_INVENTARIO`, `PRODUCTO_AJUSTE_MERMA`, `PRODUCTO_AJUSTE_SOBRANTE`.
