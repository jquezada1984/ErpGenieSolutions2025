# Módulo Terceros – Plantilla Arquitectónica del ERP

## 1. Introducción

El **módulo Terceros** es el módulo base del ERP y define los estándares de arquitectura del sistema. Sirve como referencia técnica para desarrollar nuevos módulos (Empresas, Productos, Bancos, Facturación, Contabilidad, etc.) con coherencia y mantenibilidad.

El ERP utiliza **arquitectura de microservicios** con los siguientes componentes:

- **Frontend React** – Interfaz de usuario, formularios, consultas y mutaciones.
- **Backend NestJS** – GraphQL para consultas (listados, detalle, catálogos).
- **Backend Python Flask** – REST para escritura (crear, actualizar, eliminar).
- **Gateway Node** – Punto único de entrada que enruta a NestJS o a Python.
- **PostgreSQL** – Base de datos única de persistencia.
- **UUID** – Identificadores principales en todas las entidades (PK y FK).

Principios que guían el diseño:

- **Separación lectura/escritura**: consultas por GraphQL (NestJS), escrituras por REST (Python).
- **Multiempresa y alcance**: soporte para usuario **GLOBAL** (varias empresas) y **EMPRESA** (una sola empresa), usando JWT (`scope_acceso`, `id_empresa`).

Este documento describe cómo está construido el módulo Terceros para usarlo como **plantilla** al desarrollar nuevos módulos.

---

## 2. Arquitectura del módulo Terceros

### 2.1 Flujo de datos: consultas (lectura)

Las pantallas que **listan** o **obtienen** datos (listados, detalle para edición, catálogos para selects) utilizan GraphQL a través del Gateway o directamente contra NestJS:

1. **Frontend React** → GraphQL (Apollo) o REST al Gateway.
2. **Gateway** → reenvía a **NestJS**.
3. **NestJS** → consulta **PostgreSQL** y devuelve JSON/GraphQL.

```
┌─────────────────┐     GraphQL / GET      ┌─────────────┐     GraphQL      ┌─────────────┐     SQL      ┌────────────┐
│  Frontend React │ ──────────────────────► │   Gateway   │ ────────────────► │   NestJS    │ ───────────► │ PostgreSQL │
│  (listar/ver)   │ ◄────────────────────── │   (Node)    │ ◄──────────────── │  (GraphQL)  │ ◄─────────── │            │
└─────────────────┘     JSON               └─────────────┘     JSON          └─────────────┘              └────────────┘
```

### 2.2 Flujo de datos: escritura (crear / actualizar / eliminar)

Para operaciones de escritura el flujo es:

1. **Frontend React** → REST (POST / PUT / DELETE) al **Gateway**.
2. **Gateway** → reenvía a **Flask (TerceroPython)**.
3. **TerceroPython** → valida, aplica lógica de negocio y escribe en **PostgreSQL**.

```
┌─────────────────┐   POST / PUT / DELETE  ┌─────────────┐   REST (JSON)    ┌─────────────────┐   SQL      ┌────────────┐
│  Frontend React │ ──────────────────────► │   Gateway   │ ────────────────► │ TerceroPython   │ ─────────► │ PostgreSQL │
│  (crear/editar) │ ◄────────────────────── │   (Node)    │ ◄──────────────── │ (Flask)         │ ◄───────── │            │
└─────────────────┘   JSON                  └─────────────┘   JSON           └─────────────────┘            └────────────┘
```

### 2.3 Resumen por tipo de operación

| Operación              | Frontend      | Gateway | Backend   | BD         |
|------------------------|---------------|---------|-----------|------------|
| Listados, detalle, catálogos | GraphQL / REST | Sí      | NestJS    | PostgreSQL |
| Crear tercero          | REST POST     | Sí      | Flask     | PostgreSQL |
| Actualizar tercero     | REST PUT      | Sí      | Flask     | PostgreSQL |
| Eliminar tercero       | REST DELETE   | Sí      | Flask     | PostgreSQL |

---

## 3. Patrón de Base de Datos

### 3.1 Principios

- **Uso obligatorio de UUID como PK**: Todas las tablas de negocio usan `id_<entidad>` tipo UUID (PostgreSQL: `uuid` o `varchar(36)`).
- **Uso de FK para catálogos**: Referencias a tipos, países, provincias, etc. son **claves foráneas** a tablas de catálogo.
- **Evitar campos string para referencias**: No almacenar el nombre de provincia o país como texto; usar `id_provincia`, `id_pais` y tablas de catálogo.
- **Uso de tablas de catálogo**: `pais`, `provincia`, `tipo_tercero_catalogo`, `condicion_pago_catalogo`, `forma_pago_catalogo`, etc.

### 3.2 Ejemplo de modelo geográfico

```
pais
└ provincia
```

- `pais`: id_pais (PK), nombre, codigo_iso, ...
- `provincia`: id_provincia (PK), id_pais (FK → pais.id_pais), nombre, ...

### 3.3 Ejemplo de relaciones en el módulo Terceros

**tercero**

- `id_provincia` → `provincia.id_provincia`
- `id_pais` → `pais.id_pais`
- `id_empresa` → `empresa.id_empresa`
- `id_tipo_tercero` → `tipo_tercero_catalogo.id_tipo_tercero`

**contacto_direccion**

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
    id_tercero   VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa   VARCHAR(36) NOT NULL REFERENCES empresa(id_empresa),
    id_pais      VARCHAR(36) REFERENCES pais(id_pais),
    id_provincia VARCHAR(36) REFERENCES provincia(id_provincia),
    nombre       VARCHAR(150) NOT NULL
    -- ...
);

-- Subentidad (contactos del tercero)
CREATE TABLE contacto_direccion (
    id_contacto  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tercero   VARCHAR(36) NOT NULL REFERENCES tercero(id_tercero) ON DELETE CASCADE,
    id_pais      VARCHAR(36) REFERENCES pais(id_pais),
    id_provincia VARCHAR(36) REFERENCES provincia(id_provincia),
    nombre       VARCHAR(150)
    -- ...
);
```

---

## 4. Patrón Backend Python (Servicios de Escritura)

El backend de escritura (TerceroPython) sigue una estructura en capas.

### 4.1 Estructura típica

```
TerceroPython/
├── models/          # ORM SQLAlchemy (entidades y tablas)
├── repositories/    # Acceso a datos (CRUD, queries)
├── schemas/         # Validación Marshmallow (Create, Update, Response)
├── services/        # Lógica de negocio (orquestación)
├── api/             # Rutas REST (blueprints Flask, endpoints)
├── utils/           # DB, helpers
└── app.py           # Aplicación Flask
```

### 4.2 Responsabilidades

| Capa           | Responsabilidad |
|----------------|------------------|
| **models/**    | ORM SQLAlchemy: definición de tablas, columnas, FK. Sin lógica de negocio. |
| **repositories/** | Acceso a datos: funciones que reciben payload, construyen entidades, `db.session.add/commit`, devuelven entidad o lista. |
| **schemas/**   | Validación Marshmallow: esquemas Create, Update y Response. |
| **services/**  | Lógica de negocio: validaciones, transformaciones, llamadas a repositorios, construcción de la respuesta. |
| **api/** (routes) | Endpoints REST: reciben request, extraen body/params y headers, llaman al servicio, devuelven JSON y código HTTP. |

### 4.3 Ejemplo simplificado de flujo create/update

**Create**

1. Route `POST /tercero` recibe JSON y headers (`X-Company-Id`, `X-User-Id`).
2. Route llama a `servicio_crear_tercero(data, id_empresa, user_id)`.
3. Service valida con schema, llama a `create_tercero(payload, id_empresa, user_id)` en el repositorio.
4. Repository instancia `Tercero(...)`, `db.session.add(tercero)`, `commit`, devuelve entidad.
5. Service serializa y devuelve dict; Route devuelve `jsonify(res)`, 201.

**Update**

1. Route `PUT /tercero/<id>` recibe id, JSON y headers (incl. `X-Scope-Acceso` para GLOBAL/EMPRESA).
2. Route llama a `servicio_actualizar_tercero(id_tercero, id_empresa, data, user_id, scope_acceso)`.
3. Service valida y llama a `update_tercero(id_tercero, id_empresa, payload, user_id, scope_acceso)`.
4. Repository: si `scope_acceso === 'GLOBAL'` busca solo por `id_tercero`; si `EMPRESA`, por `id_tercero` e `id_empresa`. Actualiza campos permitidos, `commit`, devuelve entidad.
5. Service serializa; Route devuelve JSON y 200 (o 404 si no encontrado).

---

## 5. Patrón Backend NestJS (Servicios de Consulta)

NestJS se usa **principalmente para consultas**: listados, detalle, catálogos y todo lo que el frontend necesita para **leer** datos.

### 5.1 Estructura

```
TerceroNestJs/src/modules/tercero/
├── entities/           # TypeORM + decoradores GraphQL (mapeo DB)
├── dto/                # Inputs GraphQL (create, update)
├── contacto/
│   ├── entities/
│   ├── dto/
│   ├── contacto.resolver.ts
│   ├── contacto.service.ts
│   └── contacto.module.ts
├── tercero.resolver.ts
├── tercero.service.ts
└── tercero.module.ts
```

### 5.2 Responsabilidades

| Elemento   | Responsabilidad |
|-----------|------------------|
| **entity** | Mapping DB: `@Column`, `@Field`. Define la forma del tipo GraphQL y de la tabla. |
| **dto**    | Inputs GraphQL: `@Field`, validadores (class-validator). |
| **resolver** | Endpoints GraphQL: `@Query`, `@Mutation`, reciben args y delegan en el service. |
| **service** | Lógica de negocio de lectura: repositorio TypeORM (`find`, `findOne`), filtros opcionales (ej. `id_empresa`). |

Las mutaciones de escritura (crear/actualizar tercero) se delegan en el backend Python vía Gateway; NestJS se usa sobre todo para consultas.

---

## 6. Patrón Frontend React

### 6.1 Estructura del módulo

```
frontReact/src/
├── views/terceros/
│   ├── Terceros.tsx, Clientes.tsx, Proveedores.tsx, ClientesPotenciales.tsx
│   ├── NuevoTercero.tsx, NuevoCliente.tsx, ...
│   ├── EditarTercero.tsx, EditarCliente.tsx, ...
│   ├── contactos/
│   │   ├── NuevoContacto.tsx, EditarContacto.tsx
│   │   ├── schemas/
│   │   └── secciones/
│   ├── schemas/
│   └── secciones/
├── components/selects/
│   ├── SelectProvincia.tsx
│   ├── SelectEmpresa.tsx
│   └── ...
└── _apis_/
    ├── tercero.js
    └── contacto.js
```

### 6.2 Responsabilidades

| Elemento              | Responsabilidad |
|-----------------------|-----------------|
| **views/**            | Pantallas: listados, formularios de alta y edición. Orquestan datos (GraphQL/REST), formulario y envío al backend. |
| **schemas/**          | Validación de formularios (Yup) y tipos TypeScript (NuevoTerceroFormValues, etc.). |
| **components/selects/** | Selects reutilizables que obtienen opciones por API/GraphQL y devuelven `id` (UUID). |
| **_apis_/**           | Funciones que llaman al Gateway (REST) y/o Apollo (GraphQL). |

### 6.3 Patrón GLOBAL / EMPRESA en listados

En listados (Terceros, Clientes, Proveedores, Clientes Potenciales):

- **Usuario EMPRESA** (`scope_acceso === 'EMPRESA'`): se usa `id_empresa` del JWT (`useJwtPayload()`). La tabla se carga al montar con `loadX(idEmpresaUsuario)`.
- **Usuario GLOBAL** (`scope_acceso === 'GLOBAL'`): al entrar no se cargan datos; se muestra tabla vacía y un mensaje (“Seleccione una empresa para ver los terceros/clientes/...”). Se muestra **SelectEmpresa**; al elegir empresa se llama `loadX(id_empresa_seleccionado)`.

El scope y `id_empresa` se obtienen con el hook `useJwtPayload()` (payload del JWT en `localStorage`).

---

## 7. Patrón de Selects Dependientes

Para datos jerárquicos se usan selects dependientes; el segundo se rellena en función del primero y devuelve **id**, no texto.

### 7.1 Ejemplo: País → Provincia

- **SelectPais**: lista países; al elegir uno se guarda `id_pais`.
- **SelectProvincia**: recibe `id_pais`, consulta provincias de ese país y devuelve `id_provincia`.

### 7.2 Componente SelectProvincia

**Características:**

- Recibe `id_pais` (y `value`, `onChange`, etc.).
- Consulta GraphQL `provinciasByPais(idPais: $idPais)` (o `provincias` si no hay país).
- Devuelve `id_provincia` vía `onChange(id_provincia)`.
- Usa react-select con búsqueda (SearchableSelect).

### 7.3 Ejemplo de uso en formulario

```tsx
<SelectPais
  value={id_pais}
  onChange={(v) => {
    setValue('id_pais', v ?? '');
    setValue('id_provincia', '');
  }}
/>
<SelectProvincia
  id_pais={id_pais}
  value={id_provincia}
  onChange={(v) => setValue('id_provincia', v ?? '')}
/>
```

El formulario envía al backend **id_pais** e **id_provincia** (UUIDs), no nombres en texto.

---

## 8. Patrón de Formularios

- **react-hook-form**: control de formularios, validación y estado.
- **initialForm**: objeto con valores por defecto (strings vacíos, booleanos, etc.) que coincide con el tipo del schema (ej. `NuevoTerceroFormValues`).
- **reset(values)**: al cargar datos en pantallas de edición, se llama `reset({ ... })` con los datos obtenidos por GraphQL para rellenar todos los campos (incluido `id_provincia` para el SelectProvincia).
- **Payload enviado al backend**: en `onSubmit` se construye un objeto con los campos que espera la API (por ejemplo `id_provincia`, `id_pais`, `nombre`, ...). Se envía por REST al Gateway (Python); no se envían nombres de provincia o país como texto, solo los UUID.

Ejemplo conceptual de payload:

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

Reglas del ERP que deben aplicarse al replicar el módulo:

1. **Usar UUID en todas las tablas**: PK y FK con UUID (o equivalente); no usar integers autoincrement para entidades de negocio.
2. **Nunca usar texto para relaciones**: No almacenar “nombre de provincia” o “nombre de país” como string; usar `id_provincia`, `id_pais` y tablas de catálogo.
3. **Usar FK a tablas catálogo**: Tipos, países, provincias, condiciones de pago, etc. son tablas con PK; las entidades referencian por FK.
4. **Separar lectura y escritura**: Consultas por GraphQL (NestJS). Crear/actualizar/eliminar por REST (Python) a través del Gateway.
5. **Usar selects dependientes para datos geográficos**: País → Provincia con componentes que reciben `id_pais`, consultan provincias por país y devuelven `id_provincia`.
6. **Un solo punto de entrada**: El frontend habla con el Gateway; el Gateway enruta a NestJS o a Python según el tipo de operación.
7. **Headers de contexto**: Operaciones de escritura reciben `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso` (GLOBAL/EMPRESA) para multiempresa y control de acceso.
8. **Consistencia de nombres**: Mismos nombres de campos en BD, backend y frontend (id_provincia, id_pais, id_tercero, etc.).

---

## 10. Cómo Replicar Este Módulo para Nuevos Dominios

Este módulo puede usarse como plantilla para dominios como:

- **Empresas**
- **Productos**
- **Bancos**
- **Facturación**
- **Contabilidad**

Pasos recomendados:

1. **Base de datos**
   - Crear tablas con PK UUID.
   - Definir catálogos (tablas) para datos tipados y usar FK desde la entidad principal.
   - Evitar columnas “nombre de X” cuando X sea un catálogo; usar `id_X`.

2. **Backend Python (escritura)**
   - Crear proyecto o módulo siguiendo `TerceroPython`: `models/`, `repositories/`, `schemas/`, `services/`, `api/` (routes).
   - Exponer REST: POST (crear), PUT (actualizar), DELETE (eliminar).
   - Recibir en body los mismos nombres que en el frontend (id_empresa, id_provincia, etc.).
   - Si aplica multiempresa, usar headers `X-Company-Id`, `X-Scope-Acceso` y filtrar por empresa cuando el scope sea EMPRESA.

3. **Backend NestJS (consulta)**
   - Crear módulo con `entities/`, `dto/`, `resolver`, `service`.
   - Exponer Queries GraphQL para listados, detalle y catálogos (con argumento opcional `id_empresa` cuando aplique).
   - Entities alineadas con las tablas.

4. **Gateway**
   - Añadir rutas que envíen lectura a NestJS y escritura al microservicio Python correspondiente (igual que en `tercero.js`).
   - Incluir en headers hacia Python: `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso`.

5. **Frontend**
   - Crear bajo `views/<dominio>/` las pantallas de listado, nuevo y edición.
   - Definir schemas Yup y tipos para formularios.
   - Usar componentes de select reutilizables (o crear nuevos siguiendo el patrón SelectProvincia) que devuelvan UUID.
   - En listados, replicar el patrón GLOBAL/EMPRESA: `useJwtPayload()`, SelectEmpresa para GLOBAL, carga filtrada por `id_empresa`.
   - En `_apis_/` crear el cliente que llame al Gateway y/o GraphQL para ese dominio.

6. **Reutilización**
   - Catálogos ya existentes (pais, provincia, empresa, etc.) se reutilizan; solo se añaden nuevos cuando el dominio lo requiera.
   - Los mismos patrones de formulario (initialForm, reset, payload con ids) y de selects dependientes se aplican en el nuevo módulo.

Con esto, el módulo Terceros queda documentado como **plantilla arquitectónica** para desarrollar nuevos módulos del ERP de forma consistente.
