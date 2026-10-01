import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaGasto } from './entities/categoria-gasto.entity';

@Injectable()
export class CategoriaGastoService {
  constructor(
    @InjectRepository(CategoriaGasto)
    private readonly categoriaRepo: Repository<CategoriaGasto>,
  ) {}

  /**
   * Listado por empresa. Por defecto solo activas (formularios).
   * solo_activos=false → administración (activas + inactivas).
   */
  findAll(id_empresa: string, solo_activos = true): Promise<CategoriaGasto[]> {
    const qb = this.categoriaRepo
      .createQueryBuilder('c')
      .where('c.id_empresa = :id_empresa', { id_empresa })
      .orderBy('c.nombre', 'ASC');

    if (solo_activos) {
      qb.andWhere('c.estado = true');
    }

    return qb.getMany();
  }

  /**
   * Detalle seguro: id + empresa. Si no coincide → null (NOT FOUND unificado).
   */
  findOne(
    id_categoria_gasto: string,
    id_empresa: string,
  ): Promise<CategoriaGasto | null> {
    return this.categoriaRepo.findOne({
      where: { id_categoria_gasto, id_empresa },
    });
  }
}
