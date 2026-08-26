# Financiero

Servicios: `FinancieroNestJs` + `FinancieroPython` + **ContabilidadWorker** (Rabbit).

```
Factura cliente/proveedor
  → GQL facturasCliente / facturasProveedor → FinancieroNestJs
  → POST/PUT facturas → FinancieroPython
  → al validar: financiero.factura.validada → ContabilidadWorker (VT / AC)

Cobro / pago proveedor
  → GQL cobrosCliente / pagosProveedor
  → POST cobros | pagos-proveedor → FinancieroPython
  → al validar: movimiento banco + financiero.pago.registrado → diario BQ
```

Doc operativa: [docs/MODULO_FINANCIERO.md](../docs/MODULO_FINANCIERO.md).

## FinancieroNestJs

| Query | Uso |
|-------|-----|
| `facturasCliente` / `facturaCliente` | Cliente (`solo_pendientes`, `id_tercero`) |
| `facturasProveedor` / `facturaProveedor` | Proveedor |
| `cobrosCliente` / `cobroCliente` | Cobros |
| `pagosProveedor` / `pagoProveedor` | Pagos proveedor |
| `condicionesPagoFin` / `formasPagoFin` / `monedasFin` | Catálogos |

## FinancieroPython

| Método | Path | Acción |
|--------|------|--------|
| POST | `/api/facturas-clientes` | Borrador cliente |
| POST | `/api/facturas-proveedores` | Borrador proveedor |
| POST | `.../validar` | Validar + Rabbit |
| POST | `/api/cobros` | Borrador cobro |
| POST | `/api/pagos-proveedor` | Borrador pago |
| POST | `.../cobros|pagos-proveedor/:id/validar` | Banco + Rabbit |

## Front

Rutas de menú bajo `/financiero/facturas-clientes/*` y `/financiero/facturas-proveedor/*` (listado, nueva, detalle, pagos/cobros).

API: `_apis_/financiero.js`.
