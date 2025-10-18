import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cuenta_contable')
export class CuentaContable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  codigo: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO'] })
  tipo: string;

  @Column({ type: 'enum', enum: ['DEUDORA', 'ACREEDORA'] })
  naturaleza: string;

  @Column({ default: true })
  activa: boolean;

  @Column({ nullable: true })
  cuenta_padre_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
