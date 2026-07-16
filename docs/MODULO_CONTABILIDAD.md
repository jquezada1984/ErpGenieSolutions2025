# Módulo Contabilidad

Estado **implementado** (Fases 1–5 del plan maestro). Detalle de alcance y checklist: [planes/PLAN_CONTABILIDAD_COMPLETO.md](./planes/PLAN_CONTABILIDAD_COMPLETO.md).

## Servicios

| Servicio | Puerto Docker | Rol |
|----------|---------------|-----|
| ContabilidadPython | 5002 | REST escritura (config, periodos, diarios, cuentas, transferencia, exportar) |
| ContabilidadNestJs | 3005 | GraphQL lectura (config, plan, operativa, reportes) |

Gateway: rutas `/api/*` contables + queries GraphQL enrutadas a ContabilidadNestJs.

## Frontend (`frontReact/src/views/contabilidad/`)

| Área | Rutas |
|------|-------|
| Área / operativa | `/contabilidad`, asientos, libro-mayor, diarios, saldo-cuenta, exportar, cerrar, informes |
| Configuración | `/contabilidad/configuracion/*` (general, periodo, diarios, modelos, plan, cuentas defecto/IVA/impuestos/bancos/productos, cierre, grupos) |
| Transferencia | `/contabilidad/transferencia/*` (facturas clientes/proveedores, registro VT/AC/BQ, exportar documentos) |

## Migraciones relevantes

- `ContabilidadNestJs/migrations/11_config_contable_cierre_grupos_bancos.sql`
- `ContabilidadNestJs/migrations/12_transferencia_contable.sql`
- `ContabilidadNestJs/migrations/13_operativa_contabilidad.sql`
- Seeds 07–10 (periodo, plan EC, diarios, cuentas defecto)

## Reglas de negocio (resumen)

- Asientos con partida doble; numeración según `numeracion_modelo` en config.
- Transferencia: vincular líneas de factura → registrar en diarios VT/AC; banco BQ desde movimientos bancarios.
- Anulación / cierre de periodo vía REST de periodos.
- Exportar contabilidad marca `fecha_exportacion` en movimientos.
