import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaContable } from '../entities/cuenta-contable.entity';

@Injectable()
export class CuentaContableService {
  constructor(
    @InjectRepository(CuentaContable)
    private cuentaContableRepository: Repository<CuentaContable>,
  ) {}

  async findAll(): Promise<CuentaContable[]> {
    return this.cuentaContableRepository.find({
      where: { activa: true },
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CuentaContable> {
    return this.cuentaContableRepository.findOne({ where: { id } });
  }

  async findByTipo(tipo: string): Promise<CuentaContable[]> {
    return this.cuentaContableRepository.find({
      where: { tipo, activa: true },
      order: { codigo: 'ASC' },
    });
  }

  async create(cuentaData: Partial<CuentaContable>): Promise<CuentaContable> {
    const cuenta = this.cuentaContableRepository.create(cuentaData);
    return this.cuentaContableRepository.save(cuenta);
  }

  async update(id: number, cuentaData: Partial<CuentaContable>): Promise<CuentaContable> {
    await this.cuentaContableRepository.update(id, cuentaData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cuentaContableRepository.update(id, { activa: false });
  }
}
