import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { MovimientoInventarioListado } from './objects/movimiento-inventario-listado.object';
import { StockPorFecha } from './objects/stock-por-fecha.object';

export interface MovimientosInventarioListadoFiltros {
  id_empresa: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  id_item?: string;
  id_almacen?: string;
  tipo_movimiento?: string;
  referencia?: string;
  estado?: boolean;
}

/** FAIL CLOSED multi-tenant: empresa no vacía tras trim. */
function empresaValida(idEmpresa: unknown): string | null {
  if (typeof idEmpresa !== 'string') return null;
  const trimmed = idEmpresa.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export interface StockPorFechaFiltros {
  id_empresa: string;
  fecha: string;
  id_almacen: string;
  id_item?: string;
}

/** Tipos que suman al físico histórico (cantidad siempre > 0 en writers). */
const TIPOS_POSITIVOS = [
  'INICIAL',
  'ENTRADA',
  'AJUSTE_POSITIVO',
  'TRF_ENTRADA',
] as const;

/** Tipos que restan del físico histórico. */
const TIPOS_NEGATIVOS = [
  'SALIDA',
  'AJUSTE_NEGATIVO',
  'TRF_SALIDA',
] as const;

const TIPOS_CONOCIDOS = [...TIPOS_POSITIVOS, ...TIPOS_NEGATIVOS];

const FECHA_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

function toIdString(raw: unknown): string | null {
  if (raw == null) return null;
  const value = String(raw).trim();
  return value || null;
}

function toNumber(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function toBool(raw: unknown): boolean | null {
  if (raw == null) return null;
  if (raw === true || raw === 1 || raw === '1') return true;
  if (raw === false || raw === 0 || raw === '0') return false;
  const value = String(raw).toLowerCase();
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

/**
 * Historial de public.movimiento_inventario.
 * Solo SELECT: no registra, actualiza, anula ni sincroniza stock.
 */
@Injectable()
export class MovimientoInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepo: Repository<MovimientoInventario>,
  ) {}

  async movimientosInventarioListado(
    f: MovimientosInventarioListadoFiltros,
  ): Promise<MovimientoInventarioListado[]> {
    const idEmp = empresaValida(f.id_empresa);
    if (!idEmp) return [];

    const qb = this.movimientoRepo
      .createQueryBuilder('mov')
      .leftJoin('item', 'it', 'it.id_item = mov.id_item')
      .leftJoin('almacen', 'almOri', 'almOri.id_almacen = mov.id_almacen')
      .leftJoin(
        'almacen',
        'almDest',
        'almDest.id_almacen = mov.id_almacen_destino',
      )
      .select('mov.id_movimiento_inventario', 'id_movimiento_inventario')
      .addSelect('mov.id_empresa', 'id_empresa')
      .addSelect('mov.fecha_movimiento', 'fecha_movimiento')
      .addSelect('mov.id_item', 'id_item')
      .addSelect('it.producto_ref', 'producto_ref')
      .addSelect('it.etiqueta', 'etiqueta')
      .addSelect('mov.id_almacen', 'id_almacen')
      .addSelect('almOri.nombre', 'almacen_origen')
      .addSelect('mov.id_almacen_destino', 'id_almacen_destino')
      .addSelect('almDest.nombre', 'almacen_destino')
      .addSelect('mov.tipo_movimiento', 'tipo_movimiento')
      .addSelect('mov.referencia', 'referencia')
      .addSelect('mov.concepto', 'concepto')
      .addSelect('mov.cantidad', 'cantidad')
      .addSelect('mov.modulo_origen', 'modulo_origen')
      .addSelect('mov.estado', 'estado')
      .where('mov.id_empresa = :idEmp', { idEmp })
      .orderBy('mov.fecha_movimiento', 'DESC');
    if (f.fecha_desde?.trim()) {
      qb.andWhere('mov.fecha_movimiento >= :fechaDesde', {
        fechaDesde: f.fecha_desde.trim(),
      });
    }
    if (f.fecha_hasta?.trim()) {
      qb.andWhere('mov.fecha_movimiento <= :fechaHasta', {
        fechaHasta: f.fecha_hasta.trim(),
      });
    }
    if (f.id_item?.trim()) {
      qb.andWhere('mov.id_item = :idItem', { idItem: f.id_item.trim() });
    }
    // V1: filtro solo por almacén origen/principal, no por destino.
    if (f.id_almacen?.trim()) {
      qb.andWhere('mov.id_almacen = :idAlmacen', {
        idAlmacen: f.id_almacen.trim(),
      });
    }
    if (f.tipo_movimiento?.trim()) {
      qb.andWhere('mov.tipo_movimiento = :tipoMovimiento', {
        tipoMovimiento: f.tipo_movimiento.trim(),
      });
    }
    if (f.referencia?.trim()) {
      qb.andWhere(
        'LOWER(COALESCE(mov.referencia, \'\')) LIKE LOWER(:referencia)',
        { referencia: `%${f.referencia.trim()}%` },
      );
    }
    if (typeof f.estado === 'boolean') {
      qb.andWhere('mov.estado = :estado', { estado: f.estado });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((row) => ({
      id_movimiento_inventario: String(row.id_movimiento_inventario),
      id_empresa: String(row.id_empresa),
      fecha_movimiento:
        row.fecha_movimiento == null ? null : String(row.fecha_movimiento),
      id_item: String(row.id_item),
      producto_ref:
        row.producto_ref == null ? null : String(row.producto_ref),
      etiqueta: row.etiqueta == null ? null : String(row.etiqueta),
      id_almacen: toIdString(row.id_almacen),
      almacen_origen:
        row.almacen_origen == null ? null : String(row.almacen_origen),
      id_almacen_destino: toIdString(row.id_almacen_destino),
      almacen_destino:
        row.almacen_destino == null ? null : String(row.almacen_destino),
      tipo_movimiento:
        row.tipo_movimiento == null ? null : String(row.tipo_movimiento),
      referencia: row.referencia == null ? null : String(row.referencia),
      concepto: row.concepto == null ? null : String(row.concepto),
      cantidad: toNumber(row.cantidad),
      modulo_origen:
        row.modulo_origen == null ? null : String(row.modulo_origen),
      estado: toBool(row.estado),
    }));
  }

  /**
   * Reconstruye stock_fisico a una fecha de corte desde movimiento_inventario.
   * Solo lectura. Sin reservado/disponible/virtual/costos.
   * Devuelve únicamente items con historial (tipos conocidos) hasta la fecha.
   */
  async stockPorFecha(f: StockPorFechaFiltros): Promise<StockPorFecha[]> {
    const idEmpresa = f.id_empresa?.trim();
    const idAlmacen = f.id_almacen?.trim();
    const fecha = f.fecha?.trim();
    if (!idEmpresa || !idAlmacen || !fecha) return [];
    if (!FECHA_YYYY_MM_DD.test(fecha)) return [];

    const qb = this.movimientoRepo
      .createQueryBuilder('mov')
      .innerJoin(
        'item',
        'it',
        'it.id_item = mov.id_item AND it.id_empresa = :idEmpresa',
        { idEmpresa },
      )
      .innerJoin(
        'almacen',
        'alm',
        'alm.id_almacen = mov.id_almacen AND alm.id_empresa = :idEmpresa',
      )
      .select('mov.id_empresa', 'id_empresa')
      .addSelect('mov.id_item', 'id_item')
      .addSelect('it.producto_ref', 'producto_ref')
      .addSelect('it.etiqueta', 'etiqueta')
      .addSelect('mov.id_almacen', 'id_almacen')
      .addSelect('alm.almacen_ref', 'almacen_ref')
      .addSelect('alm.nombre', 'almacen_nombre')
      .addSelect(
        `COALESCE(SUM(CASE
          WHEN mov.tipo_movimiento IN ('INICIAL','ENTRADA','AJUSTE_POSITIVO','TRF_ENTRADA')
            THEN mov.cantidad
          WHEN mov.tipo_movimiento IN ('SALIDA','AJUSTE_NEGATIVO','TRF_SALIDA')
            THEN -mov.cantidad
          ELSE NULL
        END), 0)`,
        'stock_fisico',
      )
      .where('mov.id_empresa = :idEmpresa', { idEmpresa })
      .andWhere('mov.id_almacen = :idAlmacen', { idAlmacen })
      .andWhere('mov.fecha_movimiento <= :fecha', { fecha })
      .andWhere('mov.estado = true')
      .andWhere('mov.tipo_movimiento IN (:...tipos)', {
        tipos: TIPOS_CONOCIDOS,
      })
      .groupBy('mov.id_empresa')
      .addGroupBy('mov.id_item')
      .addGroupBy('it.producto_ref')
      .addGroupBy('it.etiqueta')
      .addGroupBy('mov.id_almacen')
      .addGroupBy('alm.almacen_ref')
      .addGroupBy('alm.nombre')
      .orderBy('it.producto_ref', 'ASC');

    if (f.id_item?.trim()) {
      qb.andWhere('mov.id_item = :idItem', { idItem: f.id_item.trim() });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((row) => ({
      id_empresa: String(row.id_empresa),
      id_item: String(row.id_item),
      producto_ref:
        row.producto_ref == null ? null : String(row.producto_ref),
      etiqueta: row.etiqueta == null ? null : String(row.etiqueta),
      id_almacen: String(row.id_almacen),
      almacen_ref:
        row.almacen_ref == null ? null : String(row.almacen_ref),
      almacen_nombre:
        row.almacen_nombre == null ? null : String(row.almacen_nombre),
      fecha,
      stock_fisico: toNumber(row.stock_fisico) ?? 0,
    }));
  }
}
