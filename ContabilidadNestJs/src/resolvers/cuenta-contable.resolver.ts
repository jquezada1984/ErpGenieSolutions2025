import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CuentaContable } from '../entities/cuenta-contable.entity';
import { CuentasContablesPaginadas } from '../dto/cuentas-contables-paginadas.dto';
import { CuentaContableService } from '../services/cuenta-contable.service';

@Resolver(() => CuentaContable)
export class CuentaContableResolver {
  constructor(private readonly cuentaContableService: CuentaContableService) {}

  @Query(() => CuentasContablesPaginadas, { name: 'cuentasContablesPorPlan' })
  async cuentasContablesPorPlan(
    @Args('id_plan_contable', { type: () => String }) id_plan_contable: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit: number,
    @Args('busqueda', { type: () => String, nullable: true }) busqueda?: string,
  ): Promise<CuentasContablesPaginadas> {
    return this.cuentaContableService.findByPlanPaginado(
      id_plan_contable,
      page,
      limit,
      busqueda,
    );
  }

  @Query(() => CuentaContable, { name: 'cuentaContable', nullable: true })
  async cuentaContable(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CuentaContable | null> {
    return this.cuentaContableService.findOne(id);
  }
}
