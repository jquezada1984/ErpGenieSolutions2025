import { Resolver, Query } from '@nestjs/graphql';
import { DuracionUnidadCatalogo } from '../entities/duracion-unidad-catalogo.entity';
import { DuracionUnidadCatalogoService } from '../services/duracion-unidad-catalogo.service';

@Resolver(() => DuracionUnidadCatalogo)
export class DuracionUnidadCatalogoResolver {
  constructor(private readonly duracionUnidadCatalogoService: DuracionUnidadCatalogoService) {}

  @Query(() => [DuracionUnidadCatalogo], { name: 'duracionUnidadesCatalogo' })
  async duracionUnidadesCatalogo(): Promise<DuracionUnidadCatalogo[]> {
    return this.duracionUnidadCatalogoService.findActivosOrdenados();
  }
}
