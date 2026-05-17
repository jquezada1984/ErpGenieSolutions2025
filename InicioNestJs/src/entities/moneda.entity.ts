import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresa } from './empresa.entity';

@ObjectType()
@Entity('moneda')
export class Moneda {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_moneda: string;

  @Field()
  @Column({ type: 'varchar', length: 3, nullable: false, unique: true })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  simbolo_unicode: string | null;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Field(() => [Empresa], { nullable: true })
  @OneToMany(() => Empresa, empresa => empresa.moneda)
  empresas: Empresa[];
}
