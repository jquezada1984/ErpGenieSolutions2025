import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('cuenta_contable')
export class CuentaContable {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ length: 20, unique: true })
  codigo: string;

  @Field(() => String)
  @Column({ length: 200 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ length: 500, nullable: true })
  descripcion: string | null;

  @Field(() => String)
  @Column({ type: 'enum', enum: ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO'] })
  tipo: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: ['DEUDORA', 'ACREEDORA'] })
  naturaleza: string;

  @Field(() => Boolean)
  @Column({ default: true })
  activa: boolean;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  cuenta_padre_id: number | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}
