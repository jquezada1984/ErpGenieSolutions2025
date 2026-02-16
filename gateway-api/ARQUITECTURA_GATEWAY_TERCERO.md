# Cómo trabaja el Gateway API en la parte de Tercero y su enlace con TerceroPython, TerceroNestJs y frontReact

Documento para replicar el mismo patrón en **Producto**: cómo el gateway une el front con los microservicios de escritura (Python) y de lectura/catálogos (NestJS).

---

## 1. Visión general

El **gateway-api** es una API única que recibe todas las peticiones del front (frontReact) y las reenvía al microservicio que corresponda:

- **TerceroPython** (Flask, puerto 3004): **escritura** de terceros (crear, actualizar, eliminar). Se llama por **REST**.
- **TerceroNestJs** (NestJS, puerto 3001): **lectura** de terceros y **catálogos** (tipos de tercero, condiciones de pago, formas de pago, países, empresas, etc.). Se llama por **GraphQL** desde el gateway (el gateway hace la petición GraphQL al NestJS y devuelve la respuesta al front).

El front puede hablar con el gateway de dos formas:

1. **REST** (`/api/tercero/*`): el front usa axios y el archivo `_apis_/tercero.js`; el gateway tiene rutas en `routes/tercero.js` que deciden si reenviar a Python (POST/PUT/DELETE) o a NestJS (GET).
2. **GraphQL** (`/graphql`): el front usa Apollo Client apuntando a `VITE_GATEWAY_URL/graphql`; el gateway en `routes/graphql.js` inspecciona la query y reenvía a TerceroNestJs (o a otro servicio) según el contenido.

Así, **lectura y catálogos → TerceroNestJs**; **crear/actualizar/eliminar tercero → TerceroPython**.

---

## 2. Estructura de archivos del gateway (parte tercero)

```
gateway-api/
├── src/
│   ├── app.js                    # Fastify, CORS, registro de rutas (incluye routes/tercero)
│   ├── routes/
│   │   ├── tercero.js            # Rutas REST /api/tercero: GET → NestJS, POST/PUT/DELETE → Python
│   │   └── graphql.js            # POST /graphql: reenvía a NestJS/Menu/Inicio según contenido de la query
│   ├── services/
│   │   ├── terceroPython.js      # Cliente HTTP hacia TerceroPython (REST): crear, actualizar, eliminar
│   │   └── terceroNestJs.js      # Cliente HTTP hacia TerceroNestJs (GraphQL): listar, obtener, catálogos
│   └── schemas/
│       └── tercero.js            # Esquemas Fastify (JSON Schema) para validar body en POST/PUT
├── ARQUITECTURA_GATEWAY_TERCERO.md   # Este documento
└── (env: TERCERO_PY_BASE_URL, TERCERO_NEST_GQL_URL, etc.)
```

---

## 3. Registro en app.js

En `app.js` se hace:

- Cargar config (puerto, URLs de servicios, CORS).
- Validar que existan `PYTHON_SERVICE_URL`, `NESTJS_SERVICE_URL`, `MENU_SERVICE_URL` (el gateway usa varias URLs; para tercero se usan variables propias en los servicios).
- Registrar las rutas con prefijo `/api`:
  - `fastify.register(require('./routes/tercero'), { prefix: '/api' });`
- Registrar la ruta GraphQL sin prefijo:
  - `fastify.register(require('./routes/graphql'), { prefix: '' });`

Con eso, las rutas de tercero quedan bajo **`/api/tercero`** y **`/api/tercero/:id`**, y las de selects bajo **`/api/tercero/selects/...`**. La ruta **`/graphql`** es la que usa Apollo en el front cuando hace queries/mutations de terceros (entre otros).

---

## 4. Rutas de tercero: `routes/tercero.js`

Este archivo define **quién atiende cada operación**: lectura y catálogos → **terceroNestJs**; escritura → **terceroPython**.

### 4.1 Lectura (NestJS)

- **GET /api/tercero**  
  - Llama a `terceroNestJs.listarTerceros(request)`.  
  - El servicio terceroNestJs hace una petición **GraphQL** al TerceroNestJs (`query { terceros { ... } }`) y devuelve el array.  
  - El gateway devuelve ese array al front con código 200.

- **GET /api/tercero/:id**  
  - Llama a `terceroNestJs.obtenerTercero(request.params.id, request)`.  
  - El servicio hace `query { tercero(id_tercero: $id_tercero) { ... } }` al TerceroNestJs y devuelve el objeto.  
  - El gateway responde con ese objeto (200) o con el error que devuelva el NestJS (status y payload del error).

### 4.2 Catálogos / selects (NestJS)

Todas estas rutas solo leen datos; el gateway delega en **terceroNestJs**, que a su vez llama por GraphQL al TerceroNestJs:

- **GET /api/tercero/selects/tipo-tercero** → `terceroNestJs.listarTiposTercero(request)` (query `tiposTercero`)
- **GET /api/tercero/selects/condicion-pago** → `terceroNestJs.listarCondicionesPago(request)` (query `condicionesPago`)
- **GET /api/tercero/selects/forma-pago** → `terceroNestJs.listarFormasPago(request)` (query `formasPago`)
- **GET /api/tercero/selects/paises** → `terceroNestJs.listarPaises(request)` (query `paises`)
- **GET /api/tercero/selects/empresas** → `terceroNestJs.listarEmpresas(request)` (query `empresas`)

(En el servicio existe también `listarIncoterms`; si se quiere exponer en el front, basta con añadir en `tercero.js` una ruta GET que lo llame.)

### 4.3 Escritura (Python)

- **POST /api/tercero**  
  - Valida el body con `terceroCreateSchema` (schemas/tercero.js).  
  - Llama a `terceroPython.crearTercero(request.body, request)`.  
  - El servicio terceroPython hace **POST** a `TERCERO_PY_BASE_URL/api/tercero` con el body y los headers de contexto (X-Company-Id, X-User-Id).  
  - El gateway devuelve la respuesta de TerceroPython (201) o el error (status y payload del Python).

- **PUT /api/tercero/:id**  
  - Valida body con `terceroUpdateSchema` y params (id).  
  - Llama a `terceroPython.actualizarTercero(request.params.id, request.body, request)`.  
  - El servicio hace **PUT** a `TERCERO_PY_BASE_URL/api/tercero/{id}`.  
  - El gateway devuelve la respuesta (200) o el error.

- **DELETE /api/tercero/:id**  
  - Valida params (id).  
  - Llama a `terceroPython.eliminarTercero(request.params.id, request)`.  
  - El servicio hace **DELETE** a `TERCERO_PY_BASE_URL/api/tercero/{id}`.  
  - El gateway devuelve la respuesta (200) o el error.

En todos los casos, si el servicio subyacente (Python o NestJS) devuelve un status de error, el gateway hace `reply.code(status).send(payload)` con ese status y el cuerpo de la respuesta (por ejemplo `err.response?.data`).

---

## 5. Servicio TerceroPython: `services/terceroPython.js`

- **Base URL**: `process.env.TERCERO_PY_BASE_URL || 'http://localhost:3004'` (Flask en 3004).
- **Cliente**: axios con `baseURL`, `timeout: 15000`.
- **Headers de contexto**: función `ctxHeaders(req, body)` que arma:
  - `X-Company-Id`: de headers del request o de `body.id_empresa`.
  - `X-User-Id`: de headers del request.
  Esos mismos headers los espera TerceroPython para multitenancy/auditoría.

Funciones exportadas:

- **crearTercero(body, req)**  
  - Añade headers con `ctxHeaders(req, body)` y hace `POST /api/tercero` con el body.  
  - Devuelve `res.data` (lo que devuelve TerceroPython).

- **actualizarTercero(idTercero, body, req)**  
  - `PUT /api/tercero/{idTercero}` con body y headers de contexto.  
  - Devuelve `res.data`.

- **eliminarTercero(idTercero, req)**  
  - `DELETE /api/tercero/{idTercero}` con headers de contexto.  
  - Devuelve `res.data`.

Para **producto**: crear `services/productoPython.js` con la misma idea (BASE_URL del ProductoPython, ctxHeaders, crear/actualizar/eliminar) y rutas que coincidan con las del backend Python (por ejemplo `/api/producto`, `/api/producto/:id`).

---

## 6. Servicio TerceroNestJs: `services/terceroNestJs.js`

- **Base URL**: `process.env.TERCERO_NEST_GQL_URL || 'http://tercero-nestjs-service:3001'` (NestJS en 3001).
- **Cliente**: axios con `baseURL` y `timeout` (configurable con `TERCERO_NEST_TIMEOUT`).
- **Headers**: `ctxHeaders(req)` con `Content-Type: application/json`, `X-Company-Id`, `X-User-Id`, `Authorization`. Se envían en cada petición a `/graphql`.

Función interna:

- **gqlRequest(query, variables, req)**  
  - Hace `POST {BASE_URL}/graphql` con `{ query, variables }` y los headers.  
  - Si `res.data.errors` existe, lanza un error con el mensaje de GraphQL y adjunta `response: { status: 400, data: res.data }`.  
  - Si todo va bien, devuelve `res.data.data` (el objeto con las queries/mutations resueltas).

Funciones exportadas (todas usan `gqlRequest` y devuelven el dato ya extraído):

- **listarTerceros(req)** – query `terceros { ... }` → devuelve array.
- **obtenerTercero(id_tercero, req)** – query `tercero(id_tercero: $id_tercero) { ... }` → devuelve un objeto.
- **listarTiposTercero(req)** – query `tiposTercero`.
- **listarCondicionesPago(req)** – query `condicionesPago`.
- **listarFormasPago(req)** – query `formasPago`.
- **listarIncoterms(req)** – query `incoterms`.
- **listarPaises(req)** – query `paises`.
- **listarEmpresas(req)** – query `empresas`.

Para **producto**: crear `services/productoNestJs.js` con la misma estructura (BASE_URL del ProductoNestJs, `gqlRequest`, y funciones que llamen a las queries/mutations del schema de producto: listar productos, obtener producto, catálogos si los hay).

---

## 7. Schemas de validación: `schemas/tercero.js`

- **terceroCreateSchema**: objeto JSON Schema con `required: ['nombre']` y `properties` para todos los campos que puede recibir el crear (roles, nombre, apodo, códigos, contacto, comercial, etc.). Se usa en la ruta POST para validar el body antes de enviarlo a Python.
- **terceroUpdateSchema**: mismo conjunto de propiedades (para actualización parcial), con `minProperties: 1`.

Se exportan y en `routes/tercero.js` se usan en `schema: { body: terceroCreateSchema }` y `schema: { body: terceroUpdateSchema, params: ... }`.

Para **producto**: crear `schemas/producto.js` con `productoCreateSchema` y `productoUpdateSchema` y usarlos en las rutas POST/PUT de producto.

---

## 8. Ruta GraphQL del gateway: `routes/graphql.js`

- **POST /graphql**  
  - Recibe `query`, `variables`, `operationName` del body.  
  - Usa una función **getTargetService(query, config)** que inspecciona el texto de la query para decidir a qué servicio reenviar:
    - Si la query contiene (entre otros) `terceros`, `tercero(`, `tiposTercero`, `condicionesPago`, `formasPago`, `empresas`, `paises`, `incoterms` → se usa **terceroNestJsService** (TerceroNestJs).
    - Otras consultas pueden ir a MenuNestJs o InicioNestJs según las cadenas que se busquen.
  - La URL de TerceroNestJs es `config.terceroNestJsService = process.env.TERCERO_NEST_GQL_URL || 'http://tercero-nestjs-service:3001'`.
  - Se hace `POST {terceroNestJsService}/graphql` con la misma query, variables y operationName, y se reenvían headers (p. ej. Authorization). La respuesta del NestJS se devuelve tal cual al cliente.

Así, cuando el front (Apollo) envía una query que contiene `terceros` o `tercero(id_tercero)`, etc., el gateway la reenvía automáticamente a TerceroNestJs sin que el front tenga que conocer la URL del microservicio.

Para **producto**: en `getTargetService` añadir condiciones que detecten queries de producto (por ejemplo si `query` incluye `productos`, `producto(`, o los nombres de catálogos de producto) y hacer que en esos casos se use la URL del ProductoNestJs (variable de entorno tipo `PRODUCTO_NEST_GQL_URL`).

---

## 9. Cómo se enlaza con frontReact

### 9.1 Variables de entorno (front)

- **VITE_GATEWAY_URL**: URL base del gateway (ej. `http://localhost:3002`). Se usa para REST y para GraphQL.
- El cliente Apollo usa `VITE_GATEWAY_URL + '/graphql'` como URI (ver `config/apollo-client.ts`: `mainHttpLink`).

### 9.2 API REST de tercero: `frontReact/src/_apis_/tercero.js`

- Crea un **axios** con `baseURL: VITE_GATEWAY_URL` (por defecto `http://localhost:3002`).
- Interceptores: añaden `Authorization` (Bearer token) y, si vienen en el token, `X-Company-Id` y `X-User-Id` en cada petición.
- **Consultas (GET)** – todas van al gateway y el gateway llama a TerceroNestJs:
  - `listarTerceros()` → `GET /api/tercero`
  - `obtenerTercero(id)` → `GET /api/tercero/${id}`
  - `listarTiposTercero()` → `GET /api/tercero/selects/tipo-tercero`
  - `listarCondicionesPago()` → `GET /api/tercero/selects/condicion-pago`
  - `listarFormasPago()` → `GET /api/tercero/selects/forma-pago`
  - `listarIncoterms()` → `GET /api/tercero/selects/incoterms` (si la ruta está expuesta en el gateway)
  - `listarPaises()` → `GET /api/tercero/selects/paises`
  - (listarEmpresas se puede añadir igual si el gateway expone la ruta)
- **Escritura (POST/PUT/DELETE)** – van al gateway y el gateway llama a TerceroPython:
  - `crearTercero(terceroData)` → `POST /api/tercero`
  - `actualizarTercero(id, terceroData)` → `PUT /api/tercero/${id}`
  - `eliminarTercero(id)` → `DELETE /api/tercero/${id}`

Las vistas que usan solo REST (por ejemplo **NuevoTercero.tsx**) importan estas funciones y no hablan nunca directamente con Python ni NestJS.

### 9.3 GraphQL (Apollo) desde el front

- **Apollo Client** está configurado con `mainClient` que apunta a `VITE_GATEWAY_URL + '/graphql'`.
- Cualquier componente que use `useQuery` o `useLazyQuery` con una query que contenga `terceros`, `tercero(`, etc., envía la petición al **gateway** `/graphql`; el gateway la reenvía a **TerceroNestJs** y devuelve la respuesta.
- Ejemplo: **Terceros.tsx** usa `useLazyQuery(GET_TERCEROS)` con la query `query GetTerceros { terceros { id_tercero nombre ... } }`. Esa petición va a gateway → graphql.js → TerceroNestJs, y el listado se pinta en la tabla.

Resumen:

- **Listado de terceros** en la UI puede hacerse por REST (llamando a `listarTerceros()` de `_apis_/tercero.js`) o por GraphQL (como en Terceros.tsx con Apollo). En ambos casos el gateway es el único punto de entrada.
- **Crear tercero** (NuevoTercero.tsx) usa solo REST: `crearTercero(cleanedData)` → gateway → TerceroPython.

---

## 10. Variables de entorno del gateway (tercero)

- **TERCERO_PY_BASE_URL**: URL base de TerceroPython (ej. `http://localhost:3004` o `http://tercero-python:3004` en Docker).
- **TERCERO_NEST_GQL_URL**: URL base de TerceroNestJs (ej. `http://localhost:3001` o `http://tercero-nestjs-service:3001`).
- **TERCERO_NEST_TIMEOUT** (opcional): timeout en ms para las peticiones al NestJS (por defecto 10000).

El gateway también usa `PYTHON_SERVICE_URL`, `NESTJS_SERVICE_URL`, `MENU_SERVICE_URL` para otras rutas y para el proxy GraphQL (graphql.js usa `terceroNestJsService` por separado para las queries de terceros).

---

## 11. Flujo resumido (tercero)

1. **Front (REST)**  
   Usuario crea un tercero en NuevoTercero → `crearTercero(data)` → axios POST a `VITE_GATEWAY_URL/api/tercero` con headers (token, X-Company-Id, X-User-Id) → **gateway** `routes/tercero.js` → valida body con `terceroCreateSchema` → **terceroPython.crearTercero** → HTTP POST a TerceroPython `/api/tercero` → TerceroPython persiste y responde → gateway devuelve esa respuesta al front.

2. **Front (REST) – listado**  
   Vista llama `listarTerceros()` → GET `VITE_GATEWAY_URL/api/tercero` → **gateway** `routes/tercero.js` → **terceroNestJs.listarTerceros** → gateway hace POST a TerceroNestJs `/graphql` con query `terceros { ... }` → TerceroNestJs devuelve `data.terceros` → gateway devuelve ese array al front.

3. **Front (GraphQL)**  
   Terceros.tsx usa Apollo `getTerceros()` → POST a `VITE_GATEWAY_URL/graphql` con query `GetTerceros { terceros { ... } }` → **gateway** `routes/graphql.js` → getTargetService detecta "terceros" → reenvía a TerceroNestJs `/graphql` → respuesta → gateway la devuelve a Apollo → el componente actualiza estado con `data.terceros`.

---

## 12. Checklist para replicar en Producto

- [ ] **gateway-api**
  - [ ] Crear `routes/producto.js`: GET listar/obtener y selects → `productoNestJs`; POST/PUT/DELETE → `productoPython`.
  - [ ] Crear `services/productoPython.js`: BASE_URL de ProductoPython, ctxHeaders, crear/actualizar/eliminar (REST).
  - [ ] Crear `services/productoNestJs.js`: BASE_URL de ProductoNestJs, gqlRequest, listar productos, obtener producto, catálogos si aplica (GraphQL).
  - [ ] Crear `schemas/producto.js`: productoCreateSchema, productoUpdateSchema.
  - [ ] En `app.js`: `fastify.register(require('./routes/producto'), { prefix: '/api' });`
  - [ ] En `routes/graphql.js`: en getTargetService, si la query contiene `productos`, `producto(`, etc., usar URL de ProductoNestJs (variable p. ej. `PRODUCTO_NEST_GQL_URL`).
  - [ ] Variables de entorno: `PRODUCTO_PY_BASE_URL`, `PRODUCTO_NEST_GQL_URL` (y opcionalmente `PRODUCTO_NEST_TIMEOUT`).
- [ ] **frontReact**
  - [ ] Crear `_apis_/producto.js`: axios contra gateway, mismos interceptores (token, X-Company-Id, X-User-Id); funciones listar, obtener, catálogos (GET) y crear, actualizar, eliminar (POST/PUT/DELETE) contra `/api/producto` y `/api/producto/selects/...`.
  - [ ] Vistas/rutas: listado de productos y formulario nuevo/edición que usen `_apis_/producto.js` (o, si se prefiere, queries GraphQL contra el gateway `/graphql` y en el gateway reenviar a ProductoNestJs).
  - [ ] Menú y rutas: añadir entrada “Productos” y rutas `/productos`, `/productos/nuevo`, etc., igual que en terceros.

Con esto se replica el mismo patrón: un solo punto de entrada (gateway), lectura y catálogos por NestJS (GraphQL o vía REST del gateway), escritura por Python (REST), y front hablando solo con el gateway (REST y/o GraphQL).
