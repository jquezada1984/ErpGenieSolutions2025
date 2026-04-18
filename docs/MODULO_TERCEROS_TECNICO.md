# Módulo de Terceros — Documentación técnica

Mapa técnico del módulo **Terceros** en el ERP: frontend (React), API Gateway (Node/Fastify), escritura (Flask / TerceroPython), lectura (NestJS / TerceroNestJs + GraphQL), submódulo **Contacto / Dirección** e integración con **Media Service** (NestJS + TypeORM).

---

## 1. Visión general del módulo

### 1.1 Qué es el módulo de Terceros

El módulo gestiona **terceros** (personas u organizaciones) asociados a una **empresa** (`id_empresa`). Un mismo registro puede cumplir uno o varios **roles comerciales** mediante banderas booleanas en la entidad principal.

### 1.2 Entidades que maneja

| Concepto | Descripción |
|----------|-------------|
| **tercero** | Registro base en tabla `tercero` con identificador UUID (`id_tercero`). |
| **cliente** | Mismo registro con `cliente = true`. Los listados de “Clientes” filtran por esta condición. |
| **proveedor** | Mismo registro con `proveedor = true`. |
| **cliente potencial** | Mismo registro con `cliente_potencial = true` (sin ser aún cliente formal, según configuración de negocio). |

No son tablas distintas: la distinción es **por flags** y por **pantallas / queries** que filtran (`findClientes` en NestJS, listados en React con filtros adicionales donde aplique).

### 1.3 Relación con otros módulos

| Módulo | Relación |
|--------|----------|
| **Documentos** | Desde el listado de terceros se enlaza a documentos con `module=tercero` y `module_id=id_tercero` (y empresa asociada). |
| **Media** | El **logo** no se guarda como BLOB en `tercero`: se sube vía gateway, se registra metadata en **Media Service** (`module='tercero'`, `module_id=id_tercero`). La lectura del logo en GraphQL se resuelve con un campo calculado (`logo`) que consulta el principal en media. |
| **Contacto / Dirección** | Entidad **contacto** con FK a `tercero` (`id_tercero`). Dirección usa `id_pais` e `id_provincia` (catálogos), alineado con el modelo de tercero. |

---

## 2. Arquitectura general

### 2.1 Componentes

| Capa | Tecnología | Proyecto / carpeta |
|------|------------|-------------------|
| **Frontend** | React (Vite), Apollo Client, React Router | `frontReact` |
| **API Gateway** | Node.js **Fastify** | `gateway-api` |
| **Backend escritura** | Python **Flask**, SQLAlchemy | `TerceroPython` |
| **Backend lectura** | **NestJS** + GraphQL (Code-first / schema generado) | `TerceroNestJs` |
| **Media Service** | **NestJS** + **TypeORM**, persistencia tabla `media` | `MediaServiceNestJs` (expuesto típicamente como `erp-media-service` / puerto 3010) |

### 2.2 Flujo de peticiones

```
Frontend (React)
    │
    ├─► GraphQL POST /graphql  ──► Gateway ──► InicioNestJs | TerceroNestJs | MenuNestJs
    │         (según texto de la query el gateway elige destino)
    │
    └─► REST /api/tercero*, /api/terceros*, /api/contactos*, /api/media*
              │
              ├─► Lecturas REST de terceros (GET)  ──► Servicio NestJS del gateway ──► TerceroNestJs (/graphql interno)
              │
              ├─► Escrituras (POST/PUT/PATCH/DELETE terceros/contactos) ──► TerceroPython (Flask)
              │
              └─► Media (upload, listado, metadata) ──► MediaServiceNestJs
```

**Regla práctica:** las **mutaciones de datos de negocio de tercero/contacto** que consumen el cliente por REST van a **Flask**; las **consultas y catálogos expuestos en GraphQL** (listados, detalle con relaciones, contactos, representantes) van a **TerceroNestJs**. El gateway **inyecta contexto** (`X-Company-Id`, `X-User-Id`, `X-Scope-Acceso`) hacia Flask según el usuario autenticado.

---

## 3. Frontend (`frontReact`)

### 3.1 Estructura de carpetas relevante

| Ruta | Uso |
|------|-----|
| `src/views/terceros/` | Pantallas: listados, altas, ediciones (tercero, cliente, proveedor, cliente potencial), estilos (`ConfiguracionTercero.scss`). |
| `src/views/terceros/secciones/` | Secciones reutilizables del formulario (general, ubicación, comercial/organización). |
| `src/views/terceros/contactos/` | CRUD de contactos ligados al tercero. |
| `src/views/terceros/schemas/` | Esquemas **Yup** (p. ej. `NuevoTerceroSchema.ts`). |
| `src/_apis_/tercero.js` | Cliente Axios hacia el gateway (REST tercero). |
| `src/_apis_/media.js` | Subida y consulta de media vía gateway. |
| `src/_apis_/contacto.js` | Contactos (REST). |
| `src/components/jwt/JwtContext.tsx` | Autenticación (login GraphQL, sesión). |
| `src/hooks/useJwtPayload.ts` | Lectura del **payload JWT** decodificado (uso frecuente en terceros para `scope_acceso`, `id_empresa`). |

### 3.2 Formularios principales

| Componente | Rol |
|--------------|-----|
| `NuevoTercero.tsx` | Alta multi-rol con validación Yup y envío a Flask vía `crearTercero`. |
| `EditarTercero.tsx` | Edición: carga con **GraphQL** `tercero(id_tercero)`, actualización REST `actualizarTercero`. |
| `EditarCliente.tsx` / `EditarProveedor.tsx` / `EditarClientePotencial.tsx` | Variantes de edición con el mismo patrón (query detalle + PUT). |
| `NuevoCliente.tsx`, `NuevoProveedor.tsx`, `NuevoClientePotencial.tsx` | Altas especializadas por rol. |

**React Hook Form:** los formularios usan `useForm` con `yupResolver(NuevoTerceroSchema)` y `defaultValues` alineados a `initialForm`.

**Yup:** reglas centralizadas en `NuevoTerceroSchema.ts` (empresa obligatoria, campos opcionales tipados, etc.).

**initialForm y `reset()`:** en edición, tras `useLazyQuery` / `fetchTercero`, se hace `reset({ ... })` mapeando la respuesta GraphQL a valores de formulario (incl. `id_provincia`, `logo`, `id_tamano_empresa`). Esto evita inconsistencias y marca el estado “limpio” del formulario.

### 3.3 Manejo de imagen (logo)

- **Componente:** `src/components/common/ImageUpload.tsx` — sube el archivo con `uploadMedia(file, empresaId)` y devuelve la **URL** pública al campo `logo`.
- **Comparación `logoOriginal` vs `values.logo`:** en `EditarTercero.tsx` (y equivalentes) se guarda la URL inicial en estado `logoOriginal` y en el submit:
  - Si el usuario **no cambió** el logo (`values.logo === logoOriginal`), se fuerza **`logo: null`** en el payload enviado al backend.
- **Efecto en backend:** en `TerceroPython`, el repositorio solo llama a **Media Service** (`/media/metadata`) cuando `logo_url` es truthy. Enviar `null` **evita registrar otra fila** de media duplicada al guardar sin cambios.

```typescript
// Patrón simplificado (EditarTercero)
if (logoOriginal !== null && values.logo === logoOriginal) {
  cleanedData.logo = null;
}
```

### 3.4 Selects y catálogos

#### Catálogos “globales” / maestros (típicamente GraphQL vía gateway → Inicio o Tercero según query)

- **Tipo tercero, condición pago, forma de pago:** queries GraphQL en secciones (`condicionesPago`, `formasPago`) o REST `/api/tercero/selects/*` según pantalla.
- **País:** `paises` en GraphQL (`SeccionTerceroUbicacionContacto`, contactos).
- **Provincia:** componente `SelectProvincia` dependiente de `id_pais` (no es un listado estático global único; filtra por país).

#### Catálogos propios del dominio Tercero

- **Representantes:** query `representantesPorEmpresa(id_empresa)` — solo terceros de tipo “representante” para la empresa seleccionada (filtro en `TerceroNestJs`).
- **Tamaño empresa:** query `tamanosEmpresa` (definida en **InicioNestJs** / servicio maestro; el gateway enruta queries que no coinciden con Tercero al servicio por defecto).

**Apollo (`useQuery` / `useLazyQuery`):** listados de detalle, catálogos en formularios, representantes condicionados por `id_empresa`.

**Axios (`_apis_/tercero.js`, `contacto.js`, `media.js`):** operaciones REST (crear/actualizar tercero, contactos, subir archivos).

### 3.5 Manejo de JWT

- **Decodificación manual:** en interceptores Axios se usa `JSON.parse(atob(token.split('.')[1]))` para extraer claims.
- **Claims usados en terceros:**
  - **`id_empresa`:** cabecera `X-Company-Id` en llamadas REST (cuando existe en el token).
  - **`sub` (o `id`):** cabecera `X-User-Id`.
  - **`scope_acceso`:** leído vía `useJwtPayload()` en listados (`Terceros.tsx`, `Clientes.tsx`, etc.) para decidir si el usuario **GLOBAL** puede elegir empresa en el filtro o si queda fijado a su empresa.

**Nota:** el **gateway** puede enriquecer el contexto: para escrituras hacia Flask consulta a **InicioNestJs** el `scope_acceso` e `id_empresa` del usuario si necesita normalizar cabeceras (`gateway-api` → `getUsuarioScope` en `terceroPython.js`).

---

## 4. API Gateway (`gateway-api`)

### 4.1 Rutas relevantes

| Ruta | Rol |
|------|-----|
| `POST /graphql` | Proxy inteligente: según la query, hacia **InicioNestJs**, **TerceroNestJs** u otros servicios. |
| `GET|POST /api/tercero`, `GET /api/clientes`, `GET /api/tercero/:id`, `GET /api/tercero/selects/*` | Lecturas REST que internamente llaman a **GraphQL de TerceroNestJs** (`terceroNestJs.js`). |
| `POST /api/tercero`, `PUT /api/tercero/:id`, `DELETE /api/tercero/:id` | Escritura vía **TerceroPython**. |
| `POST /api/terceros` | Registrado en `app.js` y en rutas de tercero: también crea tercero en Flask (compatibilidad de plural). |
| `/api/contactos/*` | CRUD contactos → Flask. |
| `/api/media/*` | Proxy a **MediaServiceNestJs** (upload, GET con query `module`/`module_id`, PATCH, DELETE, metadata). |

### 4.2 Función del gateway

- **Proxy de escritura:** reenvía JSON a Flask con headers:
  - `X-Company-Id`
  - `X-User-Id`
  - `X-Scope-Acceso` (cuando se resolvió desde InicioNestJs)
- **Proxy de lectura:** el módulo `terceroNestJs.js` construye queries GraphQL y las POSTea a `TERCERO_NEST_GQL_URL/graphql`.
- **GraphQL agregado:** `routes/graphql.js` inspecciona el cuerpo de la query y elige `TERCERO_NEST_GQL_URL` para palabras clave como `terceros`, `clientes`, `contactosByTercero`, `representantesPorEmpresa`, etc.

### 4.3 Manejo de respuestas

En `app.js`, el **serializer** de Fastify envuelve respuestas que no traen ya `{ success, ... }`:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-04-17T12:00:00.000Z"
}
```

Los errores siguen un formato `{ success: false, error, timestamp }`. El frontend en `_apis_/tercero.js` contempla arrays directos o `body.data` en algunos catálogos.

---

## 5. Backend de escritura (TerceroPython — Flask)

### 5.1 Estructura de carpetas

| Área | Contenido |
|------|-----------|
| `api/tercero_routes.py`, `api/contacto_routes.py` | Blueprints HTTP. |
| `services/tercero_service.py`, `services/contacto_service.py` | Reglas de negocio, validación Marshmallow, códigos cliente/proveedor. |
| `repositories/tercero_repository.py`, `repositories/contacto_repository.py` | Persistencia y llamadas a Media Service. |
| `models/tercero.py`, `models/contacto.py` | Modelos SQLAlchemy. |
| `schemas/tercero_schema.py`, `schemas/contacto_schema.py` | Marshmallow. |

### 5.2 Modelo `Tercero`

- **UUID:** `id_tercero` clave primaria `String(36)` con `default` `uuid.uuid4()` en el modelo.
- **Campos relevantes:** `id_empresa` (FK), roles booleanos, datos generales, `id_pais`, **`id_provincia`**, `id_tipo_tercero`, `id_condicion_pago`, `id_forma_pago`, **`id_tamano_empresa`**, `asignado_a`, `sede_central`, auditoría `created_by` / `updated_by`, timestamps.

### 5.3 Validación (Marshmallow)

- **Entrada:** `TerceroCreateSchema` / `TerceroUpdateSchema` con tipos UUID para claves foráneas.
- **Legacy:** el esquema de actualización aún puede aceptar **`provincia` string** en el schema de update; el modelo persistido prioriza **`id_provincia`**. En front se trabaja con **`id_provincia`** y selects dependientes.

### 5.4 Repository

- **`create_tercero`:** inserta el registro; si viene `logo` (URL), tras el commit obtiene/crea directorio `logo_tercero` y POST a `http://erp-media-service:3010/media/metadata` con `es_principal: true`.
- **`update_tercero`:** aplica solo campos permitidos; si `scope_acceso == 'GLOBAL'` la búsqueda del tercero es por `id_tercero` sin filtrar empresa; si no, filtra por `id_empresa`.
- **Soft delete:** `estado = false` con la misma lógica de scope.

### 5.5 Manejo de imagen

- Se envía a Media Service **solo cuando** el payload incluye una URL de logo no vacía.
- **`logo = null`** desde el front indica **“sin cambios”** → el repository no dispara nuevo metadata; así se reduce la **duplicación** de registros media.

---

## 6. Backend de lectura (TerceroNestJs — GraphQL)

### 6.1 Resolver principal

Archivo: `src/modules/tercero/tercero.resolver.ts`

- Queries: `terceros`, `clientes`, `tercero`, `representantesPorEmpresa`.
- Mutations GraphQL (`createTercero`, etc.) existen en el resolver pero el flujo productivo de escritura del front actual usa **Flask** por REST.

### 6.2 Queries destacadas

| Query | Uso |
|--------|-----|
| `terceros(id_empresa)` | Listado con filtro opcional por empresa. |
| `clientes(id_empresa)` | Solo registros con `cliente = true`. |
| `tercero(id_tercero)` | Detalle para pantallas de edición. |
| `representantesPorEmpresa(id_empresa)` | Select de asignación; filtra por tipo de tercero representante (constante en servicio). |

Catálogos (`tiposTercero`, `condicionesPago`, `formasPago`, `paises`, `empresas`, etc.) están en módulos de catálogos/resolvers asociados.

### 6.3 Entities / DTOs

- Entidad TypeORM `Tercero` incluye **`id_provincia`** como columna UUID; el campo **`logo`** en GraphQL se expone como **string opcional** resuelto por `@ResolveField`, no como columna en BD.
- Resolver `logo` llama a `MediaService.obtenerLogoPrincipal('tercero', id_tercero)` que a su vez hace HTTP GET al endpoint **principal** del servicio de media.

**Nota:** el archivo `schema.gql` generado en repo puede quedar **desactualizado** respecto a campos como `logo` o argumentos; la fuente de verdad es el código del resolver y entidades.

---

## 7. Media Service (`MediaServiceNestJs`)

### 7.1 Entidad `Media` (TypeORM)

Tabla `media` (simplificado):

| Campo | Descripción |
|-------|-------------|
| `id_media` | UUID (PK). |
| `module`, `module_id` | Ej. `tercero`, UUID del tercero. |
| `id_empresa` | Opcional, multitenancy. |
| `url`, `filename`, `mimetype`, `size` | Metadatos del archivo. |
| `es_principal` | Marca la imagen principal del módulo/entidad. |
| `estado`, `estado_archivo` | Activo/inactivo y ciclo de vida. |
| `id_directorio_documento` | Vínculo opcional a directorio documental. |
| `created_at`, `updated_at` | Auditoría. |

### 7.2 Funciones clave (`media-db.service.ts`)

- **`obtenerMediaPorModulo(module, module_id, directorio_id?, companyId?)`:** lista medios activos con filtros opcionales.
- **`obtenerPrincipal(module, module_id)`:** obtiene un registro con `es_principal = true` y `estado = true`, con **orden** explícito.

### 7.3 Lógica de ordenamiento

- Listado por módulo: `es_principal DESC`, `updated_at DESC`, `created_at DESC`.
- Principal: `findOne` con `order: { updated_at: 'DESC', created_at: 'DESC' }` para desempatar si hubiera inconsistencias.

### 7.4 Problemas atacados en diseño

- **Duplicación de imágenes:** mitigada en origen enviando `logo: null` cuando no hay cambio (front + Flask que no reenvía metadata si no hay URL).
- **Imagen principal incorrecta:** el orden y el criterio `es_principal` + `estado` evitan tomar registros obsoletos; el endpoint dedicado “principal” centraliza la elección.

---

## 8. Submódulo Contacto / Dirección

### 8.1 Relación con tercero

- Modelo **contacto** con **`id_tercero`** obligatorio (Marshmallow `ContactoCreateSchema`).
- Lectura en **GraphQL** (`contactosByTercero`, `contacto`) en TerceroNestJs; escritura vía **REST** Flask bajo `/api/contactos` en el gateway.

### 8.2 Formularios

- `NuevoContacto.tsx`, `EditarContacto.tsx` con secciones (`SeccionContactoGeneral`, `SeccionContactoDireccion`, etc.).
- Validación Yup en `contactos/schemas/NuevoContactoSchema.ts`.

### 8.3 Selects dependientes

- **`SeccionContactoDireccion`:** `id_pais` (GraphQL `paises`) + `SelectProvincia` filtrado por país — mismo patrón que en tercero.

### 8.4 Alineación `provincia` vs `id_provincia`

- El front trabaja con **`id_provincia`**; los esquemas Python de contacto usan UUID para provincia.
- Evita el conflicto histórico de guardar **nombre de provincia en texto** frente al **ID** de catálogo.

---

## 9. Manejo de UUIDs

- **Frontend:** los IDs se manejan como **strings** en formularios y en GraphQL (`ID` / `String`).
- **Backend Flask:** normalización con `_safe_uuid` en servicio antes de persistir.
- **NestJS / TypeORM:** columnas `uuid` tipadas; IDs generados en BD o por aplicación.
- **Serialización:** se evitó mezclar objetos UUID crudos con strings inconsistentes en payloads JSON; las respuestas Marshmallow (`TerceroOutSchema`) tipan salidas como UUID donde aplica.

---

## 10. Problemas encontrados y soluciones (referencia)

| Tema | Descripción |
|------|-------------|
| **Provincia string vs `id_provincia`** | Modelo y UI migrados a **`id_provincia`** + selects dependientes; schemas legacy bajo control. |
| **Duplicación de imágenes** | `logo: null` si no hay cambio; metadata solo si hay URL nueva. |
| **Precarga en formularios** | Uso de `reset()` tras cargar GraphQL; `network-only` donde hace falta evitar caché obsoleto. |
| **Rutas `/tercero` vs `/terceros`** | Gateway define **GET** en singular `/api/tercero` y **POST** en plural `/api/terceros`; el cliente debe alinear paths (hay funciones legacy en `_apis_/tercero.js` que apuntan a rutas distintas — riesgo de 404 si no se unifica). |
| **`scope_acceso` en JWT** | Si falta en token, el front asume `'EMPRESA'`; el gateway puede resolver scope vía **InicioNestJs** para Flask. |
| **`findOne` sin orden en media** | Corregido con **`order`** en `obtenerPrincipal` para elegir el registro más reciente entre principales válidos. |

---

## 11. Buenas prácticas implementadas

- **Intención en el front:** el cliente decide si el logo cambió (`null` = sin cambio).
- **Backend de escritura simple:** Flask valida, persiste y solo dispara efectos laterales (media) cuando corresponde.
- **Eliminación progresiva de campos legacy** (provincia como texto) en favor de FK.
- **Separación lectura/escritura:** NestJS optimizado para consultas y joins; Flask para transacciones y reglas de creación/actualización.
- **Multitenancy:** `id_empresa` en cabeceras y modelo; listados GraphQL filtrables por empresa; usuarios GLOBAL con selector de empresa en UI.

---

## 12. Estado actual del módulo

- **Estable:** flujos principales de alta/edición/listado, contactos, integración media y catálogos están cableados en código.
- **Listo para producción** sujeto a pruebas de integración end-to-end (gateway + servicios + BD) y revisión de **rutas REST** del cliente frente al gateway.
- **Extensible:** el mismo patrón (REST escritura Flask / GraphQL lectura NestJS / media por módulo) sirve de plantilla para nuevos módulos (p. ej. **Socios**): nuevas entidades, `module` en media, queries en TerceroNestJs o servicio dedicado, y rutas en gateway siguiendo el contrato de headers multitenancy.

---

## Referencias de código (lectura rápida)

- Gateway scope y headers: `gateway-api/src/services/terceroPython.js`
- Rutas tercero REST: `gateway-api/src/routes/tercero.js`
- GraphQL proxy: `gateway-api/src/routes/graphql.js`
- Logo en edición: `frontReact/src/views/terceros/EditarTercero.tsx`
- Metadata logo en Flask: `TerceroPython/repositories/tercero_repository.py`
- Resolver logo: `TerceroNestJs/src/modules/tercero/tercero.resolver.ts`
- Media orden: `MediaServiceNestJs/src/modules/media/services/media-db.service.ts`

---

*Documento generado como mapa técnico para equipos de desarrollo. No sustituye diagramas de despliegue ni variables de entorno concretas de cada entorno.*
