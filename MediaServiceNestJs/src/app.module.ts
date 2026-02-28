import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [MediaModule],
  controllers: [HealthController],
})
export class AppModule {}
