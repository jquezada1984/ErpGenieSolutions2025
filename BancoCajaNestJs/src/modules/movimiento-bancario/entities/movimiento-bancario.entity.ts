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
  id_cuenta_bancaria: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'date' })
  fecha_operacion: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  fecha_valor?: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  importe: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  concepto?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia?: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_tercero?: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  conciliado: boolean;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Field(() => CuentaBancaria, { nullable: true })
  @ManyToOne(() => CuentaBancaria)
  @JoinColumn({ name: 'id_cuenta_bancaria' })
  cuenta?: CuentaBancaria;
}
