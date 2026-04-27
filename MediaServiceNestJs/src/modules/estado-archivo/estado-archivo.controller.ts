import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoArchivo } from './entities/estado-archivo.entity';

@Controller('estado-archivo')
export class EstadoArchivoController {
  constructor(
    @InjectRepository(EstadoArchivo)
    private repo: Repository<EstadoArchivo>,
  ) {}

  @Get()
  async listar(@Query('empresa') empresa: string) {
    if (!empresa) return [];

    return this.repo.find({
      where: {
        id_empresa: empresa,
        estado: true,
      },
      order: {
        orden: 'ASC',
      },
    });
  }
}
