import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { InventarioListado } from './objects/inventario-listado.object';
import { InventarioDetalle } from './objects/inventario-detalle.object';

function coalesceBool(raw: unknown): boolean | null {
  if (raw == null) return null;
  if (raw === true || raw === 1 || raw === '1') return true;
  if (raw === false || raw === 0 || raw === '0') return false;
  const s = String(raw).toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return null;
}

function toIsoString(raw: unknown): string | null {
  if (raw == null) return null;
  if (raw instanceof Date) return raw.toISOString();
  const s = String(raw).trim();
  return s || null;
}

function toIdString(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s || null;
}

export interface InventariosListadoFiltros {
  id_empresa?: string;
  /** Si viene informado, devuelve como máximo la fila de ese inventario (UUID). */
  id_inventario?: string;
  inventario_ref?: string;
  etiqueta?: string;
  warehouse?: string;
  id_almacen?: string;
  product?: string;
  estado_inventario?: string;
}

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  async inventariosListado(f: InventariosListadoFiltros): Promise<InventarioListado[]> {
    const qb = this.inventarioRepo
      .createQueryBuilder('inv')
      .leftJoin('almacen', 'alm', 'alm.id_almacen = inv.id_almacen')
      .select('inv.id_inventario', 'id_inventario')
      .addSelect('inv.id_empresa', 'id_empresa')
      .addSelect('inv.inventario_ref', 'inventario_ref')
      .addSelect('inv.etiqueta', 'etiqueta')
      .addSelect('inv.id_almacen', 'id_almacen')
      .addSelect(`COALESCE(alm.nombre, '')`, 'almacen')
      .addSelect('inv.observacion', 'observacion')
      .addSelect('inv.estado_inventario', 'estado_inventario')
      .addSelect('inv.estado', 'estado')
      .addSelect('0', 'product')
      .orderBy('inv.etiqueta', 'ASC');

    if (f.id_inventario?.trim()) {
      qb.andWhere('inv.id_inventario = :idInv', { idInv: f.id_inventario.trim() });
    }
    if (f.id_empresa?.trim()) {
      qb.andWhere('inv.id_empresa = :idEmp', { idEmp: f.id_empresa.trim() });
    }
    if (f.inventario_ref?.trim()) {
      qb.andWhere('LOWER(inv.inventario_ref) LIKE LOWER(:ref)', {
        ref: `%${f.inventario_ref.trim()}%`,
      });
    }
    if (f.etiqueta?.trim()) {
      qb.andWhere('LOWER(inv.etiqueta) LIKE LOWER(:et)', {
        et: `%${f.etiqueta.trim()}%`,
      });
    }
    if (f.warehouse?.trim()) {
      qb.andWhere('LOWER(COALESCE(alm.nombre, \'\')) LIKE LOWER(:almNom)', {
        almNom: `%${f.warehouse.trim()}%`,
      });
    }
    if (f.id_almacen?.trim()) {
      qb.andWhere('inv.id_almacen = :idAlm', { idAlm: f.id_almacen.trim() });
    }
    if (f.estado_inventario?.trim()) {
      qb.andWhere('UPPER(inv.estado_inventario) = UPPER(:estInv)', {
        estInv: f.estado_inventario.trim(),
      });
    }
    if (f.product?.trim()) {
      qb.andWhere(`'0' LIKE :prod`, { prod: `%${f.product.trim()}%` });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_inventario: String(r.id_inventario),
      id_empresa: r.id_empresa == null ? null : String(r.id_empresa),
      inventario_ref: r.inventario_ref == null ? null : String(r.inventario_ref),
      etiqueta: r.etiqueta == null ? null : String(r.etiqueta),
      id_almacen: r.id_almacen == null ? null : String(r.id_almacen),
      almacen: r.almacen == null ? null : String(r.almacen),
      observacion: r.observacion == null ? null : String(r.observacion),
      product: Number(r.product ?? 0) || 0,
      estado_inventario: r.estado_inventario == null ? null : String(r.estado_inventario),
      estado:
        r.estado == null
          ? null
          : r.estado === true || r.estado === 1 || r.estado === '1' || String(r.estado).toLowerCase() === 'true',
    }));
  }

  /** Detalle por id; si se informa id_empresa, limita a esa empresa (multi-tenant). */
  async inventarioPorId(
    id_inventario: string,
    id_empresa?: string,
  ): Promise<InventarioDetalle | null> {
    const id = id_inventario?.trim();
    if (!id) return null;

    const qb = this.inventarioRepo
      .createQueryBuilder('inv')
      .leftJoin('almacen', 'alm', 'alm.id_almacen = inv.id_almacen')
      .select('inv.id_inventario', 'id_inventario')
      .addSelect('inv.id_empresa', 'id_empresa')
      .addSelect('inv.inventario_ref', 'inventario_ref')
      .addSelect('inv.etiqueta', 'etiqueta')
      .addSelect('inv.id_almacen', 'id_almacen')
      .addSelect(`COALESCE(alm.nombre, '')`, 'almacen')
      .addSelect('inv.observacion', 'observacion')
      .addSelect('inv.estado_inventario', 'estado_inventario')
      .addSelect('inv.estado', 'estado')
      .addSelect('inv.fecha_inicio', 'fecha_inicio')
      .addSelect('inv.fecha_cierre', 'fecha_cierre')
      .addSelect('inv.created_by', 'created_by')
      .addSelect('inv.created_at', 'created_at')
      .addSelect('inv.updated_by', 'updated_by')
      .addSelect('inv.updated_at', 'updated_at')
      .addSelect('0', 'product')
      .where('inv.id_inventario = :idInv', { idInv: id });

    if (id_empresa?.trim()) {
      qb.andWhere('inv.id_empresa = :idEmp', { idEmp: id_empresa.trim() });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    const r = rows[0];
    if (!r) return null;

    return {
      id_inventario: String(r.id_inventario),
      id_empresa: toIdString(r.id_empresa),
      inventario_ref: r.inventario_ref == null ? null : String(r.inventario_ref),
      etiqueta: r.etiqueta == null ? null : String(r.etiqueta),
      id_almacen: toIdString(r.id_almacen),
      almacen: r.almacen == null ? null : String(r.almacen),
      observacion: r.observacion == null ? null : String(r.observacion),
      product: Number(r.product ?? 0) || 0,
      estado_inventario: r.estado_inventario == null ? null : String(r.estado_inventario),
      estado: coalesceBool(r.estado),
      fecha_inicio: toIsoString(r.fecha_inicio),
      fecha_cierre: toIsoString(r.fecha_cierre),
      created_by: toIdString(r.created_by),
      updated_by: toIdString(r.updated_by),
      created_at: toIsoString(r.created_at),
      updated_at: toIsoString(r.updated_at),
    };
  }

  async actualizarEstadoInventario(id_inventario: string, estado: boolean): Promise<boolean> {
    const id = id_inventario?.trim();
    if (!id) return false;

    const r = await this.inventarioRepo
      .createQueryBuilder()
      .update(Inventario)
      .set({ estado, updated_at: () => 'NOW()' } as any)
      .where('id_inventario = :id', { id })
      .execute();

    return (r.affected ?? 0) > 0;
  }
}
