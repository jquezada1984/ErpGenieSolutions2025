import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Producto } from './entities/producto.entity';
import { ProductoFilterInput } from './dto/producto-filter.input';
import { PaginatedProductosDTO } from './dto/paginated-productos.dto';
import { ProductoDetalleDTO } from './dto/producto-detalle.dto';
import { ProductoListDTO } from './dto/producto-list.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async listar(filter: ProductoFilterInput): Promise<PaginatedProductosDTO> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(100, Math.max(1, filter.limit ?? 20));
    const offset = (page - 1) * limit;

    const sortBy = filter.sortBy ?? 'updated_at';
    const sortDir = (filter.sortDir ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.productoRepo.createQueryBuilder('p');
  
    qb.where('p.id_empresa = :id_empresa', { id_empresa: filter.id_empresa });

    if (filter.search && filter.search.trim().length > 0) {
      const s = `%${filter.search.trim()}%`;
      qb.andWhere(
        new Brackets((w) => {
          w.where('p.producto_ref ILIKE :s', { s }).orWhere('p.etiqueta ILIKE :s', { s });
        }),
      );
    }

    if (filter.estado_venta) qb.andWhere('p.estado_venta = :estado_venta', { estado_venta: filter.estado_venta });
    if (filter.estado_compra) qb.andWhere('p.estado_compra = :estado_compra', { estado_compra: filter.estado_compra });
    if (filter.impuesto_id != null) qb.andWhere('p.impuesto_id = :impuesto_id', { impuesto_id: filter.impuesto_id });
    if (filter.pais_origen) qb.andWhere('p.pais_origen = :pais_origen', { pais_origen: filter.pais_origen });
    if (filter.provincia_origen) {
      qb.andWhere('p.provincia_origen = :provincia_origen', { provincia_origen: filter.provincia_origen });
    }

    qb.select([
      'p.id_producto',
      'p.producto_ref',
      'p.etiqueta',
      'p.precio_venta',
      'p.estado_venta',
      'p.estado_compra',
      'p.estado',
      'p.impuesto_id',
      'p.id_empresa',
      'p.updated_at',
    ]);

    const sortMap: Record<string, string> = {
      producto_ref: 'p.producto_ref',
      etiqueta: 'p.etiqueta',
      precio_venta: 'p.precio_venta',
      updated_at: 'p.updated_at',
    };

    qb.orderBy(sortMap[sortBy] ?? 'p.updated_at', sortDir as 'ASC' | 'DESC');
    qb.skip(offset).take(limit);

    const [rows, total] = await qb.getManyAndCount();

    const items: ProductoListDTO[] = rows.map((r: any) => ({
      id_producto: r.id_producto,
      producto_ref: r.producto_ref,
      etiqueta: r.etiqueta ?? undefined,
      precio_venta: r.precio_venta ?? undefined,
      estado_venta: r.estado_venta ?? undefined,
      estado_compra: r.estado_compra ?? undefined,
      estado: r.estado ?? true,
      impuesto_id: r.impuesto_id ?? undefined,
      id_empresa: r.id_empresa,
      updated_at: r.updated_at ?? undefined,
    }));

    return { items, total, page, limit };
  }

  async obtenerPorId(id_producto: string, id_empresa: string): Promise<ProductoDetalleDTO> {
    const p = await this.productoRepo.findOne({
      where: { id_producto, id_empresa },
    });

    if (!p) throw new NotFoundException('Producto no encontrado');

    return {
      id_producto: p.id_producto,
      producto_ref: p.producto_ref,

      etiqueta: p.etiqueta ?? undefined,
      estado_venta: p.estado_venta ?? undefined,
      estado_compra: p.estado_compra ?? undefined,

      descripcion: p.descripcion ?? undefined,
      url_publica: p.url_publica ?? undefined,
      naturaleza: p.naturaleza ?? undefined,

      peso: p.peso ?? undefined,
      longitud: p.longitud ?? undefined,
      anchura: p.anchura ?? undefined,
      altura: p.altura ?? undefined,
      unidad_longitud: p.unidad_longitud ?? undefined,

      superficie: p.superficie ?? undefined,
      unidad_superficie: p.unidad_superficie ?? undefined,

      volumen: p.volumen ?? undefined,
      unidad_volumen: p.unidad_volumen ?? undefined,

      nomenclatura_aduanera: p.nomenclatura_aduanera ?? undefined,
      pais_origen: p.pais_origen ?? undefined,
      provincia_origen: p.provincia_origen ?? undefined,

      nota_interna: p.nota_interna ?? undefined,

      precio_venta: p.precio_venta ?? undefined,
      precio_minimo: p.precio_minimo ?? undefined,

      impuesto_id: p.impuesto_id ?? undefined,

      contabilidad_venta: p.contabilidad_venta ?? undefined,
      contabilidad_exportacion: p.contabilidad_exportacion ?? undefined,
      contabilidad_compra: p.contabilidad_compra ?? undefined,
      contabilidad_importacion: p.contabilidad_importacion ?? undefined,

      created_at: p.created_at ?? undefined,
      updated_at: p.updated_at ?? undefined,

      id_empresa: p.id_empresa,
    };
  }
}
