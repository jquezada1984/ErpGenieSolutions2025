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

  @Field()
  @Column({ type: 'char', length: 2 })
  codigo_iso: string;

  @Field()
  @Column({ type: 'text', default: '' })
  icono: string;
}
