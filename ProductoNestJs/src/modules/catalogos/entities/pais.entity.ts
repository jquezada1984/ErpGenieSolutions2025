import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Provincia } from './provincia.entity';

@ObjectType()
@Entity({ name: 'pais' })
export class Pais {

  // UUID generado automáticamente (gen_random_uuid())
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_pais' })
  id_pais: string;

  // varchar NOT NULL
  @Field()
  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  // character(2) NOT NULL
  @Field()
  @Column({
    name: 'codigo_iso',
    type: 'char',
    length: 2,
    nullable: false,
  })
  codigo_iso: string;

  // text NOT NULL default ''
  @Field()
  @Column({
    name: 'icono',
    type: 'text',
    nullable: false,
    default: '',
  })
  icono: string;

  // Relación inversa con Provincia
  @Field(() => [Provincia], { nullable: true })
  @OneToMany(() => Provincia, (provincia) => provincia.pais)
  provincias?: Provincia[];
}
