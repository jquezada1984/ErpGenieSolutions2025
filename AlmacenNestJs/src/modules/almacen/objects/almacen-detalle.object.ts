import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Detalle de almacén para edición/lectura.
 * Convención nombres relacionados: `pais` / `provincia` (String), como listado e inventariosListado.almacen.
 */
@ObjectType({ description: 'Detalle de almacén (lectura AlmacenNestJs).' })
export class AlmacenDetalle {
  @Field(() => ID)
  id_almacen: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => String, { nullable: true })
  almacen_ref?: string | null;

  @Field(() => String)
  nombre: string;

  @Field(() => String, { nullable: true })
  descripcion?: string | null;

  @Field(() => String, { nullable: true })
  direccion?: string | null;

  @Field(() => String, { nullable: true })
  codigo_postal?: string | null;

  @Field(() => String, { nullable: true })
  poblacion?: string | null;

  @Field(() => ID, { nullable: true })
  id_pais?: string | null;

  @Field(() => String, { nullable: true })
  pais?: string | null;

  @Field(() => ID, { nullable: true })
  id_provincia?: string | null;

  @Field(() => String, { nullable: true })
  provincia?: string | null;

  @Field(() => String, { nullable: true })
  telefono?: string | null;

  @Field(() => String, { nullable: true })
  fax?: string | null;

  @Field(() => ID, { nullable: true })
  created_by?: string | null;

  @Field(() => ID, { nullable: true })
  updated_by?: string | null;

  @Field(() => String, { nullable: true })
  created_at?: string | null;

  @Field(() => String, { nullable: true })
  updated_at?: string | null;

  @Field(() => Boolean, { nullable: true })
  estado?: boolean | null;
}
