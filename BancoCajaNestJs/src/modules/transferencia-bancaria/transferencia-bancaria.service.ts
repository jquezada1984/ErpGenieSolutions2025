import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferenciaBancaria } from './entities/transferencia-bancaria.entity';

@Injectable()
export class TransferenciaBancariaService {
  constructor(
    @InjectRepository(TransferenciaBancaria)
    private readonly transfRepo: Repository<TransferenciaBancaria>,
  ) {}

  findByEmpresa(
    id_empresa?: string,
    soloActivos = true,
  ): Promise<TransferenciaBancaria[]> {
    const where: Record<string, unknown> = {};
    if (id_empresa) where.id_empresa = id_empresa;
    if (soloActivos) where.estado = true;
    return this.transfRepo.find({
      where,
      relations: ['cuentaOrigen', 'cuentaOrigen.banco', 'cuentaDestino', 'cuentaDestino.banco'],
      order: { fecha_movimiento: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id_transferencia_bancaria: string): Promise<TransferenciaBancaria> {
    const transf = await this.transfRepo.findOne({
      where: { id_transferencia_bancaria },
      relations: ['cuentaOrigen', 'cuentaOrigen.banco', 'cuentaDestino', 'cuentaDestino.banco'],
    });
    if (!transf) throw new NotFoundException('Transferencia bancaria no encontrada');
    return transf;
  }
}
