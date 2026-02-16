# TerceroPython API

API REST para la gestión de terceros desarrollada con Flask.

## Estructura del Proyecto

```
TerceroPython/
├── api/
│   ├── __init__.py
│   └── tercero_routes.py      # Rutas de la API
├── config/
│   ├── __init__.py
│   └── config.py              # Configuración de la aplicación
├── models/
│   └── __init__.py            # Modelos de base de datos
├── repositories/
│   ├── __init__.py
│   └── tercero_repository.py  # Lógica de acceso a datos
├── schemas/
│   ├── __init__.py
│   └── tercero_schema.py      # Esquemas de validación
├── services/
│   ├── __init__.py
│   └── tercero_service.py     # Lógica de negocio
├── utils/
│   └── __init__.py            # Utilidades
├── app.py                     # Aplicación principal
├── requirements.txt           # Dependencias
├── .env.example              # Variables de entorno de ejemplo
└── README.md
```

## Instalación

1. Instalar dependencias:
```bash
pip install -r requirements.txt
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Ejecutar la aplicación:
```bash
python app.py
```

## Endpoints

- `GET /health` - Verificación de salud de la API
- `GET /api/terceros` - Listar terceros
- `POST /api/terceros` - Crear tercero
- `GET /api/terceros/{id}` - Obtener tercero por ID
- `PUT /api/terceros/{id}` - Actualizar tercero
- `DELETE /api/terceros/{id}` - Eliminar tercero

## Notas

Los archivos `tercero_routes.py`, `tercero_service.py`, `tercero_repository.py` y `tercero_schema.py` están preparados para pegar el contenido que ya generamos anteriormente.
