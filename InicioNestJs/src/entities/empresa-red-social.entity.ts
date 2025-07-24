import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';
import { SocialNetwork } from './social-network.entity';

@ObjectType()
@Entity('empresa_red_social')
export class EmpresaRedSocial {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'uuid' })
  id_red_social: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  identificador: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  es_principal: boolean;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Field(() => SocialNetwork, { nullable: true })
  @ManyToOne(() => SocialNetwork)
  @JoinColumn({ name: 'id_red_social' })
  red_social: SocialNetwork;
} 