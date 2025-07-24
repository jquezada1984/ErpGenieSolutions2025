import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Sucursal } from './sucursal.entity';
import { Pais } from './pais.entity';
import { Moneda } from './moneda.entity';
import { Provincia } from './provincia.entity';
import { EmpresaIdentificacion } from './empresa-identificacion.entity';
import { EmpresaRedSocial } from './empresa-red-social.entity';
import { EmpresaHorarioApertura } from './empresa-horario-apertura.entity';

@ObjectType()
@Entity('empresa')
export class Empresa {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field()
  @Column({ type: 'varchar', length: 13, unique: true })
  ruc: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 128, unique: true, nullable: true })
  email: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  // Nuevos campos
  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_moneda: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_pais: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_postal: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  poblacion: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  movil: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  fax: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  web: string;

  // Campos de imagen - no expuestos en GraphQL
  @Column({ type: 'bytea', nullable: true })
  logo: Buffer;

  @Column({ type: 'bytea', nullable: true })
  logotipo_cuadrado: Buffer;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  nota: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  sujeto_iva: boolean;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_provincia: string;

  @Field()
  @Column({ type: 'int', default: 1 })
  fiscal_year_start_month: number;

  @Field()
  @Column({ type: 'int', default: 1 })
  fiscal_year_start_day: number;

  // Relaciones
  @Field(() => Moneda, { nullable: true })
  @ManyToOne(() => Moneda)
  @JoinColumn({ name: 'id_moneda' })
  moneda: Moneda;

  @Field(() => Pais, { nullable: true })
  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais' })
  pais: Pais;

  @Field(() => Provincia, { nullable: true })
  @ManyToOne(() => Provincia)
  @JoinColumn({ name: 'id_provincia' })
  provincia: Provincia;

  @Field(() => EmpresaIdentificacion, { nullable: true })
  @OneToOne(() => EmpresaIdentificacion, identificacion => identificacion.empresa)
  identificacion: EmpresaIdentificacion;

  @Field(() => [EmpresaRedSocial], { nullable: true })
  @OneToMany(() => EmpresaRedSocial, redSocial => redSocial.empresa)
  redes_sociales: EmpresaRedSocial[];

  @Field(() => [EmpresaHorarioApertura], { nullable: true })
  @OneToMany(() => EmpresaHorarioApertura, horario => horario.empresa)
  horarios_apertura: EmpresaHorarioApertura[];

  @Field(() => [Sucursal], { nullable: true })
  @OneToMany(() => Sucursal, sucursal => sucursal.empresa)
  sucursales: Sucursal[];
} 