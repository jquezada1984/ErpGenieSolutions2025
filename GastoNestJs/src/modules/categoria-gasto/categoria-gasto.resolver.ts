import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CategoriaGastoService } from './categoria-gasto.service';

@Resolver(() => CategoriaGasto)
export class CategoriaGastoResolver {
  constructor(private readonly categoriaService: CategoriaGastoService) {}

  @Query(() => [CategoriaGasto], { name: 'categoriasGasto' })
  categoriasGasto(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('solo_activos', { type: () => Boolean, nullable: true, defaultValue: true })
    solo_activos?: boolean,
  ): Promise<CategoriaGasto[]> {
    return this.categoriaService.findAll(id_empresa, solo_activos !== false);
  }

  @Query(() => CategoriaGasto, { name: 'categoriaGasto', nullable: true })
  categoriaGasto(
    @Args('id_categoria_gasto', { type: () => ID }) id_categoria_gasto: string,
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<CategoriaGasto | null> {
    return this.categoriaService.findOne(id_categoria_gasto, id_empresa);
  }
}
