import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('plan_contable')
export class PlanContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_plan_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_modelo_plan_contable: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
