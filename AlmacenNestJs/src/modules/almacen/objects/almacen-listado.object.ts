import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Fila de listado de almacenes.
 * Convención de nombres relacionados: igual que InventarioListado.almacen
 * (String con el nombre, no *_nombre).
 */
@ObjectType()
export class AlmacenListado {
  @Field(() => ID)
  id_almacen: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => String, { nullable: true })
  almacen_ref?: string | null;

  @Field(() => String)
  nombre: string;

  @Field(() => String, { nullable: true })
  poblacion?: string | null;

  @Field(() => ID, { nullable: true })
  id_pais?: string | null;

  /** Nombre del país (JOIN), patrón inventariosListado.almacen */
  @Field(() => String, { nullable: true })
  pais?: string | null;

  @Field(() => ID, { nullable: true })
  id_provincia?: string | null;

  /** Nombre de la provincia (JOIN LEFT; puede ser null) */
  @Field(() => String, { nullable: true })
  provincia?: string | null;

  @Field(() => String, { nullable: true })
  telefono?: string | null;

  @Field(() => Boolean, { nullable: true })
  estado?: boolean | null;
}
