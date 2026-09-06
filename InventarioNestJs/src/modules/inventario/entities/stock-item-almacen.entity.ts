import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stock_item_almacen')
export class StockItemAlmacen {
  @PrimaryColumn('uuid')
  id_stock_producto_almacen: string;

  @Column('uuid')
  id_empresa: string;

  @Column('uuid')
  id_item: string;

  @Column('uuid')
  id_almacen: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  stock_fisico: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  stock_reservado: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  stock_virtual: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  stock_disponible: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  stock_alerta?: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  stock_deseado?: number | null;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;
}
