import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DirectorioDocumento } from '../../directorio/entities/directorio-documento.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id_media: string;

  @Column({ type: 'varchar', nullable: false })
  module: string;

  @Column({ type: 'uuid', nullable: false, name: 'module_id' })
  module_id: string;

  @Column({ type: 'uuid', nullable: true, name: 'id_empresa' })
  id_empresa?: string | null;

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @Column({ type: 'varchar', nullable: false })
  filename: string;

  @Column({ type: 'varchar', nullable: false })
  mimetype: string;

  @Column({ type: 'integer', nullable: false })
  size: number;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'now()',
  })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updated_at?: Date | null;

  @Column({ type: 'varchar', nullable: false })
  tipo: string;

  @Column({ type: 'boolean', nullable: false, name: 'es_principal' })
  es_principal: boolean;

  @Column({ type: 'varchar', nullable: false, name: 'estado_archivo' })
  estado_archivo: string;

  @Column({ type: 'boolean', nullable: false })
  estado: boolean;

  @ManyToOne(() => DirectorioDocumento, (directorio) => directorio.medias, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_directorio_documento' })
  directorio_documento?: DirectorioDocumento | null;

  @Column({ type: 'uuid', nullable: true, name: 'id_directorio_documento' })
  id_directorio_documento?: string | null;
}

