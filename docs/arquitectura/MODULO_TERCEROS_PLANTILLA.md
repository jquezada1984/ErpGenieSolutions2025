# Módulo Terceros – Plantilla Arquitectónica del ERP

## 1. Introducción

El **módulo Terceros** es el módulo base del ERP y define los estándares de arquitectura del sistema. Cualquier nuevo módulo (Empresas, Productos, Bancos, Facturación, Contabilidad, etc.) debe replicar estos patrones para mantener coherencia técnica, mantenibilidad y capacidad de evolución.

El ERP utiliza una **arquitectura de microservicios** con los siguientes componentes:

| Componente | Tecnología | Rol principal |
|-----------|------------|----------------|
| **Frontend** | React (Vite) | Interfaz de usuario, formularios, consultas y mutaciones |
| **Backend consultas** | NestJS | GraphQL para listados, detalle y catálogos |
| **Backend escritura** | Python (Flask) | REST para crear, actualizar y eliminar |
| **Gateway** | Node.js (Fastify) | Punto único de entrada, enrutado a NestJS o Python |
| **Base de datos** | PostgreSQL | Persistencia única |
| **Identificadores** | UUID | Claves primarias y referencias entre tablas |

Principios que guían el diseño:

- **Separación lectura/escritura**: consultas por GraphQL (NestJS), escrituras por REST (Python).
- **UUID** como identificador principal en todas las entidades.
- **Catálogos** como tablas (pais, provincia, tipo_tercero, etc.) con FK, nunca cadenas libres para referencias.

Este documento describe cómo está construido el módulo Terceros para usarlo como **plantilla** al desarrollar nuevos módulos.

---

## 2. Arquitectura del módulo Terceros

### 2.1 Flujo de datos: consultas (lectura)

Las pantallas que **listan** o **obtienen** datos (listados, detalle para edición, catálogos para selects) utilizan:

1. **Frontend React** → llama al Gateway (REST) o a GraphQL (Apollo) según el caso.
2. **Gateway** → reenvía a **NestJS** (que resuelve con GraphQL o expone REST que internamente usa GraphQL).
3. **NestJS** → consulta **PostgreSQL** y devuelve JSON/GraphQL.

```
┌─────────────────┐     GET /api/tercero      ┌─────────────┐     GraphQL/REST      ┌─────────────┐     SQL      ┌────────────┐
│  Frontend React │ ─────────────────────────► │   Gateway   │ ────────────────────► │   NestJS    │ ───────────► │ PostgreSQL │
│  (listar/ver)   │ ◄───────────────────────── │   (Node)   │ ◄──────────────────── │  (GraphQL)  │ ◄─────────── │            │
└─────────────────┘     JSON                  └─────────────┘     JSON              └─────────────┘             └────────────┘
```

En pantallas de **edición**, el frontend suele usar **Apollo Client** con una query GraphQL (por ejemplo `GET_TERCERO`) que apunta directamente al endpoint GraphQL de NestJS (o a través del Gateway), y NestJS lee de PostgreSQL.

### 2.2 Flujo de datos: escritura (crear / actualizar / eliminar)

Las operaciones que **modifican** datos (crear tercero, actualizar tercero, eliminar) van por REST al Gateway y de ahí a Python:

1. **Frontend React** → `POST/PUT/DELETE` al **Gateway** (REST).
2. **Gateway** → reenvía a **TerceroPython** (Flask).
3. **TerceroPython** → valida, aplica lógica de negocio y escribe en **PostgreSQL**.

```
┌─────────────────┐   POST/PUT/DELETE        ┌─────────────┐   REST (JSON)         ┌─────────────────┐   SQL      ┌────────────┐
│  Frontend React │ ────────────────────────► │   Gateway   │ ─────────────────────► │ TerceroPython   │ ─────────► │ PostgreSQL │
│  (crear/editar) │ ◄──────────────────────── │   (Node)   │ ◄───────────────────── │ (Flask)         │ ◄───────── │            │
└─────────────────┘   JSON                   └─────────────┘   JSON                └─────────────────┘            └────────────┘
```

### 2.3 Resumen de rutas por responsabilidad

| Operación | Frontend → | Gateway | Backend final | BD |
|-----------|------------|---------|----------------|----|
| Listar terceros, clientes, obtener uno | REST/GraphQL | Sí | NestJS | PostgreSQL |
| Catálogos (paises, provincias, tipos, etc.) | REST/GraphQL | Sí | NestJS | PostgreSQL |
| Crear tercero | REST POST | Sí | TerceroPython | PostgreSQL |
| Actualizar tercero | REST PUT | Sí | TerceroPython | PostgreSQL |
| Eliminar tercero | REST DELETE | Sí | TerceroPython | PostgreSQL |

---

## 3. Patrón de Base de Datos

### 3.1 Principios

- **UUID como PK**: Todas las tablas de negocio usan `id_<entidad>` tipo `UUID` (en PostgreSQL `uuid` o `varchar(36)`).
- **FK a catálogos**: Las referencias a tipos, países, provincias, etc. son **claves foráneas** a tablas de catálogo, no cadenas libres.
- **Evitar campos string para relaciones**: No se usa un campo `provincia` (texto) para “nombre de provincia”; se usa `id_provincia` → `provincia.id_provincia`.
- **Tablas de catálogo**: `pais`, `provincia`, `tipo_tercero_catalogo`, `condicion_pago_catalogo`, `forma_pago_catalogo`, etc.

### 3.2 Modelo geográfico

```
pais
├── id_pais (PK, UUID)
└── nombre, codigo_iso, ...

provincia
├── id_provincia (PK, UUID)
├── id_pais (FK → pais.id_pais)
└── nombre, ...
```

### 3.3 Relaciones en el módulo Terceros

- **tercero**
  - `id_provincia` → `provincia.id_provincia`
  - `id_pais` → `pais.id_pais`
  - `id_empresa` → `empresa.id_empresa`
  - `id_tipo_tercero` → `tipo_tercero_catalogo.id_tipo_tercero`
  - etc.

- **contacto_direccion**
  - `id_tercero` → `tercero.id_tercero`
  - `id_provincia` → `provincia.id_provincia`
  - `id_pais` → `pais.id_pais`

### 3.4 Ejemplo SQL (esquema simplificado)

```sql
-- Catálogos
CREATE TABLE pais (
    id_pais   VARCHAR(36) PRIMARY KEY,
    nombre    VARCHAR(100),
    codigo_iso VARCHAR(10)
);

CREATE TABLE provincia (
    id_provincia VARCHAR(36) PRIMARY KEY,
    id_pais      VARCHAR(36) NOT NULL REFERENCES pais(id_pais),
    nombre       VARCHAR(100)
);

-- Entidad principal
CREATE TABLE tercero (
    id_tercero    VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa    VARCHAR(36) NOT NULL REFERENCES empresa(id_empresa),
    id_pais       VARCHAR(36) REFERENCES pais(id_pais),
    id_provincia  VARCHAR(36) REFERENCES provincia(id_provincia),
    nombre        VARCHAR(150) NOT NULL,
    -- ...
);

-- Subentidad (contactos del tercero)
CREATE TABLE contacto_direccion (
    id_contacto   VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tercero    VARCHAR(36) NOT NULL REFERENCES tercero(id_tercero) ON DELETE CASCADE,
    id_pais       VARCHAR(36) REFERENCES pais(id_pais),
    id_provincia  VARCHAR(36) REFERENCES provincia(id_provincia),
    nombre        VARCHAR(150),
    -- ...
);
```

---

## 4. Patrón Backend Python (Servicios de Escritura)

El backend de escritura del módulo Terceros (TerceroPython) sigue una estructura en capas.

### 4.1 Estructura de carpetas

```
TerceroPython/
├── models/          # ORM SQLAlchemy (entidades y tablas)
├── repositories/    # Acceso a datos (CRUD, queries)
├── schemas/         # Validación y serialización (Marshmallow)
├── services/        # Lógica de negocio (orquestación)
├── api/             # Rutas REST (blueprints Flask)
├── utils/           # DB, helpers
└── app.py           # Aplicación Flask
```

### 4.2 Responsabilidades

| Capa | Responsabilidad |
|------|------------------|
| **models/** | Definición de tablas con SQLAlchemy: columnas, tipos, FK. Sin lógica de negocio. |
| **repositories/** | Funciones que reciben payload/dict, construyen entidades, hacen `db.session.add/commit`, devuelven entidad o lista. No validan reglas de negocio complejas. |
| **schemas/** | Esquemas Marshmallow para validar entrada (Create/Update) y formatear salida (Response). |
| **services/** | Lógica de negocio: validaciones, transformaciones, llamadas a repositorios, construcción del diccionario de respuesta. |
| **api/** (routes) | Endpoints REST: reciben request, extraen body/params, llaman al servicio, devuelven JSON y código HTTP. |

### 4.3 Flujo simplificado: crear / actualizar

**Crear**

1. **Route** `POST /tercero` recibe JSON, extrae headers (ej. `X-Company-Id`), llama a `servicio_crear_tercero(data, id_empresa, user_id)`.
2. **Service** valida (opcional con schema), llama a `create_tercero(payload, id_empresa, user_id)` del repositorio.
3. **Repository** instancia `Tercero(...)` con `payload.get("campo")`, hace `db.session.add(tercero)` y `commit`. Devuelve entidad.
4. **Service** convierte entidad a dict (o usa schema) y devuelve al route.
5. **Route** devuelve `jsonify(res)`, 201.

**Actualizar**

1. **Route** `PUT /tercero/:id` recibe id y JSON, llama a `servicio_actualizar_tercero(id_tercero, id_empresa, data, user_id)`.
2. **Service** opcionalmente valida, llama a `update_tercero(id_tercero, payload)` del repositorio.
3. **Repository** carga entidad por id, actualiza solo campos permitidos (lista `updatable`), `commit`, devuelve entidad.
4. **Service** convierte a dict y devuelve; **Route** devuelve JSON y 200.

---

## 5. Patrón Backend NestJS (Servicios de Consulta)

NestJS se usa principalmente para **consultas**: listados, detalle, catálogos y todo lo que el frontend necesita para **leer** datos y rellenar pantallas/selects.

### 5.1 Estructura del módulo (ej. tercero + contacto)

```
TerceroNestJs/src/modules/tercero/
├── entities/
│   ├── tercero.entity.ts      # TypeORM + decoradores GraphQL
│   └── ...
├── contacto/
│   ├── entities/
│   │   └── contacto.entity.ts
│   ├── dto/
│   │   ├── create-contacto.dto.ts
│   │   └── update-contacto.dto.ts
│   ├── contacto.resolver.ts
│   ├── contacto.service.ts
│   └── contacto.module.ts
├── dto/
│   ├── create-tercero.dto.ts
│   └── update-tercero.dto.ts
├── tercero.resolver.ts
├── tercero.service.ts
└── tercero.module.ts
```

### 5.2 Responsabilidades

| Elemento | Responsabilidad |
|---------|-----------------|
| **entity** | Mapeo tabla PostgreSQL: `@Column`, `@Field` (GraphQL). Define la forma del tipo GraphQL y de la tabla. |
| **dto** | Inputs GraphQL para mutaciones (Create/Update): `@Field`, validadores (class-validator). |
| **resolver** | Endpoints GraphQL: `@Query`, `@Mutation`, reciben args y delegan en el service. |
| **service** | Lógica de negocio de lectura: usa el repositorio TypeORM para `find`, `findOne`, etc., y devuelve entidades. |

Las **mutaciones** (createContacto, updateContacto, etc.) en NestJS pueden existir para compatibilidad o para flujos que aún no migraron a Python; el patrón de referencia del ERP es **escritura en Python**, **consulta en NestJS**.

---

## 6. Patrón Frontend React

### 6.1 Estructura del módulo de vistas (terceros)

```
frontReact/src/
├── views/terceros/
│   ├── Terceros.tsx              # Listado principal
│   ├── Clientes.tsx, Proveedores.tsx, ...
│   ├── NuevoTercero.tsx
│   ├── NuevoCliente.tsx, NuevoProveedor.tsx, ...
│   ├── EditarTercero.tsx
│   ├── EditarCliente.tsx, EditarProveedor.tsx, ...
│   ├── contactos/
│   │   ├── NuevoContacto.tsx
│   │   ├── EditarContacto.tsx
│   │   ├── schemas/
│   │   │   └── NuevoContactoSchema.ts
│   │   └── secciones/
│   │       ├── SeccionContactoGeneral.tsx
│   │       ├── SeccionContactoDireccion.tsx
│   │       └── SeccionContactoContacto.tsx
│   ├── schemas/
│   │   └── NuevoTerceroSchema.ts
│   └── secciones/
│       ├── SeccionTerceroGeneral.tsx
│       ├── SeccionTerceroUbicacionContacto.tsx
│       └── SeccionTerceroComercialOrganizacion.tsx
├── components/selects/
│   ├── SelectProvincia.tsx
│   ├── SelectPais.tsx
│   └── ...
└── _apis_/
    ├── tercero.js                 # Llamadas REST al Gateway (listar, crear, actualizar, eliminar, selects)
    └── contacto.js
```

### 6.2 Responsabilidades

| Elemento | Responsabilidad |
|----------|-----------------|
| **views/** | Pantallas: listados, formularios de alta y edición. Orquestan datos (GraphQL/REST), formulario (react-hook-form) y envío al backend. |
| **schemas/** | Validación de formularios (Yup) y tipos TypeScript (NuevoTerceroFormValues, etc.). |
| **secciones/** | Trozos de formulario reutilizables (pestañas o bloques: General, Ubicación, Contacto, Comercial). |
| **components/selects/** | Selects reutilizables que obtienen opciones por API/GraphQL y devuelven `id` (UUID), no texto. |
| **_apis_/** | Funciones que llaman al Gateway (REST) para crear/actualizar/eliminar y para catálogos; y/o uso de Apollo para GraphQL en pantallas de edición. |

---

## 7. Patrón de Selects Dependientes

Para datos jerárquicos (por ejemplo **País → Provincia**) se usan selects dependientes: el segundo se rellena en función del valor del primero y devuelve **id**, no texto.

### 7.1 Ejemplo: País → Provincia

- **SelectPais**: lista de países; al elegir uno se guarda `id_pais`.
- **SelectProvincia**: recibe `id_pais`; si hay valor, consulta `provinciasByPais(idPais)`; muestra provincias de ese país y devuelve `id_provincia`.

### 7.2 Componente SelectProvincia (resumen)

- **Props**: `value`, `onChange`, `id_pais`, `isDisabled`, `placeholder`, `error`.
- **Consulta**: GraphQL `provinciasByPais(idPais: $idPais)` (o `provincias` si no hay país).
- **Salida**: `onChange(id_provincia)` con el UUID seleccionado.
- **UI**: `SearchableSelect` (react-select con búsqueda).

### 7.3 Uso en formulario (ejemplo en sección de ubicación)

```tsx
<SelectPais
  value={id_pais}
  onChange={(v) => {
    setValue('id_pais', v ?? '');
    setValue('id_provincia', ''); // reset provincia al cambiar país
  }}
/>
<SelectProvincia
  id_pais={id_pais}
  value={id_provincia}
  onChange={(v) => setValue('id_provincia', v ?? '')}
/>
```

El formulario guarda y envía al backend **id_pais** e **id_provincia** (UUIDs), no nombres en texto.

---

## 8. Patrón de Formularios

- **react-hook-form**: control de formularios, validación y estado.
- **initialForm**: objeto con valores por defecto (strings vacíos, booleanos, etc.) que coincide con el tipo del schema (ej. `NuevoTerceroFormValues`).
- **reset(values)**: al cargar datos en pantallas de edición, se llama `reset({ ... })` con los datos obtenidos por GraphQL/REST para rellenar todos los campos (incluido `id_provincia` para el SelectProvincia).
- **Payload al backend**: en `onSubmit` se construye un objeto con los campos que espera la API (por ejemplo `id_provincia`, `id_pais`, `nombre`, ...). Los valores se envían por REST al Gateway (Python) para crear/actualizar; no se envían nombres de provincia/pais como texto, sino solo los UUID.

Ejemplo de construcción de payload (conceptual):

```ts
const payload = {
  nombre: values.nombre || '',
  id_pais: values.id_pais || null,
  id_provincia: values.id_provincia || null,
  // ...
};
await actualizarTercero(id, payload);
```

---

## 9. Buenas Prácticas Definidas por el Módulo Terceros

Estas reglas deben aplicarse al replicar el módulo en otros dominios:

1. **UUID en todas las tablas**: Las PK y las FK usan UUID (o tipos equivalentes en la BD). No usar integers autoincrement para entidades de negocio.
2. **No usar texto para relaciones**: No almacenar “nombre de provincia” o “nombre de país” como string en la entidad; usar siempre `id_provincia`, `id_pais` y tablas de catálogo.
3. **FK a tablas catálogo**: Tipos, países, provincias, condiciones de pago, etc. son tablas con PK; las entidades referencian por FK.
4. **Separar lectura y escritura**: Consultas (listados, detalle, catálogos) por GraphQL (NestJS). Crear/actualizar/eliminar por REST (Python) a través del Gateway.
5. **Selects dependientes para datos geográficos**: País → Provincia implementados con componentes que reciben `id_pais`, consultan provincias por país y devuelven `id_provincia`.
6. **Un solo punto de entrada**: El frontend habla con el Gateway; el Gateway enruta a NestJS o a Python según el tipo de operación.
7. **Headers de contexto**: Operaciones de escritura reciben en el Gateway/backend `X-Company-Id`, `X-User-Id` (o equivalentes) para multiempresa y auditoría.
8. **Consistencia de nombres**: En BD, backend y frontend usar los mismos nombres de campos (id_provincia, id_pais, id_tercero, etc.) para evitar errores y mapeos innecesarios.

---

## 10. Cómo Replicar Este Módulo para Nuevos Dominios

Para dominios como **Empresas**, **Productos**, **Bancos**, **Facturación**, **Contabilidad**:

1. **Base de datos**
   - Crear tablas con PK UUID.
   - Definir catálogos (tablas) para cualquier dato tipado (tipos de producto, cuentas bancarias, etc.) y usar FK desde la entidad principal.
   - Evitar columnas “nombre de X” cuando X sea un catálogo; usar `id_X`.

2. **Backend Python (escritura)**
   - Crear proyecto o módulo siguiendo `TerceroPython`: `models/`, `repositories/`, `schemas/`, `services/`, `api/` (routes).
   - Exponer REST: POST (crear), PUT (actualizar), DELETE (eliminar).
   - Recibir en body los mismos nombres que en el frontend (id_empresa, id_provincia, etc.).

3. **Backend NestJS (consulta)**
   - Crear módulo con `entities/`, `dto/`, `resolver`, `service`.
   - Exponer Queries GraphQL para listados, detalle y catálogos.
   - Entities alineadas con las tablas (incluido id_provincia, id_pais, etc., sin campo “provincia” texto).

4. **Gateway**
   - Añadir rutas que envíen **lectura** a NestJS y **escritura** al microservicio Python correspondiente (igual que en `tercero.js`).

5. **Frontend**
   - Crear bajo `views/<dominio>/` las pantallas de listado, nuevo y edición.
   - Definir schemas Yup y tipos para formularios.
   - Usar componentes de select reutilizables (o crear nuevos siguiendo el patrón SelectProvincia) que devuelvan UUID.
   - En `_apis_/` crear el cliente que llame al Gateway (y/o GraphQL) para ese dominio.

6. **Reutilización**
   - Catálogos ya existentes (pais, provincia, empresa, etc.) se reutilizan; solo se añaden nuevos catálogos si el dominio lo requiere.
   - Los mismos patrones de formulario (initialForm, reset, payload con ids) y de selects dependientes se aplican en el nuevo módulo.

Con esto, el módulo Terceros queda documentado como **plantilla arquitectónica** para desarrollar nuevos módulos del ERP de forma consistente.
