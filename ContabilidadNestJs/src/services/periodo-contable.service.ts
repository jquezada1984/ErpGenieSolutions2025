import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodoContable } from '../entities/periodo-contable.entity';

@Injectable()
export class PeriodoContableService {
  constructor(
    @InjectRepository(PeriodoContable)
    private periodoContableRepository: Repository<PeriodoContable>,
  ) {}

  async findAll(): Promise<PeriodoContable[]> {
    return this.periodoContableRepository.find({
      order: { año: 'DESC', mes: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PeriodoContable> {
    return this.periodoContableRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<PeriodoContable[]> {
    return this.periodoContableRepository.find({
      where: { empresa_id: empresaId },
      order: { año: 'DESC', mes: 'DESC' },
    });
  }

  async findByAño(empresaId: number, año: number): Promise<PeriodoContable[]> {
    return this.periodoContableRepository.find({
      where: { empresa_id: empresaId, año },
      order: { mes: 'ASC' },
    });
  }

  async findPeriodoActual(empresaId: number): Promise<PeriodoContable | null> {
    const hoy = new Date();
    return this.periodoContableRepository.findOne({
      where: {
        empresa_id: empresaId,
        año: hoy.getFullYear(),
        mes: hoy.getMonth() + 1,
        estado: 'ABIERTO',
      },
    });
  }
}
