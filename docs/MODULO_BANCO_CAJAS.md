# Módulo Banco / Cajas

Inspirado en el módulo bancario de Dolibarr. Código bajo `BancoCajaPython/`, `BancoCajaNestJs/` y `frontReact/src/views/banco-cajas/`.

## Servicios

| Servicio | Puerto Docker | Rol |
|----------|---------------|-----|
| BancoCajaPython | 3015 | REST escritura (bancos, cuentas, movimientos, transferencias) |
| BancoCajaNestJs | 3016 | GraphQL lectura |

Gateway: `/api` banco-caja + GraphQL (`cuentasBancarias`, `movimientosBancarios`, `transferenciasBancarias`, `bancos`, …) → **BancoCajaNestJs** (no confundir con el listado mínimo de Finanzas).

## Rutas UI

| Ruta | Pantalla |
|------|----------|
| `/banco-cajas/cuentas` | Listado cuentas |
| `/banco-cajas/cuentas/nuevo` | Alta cuenta |
| `/banco-cajas/cuentas/:id/...` | Edición / movimientos |
| `/banco-cajas/bancos` | Catálogo bancos |
| `/banco-cajas/transferencias` | Listado y alta transferencias |

## Modelo (PostgreSQL)

- `banco`, `cuenta_bancaria`, `movimiento_bancario`, `transferencia_bancaria`
- Transferencia: cabecera + par atómico de movimientos (−origen, +destino)
- Anulación de movimiento por **reversa** (`id_movimiento_reversado`); sin DELETE físico
- `tipo_cuenta`: `ahorro` | `corriente` | `caja_efectivo`

Scripts de menú/permisos: `MenuNestJs/migrations/menu-banco-cajas*.sql`.

Regla de trabajo en Cursor: `.cursor/rules/proyecto-banco-cajas.mdc`.
