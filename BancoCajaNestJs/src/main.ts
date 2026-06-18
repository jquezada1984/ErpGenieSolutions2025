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
  const port = process.env.PORT ?? 3014;
  await app.listen(port);
  console.log(`BancoCajaNestJs GraphQL: http://localhost:${port}/graphql`);
}
bootstrap();
