// Debe ser la primera importación: carga .env antes de resolver AppModule / JWT (evita JWT_SECRET vacío al firmar).
import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';

// Debug: Verificar variables de entorno
console.log('🔍 DEBUG - Variables de entorno cargadas:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('CORS_ORIGINS:', process.env.CORS_ORIGINS);
console.log('---');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors(corsConfig);

  await app.listen(3001);
  console.log('🚀 Backend NestJS ejecutándose en puerto 3001');
  console.log('📊 GraphQL Playground disponible en: http://localhost:3001/graphql');
}
bootstrap();
