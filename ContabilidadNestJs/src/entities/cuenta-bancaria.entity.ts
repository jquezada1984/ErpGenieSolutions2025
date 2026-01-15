import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cuenta_bancaria')
export class CuentaBancaria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column()
  banco_id: number;

  @Column({ length: 50 })
  numero_cuenta: string;

  @Column({ length: 20 })
  tipo_cuenta: string; // CORRIENTE, AHORROS, FIDUCIA

  @Column()
  moneda_id: number;

  @Column({ nullable: true })
  cuenta_contable_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_inicial: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_actual: number;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
