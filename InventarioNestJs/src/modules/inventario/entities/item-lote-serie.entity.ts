import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('item_lote_serie')
export class ItemLoteSerie {
  @PrimaryColumn('uuid')
  id_lote_serie: string;

  @Column('uuid')
  id_empresa: string;

  @Column('uuid')
  id_item: string;

  @Column('uuid')
  id_almacen: string;

  @Column({ type: 'varchar', length: 150 })
  codigo_lote_serie: string;

  @Column({ type: 'date', nullable: true })
  fecha_limite_venta?: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_caducidad?: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  cantidad_actual: number;

  @Column({ type: 'text', nullable: true })
  observacion?: string | null;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;
}
