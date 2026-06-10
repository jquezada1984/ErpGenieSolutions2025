import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('almacen')
export class Almacen {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_almacen: string;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_empresa: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  almacen_ref: string;

  @Field()
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  estado: boolean;
}
