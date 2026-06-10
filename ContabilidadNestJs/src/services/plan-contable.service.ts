import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanContable } from '../entities/plan-contable.entity';

@Injectable()
export class PlanContableService {
  constructor(
    @InjectRepository(PlanContable)
    private readonly repo: Repository<PlanContable>,
  ) {}

  async findByModelo(id_modelo: string): Promise<PlanContable[]> {
    return this.repo.find({
      where: { id_modelo_plan_contable: id_modelo },
      order: { nombre: 'ASC' },
    });
  }

  async findActivoByEmpresa(id_empresa: string): Promise<PlanContable | null> {
    const rows = await this.repo.find({
      where: { id_empresa, estado: true },
      order: { created_at: 'DESC' },
      take: 1,
    });
    return rows[0] ?? null;
  }
}
