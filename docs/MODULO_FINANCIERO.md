# Módulo Financiero

Estado **P0**: facturas cliente, cobros, facturas proveedor y pagos a proveedor, con enlace asíncrono a Contabilidad vía RabbitMQ.

## Servicios

| Servicio | Puerto | Rol |
|----------|--------|-----|
| FinancieroPython | 5001 | REST escritura (facturas, cobros, pagos) |
| FinancieroNestJs | 3007 | GraphQL lectura |
| ContabilidadWorker | — | Consume `financiero.#` |
| RabbitMQ | 5672 / UI 15672 | Exchange `erp.events` |

Gateway: `POST/PUT` → Python; GraphQL → Nest. El front solo habla con el gateway.

## Flujos

```
Validar factura cliente/proveedor
  → estado=VALIDADA + número FC-/FP-YYYY-######
  → Rabbit financiero.factura.validada (tipo cliente|proveedor)
  → ContabilidadWorker → procesar-factura (diario VT / AC)

Validar cobro / pago proveedor
  → movimiento bancario INGRESO / EGRESO (numero_documento = numero_pago)
  → Rabbit financiero.pago.registrado
  → ContabilidadWorker → procesar-pago (diario BQ)
```

La UI **no espera** al asiento. Si Rabbit no está configurado, la validación responde OK y el evento se omite.

## Estados

Factura y pago: `BORRADOR` | `VALIDADA` | `ANULADA`.

Anular factura está bloqueado si hay líneas `transferido` o cobros/pagos `VALIDADA`. Anular un pago `VALIDADA` revierte el movimiento de banco si aún no hay `id_asiento_contable`.

Números: cobros `COB-YYYY-######`, pagos proveedor `PAG-YYYY-######`.

## API REST (vía gateway `/api`)

| Método | Path | Acción |
|--------|------|--------|
| POST | `/facturas-clientes` | Borrador cliente (+ `lineas[]`) |
| PUT | `/facturas-clientes/:id/lineas` | Reemplazar líneas (BORRADOR) |
| POST | `/facturas-clientes/:id/validar` | Validar + evento |
| POST | `/facturas-clientes/:id/anular` | Anular |
| POST | `/facturas-proveedores` | Borrador proveedor |
| PUT | `/facturas-proveedores/:id/lineas` | Reemplazar líneas |
| POST | `/facturas-proveedores/:id/validar` | Validar + evento tipo proveedor |
| POST | `/facturas-proveedores/:id/anular` | Anular |
| POST | `/cobros` | Borrador cobro (aplica facturas) |
| POST | `/cobros/:id/validar` | Banco INGRESO + evento |
| POST | `/cobros/:id/anular` | Anular / reversa banco |
| POST | `/pagos-proveedor` | Borrador pago proveedor |
| POST | `/pagos-proveedor/:id/validar` | Banco EGRESO + evento |
| POST | `/pagos-proveedor/:id/anular` | Anular / reversa banco |

Body cobro/pago:

```json
{
  "id_tercero": "uuid",
  "id_cuenta_bancaria": "uuid",
  "id_moneda": "uuid",
  "fecha_pago": "2026-08-22",
  "concepto": "...",
  "aplicaciones": [{ "id_factura": "uuid", "monto_aplicado": 100 }]
}
```

## GraphQL

| Query | Uso |
|-------|-----|
| `facturasCliente` / `facturaCliente` | Listado y detalle cliente (`solo_pendientes`, `id_tercero`) |
| `facturasProveedor` / `facturaProveedor` | Igual para proveedor |
| `cobrosCliente` / `cobroCliente` | Cobros |
| `pagosProveedor` / `pagoProveedor` | Pagos a proveedor |
| `condicionesPagoFin` / `formasPagoFin` / `monedasFin` | Catálogos |

Búsqueda de terceros: `clientesBusqueda` / `proveedoresBusqueda` (TerceroNestJs). Cuentas: `cuentasBancarias` (BancoCajaNestJs).

## Frontend (rutas de menú)

| Ruta | Pantalla |
|------|----------|
| `/financiero/facturas-clientes/listado` | Listado facturas cliente |
| `/financiero/facturas-clientes/nueva` | Alta con líneas |
| `/financiero/facturas-clientes/:id` | Detalle, validar, anular, registrar cobro |
| `/financiero/facturas-clientes/pagos` | Listado cobros |
| `/financiero/facturas-clientes/pagos/nuevo` | Nuevo cobro |
| `/financiero/facturas-clientes/pagos/:id` | Detalle cobro |
| `/financiero/facturas-proveedor/listado` | Listado facturas proveedor |
| `/financiero/facturas-proveedor/nueva` | Alta con líneas |
| `/financiero/facturas-proveedor/:id` | Detalle, validar, anular, registrar pago |
| `/financiero/facturas-proveedor/pagos` | Listado pagos proveedor |
| `/financiero/facturas-proveedor/pagos/nuevo` | Nuevo pago |
| `/financiero/facturas-proveedor/pagos/:id` | Detalle pago |
| `/financiero/configuracion/diccionarios/*` | Diccionarios |

API front: `frontReact/src/_apis_/financiero.js`. Multiempresa: `useConfigEmpresaScope` + `ConfigEmpresaBar`.

PDF y correo: [DOCUMENTOS_Y_MAIL.md](./DOCUMENTOS_Y_MAIL.md) (DocumentApi ReportLab + MailWorker Rabbit).

## Pendiente (P1+)

- Plantillas recurrentes y estadísticas de pantalla
- Conciliación / remesas
- Impuestos y salarios

Ver también: [MODULO_CONTABILIDAD.md](./MODULO_CONTABILIDAD.md), [ARQUITECTURA_RABBIT_WORKERS.md](./ARQUITECTURA_RABBIT_WORKERS.md).
