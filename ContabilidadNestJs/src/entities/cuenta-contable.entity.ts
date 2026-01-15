import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cuenta_contable')
export class CuentaContable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  plan_contable_id: number;

  @Column({ length: 20 })
  codigo: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTO'] })
  tipo: string;

  @Column({ type: 'enum', enum: ['DEUDORA', 'ACREEDORA'] })
  naturaleza: string;

  @Column({ default: 1 })
  nivel: number;

  @Column({ nullable: true })
  cuenta_padre_id: number;

  @Column({ default: true })
  permite_movimientos: boolean;

  @Column({ default: true })
  activa: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
