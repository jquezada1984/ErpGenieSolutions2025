# shared-logging-python

Librería compartida de logging para servicios Python del ERP.

## Instalación

Copiar la carpeta `shared-logging-python` al proyecto o agregar al PYTHONPATH.

## Uso

### 1. Importar el logger

```python
from shared_logging_python import Logger

# Crear instancia con nombre del servicio
logger = Logger(service_name='financiero-python')
```

### 2. Usar en Flask

```python
from flask import Flask
from shared_logging_python import Logger

app = Flask(__name__)
logger = Logger(service_name='financiero-python')

@app.errorhandler(Exception)
def handle_exception(e):
    logger.log_exception(e, context='Flask', path=request.path)
    return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    logger.info('Health check', context='Flask')
    return jsonify({'status': 'ok'}), 200
```

### 3. Métodos disponibles

```python
# Log básico
logger.info('Mensaje', context='Contexto')
logger.warning('Advertencia', context='Contexto')
logger.debug('Debug', context='Contexto')
logger.error('Error', context='Contexto')
logger.critical('Crítico', context='Contexto')

# Log con metadata
logger.info('Mensaje', context='Contexto', metadata={'key': 'value'})

# Log de excepción
logger.log_exception(exception, context='Contexto', metadata={'key': 'value'})
logger.error('Mensaje', exception=exception, context='Contexto')
```

## Archivos de log generados

- `{service_name}-error.log` - Solo errores
- `{service_name}-combined.log` - Todos los logs

## Variables de entorno

- `LOG_DIR` - Directorio de logs (default: ./logs)

## Ejemplo completo

```python
from flask import Flask, request, jsonify
from shared_logging_python import Logger

app = Flask(__name__)
logger = Logger(service_name='mi-servicio')

@app.before_request
def log_request():
    logger.info(
        f"{request.method} {request.path}",
        context='Flask',
        metadata={'method': request.method, 'path': request.path}
    )

@app.errorhandler(Exception)
def handle_exception(e):
    logger.log_exception(e, context='Flask')
    return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
```



