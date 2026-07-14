import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { AsientoContable } from '../entities/asiento-contable.entity';
import { MovimientoContable } from '../entities/movimiento-contable.entity';
import { AsientoContableService } from '../services/asiento-contable.service';

@Resolver(() => AsientoContable)
export class AsientoContableResolver {
  constructor(private readonly asientoContableService: AsientoContableService) {}

  @Query(() => [AsientoContable])
  async asientosContablesPorEmpresa(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_desde', { nullable: true }) fecha_desde?: string,
    @Args('fecha_hasta', { nullable: true }) fecha_hasta?: string,
    @Args('id_diario', { nullable: true }) id_diario?: string,
  ): Promise<AsientoContable[]> {
    return this.asientoContableService.findByEmpresa(
      id_empresa,
      fecha_desde,
      fecha_hasta,
      id_diario,
    );
  }

  @Query(() => AsientoContable, { nullable: true })
  async asientoContable(@Args('id') id: string): Promise<AsientoContable | null> {
    return this.asientoContableService.findOne(id);
  }

  @ResolveField(() => [MovimientoContable])
  async movimientos(@Parent() asiento: AsientoContable): Promise<MovimientoContable[]> {
    return this.asientoContableService.findMovimientosByAsiento(asiento.id_asiento_contable);
  }
}
