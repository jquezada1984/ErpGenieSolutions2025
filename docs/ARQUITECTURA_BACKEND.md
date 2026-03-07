# Arquitectura del backend (NestJS y Python)

Resumen de la arquitectura actual del backend **sin modificaciones**: solo descripción de lo que hay.

---

## NestJS

### Estilo general

- **Framework:** NestJS (Node.js).
- **API:** GraphQL (Apollo Driver) como interfaz principal; en algunos proyectos también hay controladores HTTP (REST).
- **ORM:** TypeORM.
- **Base de datos:** PostgreSQL (conexión por `DATABASE_URL` o variables `DB_*`).
- **Patrón:** Capas por responsabilidad: **Resolvers** (GraphQL) / **Controllers** (REST), **Services** (lógica de negocio), **Entities** (modelos TypeORM). Algunos microservicios usan **módulos por dominio** (ej. TerceroNestJs).

### Proyectos NestJS

| Proyecto           | Rol principal        | API        | Estructura de carpetas |
|--------------------|----------------------|------------|--------------------------|
| **InicioNestJs**   | Auth, empresa, usuario, perfil, menú, catálogos (país, moneda, provincia) | GraphQL + REST (auth) | `auth/`, `resolvers/`, `services/`, `entities/`, `dto/` |
| **MenuNestJs**     | Menú y permisos (secciones, ítems, perfil_menu_permiso) | Solo GraphQL | `resolvers/`, `services/`, `entities/`, `types/` |
| **TerceroNestJs**  | Terceros, catálogos (tipo tercero, condición/forma pago, incoterm, país) | GraphQL + REST | `modules/tercero/`, `modules/catalogos/`, `modules/empresa/` (cada uno con entities, service, controller, resolver) |
| **ContabilidadNestJs** | Cuentas contables, asientos, movimientos, balance | GraphQL | `resolvers/`, `services/`, `entities/` |

### Capas típicas en NestJS

1. **Entities** (`entities/*.entity.ts`): Modelos TypeORM (tablas), decoradores `@Entity`, `@Column`, `@ManyToOne`, etc.
2. **Resolvers** (`resolvers/*.resolver.ts`): GraphQL: `@Query()`, `@Mutation()`, `@Args()`. Delegan en servicios.
3. **Controllers** (cuando existen): REST: `@Controller()`, `@Get()`, `@Post()`, etc. (ej. auth en InicioNestJs, tercero en TerceroNestJs).
4. **Services** (`services/*.service.ts`): Lógica de negocio y acceso a datos vía `@InjectRepository(Entity)` (TypeORM Repository). Los resolvers/controllers inyectan el service.
5. **DTOs / Inputs** (`dto/`, `auth/dto/`): Objetos de entrada/salida para validación y tipado (GraphQL o REST).
6. **Modules** (`app.module.ts`, y en TerceroNestJs `modules/*/xxx.module.ts`): `@Module()` con `imports` (TypeORM, GraphQL, otros módulos), `providers` (services, resolvers), `controllers`.

### Configuración común

- **TypeORM:** `synchronize: false` (no auto-sincronizar esquema).
- **GraphQL:** `autoSchemaFile`, `playground: true`, `introspection: true`.
- **Auth:** JWT (AuthModule en InicioNestJs: estrategia, guard, resolver de login/register).

---

## Python

### Estilo general

- **Framework:** Flask.
- **API:** REST (JSON). Endpoints por Blueprint, prefijo común `/api`.
- **ORM:** SQLAlchemy (Flask-SQLAlchemy en algunos; en otros `utils/db` con `db` compartido).
- **Base de datos:** PostgreSQL (configuración en `config/config.py`).
- **Patrón:** **Rutas (API)** → **Servicios** (lógica) → **Repositorios** (acceso a BD) cuando existen; en otros casos las rutas usan modelos/servicios directamente. **Schemas** (Marshmallow) para validación y serialización.

### Proyectos Python

| Proyecto          | Rol principal                    | Estructura de carpetas |
|-------------------|----------------------------------|--------------------------|
| **InicioPython**  | Empresa, entidad, perfil, menú (CRUD), sucursal, usuario | `api/*_routes.py`, `models/`, `schemas/`, `services/` (algunos), `config/`, `utils/db.py` |
| **TerceroPython** | CRUD de terceros                 | `api/tercero_routes.py`, `services/tercero_service.py`, `repositories/tercero_repository.py`, `models/`, `schemas/` |
| **ContabilidadPython** | Placeholder / health              | `app.py` mínimo |
| **FinancieroPython**  | Placeholder / health              | `app.py` mínimo |

### Capas típicas en Python

1. **API / Rutas** (`api/*_routes.py`): Blueprints de Flask. Definen rutas (`@bp.route(...)`), reciben request, llaman a servicios o a modelos, devuelven `jsonify()`. Manejo de errores (ValidationError, IntegrityError) en la ruta.
2. **Services** (`services/*.py`): Lógica de negocio (validaciones, reglas, generación de códigos). Usan **schemas** para validar entrada y **repositories** o modelos para persistir. Ej.: `tercero_service.py` → `TerceroCreateSchema`, `create_tercero()` del repositorio.
3. **Repositories** (cuando existen, ej. TerceroPython `repositories/tercero_repository.py`): Abstracción del acceso a datos (crear, actualizar, borrado lógico, consultas). Reciben diccionarios o modelos y usan SQLAlchemy (`db.session`).
4. **Models** (`models/*.py`): Clases SQLAlchemy (tablas). Relaciones y columnas. En InicioPython a veces el modelo está en el mismo paquete que la lógica (ej. `models/empresa.py` con `db`).
5. **Schemas** (`schemas/*.py`): Marshmallow: serialización/deserialización y validación (load/dump). Ej.: `TerceroCreateSchema`, `EmpresaSchema`.
6. **Config / Utils:** `config/config.py` (DB, CORS, etc.), `utils/db.py` (instancia de `db` para SQLAlchemy).

### Configuración común

- **Flask:** `app = Flask(__name__)`, `app.config.from_object(Config)`.
- **CORS:** `flask_cors.CORS(app, origins=...)`.
- **JWT:** `flask_jwt_extended.JWTManager(app)` (clave alineada con NestJS para el gateway).
- **Blueprints:** Registrados con `url_prefix='/api'`.

---

## Resumen comparativo

| Aspecto           | NestJS                          | Python (Flask)                        |
|-------------------|----------------------------------|---------------------------------------|
| Estilo API        | GraphQL (y algo de REST)        | REST (JSON)                           |
| Capa de entrada   | Resolvers + Controllers         | Blueprints (rutas)                    |
| Lógica de negocio| Services                        | Services                              |
| Acceso a datos   | TypeORM Repository en services  | Repositories o Models (SQLAlchemy)    |
| Modelos          | Entities (TypeORM)              | Models (SQLAlchemy)                   |
| Validación/salida| DTOs / Inputs (GraphQL)         | Schemas (Marshmallow)                 |
| Organización     | Módulos por app; en Tercero, por dominio (modules/xxx) | Por carpeta (api, models, services, repositories, schemas) |
| BD               | PostgreSQL, TypeORM             | PostgreSQL, SQLAlchemy                |

En conjunto, en **NestJS** se usa una arquitectura en capas con **GraphQL + TypeORM + módulos**; en **Python** una arquitectura en capas con **Flask REST + SQLAlchemy + servicios/repositorios (donde existen) y schemas**.
