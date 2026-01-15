import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AsientoContable } from '../entities/asiento-contable.entity';
import { AsientoContableService } from '../services/asiento-contable.service';

@Resolver(() => AsientoContable)
export class AsientoContableResolver {
  constructor(private readonly asientoContableService: AsientoContableService) {}

  @Query(() => [AsientoContable])
  async asientosContables(): Promise<AsientoContable[]> {
    return this.asientoContableService.findAll();
  }

  @Query(() => AsientoContable, { nullable: true })
  async asientoContable(@Args('id', { type: () => Int }) id: number): Promise<AsientoContable> {
    return this.asientoContableService.findOne(id);
  }

  @Query(() => [AsientoContable])
  async asientosContablesPorFecha(
    @Args('fechaInicio') fechaInicio: string,
    @Args('fechaFin') fechaFin: string,
  ): Promise<AsientoContable[]> {
    return this.asientoContableService.findByDateRange(fechaInicio, fechaFin);
  }
}
