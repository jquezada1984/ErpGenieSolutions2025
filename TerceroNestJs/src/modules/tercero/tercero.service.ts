import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { Tercero } from './entities/tercero.entity';
import { CreateTerceroInput } from './dto/create-tercero.dto';
import { UpdateTerceroInput } from './dto/update-tercero.dto';

const TIPO_TERCERO_REPRESENTANTE_ID = 'ab5f5dac-d03c-42b1-92bb-97131765f213';

@Injectable()
export class TerceroService {
  constructor(
    @InjectRepository(Tercero)
    private readonly terceroRepo: Repository<Tercero>,
  ) {}

  async findAll(id_empresa?: string): Promise<Tercero[]> {
    if (!id_empresa) return [];
    return this.terceroRepo.find({
      where: { id_empresa },
      relations: ['empresa', 'tipo_tercero'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findClientes(id_empresa?: string): Promise<Tercero[]> {
    if (!id_empresa) return [];
    return this.terceroRepo.find({
      where: { cliente: true, id_empresa },
      relations: ['empresa', 'tipo_tercero'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  /** Clientes marcados como cliente=true, filtro por texto (nombre, apodo, código cliente); límite acotado. */
  async findClientesPorBusqueda(
    id_empresa: string | undefined,
    busqueda: string,
    limite: number,
  ): Promise<Tercero[]> {
    return this.findTercerosPorBusqueda(true, id_empresa, busqueda, limite);
  }

  async findProveedoresPorBusqueda(
    id_empresa: string | undefined,
    busqueda: string,
    limite: number,
  ): Promise<Tercero[]> {
    return this.findTercerosPorBusqueda(false, id_empresa, busqueda, limite);
  }

  private async findTercerosPorBusqueda(
    esCliente: boolean,
    id_empresa: string | undefined,
    busqueda: string,
    limite: number,
  ): Promise<Tercero[]> {
    const empresa = String(id_empresa || '').trim();
    if (!empresa) return [];
    const caps = Math.min(Math.max(limite, 5), 100);
    const q = busqueda.trim().toLowerCase();
    const qb = this.terceroRepo
      .createQueryBuilder('t')
      .where(esCliente ? 't.cliente = true' : 't.proveedor = true')
      .andWhere('t.id_empresa = :emp', { emp: empresa });
    if (q.length > 0) {
      const codigoCol = esCliente ? 't.codigo_cliente' : 't.codigo_proveedor';
      qb.andWhere(
        `(LOWER(t.nombre) LIKE :pat OR LOWER(COALESCE(t.apodo, '')) LIKE :pat OR LOWER(COALESCE(${codigoCol}, '')) LIKE :pat)`,
        { pat: `%${q}%` },
      );
    }
    qb.orderBy('t.nombre', 'ASC').take(caps);
    return qb.getMany();
  }

  async findOne(id_tercero: string): Promise<Tercero> {
    const tercero = await this.terceroRepo.findOne({ where: { id_tercero } });
    if (!tercero) throw new NotFoundException('Tercero no encontrado');
    return tercero;
  }

  async findRepresentantesPorEmpresa(id_empresa: string): Promise<Tercero[]> {
    return this.terceroRepo.find({
      where: {
        id_empresa,
        id_tipo_tercero: TIPO_TERCERO_REPRESENTANTE_ID
      },
      order: { nombre: 'ASC' }
    });
  }

  async create(input: CreateTerceroInput): Promise<Tercero> {
    const payload: DeepPartial<Tercero> = {
      ...input,
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
    };
    const entity = this.terceroRepo.create(payload);
    return this.terceroRepo.save(entity);
  }

  async update(input: UpdateTerceroInput): Promise<Tercero> {
    const current = await this.findOne(input.id_tercero);
    const merged: DeepPartial<Tercero> = {
      ...current,
      ...input,
      fecha_modificacion: new Date(),
    };
    await this.terceroRepo.save(merged);
    return this.findOne(input.id_tercero);
  }

  async remove(id_tercero: string): Promise<boolean> {
    const current = await this.findOne(id_tercero);
    await this.terceroRepo.remove(current);
    return true;
  }
}
