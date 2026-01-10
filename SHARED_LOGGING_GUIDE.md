# Guía de Uso - Librerías Compartidas de Logging

Esta guía explica cómo usar las librerías compartidas de logging en todos los servicios del ERP.

## 📚 Librerías Disponibles

### 1. `@erp/shared-logging-nestjs` - Para servicios NestJS
### 2. `shared-logging-python` - Para servicios Python

## 🚀 Instalación

### NestJS

#### Opción 1: Usar path local (recomendado para desarrollo)
```json
{
  "dependencies": {
    "@erp/shared-logging-nestjs": "file:../shared-logging-nestjs"
  }
}
```

Luego ejecutar:
```bash
npm install
```

#### Opción 2: Compilar la librería primero
```bash
cd shared-logging-nestjs
npm install
npm run build
cd ../tu-servicio
npm install
```

### Python

Simplemente copiar la carpeta `shared-logging-python` o agregarla al PYTHONPATH.

## 📖 Uso en NestJS

### 1. Configurar en AppModule

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@erp/shared-logging-nestjs';

@Module({
  imports: [
    LoggerModule.forRoot({
      serviceName: 'financiero-nestjs', // Nombre único del servicio
      logDir: './logs',                 // Opcional, default: ./logs
      logLevel: 'info',                 // Opcional, default: info
    }),
    // ... otros módulos
  ],
})
export class AppModule {}
```

### 2. Configurar filtros globales en main.ts

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { 
  LoggerService, 
  AllExceptionsFilter, 
  GraphQLExceptionFilter 
} from '@erp/shared-logging-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // Deshabilitar logger por defecto
  });
  
  const logger = app.get(LoggerService);
  
  // Configurar filtros globales (capturan errores automáticamente)
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new GraphQLExceptionFilter(logger),
  );
  
  await app.listen(3000);
  logger.log('Servicio iniciado', 'Bootstrap');
}
bootstrap();
```

### 3. Usar en servicios/resolvers

```typescript
// mi.service.ts o mi.resolver.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@erp/shared-logging-nestjs';

@Injectable()
export class MiService {
  constructor(private readonly logger: LoggerService) {}

  async miMetodo() {
    try {
      this.logger.log('Operación iniciada', 'MiService');
      // Tu código aquí
      this.logger.logInfo('Operación exitosa', { id: '123' }, 'MiService');
    } catch (error) {
      this.logger.logError(error, 'MiService', { 
        metadata: 'información adicional' 
      });
      throw error;
    }
  }
}
```

## 📖 Uso en Python

### 1. Importar el logger

```python
# app.py
import sys
import os

# Agregar path de la librería compartida
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shared-logging-python'))
from logger import Logger

# Crear instancia con nombre del servicio
logger = Logger(service_name='financiero-python')
```

### 2. Configurar en Flask

```python
from flask import Flask, request, jsonify
from logger import Logger

app = Flask(__name__)
logger = Logger(service_name='financiero-python')

# Manejo global de excepciones
@app.errorhandler(Exception)
def handle_exception(e):
    logger.log_exception(
        e,
        context='Flask',
        path=request.path,
        method=request.method,
    )
    return jsonify({'error': str(e)}), 500

# Log de requests
@app.before_request
def log_request():
    logger.info(
        f"{request.method} {request.path}",
        context='Flask',
        metadata={
            'method': request.method,
            'path': request.path,
        }
    )

@app.route('/health')
def health():
    logger.info('Health check', context='Flask')
    return jsonify({'status': 'ok'}), 200
```

## 🔧 Configuración por Servicio

### FinancieroNestJs
```typescript
LoggerModule.forRoot({
  serviceName: 'financiero-nestjs',
})
```

### ContabilidadNestJs
```typescript
LoggerModule.forRoot({
  serviceName: 'contabilidad-nestjs',
})
```

### InicioNestJs
```typescript
LoggerModule.forRoot({
  serviceName: 'inicio-nestjs',
})
```

### MenuNestJs
```typescript
LoggerModule.forRoot({
  serviceName: 'menu-nestjs',
})
```

### FinancieroPython
```python
logger = Logger(service_name='financiero-python')
```

### InicioPython
```python
logger = Logger(service_name='inicio-python')
```

## 📂 Archivos de Log Generados

Cada servicio genera sus propios archivos de log con el nombre del servicio:

### NestJS
- `{service-name}-error.log` - Solo errores
- `{service-name}-combined.log` - Todos los logs
- `{service-name}-exceptions.log` - Excepciones no capturadas
- `{service-name}-rejections.log` - Promesas rechazadas

### Python
- `{service-name}-error.log` - Solo errores
- `{service-name}-combined.log` - Todos los logs

## 🎯 Métodos Disponibles

### NestJS
```typescript
logger.log(message, context?)
logger.error(message, trace?, context?)
logger.warn(message, context?)
logger.debug(message, context?)
logger.verbose(message, context?)
logger.logError(error, context?, metadata?)
logger.logInfo(message, metadata?, context?)
logger.logWarning(message, metadata?, context?)
```

### Python
```python
logger.info(message, context=?, metadata=?)
logger.error(message, exception=?, context=?)
logger.warning(message, context=?, metadata=?)
logger.debug(message, context=?, metadata=?)
logger.critical(message, exception=?, context=?)
logger.log_exception(exception, context=?, **metadata)
```

## ⚙️ Variables de Entorno

### NestJS
- `LOG_DIR` - Directorio de logs (default: `./logs`)
- `LOG_LEVEL` - Nivel de log: `error`, `warn`, `info`, `debug`, `verbose` (default: `info`)

### Python
- `LOG_DIR` - Directorio de logs (default: `./logs`)

## 📝 Ejemplo Completo - NestJS

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@erp/shared-logging-nestjs';

@Module({
  imports: [
    LoggerModule.forRoot({
      serviceName: 'mi-servicio-nestjs',
    }),
  ],
})
export class AppModule {}

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService, AllExceptionsFilter, GraphQLExceptionFilter } from '@erp/shared-logging-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const logger = app.get(LoggerService);
  
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new GraphQLExceptionFilter(logger),
  );
  
  await app.listen(3000);
  logger.log('Servicio iniciado', 'Bootstrap');
}
bootstrap();

// mi.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { LoggerService } from '@erp/shared-logging-nestjs';

@Resolver()
export class MiResolver {
  constructor(private readonly logger: LoggerService) {}

  @Query(() => String)
  async miQuery(): Promise<string> {
    try {
      this.logger.logInfo('Ejecutando query', {}, 'MiResolver');
      return 'resultado';
    } catch (error) {
      this.logger.logError(error, 'MiResolver');
      throw error;
    }
  }
}
```

## 📝 Ejemplo Completo - Python

```python
# app.py
import sys
import os
from flask import Flask, request, jsonify

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shared-logging-python'))
from logger import Logger

app = Flask(__name__)
logger = Logger(service_name='mi-servicio-python')

@app.errorhandler(Exception)
def handle_exception(e):
    logger.log_exception(e, context='Flask')
    return jsonify({'error': str(e)}), 500

@app.before_request
def log_request():
    logger.info(f"{request.method} {request.path}", context='Flask')

@app.route('/api/endpoint')
def mi_endpoint():
    try:
        logger.info('Procesando request', context='mi_endpoint')
        return jsonify({'status': 'ok'}), 200
    except Exception as e:
        logger.log_exception(e, context='mi_endpoint')
        raise

if __name__ == '__main__':
    app.run()
```

## ✅ Ventajas

1. **Código centralizado** - Un solo lugar para mantener y actualizar
2. **Consistencia** - Mismo formato y comportamiento en todos los servicios
3. **Fácil mantenimiento** - Cambios en un solo lugar se aplican a todos
4. **Reutilizable** - Fácil agregar a nuevos servicios
5. **Configurable** - Cada servicio puede personalizar su nombre y configuración

## 🔄 Actualizar la Librería

Cuando necesites actualizar la librería:

1. Hacer cambios en `shared-logging-nestjs` o `shared-logging-python`
2. Para NestJS: Recompilar con `npm run build` en la carpeta de la librería
3. Para Python: Los cambios se aplican automáticamente
4. Reiniciar los servicios que usan la librería





