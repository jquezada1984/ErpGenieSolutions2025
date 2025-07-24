import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('menu_seccion')
export class MenuSeccion {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_seccion: string;

  @Field()
  @Column({ length: 100, unique: true })
  nombre: string;

  @Field(() => Int)
  @Column({ default: 0 })
  orden: number;

  @Field(() => [MenuItem], { nullable: true })
  @OneToMany(() => MenuItem, menuItem => menuItem.seccion)
  items?: MenuItem[];
}

@ObjectType()
@Entity('menu_item')
export class MenuItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_item: string;

  @Field(() => ID)
  @Column()
  id_seccion: string;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  parent_id?: string;

  @Field()
  @Column({ length: 100 })
  etiqueta: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  icono?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  ruta?: string;

  @Field()
  @Column({ default: true })
  es_clickable: boolean;

  @Field(() => Int)
  @Column({ default: 0 })
  orden: number;

  @Field()
  @Column({ default: false })
  muestra_badge: boolean;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  badge_text?: string;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  created_by?: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  updated_by?: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Field(() => MenuSeccion, { nullable: true })
  @ManyToOne(() => MenuSeccion, seccion => seccion.items)
  @JoinColumn({ name: 'id_seccion' })
  seccion?: MenuSeccion;

  @Field(() => MenuItem, { nullable: true })
  @ManyToOne(() => MenuItem, menuItem => menuItem.subitems)
  @JoinColumn({ name: 'parent_id' })
  parent?: MenuItem;

  @Field(() => [MenuItem], { nullable: true })
  @OneToMany(() => MenuItem, menuItem => menuItem.parent)
  subitems?: MenuItem[];
} 