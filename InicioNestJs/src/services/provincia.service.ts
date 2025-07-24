import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provincia } from '../entities/provincia.entity';

@Injectable()
export class ProvinciaService {
  constructor(
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
  ) {}

  async findAll(): Promise<Provincia[]> {
    return this.provinciaRepository.find({
      relations: ['pais'],
      order: { nombre: 'ASC' }
    });
  }

  async findByPais(idPais: string): Promise<Provincia[]> {
    return this.provinciaRepository.find({
      where: { id_pais: idPais },
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Provincia | null> {
    return this.provinciaRepository.findOne({ 
      where: { id_provincia: id },
      relations: ['pais']
    });
  }
} 