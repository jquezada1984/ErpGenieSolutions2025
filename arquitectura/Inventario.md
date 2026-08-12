# Inventario

Servicios: `InventarioNestJs` + `InventarioPython`. UI bajo el menú de ítems (`/items/inventarios`).

```
Inventarios.tsx
  → Apollo inventariosListado / inventarioPorId → InventarioNestJs
  → REST crear/actualizar → InventarioPython
```

## InventarioPython

| Método | Path | Acción |
|--------|------|--------|
| POST | `/api/inventario` | Crear |
| PUT | `/api/inventario/<id>` | Actualizar |
| PATCH | `/api/inventario/estado` | Cambiar estado (si expuesto) |

## InventarioNestJs

| Operación | Tipo | Notas |
|-----------|------|-------|
| `inventariosListado` | Query | Filtros empresa, almacén, estado… |
| `inventarioPorId` | Query | Detalle |
| `actualizarEstadoInventario` | Mutation | **Excepción:** cambio de estado por Nest |

## Gateway

- `routes/inventario.js`: **POST/PUT** → Python.
- GraphQL: `inventariosListado`, `inventarioPorId`, mutación estado → InventarioNestJs.

## Front

- API: `_apis_/inventario.js` (`crearInventario`, `actualizarInventario`)
- Vistas: `views/items/inventarios/`

| Ruta | Pantalla | Flujo |
|------|----------|-------|
| `/items/inventarios` | `Inventarios.tsx` | GQL listado + empresa |
| `/items/inventarios/nuevo` | `NuevoInventario.tsx` | REST crear; selects ítems/almacenes (Item/Inicio) |
| `/items/inventarios/editar/:id` | `EditarInventario.tsx` | GQL detalle; REST actualizar |
