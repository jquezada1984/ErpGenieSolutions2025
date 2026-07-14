import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

/** Solo lectura para joins del listado item → empresa (tabla public.empresa). */
@ObjectType()
@Entity('empresa')
export class EmpresaItemRef {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_empresa: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  nombre: string;
}
