import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pais } from './pais.entity';

@ObjectType()
@Entity({ name: 'provincia' })
export class Provincia {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_provincia' })
  id_provincia: string;

  @Field()
  @Column({
    name: 'nombre',
    type: 'varchar',
    nullable: false,
  })
  nombre: string;

  @Field(() => ID)
  @Column({
    name: 'id_pais',
    type: 'uuid',
    nullable: false,
  })
  id_pais: string;

  // FK: provincia.id_pais -> pais.id_pais
  @Field(() => Pais, { nullable: true })
  @ManyToOne(() => Pais, { eager: false })
  @JoinColumn({ name: 'id_pais', referencedColumnName: 'id_pais' })
  pais?: Pais;
}
