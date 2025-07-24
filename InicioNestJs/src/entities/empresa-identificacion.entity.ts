import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';
import { TipoEntidadComercial } from './tipo-entidad-comercial.entity';

@ObjectType()
@Entity('empresa_identificacion')
export class EmpresaIdentificacion {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_identificacion: string;

  @Field()
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  administradores: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  delegado_datos: string;

  @Field({ nullable: true })
  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  capital: number;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  id_tipo_entidad: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  objeto_empresa: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  cif_intra: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional1: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional2: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional3: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional4: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional5: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional6: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional7: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional8: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional9: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  id_profesional10: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Field(() => Empresa, { nullable: true })
  @OneToOne(() => Empresa, empresa => empresa.identificacion)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Field(() => TipoEntidadComercial, { nullable: true })
  @ManyToOne(() => TipoEntidadComercial)
  @JoinColumn({ name: 'id_tipo_entidad' })
  tipo_entidad: TipoEntidadComercial;
} 