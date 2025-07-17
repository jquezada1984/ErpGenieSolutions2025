# Microservicio Flask para gestión de base de datos

Este microservicio está desarrollado en Python usando Flask. Su objetivo es exponer endpoints para guardar y actualizar datos en la base de datos PostgreSQL utilizada por el ERP.

## Características
- API REST para operaciones CRUD
- Conexión a PostgreSQL
- Estructura lista para escalar

## Instalación

1. Clona el repositorio y entra a la carpeta:
   ```bash
   cd microservice-db
   ```
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Crea un archivo `.env` con la configuración de la base de datos.

## Ejecución

```bash
python app.py
```

## Endpoints
- `/health` — Verifica que el microservicio está activo
- `/api/entidad` — Ejemplo de endpoint CRUD

---

Puedes ampliar la funcionalidad según las necesidades del ERP. 