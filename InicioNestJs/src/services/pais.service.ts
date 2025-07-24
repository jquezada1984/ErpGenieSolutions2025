import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from '../entities/pais.entity';

@Injectable()
export class PaisService {
  constructor(
    @InjectRepository(Pais)
    private paisRepository: Repository<Pais>,
  ) {}

  async findAll(): Promise<Pais[]> {
    return this.paisRepository.find({
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Pais | null> {
    return this.paisRepository.findOne({ where: { id_pais: id } });
  }
} 