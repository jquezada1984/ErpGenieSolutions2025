import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { DiarioContable } from '../entities/diario-contable.entity';
import { DiarioContableService } from '../services/diario-contable.service';

@Resolver(() => DiarioContable)
export class DiarioContableResolver {
  constructor(private readonly diarioContableService: DiarioContableService) {}

  @Query(() => [DiarioContable])
  async diariosContables(): Promise<DiarioContable[]> {
    return this.diarioContableService.findAll();
  }

  @Query(() => DiarioContable, { nullable: true })
  async diarioContable(@Args('id', { type: () => Int }) id: number): Promise<DiarioContable> {
    return this.diarioContableService.findOne(id);
  }

  @Query(() => [DiarioContable])
  async diariosContablesPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<DiarioContable[]> {
    return this.diarioContableService.findByEmpresa(empresaId);
  }

  @Query(() => [DiarioContable])
  async diariosContablesPorTipo(@Args('tipo') tipo: string): Promise<DiarioContable[]> {
    return this.diarioContableService.findByTipo(tipo);
  }
}
