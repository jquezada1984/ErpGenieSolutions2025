import { Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEntidadComercial } from '../entities/tipo-entidad-comercial.entity';

@Resolver(() => TipoEntidadComercial)
export class TipoEntidadComercialResolver {
  constructor(
    @InjectRepository(TipoEntidadComercial)
    private readonly repo: Repository<TipoEntidadComercial>,
  ) {}

  @Query(() => [TipoEntidadComercial], { name: 'tiposEntidadComercial' })
  tiposEntidadComercial(): Promise<TipoEntidadComercial[]> {
    return this.repo.find({
      order: { id_tipo_entidad: 'ASC' }
    });
  }
}
