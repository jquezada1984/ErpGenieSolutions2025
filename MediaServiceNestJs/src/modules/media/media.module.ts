import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { DirectorioDocumento } from '../directorio/entities/directorio-documento.entity';
import { MediaDbService } from './services/media-db.service';

@Module({
  imports: [
    ...(process.env.DATABASE_URL
      ? [TypeOrmModule.forFeature([Media, DirectorioDocumento])]
      : []),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaDbService],
})
export class MediaModule {}
