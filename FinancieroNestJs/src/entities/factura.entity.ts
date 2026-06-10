import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('factura')
export class Factura {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_factura: string;

  @Field()
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_factura: string | null;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  tipo_factura: string;

  @Field()
  @Column({ type: 'uuid' })
  id_tercero: string;

  @Field(() => String)
  @Column({ type: 'date' })
  fecha_factura: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  subtotal: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total_impuestos: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total_descuentos: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total_factura: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_asiento_contable: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_condicion_pago: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_forma_pago: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_bancaria: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  origen: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_proyecto: string | null;

  @Field(() => [String])
  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  categorias: string[];

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, default: 'crabe' })
  plantilla_documento: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_moneda: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  nota_publica: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  nota_privada: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
