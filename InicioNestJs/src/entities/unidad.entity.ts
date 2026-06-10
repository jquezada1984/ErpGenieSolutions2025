import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TipoUnidad } from './tipo-unidad.entity';

@ObjectType()
@Entity('unidad')
export class Unidad {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_unidad: string;

  @Field()
  @Column({ type: 'uuid', nullable: false })
  id_tipo_unidad: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  abreviatura: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  estado: boolean;

  @Field(() => TipoUnidad, { nullable: true })
  @ManyToOne(() => TipoUnidad)
  @JoinColumn({ name: 'id_tipo_unidad' })
  tipo_unidad: TipoUnidad;
}
