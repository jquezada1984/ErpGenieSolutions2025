import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiarioContable } from '../entities/diario-contable.entity';

const TIPO_DIARIO_LABELS: Record<string, string> = {
  OPERACIONES_VARIAS: 'Operaciones varias',
  VENTAS: 'Ventas',
  COMPRAS: 'Compras',
  BANCO: 'Banco',
  GASTOS: 'Gastos',
  INVENTARIO: 'Inventario',
  GANANCIAS_RETENIDAS: 'Ganancias retenidas',
};

@Injectable()
export class DiarioContableService {
  constructor(
    @InjectRepository(DiarioContable)
    private readonly repo: Repository<DiarioContable>,
  ) {}

  private enrich(row: DiarioContable): DiarioContable {
    row.etiqueta = row.nombre;
    row.tipo_diario_label = TIPO_DIARIO_LABELS[row.tipo_diario] || row.tipo_diario;
    return row;
  }

  async findByEmpresa(id_empresa: string): Promise<DiarioContable[]> {
    const rows = await this.repo.find({
      where: { id_empresa },
      order: { codigo: 'ASC' },
    });
    return rows.map((r) => this.enrich(r));
  }

  async findOne(id: string): Promise<DiarioContable | null> {
    const row = await this.repo.findOne({ where: { id_diario_contable: id } });
    return row ? this.enrich(row) : null;
  }
}
