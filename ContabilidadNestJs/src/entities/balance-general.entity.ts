import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('balance_general')
export class BalanceGeneral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha_corte: Date;

  @Column()
  empresa_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_activos: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_pasivos: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_patrimonio: number;

  @Column({ type: 'enum', enum: ['BORRADOR', 'APROBADO'] })
  estado: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
