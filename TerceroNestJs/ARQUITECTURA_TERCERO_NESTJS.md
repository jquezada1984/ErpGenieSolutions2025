# Arquitectura del microservicio TerceroNestJs

Documento de referencia para replicar esta estructura en otro módulo (por ejemplo **ProductoNestJs**). Describe la organización de carpetas, archivos y responsabilidades de cada capa.

---

## 1. Visión general

El microservicio **TerceroNestJs** es un servicio **NestJS** que expone:

- **GraphQL** (Apollo, code-first): queries y mutations de terceros y catálogos.
- **REST** opcional: controlador con `GET /tercero` (listar) y `GET /tercero/health`.

Utiliza **TypeORM** con **PostgreSQL**. El esquema GraphQL se genera en `src/schema.gql`. El servicio corre por defecto en el puerto **3001** y es consumido por un **gateway** que reenvía las peticiones (REST o GraphQL).

Estructura de capas:

- **Controller** → endpoints REST (opcional).
- **Resolver** → capa GraphQL (queries/mutations) que delega en el **Service**.
- **Service** → lógica de negocio y acceso a datos vía **Repository** (TypeORM).
- **Entities** → modelos TypeORM con decoradores GraphQL (`@ObjectType`, `@Field`).
- **DTOs** → inputs de GraphQL (`@InputType`) con validación (class-validator).
- **Modules** → agrupación por dominio (tercero, catalogos, empresa).

---

## 2. Estructura de carpetas y archivos

```
TerceroNestJs/
├── src/
│   ├── main.ts                    # Bootstrap: NestFactory, CORS, listen(3001)
│   ├── app.module.ts              # Módulo raíz: GraphQL, TypeORM, imports de Tercero/Catalogos/Empresa
│   ├── app.controller.ts          # Controlador raíz (opcional)
│   ├── app.service.ts
│   ├── app.controller.spec.ts
│   │
│   └── modules/                    # Módulos de dominio
│       ├── tercero/               # Módulo principal de terceros
│       │   ├── tercero.module.ts       # TypeOrmModule.forFeature([Tercero]), Controller, Service, Resolver
│       │   ├── tercero.controller.ts  # REST: GET /tercero, GET /tercero/health
│       │   ├── tercero.resolver.ts     # GraphQL: queries terceros/tercero, mutations create/update/remove
│       │   ├── tercero.service.ts      # findAll, findOne, create, update, remove (usa Repository)
│       │   ├── tercero.controller.spec.ts
│       │   ├── tercero.service.spec.ts
│       │   ├── dto/
│       │   │   ├── create-tercero.dto.ts   # @InputType CreateTerceroInput (class-validator)
│       │   │   └── update-tercero.dto.ts  # @InputType UpdateTerceroInput (PartialType + id_tercero)
│       │   ├── entities/
│       │   │   └── tercero.entity.ts      # @ObjectType @Entity('tercero') con relaciones a Empresa, Pais, etc.
│       │   └── interfaces/
│       │       └── tercero.interface.ts    # Interface TypeScript (contrato opcional)
│       │
│       ├── catalogos/                  # Catálogos usados por tercero (y otros)
│       │   ├── catalogos.module.ts     # TypeOrmModule.forFeature([TipoTercero, CondicionPago, FormaPago, Incoterm, Pais, Empresa]), CatalogosResolver
│       │   ├── catalogos.resolver.ts   # Queries: tiposTercero, condicionesPago, formasPago, incoterms, paises, empresas
│       │   └── entities/
│       │       ├── tipo-tercero.entity.ts
│       │       ├── condicion-pago.entity.ts
│       │       ├── forma-pago.entity.ts
│       │       ├── incoterm.entity.ts
│       │       └── pais.entity.ts
│       │
│       ├── empresa/                    # Entidad Empresa (usada por Tercero y por CatalogosResolver)
│       │   ├── empresa.module.ts       # TypeOrmModule.forFeature([Empresa]), exports TypeOrmModule
│       │   └── entities/
│       │       └── empresa.entity.ts   # @ObjectType @Entity('empresa')
│       │
│       ├── catalogos.module.ts         # Módulo “agrupador” que solo importa EmpresaModule (nombre puede confundir con modules/catalogos)
│       └── empresa.module.ts           # Re-export o agrupador si se usa desde otro sitio
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.mjs
├── .prettierrc
├── Dockerfile                 # Multi-stage: node:20-alpine, build + runtime, EXPOSE 3001
├── README.md
└── ARQUITECTURA_TERCERO_NESTJS.md   # Este documento
```

**Nota:** En la raíz de `src/` puede existir una carpeta `catalogos/` antigua; el `app.module` usa **solo** `src/modules/catalogos/` y `src/modules/empresa/` y `src/modules/tercero/`. Para replicar en productos, basta con seguir la estructura bajo `src/modules/`.

---

## 3. Responsabilidad de cada parte

### 3.1 Raíz de la aplicación

- **`main.ts`**
  - Crea la app con `NestFactory.create(AppModule)`.
  - Habilita CORS (`origin: true`, `credentials: true`).
  - Escucha en `process.env.PORT ?? 3001`.
  - Mensaje de log con la URL de GraphQL (`/graphql`).

- **`app.module.ts`**
  - **GraphQL**: `GraphQLModule.forRoot` con ApolloDriver, `autoSchemaFile` en `src/schema.gql`, playground e introspection.
  - **TypeORM**: `forRoot` con `url: process.env.DATABASE_URL` (o variables DB_*), `entities` listadas explícitamente (Tercero, Empresa, TipoTercero, CondicionPago, FormaPago, Incoterm, Pais), `synchronize: false`, `ssl: { rejectUnauthorized: false }`.
  - **Imports**: `CatalogosModule`, `EmpresaModule`, `TerceroModule` (desde `./modules/...`).

Para **ProductoNestJs**: añadir en `forRoot` la entidad Producto (y catálogos que use) y un `ProductoModule`.

---

### 3.2 Módulo `tercero` — Dominio principal

- **`tercero.module.ts`**
  - `TypeOrmModule.forFeature([Tercero])`.
  - Declara `TerceroController`, `TerceroService`, `TerceroResolver`.
  - Exporta `TerceroService` por si otro módulo lo inyecta.

- **`tercero.controller.ts`** (REST)
  - `@Controller('tercero')`.
  - `GET /tercero/health` → `{ status: 'ok', module: 'tercero' }`.
  - `GET /tercero` → `terceroService.findAll()`.

- **`tercero.resolver.ts`** (GraphQL)
  - `@Resolver(() => Tercero)`.
  - **Queries**: `terceros` → `findAll()`, `tercero(id_tercero)` → `findOne(id_tercero)`.
  - **Mutations**: `createTercero(input)`, `updateTercero(input)`, `removeTercero(id_tercero)`.
  - Solo delega en `TerceroService`; no contiene lógica de negocio.

- **`tercero.service.ts`**
  - Inyecta `@InjectRepository(Tercero) private readonly terceroRepo: Repository<Tercero>`.
  - `findAll()`: `find()` con `relations: ['empresa', 'tipo_tercero']`, orden por `fecha_creacion DESC`.
  - `findOne(id_tercero)`: `findOne({ where: { id_tercero } })`, lanza `NotFoundException` si no existe.
  - `create(input)`: crea entidad con `create()` y `save()`, asigna fechas de auditoría.
  - `update(input)`: obtiene actual con `findOne`, hace merge con input, `save()`, devuelve actualizado.
  - `remove(id_tercero)`: obtiene entidad y `remove()` (borrado físico).

- **`entities/tercero.entity.ts`**
  - `@ObjectType()` para GraphQL y `@Entity('tercero')` para TypeORM.
  - PK: `id_tercero` (UUID).
  - Columnas y relaciones: `id_empresa` + `@ManyToOne` Empresa, `id_pais` + ManyToOne Pais, condicion_pago, forma_pago, tipo_tercero, sede_central (self-reference Tercero), y todos los campos de negocio (roles, nombre, contacto, comercial, auditoría).
  - Campos expuestos en GraphQL con `@Field()`; tipos de fecha con `GraphQLISODateTime`.

- **`dto/create-tercero.dto.ts`**
  - `@InputType()` y clase `CreateTerceroInput` con todos los campos necesarios para crear un tercero.
  - Decoradores de validación: `@IsUUID()`, `@IsString()`, `@Length()`, `@IsBoolean()`, `@IsOptional()`, `@IsEmail()`, etc.

- **`dto/update-tercero.dto.ts`**
  - `@InputType()` y `UpdateTerceroInput extends PartialType(CreateTerceroInput)` más campo obligatorio `id_tercero` y opcional `updated_by`.

- **`interfaces/tercero.interface.ts`**
  - Interface TypeScript con la forma del tercero (opcional; útil para tipado en servicios o tests).

Para **ProductoNestJs**: crear `modules/producto/` con `producto.module.ts`, `producto.controller.ts`, `producto.resolver.ts`, `producto.service.ts`, `entities/producto.entity.ts`, `dto/create-producto.dto.ts`, `dto/update-producto.dto.ts` y, si se desea, `interfaces/producto.interface.ts`.

---

### 3.3 Módulo `catalogos` — Entidades de catálogo

- **`catalogos.module.ts`**
  - `TypeOrmModule.forFeature([TipoTercero, CondicionPago, FormaPago, Incoterm, Pais, Empresa])`.
  - Provider: `CatalogosResolver`.
  - Exporta `TypeOrmModule` y `CatalogosResolver` para que otros módulos puedan usar repositorios o resolver.

- **`catalogos.resolver.ts`**
  - Queries de solo lectura: `tiposTercero`, `condicionesPago`, `formasPago`, `incoterms`, `paises`, `empresas`.
  - Cada query inyecta el repositorio correspondiente y hace `find()` con ordenación.

- **`entities/`**
  - Entidades pequeñas con `@ObjectType()` y `@Entity('nombre_tabla')`: PK UUID y pocos campos (nombre, descripcion, codigo, etc.).
  - Ejemplos: `tipo_tercero.entity.ts` → tabla `tipo_tercero_catalogo`, `condicion-pago.entity.ts` → `condicion_pago_catalogo`, `forma-pago.entity.ts` → `forma_pago_catalogo`, `incoterm.entity.ts` → `incoterm_catalogo`, `pais.entity.ts` → `pais`.

Para **ProductoNestJs**: si hay catálogos propios (categoría de producto, unidad de medida, etc.), se puede crear `modules/catalogos-producto/` o ampliar el mismo `catalogos` con nuevas entidades y queries.

---

### 3.4 Módulo `empresa`

- **`empresa.module.ts`**
  - `TypeOrmModule.forFeature([Empresa])`, exporta `TypeOrmModule` para que Tercero (y CatalogosResolver) puedan usar la entidad Empresa.

- **`entities/empresa.entity.ts`**
  - `@ObjectType()` y `@Entity('empresa')` con id_empresa, nombre, ruc, direccion, telefono, email, estado.

El módulo tercero importa la entidad Empresa desde aquí (relación ManyToOne). Para productos, si el producto pertenece a empresa, se hará igual (FK a Empresa).

---

## 4. Flujo de una petición (ejemplo: crear tercero por GraphQL)

1. El **gateway** o el cliente envía una mutación GraphQL `createTercero(input: { ... })`.
2. **tercero.resolver.ts** recibe la mutación y llama a `terceroService.create(input)`.
3. **tercero.service.ts** crea un objeto con el input y fechas, `terceroRepo.create(payload)` y `terceroRepo.save(entity)`.
4. TypeORM persiste en PostgreSQL y devuelve la entidad.
5. El resolver devuelve ese `Tercero`; GraphQL serializa según el tipo `Tercero` definido en la entidad.

Para REST: `GET /tercero` → controller → `terceroService.findAll()` → mismo servicio/repositorio.

---

## 5. Dependencias principales (package.json)

- **NestJS**: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`.
- **GraphQL**: `@nestjs/graphql`, `@nestjs/apollo`, `apollo-server-express`, `graphql`.
- **TypeORM**: `@nestjs/typeorm`, `typeorm`, `pg`.
- **Validación**: `class-validator`, `class-transformer`.
- **Otros**: `reflect-metadata`, `rxjs`.

---

## 6. Docker

- **Dockerfile**: multi-stage con `node:20-alpine`; stage de build: `npm install`, `npm run build`; stage runtime: solo producción, copia `dist/`, EXPOSE 3001, `CMD ["node", "dist/main.js"]`.
- Variable `PORT=3001` para que coincida con el gateway.

---

## 7. Checklist para replicar en ProductoNestJs

- [ ] Crear `src/modules/producto/` con: `producto.module.ts`, `producto.controller.ts`, `producto.resolver.ts`, `producto.service.ts`.
- [ ] Entidad: `entities/producto.entity.ts` con `@ObjectType()`, `@Entity('producto')`, relaciones (por ejemplo Empresa, categoría si aplica).
- [ ] DTOs: `dto/create-producto.dto.ts` y `dto/update-producto.dto.ts` con `@InputType()` y class-validator.
- [ ] En `app.module.ts`: registrar la entidad Producto en `TypeOrmModule.forRoot({ entities: [..., Producto] })` e importar `ProductoModule`.
- [ ] Si hay catálogos propios de producto: nuevo módulo bajo `modules/` (p. ej. `catalogos-producto`) con entities y resolver, o ampliar el existente.
- [ ] Resolver GraphQL: queries `productos` / `producto(id)` y mutations `createProducto`, `updateProducto`, `removeProducto`.
- [ ] Controller REST (opcional): `GET /producto`, `GET /producto/health`.
- [ ] Service: `findAll`, `findOne`, `create`, `update`, `remove` usando `Repository<Producto>`.
- [ ] Ajustar gateway para enrutar las peticiones de producto al nuevo servicio (y mismo puerto o uno distinto según diseño).

Con esto tu compañero puede replicar la arquitectura de TerceroNestJs en el módulo de productos manteniendo la misma organización (módulos, entities, DTOs, resolver, service, controller) y flujo GraphQL + REST.
