import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ReporteContableService } from '../services/reporte-contable.service';
import { BalanceComprobacionRow } from '../dto/balance-comprobacion.dto';
import { LibroMayorRow } from '../dto/libro-mayor.dto';
import { EstadoResultadosRow } from '../dto/estado-resultados.dto';
import { BalanceGeneralSaldosRow } from '../dto/balance-general-saldos.dto';

@Resolver()
export class ReporteContableResolver {
  constructor(private readonly reporteContableService: ReporteContableService) {}

  @Query(() => [BalanceComprobacionRow])
  async balanceComprobacion(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('fechaDesde') fechaDesde: string,
    @Args('fechaHasta') fechaHasta: string,
  ): Promise<BalanceComprobacionRow[]> {
    return this.reporteContableService.balanceComprobacion(empresaId, fechaDesde, fechaHasta);
  }

  @Query(() => [LibroMayorRow])
  async libroMayor(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('cuentaId', { type: () => Int }) cuentaId: number,
    @Args('fechaDesde') fechaDesde: string,
    @Args('fechaHasta') fechaHasta: string,
  ): Promise<LibroMayorRow[]> {
    return this.reporteContableService.libroMayor(empresaId, cuentaId, fechaDesde, fechaHasta);
  }

  @Query(() => [EstadoResultadosRow])
  async estadoResultados(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('fechaDesde') fechaDesde: string,
    @Args('fechaHasta') fechaHasta: string,
  ): Promise<EstadoResultadosRow[]> {
    return this.reporteContableService.estadoResultados(empresaId, fechaDesde, fechaHasta);
  }

  @Query(() => [BalanceGeneralSaldosRow])
  async balanceGeneralSaldos(
    @Args('empresaId', { type: () => Int }) empresaId: number,
    @Args('fechaCorte') fechaCorte: string,
  ): Promise<BalanceGeneralSaldosRow[]> {
    return this.reporteContableService.balanceGeneralSaldos(empresaId, fechaCorte);
  }
}
