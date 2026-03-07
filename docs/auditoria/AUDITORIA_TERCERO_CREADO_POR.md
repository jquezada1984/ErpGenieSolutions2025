# Auditoría: columna `creado_por` (tabla tercero)

**Objetivo:** Localizar todas las referencias a `creado_por` en los microservicios **TerceroPython** y **TerceroNestJS** para un futuro renombrado a `created_by`.  
**Alcance:** Solo análisis. No se ha modificado ningún archivo.

---

## 1. Lista completa de archivos donde aparece `creado_por`

| # | Microservicio   | Ruta del archivo |
|---|-----------------|------------------|
| 1 | TerceroPython   | `TerceroPython/models/tercero.py` |
| 2 | TerceroPython   | `TerceroPython/schemas/tercero_schema.py` |
| 3 | TerceroPython   | `TerceroPython/repositories/tercero_repository.py` |
| 4 | TerceroNestJS   | `TerceroNestJs/src/modules/tercero/entities/tercero.entity.ts` |
| 5 | TerceroNestJS   | `TerceroNestJs/src/modules/tercero/interfaces/tercero.interface.ts` |
| 6 | TerceroNestJS   | `TerceroNestJs/src/modules/tercero/dto/create-tercero.dto.ts` |
| 7 | TerceroNestJS   | `TerceroNestJs/src/schema.gql` (3 apariciones) |
| 8 | TerceroNestJS   | `TerceroNestJs/src/modules/empresa/entities/tercero.entity.ts` |

**Total: 8 archivos, 10 referencias** (schema.gql cuenta como 1 archivo con 3 líneas).

---

## 2. Detalle por archivo (ruta, línea, fragmento, categoría, tipo)

### TerceroPython

---

#### 1. `TerceroPython/models/tercero.py`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 65 |
| **Fragmento** | `creado_por     = db.Column(db.String(36), nullable=True)  # Sin foreign key - campo simple` |
| **Categoría** | **MODELO / ENTITY** (modelo SQLAlchemy) |
| **Tipo de dato** | **string** (columna `db.String(36)`; en BD se guarda como texto UUID) |

---

#### 2. `TerceroPython/schemas/tercero_schema.py`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 129 |
| **Fragmento** | `creado_por     = fields.UUID(allow_none=True)` |
| **Categoría** | **SERIALIZER** (Marshmallow) |
| **Tipo de dato** | **UUID** (Marshmallow `fields.UUID`) |

---

#### 3. `TerceroPython/repositories/tercero_repository.py`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 45 |
| **Fragmento** | `creado_por=user_id,` (dentro del constructor `Tercero(...)` en `create_tercero`) |
| **Categoría** | **INSERT** (asignación al instanciar el modelo antes de `db.session.add`) |
| **Tipo de dato** | **string** (parámetro `user_id: Optional[str]`) |

---

### TerceroNestJS

---

#### 4. `TerceroNestJs/src/modules/tercero/entities/tercero.entity.ts`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 182 |
| **Fragmento** | `@Field({ nullable: true })`<br>`@Column({ type: 'uuid', nullable: true })`<br>`creado_por?: string;` |
| **Categoría** | **MODELO / ENTITY** (entidad TypeORM + campo GraphQL) |
| **Tipo de dato** | **UUID** en BD (`type: 'uuid'`), **string** en TypeScript |

---

#### 5. `TerceroNestJs/src/modules/tercero/interfaces/tercero.interface.ts`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 42 |
| **Fragmento** | `creado_por?: string;` |
| **Categoría** | **OTRO** (interfaz TypeScript) |
| **Tipo de dato** | **string** |

---

#### 6. `TerceroNestJs/src/modules/tercero/dto/create-tercero.dto.ts`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 55 |
| **Fragmento** | `@Field({ nullable: true }) @IsUUID() @IsOptional() creado_por?: string;` |
| **Categoría** | **DTO** |
| **Tipo de dato** | **string** (validación `@IsUUID()`) |

---

#### 7. `TerceroNestJs/src/schema.gql`

| # | Línea | Fragmento | Contexto |
|---|-------|------------|----------|
| 7a | 23 | `creado_por: String` | Tipo de **input** (crear tercero) |
| 7b | 106 | `creado_por: String` | Tipo **Tercero** (lectura) |
| 7c | 152 | `creado_por: String` | Otro tipo que incluye tercero (p. ej. listado) |

| Campo        | Valor |
|-------------|--------|
| **Categoría** | **OTRO** (esquema GraphQL generado) |
| **Tipo de dato** | **string** (escalar `String` en GraphQL) |

---

#### 8. `TerceroNestJs/src/modules/empresa/entities/tercero.entity.ts`

| Campo        | Valor |
|-------------|--------|
| **Línea**   | 187 |
| **Fragmento** | `@Field({ nullable: true })`<br>`@Column({ type: 'uuid', nullable: true })`<br>`creado_por?: string;` |
| **Categoría** | **MODELO / ENTITY** (entidad tercero en módulo empresa) |
| **Tipo de dato** | **UUID** en columna, **string** en TypeScript |

---

## 3. Resumen por categoría

| Categoría       | Archivos | Detalle |
|-----------------|----------|---------|
| **MODELO/ENTITY** | 3 | `tercero.py`, `tercero.entity.ts` (tercero), `tercero.entity.ts` (empresa) |
| **SERIALIZER**  | 1 | `tercero_schema.py` (Marshmallow) |
| **DTO**         | 1 | `create-tercero.dto.ts` |
| **INSERT**      | 1 | `tercero_repository.py` (asignación en creación) |
| **OTRO**        | 2 | `tercero.interface.ts`, `schema.gql` (3 líneas) |

**Nota:** No hay referencias explícitas en **UPDATE** ni en **SELECT**/queries SQL crudas en los archivos auditados. El SELECT viene implícito por el ORM (entidades) y el schema GraphQL.

---

## 4. Resumen por tipo de dato en código

| Tipo en código | Dónde |
|----------------|--------|
| **string**     | Modelo Python `db.String(36)`, repo `user_id`, interface TS, DTO TS, schema.gql `String` |
| **UUID**       | Marshmallow `fields.UUID`, TypeORM `type: 'uuid'` en ambas entidades |

---

## 5. Checklist para futuro renombrado a `created_by`

Al hacer el cambio habrá que actualizar:

- [ ] `TerceroPython/models/tercero.py` – nombre de columna en el modelo (y migración BD si aplica).
- [ ] `TerceroPython/schemas/tercero_schema.py` – nombre del campo en el schema.
- [ ] `TerceroPython/repositories/tercero_repository.py` – argumento `creado_por=user_id` → `created_by=user_id`.
- [ ] `TerceroNestJs/src/modules/tercero/entities/tercero.entity.ts` – propiedad y, si se usa, nombre de columna en `@Column`.
- [ ] `TerceroNestJs/src/modules/tercero/interfaces/tercero.interface.ts` – propiedad.
- [ ] `TerceroNestJs/src/modules/tercero/dto/create-tercero.dto.ts` – propiedad.
- [ ] `TerceroNestJs/src/schema.gql` – las 3 ocurrencias (o regenerar schema desde entidades).
- [ ] `TerceroNestJs/src/modules/empresa/entities/tercero.entity.ts` – propiedad (y columna si aplica).

**Base de datos:** La columna en PostgreSQL debe renombrarse (migración) y ambos microservicios deben apuntar al nuevo nombre (`created_by`) en modelos/entidades.
