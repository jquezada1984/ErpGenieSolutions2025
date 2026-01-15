import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaContableDefecto } from '../entities/cuenta-contable-defecto.entity';

@Injectable()
export class CuentaContableDefectoService {
  constructor(
    @InjectRepository(CuentaContableDefecto)
    private cuentaDefectoRepository: Repository<CuentaContableDefecto>,
  ) {}

  async findAll(): Promise<CuentaContableDefecto[]> {
    return this.cuentaDefectoRepository.find({
      where: { estado: true },
    });
  }

  async findOne(id: number): Promise<CuentaContableDefecto> {
    return this.cuentaDefectoRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<CuentaContableDefecto[]> {
    return this.cuentaDefectoRepository.find({
      where: { empresa_id: empresaId, estado: true },
    });
  }

  async findByTipoOperacion(empresaId: number, tipoOperacion: string): Promise<CuentaContableDefecto | null> {
    return this.cuentaDefectoRepository.findOne({
      where: { empresa_id: empresaId, tipo_operacion: tipoOperacion, estado: true },
    });
  }
}
