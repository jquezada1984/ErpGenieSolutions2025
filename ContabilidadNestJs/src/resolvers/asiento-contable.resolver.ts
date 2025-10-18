import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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

  @Mutation(() => AsientoContable)
  async crearAsientoContable(
    @Args('numero') numero: string,
    @Args('fecha') fecha: string,
    @Args('concepto') concepto: string,
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('usuarioId', { type: () => Int, nullable: true }) usuarioId?: number,
  ): Promise<AsientoContable> {
    return this.asientoContableService.create({
      numero,
      fecha: new Date(fecha),
      concepto,
      total_debe: 0,
      total_haber: 0,
      estado: 'BORRADOR',
      empresa_id: empresaId,
      usuario_id: usuarioId,
    });
  }
}
