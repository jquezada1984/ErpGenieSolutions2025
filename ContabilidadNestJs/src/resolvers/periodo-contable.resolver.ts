import { Resolver, Query, Args } from '@nestjs/graphql';
import { PeriodoContable } from '../entities/periodo-contable.entity';
import { PeriodoContableService } from '../services/periodo-contable.service';

@Resolver(() => PeriodoContable)
export class PeriodoContableResolver {
  constructor(private readonly service: PeriodoContableService) {}

  @Query(() => [PeriodoContable], { name: 'periodosContables' })
  async periodosContables(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<PeriodoContable[]> {
    return this.service.findByEmpresa(id_empresa);
  }

  @Query(() => PeriodoContable, { name: 'periodoContable', nullable: true })
  async periodoContable(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PeriodoContable | null> {
    return this.service.findOne(id);
  }
}
