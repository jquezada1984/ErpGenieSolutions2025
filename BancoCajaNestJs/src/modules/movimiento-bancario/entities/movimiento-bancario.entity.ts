import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field,
  ID,
  ObjectType,
  GraphQLISODateTime,
  Float,
} from '@nestjs/graphql';
import { CuentaBancaria } from '../../cuenta-bancaria/entities/cuenta-bancaria.entity';

@ObjectType()
@Entity('movimiento_bancario')
export class MovimientoBancario {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_movimiento_bancario: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_cuenta_bancaria: string;

  @Field()
  @Column({ type: 'date' })
  fecha_movimiento: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_documento?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  concepto?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  tipo_movimiento?: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  monto: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  saldo_anterior?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  saldo_nuevo?: number;

  @Field()
  @Column({ type: 'boolean', default: false })
  conciliado: boolean;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_transferencia_bancaria?: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_movimiento_reversado?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Field(() => CuentaBancaria, { nullable: true })
  @ManyToOne(() => CuentaBancaria)
  @JoinColumn({ name: 'id_cuenta_bancaria' })
  cuenta?: CuentaBancaria;
}
