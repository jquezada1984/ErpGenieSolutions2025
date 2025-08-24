import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { MenuItem } from './menu-item.entity';

@ObjectType()
@Entity('menu_seccion')
export class MenuSeccion {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_seccion: string;

  @Field()
  @Column({ length: 100 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  icono?: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => [MenuItem], { nullable: true })
  @OneToMany(() => MenuItem, menuItem => menuItem.seccion)
  items?: MenuItem[];
}
