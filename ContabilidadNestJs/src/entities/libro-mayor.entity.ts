import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('libro_mayor')
export class LibroMayor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column()
  cuenta_contable_id: number;

  @Column()
  periodo_contable_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_inicial: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_debe: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_haber: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_final: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
