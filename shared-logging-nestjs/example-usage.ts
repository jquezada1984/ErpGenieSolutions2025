/**
 * Ejemplo de uso de la librería @erp/shared-logging-nestjs
 * 
 * Este archivo muestra cómo usar la librería en un servicio NestJS
 */

// ============================================
// 1. Configuración en app.module.ts
// ============================================
/*
import { Module } from '@nestjs/common';
import { LoggerModule } from '@erp/shared-logging-nestjs';

@Module({
  imports: [
    LoggerModule.forRoot({
      serviceName: 'mi-servicio',  // Nombre único del servicio
      logDir: './logs',            // Opcional, default: ./logs
      logLevel: 'info',            // Opcional, default: info
    }),
  ],
})
export class AppModule {}
*/

// ============================================
// 2. Configuración en main.ts
// ============================================
/*
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
  
  // Configurar filtros globales
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new GraphQLExceptionFilter(logger),
  );
  
  await app.listen(3000);
  logger.log('Servicio iniciado', 'Bootstrap');
}
bootstrap();
*/

// ============================================
// 3. Uso en servicios
// ============================================
/*
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
*/

// ============================================
// 4. Uso en resolvers GraphQL
// ============================================
/*
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
*/

// ============================================
// 5. Métodos disponibles
// ============================================
/*
// Log básico
logger.log('Mensaje', 'Contexto');
logger.error('Error', 'Stack trace', 'Contexto');
logger.warn('Advertencia', 'Contexto');
logger.debug('Debug', 'Contexto');
logger.verbose('Verbose', 'Contexto');

// Log estructurado
logger.logError(error, 'Contexto', { metadata: 'datos' });
logger.logInfo('Mensaje', { datos: 'adicionales' }, 'Contexto');
logger.logWarning('Advertencia', { datos: 'adicionales' }, 'Contexto');
*/



