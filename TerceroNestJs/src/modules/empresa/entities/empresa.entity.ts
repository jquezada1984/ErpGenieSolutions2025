import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('empresa')
export class Empresa {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field()
  @Column({ type: 'varchar', length: 13, unique: true })
  ruc: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 128, unique: true, nullable: true })
  email?: string;

  @Field({ defaultValue: true })
  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
