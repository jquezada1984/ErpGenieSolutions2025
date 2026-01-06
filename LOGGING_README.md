# Sistema de Logging para NestJS y Python

> ⚠️ **IMPORTANTE**: Este documento está obsoleto. Por favor, consulta [SHARED_LOGGING_GUIDE.md](./SHARED_LOGGING_GUIDE.md) para la guía actualizada sobre las librerías compartidas de logging.

Este documento describe el sistema de logging implementado para los servicios NestJS y Python del ERP.

**Las librerías compartidas están disponibles en:**
- `shared-logging-nestjs/` - Para servicios NestJS
- `shared-logging-python/` - Para servicios Python

**Ver [SHARED_LOGGING_GUIDE.md](./SHARED_LOGGING_GUIDE.md) para instrucciones de uso.**

## 📋 Características

### NestJS (Winston)
- ✅ Logging estructurado con Winston
- ✅ Rotación automática de archivos (5MB, 5 archivos de respaldo)
- ✅ Separación de logs: errores, combinados, excepciones
- ✅ Filtros globales para HTTP y GraphQL
- ✅ Formato JSON para archivos, legible para consola
- ✅ Captura automática de excepciones no manejadas

### Python (logging estándar)
- ✅ Logging estructurado con módulo logging
- ✅ Rotación automática de archivos (5MB, 5 archivos de respaldo)
- ✅ Formato JSON estructurado
- ✅ Separación de logs: errores y combinados
- ✅ Manejo global de excepciones Flask

## 📁 Estructura de Archivos

### NestJS
```
FinancieroNestJs/src/logger/
├── logger.module.ts          # Módulo global de logging
├── logger.service.ts          # Servicio de logging con Winston
├── exception.filter.ts        # Filtro de excepciones HTTP
└── graphql-exception.filter.ts # Filtro de excepciones GraphQL
```

### Python
```
FinancieroPython/utils/
└── logger.py                  # Módulo de logging
```

## 🚀 Uso

### NestJS

#### Inyección del Logger
```typescript
import { LoggerService } from './logger/logger.service';

@Injectable()
export class MiService {
  constructor(private readonly logger: LoggerService) {}

  miMetodo() {
    try {
      // Tu código aquí
      this.logger.log('Operación exitosa', 'MiService');
    } catch (error) {
      this.logger.logError(error, 'MiService', {
        metadata: 'información adicional'
      });
    }
  }
}
```

#### Métodos disponibles
```typescript
// Log básico
this.logger.log('Mensaje', 'Contexto');

// Log de error
this.logger.error('Mensaje de error', 'stack trace', 'Contexto');

// Log estructurado
this.logger.logError(error, 'Contexto', { metadata: 'datos' });
this.logger.logInfo('Mensaje', { datos: 'adicionales' }, 'Contexto');
this.logger.logWarning('Advertencia', { datos: 'adicionales' }, 'Contexto');

// Niveles estándar
this.logger.debug('Debug', 'Contexto');
this.logger.verbose('Verbose', 'Contexto');
this.logger.warn('Warning', 'Contexto');
```

### Python

#### Importar el Logger
```python
from utils.logger import logger

def mi_funcion():
    try:
        # Tu código aquí
        logger.info('Operación exitosa', context='MiFuncion')
    except Exception as e:
        logger.log_exception(e, context='MiFuncion', metadata={'dato': 'valor'})
```

#### Métodos disponibles
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

## 📂 Ubicación de Logs

Por defecto, los logs se guardan en:
- **NestJS**: `./logs/` (configurable con `LOG_DIR`)
- **Python**: `./logs/` (configurable con `LOG_DIR`)

### Archivos generados

#### NestJS
- `error.log` - Solo errores
- `combined.log` - Todos los logs
- `exceptions.log` - Excepciones no capturadas
- `rejections.log` - Promesas rechazadas

#### Python
- `error.log` - Solo errores
- `combined.log` - Todos los logs

## ⚙️ Configuración

### Variables de Entorno

#### NestJS
```env
LOG_DIR=./logs          # Directorio de logs (default: ./logs)
LOG_LEVEL=info         # Nivel de log: error, warn, info, debug, verbose
```

#### Python
```env
LOG_DIR=./logs          # Directorio de logs (default: ./logs)
```

## 🔍 Ejemplos de Uso

### NestJS - Resolver con Logging
```typescript
@Resolver()
export class MiResolver {
  constructor(
    private readonly service: MiService,
    private readonly logger: LoggerService,
  ) {}

  @Query(() => String)
  async miQuery(@Args('id') id: string): Promise<string> {
    try {
      this.logger.logInfo('Ejecutando query', { id }, 'MiResolver');
      const result = await this.service.obtener(id);
      return result;
    } catch (error) {
      this.logger.logError(error as Error, 'MiResolver', { id });
      throw error;
    }
  }
}
```

### Python - Endpoint con Logging
```python
@app.route('/api/endpoint', methods=['GET'])
def mi_endpoint():
    try:
        logger.info('Procesando request', context='mi_endpoint', 
                   metadata={'method': request.method})
        # Tu lógica aquí
        return jsonify({'status': 'ok'}), 200
    except Exception as e:
        logger.log_exception(e, context='mi_endpoint')
        return jsonify({'error': str(e)}), 500
```

## 📊 Formato de Logs

### NestJS (JSON)
```json
{
  "timestamp": "2025-11-23 21:00:00",
  "level": "error",
  "message": "Error al procesar",
  "service": "financiero-nestjs",
  "context": "MiService",
  "stack": "Error: ...",
  "metadata": {
    "id": "123"
  }
}
```

### Python (JSON)
```json
{
  "timestamp": "2025-11-23T21:00:00",
  "level": "ERROR",
  "message": "Error al procesar",
  "module": "app",
  "function": "mi_funcion",
  "line": 42,
  "context": "MiFuncion",
  "metadata": {
    "id": "123"
  },
  "exception": "Traceback..."
}
```

## 🛠️ Instalación

### NestJS
```bash
npm install winston
npm install --save-dev @types/winston
```

### Python
No requiere instalación adicional, usa el módulo `logging` estándar de Python.

## 🔄 Rotación de Archivos

Los archivos de log se rotan automáticamente cuando alcanzan 5MB. Se mantienen hasta 5 archivos de respaldo:
- `error.log`
- `error.log.1`
- `error.log.2`
- `error.log.3`
- `error.log.4`
- `error.log.5`

## 📝 Notas

- Los logs se escriben tanto en archivos como en consola
- Los logs de error incluyen stack traces completos
- Los filtros globales capturan automáticamente todas las excepciones
- El formato JSON facilita el análisis con herramientas como ELK, Splunk, etc.

