import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Fallback local alineado con docker-compose (PORT=3017). Gateway: pendiente.
  const port = Number(process.env.PORT ?? 3017);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 AlmacenNestJs (scaffold) en http://localhost:${port}/graphql`);
}
bootstrap();
