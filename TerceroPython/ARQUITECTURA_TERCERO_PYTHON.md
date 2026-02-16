# Arquitectura del microservicio TerceroPython

Documento de referencia para replicar esta estructura en otro módulo (por ejemplo **ProductoPython**). Describe la organización de carpetas, archivos y responsabilidades de cada capa.

---

## 1. Visión general

El microservicio **TerceroPython** es una API REST en **Flask** que sigue una arquitectura en capas:

- **API (rutas)** → reciben HTTP y delegan en servicios
- **Services (servicios)** → lógica de negocio y validación con esquemas
- **Repositories (repositorios)** → acceso a base de datos (CRUD)
- **Models (modelos)** → entidades SQLAlchemy
- **Schemas (esquemas)** → validación y serialización con Marshmallow
- **Config** → configuración de la app (BD, CORS, etc.)
- **Utils** → utilidades compartidas (por ejemplo, instancia de BD)

La base de datos es **PostgreSQL** (vía `Flask-SQLAlchemy`). El servicio se expone en el puerto **3004** y es consumido por un **gateway** que reenvía las peticiones (con headers como `X-Company-Id`, `X-User-Id`).

---

## 2. Estructura de carpetas y archivos

```
TerceroPython/
├── __init__.py
├── app.py                      # Punto de entrada Flask: app, CORS, JWT, blueprints
├── requirements.txt            # Dependencias Python
├── Dockerfile                  # Imagen Docker (Python 3.12, puerto 3004)
├── README.md
├── ARQUITECTURA_TERCERO_PYTHON.md   # Este documento
│
├── api/                        # Capa de rutas HTTP
│   ├── __init__.py
│   └── tercero_routes.py       # Blueprint con POST/PUT-PATCH/DELETE de tercero
│
├── config/                     # Configuración
│   ├── __init__.py
│   └── config.py               # Config: DATABASE_URL, CORS, SECRET_KEY (env)
│
├── models/                     # Modelos de base de datos (SQLAlchemy)
│   ├── __init__.py             # Exporta todos los modelos (para que Flask-SQLAlchemy los registre)
│   ├── tercero.py              # Modelo principal Tercero
│   └── catalogos.py            # Modelos stub de catálogos (FK): CondicionPago, FormaPago, Pais, Empresa, etc.
│
├── repositories/               # Acceso a datos (CRUD)
│   ├── __init__.py
│   └── tercero_repository.py   # create_tercero, update_tercero, soft_delete_tercero, exists_codigo_cliente
│
├── schemas/                    # Validación y serialización (Marshmallow)
│   ├── __init__.py
│   └── tercero_schema.py       # TerceroCreateSchema, TerceroUpdateSchema, TerceroOutSchema
│
├── services/                   # Lógica de negocio
│   ├── __init__.py
│   └── tercero_service.py      # servicio_crear_tercero, servicio_actualizar_tercero, servicio_eliminar_tercero
│
└── utils/                      # Utilidades globales
    ├── __init__.py
    └── db.py                   # Instancia de SQLAlchemy (db) y eventos para SQLite
```

---

## 3. Responsabilidad de cada capa

### 3.1 Raíz del proyecto

- **`app.py`**
  - Crea la aplicación Flask.
  - Carga la configuración desde `Config` (config/config.py).
  - Configura CORS, JWT (opcional), y la extensión `db` (utils/db.py).
  - Importa los modelos (`import models`) para que SQLAlchemy los registre.
  - Registra el blueprint de tercero con prefijo `/api`.
  - Ruta de salud: `GET /health`.
  - Arranca en el puerto definido por `PORT` (por defecto 3004).

- **`requirements.txt`**: Flask, Flask-SQLAlchemy, Flask-CORS, psycopg2-binary, python-dotenv, marshmallow, flask-jwt-extended, etc.

- **`Dockerfile`**: Imagen Python 3.12-slim, instala dependencias, `PYTHONPATH=/app`, `CMD ["python", "app.py"]`, EXPOSE 3004.

---

### 3.2 `api/` — Rutas (controladores HTTP)

- **`tercero_routes.py`**
  - Define un **Blueprint** (`tercero_bp`) con prefijo que se añade en `app.py` como `/api`.
  - Endpoints:
    - `POST /api/tercero` → crear tercero
    - `PUT/PATCH /api/tercero/<id_tercero>` → actualizar
    - `DELETE /api/tercero/<id_tercero>` → eliminar (soft delete vía servicio)
  - Obtiene contexto de empresa y usuario desde headers: `X-Company-Id`, `X-User-Id`.
  - No contiene lógica de negocio: solo llama a funciones del **service** y devuelve JSON.
  - Maneja excepciones: `ValidationError` (Marshmallow) → 400, `IntegrityError` (duplicados) → 409, resto → 500.
  - Respuesta a `OPTIONS` con 204 para CORS.

Para **ProductoPython** equivaldría: `api/producto_routes.py` con `producto_bp` y rutas `/api/producto`, etc.

---

### 3.3 `config/` — Configuración

- **`config.py`**
  - Clase `Config` con:
    - `SQLALCHEMY_DATABASE_URI` (por defecto desde env `DATABASE_URL`).
    - `SQLALCHEMY_TRACK_MODIFICATIONS = False`.
    - `SECRET_KEY`, `CORS_ORIGINS` (lista separada por comas desde env).

Usa `python-dotenv` para cargar `.env`. Para productos se puede reutilizar el mismo `config` o extenderlo si hace falta.

---

### 3.4 `models/` — Modelos de datos

- **`__init__.py`**
  - Importa y exporta todos los modelos (incluidos los de `catalogos`) para que al hacer `import models` en `app.py`, SQLAlchemy los registre.

- **`tercero.py`**
  - Modelo principal `Tercero` con:
    - PK: `id_tercero` (UUID), FK: `id_empresa`.
    - Campos de roles, datos generales, ubicación, contacto, identificación, comercial, organización y auditoría.
    - Relaciones a catálogos vía FK (condición pago, forma pago, tipo tercero, país, empresa, etc.).

- **`catalogos.py`**
  - Modelos **stub** (solo tabla y PK) para que SQLAlchemy reconozca las tablas y las FK:
    - `CondicionPagoCatalogo`, `FormaPagoCatalogo`, `TipoTerceroCatalogo`, `IncotermCatalogo`, `Pais`, `Empresa`.

Para **ProductoPython**: `models/producto.py` (entidad principal) y, si aplica, `models/catalogos.py` o un archivo similar con catálogos que referencie el producto (categoría, unidad, etc.).

---

### 3.5 `repositories/` — Acceso a datos

- **`tercero_repository.py`**
  - Funciones que reciben/salen con diccionarios o modelos y usan `db.session`:
    - `create_tercero(payload, id_empresa, user_id)` → crea y persiste, devuelve `Tercero`.
    - `update_tercero(id_tercero, id_empresa, payload, user_id)` → actualiza campos permitidos, devuelve `Tercero` o `None`.
    - `soft_delete_tercero(id_tercero, id_empresa, user_id)` → pone `estado=False`, devuelve bool.
    - `exists_codigo_cliente(id_empresa, codigo_cliente, exclude_id)` → comprueba unicidad.
  - Hace `commit`/`rollback` y propaga `IntegrityError`.

Para productos: `repositories/producto_repository.py` con `create_producto`, `update_producto`, `delete_producto` (o soft delete), y funciones de unicidad si las hay (por ejemplo código de producto).

---

### 3.6 `schemas/` — Validación y serialización

- **`tercero_schema.py`** (Marshmallow)
  - **TerceroCreateSchema**: campos para alta, con `required` y `load_default` donde corresponda; validaciones (por ejemplo capital ≥ 0, al menos un rol).
  - **TerceroUpdateSchema**: mismos campos que se pueden actualizar (todos opcionales).
  - **TerceroOutSchema**: campos que se devuelven en la respuesta (incluye UUIDs, fechas, etc.).

Para productos: `producto_schema.py` con `ProductoCreateSchema`, `ProductoUpdateSchema`, `ProductoOutSchema` y las validaciones propias del dominio.

---

### 3.7 `services/` — Lógica de negocio

- **`tercero_service.py`**
  - **servicio_crear_tercero(payload, id_empresa, user_id)**:
    - Valida con `TerceroCreateSchema().load(payload)`.
    - Normaliza UUIDs de catálogos/referencias.
    - Si no viene `codigo_cliente`, genera uno (por ejemplo `CUyymm-00001`).
    - Comprueba unicidad de código con el repository.
    - Llama a `create_tercero` del repository y devuelve el resultado serializado con `TerceroOutSchema().dump(tercero)`.
  - **servicio_actualizar_tercero(id_tercero, id_empresa, payload, user_id)**:
    - Valida con `TerceroUpdateSchema`, normaliza UUIDs, comprueba unicidad de código si se envía.
    - Llama a `update_tercero` del repository y devuelve el tercero serializado o None.
  - **servicio_eliminar_tercero(id_tercero, id_empresa, user_id)**:
    - Delega en `soft_delete_tercero` del repository.

Para productos: `producto_service.py` con `servicio_crear_producto`, `servicio_actualizar_producto`, `servicio_eliminar_producto` (o baja lógica), usando schemas y repository de producto.

---

### 3.8 `utils/` — Utilidades

- **`db.py`**
  - Instancia única de `SQLAlchemy`: `db = SQLAlchemy()`.
  - Se inicializa en `app.py` con `db.init_app(app)`.
  - Opcional: eventos para SQLite (foreign_keys, WAL). En producción con PostgreSQL no son necesarios.

En un módulo de productos se reutiliza la misma `db` si comparte aplicación, o la misma utilidad si el microservicio de productos es una app Flask nueva que siga el mismo patrón.

---

## 4. Flujo de una petición (ejemplo: crear tercero)

1. **Gateway** reenvía `POST /api/tercero` con body JSON y headers `X-Company-Id`, `X-User-Id`.
2. **api/tercero_routes.py** recibe la petición, extrae headers y body, llama a `servicio_crear_tercero(data, id_empresa, user_id)`.
3. **services/tercero_service.py** valida con `TerceroCreateSchema`, normaliza datos, genera código si aplica, comprueba unicidad y llama a `create_tercero(...)` del repository.
4. **repositories/tercero_repository.py** crea el objeto `Tercero`, lo añade a `db.session`, hace `commit` y devuelve el modelo.
5. El **service** serializa el modelo con `TerceroOutSchema().dump(tercero)` y devuelve el diccionario.
6. La **ruta** devuelve `jsonify(res)` con código 201.

---

## 5. Checklist para replicar en ProductoPython

- [ ] Crear carpeta `ProductoPython/` con la misma estructura de carpetas: `api/`, `config/`, `models/`, `repositories/`, `schemas/`, `services/`, `utils/`.
- [ ] `app.py`: Flask, Config, CORS, db, JWT si aplica, registro de blueprint de producto, `import models`, ruta `/health`.
- [ ] `api/producto_routes.py`: Blueprint con POST, PUT/PATCH, DELETE (y GET si aplica) para producto; headers de empresa/usuario; manejo de ValidationError e IntegrityError.
- [ ] `config/config.py`: Misma base (DATABASE_URL, CORS, etc.).
- [ ] `models/__init__.py`: Exportar modelo(s) de producto y catálogos necesarios.
- [ ] `models/producto.py`: Entidad Producto con FK a empresa y catálogos que uses.
- [ ] `models/catalogos.py` (o equivalente): Stubs de tablas de catálogo referenciadas por producto.
- [ ] `repositories/producto_repository.py`: create, update, delete (o soft delete) y funciones de unicidad si las hay.
- [ ] `schemas/producto_schema.py`: ProductoCreateSchema, ProductoUpdateSchema, ProductoOutSchema con Marshmallow.
- [ ] `services/producto_service.py`: servicio_crear_producto, servicio_actualizar_producto, servicio_eliminar_producto; validar con schemas, llamar al repository, serializar salida con OutSchema.
- [ ] `utils/db.py`: Misma instancia `db` (o copiar y usar igual).
- [ ] `requirements.txt` y `Dockerfile` adaptados (por ejemplo otro puerto si es otro contenedor).
- [ ] Documentar en el gateway las nuevas rutas de producto y el servicio (ProductoPython) igual que con TerceroPython.

Con esto tu compañero puede replicar la arquitectura de TerceroPython en el módulo de productos manteniendo la misma organización y flujo de capas.
