import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Perfil } from './perfil.entity';
import { MenuItem } from './menu-item.entity';

@ObjectType()
@Entity('perfil_menu_permiso')
export class PerfilMenuPermiso {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_perfil: string;

  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_item: string;

  @Field()
  @Column({ default: true })
  permitido: boolean;

  @Field(() => Perfil, { nullable: true })
  @ManyToOne(() => Perfil, perfil => perfil.permisos)
  @JoinColumn({ name: 'id_perfil' })
  perfil?: Perfil;

  @Field(() => MenuItem, { nullable: true })
  @ManyToOne(() => MenuItem, menuItem => menuItem.permisos)
  @JoinColumn({ name: 'id_item' })
  menuItem?: MenuItem;
}
