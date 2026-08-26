import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

/**
 * Stock físico reconstruido a una fecha de corte (solo lectura).
 * Sin reservado / disponible / virtual / costos.
 */
@ObjectType({
  description:
    'Saldo físico histórico por item y almacén a una fecha (movimiento_inventario).',
})
export class StockPorFecha {
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

  /** Fecha de corte consultada (YYYY-MM-DD). */
  @Field(() => String)
  fecha: string;

  @Field(() => Float)
  stock_fisico: number;
}
