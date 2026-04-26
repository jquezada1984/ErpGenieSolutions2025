import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './modules/media/media.module';
import { DirectorioModule } from './modules/directorio/directorio.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    MediaModule,
    DirectorioModule,
    ...(process.env.DATABASE_URL
      ? [
          TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false, // No tocar estructura de BD
          }),
        ]
      : []),
  ],
  controllers: [HealthController],
})
export class AppModule {}
