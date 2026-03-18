# Auditoría – Catálogos en el Gateway

**Objetivo:** Analizar cómo el Gateway expone los catálogos que provienen de InicioNestJs para replicar el mismo patrón con el catálogo `tamano_empresa`.

**Alcance:** Solo análisis; no se modifica código.

---

## 1. Dónde se definen las queries GraphQL hacia InicioNestJs

Las queries GraphQL que el Gateway envía a InicioNestJs están definidas en **un solo archivo**:

| Archivo | Uso |
|---------|-----|
| **gateway-api/src/services/nestjs.js** | Aquí se definen las queries GraphQL (como strings) y se ejecutan contra InicioNestJs mediante `axios.post(..., { query })`. |

No existe en el Gateway una carpeta tipo `queries/` o `catalogos/` con definiciones GraphQL separadas; todo está en métodos del servicio `nestjs.js`.

---

## 2. Cómo el Gateway llama a InicioNestJs

- **Cliente:** **Axios** (HTTP), no Apollo ni fetch directo.
- **Endpoint:** `POST ${NESTJS_SERVICE_URL}/graphql` (variable de entorno `NESTJS_SERVICE_URL`).
- **Formato:** body JSON con `{ query, variables }`.

Fragmentos relevantes:

| Archivo | Línea | Fragmento |
|---------|-------|-----------|
| gateway-api/src/services/nestjs.js | 3-4 | `const NESTJS_SERVICE_URL = process.env.NESTJS_SERVICE_URL;` |
| gateway-api/src/services/nestjs.js | 11-16 | `const nestjsClient = axios.create({ baseURL: NESTJS_SERVICE_URL, timeout: TIMEOUT, headers: { 'Content-Type': 'application/json' } });` |
| gateway-api/src/services/nestjs.js | 59 | `const response = await nestjsClient.post('/graphql', { query });` |
| gateway-api/src/services/nestjs.js | 59, 84, 116, 134 | Las respuestas se leen como `response.data` (cuerpo de la respuesta GraphQL: `{ data: { ... }, errors?: ... }`). |

Además, el frontend puede llamar **directamente al endpoint GraphQL del Gateway** (ver sección 3). En ese caso:

| Archivo | Línea | Fragmento |
|---------|-------|-----------|
| gateway-api/src/routes/graphql.js | 54-56 | `const targetUrl = getTargetService(query, config);` → `config.nestjsService` para consultas que no son de terceros ni de menú. |
| gateway-api/src/routes/graphql.js | 59-69 | `const response = await axios.post(target, { query, variables, operationName }, { headers, timeout });` |

Es decir: el Gateway hace **proxy** de la petición GraphQL al backend que corresponda (InicioNestJs, TerceroNestJs o MenuNestJs). Para `paises`, `monedas`, `empresas` (y por tanto para `tamanosEmpresa`) no hay coincidencia con terceros ni menú, así que **van a InicioNestJs**.

---

## 3. Dónde se declaran las queries que usa el frontend

El frontend **no** usa un archivo central de queries del Gateway. Las queries se declaran **en cada componente** con `gql` de Apollo, y se envían al **mismo endpoint GraphQL del Gateway**:

| Archivo (frontend) | Línea | Query / Uso |
|--------------------|-------|-------------|
| frontReact/src/config/apollo-client.ts | 6-7 | `mainHttpLink`: `uri: import.meta.env.VITE_GATEWAY_URL + '/graphql'` → todas las queries de catálogos (paises, monedas, empresas) van al Gateway. |
| frontReact/src/views/empresas/secciones/SeccionEmpresa.tsx | 43-61 | `GET_MONEDAS` y `GET_PAISES` definidos con `gql` en el componente. |
| frontReact/src/views/terceros/secciones/SeccionTerceroUbicacionContacto.tsx | 20-28 | `GET_PAISES` definido en el componente. |
| frontReact/src/views/terceros/contactos/secciones/SeccionContactoDireccion.tsx | 10-18 | `GET_PAISES` definido en el componente. |
| Varios (Empresas.tsx, NuevaSucursal.tsx, etc.) | — | `GET_EMPRESAS` definido localmente en cada vista que lo necesita. |

Resumen: las queries que usa el frontend se declaran **en los componentes/vistas** (con `gql`). El Gateway **no** declara esas queries; solo las reenvía a InicioNestJs cuando el contenido del `query` no coincide con terceros ni menú.

---

## 4. Estructura de carpetas del Gateway

No existe carpeta `catalogos/` ni `queries/` ni `resolvers/` en el sentido GraphQL. La estructura relevante es:

| Carpeta / archivo | Contenido |
|-------------------|-----------|
| **gateway-api/src/routes/** | Rutas HTTP (REST): `empresas.js`, `tercero.js`, `graphql.js`, `menu.js`, etc. |
| **gateway-api/src/services/** | Lógica de llamadas a backends: `nestjs.js` (InicioNestJs), `terceroNestJs.js`, `python.js`, `menu` (vía graphql.js). |
| **gateway-api/src/schemas/** | Esquemas de validación (REST/OpenAPI), no tipos GraphQL: `empresa.js`, `tercero.js`, `perfil.js`, etc. |

Para añadir un catálogo como `tamano_empresa`:

- Si solo se usa por **GraphQL desde el frontend**: no hace falta tocar el Gateway; la query `tamanosEmpresa` ya irá a InicioNestJs por el proxy de `graphql.js`.
- Si se quiere exponer también por **REST** (como paises/empresas en tercero): hay que añadir un método en **services/nestjs.js** y, si aplica, una ruta en **routes/** (por ejemplo en `tercero.js` o en un módulo de catálogos).

---

## 5. Catálogos empresa, pais, moneda – Dónde y cómo se exponen

### 5.1 Empresa / empresas

| Capa | Archivo | Línea | Fragmento / Comportamiento |
|------|---------|-------|----------------------------|
| **Gateway – servicio** | gateway-api/src/services/nestjs.js | 43-68 | `getEmpresas()`: define la query `empresas { id_empresa nombre ruc direccion telefono email estado }`, hace `nestjsClient.post('/graphql', { query })`, devuelve `response.data`. |
| **Gateway – servicio** | gateway-api/src/services/nestjs.js | 96-128 | `getEmpresa(id)`: query `empresa(id_empresa: $id_empresa) { ... }`, `variables: { id_empresa: id }`, devuelve `response.data`. |
| **Gateway – ruta REST** | gateway-api/src/routes/empresas.js | 7-46 | `GET /api/empresas`: llama a `nestjsService.getEmpresas()`, responde con `response.data?.empresas \|\| []`. |
| **Gateway – ruta REST** | gateway-api/src/routes/empresas.js | 49-94 | `GET /api/empresas/:id`: llama a `nestjsService.getEmpresa(id)`, responde con `response.data?.empresa`. |
| **Frontend – REST** | frontReact/src/_apis_/gateway.js | 26-34 | `getEmpresas()`: `gatewayClient.get('/empresas')` (asume prefijo del Gateway). |
| **Frontend – GraphQL** | Varios (Empresas.tsx, NuevaSucursal, etc.) | — | `GET_EMPRESAS` con `gql` → `useQuery(GET_EMPRESAS)` → Apollo envía al Gateway `/graphql` → Gateway reenvía a InicioNestJs. |

### 5.2 Pais / paises

| Capa | Archivo | Línea | Fragmento / Comportamiento |
|------|---------|-------|----------------------------|
| **Gateway – servicio** | gateway-api/src/services/nestjs.js | 71-95 | `getPaises()`: query `paises { id_pais nombre codigo_iso icono }`, `nestjsClient.post('/graphql', { query })`, devuelve `response.data`. |
| **Gateway – ruta REST** | gateway-api/src/routes/tercero.js | 76-89 | `GET /api/tercero/selects/paises`: llama a `nestjsService.getPaises()`, responde con `response?.paises \|\| []`. |
| **Frontend – REST** | frontReact/src/_apis_/tercero.js | 136 | `apiClient.get('/api/tercero/selects/paises')` para un select de países. |
| **Frontend – GraphQL** | SeccionEmpresa.tsx, SeccionTerceroUbicacionContacto.tsx, SeccionContactoDireccion.tsx | — | `GET_PAISES` con `gql` → `useQuery(GET_PAISES)` → Gateway `/graphql` → InicioNestJs. |

Nota: en `tercero.js` se usa `response?.paises`. El método `getPaises()` devuelve `response.data` de axios, que es el cuerpo GraphQL `{ data: { paises: [...] } }`. Lo coherente sería `response?.data?.paises` para alinear con `empresas.js` (`response.data?.empresas`). Conviene revisar si aquí hay un bug.

### 5.3 Moneda / monedas

| Capa | Archivo | Línea | Fragmento / Comportamiento |
|------|---------|-------|----------------------------|
| **Gateway – servicio** | gateway-api/src/services/nestjs.js | — | **No existe** `getMonedas()` ni ninguna query `monedas` en el Gateway. |
| **Gateway – ruta REST** | — | — | **No hay** ruta REST para listar monedas. |
| **Frontend – GraphQL** | frontReact/src/views/empresas/secciones/SeccionEmpresa.tsx | 43-51, 65-69 | `GET_MONEDAS` con `gql` (query `monedas { id_moneda codigo nombre }`) → `useQuery(GET_MONEDAS)` → Apollo → Gateway `POST /graphql` → Gateway reenvía a InicioNestJs (por defecto). |

Conclusión: **moneda** solo se expone vía GraphQL desde el frontend; el Gateway no define ni rutas ni métodos propios para monedas, solo hace de proxy.

---

## 6. Flujo completo de ejemplo: catálogo moneda (solo GraphQL)

Flujo representativo para un catálogo que **solo** se consume por GraphQL (como `moneda` y como puede ser `tamano_empresa`):

```
Frontend (SeccionEmpresa.tsx)
  → useQuery(GET_MONEDAS)
  → Apollo (mainClient) POST a VITE_GATEWAY_URL/graphql
  → body: { query: "query GetMonedas { monedas { id_moneda codigo nombre } }" }

Gateway (routes/graphql.js)
  → POST /graphql recibe query
  → getTargetService(query, config): no coincide con terceros ni menú
  → return config.nestjsService  (InicioNestJs)
  → executeGraphQLQuery: axios.post(NESTJS_SERVICE_URL + '/graphql', { query, variables, operationName })
  → reply.send(result)

InicioNestJs
  → Resuelve la query "monedas" (MonedaResolver)
  → MonedaService.findAll()
  → Base de datos
  → Respuesta { data: { monedas: [...] } }

Gateway
  → Devuelve esa respuesta al frontend

Frontend
  → monedasData?.monedas
```

Referencias de código:

| Paso | Archivo | Línea | Fragmento |
|-----|---------|-------|-----------|
| Frontend envía query | frontReact/src/views/empresas/secciones/SeccionEmpresa.tsx | 43-51 | `const GET_MONEDAS = gql` \` query GetMonedas { monedas { id_moneda codigo nombre } } \` |
| Frontend ejecuta | frontReact/src/views/empresas/secciones/SeccionEmpresa.tsx | 65 | `const { data: monedasData, ... } = useQuery(GET_MONEDAS);` |
| Apollo URI | frontReact/src/config/apollo-client.ts | 6-7 | `uri: import.meta.env.VITE_GATEWAY_URL + '/graphql'` |
| Gateway recibe | gateway-api/src/routes/graphql.js | 81-84 | `const { query, variables, operationName } = request.body;` |
| Gateway elige backend | gateway-api/src/routes/graphql.js | 44-46 | `} else { return config.nestjsService; }` (no menu, no tercero) |
| Gateway llama a NestJS | gateway-api/src/routes/graphql.js | 59-69 | `axios.post(target, { query, variables, operationName }, ...)` |
| InicioNestJs (resolver/servicio/BD) | InicioNestJs (fuera del Gateway) | — | MonedaResolver → MonedaService → TypeORM |

---

## 7. Dónde agregar `tamanosEmpresa` sin romper el Gateway

### Opción A – Solo GraphQL (como moneda)

- **En el Gateway:** no hace falta cambiar nada. Las consultas que contengan `tamanosEmpresa` no coinciden con las condiciones de terceros ni de menú en `getTargetService`, así que se envían a InicioNestJs.
- **En InicioNestJs:** ya está implementada la query `tamanosEmpresa` (entity, service, resolver).
- **En el frontend:** en la vista donde se necesite el catálogo, definir una query con `gql` (por ejemplo `GET_TAMANOS_EMPRESA`) y usar `useQuery(GET_TAMANOS_EMPRESA)` con el mismo cliente Apollo que apunta al Gateway (`mainClient` / `VITE_GATEWAY_URL + '/graphql'`).

No se requiere ningún archivo nuevo ni cambio en rutas o servicios del Gateway para esta opción.

### Opción B – Exponer también por REST (como pais/empresas en tercero)

Para tener un endpoint tipo `GET /api/tercero/selects/tamano-empresa` (o similar):

1. **gateway-api/src/services/nestjs.js**  
   Añadir un método, por ejemplo `getTamanosEmpresa()`, que defina la query GraphQL `tamanosEmpresa { id_tamano_empresa codigo nombre descripcion orden estado }` y haga `nestjsClient.post('/graphql', { query })`, devolviendo `response.data` (igual que `getPaises()` / `getEmpresas()`).

2. **gateway-api/src/routes/tercero.js** (o la ruta que se use para selects)  
   Añadir una ruta, por ejemplo `GET /tercero/selects/tamano-empresa`, que llame a `nestjsService.getTamanosEmpresa()` y responda con `response?.data?.tamanosEmpresa ?? []` (manteniendo el mismo criterio que en `empresas.js` con `response.data?.empresas`).

Con esto, el catálogo `tamano_empresa` queda alineado con el patrón de paises/empresas en el Gateway y listo para replicar con `tamanosEmpresa`.

---

*Documento de auditoría. No se ha modificado código.*
