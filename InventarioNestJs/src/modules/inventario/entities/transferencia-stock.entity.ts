import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transferencia_stock')
export class TransferenciaStock {
  @PrimaryColumn('uuid')
  id_transferencia_stock: string;

  @Column('uuid')
  id_empresa: string;

  @Column({ type: 'varchar', length: 100 })
  transferencia_ref: string;

  @Column('uuid')
  id_almacen_origen: string;

  @Column('uuid')
  id_almacen_destino: string;

  @Column({ type: 'varchar', length: 30 })
  estado_transferencia: string;

  @Column({ type: 'timestamp without time zone' })
  fecha_transferencia: Date;

  @Column({ type: 'text', nullable: true })
  observacion?: string | null;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;
}
