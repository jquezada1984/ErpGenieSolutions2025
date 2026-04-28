import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { ItemDetalleEdicion } from './objects/item-detalle-edicion.object';

export interface ItemsListadoFiltros {
  id_empresa?: string;
  producto_ref?: string;
  etiqueta?: string;
  codigo_barras?: string;
  id_estado_venta?: string;
  id_estado_compra?: string;
  /** Ej. SERVICE o PRODUCT — coincide con `tipo_item_catalogo.codigo`. */
  codigo_tipo_item?: string;
}

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  async listado(f: ItemsListadoFiltros): Promise<Item[]> {
    const qb = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.empresa', 'empresa')
      .leftJoinAndSelect('item.estadoVenta', 'estadoVenta')
      .leftJoinAndSelect('item.estadoCompra', 'estadoCompra')
      .leftJoinAndSelect('item.duracionUnidad', 'duracionUnidad')
      .orderBy('item.etiqueta', 'ASC');

    if (f.codigo_tipo_item?.trim()) {
      qb.innerJoin('item.tipoItem', 'ticFiltr').andWhere('ticFiltr.codigo = :codigoTipoItem', {
        codigoTipoItem: f.codigo_tipo_item.trim(),
      });
    }

    if (f.id_empresa?.trim()) {
      qb.andWhere('item.id_empresa = :idEmp', { idEmp: f.id_empresa.trim() });
    }
    if (f.producto_ref?.trim()) {
      qb.andWhere('LOWER(item.producto_ref) LIKE LOWER(:pr)', {
        pr: `%${f.producto_ref.trim()}%`,
      });
    }
    if (f.etiqueta?.trim()) {
      qb.andWhere('LOWER(item.etiqueta) LIKE LOWER(:et)', {
        et: `%${f.etiqueta.trim()}%`,
      });
    }
    if (f.codigo_barras?.trim()) {
      qb.andWhere('LOWER(item.codigo_barras) LIKE LOWER(:cb)', {
        cb: `%${f.codigo_barras.trim()}%`,
      });
    }
    if (f.id_estado_venta?.trim()) {
      qb.andWhere('item.id_estado_venta = :idEv', { idEv: f.id_estado_venta.trim() });
    }
    if (f.id_estado_compra?.trim()) {
      qb.andWhere('item.id_estado_compra = :idEc', { idEc: f.id_estado_compra.trim() });
    }

    return qb.getMany();
  }

  async actualizarEstado(id_item: string, estado: boolean): Promise<boolean> {
    const r = await this.itemRepo.update({ id_item }, { estado });
    return (r.affected ?? 0) > 0;
  }

  async actualizarEstadoInventario(id_inventario: string, estado: boolean): Promise<boolean> {
    const id = id_inventario?.trim();
    if (!id) return false;

    const rows: Array<{ id_inventario: string }> = await this.itemRepo.manager.query(
      `UPDATE public.inventario
       SET estado = $2, updated_at = NOW()
       WHERE id_inventario = $1::uuid
       RETURNING id_inventario`,
      [id, estado],
    );

    return Array.isArray(rows) && rows.length > 0;
  }

  private parseNum(v: unknown): number | null {
    if (v == null || v === '') return null;
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : null;
  }

  private parseStr(v: unknown): string | null {
    if (v == null || v === '') return null;
    const s = String(v).trim();
    return s === '' ? null : s;
  }

  private parseUuid(v: unknown): string | null {
    const s = this.parseStr(v);
    return s;
  }

  /** Lectura completa de fila `item` para precarga de edición (sin tocar escritura). */
  async findDetalleEdicion(id_item: string): Promise<ItemDetalleEdicion | null> {
    const id = id_item?.trim();
    if (!id) return null;

    const rows: Record<string, unknown>[] = await this.itemRepo.manager.query(
      `SELECT * FROM public.item WHERE id_item = $1::uuid LIMIT 1`,
      [id],
    );

    if (!rows?.length) return null;

    const r = rows[0];
    const d = new ItemDetalleEdicion();
    d.id_item = String(r.id_item);
    d.id_empresa = String(r.id_empresa);
    d.producto_ref = this.parseStr(r.producto_ref);
    d.etiqueta = String(r.etiqueta ?? '');
    d.estado = r.estado !== false && r.estado !== 0 && r.estado !== '0' && String(r.estado).toLowerCase() !== 'false';
    d.descripcion = this.parseStr(r.descripcion);
    d.url_publica = this.parseStr(r.url_publica);
    d.nota_interna = this.parseStr(r.nota_interna);
    if (r.inventariable === null || r.inventariable === undefined) {
      d.inventariable = true;
    } else {
      d.inventariable =
        r.inventariable === true || r.inventariable === 1 || String(r.inventariable).toLowerCase() === 'true';
    }
    d.peso = this.parseNum(r.peso);
    d.longitud = this.parseNum(r.longitud);
    d.anchura = this.parseNum(r.anchura);
    d.altura = this.parseNum(r.altura);
    d.superficie = this.parseNum(r.superficie);
    d.volumen = this.parseNum(r.volumen);
    d.nomenclatura_aduanera = this.parseStr(r.nomenclatura_aduanera);
    d.precio_venta = this.parseNum(r.precio_venta);
    d.precio_minimo = this.parseNum(r.precio_minimo);
    d.impuesto_id = this.parseStr(r.impuesto_id);
    d.precio_compra = this.parseNum(r.precio_compra);
    d.stock_minimo_alerta = this.parseNum(r.stock_minimo_alerta);
    d.stock_deseado = this.parseNum(r.stock_deseado);
    d.codigo_barras = this.parseStr(r.codigo_barras);
    d.id_pais = this.parseUuid(r.id_pais);
    d.id_provincia = this.parseUuid(r.id_provincia);
    d.poblacion = this.parseStr(r.poblacion);
    d.id_unidad_medida = this.parseUuid(r.id_unidad_medida);
    d.id_unidad_peso = this.parseUuid(r.id_unidad_peso);
    d.id_unidad_longitud = this.parseUuid(r.id_unidad_longitud);
    d.id_unidad_superficie = this.parseUuid(r.id_unidad_superficie);
    d.id_unidad_volumen = this.parseUuid(r.id_unidad_volumen);
    d.id_almacen_defecto = this.parseUuid(r.id_almacen_defecto);
    d.id_categoria_item = this.parseUuid(r.id_categoria_item);
    d.id_estado_venta = this.parseUuid(r.id_estado_venta);
    d.id_estado_compra = this.parseUuid(r.id_estado_compra);
    d.id_tipo_control_caducidad = this.parseUuid(r.id_tipo_control_caducidad);
    d.id_tipo_item = this.parseUuid(r.id_tipo_item);
    d.id_tipo_control_inventario = this.parseUuid(r.id_tipo_control_inventario);
    d.id_naturaleza_item = this.parseUuid(r.id_naturaleza_item);
    d.id_tipo_comportamiento = this.parseUuid(r.id_tipo_comportamiento);
    d.id_cuenta_venta = this.parseUuid(r.id_cuenta_venta);
    d.id_cuenta_venta_intracomunitaria = this.parseUuid(r.id_cuenta_venta_intracomunitaria);
    d.id_cuenta_venta_exportacion = this.parseUuid(r.id_cuenta_venta_exportacion);
    d.id_cuenta_compra = this.parseUuid(r.id_cuenta_compra);
    d.id_cuenta_compra_intracomunitaria = this.parseUuid(r.id_cuenta_compra_intracomunitaria);
    d.id_cuenta_compra_importacion = this.parseUuid(r.id_cuenta_compra_importacion);

    return d;
  }
}
