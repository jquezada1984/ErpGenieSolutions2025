import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';

@Injectable()
export class CuentaBancariaService {
  constructor(
    @InjectRepository(CuentaBancaria)
    private readonly cuentaRepo: Repository<CuentaBancaria>,
  ) {}

  findAll(id_empresa?: string): Promise<CuentaBancaria[]> {
    const where = id_empresa ? { id_empresa } : {};
    return this.cuentaRepo.find({
      where,
      relations: ['banco'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id_cuenta_bancaria: string): Promise<CuentaBancaria> {
    const cuenta = await this.cuentaRepo.findOne({
      where: { id_cuenta_bancaria },
      relations: ['banco'],
    });
    if (!cuenta) throw new NotFoundException('Cuenta bancaria no encontrada');
    return cuenta;
  }
}
