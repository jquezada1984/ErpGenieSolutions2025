import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pais } from './entities/pais.entity';
import { Provincia } from './entities/provincia.entity';
import { Impuesto } from './entities/impuesto.entity';
import { CuentaContable } from './entities/cuenta-contable.entity';

@Injectable()
export class SelectsService {
  constructor(
    @InjectRepository(Pais)
    private readonly paisRepo: Repository<Pais>,

    @InjectRepository(Provincia)
    private readonly provRepo: Repository<Provincia>,

    @InjectRepository(Impuesto)
    private readonly impRepo: Repository<Impuesto>,

    @InjectRepository(CuentaContable)
    private readonly cuentaRepo: Repository<CuentaContable>,
  ) {}

  async paises() {
    const data = await this.paisRepo.find({
      select: ['id_pais', 'nombre', 'codigo_iso', 'icono'],
      order: { nombre: 'ASC' },
    });

    return { success: true, data };
  }

  async provincias(idPais: string) {
    if (!idPais) throw new BadRequestException('id_pais es requerido');

    const data = await this.provRepo.find({
      where: { id_pais: idPais },
      select: ['id_provincia', 'id_pais', 'nombre'],
      order: { nombre: 'ASC' },
    });

    return { success: true, data };
  }

  async impuestos() {
    const data = await this.impRepo.find({
      select: ['id', 'nombre', 'tasa'],
      order: { nombre: 'ASC' },
    });

    return { success: true, data };
  }

  async cuentasContables() {
    const data = await this.cuentaRepo.find({
      select: ['id_cuenta_contable', 'codigo', 'nombre'],
      order: { codigo: 'ASC' },
    });

    return { success: true, data };
  }
}
