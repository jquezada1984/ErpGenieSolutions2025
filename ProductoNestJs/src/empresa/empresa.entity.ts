import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'empresa' })
export class Empresa {
  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid', name: 'id_empresa' })
  id_empresa: string;

  @Field({ nullable: true })
  @Column({ name: 'nombre', type: 'varchar', nullable: true })
  nombre?: string;
}
