import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banco } from './entities/banco.entity';

@Injectable()
export class BancoService {
  constructor(
    @InjectRepository(Banco)
    private readonly bancoRepo: Repository<Banco>,
  ) {}

  findAll(soloActivos = true): Promise<Banco[]> {
    const where = soloActivos ? { estado: true } : {};
    return this.bancoRepo.find({
      where,
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id_banco: string): Promise<Banco> {
    const banco = await this.bancoRepo.findOne({ where: { id_banco } });
    if (!banco) throw new NotFoundException('Banco no encontrado');
    return banco;
  }
}
