import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_tercero_catalogo')
export class TipoTercero {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_tipo_tercero: string;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
