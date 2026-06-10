import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Pais } from './pais.entity';

@ObjectType()
@Entity('modelo_plan_contable')
export class ModeloPlanContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_modelo_plan_contable: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_pais: string | null;

  @Field(() => Pais, { nullable: true })
  @ManyToOne(() => Pais, { nullable: true })
  @JoinColumn({ name: 'id_pais' })
  pais: Pais | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => ID, { nullable: true })
  id_plan_plantilla: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
