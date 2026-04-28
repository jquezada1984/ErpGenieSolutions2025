import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InventarioListado {
  @Field(() => ID)
  id_inventario: string;

  @Field(() => String, { nullable: true })
  inventario_ref?: string | null;

  @Field(() => String, { nullable: true })
  etiqueta?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field(() => String, { nullable: true })
  almacen?: string | null;

  @Field(() => Int)
  product: number;

  @Field(() => String, { nullable: true })
  estado_inventario?: string | null;

  @Field(() => Boolean, { nullable: true })
  estado?: boolean | null;
}
