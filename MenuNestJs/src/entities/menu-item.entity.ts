import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { MenuSeccion } from './menu-seccion.entity';
import { PerfilMenuPermiso } from './perfil-menu-permiso.entity';

@ObjectType()
@Entity('menu_item')
export class MenuItem {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_item: string;

  @Field()
  @Column({ length: 100 })
  etiqueta: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  ruta?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  icono?: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => ID)
  @Column()
  id_seccion: string;

  @Field(() => MenuSeccion, { nullable: true })
  @ManyToOne(() => MenuSeccion, seccion => seccion.items)
  @JoinColumn({ name: 'id_seccion' })
  seccion?: MenuSeccion;

  @Field(() => [PerfilMenuPermiso], { nullable: true })
  @OneToMany(() => PerfilMenuPermiso, perfilMenuPermiso => perfilMenuPermiso.menuItem)
  permisos?: PerfilMenuPermiso[];
}
