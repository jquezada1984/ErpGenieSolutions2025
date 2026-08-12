# BancoCaja

Servicios: `BancoCajaPython` (escritura, puerto típico **3015**) + `BancoCajaNestJs` (lectura GraphQL, **3016**).

```
Pantalla banco-cajas
  → Apollo /graphql  → gateway → BancoCajaNestJs   (listados/detalle)
  → REST _apis_/bancoCaja.js → gateway → BancoCajaPython  (CRUD)
```

## Entidades / tablas

`banco`, `cuenta_bancaria`, `movimiento_bancario`, `transferencia_bancaria`.

## BancoCajaPython — web services REST

Prefijo `/api`. Headers: `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso`.

| Archivo | Método | Path | Acción |
|---------|--------|------|--------|
| `api/banco_routes.py` | POST | `/api/banco` | Crear banco |
| | PUT/PATCH | `/api/banco/<id>` | Actualizar |
| | DELETE | `/api/banco/<id>` | Soft-delete / desactivar |
| `api/cuenta_bancaria_routes.py` | POST | `/api/cuenta-bancaria` | Crear cuenta |
| | PUT/PATCH | `/api/cuenta-bancaria/<id>` | Actualizar |
| | DELETE | `/api/cuenta-bancaria/<id>` | Eliminar/desactivar |
| `api/movimiento_bancario_routes.py` | POST | `/api/movimiento-bancario` | Alta movimiento (actualiza saldo) |
| | PUT/PATCH | `/api/movimiento-bancario/<id>` | Actualizar (sin editar monto según reglas) |
| | DELETE | `/api/movimiento-bancario/<id>` | Anular (reversa) |
| `api/transferencia_bancaria_routes.py` | POST | `/api/transferencia-bancaria` | Crear (par de movimientos atómico) |
| | DELETE | `/api/transferencia-bancaria/<id>` | Anular transferencia |

Services: `banco_service`, `cuenta_bancaria_service`, `movimiento_bancario_service`, `transferencia_bancaria_service`.

## BancoCajaNestJs — GraphQL (solo lectura)

Módulos: `Banco`, `CuentaBancaria`, `MovimientoBancario`, `TransferenciaBancaria`. **Sin mutations.**

| Query | Uso |
|-------|-----|
| `bancos(soloActivos)` / `banco(id_banco)` | Catálogo bancos |
| `cuentasBancarias(id_empresa)` / `cuentaBancaria(...)` | Cuentas |
| `movimientosBancarios(id_cuenta_bancaria, …)` / `movimientoBancario` | Extracto |
| `transferenciasBancarias(id_empresa, …)` / `transferenciaBancaria` | Transferencias |

## Gateway

- Rutas: `gateway-api/src/routes/banco-caja.js` (prefix `/api`).
- **GET** → Nest; **POST/PUT/DELETE** → Python.
- Env: `BANCO_CAJA_NEST_GQL_URL`, `BANCO_CAJA_PY_BASE_URL`.
- GraphQL: queries `bancos|cuentasBancarias|movimientosBancarios|transferenciasBancarias|…` → Nest.

## Front — pantallas y flujo

API: `frontReact/src/_apis_/bancoCaja.js`  
Vistas: `frontReact/src/views/banco-cajas/`

| Ruta UI | Pantalla | Lectura | Escritura |
|---------|----------|---------|-----------|
| `/banco-cajas/bancos` | `Bancos.tsx` | REST listar bancos (y/o GQL) | REST CRUD banco |
| `/banco-cajas/cuentas` | `CuentasBancarias.tsx` | GQL `cuentasBancarias` | — |
| `/banco-cajas/cuentas/nuevo` | `NuevoCuentaBancaria.tsx` | GQL auxiliares (empresas, monedas, banco…) | REST crear cuenta |
| `/banco-cajas/cuentas/editar/:id` | `EditarCuentaBancaria.tsx` | GQL `cuentaBancaria` | REST actualizar |
| `/banco-cajas/cuentas/:id/movimientos` | `MovimientosCuenta.tsx` | GQL movimientos | REST anular |
| `…/movimientos/nuevo` | `NuevoMovimientoBancario.tsx` | GQL cuenta | REST crear movimiento |
| `/banco-cajas/transferencias` | `Transferencias.tsx` | GQL transferencias | REST anular |
| `/banco-cajas/transferencias/nuevo` | `NuevaTransferencia.tsx` | GQL cuentas | REST crear |

Secciones de formulario: `secciones/SeccionCuenta*.tsx` (empresa, general, datos bancarios, propietario, saldos). Multiempresa: `SeccionCuentaEmpresa` + regla GLOBAL/EMPRESA.
