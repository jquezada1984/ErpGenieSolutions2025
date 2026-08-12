# Gateway (`gateway-api`)

Punto único de entrada para el front. Puerto **3002**.

## Responsabilidad

- Exponer **REST** bajo `/api/*` y **GraphQL** en `POST /graphql`.
- Enrutar lecturas a NestJS y escrituras a Python por dominio.
- Propagar contexto multiempresa: `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso` (`utils/requestContext.js` → `ctxHeaders`).
- CORS, helmet, multipart (uploads hasta 10 MB).

## Registro de rutas (`src/app.js`)

| Prefijo | Archivo ruta | Dominio |
|---------|--------------|---------|
| `/api` | `empresas.js` | Inicio |
| `/api` | `perfil.js` | Inicio |
| `/api` | `sucursal.js` | Inicio |
| `/api` | `usuarios.js` | Inicio |
| `/api` | `catalogos.js` | Inicio (diccionarios) |
| `/api` | `tercero.js` | Tercero |
| `/api` | `contacto.js` | Tercero |
| `/api` | `socio.js` | Tercero |
| `/api` | `item.js` | Item |
| `/api` | `inventario.js` | Inventario |
| `/api` | `banco-caja.js` | BancoCaja |
| `/api` | `contabilidad.js` | Contabilidad |
| `/api` | `financiero.js` | Financiero |
| `/api` | `menu.js` | Menú (escritura → InicioPython) |
| `/api` | `media.js` | Media |
| `/api` | `directorio.js` | Media |
| `/api` | `estadoArchivo.js` | Media |
| `/api` | `health.js` | Health |
| `` | `graphql.js` | Proxy GraphQL a Nest del dominio |

## GraphQL — `getTargetService` (`routes/graphql.js`)

El gateway inspecciona el texto de la query/mutation y elige el Nest:

| Señales en la query | Destino |
|---------------------|---------|
| `login`, `register`, `refreshToken`, `validateToken` | InicioNestJs |
| `facturaCliente`, `*Fin` (condiciones/formas/monedas) | FinancieroNestJs |
| Contabilidad (`periodosContables`, `libroMayor`, …) | ContabilidadNestJs |
| `terceros`, `socios`, `contactosByTercero`, … | TerceroNestJs |
| `bancos`, `cuentasBancarias`, `movimientosBancarios`, … | BancoCajaNestJs |
| `itemsListado`, `itemDetalleEdicion`, catálogos ítem | ItemNestJs |
| `inventariosListado`, `inventarioPorId`, `actualizarEstadoInventario` | InventarioNestJs |
| `menu`, `permiso`, `autorizacion`, … | MenuNestJs |
| `paises`, `provincias`, `monedas` (no `monedasFin`), default | InicioNestJs |

Orden importa: p. ej. Financiero **antes** de `monedas` de Inicio (evitar que `monedasFin` vaya a Inicio).

## Servicios cliente (`src/services/`)

Cada dominio tiene típicamente:

- `{dominio}NestJs.js` — POST GraphQL al Nest interno.
- `{dominio}Python.js` — HTTP REST al Python interno.

Variables de entorno típicas: `{DOMINIO}_NEST_GQL_URL`, `{DOMINIO}_PY_BASE_URL`, timeouts.

## Flujo típico

```
Front REST GET  /api/recurso     → Nest (vía servicio GraphQL o proxy)
Front REST POST /api/recurso     → Python
Front Apollo POST /graphql       → Nest del dominio (según getTargetService)
```

## Seguridad `scope_acceso`

En rutas de usuarios: si el JWT no es `GLOBAL`, el gateway elimina `scope_acceso` del body antes de llamar a Python (ver `Plan/PLAN_SCOPE_ACCESO_USUARIOS.md`).
