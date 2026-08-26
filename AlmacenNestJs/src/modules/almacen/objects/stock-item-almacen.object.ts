import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

/**
 * Saldo puntual de item por almacén.
 * Los NUMERIC se exponen como Float siguiendo el patrón existente de
 * MovimientoInventarioListado; esta fase no realiza cálculos.
 */
@ObjectType({
  description:
    'Saldo actual de un item en un almacén. Consulta puntual de solo lectura.',
})
export class StockItemAlmacenDetalle {
  @Field(() => ID)
  id_stock_producto_almacen: string;

  @Field(() => ID)
  id_empresa: string;

  @Field(() => ID)
  id_item: string;

  @Field(() => ID)
  id_almacen: string;

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

  @Field(() => ID, { nullable: true })
  created_by?: string | null;

  @Field(() => ID, { nullable: true })
  updated_by?: string | null;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => Boolean)
  estado: boolean;
}
