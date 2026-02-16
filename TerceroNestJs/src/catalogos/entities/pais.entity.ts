import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('pais')
export class Pais {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_pais: string;

  @Field()
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'char', length: 2, nullable: true })
  codigo_iso2?: string;

  @Field({ nullable: true })
  @Column({ type: 'char', length: 3, nullable: true })
  codigo_iso3?: string;
}
