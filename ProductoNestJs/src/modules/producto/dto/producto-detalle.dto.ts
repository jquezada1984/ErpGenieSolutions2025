import { ObjectType, Field, ID, Float, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class ProductoDetalleDTO {
  @Field(() => ID)
  id_producto: string;

  @Field()
  producto_ref: string;

  @Field({ nullable: true })
  etiqueta?: string;

  @Field({ nullable: true })
  estado_venta?: string;

  @Field({ nullable: true })
  estado_compra?: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  url_publica?: string;

  @Field({ nullable: true })
  naturaleza?: string;

  @Field(() => Float, { nullable: true })
  peso?: number;

  @Field(() => Float, { nullable: true })
  longitud?: number;

  @Field(() => Float, { nullable: true })
  anchura?: number;

  @Field(() => Float, { nullable: true })
  altura?: number;

  @Field({ nullable: true })
  unidad_longitud?: string;

  @Field(() => Float, { nullable: true })
  superficie?: number;

  @Field({ nullable: true })
  unidad_superficie?: string;

  @Field(() => Float, { nullable: true })
  volumen?: number;

  @Field({ nullable: true })
  unidad_volumen?: string;

  @Field({ nullable: true })
  nomenclatura_aduanera?: string;

  @Field({ nullable: true })
  pais_origen?: string;

  @Field({ nullable: true })
  provincia_origen?: string;

  @Field({ nullable: true })
  nota_interna?: string;

  @Field(() => Float, { nullable: true })
  precio_venta?: number;

  @Field(() => Float, { nullable: true })
  precio_minimo?: number;

  @Field(() => Int, { nullable: true })
  impuesto_id?: number;

  @Field({ nullable: true })
  contabilidad_venta?: string;

  @Field({ nullable: true })
  contabilidad_exportacion?: string;

  @Field({ nullable: true })
  contabilidad_compra?: string;

  @Field({ nullable: true })
  contabilidad_importacion?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updated_at?: Date;

  @Field(() => ID)
  id_empresa: string;
}
