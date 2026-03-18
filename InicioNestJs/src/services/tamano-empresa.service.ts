import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TamanoEmpresa } from '../entities/tamano-empresa.entity';

@Injectable()
export class TamanoEmpresaService {
  constructor(
    @InjectRepository(TamanoEmpresa)
    private tamanoEmpresaRepository: Repository<TamanoEmpresa>,
  ) {}

  async findAll(): Promise<TamanoEmpresa[]> {
    return this.tamanoEmpresaRepository.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TamanoEmpresa | null> {
    return this.tamanoEmpresaRepository.findOne({ where: { id_tamano_empresa: id } });
  }
}
