import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiarioContable } from '../entities/diario-contable.entity';

@Injectable()
export class DiarioContableService {
  constructor(
    @InjectRepository(DiarioContable)
    private diarioContableRepository: Repository<DiarioContable>,
  ) {}

  async findAll(): Promise<DiarioContable[]> {
    return this.diarioContableRepository.find({
      where: { estado: true },
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<DiarioContable> {
    return this.diarioContableRepository.findOne({ where: { id } });
  }

  async findByEmpresa(empresaId: number): Promise<DiarioContable[]> {
    return this.diarioContableRepository.find({
      where: { empresa_id: empresaId, estado: true },
      order: { codigo: 'ASC' },
    });
  }

  async findByTipo(tipo: string): Promise<DiarioContable[]> {
    return this.diarioContableRepository.find({
      where: { tipo_diario: tipo, estado: true },
      order: { codigo: 'ASC' },
    });
  }
}
