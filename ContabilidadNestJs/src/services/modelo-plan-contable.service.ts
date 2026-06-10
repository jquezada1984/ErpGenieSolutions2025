import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloPlanContable } from '../entities/modelo-plan-contable.entity';
import { PlanContable } from '../entities/plan-contable.entity';

const EMPRESA_PLANTILLA = 'a0000000-0000-4000-8000-000000000001';

@Injectable()
export class ModeloPlanContableService {
  constructor(
    @InjectRepository(ModeloPlanContable)
    private readonly modeloRepo: Repository<ModeloPlanContable>,
    @InjectRepository(PlanContable)
    private readonly planRepo: Repository<PlanContable>,
  ) {}

  private async attachPlanPlantilla(modelo: ModeloPlanContable): Promise<ModeloPlanContable> {
    const plan = await this.planRepo.findOne({
      where: {
        id_modelo_plan_contable: modelo.id_modelo_plan_contable,
        id_empresa: EMPRESA_PLANTILLA,
      },
    });
    modelo.id_plan_plantilla = plan?.id_plan_contable ?? null;
    return modelo;
  }

  async findAll(id_pais?: string): Promise<ModeloPlanContable[]> {
    const qb = this.modeloRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.pais', 'pais')
      .orderBy('m.codigo', 'ASC');
    if (id_pais) {
      qb.where('m.id_pais = :id_pais', { id_pais });
    }
    const rows = await qb.getMany();
    return Promise.all(rows.map((r) => this.attachPlanPlantilla(r)));
  }

  async findOne(id: string): Promise<ModeloPlanContable | null> {
    const row = await this.modeloRepo.findOne({
      where: { id_modelo_plan_contable: id },
      relations: ['pais'],
    });
    if (!row) return null;
    return this.attachPlanPlantilla(row);
  }
}
