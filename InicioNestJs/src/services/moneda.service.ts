import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moneda } from '../entities/moneda.entity';

@Injectable()
export class MonedaService {
  constructor(
    @InjectRepository(Moneda)
    private monedaRepository: Repository<Moneda>,
  ) {}

  async findAll(): Promise<Moneda[]> {
    return this.monedaRepository.find({
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Moneda | null> {
    return this.monedaRepository.findOne({ where: { id_moneda: id } });
  }
} 