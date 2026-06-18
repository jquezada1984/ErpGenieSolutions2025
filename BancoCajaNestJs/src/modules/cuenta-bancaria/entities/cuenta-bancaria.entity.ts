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
import { Banco } from '../../banco/entities/banco.entity';

@ObjectType()
@Entity('cuenta_bancaria')
export class CuentaBancaria {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_cuenta_bancaria: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_banco: string;

  @Field(() => Banco, { nullable: true })
  @ManyToOne(() => Banco)
  @JoinColumn({ name: 'id_banco' })
  banco?: Banco;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  numero_cuenta: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  tipo_cuenta: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_moneda: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_cuenta_contable?: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  saldo_inicial: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  saldo_actual: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  referencia?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  etiqueta_cuenta?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, default: 'abierta' })
  estado_cuenta?: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_tercero?: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_pais?: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_provincia?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion_banco?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  web?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comentario?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comentario_html?: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true, name: 'fecha_saldo_inicial' })
  fecha_saldo_inicial?: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true, name: 'saldo_minimo_autorizado' })
  saldo_minimo_autorizado?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true, name: 'saldo_minimo_deseado' })
  saldo_minimo_deseado?: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  iban?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  bic_swift?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_contable?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
