import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';

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

  @ManyToOne(() => Empresa, { eager: true })
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
} 