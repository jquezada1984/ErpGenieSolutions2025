import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
  });

  const port = Number(process.env.PORT || 3006);
  await app.listen(port);

  console.log(`🚀 ProductoNestJs corriendo en http://localhost:${port}`);
  console.log(`🚀 GraphQL en http://localhost:${port}/graphql`);
}
bootstrap();
