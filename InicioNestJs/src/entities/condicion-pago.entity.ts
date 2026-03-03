import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('condicion_pago_catalogo')
export class CondicionPago {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_condicion_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 100, unique: true })
  descripcion: string;
}
