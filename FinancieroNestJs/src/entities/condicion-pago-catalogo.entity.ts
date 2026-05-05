import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('condicion_pago_catalogo')
export class CondicionPagoCatalogo {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_condicion_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  descripcion: string;
}
