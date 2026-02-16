import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('incoterm_catalogo')
export class Incoterm {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_incoterm: string;

  @Field()
  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  descripcion?: string;
}
