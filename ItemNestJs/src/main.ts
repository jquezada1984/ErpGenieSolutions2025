import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3011);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀ItemNestJs corriendo en http://localhost:${port}/graphql`);
}
bootstrap();