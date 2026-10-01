import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  Field,
  ID,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'categoria_gasto', schema: 'public' })
export class CategoriaGasto {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_categoria_gasto: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @Field()
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
