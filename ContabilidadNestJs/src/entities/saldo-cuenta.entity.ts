import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('saldo_cuenta')
export class SaldoCuenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column()
  cuenta_contable_id: number;

  @Column()
  periodo_contable_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_debe: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_haber: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_final: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
