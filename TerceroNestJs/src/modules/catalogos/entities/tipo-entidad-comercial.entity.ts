import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('tipo_entidad_comercial')
export class TipoEntidadComercial {
  @Field(() => Number)
  @PrimaryColumn({ type: 'smallint' })
  id_tipo_entidad: number;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
