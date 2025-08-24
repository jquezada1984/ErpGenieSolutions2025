import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PerfilMenuPermiso } from './perfil-menu-permiso.entity';

@ObjectType()
@Entity('perfil')
export class Perfil {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_perfil: string;

  @Field()
  @Column({ length: 100 })
  nombre: string;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => [PerfilMenuPermiso], { nullable: true })
  @OneToMany(() => PerfilMenuPermiso, perfilMenuPermiso => perfilMenuPermiso.perfil)
  permisos?: PerfilMenuPermiso[];
}
