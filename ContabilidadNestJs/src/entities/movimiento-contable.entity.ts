import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('movimiento_contable')
export class MovimientoContable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  asiento_contable_id: number;

  @Column()
  cuenta_contable_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  debe: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  haber: number;

  @Column({ length: 500, nullable: true })
  concepto: string;

  @Column({ nullable: true })
  documento_referencia: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
