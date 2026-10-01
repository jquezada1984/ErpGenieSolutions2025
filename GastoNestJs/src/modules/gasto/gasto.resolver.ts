import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Gasto } from './entities/gasto.entity';
import { GastoService } from './gasto.service';

@Resolver(() => Gasto)
export class GastoResolver {
  constructor(private readonly gastoService: GastoService) {}

  @Query(() => [Gasto], { name: 'gastos' })
  gastos(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('estado_gasto', { type: () => String, nullable: true })
    estado_gasto?: string,
    @Args('fecha_desde', { type: () => String, nullable: true })
    fecha_desde?: string,
    @Args('fecha_hasta', { type: () => String, nullable: true })
    fecha_hasta?: string,
    @Args('id_categoria_gasto', { type: () => ID, nullable: true })
    id_categoria_gasto?: string,
    @Args('id_tercero', { type: () => ID, nullable: true })
    id_tercero?: string,
  ): Promise<Gasto[]> {
    // Nota futura Gateway: validar id_empresa === X-Company-Id efectivo.
    return this.gastoService.findAll(id_empresa, {
      estado_gasto: estado_gasto || undefined,
      fecha_desde: fecha_desde || undefined,
      fecha_hasta: fecha_hasta || undefined,
      id_categoria_gasto: id_categoria_gasto || undefined,
      id_tercero: id_tercero || undefined,
    });
  }

  @Query(() => Gasto, { name: 'gasto', nullable: true })
  gasto(
    @Args('id_gasto', { type: () => ID }) id_gasto: string,
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
  ): Promise<Gasto | null> {
    return this.gastoService.findOne(id_gasto, id_empresa);
  }
}
