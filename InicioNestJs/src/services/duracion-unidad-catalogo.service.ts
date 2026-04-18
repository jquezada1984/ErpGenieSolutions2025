import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DuracionUnidadCatalogo } from '../entities/duracion-unidad-catalogo.entity';

@Injectable()
export class DuracionUnidadCatalogoService {
  constructor(
    @InjectRepository(DuracionUnidadCatalogo)
    private readonly repo: Repository<DuracionUnidadCatalogo>,
  ) {}

  async findActivosOrdenados(): Promise<DuracionUnidadCatalogo[]> {
    return this.repo.find({
      where: { estado: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }
}
