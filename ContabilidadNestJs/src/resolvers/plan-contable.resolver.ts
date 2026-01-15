import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PlanContable } from '../entities/plan-contable.entity';
import { PlanContableService } from '../services/plan-contable.service';

@Resolver(() => PlanContable)
export class PlanContableResolver {
  constructor(private readonly planService: PlanContableService) {}

  @Query(() => [PlanContable])
  async planesContables(): Promise<PlanContable[]> {
    return this.planService.findAll();
  }

  @Query(() => PlanContable, { nullable: true })
  async planContable(@Args('id', { type: () => Int }) id: number): Promise<PlanContable> {
    return this.planService.findOne(id);
  }

  @Query(() => [PlanContable])
  async planesContablesPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<PlanContable[]> {
    return this.planService.findByEmpresa(empresaId);
  }
}
