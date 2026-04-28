import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('inventario')
export class Inventario {
  @PrimaryColumn('uuid')
  id_inventario: string;

  @Column('uuid')
  id_empresa: string;

  @Column({ type: 'varchar', length: 100 })
  inventario_ref: string;

  @Column({ type: 'varchar', length: 150 })
  etiqueta: string;

  @Column('uuid')
  id_almacen: string;

  @Column({ type: 'varchar', length: 30 })
  estado_inventario: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  fecha_inicio?: Date | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  fecha_cierre?: Date | null;

  @Column({ type: 'text', nullable: true })
  observacion?: string | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at?: Date | null;

  @Column({ type: 'boolean', nullable: true, default: true })
  estado?: boolean | null;
}
