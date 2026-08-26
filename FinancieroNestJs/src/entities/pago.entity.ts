import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { PagoFactura } from './pago-factura.entity';

@ObjectType()
@Entity('pago')
export class Pago {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_pago: string;

  @Field()
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  numero_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  tipo_pago: string;

  @Field()
  @Column({ type: 'uuid' })
  id_tercero: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_bancaria: string | null;

  @Field(() => String)
  @Column({ type: 'date' })
  fecha_pago: string;

  @Field(() => String)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  monto: string;

  @Field()
  @Column({ type: 'uuid' })
  id_moneda: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  tipo_cambio: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  concepto: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_asiento_contable: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Field(() => String, { nullable: true })
  tercero_nombre?: string | null;

  @Field(() => [PagoFactura], { nullable: true })
  aplicaciones?: PagoFactura[];
}
