import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('periodo_contable')
export class PeriodoContable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column()
  año: number;

  @Column()
  mes: number;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'enum', enum: ['ABIERTO', 'CERRADO', 'BLOQUEADO'], default: 'ABIERTO' })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre: Date;

  @Column({ nullable: true })
  usuario_cierre_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
