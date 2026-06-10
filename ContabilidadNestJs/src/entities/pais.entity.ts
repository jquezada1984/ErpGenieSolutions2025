import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('pais')
export class Pais {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_pais: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String)
  @Column({ type: 'char', length: 2 })
  codigo_iso: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  icono: string | null;
}
