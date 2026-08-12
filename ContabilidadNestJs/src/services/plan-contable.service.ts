import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanContable } from '../entities/plan-contable.entity';

/** Empresa dueña de planes plantilla (seed EC-SUPERCIAS, etc.). */
const EMPRESA_PLANTILLA = 'a0000000-0000-4000-8000-000000000001';

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

  /**
   * Plan activo de la empresa. Si aún no tiene plan propio,
   * usa la plantilla del catálogo (misma que ve el listado de cuentas).
   */
  async findActivoByEmpresa(id_empresa: string): Promise<PlanContable | null> {
    const propios = await this.repo.find({
      where: { id_empresa, estado: true },
      order: { created_at: 'DESC' },
      take: 1,
    });
    if (propios[0]) return propios[0];

    const plantilla = await this.repo.find({
      where: { id_empresa: EMPRESA_PLANTILLA, estado: true },
      order: { created_at: 'DESC' },
      take: 1,
    });
    return plantilla[0] ?? null;
  }
}
