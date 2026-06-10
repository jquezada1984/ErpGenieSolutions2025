import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PeriodoContable } from '../entities/periodo-contable.entity';

@Injectable()
export class PeriodoContableService {
  constructor(
    @InjectRepository(PeriodoContable)
    private readonly repo: Repository<PeriodoContable>,
    private readonly dataSource: DataSource,
  ) {}

  private buildRef(anio: number, mes: number): string {
    return `${anio}-${String(mes).padStart(2, '0')}`;
  }

  private async enrich(periodo: PeriodoContable): Promise<PeriodoContable> {
    const counts = await this.dataSource.query(
      `SELECT
        (SELECT COUNT(*)::int FROM asiento_contable a
          WHERE a.id_empresa = $1
            AND a.fecha_asiento >= $2
            AND a.fecha_asiento <= $3) AS entradas,
        (SELECT COUNT(*)::int FROM movimiento_contable m
          INNER JOIN asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
          WHERE a.id_empresa = $1
            AND a.fecha_asiento >= $2
            AND a.fecha_asiento <= $3) AS movimientos`,
      [periodo.id_empresa, periodo.fecha_inicio, periodo.fecha_fin],
    );
    periodo.ref = this.buildRef(periodo.anio, periodo.mes);
    periodo.num_entradas = counts[0]?.entradas ?? 0;
    periodo.num_movimientos = counts[0]?.movimientos ?? 0;
    return periodo;
  }

  async findByEmpresa(id_empresa: string): Promise<PeriodoContable[]> {
    const rows = await this.repo.find({
      where: { id_empresa },
      order: { anio: 'DESC', mes: 'DESC' },
    });
    return Promise.all(rows.map((r) => this.enrich(r)));
  }

  async findOne(id: string): Promise<PeriodoContable | null> {
    const row = await this.repo.findOne({ where: { id_periodo_contable: id } });
    if (!row) return null;
    return this.enrich(row);
  }
}
