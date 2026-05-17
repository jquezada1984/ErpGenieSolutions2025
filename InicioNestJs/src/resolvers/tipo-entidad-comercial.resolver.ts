import { Args, Query, Resolver } from '@nestjs/graphql';
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
  tiposEntidadComercial(
    @Args('soloActivos', { type: () => Boolean, nullable: true, defaultValue: true })
    soloActivos?: boolean,
  ): Promise<TipoEntidadComercial[]> {
    return this.repo.find({
      where: soloActivos === false ? {} : { activo: true },
      order: { nombre: 'ASC' },
    });
  }
}
