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

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  simbolo_unicode: string | null;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
