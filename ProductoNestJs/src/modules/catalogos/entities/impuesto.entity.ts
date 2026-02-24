import { ObjectType, Field, ID, GraphQLISODateTime, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'impuestos' })
export class Impuesto {

  // ID es integer SERIAL (usa secuencia impuestos_id_seq)
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  // nombre es varchar NOT NULL
  @Field()
  @Column({
    type: 'varchar',
    name: 'nombre',
    length: 100,
    nullable: false,
  })
  nombre: string;

  // tasa es numeric NOT NULL
  @Field(() => Float)
  @Column({
    type: 'numeric',
    name: 'tasa',
    precision: 5,  // permite por ejemplo 999.99
    scale: 2,      // 2 decimales
    nullable: false,
  })
  tasa: number;

  // creado_en timestamp default CURRENT_TIMESTAMP
  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({
    type: 'timestamp',
    name: 'creado_en',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creado_en?: Date;

  // actualizado_en timestamp default CURRENT_TIMESTAMP
  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({
    type: 'timestamp',
    name: 'actualizado_en',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  actualizado_en?: Date;
}
