import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('tamano_empresa')
export class TamanoEmpresa {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_tamano_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 10 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  descripcion?: string;

  @Field(() => Int)
  @Column({ type: 'smallint', default: 0 })
  orden: number;

  @Field()
  @Column({ name: 'estado', type: 'boolean', default: true })
  estado: boolean;
}
