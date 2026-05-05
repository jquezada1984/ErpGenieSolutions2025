import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('cuenta_bancaria')
export class CuentaBancaria {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_cuenta_bancaria: string;

  @Field()
  @Column({ type: 'uuid' })
  id_empresa: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_cuenta: string | null;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  etiqueta_cuenta: string | null;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  iban: string | null;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  id_moneda: string | null;

  @Field({ nullable: true })
  @Column({ type: 'boolean', nullable: true })
  estado: boolean | null;
}
