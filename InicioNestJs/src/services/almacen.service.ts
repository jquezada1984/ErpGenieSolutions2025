import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Almacen } from '../entities/almacen.entity';

@Injectable()
export class AlmacenService {
  constructor(
    @InjectRepository(Almacen)
    private almacenRepository: Repository<Almacen>,
  ) {}

  async findAll(): Promise<Almacen[]> {
    return this.almacenRepository.find({
      select: ['id_almacen', 'almacen_ref', 'nombre'],
      order: { nombre: 'ASC' },
    });
  }
}
