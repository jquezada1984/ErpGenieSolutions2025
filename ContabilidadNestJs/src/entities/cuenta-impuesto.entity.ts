import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cuenta_impuesto')
export class CuentaImpuesto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column({ length: 50 })
  tipo_impuesto: string; // RENTA, INDUSTRIA_COMERCIO, RETENCION, etc.

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @Column()
  cuenta_contable_id: number;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
