# FinancieroPython

Microservicio Python (Flask) para el módulo financiero del ERP.

## Descripción

Este servicio proporciona una API REST para gestionar las funcionalidades financieras del sistema ERP.

## Configuración

### Variables de Entorno

Copia el archivo `env.example` a `.env` y configura las siguientes variables:

- `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL
- `SECRET_KEY`: Clave secreta para JWT
- `CORS_ORIGINS`: Orígenes permitidos para CORS (separados por comas)
- `PORT`: Puerto del servidor (por defecto: 5001)

## Instalación

```bash
pip install -r requirements.txt
```

## Desarrollo

```bash
python start_server_improved.py
```

## Producción

```bash
python start_server_improved.py
```

## Docker

### Desarrollo
```bash
docker build -f Dockerfile.dev -t financiero-python-dev .
docker run -p 5001:5001 financiero-python-dev
```

### Producción
```bash
docker build -f Dockerfile -t financiero-python .
docker run -p 5001:5001 financiero-python
```

## Health Check

Verifica el estado del servicio:
```bash
curl http://localhost:5001/health
```

