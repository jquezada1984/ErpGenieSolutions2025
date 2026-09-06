import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('inventario_detalle')
export class InventarioDetalleLinea {
  @PrimaryColumn('uuid')
  id_inventario_detalle: string;

  @Column('uuid')
  id_inventario: string;

  @Column('uuid')
  id_item: string;

  @Column({ type: 'uuid', nullable: true })
  id_lote_serie?: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  stock_sistema: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  stock_contado: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  diferencia: number;

  @Column({ type: 'text', nullable: true })
  observacion?: string | null;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;
}
