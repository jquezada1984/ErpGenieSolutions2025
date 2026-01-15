import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaImpuesto } from '../entities/cuenta-impuesto.entity';

@Injectable()
export class CuentaImpuestoService {
  constructor(
    @InjectRepository(CuentaImpuesto)
    private cuentaImpuestoRepository: Repository<CuentaImpuesto>,
  ) {}

  async findAll(): Promise<CuentaImpuesto[]> {
    return this.cuentaImpuestoRepository.find({
      where: { estado: true },
    });
  }

  async findOne(id: number): Promise<CuentaImpuesto> {
    return this.cuentaImpuestoRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<CuentaImpuesto[]> {
    return this.cuentaImpuestoRepository.find({
      where: { empresa_id: empresaId, estado: true },
    });
  }

  async findByTipo(empresaId: number, tipoImpuesto: string, porcentaje: number): Promise<CuentaImpuesto | null> {
    return this.cuentaImpuestoRepository.findOne({
      where: { empresa_id: empresaId, tipo_impuesto: tipoImpuesto, porcentaje, estado: true },
    });
  }
}
