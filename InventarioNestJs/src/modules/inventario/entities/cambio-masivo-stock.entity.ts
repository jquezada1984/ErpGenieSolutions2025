import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cambio_masivo_stock')
export class CambioMasivoStock {
  @PrimaryColumn('uuid')
  id_cambio_masivo_stock: string;

  @Column('uuid')
  id_empresa: string;

  @Column('uuid')
  id_almacen: string;

  @Column('uuid')
  id_origen: string;

  @Column({ type: 'date' })
  fecha_movimiento: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia?: string | null;

  @Column({ type: 'text', nullable: true })
  concepto?: string | null;

  @Column({ type: 'varchar', length: 30 })
  estado_operacion: string;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;
}
