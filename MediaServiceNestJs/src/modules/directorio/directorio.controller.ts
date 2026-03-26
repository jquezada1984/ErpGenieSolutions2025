import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectorioDocumento } from './entities/directorio-documento.entity';

@Controller('directorio')
export class DirectorioController {
  constructor(
    @InjectRepository(DirectorioDocumento)
    private readonly repo: Repository<DirectorioDocumento>,
  ) {}

  @Get()
  async listar(@Query('module') module: string) {
    return this.repo.find({
      where: {
        modulo: module,
        estado: true,
      },
      order: {
        orden: 'ASC',
      },
    });
  }
}
