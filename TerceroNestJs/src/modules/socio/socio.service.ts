import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolSocio } from './entities/rol-socio.entity';
import { Socio } from './entities/socio.entity';

export interface TerceroDisponibleSocio {
  id_tercero: string;
  nombre: string;
}

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(RolSocio)
    private readonly rolSocioRepo: Repository<RolSocio>,
    @InjectRepository(Socio)
    private readonly socioRepo: Repository<Socio>,
  ) {}

  async findAllSocios(id_empresa?: string): Promise<Socio[]> {
    const qb = this.socioRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.rol_socio', 'rol_socio')
      .orderBy('s.created_at', 'DESC');

    if (id_empresa) {
      qb.innerJoin('s.socioTerceros', 'st')
        .innerJoin('st.tercero', 't')
        .where('t.id_empresa = :id_empresa', { id_empresa })
        .distinct(true);
    }

    return qb.getMany();
  }

  async findRolesSocio(): Promise<RolSocio[]> {
    return this.rolSocioRepo.find({
      where: { estado: true },
      order: { nombre: 'ASC' },
    });
  }

  async findTercerosDisponiblesParaSocio(
    id_empresa: string,
    id_socio?: string | null,
  ): Promise<TerceroDisponibleSocio[]> {
    const qb = this.rolSocioRepo.manager
      .createQueryBuilder()
      .select('t.id_tercero', 'id_tercero')
      .addSelect('t.nombre', 'nombre')
      .from('tercero', 't')
      .where('t.estado = true')
      .andWhere('t.id_empresa = :id_empresa', { id_empresa })
      .andWhere(
        `(NOT EXISTS (
          SELECT 1
          FROM socio_tercero st
          WHERE st.id_tercero = t.id_tercero
        )
        OR (
          (:id_socio)::uuid IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM socio_tercero st
            WHERE st.id_tercero = t.id_tercero
              AND st.id_socio = (:id_socio)::uuid
          )
        ))`,
        { id_socio: id_socio ?? null },
      )
      .orderBy('t.nombre', 'ASC');

    return qb.getRawMany<TerceroDisponibleSocio>();
  }
}
