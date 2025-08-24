import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Configurar prefijo global
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3003;
  
  console.log(`🚀 MenuNestJs iniciando en puerto ${port}`);
  console.log(`📊 GraphQL Playground disponible en http://localhost:${port}/graphql`);
  
  await app.listen(port);
  
  console.log(`✅ MenuNestJs ejecutándose en http://localhost:${port}`);
}
bootstrap();
