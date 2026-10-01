import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gasto } from './entities/gasto.entity';

export interface GastosFiltros {
  estado_gasto?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  id_categoria_gasto?: string;
  id_tercero?: string;
}

@Injectable()
export class GastoService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepo: Repository<Gasto>,
  ) {}

  /**
   * Listado por empresa (obligatorio). Sin detalles (evita N+1).
   * Orden: fecha_gasto DESC, created_at DESC.
   * Filtros opcionales NUNCA eliminan el WHERE id_empresa.
   */
  findAll(id_empresa: string, filtros: GastosFiltros = {}): Promise<Gasto[]> {
    const qb = this.gastoRepo
      .createQueryBuilder('g')
      .where('g.id_empresa = :id_empresa', { id_empresa })
      .orderBy('g.fecha_gasto', 'DESC')
      .addOrderBy('g.created_at', 'DESC');

    if (filtros.estado_gasto) {
      qb.andWhere('g.estado_gasto = :estado_gasto', {
        estado_gasto: filtros.estado_gasto,
      });
    }
    if (filtros.fecha_desde) {
      qb.andWhere('g.fecha_gasto >= :fecha_desde', {
        fecha_desde: filtros.fecha_desde,
      });
    }
    if (filtros.fecha_hasta) {
      qb.andWhere('g.fecha_gasto <= :fecha_hasta', {
        fecha_hasta: filtros.fecha_hasta,
      });
    }
    if (filtros.id_categoria_gasto) {
      qb.andWhere('g.id_categoria_gasto = :id_categoria_gasto', {
        id_categoria_gasto: filtros.id_categoria_gasto,
      });
    }
    if (filtros.id_tercero) {
      qb.andWhere('g.id_tercero = :id_tercero', {
        id_tercero: filtros.id_tercero,
      });
    }

    return qb.getMany();
  }

  /**
   * Detalle seguro: id_gasto + id_empresa.
   * Cross-company → null (mismo comportamiento que inexistente).
   * Detalles ordenados por orden ASC, created_at ASC.
   */
  async findOne(id_gasto: string, id_empresa: string): Promise<Gasto | null> {
    const gasto = await this.gastoRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.detalles', 'd')
      .leftJoinAndSelect('g.categoria', 'c')
      .where('g.id_gasto = :id_gasto', { id_gasto })
      .andWhere('g.id_empresa = :id_empresa', { id_empresa })
      .orderBy('d.orden', 'ASC')
      .addOrderBy('d.created_at', 'ASC')
      .getOne();

    return gasto ?? null;
  }
}
