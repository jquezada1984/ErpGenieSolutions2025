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
  import { Incoterm } from '../../catalogos/entities/incoterm.entity';
  import { TipoTercero } from '../../catalogos/entities/tipo-tercero.entity';
  
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
  
    @ManyToOne(() => Empresa, { nullable: false })
    @JoinColumn({ name: 'id_empresa' })
    empresa: Empresa;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    id_pais?: string;
  
    @ManyToOne(() => Pais, { nullable: true })
    @JoinColumn({ name: 'id_pais' })
    pais?: Pais;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    id_condicion_pago?: string;
  
    @ManyToOne(() => CondicionPago, { nullable: true })
    @JoinColumn({ name: 'id_condicion_pago' })
    condicion_pago?: CondicionPago;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    id_forma_pago?: string;
  
    @ManyToOne(() => FormaPago, { nullable: true })
    @JoinColumn({ name: 'id_forma_pago' })
    forma_pago?: FormaPago;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    id_incoterm?: string;
  
    @ManyToOne(() => Incoterm, { nullable: true })
    @JoinColumn({ name: 'id_incoterm' })
    incoterm?: Incoterm;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    id_tipo_tercero?: string;
  
    @ManyToOne(() => TipoTercero, { nullable: true })
    @JoinColumn({ name: 'id_tipo_tercero' })
    tipo_tercero?: TipoTercero;
  
  @Field(() => ID, { nullable: true })
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
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
    apodo?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
    codigo_cliente?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
    codigo_proveedor?: string;
  
    @Field({ defaultValue: true })
    @Column({ type: 'boolean', default: true })
    activo: boolean;
  
    @Field(() => Boolean, { nullable: true })
    @Column({ type: 'boolean', nullable: true })
    personal?: boolean;
  
    // ---- Contacto ----
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
    direccion?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
    poblacion?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
    codigo_postal?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
    provincia?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
    telefono?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
    movil?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
    fax?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
    correo?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
    web?: string;
  
    // ---- Identificaciones ----
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
    id_profesional_1?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
    id_profesional_2?: string;
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
    cif_intra?: string;
  
    // ---- Comercial ----
    @Field({ defaultValue: true })
    @Column({ type: 'boolean', default: true })
    sujeto_iva: boolean;
  
    @Field(() => String, { nullable: true })
    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
    capital?: string;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    asignado_a?: string;
  
    // logo BYTEA -> no lo exponemos en GQL, se recomienda URL pública
  
    // ---- Auditoría ----
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    created_by?: string;
  
  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
    updated_by?: string;
  
    @Field(() => GraphQLISODateTime, { nullable: true })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion?: Date;
  
    @Field(() => GraphQLISODateTime, { nullable: true })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_modificacion?: Date;
  }
  