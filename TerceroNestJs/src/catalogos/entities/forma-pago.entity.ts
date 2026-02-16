import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('forma_pago_catalogo')
export class FormaPago {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_forma_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 100, unique: true })
  descripcion: string;
}
