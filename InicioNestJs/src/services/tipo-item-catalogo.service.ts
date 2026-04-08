import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoItemCatalogo } from '../entities/tipo-item-catalogo.entity';

@Injectable()
export class TipoItemCatalogoService {
  constructor(
    @InjectRepository(TipoItemCatalogo)
    private readonly repo: Repository<TipoItemCatalogo>,
  ) {}

  async findActivosOrdenados(): Promise<TipoItemCatalogo[]> {
    return this.repo.find({
      where: { estado: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }
}
