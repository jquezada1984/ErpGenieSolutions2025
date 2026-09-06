import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('impuestos')
export class Impuesto {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field()
  @Column({ type: 'varchar', length: 32 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar' })
  nombre: string;

  @Field(() => Float)
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    transformer: { from: (v: string) => (v != null ? parseFloat(v) : 0), to: (v: number) => v },
  })
  tasa: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
