import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BalanceComprobacionRow } from '../dto/balance-comprobacion.dto';
import { EstadoResultadosRow } from '../dto/estado-resultados.dto';
import { BalanceGeneralSaldosRow } from '../dto/balance-general-saldos.dto';

@Injectable()
export class ReporteContableService {
  constructor(private dataSource: DataSource) {}

  async balanceComprobacion(
    id_empresa: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<BalanceComprobacionRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM balance_comprobacion($1, $2, $3)',
      [id_empresa, fechaDesde, fechaHasta],
    );
    return raw.map((r: Record<string, unknown>) => ({
      cuenta_id: String(r.cuenta_id),
      codigo: String(r.codigo),
      nombre: String(r.nombre),
      tipo: String(r.tipo),
      naturaleza: String(r.naturaleza),
      total_debe: Number(r.total_debe),
      total_haber: Number(r.total_haber),
      saldo: Number(r.saldo),
    }));
  }

  async estadoResultados(
    id_empresa: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<EstadoResultadosRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM estado_resultados($1, $2, $3)',
      [id_empresa, fechaDesde, fechaHasta],
    );
    return raw.map((r: Record<string, unknown>) => ({
      tipo_cuenta: String(r.tipo_cuenta),
      total: Number(r.total),
      resultado: r.resultado != null ? Number(r.resultado) : null,
    }));
  }

  async balanceGeneralSaldos(
    id_empresa: string,
    fechaCorte: string,
  ): Promise<BalanceGeneralSaldosRow[]> {
    const raw = await this.dataSource.query(
      'SELECT * FROM balance_general_saldos($1, $2)',
      [id_empresa, fechaCorte],
    );
    return raw.map((r: Record<string, unknown>) => ({
      tipo_cuenta: String(r.tipo_cuenta),
      saldo: Number(r.saldo),
    }));
  }
}
