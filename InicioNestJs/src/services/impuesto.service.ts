import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Impuesto } from '../entities/impuesto.entity';

@Injectable()
export class ImpuestoService {
  constructor(
    @InjectRepository(Impuesto)
    private impuestoRepository: Repository<Impuesto>,
  ) {}

  async findAll(): Promise<Impuesto[]> {
    return this.impuestoRepository.find({
      order: { tasa: 'ASC' },
    });
  }
}
