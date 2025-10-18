import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsientoContable } from '../entities/asiento-contable.entity';

@Injectable()
export class AsientoContableService {
  constructor(
    @InjectRepository(AsientoContable)
    private asientoContableRepository: Repository<AsientoContable>,
  ) {}

  async findAll(): Promise<AsientoContable[]> {
    return this.asientoContableRepository.find({
      order: { fecha: 'DESC', numero: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AsientoContable> {
    return this.asientoContableRepository.findOne({ where: { id } });
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<AsientoContable[]> {
    return this.asientoContableRepository
      .createQueryBuilder('asiento')
      .where('asiento.fecha >= :fechaInicio', { fechaInicio })
      .andWhere('asiento.fecha <= :fechaFin', { fechaFin })
      .orderBy('asiento.fecha', 'DESC')
      .addOrderBy('asiento.numero', 'DESC')
      .getMany();
  }

  async create(asientoData: Partial<AsientoContable>): Promise<AsientoContable> {
    const asiento = this.asientoContableRepository.create(asientoData);
    return this.asientoContableRepository.save(asiento);
  }

  async update(id: number, asientoData: Partial<AsientoContable>): Promise<AsientoContable> {
    await this.asientoContableRepository.update(id, asientoData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.asientoContableRepository.update(id, { estado: 'ANULADO' });
  }

  async aprobar(id: number): Promise<AsientoContable> {
    await this.asientoContableRepository.update(id, { estado: 'APROBADO' });
    return this.findOne(id);
  }
}
