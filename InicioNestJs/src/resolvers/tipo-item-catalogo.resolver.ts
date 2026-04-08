import { Resolver, Query } from '@nestjs/graphql';
import { TipoItemCatalogo } from '../entities/tipo-item-catalogo.entity';
import { TipoItemCatalogoService } from '../services/tipo-item-catalogo.service';

@Resolver(() => TipoItemCatalogo)
export class TipoItemCatalogoResolver {
  constructor(private readonly tipoItemCatalogoService: TipoItemCatalogoService) {}

  @Query(() => [TipoItemCatalogo], { name: 'tiposItemCatalogo' })
  async tiposItemCatalogo(): Promise<TipoItemCatalogo[]> {
    return this.tipoItemCatalogoService.findActivosOrdenados();
  }
}
