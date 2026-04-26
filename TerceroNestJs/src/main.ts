import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const corsOrigins = (process.env.CORS_ORIGINS?.split(',') ?? [])
    .map((o) => o.trim())
    .filter(Boolean);
  if (corsOrigins.length === 0) {
    throw new Error(
      'CORS_ORIGINS no está definido o está vacío. Configúralo en .env (orígenes separados por coma).',
    );
  }
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 TerceroNestJs GraphQL service running on: http://localhost:${port}/graphql`);
}
bootstrap();
