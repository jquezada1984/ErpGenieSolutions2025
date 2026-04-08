import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaContable } from '../entities/cuenta-contable.entity';

@Injectable()
export class CuentaContableService {
  constructor(
    @InjectRepository(CuentaContable)
    private readonly cuentaContableRepository: Repository<CuentaContable>,
  ) {}

  /**
   * Catálogo general: cuentas activas, ordenadas por plan, nivel y código.
   * Lectura única; otros módulos (p. ej. item) consumen esta query.
   */
  async findCatalogo(): Promise<CuentaContable[]> {
    return this.cuentaContableRepository.find({
      where: { estado: true },
      order: {
        id_plan_contable: 'ASC',
        nivel: 'ASC',
        codigo: 'ASC',
      },
    });
  }
}
