import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoArchivoController } from './estado-archivo.controller';
import { EstadoArchivo } from './entities/estado-archivo.entity';

@Module({
  imports: [
    ...(process.env.DATABASE_URL
      ? [TypeOrmModule.forFeature([EstadoArchivo])]
      : []),
  ],
  controllers: [EstadoArchivoController],
})
export class EstadoArchivoModule {}
