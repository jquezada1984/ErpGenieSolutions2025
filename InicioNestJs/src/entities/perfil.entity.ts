import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';
import { PerfilMenuPermiso } from './perfil-menu-permiso.entity';

@ObjectType()
@Entity('perfil')
export class Perfil {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_perfil: string;

  @Field()
  @Column({ length: 50 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => ID)
  @Column()
  id_empresa: string;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, empresa => empresa.perfiles)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: Empresa;

  @Field(() => [PerfilMenuPermiso], { nullable: true })
  @OneToMany(() => PerfilMenuPermiso, permiso => permiso.perfil)
  permisos?: PerfilMenuPermiso[];
} 