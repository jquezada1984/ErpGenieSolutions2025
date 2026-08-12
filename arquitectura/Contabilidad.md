# Contabilidad

Servicios: `ContabilidadNestJs` (lectura GraphQL) + `ContabilidadPython` (escritura REST).

```
Pantallas /contabilidad/*
  → Apollo → ContabilidadNestJs  (informes, listados, planes, asientos…)
  → REST _apis_/contabilidad.js → ContabilidadPython  (config, periodos, diarios, transferencia…)
```

## ContabilidadNestJs — queries principales

| Área | Queries |
|------|---------|
| Config / maestros | `configuracionContabilidad`, `periodosContables`, `diariosContables`, `modelosPlanesContables`, `planesContablesPorModelo`, `planContableActivo`, `cuentasContablesPorPlan`, `cuentasContablesDefecto`, `cuentasIndividualesLibroAuxiliar` |
| Operativa | `asientosContablesPorEmpresa`, `estadoAreaContabilidad`, `operacionesDiarios`, `libroMayor`, `saldosPorCuenta` |
| Informes | `balanceComprobacion`, `estadoResultados`, `balanceGeneral` |
| Transferencia / vínculos | `resumenVinculacionFacturas`, `lineasRegistroContable` |
| Cuentas especiales | `cuentasBancariasContabilidad`, `cuentasIva`, `cuentasImpuesto`, `gruposCuentaPersonalizado` |

## ContabilidadPython — escritura

Recursos típicos (vía gateway): periodos, diarios, modelos/planes, cuentas, configuración, cuentas por defecto, exportar, IVA/impuestos/grupos, cuentas bancarias contables, transferencia (vincular facturas, registro, exportar documentos).

## Gateway

- Rutas: `routes/contabilidad.js` — prefijos `/configuracion-contabilidad`, `/periodos-contables`, `/diarios-contables`, `/modelos-planes-contables`, `/cuentas-contables`, `/transferencia-contable/*`, etc.
- GraphQL: bloque grande de nombres `*Contabilidad*` / informes → ContabilidadNestJs.

## Front

API: `_apis_/contabilidad.js`  
Vistas: `views/contabilidad/`

| Zona | Rutas UI (ejemplos) | Pantallas |
|------|---------------------|-----------|
| Área / operativa | `/contabilidad`, asientos, libro-mayor, diarios, saldo-cuenta, exportar, cerrar | `operativa/*` |
| Informes | `/contabilidad/informes` | `informes/InformesContables` |
| Configuración | periodos, diarios, modelos, cuentas, IVA, impuestos, bancos contables, grupos | `PeriodosContables`, `configuracion/*`, … |
| Transferencia | facturas clientes/proveedores, registro ventas/compras/banco, exportar docs | `transferencia/*` |

Flujo típico: abrir pantalla → GQL carga estado/listados → acciones de guardar/cerrar/vincular → REST Python.
