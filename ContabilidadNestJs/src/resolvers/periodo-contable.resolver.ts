import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PeriodoContable } from '../entities/periodo-contable.entity';
import { PeriodoContableService } from '../services/periodo-contable.service';

@Resolver(() => PeriodoContable)
export class PeriodoContableResolver {
  constructor(private readonly periodoContableService: PeriodoContableService) {}

  @Query(() => [PeriodoContable])
  async periodosContables(): Promise<PeriodoContable[]> {
    return this.periodoContableService.findAll();
  }

  @Query(() => PeriodoContable, { nullable: true })
  async periodoContable(@Args('id', { type: () => Int }) id: number): Promise<PeriodoContable> {
    return this.periodoContableService.findOne(id);
  }

  @Query(() => [PeriodoContable])
  async periodosContablesPorEmpresa(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<PeriodoContable[]> {
    return this.periodoContableService.findByEmpresa(empresaId);
  }

  @Query(() => [PeriodoContable])
  async periodosContablesPorAño(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('año', { type: () => Int }) año: number,
  ): Promise<PeriodoContable[]> {
    return this.periodoContableService.findByAño(empresaId, año);
  }

  @Query(() => PeriodoContable, { nullable: true })
  async periodoContableActual(
    @Args('empresaId', { type: () => Int }) empresaId: number,
  ): Promise<PeriodoContable> {
    return this.periodoContableService.findPeriodoActual(empresaId);
  }
}
