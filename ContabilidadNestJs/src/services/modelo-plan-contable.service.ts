import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloPlanContable } from '../entities/modelo-plan-contable.entity';

@Injectable()
export class ModeloPlanContableService {
  constructor(
    @InjectRepository(ModeloPlanContable)
    private modeloRepository: Repository<ModeloPlanContable>,
  ) {}

  async findAll(): Promise<ModeloPlanContable[]> {
    return this.modeloRepository.find({
      where: { estado: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ModeloPlanContable> {
    return this.modeloRepository.findOne({ where: { id } });
  }

  async findByCodigo(codigo: string): Promise<ModeloPlanContable | null> {
    return this.modeloRepository.findOne({ where: { codigo } });
  }
}
