import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('asiento_contable')
export class AsientoContable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  numero: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ length: 500 })
  concepto: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_debe: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_haber: number;

  @Column({ type: 'enum', enum: ['BORRADOR', 'APROBADO', 'ANULADO', 'REVERSED'] })
  estado: string;

  @Column({ nullable: true })
  usuario_id: number;

  @Column({ nullable: true })
  empresa_id: number;

  @Column({ nullable: true })
  reversed_entry_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
