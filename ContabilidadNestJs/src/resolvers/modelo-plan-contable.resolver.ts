import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ModeloPlanContable } from '../entities/modelo-plan-contable.entity';
import { ModeloPlanContableService } from '../services/modelo-plan-contable.service';

@Resolver(() => ModeloPlanContable)
export class ModeloPlanContableResolver {
  constructor(private readonly modeloService: ModeloPlanContableService) {}

  @Query(() => [ModeloPlanContable])
  async modelosPlanContable(): Promise<ModeloPlanContable[]> {
    return this.modeloService.findAll();
  }

  @Query(() => ModeloPlanContable, { nullable: true })
  async modeloPlanContable(@Args('id', { type: () => Int }) id: number): Promise<ModeloPlanContable> {
    return this.modeloService.findOne(id);
  }

  @Query(() => ModeloPlanContable, { nullable: true })
  async modeloPlanContablePorCodigo(@Args('codigo') codigo: string): Promise<ModeloPlanContable> {
    return this.modeloService.findByCodigo(codigo);
  }
}
