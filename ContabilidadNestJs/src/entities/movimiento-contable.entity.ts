import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, GraphQLISODateTime, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('movimiento_contable')
export class MovimientoContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_movimiento_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_asiento_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_cuenta_contable: string;

  @Field(() => String)
  @Column({ type: 'text' })
  concepto: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debe: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  haber: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  orden: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp without time zone', nullable: true })
  fecha_exportacion: Date | null;

  @Field(() => String, { nullable: true })
  codigo_cuenta?: string | null;

  @Field(() => String, { nullable: true })
  nombre_cuenta?: string | null;

  @CreateDateColumn()
  created_at: Date;
}
