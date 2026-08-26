import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Almacen } from './entities/almacen.entity';
import { StockItemAlmacen } from './entities/stock-item-almacen.entity';
import { AlmacenListado } from './objects/almacen-listado.object';
import { AlmacenDetalle } from './objects/almacen-detalle.object';
import { StockItemAlmacenDetalle } from './objects/stock-item-almacen.object';
import { StockItemAlmacenListado } from './objects/stock-item-almacen-listado.object';

export interface AlmacenesListadoFiltros {
  id_empresa: string;
  id_pais?: string;
  id_provincia?: string;
  poblacion?: string;
  almacen_ref?: string;
  nombre?: string;
  estado?: boolean;
}

/** FAIL CLOSED multi-tenant: empresa no vacía tras trim. */
function empresaValida(idEmpresa: unknown): string | null {
  if (typeof idEmpresa !== 'string') return null;
  const trimmed = idEmpresa.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export interface StockItemsAlmacenListadoFiltros {
  id_empresa: string;
  id_almacen?: string;
  id_item?: string;
  estado?: boolean;
}

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

function toNumber(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * Lectura de almacenes (listado / detalle / toggle estado).
 * Sin create/update cabecera/delete/stock/movimientos.
 */
@Injectable()
export class AlmacenService {
  constructor(
    @InjectRepository(Almacen)
    private readonly almacenRepo: Repository<Almacen>,
    @InjectRepository(StockItemAlmacen)
    private readonly stockItemAlmacenRepo: Repository<StockItemAlmacen>,
  ) {}

  /**
   * Listado real de public.almacen con LEFT JOIN a pais y provincia.
   * Nombre distinto de la query `almacenes` de InicioNestJs.
   */
  async almacenesListado(f: AlmacenesListadoFiltros): Promise<AlmacenListado[]> {
    const idEmp = empresaValida(f.id_empresa);
    if (!idEmp) return [];

    const qb = this.almacenRepo
      .createQueryBuilder('alm')
      .leftJoin('pais', 'p', 'p.id_pais = alm.id_pais')
      .leftJoin('provincia', 'pr', 'pr.id_provincia = alm.id_provincia')
      .select('alm.id_almacen', 'id_almacen')
      .addSelect('alm.id_empresa', 'id_empresa')
      .addSelect('alm.almacen_ref', 'almacen_ref')
      .addSelect('alm.nombre', 'nombre')
      .addSelect('alm.poblacion', 'poblacion')
      .addSelect('alm.id_pais', 'id_pais')
      .addSelect(`COALESCE(p.nombre, '')`, 'pais')
      .addSelect('alm.id_provincia', 'id_provincia')
      .addSelect(`COALESCE(pr.nombre, '')`, 'provincia')
      .addSelect('alm.telefono', 'telefono')
      .addSelect('alm.estado', 'estado')
      .where('alm.id_empresa = :idEmp', { idEmp })
      .orderBy('alm.almacen_ref', 'ASC')
      .addOrderBy('alm.nombre', 'ASC');
    if (f.id_pais?.trim()) {
      qb.andWhere('alm.id_pais = :idPais', { idPais: f.id_pais.trim() });
    }
    if (f.id_provincia?.trim()) {
      qb.andWhere('alm.id_provincia = :idProv', { idProv: f.id_provincia.trim() });
    }
    if (f.poblacion?.trim()) {
      qb.andWhere('LOWER(COALESCE(alm.poblacion, \'\')) LIKE LOWER(:pob)', {
        pob: `%${f.poblacion.trim()}%`,
      });
    }
    if (f.almacen_ref?.trim()) {
      qb.andWhere('LOWER(COALESCE(alm.almacen_ref, \'\')) LIKE LOWER(:ref)', {
        ref: `%${f.almacen_ref.trim()}%`,
      });
    }
    if (f.nombre?.trim()) {
      qb.andWhere('LOWER(alm.nombre) LIKE LOWER(:nom)', {
        nom: `%${f.nombre.trim()}%`,
      });
    }
    if (typeof f.estado === 'boolean') {
      qb.andWhere('alm.estado = :est', { est: f.estado });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((r) => ({
      id_almacen: String(r.id_almacen),
      id_empresa: r.id_empresa == null ? null : String(r.id_empresa),
      almacen_ref: r.almacen_ref == null ? null : String(r.almacen_ref),
      nombre: r.nombre == null ? '' : String(r.nombre),
      poblacion: r.poblacion == null ? null : String(r.poblacion),
      id_pais: r.id_pais == null ? null : String(r.id_pais),
      pais: r.pais == null || r.pais === '' ? null : String(r.pais),
      id_provincia: r.id_provincia == null ? null : String(r.id_provincia),
      provincia: r.provincia == null || r.provincia === '' ? null : String(r.provincia),
      telefono: r.telefono == null ? null : String(r.telefono),
      estado:
        r.estado == null
          ? null
          : r.estado === true ||
            r.estado === 1 ||
            r.estado === '1' ||
            String(r.estado).toLowerCase() === 'true',
    }));
  }

  /**
   * Detalle por id_almacen + id_empresa (FAIL CLOSED multi-tenant).
   * Patrón inventarioPorId.
   */
  async almacenPorId(
    id_almacen: string,
    id_empresa: string,
  ): Promise<AlmacenDetalle | null> {
    const id = id_almacen?.trim();
    const idEmp = empresaValida(id_empresa);
    if (!id || !idEmp) return null;

    const qb = this.almacenRepo
      .createQueryBuilder('alm')
      .leftJoin('pais', 'p', 'p.id_pais = alm.id_pais')
      .leftJoin('provincia', 'pr', 'pr.id_provincia = alm.id_provincia')
      .select('alm.id_almacen', 'id_almacen')
      .addSelect('alm.id_empresa', 'id_empresa')
      .addSelect('alm.almacen_ref', 'almacen_ref')
      .addSelect('alm.nombre', 'nombre')
      .addSelect('alm.descripcion', 'descripcion')
      .addSelect('alm.direccion', 'direccion')
      .addSelect('alm.codigo_postal', 'codigo_postal')
      .addSelect('alm.poblacion', 'poblacion')
      .addSelect('alm.id_pais', 'id_pais')
      .addSelect(`COALESCE(p.nombre, '')`, 'pais')
      .addSelect('alm.id_provincia', 'id_provincia')
      .addSelect(`COALESCE(pr.nombre, '')`, 'provincia')
      .addSelect('alm.telefono', 'telefono')
      .addSelect('alm.fax', 'fax')
      .addSelect('alm.created_by', 'created_by')
      .addSelect('alm.created_at', 'created_at')
      .addSelect('alm.updated_by', 'updated_by')
      .addSelect('alm.updated_at', 'updated_at')
      .addSelect('alm.estado', 'estado')
      .where('alm.id_almacen = :idAlm', { idAlm: id })
      .andWhere('alm.id_empresa = :idEmp', { idEmp });

    const rows = await qb.getRawMany<Record<string, unknown>>();
    const r = rows[0];
    if (!r) return null;

    const paisStr = r.pais == null ? '' : String(r.pais);
    const provinciaStr = r.provincia == null ? '' : String(r.provincia);

    return {
      id_almacen: String(r.id_almacen),
      id_empresa: toIdString(r.id_empresa),
      almacen_ref: r.almacen_ref == null ? null : String(r.almacen_ref),
      nombre: r.nombre == null ? '' : String(r.nombre),
      descripcion: r.descripcion == null ? null : String(r.descripcion),
      direccion: r.direccion == null ? null : String(r.direccion),
      codigo_postal: r.codigo_postal == null ? null : String(r.codigo_postal),
      poblacion: r.poblacion == null ? null : String(r.poblacion),
      id_pais: toIdString(r.id_pais),
      pais: paisStr || null,
      id_provincia: toIdString(r.id_provincia),
      provincia: provinciaStr || null,
      telefono: r.telefono == null ? null : String(r.telefono),
      fax: r.fax == null ? null : String(r.fax),
      created_by: toIdString(r.created_by),
      updated_by: toIdString(r.updated_by),
      created_at: toIsoString(r.created_at),
      updated_at: toIsoString(r.updated_at),
      estado: coalesceBool(r.estado),
    };
  }

  /**
   * Consulta puntual read-only de saldo por empresa, item y almacén.
   * Los INNER JOIN validan que item y almacén pertenezcan a la empresa
   * solicitada, porque la BD no tiene una constraint cruzada para ello.
   */
  async stockItemAlmacen(
    id_empresa: string,
    id_item: string,
    id_almacen: string,
  ): Promise<StockItemAlmacenDetalle | null> {
    const idEmpresa = id_empresa?.trim();
    const idItem = id_item?.trim();
    const idAlmacen = id_almacen?.trim();
    if (!idEmpresa || !idItem || !idAlmacen) return null;

    const row = await this.stockItemAlmacenRepo
      .createQueryBuilder('stock')
      .innerJoin(
        'item',
        'it',
        'it.id_item = stock.id_item AND it.id_empresa = :idEmpresa',
        { idEmpresa },
      )
      .innerJoin(
        'almacen',
        'alm',
        'alm.id_almacen = stock.id_almacen AND alm.id_empresa = :idEmpresa',
      )
      .select('stock.id_stock_producto_almacen', 'id_stock_producto_almacen')
      .addSelect('stock.id_empresa', 'id_empresa')
      .addSelect('stock.id_item', 'id_item')
      .addSelect('stock.id_almacen', 'id_almacen')
      .addSelect('stock.stock_fisico', 'stock_fisico')
      .addSelect('stock.stock_reservado', 'stock_reservado')
      .addSelect('stock.stock_virtual', 'stock_virtual')
      .addSelect('stock.stock_disponible', 'stock_disponible')
      .addSelect('stock.stock_alerta', 'stock_alerta')
      .addSelect('stock.stock_deseado', 'stock_deseado')
      .addSelect('stock.created_by', 'created_by')
      .addSelect('stock.updated_by', 'updated_by')
      .addSelect('stock.created_at', 'created_at')
      .addSelect('stock.updated_at', 'updated_at')
      .addSelect('stock.estado', 'estado')
      .where('stock.id_empresa = :idEmpresa', { idEmpresa })
      .andWhere('stock.id_item = :idItem', { idItem })
      .andWhere('stock.id_almacen = :idAlmacen', { idAlmacen })
      .getRawOne<Record<string, unknown>>();

    if (!row) return null;

    // GraphQL Float sigue el patrón existente de movimientos para NUMERIC.
    return {
      id_stock_producto_almacen: String(row.id_stock_producto_almacen),
      id_empresa: String(row.id_empresa),
      id_item: String(row.id_item),
      id_almacen: String(row.id_almacen),
      stock_fisico: toNumber(row.stock_fisico) ?? 0,
      stock_reservado: toNumber(row.stock_reservado) ?? 0,
      stock_virtual: toNumber(row.stock_virtual) ?? 0,
      stock_disponible: toNumber(row.stock_disponible) ?? 0,
      stock_alerta: toNumber(row.stock_alerta),
      stock_deseado: toNumber(row.stock_deseado),
      created_by: toIdString(row.created_by),
      updated_by: toIdString(row.updated_by),
      created_at: toIsoString(row.created_at) ?? '',
      updated_at: toIsoString(row.updated_at) ?? '',
      estado: coalesceBool(row.estado) ?? false,
    };
  }

  /**
   * Listado exclusivamente de filas existentes de stock_item_almacen.
   * Los INNER JOIN mantienen defensa multiempresa además de las FKs compuestas.
   */
  async stockItemsAlmacenListado(
    f: StockItemsAlmacenListadoFiltros,
  ): Promise<StockItemAlmacenListado[]> {
    const idEmpresa = f.id_empresa?.trim();
    if (!idEmpresa) return [];

    const qb = this.stockItemAlmacenRepo
      .createQueryBuilder('stock')
      .innerJoin(
        'item',
        'it',
        'it.id_item = stock.id_item AND it.id_empresa = :idEmpresa',
        { idEmpresa },
      )
      .innerJoin(
        'almacen',
        'alm',
        'alm.id_almacen = stock.id_almacen AND alm.id_empresa = :idEmpresa',
      )
      .select('stock.id_stock_producto_almacen', 'id_stock_producto_almacen')
      .addSelect('stock.id_empresa', 'id_empresa')
      .addSelect('stock.id_item', 'id_item')
      .addSelect('it.producto_ref', 'producto_ref')
      .addSelect('it.etiqueta', 'etiqueta')
      .addSelect('stock.id_almacen', 'id_almacen')
      .addSelect('alm.almacen_ref', 'almacen_ref')
      .addSelect('alm.nombre', 'almacen_nombre')
      .addSelect('stock.stock_fisico', 'stock_fisico')
      .addSelect('stock.stock_reservado', 'stock_reservado')
      .addSelect('stock.stock_virtual', 'stock_virtual')
      .addSelect('stock.stock_disponible', 'stock_disponible')
      .addSelect('stock.stock_alerta', 'stock_alerta')
      .addSelect('stock.stock_deseado', 'stock_deseado')
      .addSelect('stock.estado', 'estado')
      .where('stock.id_empresa = :idEmpresa', { idEmpresa })
      .orderBy('alm.almacen_ref', 'ASC')
      .addOrderBy('it.producto_ref', 'ASC');

    if (f.id_almacen?.trim()) {
      qb.andWhere('stock.id_almacen = :idAlmacen', {
        idAlmacen: f.id_almacen.trim(),
      });
    }
    if (f.id_item?.trim()) {
      qb.andWhere('stock.id_item = :idItem', { idItem: f.id_item.trim() });
    }
    if (typeof f.estado === 'boolean') {
      qb.andWhere('stock.estado = :estado', { estado: f.estado });
    }

    const rows = await qb.getRawMany<Record<string, unknown>>();
    return rows.map((row) => ({
      id_stock_producto_almacen: String(row.id_stock_producto_almacen),
      id_empresa: String(row.id_empresa),
      id_item: String(row.id_item),
      producto_ref:
        row.producto_ref == null ? null : String(row.producto_ref),
      etiqueta: row.etiqueta == null ? null : String(row.etiqueta),
      id_almacen: String(row.id_almacen),
      almacen_ref: row.almacen_ref == null ? null : String(row.almacen_ref),
      almacen_nombre:
        row.almacen_nombre == null ? null : String(row.almacen_nombre),
      stock_fisico: toNumber(row.stock_fisico) ?? 0,
      stock_reservado: toNumber(row.stock_reservado) ?? 0,
      stock_virtual: toNumber(row.stock_virtual) ?? 0,
      stock_disponible: toNumber(row.stock_disponible) ?? 0,
      stock_alerta: toNumber(row.stock_alerta),
      stock_deseado: toNumber(row.stock_deseado),
      estado: coalesceBool(row.estado) ?? false,
    }));
  }

  /**
   * Cambia únicamente public.almacen.estado (patrón actualizarEstadoInventario).
   * FAIL CLOSED: siempre filtra por id_almacen + id_empresa.
   */
  async actualizarEstadoAlmacen(
    id_almacen: string,
    estado: boolean,
    id_empresa: string,
  ): Promise<boolean> {
    const id = id_almacen?.trim();
    const idEmp = empresaValida(id_empresa);
    if (!id || !idEmp) return false;

    const r = await this.almacenRepo
      .createQueryBuilder()
      .update(Almacen)
      .set({ estado, updated_at: () => 'NOW()' } as any)
      .where('id_almacen = :id', { id })
      .andWhere('id_empresa = :idEmp', { idEmp })
      .execute();
    return (r.affected ?? 0) > 0;
  }
}
