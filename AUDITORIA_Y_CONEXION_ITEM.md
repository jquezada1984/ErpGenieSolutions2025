# Auditoría y conexión ItemNestJs / ItemPython siguiendo lógica de Terceros

## FASE 1 – AUDITORÍA (solo lectura)

### A. Resumen de arquitectura de conexión de terceros

- **frontReact**: Consume un único punto de entrada, el **gateway-api** (puerto 3002).
- **Gateway** decide destino según tipo de operación:
  - **Lectura / presentación / catálogos** → **TerceroNestJs** (GraphQL, puerto 3001 interno, 3006 externo).
  - **Escritura** (crear, actualizar, eliminar) → **TerceroPython** (REST, puerto 3004).
- El front usa **dos mecanismos** hacia el gateway:
  1. **REST** (`/api/tercero`, `/api/tercero/selects/...`, `/api/contactos`): axios desde `_apis_/tercero.js` y `_apis_/contacto.js`.
  2. **GraphQL** (`/graphql`): Apollo Client (`mainClient`) con URI `VITE_GATEWAY_URL/graphql`; el gateway inspecciona la query y reenvía a TerceroNestJs (o InicioNestJs / MenuNestJs según contenido).

### B. Flujo exacto de lectura de terceros (frontReact → gateway → TerceroNestJs)

1. **Vía REST (selects y listados)**  
   - Front: `listarTerceros()`, `obtenerTercero(id)`, `listarTiposTercero()`, `listarPaises()`, etc. en `_apis_/tercero.js` → `apiClient.get('/api/tercero')`, `apiClient.get('/api/tercero/selects/tipo-tercero')`, etc.  
   - Gateway: `routes/tercero.js` (prefijo `/api`) define GET que llaman a `terceroNestJs.listarTerceros(request)`, `terceroNestJs.listarTiposTercero(request)`, etc.  
   - Servicio: `services/terceroNestJs.js` usa `TERCERO_NEST_GQL_URL`, hace POST al `/graphql` del TerceroNestJs con la query correspondiente y devuelve los datos.  
   - Respuesta vuelve al front como JSON (array u objeto).

2. **Vía GraphQL (Apollo)**  
   - Front: `useQuery(GET_TERCEROS)`, `useQuery(GET_PAISES)`, etc. en vistas (Terceros.tsx, Contactos.tsx, SeccionTerceroUbicacionContacto.tsx).  
   - Apollo envía POST a `VITE_GATEWAY_URL/graphql` con la query.  
   - Gateway: `routes/graphql.js` recibe el body, llama a `getTargetService(query, config)`. Si la query contiene `terceros`, `tercero(`, `clientes`, `contactosByTercero`, `contacto(`, `incoterms`, `tiposTercero`, etc., devuelve `config.terceroNestJsService` (= `TERCERO_NEST_GQL_URL`).  
   - Gateway hace POST a `TERCERO_NEST_GQL_URL/graphql` con la misma query/variables y reenvía la respuesta al front.

### C. Flujo exacto de escritura de terceros (frontReact → gateway → TerceroPython)

1. Front: `crearTercero(data)`, `actualizarTercero(id, data)`, `eliminarTercero(id)` en `_apis_/tercero.js` → `apiClient.post('/api/tercero')`, `apiClient.put('/api/tercero/:id')`, `apiClient.delete('/api/tercero/:id')`.  
2. Front contactos: `_apis_/contacto.js` → POST/GET/PUT/PATCH `/api/contactos`, `/api/contactos/tercero/:id`, etc.  
3. Gateway: `routes/tercero.js` y `routes/contacto.js` (prefijo `/api`) enrutan POST/PUT/DELETE/PATCH a `terceroPython.crearTercero()`, `terceroPython.actualizarTercero()`, `terceroPython.crearContacto()`, etc.  
4. Servicio: `services/terceroPython.js` usa `TERCERO_PY_BASE_URL`, hace POST/PUT/DELETE a `/api/tercero`, `/api/contactos`, etc. del TerceroPython.  
5. Respuesta del TerceroPython se devuelve al front.

### D. Archivos exactos involucrados

| Capa | Archivo | Rol |
|------|---------|-----|
| Docker | `docker-compose.yml` | Define `tercero-python-service` (3004), `tercero-nestjs-service` (3001), env en gateway `TERCERO_PY_BASE_URL`, `TERCERO_NEST_GQL_URL`, `depends_on` de ambos. |
| Gateway | `gateway-api/src/app.js` | Registra `routes/tercero`, `routes/contacto`, `routes/graphql`. |
| Gateway | `gateway-api/src/routes/tercero.js` | GET → terceroNestJs; POST/PUT/DELETE → terceroPython. |
| Gateway | `gateway-api/src/routes/contacto.js` | Todas las rutas → terceroPython. |
| Gateway | `gateway-api/src/routes/graphql.js` | POST /graphql → getTargetService() → TerceroNestJs o InicioNestJs o MenuNestJs. |
| Gateway | `gateway-api/src/services/terceroNestJs.js` | Cliente GraphQL hacia TERCERO_NEST_GQL_URL. |
| Gateway | `gateway-api/src/services/terceroPython.js` | Cliente REST hacia TERCERO_PY_BASE_URL. |
| Front | `frontReact/src/config/apollo-client.ts` | mainClient apunta a `VITE_GATEWAY_URL/graphql`. |
| Front | `frontReact/src/_apis_/tercero.js` | REST a `/api/tercero`, `/api/tercero/selects/*`. |
| Front | `frontReact/src/_apis_/contacto.js` | REST a `/api/contactos/*`. |
| Front | Vistas en `frontReact/src/views/terceros/` | Usan _apis_/tercero, _apis_/contacto y useQuery (GraphQL) contra gateway. |

### E. Variables de entorno exactas involucradas

- **Gateway (docker-compose):**
  - `TERCERO_PY_BASE_URL=http://tercero-python-service:3004`
  - `TERCERO_PY_TIMEOUT=15000`
  - `TERCERO_NEST_GQL_URL=http://tercero-nestjs-service:3001`
- **Front:** `VITE_GATEWAY_URL` (por defecto `http://localhost:3002`) para axios y Apollo.

### F. Convenciones de nombres usadas en terceros

- **Rutas API:** prefijo `/api`, luego módulo: `/api/tercero`, `/api/tercero/:id`, `/api/tercero/selects/tipo-tercero`, `/api/contactos`, `/api/contactos/tercero/:id_tercero`.
- **Variables de entorno:** `TERCERO_PY_BASE_URL`, `TERCERO_NEST_GQL_URL`, `TERCERO_PY_TIMEOUT`.
- **Servicios gateway:** `terceroPython.js`, `terceroNestJs.js`; funciones como `listarTerceros`, `obtenerTercero`, `listarTiposTercero`, `crearTercero`, `actualizarTercero`.
- **Rutas gateway:** archivo `routes/tercero.js`, `routes/contacto.js`; registro con `prefix: '/api'`.

### G. Recomendación conservadora para replicar el patrón en item

- Crear en gateway **servicios** `itemNestJs.js` e `itemPython.js` (misma estructura que terceroNestJs/terceroPython).
- Crear **rutas** `routes/item.js` con prefijo `/api`: GET lectura/selects → itemNestJs; POST/PUT/DELETE (cuando existan) → itemPython.
- En **graphql.js**: añadir rama en `getTargetService()` para queries de item (p. ej. `estadosVentaItem`) → `config.itemNestJsService`; añadir `itemNestJsService: process.env.ITEM_NEST_GQL_URL` al config.
- **Docker:** ya existe `item-nestjs-service` (3011) y `ITEM_NEST_GQL_URL` en gateway; añadir `item-python-service` (puerto distinto, p. ej. 3012), `ITEM_PY_BASE_URL` y `depends_on` en gateway.
- **Front:** crear `_apis_/item.js` con `listarEstadosVentaItem()` que llame a GET `/api/item/selects/estado-venta` (o usar GraphQL con query `estadosVentaItem` contra gateway).
- **Nombres:** `ITEM_NEST_GQL_URL`, `ITEM_PY_BASE_URL`, `/api/item`, `/api/item/selects/estado-venta`.

---

## FASE 2 – PROPUESTA CONTROLADA DE INTEGRACIÓN PARA ITEM

### A. Archivos a modificar

| Archivo | Motivo |
|---------|--------|
| `docker-compose.yml` | Añadir servicio `item-python-service` y en gateway `ITEM_PY_BASE_URL` y `depends_on` de item-python (ItemNestJs ya está). |
| `gateway-api/src/routes/graphql.js` | Añadir rama Item en `getTargetService()` y `itemNestJsService` en config para enrutar queries de catálogo item a ItemNestJs. |
| `gateway-api/src/services/itemNestJs.js` | Nuevo: cliente GraphQL hacia ItemNestJs (listarEstadosVentaItem). |
| `gateway-api/src/routes/item.js` | Nuevo: GET /item/selects/estado-venta → itemNestJs (lectura). Reservar estructura para futuros POST/PUT/DELETE → itemPython. |
| `gateway-api/src/app.js` | Registrar `routes/item` con prefix `/api`. |
| `frontReact/src/_apis_/item.js` | Nuevo: listarEstadosVentaItem() → GET al gateway `/api/item/selects/estado-venta`. |

Opcional (escritura cuando ItemPython exponga endpoints): `gateway-api/src/services/itemPython.js` y rutas POST/PUT/DELETE en `routes/item.js`; no aplicado en esta implementación mínima.

### B. Motivo de cada archivo

- **graphql.js:** Para que las queries GraphQL que contengan `estadosVentaItem` (u otras de item) vayan a ItemNestJs y no a InicioNestJs.
- **itemNestJs.js:** Mismo patrón que terceroNestJs: centralizar llamadas GraphQL al microservicio Item.
- **item.js (routes):** Exponer REST `/api/item/selects/estado-venta` para que el front pueda poblar el combo “Estado venta” igual que en terceros con selects.
- **app.js:** Registrar el nuevo módulo de rutas item.
- **docker-compose:** Incluir ItemPython en la orquestación y dar al gateway la URL para futuras escrituras.
- **_apis_/item.js:** Punto único del front para llamar al catálogo de item vía gateway (REST).

### C. Cambio mínimo necesario en cada archivo

- **graphql.js:** Añadir antes del `else` de menú: `if (query && query.includes('estadosVentaItem')) return config.itemNestJsService;` y en `config` añadir `itemNestJsService: process.env.ITEM_NEST_GQL_URL`.
- **itemNestJs.js:** Un solo método `listarEstadosVentaItem(req)` que hace query GraphQL `estadosVentaItem` a ITEM_NEST_GQL_URL.
- **item.js:** Una ruta GET `/item/selects/estado-venta` que llama a itemNestJs.listarEstadosVentaItem(request) y devuelve el array.
- **app.js:** Una línea para registrar `require('./routes/item')` con prefix `/api`.
- **docker-compose:** Bloque `item-python-service` (build ItemPython, puerto 3012), y en gateway env `ITEM_PY_BASE_URL=http://item-python-service:3012` y en depends_on `item-python-service`.
- **_apis_/item.js:** axios baseURL GATEWAY_URL, `listarEstadosVentaItem()` → get `/api/item/selects/estado-venta`.

### D. Riesgos si se modifica mal

- **graphql.js:** Si la condición de item es demasiado amplia, otras queries podrían ir a ItemNestJs por error; por eso se limita a `estadosVentaItem` (y se puede ampliar con más nombres de query explícitos).
- **app.js:** Si el orden de registro de rutas choca con otra ruta (p. ej. `/api/item` antes de algo más específico), podría haber conflictos; se sigue el mismo orden que tercero.
- **docker-compose:** Si el puerto de ItemPython coincide con otro servicio (p. ej. 3005), habría conflicto; se usa 3012.

### E. Orden exacto de implementación más seguro

1. Crear `gateway-api/src/services/itemNestJs.js` (solo lectura, sin tocar nada existente).
2. Crear `gateway-api/src/routes/item.js` con solo GET selects (sin itemPython todavía).
3. Modificar `gateway-api/src/routes/graphql.js` (añadir rama item y itemNestJsService en config).
4. Modificar `gateway-api/src/app.js` (registrar routes/item).
5. Añadir en `docker-compose.yml` el servicio item-python y variables/depends_on del gateway (para dejar listo el canal de escritura).
6. Crear `frontReact/src/_apis_/item.js` con listarEstadosVentaItem.

No se modifica TerceroNestJs, TerceroPython, ni la lógica existente de terceros en gateway ni front.

---

## FASE 3 – IMPLEMENTACIÓN REALIZADA

### Archivos creados

| Archivo | Qué se agregó | Para qué sirve | Qué conexión habilita |
|---------|----------------|----------------|------------------------|
| `gateway-api/src/services/itemNestJs.js` | Cliente axios a ItemNestJs, función `listarEstadosVentaItem(req)` que ejecuta query GraphQL `estadosVentaItem`. | Centraliza las llamadas de lectura del módulo item hacia ItemNestJs (mismo patrón que terceroNestJs). | Gateway → ItemNestJs para catálogos. |
| `gateway-api/src/routes/item.js` | Ruta GET `/item/selects/estado-venta` que llama a `itemNestJs.listarEstadosVentaItem(request)`. | Expone REST para que el front pida el catálogo "Estado venta" sin tocar GraphQL. | Front → Gateway → ItemNestJs (REST). |
| `frontReact/src/_apis_/item.js` | Cliente axios al gateway, `listarEstadosVentaItem()` → GET `/api/item/selects/estado-venta`. | Punto único del front para consumir catálogos del módulo item. | Front puede poblar combo Estado venta en NuevoProducto. |
| `ItemPython/Dockerfile` | Dockerfile mínimo (mismo patrón que TerceroPython), PORT=3012. | Permite que docker-compose construya y levante ItemPython. | Conexión futura Gateway → ItemPython cuando se implementen endpoints de escritura. |

### Archivos modificados

| Archivo | Bloque agregado / cambio | Explicación | Por qué no rompe lo existente |
|---------|---------------------------|-------------|-------------------------------|
| `gateway-api/src/routes/graphql.js` | Rama en `getTargetService()`: si `query.includes('estadosVentaItem')` → `config.itemNestJsService`. En `config` se añadió `itemNestJsService: process.env.ITEM_NEST_GQL_URL \|\| 'http://item-nestjs-service:3011'`. | Las queries GraphQL que pidan el catálogo de item se enrutan a ItemNestJs; el resto sigue yendo a Inicio/Menu/Tercero como antes. | La condición es explícita solo para `estadosVentaItem`; no se cambia el orden ni la lógica de terceros/menú/inicio. |
| `gateway-api/src/app.js` | Una línea: `fastify.register(require('./routes/item'), { prefix: '/api' });` | Registra las rutas del módulo item bajo `/api` (igual que tercero y contacto). | Solo añade un nuevo registro; no se modifican rutas ni registros existentes. |
| `docker-compose.yml` | Servicio `item-python-service` (build ItemPython, puerto 3012). En gateway: env `ITEM_PY_BASE_URL=http://item-python-service:3012` y `depends_on: item-python-service`. | ItemPython queda definido en la orquestación y el gateway tiene la URL para futuras escrituras. | ItemNestJs y el resto de servicios no se tocan; solo se añaden un servicio y variables. |

### Archivos solo analizados (no modificados)

- `TerceroNestJs/*` (toda la carpeta).
- `TerceroPython/*` (toda la carpeta; en ItemPython solo se añadió el Dockerfile para build).
- `gateway-api/src/routes/tercero.js`, `contacto.js`, `services/terceroNestJs.js`, `terceroPython.js`.
- `frontReact/src/views/terceros/*`, `frontReact/src/config/apollo-client.ts`.
- Resto de servicios (MenuNestJs, MediaServiceNestJs, Contabilidad, Financiero, etc.).

### Confirmación final

- **Archivos solo analizados:** Todos los listados en la sección anterior; ningún archivo de TerceroNestJs ni TerceroPython fue modificado (en ItemPython solo se añadió el Dockerfile).
- **Archivos modificados:** `gateway-api/src/routes/graphql.js`, `gateway-api/src/app.js`, `docker-compose.yml`.
- **Archivos creados:** `gateway-api/src/services/itemNestJs.js`, `gateway-api/src/routes/item.js`, `frontReact/src/_apis_/item.js`, `ItemPython/Dockerfile`.
- **Por qué la implementación es segura:** Se replicó el patrón de terceros (servicio Nest para lectura, ruta REST bajo `/api/item`, rama en GraphQL por nombre de query). No se refactorizó el gateway ni el flujo de terceros; solo se añadieron módulo item y servicio ItemPython en compose.
- **Pasos para validar la conexión de item de extremo a extremo:**
  1. Levantar stack: `docker-compose up --build` (o al menos gateway, item-nestjs-service; item-python-service opcional si no hay Dockerfile previo).
  2. Comprobar que ItemNestJs responde: `GET http://localhost:3011/graphql` (o desde dentro de la red el URL que use el gateway).
  3. Desde el front o Postman: `GET http://localhost:3002/api/item/selects/estado-venta` (con gateway en 3002); debe devolver un array de estados de venta (o vacío si la tabla no tiene datos).
  4. En el front, en un componente (p. ej. SeccionItemGeneral o NuevoProducto): importar `listarEstadosVentaItem` de `_apis_/item.js`, llamarlo en useEffect y usar el resultado para poblar un `<Select>` de "Estado venta"; el valor a guardar debe ser `id_estado_venta`.
