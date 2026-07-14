import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { MovimientoContable } from './movimiento-contable.entity';

@ObjectType()
@Entity('asiento_contable')
export class AsientoContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_asiento_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_diario_contable: string;

  @Field(() => String)
  @Column({ name: 'numero_asiento', type: 'varchar', length: 50 })
  numero_asiento: string;

  @Field(() => String)
  @Column({ name: 'fecha_asiento', type: 'date' })
  fecha_asiento: string;

  @Field(() => String)
  @Column({ type: 'text' })
  concepto: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia: string | null;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_debe: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_haber: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20, default: 'BORRADOR' })
  estado: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_usuario_creacion: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_usuario_aprobacion: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp without time zone', nullable: true })
  fecha_aprobacion: Date | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  reversed_entry_id: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp without time zone', nullable: true })
  fecha_exportacion: Date | null;

  @Field(() => String, { nullable: true })
  codigo_diario?: string | null;

  @Field(() => String, { nullable: true })
  nombre_diario?: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [MovimientoContable], { nullable: true })
  movimientos?: MovimientoContable[];
}
