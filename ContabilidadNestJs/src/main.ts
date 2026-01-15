import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

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
  
  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`🚀 Backend Contabilidad NestJS ejecutándose en puerto ${port}`);
  console.log(`📊 GraphQL Playground disponible en: http://localhost:${port}/graphql`);
}
bootstrap();
