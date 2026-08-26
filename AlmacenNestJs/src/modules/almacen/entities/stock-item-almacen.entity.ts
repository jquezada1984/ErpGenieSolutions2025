import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Mapeo fiel y solo lectura de public.stock_item_almacen.
 * synchronize:false en la configuración global evita DDL sobre esta tabla.
 * Sin relaciones TypeORM: la validación multiempresa se hace en la consulta.
 */
@Entity({ name: 'stock_item_almacen', schema: 'public' })
export class StockItemAlmacen {
  @PrimaryColumn('uuid')
  id_stock_producto_almacen: string;

  @Column({ type: 'uuid' })
  id_empresa: string;

  @Column({ type: 'uuid' })
  id_item: string;

  @Column({ type: 'uuid' })
  id_almacen: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  stock_fisico: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  stock_reservado: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  stock_virtual: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  stock_disponible: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  stock_alerta?: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  stock_deseado?: string | null;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string | null;

  @Column({ type: 'timestamp without time zone' })
  created_at: Date;

  @Column({ type: 'timestamp without time zone' })
  updated_at: Date;

  @Column({ type: 'boolean' })
  estado: boolean;
}
