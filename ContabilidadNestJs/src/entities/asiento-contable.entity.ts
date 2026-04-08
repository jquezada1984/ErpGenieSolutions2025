import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, Float, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('asiento_contable')
export class AsientoContable {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ length: 20, unique: true })
  numero: string;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'date' })
  fecha: Date;

  @Field(() => String)
  @Column({ length: 500 })
  concepto: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_debe: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_haber: number;

  @Field(() => String)
  @Column({ type: 'enum', enum: ['BORRADOR', 'APROBADO', 'ANULADO'] })
  estado: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  usuario_id: number | null;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  empresa_id: number | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;
}
