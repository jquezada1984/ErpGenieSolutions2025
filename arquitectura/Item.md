# Item

Servicios: `ItemNestJs` + `ItemPython`. Productos y servicios (ítems). Inventarios de stock viven en módulo **Inventario** (pantallas bajo `/items/inventarios`).

```
Productos / Servicios
  → Apollo → ItemNestJs (listado, detalle, catálogos, estado)
  → REST _apis_/item.js → ItemPython (crear/actualizar + etiquetas)
```

Env: `ITEM_NEST_GQL_URL`, `ITEM_PY_BASE_URL`.

## ItemPython — REST

| Método | Path | Acción |
|--------|------|--------|
| POST | `/api/item` | Crear producto/ítem |
| PUT | `/api/item/<id>` | Actualizar producto |
| PUT | `/api/item/servicio/<id>` | Actualizar servicio |
| GET/POST | `/api/item/etiqueta-categoria` | Listar / crear etiquetas |
| PUT | `/api/item/etiqueta-categoria/<id>` | Actualizar |
| PATCH | `/api/item/etiqueta-categoria/<id>/estado` | Estado etiqueta |

**Excepción al patrón:** lectura de etiquetas-categoría también por Python (no Nest).

## ItemNestJs — GraphQL

### Items (`items.resolver.ts`)

| Operación | Tipo |
|-----------|------|
| `itemsListado` | Query (filtros empresa, tipo, estados…) |
| `itemDetalleEdicion` | Query |
| `actualizarEstadoItem` | Mutation |
| `actualizarEstadoInventario` | Mutation (relacionada inventario) |

### Catálogos (`catalogos.resolver.ts`)

`estadosVentaItem`, `estadosCompraItem`, `naturalezasItem`, `tiposControlInventarioItem`, `tiposControlCaducidadItem`, `tiposComportamientoItem`.

Catálogos compartidos (`tiposItemCatalogo`, `almacenes`, `unidades`) → **InicioNestJs** vía gateway GraphQL.

## Gateway `routes/item.js`

| Destino | Rutas |
|---------|--------|
| Nest | GET `/item/selects/*` (estados, naturaleza, controles…) |
| Python | POST `/item`, PUT producto/servicio, CRUD etiqueta-categoría |

## Front

API: `_apis_/item.js`

| Ruta UI | Pantalla | Flujo |
|---------|----------|-------|
| `/items/productos` | `Productos.tsx` | GQL `itemsListado`; mutación estado; combo empresa si GLOBAL |
| `/items/productos/nuevo` | `NuevoProducto.tsx` | REST crear; selects Nest/Inicio |
| `/items/productos/editar/:id` | `EditarProducto.tsx` | GQL detalle; REST actualizar |
| Stocks/lotes/atributos/estadísticas | `ProductosStocks*.tsx`, etc. | GQL / pantallas satélite |
| `/items/servicios` (+ nuevo/editar) | `Servicios.tsx`, … | Igual patrón + `actualizarItemServicio` |

Secciones: `SeccionItemGeneral`, `Venta`, `Compra`, `Inventario`, `Servicio`, `Contabilidad`, `Empresa`.
