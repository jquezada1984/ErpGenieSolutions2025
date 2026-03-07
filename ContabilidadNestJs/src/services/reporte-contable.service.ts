import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BalanceComprobacionRow } from '../dto/balance-comprobacion.dto';
import { LibroMayorRow } from '../dto/libro-mayor.dto';
import { EstadoResultadosRow } from '../dto/estado-resultados.dto';
import { BalanceGeneralSaldosRow } from '../dto/balance-general-saldos.dto';

@Injectable()
export class ReporteContableService {
  constructor(private dataSource: DataSource) {}

  /**
   * Balance de comprobación (solo asientos APROBADO en el rango de fechas).
   */
  async balanceComprobacion(
    empresaId: number,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<BalanceComprobacionRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM balance_comprobacion($1, $2, $3)',
      [empresaId, fechaDesde, fechaHasta],
    );
    return raw.map((r: Record<string, unknown>) => ({
      cuenta_id: Number(r.cuenta_id),
      codigo: String(r.codigo),
      nombre: String(r.nombre),
      tipo: String(r.tipo),
      naturaleza: String(r.naturaleza),
      total_debe: Number(r.total_debe),
      total_haber: Number(r.total_haber),
      saldo: Number(r.saldo),
    }));
  }

  /**
   * Libro mayor por cuenta (movimientos con saldo acumulado).
   */
  async libroMayor(
    empresaId: number,
    cuentaId: number,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<LibroMayorRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM libro_mayor($1, $2, $3, $4)',
      [empresaId, cuentaId, fechaDesde, fechaHasta],
    );
    return raw.map((r: Record<string, unknown>) => ({
      asiento_id: Number(r.asiento_id),
      numero: String(r.numero),
      fecha: r.fecha instanceof Date ? r.fecha.toISOString().slice(0, 10) : String(r.fecha),
      concepto: String(r.concepto ?? ''),
      debe: Number(r.debe),
      haber: Number(r.haber),
      saldo_acum: Number(r.saldo_acum),
    }));
  }

  /**
   * Estado de resultados (ingresos, gastos, resultado).
   */
  async estadoResultados(
    empresaId: number,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<EstadoResultadosRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM estado_resultados($1, $2, $3)',
      [empresaId, fechaDesde, fechaHasta],
    );
    return raw.map((r: Record<string, unknown>) => ({
      tipo_cuenta: String(r.tipo_cuenta),
      total: Number(r.total),
      resultado: r.resultado != null ? Number(r.resultado) : null,
    }));
  }

  /**
   * Balance general: saldos por tipo de cuenta (ACTIVO, PASIVO, PATRIMONIO) a fecha de corte.
   */
  async balanceGeneralSaldos(
    empresaId: number,
    fechaCorte: string,
  ): Promise<BalanceGeneralSaldosRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM balance_general_saldos($1, $2)',
      [empresaId, fechaCorte],
    );
    return raw.map((r: Record<string, unknown>) => ({
      tipo_cuenta: String(r.tipo_cuenta),
      saldo: Number(r.saldo),
    }));
  }
}
