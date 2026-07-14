import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('duracion_unidad_catalogo')
export class DuracionUnidadCatalogo {
  @Field(() => ID)
  @PrimaryColumn('uuid', { name: 'id_duration_unit' })
  id_duration_unit: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  orden: number | null;
}
