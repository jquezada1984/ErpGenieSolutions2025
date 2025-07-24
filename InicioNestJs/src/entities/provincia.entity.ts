import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Pais } from './pais.entity';

@ObjectType()
@Entity('provincia')
export class Provincia {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_provincia: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Field()
  @Column({ type: 'uuid', nullable: false })
  id_pais: string;

  @Field(() => Pais, { nullable: true })
  @ManyToOne(() => Pais, pais => pais.provincias)
  @JoinColumn({ name: 'id_pais' })
  pais: Pais;
} 