import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';
import { Provincia } from './provincia.entity';

@ObjectType()
@Entity('pais')
export class Pais {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_pais: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Field()
  @Column({ type: 'varchar', length: 2, nullable: false, unique: true })
  codigo_iso: string;

  @Field()
  @Column({ type: 'text', nullable: false, default: '' })
  icono: string;

  @Field(() => [Empresa], { nullable: true })
  @OneToMany(() => Empresa, empresa => empresa.pais)
  empresas: Empresa[];

  @Field(() => [Provincia], { nullable: true })
  @OneToMany(() => Provincia, provincia => provincia.pais)
  provincias: Provincia[];
} 