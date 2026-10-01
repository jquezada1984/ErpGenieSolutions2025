import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = (process.env.CORS_ORIGINS?.split(',') ?? [])
    .map((o) => o.trim())
    .filter(Boolean);
  if (corsOrigins.length > 0) {
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
    });
  }
  const port = Number(process.env.PORT ?? 3017);
  await app.listen(port, '0.0.0.0');
  console.log(`GastoNestJs GraphQL: http://localhost:${port}/graphql`);
  console.log(`GastoNestJs health:  http://localhost:${port}/health`);
}
bootstrap();
