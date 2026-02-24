/*import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class ProductoFilterInput {
  @Field(() => ID)
  id_empresa: string;

  // búsqueda por código o nombre (producto_ref / etiqueta)
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  estado_venta?: string;

  @Field({ nullable: true })
  estado_compra?: string;

  @Field(() => Int, { nullable: true })
  impuesto_id?: number;

  @Field({ nullable: true })
  pais_origen?: string;

  @Field({ nullable: true })
  provincia_origen?: string;

  // paginación
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;

  // orden
  @Field({ nullable: true })
  sortBy?: 'producto_ref' | 'etiqueta' | 'precio_venta' | 'actualizado_en';

  @Field({ nullable: true })
  sortDir?: 'ASC' | 'DESC';
}*/

import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class ProductoFilterInput {
  @Field(() => ID)
  id_empresa: string;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  estado_venta?: string;

  @Field({ nullable: true })
  estado_compra?: string;

  @Field(() => Int, { nullable: true })
  impuesto_id?: number;

  @Field({ nullable: true })
  pais_origen?: string;

  @Field({ nullable: true })
  provincia_origen?: string;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sortDir?: string;
}

