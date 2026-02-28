# Arquitectura del proyecto ERP Genie Solutions 2025

Documento de referencia para entender la estructura completa del ERP, las aplicaciones que lo componen, los módulos/submódulos, tecnologías de backend y frontend, y el papel del gateway-api. Pensado para dar contexto a asistentes (p. ej. GPT) y obtener ideas o ayuda coherente con el proyecto.

---

## 1. Visión general

El ERP es un **monorepo** con varios microservicios y un frontend único. El **gateway-api** es el **único punto de entrada** desde el navegador: el frontend nunca llama directamente a los microservicios.

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                    frontReact (Vite + React)                  │
                    │  Puerto dev: 5173  │  Producción: Nginx puerto 3000         │
                    └───────────────────────────────┬─────────────────────────────┘
                                                    │
                                    Todas las peticiones (REST + GraphQL)
                                                    │
                    ┌───────────────────────────────▼─────────────────────────────┐
                    │                   gateway-api (Fastify)                      │
                    │                    Puerto: 3002                               │
                    │  REST: /api/*  │  GraphQL: POST /graphql (reenvía por query)  │
                    └───┬────────┬────────┬────────┬────────┬────────┬────────────┘
                        │        │        │        │        │        │
        ┌────────────────┘        │        │        │        │        └────────────────┐
        │                         │        │        │        │                         │
        ▼                         ▼        ▼        ▼        ▼                         ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ InicioPython  │  │ InicioNestJs  │  │ MenuNestJs   │  │TerceroPython │  │  TerceroNestJs   │
│   (Flask)     │  │  (NestJS)     │  │  (NestJS)    │  │  (Flask)     │  │   (NestJS)       │
│   :5000       │  │   :3001       │  │   :3003      │  │   :3004      │  │   :3006→3001     │
└───────────────┘  └───────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘
        │                   │                 │                  │                    │
        │                   │                 │                  │                    │
        ▼                   ▼                 ▼                  ▼                    ▼
┌───────────────┐  ┌───────────────────────────────────────────────────────────────────────┐
│ Contabilidad  │  │ FinancieroPython :5001  │  FinancieroNestJs :3007  │  (misma idea)    │
│ Python :5002  │  │ ContabilidadNestJs :3005│                                              │
│ Contabilidad  │  └───────────────────────────────────────────────────────────────────────┘
│ NestJs :3005  │
└───────────────┘
```

**Regla de oro:** El frontend solo conoce la URL del gateway (`VITE_GATEWAY_URL`, ej. `http://localhost:3002`). REST a `/api/...` y GraphQL a `/graphql` pasan siempre por el gateway, que decide a qué microservicio reenviar.

---

## 2. Tecnologías por capa

| Capa | Tecnologías principales |
|------|-------------------------|
| **Frontend** | React 18, Vite 4, TypeScript/JS, React Router 6, Apollo Client 3 (GraphQL), Axios, Reactstrap, Bootstrap 5, Redux Toolkit, react-table (ReactTable) |
| **Gateway** | Node.js, Fastify 4, Axios, dotenv, @fastify/cors, @fastify/helmet, pino (logs) |
| **Backend NestJS** | Node.js, NestJS 11, Apollo GraphQL (code-first), TypeORM, PostgreSQL, class-validator, class-transformer |
| **Backend Python** | Python 3, Flask, Flask-SQLAlchemy, Flask-CORS, Flask-JWT-Extended, Marshmallow, psycopg2 (PostgreSQL), bcrypt |
| **Base de datos** | PostgreSQL (compartida; cada servicio puede usar la misma `DATABASE_URL` o esquemas distintos) |
| **Contenedores** | Docker, docker-compose (red `erp-network`) |

---

## 3. gateway-api (detalle)

**Ubicación:** `gateway-api/`  
**Punto de entrada:** `src/app.js`  
**Puerto:** `GATEWAY_PORT` (default 3002).

### 3.1 Estructura de carpetas

```
gateway-api/
├── src/
│   ├── app.js                 # Inicialización Fastify, CORS, registro de rutas
│   ├── routes/
│   │   ├── graphql.js         # POST /graphql → reenvío a NestJS según contenido de la query
│   │   ├── tercero.js         # /api/tercero, /api/clientes, selects, CRUD tercero
│   │   ├── contacto.js        # /api/contactos (CRUD contactos → TerceroPython)
│   │   ├── empresas.js        # /api/empresas
│   │   ├── perfil.js          # /api/perfiles
│   │   ├── sucursal.js        # /api/sucursales
│   │   ├── menu.js            # /api/menu-*
│   │   └── health.js          # /api/health, /api/status
│   ├── services/
│   │   ├── terceroPython.js   # Cliente HTTP hacia TerceroPython (REST)
│   │   ├── terceroNestJs.js   # Cliente HTTP POST /graphql hacia TerceroNestJs
│   │   ├── python.js          # Cliente hacia InicioPython
│   │   └── nestjs.js          # Cliente hacia InicioNestJs
│   └── schemas/
│       ├── tercero.js         # Esquemas JSON para validación (crear/actualizar tercero)
│       ├── empresa.js
│       ├── perfil.js
│       ├── sucursal.js
│       └── menu.js
├── package.json
├── Dockerfile
└── .env (o variables de entorno en docker-compose)
```

### 3.2 Registro de rutas (app.js)

Todas las rutas REST se montan bajo el prefijo `/api`, excepto GraphQL:

- `fastify.register(require('./routes/empresas'), { prefix: '/api' });`
- `fastify.register(require('./routes/perfil'), { prefix: '/api' });`
- `fastify.register(require('./routes/sucursal'), { prefix: '/api' });`
- `fastify.register(require('./routes/tercero'), { prefix: '/api' });`
- `fastify.register(require('./routes/contacto'), { prefix: '/api' });`
- `fastify.register(require('./routes/menu'), { prefix: '/api' });`
- `fastify.register(require('./routes/health'), { prefix: '/api' });`
- `fastify.register(require('./routes/graphql'), { prefix: '' });`  → **POST /graphql** (sin /api)

### 3.3 GraphQL (routes/graphql.js)

- **POST /graphql:** recibe `{ query, variables, operationName }`. Según el **texto de la query** se elige el servicio NestJS:
  - Si la query contiene **login, register, refreshToken, validateToken** (mutations de auth) → `config.nestjsService` (InicioNestJs).
  - Si contiene **incoterms, tiposTercero, condicionesPago, formasPago, empresas, terceros, tercero(, clientes, contactosByTercero, contacto(** → `config.terceroNestJsService` (TerceroNestJs).
  - Si contiene **menu, permiso, autorizacion, opcionesMenuSuperior, permisosPorPerfil, permisosPorModulo, menuLateralPorPerfil** → `config.menuService` (MenuNestJs).
  - En cualquier otro caso → `config.nestjsService` (InicioNestJs).

- Se hace **POST** a `{targetUrl}/graphql` con la misma query, variables y operationName, reenviando cabecera `Authorization`. La respuesta del microservicio se devuelve tal cual al cliente.

- **Config** en el handler: `nestjsService`, `menuService`, `terceroNestJsService` (con fallback `TERCERO_NEST_GQL_URL`).

### 3.4 Rutas REST de Tercero (routes/tercero.js)

- **Lectura (proxy a TerceroNestJs vía servicio):**
  - `GET /api/tercero` → terceroNestJs.listarTerceros(request)
  - `GET /api/clientes` → terceroNestJs.listarClientes(request)
  - `GET /api/tercero/:id` → terceroNestJs.obtenerTercero(id, request)
  - `GET /api/tercero/selects/tipo-tercero` → terceroNestJs.listarTiposTercero(request)
  - `GET /api/tercero/selects/condicion-pago` → terceroNestJs.listarCondicionesPago(request)
  - `GET /api/tercero/selects/forma-pago` → terceroNestJs.listarFormasPago(request)
  - `GET /api/tercero/selects/paises` → terceroNestJs.listarPaises(request)
  - `GET /api/tercero/selects/empresas` → terceroNestJs.listarEmpresas(request)

- **Escritura (proxy a TerceroPython):**
  - `POST /api/tercero` → terceroPython.crearTercero(body, request)
  - `PUT /api/tercero/:id` → terceroPython.actualizarTercero(id, body, request)
  - `DELETE /api/tercero/:id` → terceroPython.eliminarTercero(id, request)

### 3.5 Rutas REST de Contacto (routes/contacto.js)

Todas van a **TerceroPython** (mismo servicio que tercero):

- `POST /api/contactos` → terceroPython.crearContacto(body, request)
- `GET /api/contactos/tercero/:id_tercero` → terceroPython.listarContactosByTercero(id_tercero, request)
- `GET /api/contactos/:id_contacto` → terceroPython.obtenerContacto(id_contacto, request)
- `PUT /api/contactos/:id_contacto` → terceroPython.actualizarContacto(id_contacto, body, request)
- `PATCH /api/contactos/:id_contacto/estado` → terceroPython.toggleContactoEstado(id_contacto, request)

### 3.6 Servicio terceroNestJs.js

- **Base URL:** `process.env.TERCERO_NEST_GQL_URL` (ej. `http://tercero-nestjs-service:3001`).
- **Función genérica:** `gqlRequest(query, variables, req)` → POST a `BASE_URL/graphql` con las cabeceras del request (Authorization, X-Company-Id, X-User-Id). Si `res.data.errors` existe, se lanza error con el mensaje; si no, se devuelve `res.data.data`.
- **Funciones de dominio:** listarTerceros(req), listarClientes(req), obtenerTercero(id, req), listarTiposTercero(req), listarCondicionesPago(req), listarFormasPago(req), listarPaises(req), listarEmpresas(req). Cada una construye una query GraphQL y llama a `gqlRequest`.

### 3.7 Servicio terceroPython.js

- **Base URL:** `process.env.TERCERO_PY_BASE_URL` (ej. `http://tercero-python-service:3004`).
- **Cliente:** axios con baseURL y timeout (TERCERO_PY_TIMEOUT).
- **Cabeceras:** `ctxHeaders(req, body)` devuelve X-Company-Id, X-User-Id (y opcionalmente Authorization si se propaga).
- **Funciones:** crearTercero(body, req), actualizarTercero(id, body, req), eliminarTercero(id, req), crearContacto(body, req), listarContactosByTercero(id, req), obtenerContacto(id, req), actualizarContacto(id, body, req), toggleContactoEstado(id, req). Todas usan métodos REST (POST, GET, PUT, PATCH, DELETE) sobre `/api/tercero` y `/api/contactos/...`.

### 3.8 Variables de entorno del gateway (relevantes)

- `GATEWAY_PORT` (default 3000 en código, 3002 en docker-compose)
- `PYTHON_SERVICE_URL` (InicioPython)
- `NESTJS_SERVICE_URL` (InicioNestJs)
- `MENU_SERVICE_URL` (MenuNestJs)
- `TERCERO_PY_BASE_URL`, `TERCERO_PY_TIMEOUT`
- `TERCERO_NEST_GQL_URL`
- `CONTABILIDAD_PY_BASE_URL`, `CONTABILIDAD_NEST_GQL_URL`
- `FINANCIERO_PY_BASE_URL`, `FINANCIERO_NEST_GQL_URL`
- `CORS_ORIGIN`

---

## 4. frontReact (detalle)

**Ubicación:** `frontReact/`  
**Build:** Vite. Dev: `npm run dev` (puerto 5173). Producción: build estático servido por Nginx (puerto 3000 en Docker).

### 4.1 Estructura de carpetas (src)

```
frontReact/src/
├── main.tsx                    # ReactDOM, ApolloProvider(client), Redux Provider, AuthProvider, BrowserRouter, App
├── App.tsx
├── config/
│   ├── apollo-client.ts        # mainClient (uri: VITE_GATEWAY_URL + '/graphql'), menuClient (VITE_MENU_GRAPHQL_URL)
│   ├── env.ts
│   └── ...
├── _apis_/                     # Clientes HTTP hacia el GATEWAY (baseURL = VITE_GATEWAY_URL)
│   ├── contacto.js             # crearContacto, listarContactosByTercero, obtenerContacto, actualizarContacto, toggleContactoEstado
│   ├── tercero.js              # listarTerceros, obtenerTercero, selects (paises, tipo-tercero, etc.), crear, actualizar, eliminar
│   ├── empresa.js
│   ├── perfil.js
│   ├── sucursal.js
│   ├── menu.js
│   ├── usuario.js
│   ├── gateway.js
│   └── ...
├── routes/
│   └── Router.tsx              # Rutas: /empresas, /terceros, /clientes, /terceros/:id/contactos, /terceros/:id/contactos/nuevo, editar, etc.
├── layouts/
│   ├── sidebars/
│   │   └── sidebardata/
│   │       └── SidebarData.tsx # Menú lateral (Empresa, Terceros/Clientes/Proveedores/Contactos, etc.)
│   ├── header/
│   └── breadcrumbs/
├── views/
│   ├── auth/
│   │   └── Login.tsx
│   ├── empresas/               # Empresas, NuevaEmpresa, EditarEmpresa, secciones
│   ├── terceros/               # Terceros, Clientes, Proveedores, ClientesPotenciales, Nuevo/Editar (Tercero, Cliente, Proveedor, ClientePotencial)
│   │   ├── contactos/          # Contactos (listado), NuevoContacto, EditarContacto, secciones (General, Dirección, Contacto)
│   │   └── secciones/          # SeccionTerceroGeneral, SeccionTerceroUbicacionContacto, SeccionTerceroComercialOrganizacion
│   ├── usuarios/
│   ├── perfiles/
│   ├── sucursales/
│   ├── menus/
│   └── ...
├── components/                 # CountrySelect, JwtContext, AuthGuard, PermisosMenu, etc.
├── store/                      # Redux Store
├── hooks/
├── constants/
├── assets/
└── vite-env.d.ts
```

### 4.2 Uso de GraphQL vs REST en el front

- **GraphQL (Apollo):** El cliente por defecto es `mainClient`, con `uri: VITE_GATEWAY_URL + '/graphql'`. Todas las queries/mutations que use el front (terceros, clientes, contactosByTercero, contacto, paises, empresas, etc.) se envían al gateway; el gateway reenvía al NestJS correspondiente según `graphql.js`. Para menú/permisos se usa `menuClient` con `VITE_MENU_GRAPHQL_URL` (puede apuntar directo a MenuNestJs o al gateway según configuración).
- **REST (Axios):** Cada `_apis_/xxx.js` crea un axios con `baseURL: VITE_GATEWAY_URL` (o `VITE_GATEWAY_URL + '/api'` según el archivo). Las llamadas son a `/api/tercero`, `/api/contactos`, etc. El gateway las enruta a TerceroPython u otro backend.

### 4.3 Patrón de listado (ej. Clientes, Contactos)

- `useLazyQuery(GET_XXX, { fetchPolicy: 'cache-and-network', errorPolicy: 'all' })`.
- Función `loadXxx()` que ejecuta la query y hace `setData(result.data.xxx)`.
- `useEffect` para cargar al montar (y a veces al cambiar pathname).
- Tabla con ReactTable (columnas, Badge para estado, botones Editar / toggle).
- Botón "Nuevo" que navega a `/xxx/nuevo`. Editar navega a `/xxx/editar/:id`.

### 4.4 Rutas de terceros y contactos (ejemplo)

- `/terceros` → listado terceros
- `/clientes`, `/clientes/nuevo`, `/clientes/editar/:id`
- `/terceros/:id/contactos` → listado contactos del tercero (GraphQL contactosByTercero)
- `/terceros/:id/contactos/nuevo` → NuevoContacto (REST POST /api/contactos)
- `/terceros/:id/contactos/editar/:contactoId` → EditarContacto (carga con GraphQL contacto(id_contacto), guardar con PUT /api/contactos/:id_contacto)

---

## 5. TerceroPython (detalle)

**Ubicación:** `TerceroPython/`  
**Puerto:** 3004 (variable PORT).  
**Rol:** Escritura (y lectura REST) de **terceros** y **contactos**. No expone GraphQL.

### 5.1 Estructura de carpetas

```
TerceroPython/
├── app.py                      # Flask app, CORS, JWT, registro de blueprints (tercero_bp, contacto_bp), /health
├── config/
│   └── config.py               # Config (DATABASE_URL, CORS_ORIGINS, etc.)
├── utils/
│   └── db.py                   # SQLAlchemy db instance
├── models/
│   ├── __init__.py             # Importa todos los modelos (tercero, contacto, catalogos)
│   ├── tercero.py              # Modelo Tercero (tabla tercero)
│   ├── contacto.py             # Modelo Contacto (tabla contacto_direccion)
│   └── catalogos.py            # Modelos de catálogos si los hay
├── repositories/
│   ├── tercero_repository.py   # create, update, delete, get_by_id, list (terceros)
│   └── contacto_repository.py  # create_contacto, get_contactos_by_tercero, get_contacto_by_id, update_contacto, toggle_estado
├── services/
│   ├── tercero_service.py      # servicio_crear_tercero, servicio_actualizar_tercero, servicio_eliminar_tercero
│   └── contacto_service.py     # create_contacto, get_contactos_by_tercero, get_contacto_by_id, update_contacto, toggle_estado
├── api/
│   ├── tercero_routes.py       # Blueprint: POST /tercero, PUT /tercero/<id>, DELETE /tercero/<id>
│   └── contacto_routes.py      # Blueprint: POST /contactos, GET /contactos/tercero/<id>, GET /contactos/<id>, PUT /contactos/<id>, PATCH /contactos/<id>/estado
├── schemas/
│   └── tercero_schema.py       # Marshmallow schemas para validación
├── requirements.txt
├── Dockerfile
└── .env
```

### 5.2 Modelos (resumen)

- **Tercero:** id_tercero, id_empresa, nombre, apodo, codigo_cliente, cliente, proveedor, cliente_potencial, estado, direccion, poblacion, codigo_postal, id_pais, provincia, telefono, movil, fax, correo, web, etc. (Flask-SQLAlchemy, tabla `tercero`).
- **Contacto:** id_contacto, id_tercero, apellidos_etiqueta, nombre, titulo_cortesia, puesto_trabajo, direccion, codigo_postal, poblacion, provincia, id_pais, telefono_trabajo, telefono_particular, movil, fax, correo, visibilidad, fecha_nacimiento, alerta_cumpleanos, estado, created_at, updated_at (tabla `contacto_direccion`).

### 5.3 API REST expuesta

- **Tercero:** POST `/api/tercero`, PUT/PATCH `/api/tercero/<id_tercero>`, DELETE `/api/tercero/<id_tercero>`.
- **Contacto:** POST `/api/contactos`, GET `/api/contactos/tercero/<id_tercero>`, GET `/api/contactos/<id_contacto>`, PUT `/api/contactos/<id_contacto>`, PATCH `/api/contactos/<id_contacto>/estado`.

Los headers `X-Company-Id` y `X-User-Id` se leen en las rutas para contexto. La base de datos es PostgreSQL vía `DATABASE_URL`.

---

## 6. TerceroNestJs (detalle)

**Ubicación:** `TerceroNestJs/`  
**Puerto interno:** 3001 (en Docker se mapea 3006:3001 para no chocar con InicioNestJs).  
**Rol:** Lectura y presentación vía **GraphQL** (queries de terceros, clientes, contactos, catálogos). También puede tener mutations (create/update contacto por GraphQL si se desea; en el flujo actual la escritura de terceros y contactos va por REST al gateway → TerceroPython).

### 6.1 Estructura de carpetas

```
TerceroNestJs/
├── src/
│   ├── main.ts
│   ├── app.module.ts           # GraphQLModule (Apollo, code-first), TypeOrmModule.forRoot, imports: CatalogosModule, EmpresaModule, TerceroModule
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── schema.gql              # Generado por code-first
│   ├── modules/
│   │   ├── tercero/
│   │   │   ├── tercero.module.ts       # TypeOrmModule.forFeature([Tercero]), ContactoModule, TerceroService, TerceroResolver, TerceroController
│   │   │   ├── tercero.resolver.ts     # Query terceros, tercero(id_tercero), clientes (filtro cliente=true)
│   │   │   ├── tercero.service.ts
│   │   │   ├── tercero.controller.ts
│   │   │   ├── entities/
│   │   │   │   └── tercero.entity.ts   # @ObjectType, @Entity('tercero'), campos con @Field y @Column
│   │   │   ├── contacto/
│   │   │   │   ├── contacto.module.ts  # TypeOrmModule.forFeature([Contacto]), ContactoService, ContactoResolver
│   │   │   │   ├── contacto.resolver.ts# Query contactosByTercero(id_tercero), contacto(id_contacto), Mutations create/update/remove
│   │   │   │   ├── contacto.service.ts # findByTercero(id_tercero), findOne(id_contacto), create, update, remove
│   │   │   │   ├── entities/
│   │   │   │   │   └── contacto.entity.ts  # contacto_direccion, id_pais, fecha_nacimiento como String, etc.
│   │   │   │   └── dto/
│   │   │   │       ├── create-contacto.dto.ts
│   │   │   │       └── update-contacto.dto.ts
│   │   │   └── dto/
│   │   ├── catalogos/
│   │   │   ├── catalogos.module.ts     # TypeOrmModule.forFeature([TipoTercero, CondicionPago, FormaPago, Incoterm, Pais, Empresa])
│   │   │   ├── catalogos.resolver.ts   # Query tiposTercero, condicionesPago, formasPago, incoterms, paises, empresas
│   │   │   └── entities/
│   │   │       ├── tipo-tercero.entity.ts
│   │   │       ├── condicion-pago.entity.ts
│   │   │       ├── forma-pago.entity.ts
│   │   │       ├── incoterm.entity.ts
│   │   │       └── pais.entity.ts
│   │   └── empresa/
│   │       ├── empresa.module.ts
│   │       └── entities/
│   │           └── empresa.entity.ts
│   └── ...
├── package.json
└── Dockerfile
```

### 6.2 Entidades y GraphQL (resumen)

- **Tercero:** Entidad TypeORM + ObjectType GraphQL. Relaciones con Empresa, TipoTercero, Pais, CondicionPago, FormaPago, etc. Campos: id_tercero, nombre, apodo, codigo_cliente, cliente, proveedor, cliente_potencial, estado, direccion, poblacion, id_pais, etc.
- **Contacto:** Entidad `contacto_direccion`, con id_pais (varchar 36), fecha_nacimiento expuesta como String (YYYY-MM-DD) para evitar problemas con DateTime. Queries: contactosByTercero(id_tercero), contacto(id_contacto).
- **Catálogos:** Pais, TipoTercero, CondicionPago, FormaPago, Incoterm, Empresa. Queries: paises, tiposTercero, condicionesPago, formasPago, incoterms, empresas.

### 6.3 Base de datos

- TypeORM con PostgreSQL (`DATABASE_URL`). Entidades registradas en `AppModule` (Tercero, Contacto, Empresa, TipoTercero, CondicionPago, FormaPago, Incoterm, Pais). `synchronize: false` en producción.

---

## 7. Otras aplicaciones (resumen)

| Aplicación | Puerto | Tecnología | Rol |
|------------|--------|------------|-----|
| **InicioPython** | 5000 | Flask | Auth/sesión inicial, otros servicios legacy (si los hay). |
| **InicioNestJs** | 3001 | NestJS, GraphQL | Login, register, refreshToken, validateToken (mutations); empresas, usuarios, perfiles (según resolvers). |
| **MenuNestJs** | 3003 | NestJS, GraphQL | Menú lateral, permisos por perfil (menuLateralPorPerfil, permisosPorPerfil, etc.). |
| **ContabilidadPython** | 5002 | Flask | Módulo contabilidad (REST). |
| **ContabilidadNestJs** | 3005 | NestJS, GraphQL | Lectura/presentación contabilidad. |
| **FinancieroPython** | 5001 | Flask | Módulo financiero (REST). |
| **FinancieroNestJs** | 3007 | NestJS, GraphQL | Lectura/presentación financiero. |

El gateway tiene variables para cada uno (CONTABILIDAD_*, FINANCIERO_*, etc.) y puede tener rutas REST y lógica en `graphql.js` para reenviar queries a ContabilidadNestJs o FinancieroNestJs si se añaden condiciones similares a las de terceros.

---

## 8. Flujo de datos (ejemplo: Terceros y Contactos)

1. **Listar clientes (solo lectura)**  
   Front → Apollo `clientes` query → Gateway POST /graphql → graphql.js detecta "clientes" → reenvía a TerceroNestJs /graphql → TerceroNestJs devuelve datos → Gateway → Front.

2. **Crear contacto (escritura)**  
   Front → Axios POST `/api/contactos` (payload) → Gateway routes/contacto.js → terceroPython.crearContacto → HTTP POST a TerceroPython `/api/contactos` → TerceroPython guarda en BD → respuesta → Gateway → Front.

3. **Listar contactos de un tercero**  
   Front → Apollo query `contactosByTercero(id_tercero)` → Gateway /graphql → graphql.js detecta "contactosByTercero" → TerceroNestJs → respuesta → Front.

4. **Editar contacto**  
   Front carga datos con query `contacto(id_contacto)` (GraphQL → TerceroNestJs). Al guardar: Axios PUT `/api/contactos/:id_contacto` → Gateway → TerceroPython actualizarContacto → Front.

---

## 9. Puertos y variables de entorno (docker-compose)

| Servicio | Puerto host:container | Variable URL en gateway |
|----------|------------------------|--------------------------|
| frontReact | 3000:80 | - |
| gateway-api | 3002:3002 | - |
| InicioPython | 5000:5000 | PYTHON_SERVICE_URL |
| InicioNestJs | 3001:3001 | NESTJS_SERVICE_URL |
| MenuNestJs | 3003:3003 | MENU_SERVICE_URL |
| TerceroPython | 3004:3004 | TERCERO_PY_BASE_URL |
| TerceroNestJs | 3006:3001 | TERCERO_NEST_GQL_URL (apunta al 3001 interno del contenedor) |
| ContabilidadPython | 5002:5002 | CONTABILIDAD_PY_BASE_URL |
| ContabilidadNestJs | 3005:3005 | CONTABILIDAD_NEST_GQL_URL |
| FinancieroPython | 5001:5001 | FINANCIERO_PY_BASE_URL |
| FinancieroNestJs | 3007:3007 | FINANCIERO_NEST_GQL_URL |

En local (sin Docker), el front usa `VITE_GATEWAY_URL=http://localhost:3002` y el gateway usa URLs tipo `http://localhost:3004` (TerceroPython), `http://localhost:3006` (TerceroNestJs si se expone en 3006), etc.

---

## 10. Cómo usar este documento con GPT (o otro asistente)

- **Contexto:** Comparte este archivo (o las secciones relevantes) cuando pidas ideas, refactors o nuevas funcionalidades. Así el asistente conoce la arquitectura real y no propone llamadas directas del front a microservicios ni mezclar responsabilidades gateway/backend.
- **Extensiones:** Para un nuevo módulo (ej. Bancos): nuevo backend (BancoNestJs o BancoPython), nueva ruta en gateway (routes/banco.js), nuevo servicio (services/bancoNestJs.js), y si usa GraphQL, añadir en graphql.js la condición que enrute las queries de bancos al nuevo servicio. En el front: nueva carpeta en views, nuevo _apis_/banco.js, rutas y entrada en el menú.
- **Patrones:** Listados por GraphQL (como Clientes/Contactos), escritura por REST al gateway que hace proxy a Python o NestJS según el módulo. Mantener un solo punto de entrada (gateway) desde el navegador.

---

*Documento generado para el proyecto ErpGenieSolutions2025. Actualizar cuando se añadan módulos o se cambie la arquitectura.*
