import { ObjectType, Field, ID, Float, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class ProductoListDTO {
  @Field(() => ID)
  id_producto: string;

  @Field()
  producto_ref: string;

  @Field({ nullable: true })
  etiqueta?: string;

  @Field(() => Float, { nullable: true })
  precio_venta?: number;

  @Field({ nullable: true })
  estado_venta?: string;

  @Field({ nullable: true })
  estado_compra?: string;

  @Field(() => Boolean, { nullable: true })
  estado?: boolean;

  @Field(() => Int, { nullable: true })
  impuesto_id?: number;

  @Field(() => ID)
  id_empresa: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updated_at?: Date;
}
