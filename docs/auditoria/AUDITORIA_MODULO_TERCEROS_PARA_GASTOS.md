# AUDITORÍA TÉCNICA COMPLETA – MÓDULO TERCEROS (referencia para Gastos)

**Fecha:** 2026-07-26  
**Alcance:** revisión estática del código en el repositorio.  
**Restricción:** no se modificó código de negocio; este documento es el único artefacto generado.  
**Objetivo:** documentar Terceros como plantilla arquitectónica para un futuro módulo **Gastos**.

> **Nota de certeza:** todo lo afirmado existe en el código salvo donde se indica explícitamente “no determinado” o “no encontrado en el repo”. Las tablas `categoria_gasto`, `gasto` y `gasto_detalle` **no aparecen** en migraciones ni modelos del repositorio; el usuario indica que existen en PostgreSQL — se documentan solo como pretensión de dominio, no como código auditado.

---

## 1. Resumen arquitectónico

### 1.1 Patrón real (verificado)

```
Frontend React + TypeScript (frontReact, :3000)
        ↓  REST y GraphQL → Gateway (:3002)
Gateway Fastify (gateway-api)
        ├─ Lectura GraphQL / REST selects → TerceroNestJs (:3006 host / :3001 container)
        ├─ Escritura REST → TerceroPython Flask (:3004)
        ├─ Catálogos generales (condiciones/formas pago, países, empresas, tamaño empresa)
        │     → InicioNestJs (:3001)
        └─ Media / directorios → MediaServiceNestJs (:3010)
                ↓
        PostgreSQL (única BD de negocio vía DATABASE_URL)
```

Coincide con la plantilla documentada en `docs/arquitectura/MODULO_TERCEROS_PLANTILLA.md`, con matices:

| Aspecto | Documentación plantilla | Código real |
|--------|-------------------------|-------------|
| Lectura | NestJS GraphQL | Sí (listados/detalle vía Apollo → Gateway → TerceroNestJs) |
| Escritura | Flask REST | Sí (POST/PUT/DELETE vía Gateway → TerceroPython) |
| Catálogos pago/país | A veces en TerceroNestJs | Condición/forma pago y países suelen ir a **InicioNestJs** desde Gateway |
| Contactos lectura | Nest | UI usa GraphQL Nest; Gateway también expone GET contactos vía **Python** |
| Mutations Nest `createTercero` | — | Existen en Nest pero el flujo UI productivo usa Flask |
| Socios | Parte del dominio tercero | Lectura Nest + escritura Python (mismo stack) |

### 1.2 Proyectos / contenedores involucrados

| Proyecto (carpeta) | Contenedor Docker | Puerto host | Rol |
|--------------------|-------------------|-------------|-----|
| `frontReact` | `erp-frontend` | 3000 | UI |
| `gateway-api` | `erp-gateway-api` | 3002 | Fachada única |
| `TerceroNestJs` | `erp-tercero-nestjs-service` | **3006→3001** | Lectura GraphQL dominio tercero/contacto/socio |
| `TerceroPython` | `erp-tercero-service` | 3004 | Escritura REST |
| `InicioNestJs` | `erp-nestjs-service` | 3001 | Auth, empresas, países, catálogos pago, tamaño empresa, etc. |
| `MediaServiceNestJs` | `erp-media-service` | 3010 | Upload/listado media + directorios |
| PostgreSQL | (externo / `DATABASE_URL`) | — | Persistencia |

Variables Gateway relevantes (`docker-compose.yml`):

- `TERCERO_PY_BASE_URL=http://tercero-python-service:3004`
- `TERCERO_NEST_GQL_URL=http://tercero-nestjs-service:3001`
- `NESTJS_SERVICE_URL=http://nestjs-service:3001`
- `MEDIA_SERVICE_BASE_URL=http://media-service:3010`

---

## 2. Árbol de archivos relevantes

```
ErpGenieSolutions2025/
├── frontReact/src/
│   ├── routes/Router.tsx
│   ├── views/terceros/          # listados + nuevo/editar + secciones
│   ├── views/terceros/contactos/
│   ├── views/socios/
│   ├── views/documentos/        # UI documentos (module=tercero, etc.)
│   ├── _apis_/tercero.js | contacto.js | socio.js | media.js | directorio.js
│   ├── components/SelectEmpresa.tsx, SearchableSelect, ImageUpload, selects/
│   ├── hooks/useJwtPayload.ts
│   └── config/apollo-client.ts
├── gateway-api/src/
│   ├── app.js
│   ├── routes/tercero.js | contacto.js | socio.js | media.js | directorio.js | graphql.js
│   └── services/terceroNestJs.js | terceroPython.js | socioNestJs.js | mediaService.js
├── TerceroNestJs/src/
│   ├── modules/tercero/ | contacto/ | socio/ | catalogos/ | empresa/ | media/
│   └── schema.gql
├── TerceroPython/
│   ├── app.py, api/, services/, repositories/, models/, schemas/
├── MediaServiceNestJs/src/modules/media/ | directorio/
└── docs/arquitectura/MODULO_TERCEROS_PLANTILLA.md
```

---

## 3. Frontend

### 3.1 Rutas React (`frontReact/src/routes/Router.tsx`)

| Path | Componente |
|------|------------|
| `/terceros` | `views/terceros/Terceros.tsx` |
| `/terceros/nuevo` | `NuevoTercero.tsx` |
| `/terceros/editar/:id` | `EditarTercero.tsx` |
| `/clientes` | `Clientes.tsx` |
| `/clientes/nuevo` | `NuevoCliente.tsx` |
| `/clientes/editar/:id` | `EditarCliente.tsx` |
| `/clientes_potenciales` | `ClientesPotenciales.tsx` |
| `/clientes_potenciales/nuevo` | `NuevoClientePotencial.tsx` |
| `/clientes_potenciales/editar/:id` | `EditarClientePotencial.tsx` |
| `/proveedores` | `Proveedores.tsx` |
| `/proveedores/nuevo` | `NuevoProveedor.tsx` |
| `/proveedores/editar/:id` | `EditarProveedor.tsx` |
| `/socios` | `views/socios/Socios.tsx` |
| `/socios/nuevo`, `/socios/:id/editar` | `SocioForm.tsx` |
| `/terceros/:id/contactos` | `contactos/Contactos.tsx` |
| `/terceros/:id/contactos/nuevo` | `NuevoContacto.tsx` |
| `/terceros/:id/contactos/editar/:contactoId` | `EditarContacto.tsx` |
| `/documentos` | `views/documentos/Documentos.tsx` |

### 3.2 Estructura UI Nuevo / Editar / Listado

**Listado (patrón):**

- `useJwtPayload()` → `scope_acceso`, `id_empresa`
- GLOBAL: `SelectEmpresa` + query GraphQL con `id_empresa`
- EMPRESA: fuerza `id_empresa` del JWT
- `react-table` + Reactstrap `Card` / `Alert` / `Badge`
- Toggle estado vía REST `actualizarTercero` (PUT)
- Enlace a Documentos (`/documentos` con contexto de módulo)

**Nuevo (patrón `NuevoTercero.tsx`):**

- `react-hook-form` + `yupResolver(NuevoTerceroSchema)`
- Tabs Reactstrap: General / Ubicación / Comercial
- Secciones: `SeccionTerceroGeneral`, `SeccionTerceroUbicacionContacto`, `SeccionTerceroComercialOrganizacion`
- Submit → `crearTercero` (`_apis_/tercero.js`) REST
- Errores: `Alert` + `onInvalid` resumen Yup; `Spinner` en botón

**Editar:**

- Precarga GraphQL `tercero(id_tercero)` (Apollo)
- Guardado REST `actualizarTercero`

**Variantes Cliente / Proveedor / Potencial:** mismos patrones; flags booleanos `cliente`, `proveedor`, `cliente_potencial` y navegación distinta.

### 3.3 Archivos importantes (responsabilidad)

| Ruta | Responsabilidad |
|------|-----------------|
| `views/terceros/Terceros.tsx` | Listado GraphQL `terceros(id_empresa)` |
| `views/terceros/Clientes.tsx` | Listado GraphQL `clientes(id_empresa)` |
| `views/terceros/Proveedores.tsx` | Listado filtrado proveedores vía `terceros` |
| `views/terceros/ClientesPotenciales.tsx` | Listado potenciales |
| `views/terceros/NuevoTercero.tsx` | Alta genérica RHF+Yup+REST |
| `views/terceros/schemas/NuevoTerceroSchema.ts` | Validación Yup |
| `views/terceros/secciones/SeccionTercero*.tsx` | Bloques de formulario + selects GraphQL |
| `views/terceros/contactos/*` | CRUD contactos (listado GraphQL, alta REST) |
| `views/socios/*` | Socios (dominio compartido con tercero) |
| `_apis_/tercero.js` | Cliente axios Gateway (REST) |
| `_apis_/contacto.js` | REST contactos |
| `_apis_/socio.js` | REST/selects socio |
| `_apis_/media.js` / `directorio.js` | Adjuntos y carpetas |
| `hooks/useJwtPayload.ts` | Decodifica JWT → scope / empresa / user |
| `config/apollo-client.ts` | Apollo → Gateway `/graphql` + headers Auth / X-Company-Id |
| `components/SelectEmpresa.tsx` | Selector empresa GLOBAL |
| `views/documentos/Documentos.tsx` | Explorador media por `module` + `module_id` |

### 3.4 GraphQL (Apollo → Gateway)

Usado intensivamente en listados y precarga:

- `terceros(id_empresa)`, `clientes(id_empresa)`, `tercero(id_tercero)`
- `contactosByTercero`, `contacto`
- Catálogos vía InicioNestJs o TerceroNestJs según query: `empresas`, `condicionesPago`, `formasPago`, `tamanosEmpresa`, `tiposEntidadComercial`, `paises`, `provinciasByPais`, `tiposTercero`, `representantesPorEmpresa`, etc.

### 3.5 GLOBAL / EMPRESA

- JWT: `scope_acceso`, `id_empresa`, `sub`/`id`
- Listados: si GLOBAL, usuario elige empresa; si EMPRESA, oculta selector y fija empresa
- Axios interceptor en `_apis_/tercero.js` inyecta `Authorization`, `X-Company-Id`, `X-User-Id` desde JWT
- Apollo `authLink` inyecta token y `X-Company-Id`

### 3.6 Stack UI observado

- Reactstrap, react-hook-form, Yup, Apollo Client, react-table, axios, SCSS `ConfiguracionTercero.scss`
- Errores: `Alert color="danger|success"`; no se observó un sistema toast unificado obligatorio
- Loaders: `Spinner` / estados locales `loading`

---

## 4. Gateway

### 4.1 Registro (`gateway-api/src/app.js`)

```
prefix /api → routes/tercero.js, socio.js, contacto.js, media.js, directorio.js
POST /api/terceros (duplicado directo a terceroPython.crearTercero)
POST /graphql → routes/graphql.js
```

Framework: **Fastify** (no Express).

### 4.2 Enrutado GraphQL (`routes/graphql.js`)

Si la query contiene (entre otros): `terceros`, `tercero(`, `clientes`, `contactosByTercero`, `contacto(`, `rolesSocio`, `socios`, `tiposTercero`, `incoterms`, `representantesPorEmpresa` → **TerceroNestJs**.

Países/provincias/monedas → **InicioNestJs**.

Auth mutations → InicioNestJs.

### 4.3 Endpoints REST Gateway (Terceros / familia)

**Lectura → TerceroNestJs** (`routes/tercero.js` + `services/terceroNestJs.js`):

| Método | Ruta Gateway | Destino |
|--------|--------------|---------|
| GET | `/api/tercero` | listarTerceros (GQL) |
| GET | `/api/clientes` | listarClientes |
| GET | `/api/tercero/:id` | obtenerTercero |
| GET | `/api/tercero/selects/tipo-tercero` | tiposTercero |

**Catálogos vía InicioNestJs** (mismo archivo):

| GET | `/api/tercero/selects/condicion-pago` | condicionesPago |
| GET | `/api/tercero/selects/forma-pago` | formasPago |
| GET | `/api/tercero/selects/paises` | getPaises |
| GET | `/api/tercero/selects/empresas` | getEmpresas |

**Escritura → TerceroPython** (`terceroPython.js` + `ctxHeaders`):

| POST | `/api/tercero`, `/api/terceros` | crear |
| PUT | `/api/tercero/:id` | actualizar |
| DELETE | `/api/tercero/:id` | eliminar |

**Contactos** (`routes/contacto.js` → Python, lectura y escritura):

| POST/GET/PUT/PATCH | `/api/contactos...` | TerceroPython |

> La UI de listado de contactos usa GraphQL Nest; el Gateway REST de contactos apunta a Python. Hay **doble camino de lectura**.

**Socios** (`routes/socio.js`):

| GET selects | → `socioNestJs.js` (TerceroNestJs) |
| POST/PUT/PATCH | → `terceroPython` |

**Media / directorio** (`routes/media.js`, `directorio.js` → MediaServiceNestJs):

- `/api/media/upload`, `/api/media`, `/api/media/:id`, `/api/media/metadata`
- `/api/directorio` (GET/POST según `directorio.js`)

### 4.4 Headers de contexto

En `terceroPython.js`:

- `getUsuarioScope(req)` consulta InicioNestJs GraphQL `usuario(id_usuario)`
- `ctxHeaders(req, body)` arma `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso` según GLOBAL vs EMPRESA

Media usa reenvío de `X-Company-Id` / `X-User-Id` (no el mismo `ctxHeaders` rico de terceros).

### 4.5 Errores

- Proxy GraphQL: `sanitize-gateway-error.js` (mensajes genéricos en production)
- REST: reenvía `err.response.status` y `err.response.data` del microservicio

---

## 5. Backend de lectura – TerceroNestJs

### 5.1 Arranque

- `src/main.ts` – puerto `PORT` (container 3001)
- `src/app.module.ts` – TypeORM + GraphQL Apollo + módulos tercero/contacto/socio/catalogos/empresa

### 5.2 Queries GraphQL importantes

| Query | Args | Return | Service | Entity |
|-------|------|--------|---------|--------|
| `terceros` | `id_empresa?: ID` | `[Tercero!]!` | `TerceroService.findAll` | `tercero` |
| `clientes` | `id_empresa?: ID` | `[Tercero!]!` | `findClientes` | `tercero` |
| `tercero` | `id_tercero` | `Tercero!` | `findOne` | `tercero` |
| `representantesPorEmpresa` | `id_empresa` | `[Tercero!]!` | `findRepresentantesPorEmpresa` | `tercero` |
| `contactosByTercero` | `id_tercero` | `[Contacto!]!` | ContactoService | `contacto_direccion` |
| `contacto` | `id_contacto` | `Contacto!` | ContactoService | `contacto_direccion` |
| `tiposTercero` | — | `[TipoTercero!]!` | Catalogos | `tipo_tercero_catalogo` |
| `incoterms` | — | `[Incoterm!]!` | Catalogos | incoterm |
| `rolesSocio` | — | `[RolSocio!]!` | SocioService | `rol_socio` |
| `socios` | header `X-Company-Id` | `[Socio!]!` | SocioService | `socio` |
| `socio` | `id_socio` | `Socio` | SocioService | `socio` |
| `tercerosDisponiblesParaSocio` | `id_empresa`, `id_socio?` | lista | SocioService | — |

Campo resuelto: `Tercero.logo` → `MediaService.obtenerLogoPrincipal('tercero', id_tercero)`.

### 5.3 Mutations Nest (existen, no son el camino UI principal)

`createTercero`, `updateTercero`, `removeTercero`, `createContacto`, `updateContacto`, `removeContacto`.

### 5.4 Multiempresa

- `findAll` / `findClientes`: filtro opcional `where.id_empresa`
- `socios`: **exige** header `X-Company-Id`
- No hay guard JWT exhaustivo documentado en estos resolvers más allá de headers/contexto

### 5.5 Entities clave

- `modules/tercero/entities/tercero.entity.ts` → tabla `tercero`
- `modules/tercero/contacto/entities/contacto.entity.ts` → `contacto_direccion`
- `modules/socio/entities/socio.entity.ts`, `rol-socio.entity.ts`
- Catálogos: tipo_tercero, forma/condicion pago (también duplicados bajo `src/catalogos/` — posible legado)

### 5.6 Advertencia sobre `schema.gql` committed

El archivo `TerceroNestJs/src/schema.gql` listado en repo **no incluye** queries `socios`/`rolesSocio` aunque existen en `socio.resolver.ts`. En runtime Nest suele regenerar schema; el archivo committed puede estar **desactualizado**.

---

## 6. Backend de escritura – TerceroPython (Flask)

### 6.1 Arranque (`TerceroPython/app.py`)

- Blueprints: `tercero_bp`, `contacto_bp`, `socio_bp` bajo `/api`
- Flask-JWT-Extended + CORS
- Puerto `PORT` (3004)
- `/health`

### 6.2 Endpoints reales

| Método | Path Flask | Función |
|--------|------------|---------|
| POST | `/api/tercero` | crear_tercero |
| PUT/PATCH | `/api/tercero/<id>` | actualizar_tercero |
| DELETE | `/api/tercero/<id>` | eliminar_tercero (soft vía service/repo) |
| POST | `/api/contactos` | crear_contacto |
| GET | `/api/contactos/tercero/<id>` | listar |
| GET/PUT | `/api/contactos/<id>` | obtener/actualizar |
| PATCH | `/api/contactos/<id>/estado` | toggle |
| POST/PUT/PATCH | `/api/socio...` | socio_routes |

### 6.3 Capas

```
api/*_routes.py
  → services/*_service.py (Marshmallow validate + reglas)
    → repositories/*_repository.py (SQLAlchemy)
      → models/*.py
```

Schemas: `schemas/tercero_schema.py`, `schemas/contacto_schema.py`.

### 6.4 Contexto empresa/usuario

`_ctx_empresa_user()` lee headers:

- `X-Company-Id`
- `X-User-Id`
- `X-Scope-Acceso` (default EMPRESA)

Crear exige `X-Company-Id`. Actualizar/eliminar permiten GLOBAL sin company en algunos casos.

### 6.5 Validaciones / respuestas

- Marshmallow `ValidationError` → 400 con `ve.messages`
- `IntegrityError` códigos duplicados → 409
- Éxito crear → 201 JSON schema out
- Soft delete / toggle estado en varios flujos (contacto estado; tercero eliminar vía `soft_delete_tercero`)

### 6.6 Reglas de negocio destacadas (`tercero_service.py`)

- Autogeneración `codigo_cliente` / `codigo_proveedor` si vacíos
- Unicidad por empresa
- UUID normalizados en FKs

---

## 7. Base de datos (según modelos de código)

### 7.1 `tercero` (Nest + Python)

| Campo | Notas |
|-------|--------|
| PK `id_tercero` | UUID |
| FK `id_empresa` | NOT NULL → empresa |
| Roles | `cliente`, `proveedor`, `cliente_potencial` (boolean) |
| General | `nombre`, `apodo`, `codigo_cliente`, `codigo_proveedor`, `estado` |
| Ubicación | `direccion`, `poblacion`, `codigo_postal`, `id_pais`, `id_provincia` |
| Contacto | `telefono`, `movil`, `fax`, `web`, `correo` |
| Comercial | `sujeto_iva`, `id_tipo_tercero`, `id_tipo_entidad`, `capital`, condiciones/formas pago, `id_tamano_empresa` |
| Org | `sede_central`, `asignado_a` (self-FK / uuid) |
| Auditoría | `created_by`, `updated_by`, `created_at`/`updated_at` (Python); Nest usa también `fecha_creacion`/`fecha_modificacion` en entity — **posible divergencia de nombres de columna** a validar contra BD real |

### 7.2 `contacto_direccion`

- PK `id_contacto`
- FK `id_tercero` → tercero
- Datos personales/dirección/contacto
- `estado` boolean
- `created_at` / `updated_at`
- Sin `id_empresa` propio (hereda vía tercero)

### 7.3 `socio` / `rol_socio` / relación socio-tercero

- `socio`: PK `id_socio`, `id_rol_socio`, fechas, `estado`, auditoría
- Modelo `socio_tercero.py` / `SocioTercero` para vínculo N:M (verificar uso en services)

### 7.4 Catálogos usados por Terceros

- `tipo_tercero_catalogo`, `tipo_entidad_comercial`
- `condicion_pago_catalogo`, `forma_pago_catalogo` (lectura frecuente vía InicioNestJs)
- `pais`, `provincia`
- `tamano_empresa` (InicioNestJs)
- `empresa`

### 7.5 `media` / `directorio_documento`

Ver sección 8.

### 7.6 Tablas Gastos

**No encontradas** en el repositorio (ni SQL, ni entities, ni models). El usuario afirma existencia en PostgreSQL de:

- `categoria_gasto`
- `gasto`
- `gasto_detalle`

→ Para Gastos habrá que **inspeccionar el esquema real en BD** antes de mapear entities; no hay plantilla de código aún.

---

## 8. Documentos / Media

### 8.1 Servicio (`MediaServiceNestJs`)

**Controller** `modules/media/media.controller.ts`:

- `POST /media/upload` – multipart `file`; acepta imagen o PDF; lee `X-Company-Id`
- `POST /media/metadata` – persiste fila `media`
- `GET /media?module=&module_id=&directorio_id=` – listado por módulo/entidad
- `DELETE /media/:id_media`, `PATCH /media/:id_media`

**Entity `media`:**

- `id_media`, `module`, `module_id`, `id_empresa`, `url`, `filename`, `mimetype`, `size`
- `tipo`, `es_principal`, `estado_archivo`, `estado`
- FK opcional `id_directorio_documento`
- timestamps

**Entity `directorio_documento`:**

- Árbol (`id_directorio_padre`)
- `modulo`, `tipo_directorio` (default MANUAL), `id_empresa`, `orden`, `estado`, auditoría

### 8.2 Uso desde Terceros

- Logo / imagen: `ImageUpload` + `uploadMedia` → Gateway `/api/media/upload`
- Listado documentos: pantalla `Documentos.tsx` con `module` (ej. `tercero`) y `module_id` = `id_tercero`
- Carpetas: compartidas por **empresa + módulo** (no por tercero individual) — patrón ya analizado históricamente en el proyecto
- Archivos: scope por `module` + `module_id` → no se mezclan entre terceros
- Select directorio en comercial: `SelectDirectorioDocumento`

### 8.3 Implicación para Gastos

Gastos debería reutilizar el mismo contrato:

- `module = 'gasto'` (o nombre acordado)
- `module_id = id_gasto`
- `id_empresa` en headers/metadata
- Tipos: PDF, imágenes; XML si se amplía validación MIME (hoy MediaController **solo imagen/PDF**)

---

## 9. Autenticación y multiempresa

| Capa | Mecanismo |
|------|-----------|
| Login | InicioNestJs GraphQL (JWT) |
| Front | `localStorage.accessToken`; Apollo + axios interceptors |
| Gateway | Reenvía `Authorization`, resuelve scope vía InicioNestJs en escrituras Python |
| Scope GLOBAL | Puede elegir `id_empresa` en body/header |
| Scope EMPRESA | Fuerza `X-Company-Id = usuario.id_empresa` |
| Permisos menú | MenuNestJs + `perfil_menu_permiso` (fuera del dominio de datos de tercero, pero condiciona acceso UI) |

---

## 10. Flujos end-to-end

### 10.1 Crear Tercero (escritura)

1. **UI** `NuevoTercero.tsx` → `handleSubmit` → `crearTercero(cleanedData)`  
2. **API** `_apis_/tercero.js` → `POST {GATEWAY}/api/terceros` + JWT + X-Company-Id / X-User-Id  
3. **Gateway** `app.js` / `routes/tercero.js` → `terceroPython.crearTercero(body, req)`  
4. **terceroPython.js** → `ctxHeaders` + `POST http://tercero-python:3004/api/tercero`  
5. **Flask** `api/tercero_routes.py` `crear_tercero` → headers empresa/user  
6. **Service** `servicio_crear_tercero` → Marshmallow + códigos + `create_tercero` repo  
7. **SQLAlchemy** insert `tercero` en PostgreSQL  
8. Respuesta 201 JSON → Alert éxito en UI

### 10.2 Listar Terceros (lectura)

1. **UI** `Terceros.tsx` → Apollo `useLazyQuery(GET_TERCEROS)` con `id_empresa` según scope  
2. **Apollo** `POST {GATEWAY}/graphql`  
3. **Gateway** `graphql.js` detecta `terceros` → `TERCERO_NEST_GQL_URL`  
4. **TerceroNestJs** `TerceroResolver.findAll` → `TerceroService.findAll`  
5. **TypeORM** `SELECT` tabla `tercero` (+ relations empresa, tipo_tercero)  
6. JSON GraphQL → `react-table`

---

## 11. Patrones reutilizables (para Gastos)

### A) Consistentes (copiar)

1. Separación **lectura Nest GraphQL** / **escritura Python REST** vía Gateway  
2. UUID como PK/FK  
3. Multiempresa GLOBAL/EMPRESA con JWT + headers  
4. Front: Listado (Apollo + SelectEmpresa) / Nuevo-Editar (RHF + Yup + tabs + secciones)  
5. `_apis_/*.js` axios al Gateway; GraphQL para listados  
6. Soft-state `estado` boolean; auditoría `created_by/updated_by/created_at/updated_at`  
7. Media por `module` + `module_id`  
8. Validación Marshmallow en Python; errores 400/409 tipados  
9. Registro Gateway: `routes/<modulo>.js` + `services/<modulo>NestJs.js` + `services/<modulo>Python.js`  
10. Reglas GraphQL en `gateway-api/src/routes/graphql.js` para enrutar queries del dominio

### B) Excepciones / legado (no ideal)

- Mutations de escritura también en Nest (duplicadas con Flask)  
- Contactos: lectura GraphQL Nest **y** REST Python  
- Rutas Gateway duplicadas (`/api/tercero` vs `/api/terceros`; POST registrado dos veces)  
- Catálogos repartidos InicioNestJs vs TerceroNestJs  
- Carpetas duplicadas de entities catálogo en TerceroNestJs (`modules/catalogos` vs `catalogos`)  
- `schema.gql` committed incompleto vs resolvers  
- Nombres de timestamps Nest vs Python posiblemente distintos  
- Prints de debug en rutas Flask de producción  
- Front `_apis_/tercero.js` paths inconsistentes (`/api/terceros` vs `/api/tercero/:id`)

### C) Inconsistencias a **no** copiar en Gastos

1. No duplicar escritura Nest + Flask; elegir **un** camino (Flask escritura).  
2. No duplicar lectura REST+GraphQL para la misma entidad sin motivo.  
3. Unificar prefijos de API (`/api/gasto` singular o plural, pero uno). Evitar rutas anidadas erróneas (en Terceros el plugin declara `/api/terceros` bajo prefijo `/api` → queda `/api/api/terceros`).  
4. No hardcodear UUIDs de catálogo en resolvers (ej. representante en TerceroResolver) sin config.  
5. No dejar `ctxHeaders` acoplado a archivos de otro dominio (lección ítems); util compartida Gateway.  
6. No omitir entidades en `TypeOrmModule.forRoot` (lección InicioNestJs).  
7. Ampliar MIME de media solo de forma consciente si Gastos necesita XML.  
8. **Auth en microservicios de dominio:** TerceroNestJs no tiene Guards JWT; TerceroPython configura `JWTManager` pero **ninguna ruta usa `@jwt_required`**. La seguridad real hoy está en Gateway + headers de contexto. Para Gastos, decidir explícitamente si se replica ese modelo o se endurece.  
9. Schemas Marshmallow de contacto existen pero **no se usan** en el flujo actual; no dejar “schemas muertos”.  
10. Upload media: `POST /media/upload` **no** asocia `module`/`module_id` (eso ocurre en `/media/metadata`). Documentarlo en el contrato de Gastos.

---

## 12. Información para implementar Gastos (sin implementar)

### 12.1 Mapa sugerido de reutilización

| Capacidad Gastos | Referencia Terceros |
|------------------|---------------------|
| Listado gastos | `Terceros.tsx` + query GraphQL + `useJwtPayload` + `SelectEmpresa` + react-table |
| Nuevo gasto | `NuevoTercero.tsx` (tabs + RHF + Yup + Alert/Spinner) |
| Editar gasto | `EditarTercero.tsx` (GQL detalle + PUT REST) |
| Categorías | Catálogos: patrón `tiposTercero` / selects Gateway o InicioNestJs |
| Detalle líneas | No hay líneas en tercero; patrón más cercano: **items** o formularios dinámicos — **no hay plantilla idéntica en Terceros**; diseñar `gasto_detalle` como colección en payload Flask |
| Select empresa | `SelectEmpresa` + scope |
| Select tercero | Queries `terceros(id_empresa)` / SearchableSelect |
| Select item | Módulo ítems (GraphQL ItemNestJs) — fuera de Terceros pero mismo ERP |
| Select impuesto | `impuestos` InicioNestJs (como ítems Contabilidad) |
| Documentos | `Documentos.tsx` + `media` con `module='gasto'` |
| Permisos | `perfil_menu_permiso` + menú sección Gastos (como Terceros) |
| Auditoría | columnas created/updated by/at + estado |

### 12.2 Stack propuesto (alineado a Terceros)

```
frontReact/views/gastos/...
gateway-api/routes/gasto.js + services/gastoNestJs.js + gastoPython.js
GastoNestJs/   (nuevo)  — GraphQL listados/detalle/categorías
GastoPython/   (nuevo)  — REST create/update/anular
MediaServiceNestJs      — reutilizar
PostgreSQL: categoria_gasto, gasto, gasto_detalle (inspeccionar BD)
```

### 12.3 Checklist previo a codificar Gastos

1. Dump/DESCRIBE de `categoria_gasto`, `gasto`, `gasto_detalle` en PostgreSQL  
2. Decidir anulación: soft `estado` vs reversa (como banco)  
3. Registrar queries en `graphql.js`  
4. Puertos Docker libres (seguir convención Nest/Python)  
5. Scripts menú + permisos  
6. Contrato media: ¿XML permitido?  

---

## 13. Recomendaciones específicas para Gastos

1. **Copiar el esqueleto de Terceros**, no el de menús ni mezclar con ítems salvo selects.  
2. **Un solo camino de escritura** (Python) y **un solo camino de lectura** (Nest GraphQL) desde el día 1.  
3. Reutilizar **GLOBAL/EMPRESA** y `ctxHeaders`/util de Gateway sin acoplar a `terceroPython.js`.  
4. Cabecera `gasto` + detalle `gasto_detalle` en **una transacción** Flask (más cercano a transferencias bancarias que a tercero plano).  
5. Adjuntos: mismo MediaService; `module='gasto'`, `module_id=id_gasto`.  
6. Front: Listado / Nuevo / Editar + sección líneas + tab Documentos.  
7. No crear mutations Nest de escritura “por si acaso”.  
8. Documentar endpoints y schema en un `MODULO_GASTOS_PLANTILLA.md` paralelo al de Terceros.

---

## 14. Conclusión

El módulo **Terceros** implementa de forma real y usable la arquitectura:

**React → Gateway Fastify → NestJS (lectura) / Flask (escritura) → PostgreSQL**, con **MediaService** para adjuntos e **InicioNestJs** para catálogos/auth/scope.

Es la mejor referencia del ERP para Gastos, siempre que se eviten las inconsistencias listadas (doble camino, rutas duplicadas, schema desactualizado, acoplamientos de utilidades).

**Próximo paso recomendado (fuera de esta auditoría):** inspeccionar el DDL real de `gasto*` en PostgreSQL y redactar un diseño de módulo Gastos 1:1 con esta plantilla.

---

*Fin del documento. Ningún archivo de código de negocio fue modificado en esta auditoría.*
