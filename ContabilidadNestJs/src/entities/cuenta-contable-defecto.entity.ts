import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CuentaContable } from './cuenta-contable.entity';

@ObjectType()
@Entity('cuenta_contable_defecto')
export class CuentaContableDefecto {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_cuenta_contable_defecto: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  tipo_operacion: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_cuenta_contable: string;

  @Field(() => CuentaContable, { nullable: true })
  @ManyToOne(() => CuentaContable, { nullable: true })
  @JoinColumn({ name: 'id_cuenta_contable' })
  cuenta_contable: CuentaContable | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
