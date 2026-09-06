import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { AlmacenEntity } from './entities/almacen.entity';
import { StockItemAlmacen } from './entities/stock-item-almacen.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { TransferenciaStock } from './entities/transferencia-stock.entity';
import { CambioMasivoStock } from './entities/cambio-masivo-stock.entity';
import { InventarioDetalleLinea } from './entities/inventario-detalle-linea.entity';
import { ItemLoteSerie } from './entities/item-lote-serie.entity';
import { InventarioListado } from './objects/inventario-listado.object';
import { InventarioDetalle } from './objects/inventario-detalle.object';
import {
  AlmacenListado,
  StockListado,
  MovimientoListado,
  TransferenciaListado,
  CambioMasivoListado,
  InventarioLineaListado,
  LoteSerieListado,
  StockAFechaListado,
  StockReposicionListado,
  StockValoracionListado,
} from './objects/stock-kardex.object';

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

function toNum(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export interface InventariosListadoFiltros {
  id_empresa?: string;
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
    @InjectRepository(AlmacenEntity)
    private readonly almacenRepo: Repository<AlmacenEntity>,
    @InjectRepository(StockItemAlmacen)
    private readonly stockRepo: Repository<StockItemAlmacen>,
    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepo: Repository<MovimientoInventario>,
    @InjectRepository(TransferenciaStock)
    private readonly transferenciaRepo: Repository<TransferenciaStock>,
    @InjectRepository(CambioMasivoStock)
    private readonly cambioMasivoRepo: Repository<CambioMasivoStock>,
    @InjectRepository(InventarioDetalleLinea)
    private readonly inventarioDetalleRepo: Repository<InventarioDetalleLinea>,
    @InjectRepository(ItemLoteSerie)
    private readonly loteRepo: Repository<ItemLoteSerie>,
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
      qb.andWhere(`LOWER(COALESCE(alm.nombre, '')) LIKE LOWER(:almNom)`, {
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

  async almacenesPorEmpresa(id_empresa?: string, soloActivos = true): Promise<AlmacenListado[]> {
    const qb = this.almacenRepo
      .createQueryBuilder('a')
      .orderBy('a.nombre', 'ASC');
    if (id_empresa?.trim()) {
      qb.andWhere('a.id_empresa = :idEmp', { idEmp: id_empresa.trim() });
    }
    if (soloActivos) {
      qb.andWhere('a.estado = true');
    }
    const rows = await qb.getMany();
    return rows.map((a) => ({
      id_almacen: a.id_almacen,
      id_empresa: a.id_empresa,
      almacen_ref: a.almacen_ref,
      nombre: a.nombre,
      descripcion: a.descripcion ?? null,
      direccion: a.direccion ?? null,
      codigo_postal: a.codigo_postal ?? null,
      poblacion: a.poblacion ?? null,
      id_pais: a.id_pais ?? null,
      id_provincia: a.id_provincia ?? null,
      telefono: a.telefono ?? null,
      estado: a.estado ?? null,
    }));
  }

  async stockPorEmpresa(opts: {
    id_empresa?: string;
    id_almacen?: string;
    id_item?: string;
    referencia?: string;
    etiqueta?: string;
  }): Promise<StockListado[]> {
    const qb = this.stockRepo
      .createQueryBuilder('s')
      .leftJoin('item', 'i', 'i.id_item = s.id_item')
      .leftJoin('almacen', 'a', 'a.id_almacen = s.id_almacen')
      .select('s.id_stock_producto_almacen', 'id_stock_producto_almacen')
      .addSelect('s.id_empresa', 'id_empresa')
      .addSelect('s.id_item', 'id_item')
      .addSelect('s.id_almacen', 'id_almacen')
      .addSelect('i.producto_ref', 'producto_ref')
      .addSelect('i.etiqueta', 'etiqueta')
      .addSelect('a.nombre', 'almacen_nombre')
      .addSelect('s.stock_fisico', 'stock_fisico')
      .addSelect('s.stock_reservado', 'stock_reservado')
      .addSelect('s.stock_virtual', 'stock_virtual')
      .addSelect('s.stock_disponible', 'stock_disponible')
      .addSelect('s.stock_alerta', 'stock_alerta')
      .addSelect('s.stock_deseado', 'stock_deseado')
      .addSelect('s.estado', 'estado')
      .orderBy('i.producto_ref', 'ASC');

    if (opts.id_empresa?.trim()) {
      qb.andWhere('s.id_empresa = :idEmp', { idEmp: opts.id_empresa.trim() });
    }
    if (opts.id_almacen?.trim()) {
      qb.andWhere('s.id_almacen = :idAlm', { idAlm: opts.id_almacen.trim() });
    }
    if (opts.id_item?.trim()) {
      qb.andWhere('s.id_item = :idItem', { idItem: opts.id_item.trim() });
    }
    if (opts.referencia?.trim()) {
      qb.andWhere('LOWER(i.producto_ref) LIKE LOWER(:ref)', {
        ref: `%${opts.referencia.trim()}%`,
      });
    }
    if (opts.etiqueta?.trim()) {
      qb.andWhere('LOWER(COALESCE(i.etiqueta, \'\')) LIKE LOWER(:et)', {
        et: `%${opts.etiqueta.trim()}%`,
      });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_stock_producto_almacen: String(r.id_stock_producto_almacen),
      id_empresa: toIdString(r.id_empresa),
      id_item: toIdString(r.id_item),
      id_almacen: toIdString(r.id_almacen),
      producto_ref: r.producto_ref == null ? null : String(r.producto_ref),
      etiqueta: r.etiqueta == null ? null : String(r.etiqueta),
      almacen_nombre: r.almacen_nombre == null ? null : String(r.almacen_nombre),
      stock_fisico: toNum(r.stock_fisico),
      stock_reservado: toNum(r.stock_reservado),
      stock_virtual: toNum(r.stock_virtual),
      stock_disponible: toNum(r.stock_disponible),
      stock_alerta: toNum(r.stock_alerta),
      stock_deseado: toNum(r.stock_deseado),
      estado: coalesceBool(r.estado),
    }));
  }

  async movimientosInventario(opts: {
    id_empresa?: string;
    id_almacen?: string;
    id_item?: string;
    tipo_movimiento?: string;
    modulo_origen?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }): Promise<MovimientoListado[]> {
    const qb = this.movimientoRepo
      .createQueryBuilder('m')
      .leftJoin('item', 'i', 'i.id_item = m.id_item')
      .leftJoin('almacen', 'a', 'a.id_almacen = m.id_almacen')
      .select('m.id_movimiento_inventario', 'id_movimiento_inventario')
      .addSelect('m.id_empresa', 'id_empresa')
      .addSelect('m.id_item', 'id_item')
      .addSelect('i.producto_ref', 'producto_ref')
      .addSelect('i.etiqueta', 'etiqueta')
      .addSelect('m.tipo_movimiento', 'tipo_movimiento')
      .addSelect('m.cantidad', 'cantidad')
      .addSelect('m.costo_unitario', 'costo_unitario')
      .addSelect('m.costo_total', 'costo_total')
      .addSelect('m.fecha_movimiento', 'fecha_movimiento')
      .addSelect('m.referencia', 'referencia')
      .addSelect('m.concepto', 'concepto')
      .addSelect('m.id_almacen', 'id_almacen')
      .addSelect('a.nombre', 'almacen_nombre')
      .addSelect('m.modulo_origen', 'modulo_origen')
      .addSelect('m.id_origen', 'id_origen')
      .addSelect('m.id_asiento_contable', 'id_asiento_contable')
      .where('m.estado = true')
      .orderBy('m.fecha_movimiento', 'DESC')
      .addOrderBy('m.created_at', 'DESC')
      .limit(500);

    if (opts.id_empresa?.trim()) {
      qb.andWhere('m.id_empresa = :idEmp', { idEmp: opts.id_empresa.trim() });
    }
    if (opts.id_almacen?.trim()) {
      qb.andWhere('m.id_almacen = :idAlm', { idAlm: opts.id_almacen.trim() });
    }
    if (opts.id_item?.trim()) {
      qb.andWhere('m.id_item = :idItem', { idItem: opts.id_item.trim() });
    }
    if (opts.tipo_movimiento?.trim()) {
      qb.andWhere('UPPER(m.tipo_movimiento) = UPPER(:tipo)', {
        tipo: opts.tipo_movimiento.trim(),
      });
    }
    if (opts.modulo_origen?.trim()) {
      qb.andWhere('UPPER(m.modulo_origen) = UPPER(:mod)', {
        mod: opts.modulo_origen.trim(),
      });
    }
    if (opts.fecha_desde?.trim()) {
      qb.andWhere('m.fecha_movimiento >= :fd', { fd: opts.fecha_desde.trim() });
    }
    if (opts.fecha_hasta?.trim()) {
      qb.andWhere('m.fecha_movimiento <= :fh', { fh: opts.fecha_hasta.trim() });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_movimiento_inventario: String(r.id_movimiento_inventario),
      id_empresa: toIdString(r.id_empresa),
      id_item: toIdString(r.id_item),
      producto_ref: r.producto_ref == null ? null : String(r.producto_ref),
      etiqueta: r.etiqueta == null ? null : String(r.etiqueta),
      tipo_movimiento: r.tipo_movimiento == null ? null : String(r.tipo_movimiento),
      cantidad: toNum(r.cantidad),
      costo_unitario: toNum(r.costo_unitario),
      costo_total: toNum(r.costo_total),
      fecha_movimiento: toIsoString(r.fecha_movimiento)?.slice(0, 10) ?? null,
      referencia: r.referencia == null ? null : String(r.referencia),
      concepto: r.concepto == null ? null : String(r.concepto),
      id_almacen: toIdString(r.id_almacen),
      almacen_nombre: r.almacen_nombre == null ? null : String(r.almacen_nombre),
      modulo_origen: r.modulo_origen == null ? null : String(r.modulo_origen),
      id_origen: toIdString(r.id_origen),
      id_asiento_contable: toIdString(r.id_asiento_contable),
    }));
  }

  async transferenciasStock(id_empresa?: string): Promise<TransferenciaListado[]> {
    const qb = this.transferenciaRepo
      .createQueryBuilder('t')
      .leftJoin('almacen', 'ao', 'ao.id_almacen = t.id_almacen_origen')
      .leftJoin('almacen', 'ad', 'ad.id_almacen = t.id_almacen_destino')
      .select('t.id_transferencia_stock', 'id_transferencia_stock')
      .addSelect('t.id_empresa', 'id_empresa')
      .addSelect('t.transferencia_ref', 'transferencia_ref')
      .addSelect('t.id_almacen_origen', 'id_almacen_origen')
      .addSelect('t.id_almacen_destino', 'id_almacen_destino')
      .addSelect('ao.nombre', 'almacen_origen')
      .addSelect('ad.nombre', 'almacen_destino')
      .addSelect('t.estado_transferencia', 'estado_transferencia')
      .addSelect('t.fecha_transferencia', 'fecha_transferencia')
      .addSelect('t.observacion', 'observacion')
      .where('t.estado = true')
      .orderBy('t.fecha_transferencia', 'DESC');

    if (id_empresa?.trim()) {
      qb.andWhere('t.id_empresa = :idEmp', { idEmp: id_empresa.trim() });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_transferencia_stock: String(r.id_transferencia_stock),
      id_empresa: toIdString(r.id_empresa),
      transferencia_ref: r.transferencia_ref == null ? null : String(r.transferencia_ref),
      id_almacen_origen: toIdString(r.id_almacen_origen),
      id_almacen_destino: toIdString(r.id_almacen_destino),
      almacen_origen: r.almacen_origen == null ? null : String(r.almacen_origen),
      almacen_destino: r.almacen_destino == null ? null : String(r.almacen_destino),
      estado_transferencia: r.estado_transferencia == null ? null : String(r.estado_transferencia),
      fecha_transferencia: toIsoString(r.fecha_transferencia),
      observacion: r.observacion == null ? null : String(r.observacion),
    }));
  }

  async cambiosMasivosStock(id_empresa?: string): Promise<CambioMasivoListado[]> {
    const qb = this.cambioMasivoRepo
      .createQueryBuilder('c')
      .leftJoin('almacen', 'a', 'a.id_almacen = c.id_almacen')
      .select('c.id_cambio_masivo_stock', 'id_cambio_masivo_stock')
      .addSelect('c.id_empresa', 'id_empresa')
      .addSelect('c.id_almacen', 'id_almacen')
      .addSelect('a.nombre', 'almacen_nombre')
      .addSelect('c.referencia', 'referencia')
      .addSelect('c.concepto', 'concepto')
      .addSelect('c.fecha_movimiento', 'fecha_movimiento')
      .addSelect('c.estado_operacion', 'estado_operacion')
      .where('c.estado = true')
      .orderBy('c.fecha_movimiento', 'DESC');

    if (id_empresa?.trim()) {
      qb.andWhere('c.id_empresa = :idEmp', { idEmp: id_empresa.trim() });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_cambio_masivo_stock: String(r.id_cambio_masivo_stock),
      id_empresa: toIdString(r.id_empresa),
      id_almacen: toIdString(r.id_almacen),
      almacen_nombre: r.almacen_nombre == null ? null : String(r.almacen_nombre),
      referencia: r.referencia == null ? null : String(r.referencia),
      concepto: r.concepto == null ? null : String(r.concepto),
      fecha_movimiento: toIsoString(r.fecha_movimiento)?.slice(0, 10) ?? null,
      estado_operacion: r.estado_operacion == null ? null : String(r.estado_operacion),
    }));
  }

  async inventarioLineas(id_inventario: string, id_empresa?: string): Promise<InventarioLineaListado[]> {
    const id = id_inventario?.trim();
    if (!id) return [];
    const qb = this.inventarioDetalleRepo
      .createQueryBuilder('d')
      .innerJoin('inventario', 'inv', 'inv.id_inventario = d.id_inventario')
      .leftJoin('item', 'i', 'i.id_item = d.id_item')
      .select('d.id_inventario_detalle', 'id_inventario_detalle')
      .addSelect('d.id_inventario', 'id_inventario')
      .addSelect('d.id_item', 'id_item')
      .addSelect('i.producto_ref', 'producto_ref')
      .addSelect('i.etiqueta', 'etiqueta')
      .addSelect('d.stock_sistema', 'stock_sistema')
      .addSelect('d.stock_contado', 'stock_contado')
      .addSelect('d.diferencia', 'diferencia')
      .addSelect('d.observacion', 'observacion')
      .where('d.id_inventario = :id', { id })
      .andWhere('d.estado = true');
    if (id_empresa?.trim()) {
      qb.andWhere('inv.id_empresa = :idEmp', { idEmp: id_empresa.trim() });
    }
    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_inventario_detalle: String(r.id_inventario_detalle),
      id_inventario: toIdString(r.id_inventario),
      id_item: toIdString(r.id_item),
      producto_ref: r.producto_ref == null ? null : String(r.producto_ref),
      etiqueta: r.etiqueta == null ? null : String(r.etiqueta),
      stock_sistema: toNum(r.stock_sistema),
      stock_contado: toNum(r.stock_contado),
      diferencia: toNum(r.diferencia),
      observacion: r.observacion == null ? null : String(r.observacion),
    }));
  }

  async lotesSerie(opts: {
    id_empresa?: string;
    id_almacen?: string;
    id_item?: string;
  }): Promise<LoteSerieListado[]> {
    const qb = this.loteRepo
      .createQueryBuilder('l')
      .leftJoin('item', 'i', 'i.id_item = l.id_item')
      .leftJoin('almacen', 'a', 'a.id_almacen = l.id_almacen')
      .select('l.id_lote_serie', 'id_lote_serie')
      .addSelect('l.id_empresa', 'id_empresa')
      .addSelect('l.id_item', 'id_item')
      .addSelect('l.id_almacen', 'id_almacen')
      .addSelect('i.producto_ref', 'producto_ref')
      .addSelect('i.etiqueta', 'etiqueta')
      .addSelect('a.nombre', 'almacen_nombre')
      .addSelect('l.codigo_lote_serie', 'codigo_lote_serie')
      .addSelect('l.cantidad_actual', 'cantidad_actual')
      .addSelect('l.fecha_caducidad', 'fecha_caducidad')
      .addSelect('l.fecha_limite_venta', 'fecha_limite_venta')
      .addSelect('l.observacion', 'observacion')
      .addSelect('l.estado', 'estado')
      .where('l.estado = true')
      .orderBy('l.codigo_lote_serie', 'ASC');
    if (opts.id_empresa?.trim()) {
      qb.andWhere('l.id_empresa = :idEmp', { idEmp: opts.id_empresa.trim() });
    }
    if (opts.id_almacen?.trim()) {
      qb.andWhere('l.id_almacen = :idAlm', { idAlm: opts.id_almacen.trim() });
    }
    if (opts.id_item?.trim()) {
      qb.andWhere('l.id_item = :idItem', { idItem: opts.id_item.trim() });
    }
    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_lote_serie: String(r.id_lote_serie),
      id_empresa: toIdString(r.id_empresa),
      id_item: toIdString(r.id_item),
      id_almacen: toIdString(r.id_almacen),
      producto_ref: r.producto_ref == null ? null : String(r.producto_ref),
      etiqueta: r.etiqueta == null ? null : String(r.etiqueta),
      almacen_nombre: r.almacen_nombre == null ? null : String(r.almacen_nombre),
      codigo_lote_serie: r.codigo_lote_serie == null ? null : String(r.codigo_lote_serie),
      cantidad_actual: toNum(r.cantidad_actual),
      fecha_caducidad: toIsoString(r.fecha_caducidad)?.slice(0, 10) ?? null,
      fecha_limite_venta: toIsoString(r.fecha_limite_venta)?.slice(0, 10) ?? null,
      observacion: r.observacion == null ? null : String(r.observacion),
      estado: coalesceBool(r.estado),
    }));
  }

  async stockAFecha(
    id_empresa: string,
    fecha: string,
    id_almacen?: string,
    id_item?: string,
  ): Promise<StockAFechaListado[]> {
    if (!id_empresa?.trim() || !fecha?.trim()) return [];
    const rows = await this.stockRepo.manager.query(
      `SELECT * FROM sp_stock_a_fecha($1::uuid, $2::date, $3::uuid, $4::uuid)`,
      [
        id_empresa.trim(),
        fecha.trim(),
        id_almacen?.trim() || null,
        id_item?.trim() || null,
      ],
    );
    const raw = rows?.[0]?.sp_stock_a_fecha ?? rows?.[0]?.['sp_stock_a_fecha'] ?? rows;
    const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw) : raw || [];
    return (list as any[]).map((r) => ({
      id_item: r.id_item ?? null,
      producto_ref: r.producto_ref ?? null,
      etiqueta: r.etiqueta ?? null,
      id_almacen: r.id_almacen ?? null,
      almacen_nombre: r.almacen_nombre ?? null,
      stock_a_fecha: toNum(r.stock_a_fecha),
    }));
  }

  async stockReposicion(id_empresa: string, id_almacen?: string): Promise<StockReposicionListado[]> {
    if (!id_empresa?.trim()) return [];
    const rows = await this.stockRepo.manager.query(
      `SELECT * FROM sp_stock_reposicion($1::uuid, $2::uuid)`,
      [id_empresa.trim(), id_almacen?.trim() || null],
    );
    const raw = rows?.[0]?.sp_stock_reposicion ?? rows?.[0]?.['sp_stock_reposicion'] ?? rows;
    const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw) : raw || [];
    return (list as any[]).map((r) => ({
      id_stock_producto_almacen: r.id_stock_producto_almacen ?? null,
      id_item: r.id_item ?? null,
      producto_ref: r.producto_ref ?? null,
      etiqueta: r.etiqueta ?? null,
      id_almacen: r.id_almacen ?? null,
      almacen_nombre: r.almacen_nombre ?? null,
      stock_fisico: toNum(r.stock_fisico),
      umbral_alerta: toNum(r.umbral_alerta),
      stock_deseado: toNum(r.stock_deseado),
      faltante: toNum(r.faltante),
    }));
  }

  async stockValoracionPmp(id_empresa: string, id_almacen?: string): Promise<StockValoracionListado[]> {
    if (!id_empresa?.trim()) return [];
    const rows = await this.stockRepo.manager.query(
      `SELECT * FROM sp_stock_valoracion_pmp($1::uuid, $2::uuid)`,
      [id_empresa.trim(), id_almacen?.trim() || null],
    );
    const raw =
      rows?.[0]?.sp_stock_valoracion_pmp ?? rows?.[0]?.['sp_stock_valoracion_pmp'] ?? rows;
    const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw) : raw || [];
    return (list as any[]).map((r) => ({
      id_item: r.id_item ?? null,
      producto_ref: r.producto_ref ?? null,
      etiqueta: r.etiqueta ?? null,
      id_almacen: r.id_almacen ?? null,
      almacen_nombre: r.almacen_nombre ?? null,
      stock_fisico: toNum(r.stock_fisico),
      pmp: toNum(r.pmp),
      valor_total: toNum(r.valor_total),
    }));
  }
}
