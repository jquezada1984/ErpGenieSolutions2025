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

}
