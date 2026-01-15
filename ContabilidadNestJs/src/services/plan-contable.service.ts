import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanContable } from '../entities/plan-contable.entity';

@Injectable()
export class PlanContableService {
  constructor(
    @InjectRepository(PlanContable)
    private planRepository: Repository<PlanContable>,
  ) {}

  async findAll(): Promise<PlanContable[]> {
    return this.planRepository.find({
      where: { estado: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PlanContable> {
    return this.planRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<PlanContable[]> {
    return this.planRepository.find({
      where: { empresa_id: empresaId, estado: true },
      order: { nombre: 'ASC' },
    });
  }
}
