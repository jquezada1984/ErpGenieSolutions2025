import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaBancaria } from '../entities/cuenta-bancaria.entity';

@Injectable()
export class CuentaBancariaService {
  constructor(
    @InjectRepository(CuentaBancaria)
    private cuentaBancariaRepository: Repository<CuentaBancaria>,
  ) {}

  async findAll(): Promise<CuentaBancaria[]> {
    return this.cuentaBancariaRepository.find({
      where: { estado: true },
      order: { numero_cuenta: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CuentaBancaria> {
    return this.cuentaBancariaRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<CuentaBancaria[]> {
    return this.cuentaBancariaRepository.find({
      where: { empresa_id: empresaId, estado: true },
      order: { numero_cuenta: 'ASC' },
    });
  }
}
