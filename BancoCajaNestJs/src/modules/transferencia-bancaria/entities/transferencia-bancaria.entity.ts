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
@Entity('transferencia_bancaria')
export class TransferenciaBancaria {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_transferencia_bancaria: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_cuenta_origen: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_cuenta_destino: string;

  @Field()
  @Column({ type: 'date' })
  fecha_movimiento: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_documento?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  concepto?: string;

  @Field()
  @Column({ type: 'varchar', length: 30, default: 'transferencia_bancaria' })
  tipo_movimiento: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  monto: number;

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
  @JoinColumn({ name: 'id_cuenta_origen' })
  cuentaOrigen?: CuentaBancaria;

  @Field(() => CuentaBancaria, { nullable: true })
  @ManyToOne(() => CuentaBancaria)
  @JoinColumn({ name: 'id_cuenta_destino' })
  cuentaDestino?: CuentaBancaria;
}
