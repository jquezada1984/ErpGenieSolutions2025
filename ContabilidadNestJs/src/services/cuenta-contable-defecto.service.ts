import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaContableDefecto } from '../entities/cuenta-contable-defecto.entity';
import { CATALOGO_CUENTAS_DEFECTO } from '../constants/cuentas-defecto.catalog';
import { CuentaDefectoConfigItem } from '../dto/cuenta-defecto-config.dto';

@Injectable()
export class CuentaContableDefectoService {
  constructor(
    @InjectRepository(CuentaContableDefecto)
    private readonly repo: Repository<CuentaContableDefecto>,
  ) {}

  async findCatalogoConValores(id_empresa: string): Promise<CuentaDefectoConfigItem[]> {
    const rows = await this.repo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.cuenta_contable', 'c')
      .where('d.id_empresa = :id_empresa', { id_empresa })
      .andWhere('d.estado = true')
      .getMany();

    const map = new Map(rows.map((r) => [r.tipo_operacion, r]));

    return CATALOGO_CUENTAS_DEFECTO.map((cat) => {
      const row = map.get(cat.tipo_operacion);
      return {
        tipo_operacion: cat.tipo_operacion,
        seccion: cat.seccion,
        label: cat.label,
        id_cuenta_contable_defecto: row?.id_cuenta_contable_defecto ?? null,
        id_cuenta_contable: row?.id_cuenta_contable ?? null,
        cuenta_codigo: row?.cuenta_contable?.codigo ?? null,
        cuenta_nombre: row?.cuenta_contable?.nombre ?? null,
      };
    });
  }
}
