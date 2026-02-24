import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Empresa } from './empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepo: Repository<Empresa>,
  ) {}

  async listarEmpresas(): Promise<Empresa[]> {
    return this.empresaRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  async empresaById(id_empresa: string): Promise<Empresa | null> {
    return this.empresaRepo.findOne({
      where: { id_empresa },
    });
  }
}
