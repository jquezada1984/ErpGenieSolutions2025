import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Mapeo de public.almacen (tabla existente).
 * synchronize:false — no crea ni altera la tabla.
 * Sin relaciones TypeORM / FK nuevas.
 */
@Entity('almacen')
export class Almacen {
  @PrimaryColumn('uuid')
  id_almacen: string;

  @Column({ type: 'uuid', nullable: true })
  id_empresa?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  almacen_ref?: string | null;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @Column({ type: 'text', nullable: true })
  direccion?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_postal?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  poblacion?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_pais?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_provincia?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fax?: string | null;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at?: Date | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at?: Date | null;

  @Column({ type: 'boolean', nullable: true, default: true })
  estado?: boolean | null;
}
