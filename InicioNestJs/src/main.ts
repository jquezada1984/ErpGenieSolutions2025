import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors(corsConfig);
  
  await app.listen(3001);
  console.log('🚀 Backend NestJS ejecutándose en puerto 3001');
  console.log('📊 GraphQL Playground disponible en: http://localhost:3001/graphql');
}
bootstrap();
