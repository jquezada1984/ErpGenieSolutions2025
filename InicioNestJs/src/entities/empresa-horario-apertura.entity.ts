import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';

@ObjectType()
@Entity('empresa_horario_apertura')
export class EmpresaHorarioApertura {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_horario: string;

  @Field()
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'int' })
  dia: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  valor: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Field(() => Empresa, { nullable: true })
  @ManyToOne(() => Empresa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
} 