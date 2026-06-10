import { Resolver, Query, Args } from '@nestjs/graphql';
import { ModeloPlanContable } from '../entities/modelo-plan-contable.entity';
import { PlanContable } from '../entities/plan-contable.entity';
import { ModeloPlanContableService } from '../services/modelo-plan-contable.service';
import { PlanContableService } from '../services/plan-contable.service';

@Resolver(() => ModeloPlanContable)
export class ModeloPlanContableResolver {
  constructor(
    private readonly modeloService: ModeloPlanContableService,
    private readonly planService: PlanContableService,
  ) {}

  @Query(() => [ModeloPlanContable], { name: 'modelosPlanesContables' })
  async modelosPlanesContables(
    @Args('id_pais', { type: () => String, nullable: true }) id_pais?: string,
  ): Promise<ModeloPlanContable[]> {
    return this.modeloService.findAll(id_pais);
  }

  @Query(() => ModeloPlanContable, { name: 'modeloPlanContable', nullable: true })
  async modeloPlanContable(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ModeloPlanContable | null> {
    return this.modeloService.findOne(id);
  }

  @Query(() => [PlanContable], { name: 'planesContablesPorModelo' })
  async planesContablesPorModelo(
    @Args('id_modelo', { type: () => String }) id_modelo: string,
  ): Promise<PlanContable[]> {
    return this.planService.findByModelo(id_modelo);
  }

  @Query(() => PlanContable, { name: 'planContableActivo', nullable: true })
  async planContableActivo(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<PlanContable | null> {
    return this.planService.findActivoByEmpresa(id_empresa);
  }
}
