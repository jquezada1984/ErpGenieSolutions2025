import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cuenta_iva')
export class CuentaIva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column({ length: 50 })
  tipo_iva: string; // VENTA_19, VENTA_5, COMPRA_19, COMPRA_5, RETENCION, etc.

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
