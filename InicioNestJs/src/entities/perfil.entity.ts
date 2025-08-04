import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
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

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, empresa => empresa.perfiles)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: Empresa;
} 