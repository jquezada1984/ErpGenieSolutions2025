# Prompt: Implementar módulo Bancos (Front → Gateway → BancoNestJs)

## Objetivo

Implementar un **módulo Bancos** completo siguiendo el mismo patrón arquitectónico que el módulo **Clientes** en este ERP: frontend en React, gateway-api como único punto de entrada, y backend en un nuevo microservicio **BancoNestJs** (NestJS + GraphQL). Todo debe enlazarse a través del gateway-api, sin que el front llame nunca directamente al microservicio.

**Referencia de código a usar como plantilla:** `frontReact/src/views/terceros/Clientes.tsx` (listado con GraphQL, tabla, acciones).

---

## Arquitectura de referencia (la que ya usamos)

```
Front (React)  →  Gateway (Fastify, puerto ej. 3002)  →  BancoNestJs (NestJS GraphQL, ej. 3005)
                       ↓
                 - REST: /api/banco/*  →  proxy a BancoNestJs o a BancoPython (si hubiera escritura en Flask)
                 - GraphQL: POST /graphql  →  según contenido de la query, reenviar a BancoNestJs
```

- **Lectura (listar, obtener uno):** GraphQL desde el front hacia el Gateway; el Gateway reenvía la query al servicio NestJS correspondiente (igual que con `clientes` → TerceroNestJs).
- **Escritura (crear, actualizar, eliminar):** REST al Gateway (`/api/banco`, `/api/banco/:id`); el Gateway hace proxy al backend que toque (NestJS o, si se decide, Python).
- El front **nunca** usa la URL directa del microservicio; siempre usa `VITE_GATEWAY_URL` (ej. `http://localhost:3002`).

---

## Pasos a seguir (orden recomendado)

### 1. Backend: BancoNestJs (NestJS + GraphQL code-first)

- Crear un proyecto NestJS nuevo (o carpeta `BancoNestJs` en la raíz del monorepo, al nivel de `TerceroNestJs`, `MenuNestJs`, etc.).
- Configurar GraphQL con Apollo driver (code-first), TypeORM y PostgreSQL (misma `DATABASE_URL` o la que use el proyecto).
- **Entidad** (ej. `Banco`):
  - Campos mínimos sugeridos: `id_banco` (UUID, PK), `nombre`, `codigo` (opcional), `estado` (boolean), `created_at`, `updated_at`.
  - Decoradores TypeORM + `@ObjectType()` y `@Field()` de `@nestjs/graphql`.
- **Módulo:** `BancoModule` con `TypeOrmModule.forFeature([Banco])`, `BancoService`, `BancoResolver`.
- **Resolver:**
  - Query `bancos`: devuelve `Banco[]` (listado).
  - Query `banco(id_banco: String!)`: devuelve un `Banco` por id.
- **Service:** métodos `findAll()` y `findOne(id_banco)` usando el repositorio TypeORM.
- Si quieres escritura por NestJS: Mutations `createBanco`, `updateBanco`, `removeBanco` y DTOs (CreateBancoInput, UpdateBancoInput).
- Registrar la entidad en el `TypeOrmModule.forRoot` del `AppModule` y exponer el módulo.
- Probar el servicio en `http://localhost:3005/graphql` (o el puerto que elijas) con una query tipo:
  ```graphql
  query { bancos { id_banco nombre codigo estado } }
  ```

### 2. Gateway-api: enlazar BancoNestJs

- **Variable de entorno:** añadir `BANCO_NEST_GQL_URL` (ej. `http://localhost:3005` o `http://banco-nestjs-service:3005`).
- **GraphQL (routes/graphql.js):**
  - En la función que decide el servicio según el contenido de la query, añadir una condición: si la query incluye `bancos` o `banco(`, usar `config.bancoNestJsService` (leyendo `process.env.BANCO_NEST_GQL_URL`).
  - Pasar en `config` la URL del nuevo servicio (igual que se hace con `terceroNestJsService`).
- **Rutas REST (opcional pero recomendado para consistencia):**
  - Crear `gateway-api/src/routes/banco.js`:
    - `GET /banco` → listar (llamar a BancoNestJs por GraphQL o por REST según cómo lo implementes).
    - `GET /banco/:id` → obtener uno.
    - Si la escritura va por NestJS: `POST /banco`, `PUT /banco/:id`, `DELETE /banco/:id` haciendo proxy a BancoNestJs (vía HTTP REST a ese servicio, o reutilizando GraphQL mutations desde el gateway).
  - Crear `gateway-api/src/services/bancoNestJs.js`:
    - Cliente axios con `baseURL: process.env.BANCO_NEST_GQL_URL`.
    - Función para hacer POST a `/graphql` con una query/mutation y las cabeceras (Authorization, X-Company-Id, X-User-Id) que ya usa el gateway.
    - Funciones `listarBancos(req)`, `obtenerBanco(id, req)` que ejecuten las queries GraphQL correspondientes y devuelvan los datos.
  - En `gateway-api/src/app.js`: registrar las rutas con `fastify.register(require('./routes/banco'), { prefix: '/api' });`

### 3. Frontend (React)

- **API cliente:** crear `frontReact/src/_apis_/banco.js`:
  - `baseURL`: `import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002'`.
  - Interceptores para token (Authorization) y headers (X-Company-Id, X-User-Id) igual que en `_apis_/tercero.js` o `_apis_/contacto.js`.
  - Funciones: `listarBancos()`, `obtenerBanco(id)`, y si hay escritura: `crearBanco(payload)`, `actualizarBanco(id, payload)`, `eliminarBanco(id)` llamando a `/api/banco`, `/api/banco/:id`, etc.

- **Vista listado (plantilla: Clientes.tsx):**
  - Crear `frontReact/src/views/bancos/Bancos.tsx` (o la ruta que uses).
  - Usar **GraphQL** para el listado (mismo patrón que Clientes):
    - Query: `bancos { id_banco nombre codigo estado }`.
    - `useLazyQuery` con esa query, `fetchPolicy: 'cache-and-network'`.
    - Estado: `bancos`, `loading`, `error`.
    - En `useEffect` (y si aplica al montar o al cambiar ruta), llamar a la función que ejecuta la query y hacer `setBancos(data.bancos || [])`.
  - La tabla debe usar el **mismo** componente y estilo que Clientes: `ReactTable` con columnas (Nombre, Código, Estado con Badge, Acciones con botón Editar y opcionalmente toggle estado).
  - Botón "Nuevo Banco" que navegue a `/bancos/nuevo`.
  - Al hacer clic en Editar, navegar a `/bancos/editar/:id`.

- **Rutas:** en el Router (ej. `Router.tsx`), añadir rutas bajo el layout principal:
  - `/bancos` → componente listado (Bancos).
  - `/bancos/nuevo` → NuevoBanco.
  - `/bancos/editar/:id` → EditarBanco.

- **Menú lateral:** en `SidebarData.tsx` (o donde esté el menú), añadir una entrada "Bancos" con subopciones Lista y Crear, igual que Empresa o Clientes.

- **Nuevo / Editar (opcional pero recomendado):**
  - NuevoBanco: formulario que llame a `crearBanco(payload)` (REST al gateway). Misma estructura que otros formularios del proyecto (Card, tabs si hace falta, Alert de éxito/error).
  - EditarBanco: cargar datos con query GraphQL `banco(id_banco: $id_banco)` y al guardar llamar a `actualizarBanco(id, payload)` (PUT al gateway). Mismo patrón que EditarCliente / EditarContacto.

### 4. Apollo / GraphQL en el front

- El front ya usa un cliente Apollo con `uri: VITE_GATEWAY_URL + '/graphql'`. No hace falta crear otro cliente: las queries `bancos` y `banco(...)` se envían al Gateway y el Gateway, por la lógica añadida en `graphql.js`, las reenvía a BancoNestJs.

### 5. Comprobaciones finales

- Listar bancos: la pantalla `/bancos` muestra datos que vienen de GraphQL (Gateway → BancoNestJs).
- No debe haber ninguna llamada en el front a `localhost:3005` ni a la URL directa de BancoNestJs; todo debe pasar por `VITE_GATEWAY_URL`.
- Crear/editar (si lo implementas) debe usar solo las rutas REST del gateway (`/api/banco`, `/api/banco/:id`).

---

## Resumen de archivos a crear o tocar

| Capa        | Acción |
|------------|--------|
| BancoNestJs | Nuevo proyecto: entidad Banco, BancoModule, BancoService, BancoResolver (queries `bancos`, `banco`). |
| gateway-api | `routes/banco.js`, `services/bancoNestJs.js`, en `graphql.js` añadir enrutado para `bancos`/`banco(`, en `app.js` registrar rutas y variable BANCO_NEST_GQL_URL. |
| frontReact  | `_apis_/banco.js`, vistas `Bancos.tsx`, `NuevoBanco.tsx`, `EditarBanco.tsx`, rutas en Router, entrada en SidebarData. |

---

## Referencia rápida: patrón del listado (Clientes.tsx)

- `useLazyQuery(GET_CLIENTES, { fetchPolicy: 'cache-and-network', errorPolicy: 'all' })`.
- `loadClientes()` que llama a `getClientes()` y hace `setClientes(data.clientes || [])`.
- `useEffect` para ejecutar `loadClientes()` al montar (y opcionalmente al cambiar `location.pathname`).
- Tabla con `ReactTable`, `data={tableData}`, `columns` con Header, accessor, Cell para Badge de estado y botones de acción.
- Alert para `error`, botón "Nuevo" que hace `navigate('/clientes/nuevo')`, editar que hace `navigate(\`/clientes/editar/${id}\`)`.

Aplica este mismo patrón al listado de Bancos cambiando clientes → bancos, id_tercero → id_banco, y las columnas que necesites (nombre, codigo, estado, acciones).

---

## Nota sobre “listar producto”

Si además quieres un **módulo Producto** (listar productos), el proceso es el mismo: ProductoNestJs (o agregar producto en un NestJS existente), gateway con rutas y GraphQL apuntando a ese servicio, y en el front una vista “Productos” basada en el mismo patrón que Clientes/Bancos. Puedes usar este mismo prompt sustituyendo “Bancos” por “Productos” y los nombres de entidad/campos correspondientes.
