# Auditoría: catálogos en InicioNestJs (y referencia Incoterm en TerceroNestJS)

**Objetivo:** Mostrar la estructura de los catálogos empresa, pais e incoterm para replicar el patrón con un nuevo catálogo `tamano_empresa`.  
**Alcance:** Solo análisis. No se ha modificado código.

---

## Nota sobre alcance

- **InicioNestJs** contiene los catálogos **empresa** y **pais** (y otros como moneda, tipo-entidad-comercial).
- **incoterm** no está en InicioNestJs; está en **TerceroNestJS** (módulo catalogos). Se documenta aquí como referencia.

---

# INICIONESTJS

## Estructura general del proyecto

Los catálogos no tienen módulos Nest separados: todo se registra en **`app.module.ts`** (entidades en `TypeOrmModule.forRoot` y `forFeature`, resolvers y services en `providers`).

Carpetas usadas:

- **entities:** `src/entities/`
- **resolvers:** `src/resolvers/`
- **services:** `src/services/`
- **dto:** `src/dto/`

---

## 1. Catálogo PAIS (lectura, patrón simple)

Patrón: **entity + service + resolver**. Solo lectura (query). Sin DTOs de input.

### Archivos

| Pieza   | Archivo | Descripción |
|--------|---------|-------------|
| Entity | `src/entities/pais.entity.ts` | Tipo GraphQL + tabla `pais` (id_pais, nombre, codigo_iso, icono, relaciones) |
| Service | `src/services/pais.service.ts` | `PaisService`: `findAll()`, `findOne(id)` con `@InjectRepository(Pais)` |
| Resolver | `src/resolvers/pais.resolver.ts` | `PaisResolver`: `@Query(() => [Pais], { name: 'paises' })` → llama a `paisService.findAll()` |
| DTO     | — | No hay (solo se devuelve la entity) |
| Module  | `src/app.module.ts` | `Pais` en entities y forFeature; `PaisResolver`, `PaisService` en providers |

### Fragmentos clave

**Entity (pais.entity.ts):**
- `@ObjectType()` + `@Entity('pais')`
- `@Field(() => ID)` + `@PrimaryGeneratedColumn('uuid')` en `id_pais`
- Campos: `nombre`, `codigo_iso`, `icono`; relaciones opcionales con Empresa y Provincia

**Resolver (pais.resolver.ts):**
- `@Resolver(() => Pais)`
- Constructor: `PaisService`
- `@Query(() => [Pais], { name: 'paises' })` → `getPaises()` → `this.paisService.findAll()`

**Service (pais.service.ts):**
- `@Injectable()`, `@InjectRepository(Pais)`
- `findAll()`: `this.paisRepository.find({ order: { nombre: 'ASC' } })`
- `findOne(id)`: `findOne({ where: { id_pais: id } })`

---

## 2. Catálogo EMPRESA (lectura + DTOs de lista)

Empresa no es un catálogo “solo lista”: es la entidad principal con queries y DTOs de presentación. Mutaciones están deshabilitadas en código.

### Archivos

| Pieza   | Archivo | Descripción |
|--------|---------|-------------|
| Entity | `src/entities/empresa.entity.ts` | Tipo GraphQL + tabla `empresa` (muchos campos y relaciones) |
| Resolver | `src/resolvers/empresa.resolver.ts` | Queries `empresas` (devuelve `EmpresaListDto[]`), `empresa(id_empresa)`; `@ResolveField` identificacion; sin service propio, usa `@InjectRepository(Empresa)` |
| Service | — | No hay `EmpresaService`; el resolver usa el repositorio directamente |
| DTO     | `src/dto/empresa-list.dto.ts` | Para la query `empresas` |
|         | `src/dto/empresa-basic.dto.ts` | Uso básico |
|         | `src/dto/create-empresa.input.ts` | Input create (mutaciones deshabilitadas) |
|         | `src/dto/update-empresa.input.ts` | Input update (mutaciones deshabilitadas) |
| Module  | `src/app.module.ts` | `Empresa` en entities y forFeature; `EmpresaResolver` en providers |

### Fragmentos clave

**Resolver (empresa.resolver.ts):**
- `@Resolver(() => Empresa)`
- Constructor: `@InjectRepository(Empresa)` + `AuthService`
- `@Query(() => [EmpresaListDto])` empresas() → `empresaRepository.find(...)`
- `@Query(() => Empresa, { nullable: true })` empresa(id_empresa) → query con relaciones
- `@ResolveField` para `identificacion`

Para un **catálogo simple** como `tamano_empresa` el patrón a seguir es el de **pais** (y moneda), no el de empresa.

---

## 3. Catálogo MONEDA (mismo patrón que pais)

Misma estructura que pais: entity + service + resolver, solo lectura.

| Pieza   | Archivo |
|--------|---------|
| Entity | `src/entities/moneda.entity.ts` |
| Service | `src/services/moneda.service.ts` |
| Resolver | `src/resolvers/moneda.resolver.ts` |
| DTO     | — |
| Module  | `src/app.module.ts` |

Resolver: `@Query(() => [Moneda], { name: 'monedas' })` → `monedaService.findAll()`.

---

## 4. Catálogo TIPO_ENTIDAD_COMERCIAL (resolver sin service)

Patrón: **entity + resolver**; el resolver inyecta el repositorio y no usa un service.

| Pieza   | Archivo |
|--------|---------|
| Entity | `src/entities/tipo-entidad-comercial.entity.ts` |
| Resolver | `src/resolvers/tipo-entidad-comercial.resolver.ts` |
| Service | — |
| DTO     | — |
| Module  | `src/app.module.ts` |

**Resolver:** `@InjectRepository(TipoEntidadComercial)`, `@Query(() => [TipoEntidadComercial], { name: 'tiposEntidadComercial' })` → `this.repo.find({ order: { id_tipo_entidad: 'ASC' } })`.

---

# TERCERONESTJS (referencia: incoterm)

**incoterm** está en TerceroNestJS, no en InicioNestJs.

### Estructura incoterm en TerceroNestJS

| Pieza   | Archivo | Descripción |
|--------|---------|-------------|
| Entity | `src/modules/catalogos/entities/incoterm.entity.ts` | `@ObjectType()`, `@Entity('incoterm_catalogo')`, id_incoterm (uuid), codigo, descripcion |
| Resolver | `src/modules/catalogos/catalogos.resolver.ts` | Un solo `CatalogosResolver` con varios `@InjectRepository` (TipoTercero, Incoterm, …); `@Query(() => [Incoterm], { name: 'incoterms' })` → `incotermRepo.find({ order: { codigo: 'ASC' } })` |
| Service | — | No hay; el resolver usa el repo |
| DTO     | — | No hay |
| Module  | `src/modules/catalogos/catalogos.module.ts` | `TypeOrmModule.forFeature([..., Incoterm, ...])`, `CatalogosResolver` en providers |

---

# Patrón recomendado para `tamano_empresa` en InicioNestJs

Para replicar el patrón de catálogo **simple y solo lectura** como **pais** y **moneda** en InicioNestJs:

## Estructura de archivos a crear

| Pieza   | Archivo (InicioNestJs) |
|--------|-------------------------|
| Entity | `src/entities/tamano-empresa.entity.ts` |
| Service | `src/services/tamano-empresa.service.ts` |
| Resolver | `src/resolvers/tamano-empresa.resolver.ts` |
| DTO     | No necesario (devolver la entity) |
| Module  | Registrar en `src/app.module.ts` (entidad en TypeORM, resolver y service en providers) |

## Contenido conceptual (sin implementar)

1. **Entity:** tabla `tamano_empresa` (o la que corresponda), `@ObjectType()`, `@Entity(...)`, campos con `@Field()` y `@Column()` (por ejemplo id, codigo, nombre).
2. **Service:** `@Injectable()`, `@InjectRepository(TamanoEmpresa)`, `findAll()` con `order`, opcionalmente `findOne(id)`.
3. **Resolver:** `@Resolver(() => TamanoEmpresa)`, inyectar `TamanoEmpresaService`, `@Query(() => [TamanoEmpresa], { name: 'tamanosEmpresa' })` que llame a `service.findAll()`.
4. **app.module.ts:** añadir la entidad en `entities` y en `TypeOrmModule.forFeature`, y `TamanoEmpresaResolver` y `TamanoEmpresaService` en `providers`.

Con esto se replica el mismo patrón que **pais** y **moneda** en InicioNestJs. Incoterm en TerceroNestJS sigue un patrón similar pero sin service y dentro de un resolver de catálogos compartido.
