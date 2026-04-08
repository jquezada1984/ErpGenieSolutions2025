import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_unidad')
export class TipoUnidad {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_tipo_unidad: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  estado: boolean;
}
