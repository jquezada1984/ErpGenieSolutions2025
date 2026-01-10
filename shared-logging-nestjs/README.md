# @erp/shared-logging-nestjs

Librería compartida de logging para servicios NestJS del ERP.

## Instalación

```bash
npm install @erp/shared-logging-nestjs
```

O si está en el mismo repositorio, usar path local:

```json
{
  "dependencies": {
    "@erp/shared-logging-nestjs": "file:../shared-logging-nestjs"
  }
}
```

## Uso

### 1. Importar el módulo en tu AppModule

```typescript
import { LoggerModule } from '@erp/shared-logging-nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    LoggerModule.forRoot({
      serviceName: 'financiero-nestjs', // Nombre del servicio
      logDir: './logs', // Opcional, default: ./logs
      logLevel: 'info', // Opcional, default: info
    }),
    // ... otros módulos
  ],
})
export class AppModule {}
```

### 2. Configurar filtros globales en main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService, AllExceptionsFilter, GraphQLExceptionFilter } from '@erp/shared-logging-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // Deshabilitar logger por defecto
  });
  
  const logger = app.get(LoggerService);
  
  // Configurar filtros globales
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new GraphQLExceptionFilter(logger),
  );
  
  await app.listen(3000);
}
bootstrap();
```

### 3. Usar el logger en tus servicios

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@erp/shared-logging-nestjs';

@Injectable()
export class MiService {
  constructor(private readonly logger: LoggerService) {}

  miMetodo() {
    try {
      this.logger.log('Operación exitosa', 'MiService');
      this.logger.logInfo('Info con metadata', { id: '123' }, 'MiService');
    } catch (error) {
      this.logger.logError(error, 'MiService', { metadata: 'adicional' });
    }
  }
}
```

## Métodos disponibles

- `log(message, context?)` - Log de información
- `error(message, trace?, context?)` - Log de error
- `warn(message, context?)` - Log de advertencia
- `debug(message, context?)` - Log de debug
- `verbose(message, context?)` - Log verbose
- `logError(error, context?, metadata?)` - Log estructurado de error
- `logInfo(message, metadata?, context?)` - Log estructurado de info
- `logWarning(message, metadata?, context?)` - Log estructurado de warning

## Archivos de log generados

- `{serviceName}-error.log` - Solo errores
- `{serviceName}-combined.log` - Todos los logs
- `{serviceName}-exceptions.log` - Excepciones no capturadas
- `{serviceName}-rejections.log` - Promesas rechazadas

## Variables de entorno

- `LOG_DIR` - Directorio de logs (default: ./logs)
- `LOG_LEVEL` - Nivel de log: error, warn, info, debug, verbose (default: info)





