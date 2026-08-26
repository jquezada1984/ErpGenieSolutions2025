import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Fila de historial de movimiento de inventario (solo lectura).',
})
export class MovimientoInventarioListado {
  @Field(() => ID)
  id_movimiento_inventario: string;

  @Field(() => ID)
  id_empresa: string;

  @Field(() => String, { nullable: true })
  fecha_movimiento?: string | null;

  @Field(() => ID)
  id_item: string;

  @Field(() => String, { nullable: true })
  producto_ref?: string | null;

  @Field(() => String, { nullable: true })
  etiqueta?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field(() => String, { nullable: true })
  almacen_origen?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen_destino?: string | null;

  @Field(() => String, { nullable: true })
  almacen_destino?: string | null;

  @Field(() => String, { nullable: true })
  tipo_movimiento?: string | null;

  @Field(() => String, { nullable: true })
  referencia?: string | null;

  @Field(() => String, { nullable: true })
  concepto?: string | null;

  @Field(() => Float, { nullable: true })
  cantidad?: number | null;

  @Field(() => String, { nullable: true })
  modulo_origen?: string | null;

  @Field(() => Boolean, { nullable: true })
  estado?: boolean | null;
}
