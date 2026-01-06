import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { LoggerService, AllExceptionsFilter, GraphQLExceptionFilter } from '@erp/shared-logging-nestjs';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Debug: Verificar variables de entorno
console.log('🔍 DEBUG - Variables de entorno cargadas (Financiero):');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('CORS_ORIGINS:', process.env.CORS_ORIGINS);
console.log('PORT:', process.env.PORT || '3004');
console.log('---');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // Deshabilitar logger por defecto para usar nuestro logger personalizado
  });
  
  // Obtener instancia del logger
  const logger = app.get(LoggerService);
  
  // Configurar filtros de excepciones globales
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new GraphQLExceptionFilter(logger),
  );
  
  // Configurar CORS
  app.enableCors(corsConfig);
  
  const port = process.env.PORT || 3004;
  await app.listen(port);
  
  logger.log(`🚀 Backend Financiero NestJS ejecutándose en puerto ${port}`, 'Bootstrap');
  logger.log(`📊 GraphQL Playground disponible en: http://localhost:${port}/graphql`, 'Bootstrap');
}
bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});

