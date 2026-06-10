import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('cuenta_contable')
export class CuentaContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_cuenta_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_plan_contable: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Field(() => String, { nullable: true })
  etiqueta_corta: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  tipo_cuenta: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  nivel: number;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_padre: string | null;

  @Field(() => String, { nullable: true })
  codigo_padre: string | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  permite_movimientos: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
