import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';
import { Perfil } from './perfil.entity';

@ObjectType()
@Entity('usuario')
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Field(() => ID)
  @Column()
  id_empresa: string;

  @Field(() => ID)
  @Column()
  id_perfil: string;

  @Field()
  @Column({ length: 50, unique: true })
  username: string;

  @Field()
  @Column({ length: 255 })
  password_hash: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  nombre_completo?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  email?: string;

  @Field()
  @Column({ default: true })
  estado: boolean;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: Empresa;

  @Field(() => Perfil, { nullable: true })
  @ManyToOne(() => Perfil)
  @JoinColumn({ name: 'id_perfil' })
  perfil?: Perfil;
} 