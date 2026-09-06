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

  async findAll(opts?: {
    id_empresa?: string;
    solo_activos?: boolean;
  }): Promise<Impuesto[]> {
    const where: Record<string, unknown> = {};
    if (opts?.id_empresa) where.id_empresa = opts.id_empresa;
    if (opts?.solo_activos) where.activo = true;
    return this.impuestoRepository.find({
      where,
      order: { tasa: 'ASC', codigo: 'ASC' },
    });
  }
}
