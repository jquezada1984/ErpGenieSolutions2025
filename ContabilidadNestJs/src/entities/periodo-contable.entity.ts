import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('periodo_contable')
export class PeriodoContable {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_periodo_contable: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field(() => Int)
  @Column({ name: 'año', type: 'int' })
  anio: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  mes: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  etiqueta: string | null;

  @Field(() => String)
  @Column({ type: 'date' })
  fecha_inicio: string;

  @Field(() => String)
  @Column({ type: 'date' })
  fecha_fin: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20, default: 'ABIERTO' })
  estado: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp without time zone', nullable: true })
  fecha_cierre: Date | null;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_usuario_cierre: string | null;

  @Field(() => String)
  ref: string;

  @Field(() => Int)
  num_entradas: number;

  @Field(() => Int)
  num_movimientos: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
