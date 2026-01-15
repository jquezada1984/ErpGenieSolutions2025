import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cuenta_contable_defecto')
export class CuentaContableDefecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column({ length: 50 })
  tipo_operacion: string; // VENTA, COMPRA, PAGO, COBRO, IVA_VENTA, IVA_COMPRA, etc.

  @Column()
  cuenta_contable_id: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
