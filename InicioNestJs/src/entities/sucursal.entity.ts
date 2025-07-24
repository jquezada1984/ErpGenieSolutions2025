import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';

@ObjectType()
@Entity('sucursal')
export class Sucursal {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_sucursal: string;

  @Field(() => ID)
  @Column()
  id_empresa: string;

  @Field()
  @Column({ length: 100 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ length: 200, nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, empresa => empresa.sucursales)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: Empresa;
} 