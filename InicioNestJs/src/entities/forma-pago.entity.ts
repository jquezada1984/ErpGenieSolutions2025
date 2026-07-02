import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('forma_pago_catalogo')
export class FormaPago {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_forma_pago: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  etiqueta: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_uso?: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  orden: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
