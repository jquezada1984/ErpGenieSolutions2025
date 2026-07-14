import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Cabecera de inventario para detalle/edición (lectura).' })
export class InventarioDetalle {
  @Field(() => ID)
  id_inventario: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => String, { nullable: true })
  inventario_ref?: string | null;

  @Field(() => String, { nullable: true })
  etiqueta?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field(() => String, { nullable: true })
  almacen?: string | null;

  @Field(() => String, { nullable: true })
  observacion?: string | null;

  @Field(() => Int)
  product: number;

  @Field(() => String, { nullable: true })
  estado_inventario?: string | null;

  @Field(() => Boolean, { nullable: true })
  estado?: boolean | null;

  @Field(() => String, { nullable: true })
  fecha_inicio?: string | null;

  @Field(() => String, { nullable: true })
  fecha_cierre?: string | null;

  @Field(() => ID, { nullable: true })
  created_by?: string | null;

  @Field(() => ID, { nullable: true })
  updated_by?: string | null;

  @Field(() => String, { nullable: true })
  created_at?: string | null;

  @Field(() => String, { nullable: true })
  updated_at?: string | null;
}
