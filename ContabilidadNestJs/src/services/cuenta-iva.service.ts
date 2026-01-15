import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaIva } from '../entities/cuenta-iva.entity';

@Injectable()
export class CuentaIvaService {
  constructor(
    @InjectRepository(CuentaIva)
    private cuentaIvaRepository: Repository<CuentaIva>,
  ) {}

  async findAll(): Promise<CuentaIva[]> {
    return this.cuentaIvaRepository.find({
      where: { estado: true },
    });
  }

  async findOne(id: number): Promise<CuentaIva> {
    return this.cuentaIvaRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<CuentaIva[]> {
    return this.cuentaIvaRepository.find({
      where: { empresa_id: empresaId, estado: true },
    });
  }

  async findByTipo(empresaId: number, tipoIva: string, porcentaje: number): Promise<CuentaIva | null> {
    return this.cuentaIvaRepository.findOne({
      where: { empresa_id: empresaId, tipo_iva: tipoIva, porcentaje, estado: true },
    });
  }
}
