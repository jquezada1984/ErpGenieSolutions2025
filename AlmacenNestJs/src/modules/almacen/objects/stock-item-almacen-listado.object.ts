import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

/**
 * Fila de listado read-only de saldos existentes en stock_item_almacen.
 * Los NUMERIC se exponen como Float siguiendo el patrón de Fase 1A.
 */
@ObjectType({
  description:
    'Saldo existente por item y almacén, con datos de referencia para listado.',
})
export class StockItemAlmacenListado {
  @Field(() => ID)
  id_stock_producto_almacen: string;

  @Field(() => ID)
  id_empresa: string;

  @Field(() => ID)
  id_item: string;

  @Field(() => String, { nullable: true })
  producto_ref?: string | null;

  @Field(() => String, { nullable: true })
  etiqueta?: string | null;

  @Field(() => ID)
  id_almacen: string;

  @Field(() => String, { nullable: true })
  almacen_ref?: string | null;

  @Field(() => String, { nullable: true })
  almacen_nombre?: string | null;

  @Field(() => Float)
  stock_fisico: number;

  @Field(() => Float)
  stock_reservado: number;

  @Field(() => Float)
  stock_virtual: number;

  @Field(() => Float)
  stock_disponible: number;

  @Field(() => Float, { nullable: true })
  stock_alerta?: number | null;

  @Field(() => Float, { nullable: true })
  stock_deseado?: number | null;

  @Field(() => Boolean)
  estado: boolean;
}
