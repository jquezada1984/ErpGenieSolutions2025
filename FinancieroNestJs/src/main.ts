import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  const port = Number(process.env.PORT || 3007);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`FinancieroNestJs GraphQL en puerto ${port}`);
}
bootstrap();
