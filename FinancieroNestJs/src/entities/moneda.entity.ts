import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('moneda')
export class Moneda {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_moneda: string;

  @Field()
  @Column({ type: 'varchar', length: 3 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  nombre: string;
}
