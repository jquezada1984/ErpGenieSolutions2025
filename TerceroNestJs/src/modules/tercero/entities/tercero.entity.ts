import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

import { Empresa } from '../../empresa/entities/empresa.entity';
import { Pais } from '../../catalogos/entities/pais.entity';
import { CondicionPago } from '../../catalogos/entities/condicion-pago.entity';
import { FormaPago } from '../../catalogos/entities/forma-pago.entity';
import { TipoTercero } from '../../catalogos/entities/tipo-tercero.entity';
import { TipoEntidadComercial } from '../../catalogos/entities/tipo-entidad-comercial.entity';

@ObjectType()
@Entity('tercero')
export class Tercero {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_tercero: string;

  // ---- Relaciones (FK como objetos y columnas ID para simplicidad) ----
  @Field(() => String)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, { nullable: false })
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_pais?: string;

  @ManyToOne(() => Pais, { nullable: true })
  @JoinColumn({ name: 'id_pais' })
  pais?: Pais;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_condicion_pago?: string;

  @ManyToOne(() => CondicionPago, { nullable: true })
  @JoinColumn({ name: 'id_condicion_pago' })
  condicion_pago?: CondicionPago;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_forma_pago?: string;

  @ManyToOne(() => FormaPago, { nullable: true })
  @JoinColumn({ name: 'id_forma_pago' })
  forma_pago?: FormaPago;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_tipo_tercero?: string;

  @Field(() => TipoTercero, { nullable: true })
  @ManyToOne(() => TipoTercero, { nullable: true })
  @JoinColumn({ name: 'id_tipo_tercero' })
  tipo_tercero?: TipoTercero;

  @Field(() => Number, { nullable: true })
  @Column({ type: 'smallint', nullable: true })
  id_tipo_entidad?: number;

  @Field(() => TipoEntidadComercial, { nullable: true })
  @ManyToOne(() => TipoEntidadComercial, { nullable: true })
  @JoinColumn({ name: 'id_tipo_entidad' })
  tipoEntidadComercial?: TipoEntidadComercial;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  sede_central?: string;

  @ManyToOne(() => Tercero, { nullable: true })
  @JoinColumn({ name: 'sede_central' })
  sedeCentralRef?: Tercero;

  // ---- Tipos (booleans) ----
  @Field({ defaultValue: false })
  @Column({ type: 'boolean', default: false })
  cliente_potencial: boolean;

  @Field({ defaultValue: false })
  @Column({ type: 'boolean', default: false })
  cliente: boolean;

  @Field({ defaultValue: false })
  @Column({ type: 'boolean', default: false })
  proveedor: boolean;

  // ---- Información general ----
  @Field()
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  apodo?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_cliente?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_proveedor?: string;

  @Field({ defaultValue: true })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  // ---- Contacto ----
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  poblacion?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_postal?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_provincia?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  movil?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  fax?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  correo?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  web?: string;

  // ---- Identificaciones ----
  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  id_profesional_1?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  id_profesional_2?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  cif_intra?: string;

  // ---- Comercial ----
  @Field({ defaultValue: true })
  @Column({ type: 'boolean', default: true })
  sujeto_iva: boolean;

  @Field({ nullable: true })
  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  capital?: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  asignado_a?: string;

  // logo BYTEA -> no lo exponemos en GQL, se recomienda URL pública

  // ---- Auditoría ----
  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  fecha_modificacion?: Date;
}
