import { Resolver, Query, Args } from '@nestjs/graphql';
import { DiarioContable } from '../entities/diario-contable.entity';
import { DiarioContableService } from '../services/diario-contable.service';

@Resolver(() => DiarioContable)
export class DiarioContableResolver {
  constructor(private readonly service: DiarioContableService) {}

  @Query(() => [DiarioContable], { name: 'diariosContables' })
  async diariosContables(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<DiarioContable[]> {
    return this.service.findByEmpresa(id_empresa);
  }

  @Query(() => DiarioContable, { name: 'diarioContable', nullable: true })
  async diarioContable(
    @Args('id', { type: () => String }) id: string,
  ): Promise<DiarioContable | null> {
    return this.service.findOne(id);
  }
}
