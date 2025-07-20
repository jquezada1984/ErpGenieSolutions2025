# Microservicio Flask para gestión de base de datos

Este microservicio está desarrollado en Python usando Flask. Su objetivo es exponer endpoints para guardar y actualizar datos en la base de datos PostgreSQL utilizada por el ERP.

## Requisitos previos

- Python 3.8 o superior
- PostgreSQL en ejecución

## Instalación

1. Clona el repositorio y entra a la carpeta:
   ```bash
   cd microservice-db
   ```
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Crea un archivo `.env` con la configuración de la base de datos (puedes basarte en el archivo de configuración de ejemplo si existe).

## Ejecución

```bash
python app.py
```

El microservicio quedará disponible en el puerto configurado (por defecto 5000).

## Endpoints principales

- `/health` — Verifica que el microservicio está activo
- `/api/entidad` — Ejemplo de endpoint CRUD

---

Puedes ampliar la funcionalidad según las necesidades del ERP. 