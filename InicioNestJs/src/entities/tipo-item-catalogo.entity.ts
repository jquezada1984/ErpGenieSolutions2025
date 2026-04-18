import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_item_catalogo')
export class TipoItemCatalogo {
  @Field(() => ID)
  @PrimaryColumn('uuid', { name: 'id_tipo_item' })
  id_tipo_item: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  orden: number | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: true, nullable: true })
  estado: boolean | null;
}
