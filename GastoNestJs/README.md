# GastoNestJs — lectura GraphQL del módulo Gastos

**Solo lectura.** Escritura = `GastoPython`.

Puerto: **3017** (no publicar al host cuando se integre Docker; acceso vía Gateway).

## Queries

| Query | Args | Notas |
|-------|------|-------|
| `categoriasGasto` | `id_empresa!`, `solo_activos` (default true) | Filtra empresa |
| `categoriaGasto` | `id_categoria_gasto!`, `id_empresa!` | NOT FOUND unificado |
| `gastos` | `id_empresa!` + filtros opcionales | Sin detalles (evita N+1) |
| `gasto` | `id_gasto!`, `id_empresa!` | Cabecera + detalles |

Filtros opcionales de `gastos`: `estado_gasto`, `fecha_desde`, `fecha_hasta`, `id_categoria_gasto`, `id_tercero`.

## Multiempresa

Toda consulta exige `id_empresa`. Detalle: `id AND id_empresa` (no leak cross-company).

Futuro Gateway: validar que `id_empresa` GraphQL coincida con `X-Company-Id` efectivo.

## Arranque

```bash
cd GastoNestJs
npm install --legacy-peer-deps
# .env con DATABASE_URL
npm run start:dev
```

## Tests

```bash
npm test
```
