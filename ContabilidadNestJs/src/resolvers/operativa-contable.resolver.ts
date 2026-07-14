import { Resolver, Query, Args } from '@nestjs/graphql';
import { OperativaContableService } from '../services/operativa-contable.service';
import { ReporteContableService } from '../services/reporte-contable.service';
import { EstadoAreaContabilidad } from '../dto/estado-area-contabilidad.dto';
import { LibroMayorRow } from '../dto/libro-mayor.dto';
import { OperacionDiarioRow } from '../dto/operacion-diario.dto';
import { SaldoCuentaRow } from '../dto/saldo-cuenta.dto';
import { BalanceComprobacionRow } from '../dto/balance-comprobacion.dto';
import { EstadoResultadosRow } from '../dto/estado-resultados.dto';
import { BalanceGeneralSaldosRow } from '../dto/balance-general-saldos.dto';

@Resolver()
export class OperativaContableResolver {
  constructor(
    private readonly operativaService: OperativaContableService,
    private readonly reporteService: ReporteContableService,
  ) {}

  @Query(() => EstadoAreaContabilidad)
  async estadoAreaContabilidad(
    @Args('id_empresa') id_empresa: string,
  ): Promise<EstadoAreaContabilidad> {
    return this.operativaService.estadoAreaContabilidad(id_empresa);
  }

  @Query(() => [LibroMayorRow])
  async libroMayor(
    @Args('id_empresa') id_empresa: string,
    @Args('id_cuenta') id_cuenta: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
  ): Promise<LibroMayorRow[]> {
    return this.operativaService.libroMayor(id_empresa, id_cuenta, fecha_desde, fecha_hasta);
  }

  @Query(() => [OperacionDiarioRow])
  async operacionesDiarios(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
    @Args('id_diario', { nullable: true }) id_diario?: string,
    @Args('id_cuenta', { nullable: true }) id_cuenta?: string,
    @Args('incluir_exportados', { nullable: true }) incluir_exportados?: boolean,
  ): Promise<OperacionDiarioRow[]> {
    return this.operativaService.operacionesDiarios(id_empresa, fecha_desde, fecha_hasta, {
      id_diario,
      id_cuenta,
      incluir_exportados: incluir_exportados ?? false,
    });
  }

  @Query(() => [OperacionDiarioRow])
  async movimientosPendientesExportar(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
    @Args('incluir_exportados', { nullable: true }) incluir_exportados?: boolean,
  ): Promise<OperacionDiarioRow[]> {
    return this.operativaService.movimientosPendientesExportar(
      id_empresa,
      fecha_desde,
      fecha_hasta,
      incluir_exportados ?? false,
    );
  }

  @Query(() => [SaldoCuentaRow])
  async saldosPorCuenta(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
    @Args('id_diario', { nullable: true }) id_diario?: string,
    @Args('cuenta_desde', { nullable: true }) cuenta_desde?: string,
    @Args('cuenta_hasta', { nullable: true }) cuenta_hasta?: string,
    @Args('subtotal_por_nivel', { nullable: true }) subtotal_por_nivel?: boolean,
  ): Promise<SaldoCuentaRow[]> {
    return this.operativaService.saldosPorCuenta(id_empresa, fecha_desde, fecha_hasta, {
      id_diario,
      cuenta_desde,
      cuenta_hasta,
      subtotal_por_nivel: subtotal_por_nivel ?? false,
    });
  }

  @Query(() => [BalanceComprobacionRow])
  async balanceComprobacion(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
  ): Promise<BalanceComprobacionRow[]> {
    return this.reporteService.balanceComprobacion(id_empresa, fecha_desde, fecha_hasta);
  }

  @Query(() => [EstadoResultadosRow])
  async estadoResultados(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_desde') fecha_desde: string,
    @Args('fecha_hasta') fecha_hasta: string,
  ): Promise<EstadoResultadosRow[]> {
    return this.reporteService.estadoResultados(id_empresa, fecha_desde, fecha_hasta);
  }

  @Query(() => [BalanceGeneralSaldosRow])
  async balanceGeneralSaldos(
    @Args('id_empresa') id_empresa: string,
    @Args('fecha_corte') fecha_corte: string,
  ): Promise<BalanceGeneralSaldosRow[]> {
    return this.reporteService.balanceGeneralSaldos(id_empresa, fecha_corte);
  }
}
