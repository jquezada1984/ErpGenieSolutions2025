# Financiero

Servicios: `FinancieroNestJs` + `FinancieroPython`. Módulo **temprano**: factura cliente (borrador) y catálogos de lectura `*Fin`.

Los **diccionarios** (condiciones/formas de pago, monedas, etc.) se administran vía **Inicio** (`/api/catalogos` + pantallas de configuración); FinancieroNest expone variantes de lectura `condicionesPagoFin`, `formasPagoFin`, `monedasFin` para facturación.

```
Nueva factura cliente
  → GQL facturaCliente / *Fin → FinancieroNestJs
  → POST /api/facturas-clientes → FinancieroPython
```

## FinancieroNestJs

| Query | Uso |
|-------|-----|
| `facturaCliente(id_factura, id_empresa)` | Detalle factura |
| `condicionesPagoFin` | Condiciones para factura |
| `formasPagoFin` | Formas de pago |
| `monedasFin` | Monedas (enrutado **antes** que `monedas` de Inicio en el gateway) |

**Nota:** `cuentasBancarias` **no** vive aquí; va a BancoCajaNestJs.

## FinancieroPython

| Método | Path | Acción |
|--------|------|--------|
| POST | `/api/facturas-clientes` | Crear borrador factura cliente |

## Gateway

- `routes/financiero.js`: principalmente `POST /api/facturas-clientes` → Python.
- GraphQL: `facturaCliente` y `*Fin` → FinancieroNestJs (antes del match genérico de monedas).

## Front

| Ruta | Pantalla | Flujo |
|------|----------|-------|
| `/financiero/facturas-clientes/nueva` | `NuevaFacturaCliente.tsx` | Axios POST directo a gateway + GQL catálogos Fin / cuentas BancoCaja |
| `/financiero/configuracion/diccionarios/*` (alias `/configuracion/diccionarios/*`) | `views/financiero/configuracion/diccionarios/` | CRUD vía `_apis_/catalogos.js` → InicioPython; scope empresa |

No hay `_apis_/financiero.js` dedicado aún; la creación de factura está en la vista.
