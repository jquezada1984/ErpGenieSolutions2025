import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorioDocumento } from './entities/directorio-documento.entity';
import { DirectorioController } from './directorio.controller';

@Module({
  imports: [
    ...(process.env.DATABASE_URL
      ? [TypeOrmModule.forFeature([DirectorioDocumento])]
      : []),
  ],
  controllers: [DirectorioController],
})
export class DirectorioModule {}
