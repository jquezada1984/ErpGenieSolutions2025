# ContabilidadPython

Microservicio Python (Flask) para la gestión de operaciones de creación, actualización y eliminación de datos contables.

## Arquitectura

Este servicio se encarga de todas las operaciones de escritura (CREATE, UPDATE, DELETE) en el módulo de Contabilidad. Las operaciones de lectura (SELECT/QUERY) son manejadas por `ContabilidadNestJs` a través de GraphQL.

## Estructura del Proyecto

```
ContabilidadPython/
├── api/                    # Rutas API (endpoints REST)
│   ├── cuenta_contable_routes.py
│   ├── asiento_contable_routes.py
│   ├── movimiento_contable_routes.py
│   └── balance_general_routes.py
├── config/                 # Configuración
│   └── config.py
├── models/                 # Modelos de base de datos (SQLAlchemy)
│   ├── cuenta_contable.py
│   ├── asiento_contable.py
│   ├── movimiento_contable.py
│   └── balance_general.py
├── schemas/                # Schemas de validación (Marshmallow)
│   ├── cuenta_contable_schema.py
│   ├── asiento_contable_schema.py
│   ├── movimiento_contable_schema.py
│   └── balance_general_schema.py
├── utils/                  # Utilidades
│   └── db.py
├── app.py                  # Aplicación Flask principal
├── requirements.txt        # Dependencias Python
├── Dockerfile              # Configuración Docker
└── env.example            # Variables de entorno de ejemplo
```

## Endpoints API

### Cuenta Contable
- `POST /api/cuenta-contable` - Crear cuenta contable
- `PUT /api/cuenta-contable/<id>` - Actualizar cuenta contable
- `DELETE /api/cuenta-contable/<id>` - Desactivar cuenta contable

### Asiento Contable
- `POST /api/asiento-contable` - Crear asiento contable
- `PUT /api/asiento-contable/<id>` - Actualizar asiento contable
- `DELETE /api/asiento-contable/<id>` - Anular asiento contable
- `POST /api/asiento-contable/<id>/aprobar` - Aprobar asiento contable

### Movimiento Contable
- `POST /api/movimiento-contable` - Crear movimiento contable
- `PUT /api/movimiento-contable/<id>` - Actualizar movimiento contable
- `DELETE /api/movimiento-contable/<id>` - Eliminar movimiento contable

### Balance General
- `POST /api/balance-general` - Crear balance general
- `PUT /api/balance-general/<id>` - Actualizar balance general
- `DELETE /api/balance-general/<id>` - Eliminar balance general
- `POST /api/balance-general/<id>/aprobar` - Aprobar balance general

## Configuración

### Variables de Entorno

Crear un archivo `.env` basado en `env.example`:

```env
CORS_ORIGINS=http://localhost:3002
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
SECRET_KEY=supersecret
PORT=5002
```

### Instalación

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python app.py
```

### Docker

```bash
# Construir imagen
docker build -t contabilidad-python .

# Ejecutar contenedor
docker run -p 5002:5002 --env-file .env contabilidad-python
```

## Base de Datos

El servicio utiliza PostgreSQL y se conecta a la misma base de datos que `ContabilidadNestJs`. Las tablas deben existir previamente en la base de datos.

### Tablas
- `cuenta_contable`
- `asiento_contable`
- `movimiento_contable`
- `balance_general`

## Notas

- Este servicio solo maneja operaciones de escritura (POST, PUT, DELETE)
- Las consultas (GET) se realizan a través de `ContabilidadNestJs` vía GraphQL
- El servicio actualiza automáticamente los totales de `asiento_contable` cuando se crean, actualizan o eliminan `movimiento_contable`
