import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('movimiento_inventario')
export class MovimientoInventario {
  @PrimaryColumn('uuid')
  id_movimiento_inventario: string;

  @Column('uuid')
  id_empresa: string;

  @Column('uuid')
  id_item: string;

  @Column({ type: 'varchar', length: 20 })
  tipo_movimiento: string;

  @Column({ type: 'numeric', precision: 10, scale: 3 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  costo_unitario: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  costo_total: number;

  @Column({ type: 'date' })
  fecha_movimiento: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia?: string | null;

  @Column({ type: 'text', nullable: true })
  concepto?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_almacen?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_almacen_destino?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  modulo_origen?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_origen?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_lote_serie?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_asiento_contable?: string | null;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at?: Date | null;
}
