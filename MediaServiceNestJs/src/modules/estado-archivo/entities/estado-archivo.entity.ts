import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estado_archivo')
export class EstadoArchivo {
  @PrimaryGeneratedColumn('uuid')
  id_estado_archivo: string;

  @Column()
  id_empresa: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column({ default: 0 })
  orden: number;

  @Column({ default: true })
  estado: boolean;
}
