import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Media } from '../../media/entities/media.entity';

@Entity('directorio_documento')
export class DirectorioDocumento {
  @PrimaryGeneratedColumn('uuid')
  id_directorio_documento: string;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @ManyToOne(() => DirectorioDocumento, (d) => d.hijos, { nullable: true })
  @JoinColumn({ name: 'id_directorio_padre' })
  padre?: DirectorioDocumento | null;

  @Column({ type: 'varchar', nullable: false })
  modulo: string;

  @Column({ type: 'integer', nullable: false })
  orden: number;

  @Column({ type: 'boolean', nullable: false })
  estado: boolean;

  @Column({ type: 'timestamp', nullable: false, name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updated_at?: Date | null;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by?: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updated_by?: string | null;

  @OneToMany(() => DirectorioDocumento, (d) => d.padre)
  hijos?: DirectorioDocumento[];

  @OneToMany(() => Media, (media) => media.directorio_documento)
  medias?: Media[];
}

