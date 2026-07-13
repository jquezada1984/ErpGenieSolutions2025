import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
@Entity('banco')
export class Banco {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_banco: string;

  @Field()
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  codigo?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  swift?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 200, nullable: true })
  web?: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
