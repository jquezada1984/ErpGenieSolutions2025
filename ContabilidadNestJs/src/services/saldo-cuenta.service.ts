import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaldoCuenta } from '../entities/saldo-cuenta.entity';

@Injectable()
export class SaldoCuentaService {
  constructor(
    @InjectRepository(SaldoCuenta)
    private saldoCuentaRepository: Repository<SaldoCuenta>,
  ) {}

  async findAll(): Promise<SaldoCuenta[]> {
    return this.saldoCuentaRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SaldoCuenta> {
    return this.saldoCuentaRepository.findOne({ where: { id } });
  }

  async findByCuenta(cuentaContableId: number): Promise<SaldoCuenta[]> {
    return this.saldoCuentaRepository.find({
      where: { cuenta_contable_id: cuentaContableId },
      order: { created_at: 'DESC' },
    });
  }

  async findByPeriodo(periodoContableId: number): Promise<SaldoCuenta[]> {
    return this.saldoCuentaRepository.find({
      where: { periodo_contable_id: periodoContableId },
      order: { cuenta_contable_id: 'ASC' },
    });
  }

  async findByCuentaYPeriodo(
    cuentaContableId: number,
    periodoContableId: number,
  ): Promise<SaldoCuenta | null> {
    return this.saldoCuentaRepository.findOne({
      where: {
        cuenta_contable_id: cuentaContableId,
        periodo_contable_id: periodoContableId,
      },
    });
  }
}
