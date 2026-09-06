import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('almacen')
export class AlmacenEntity {
  @PrimaryColumn('uuid')
  id_almacen: string;

  @Column('uuid')
  id_empresa: string;

  @Column({ type: 'varchar', length: 100 })
  almacen_ref: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @Column({ type: 'text', nullable: true })
  direccion?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_postal?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  poblacion?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_pais?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_provincia?: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono?: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  fax?: string | null;

  @Column({ type: 'boolean', default: true })
  estado?: boolean | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at?: Date | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at?: Date | null;
}
