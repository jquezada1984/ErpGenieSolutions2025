import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

/**
 * Lectura completa de `public.item` para precargar el formulario de edición (solo GraphQL, sin entidad TypeORM).
 * Nombres alineados con columnas BD / payload de creación ItemPython.
 */
@ObjectType()
export class ItemDetalleEdicion {
  @Field(() => ID)
  id_item: string;

  @Field(() => ID)
  id_empresa: string;

  @Field(() => String, { nullable: true })
  producto_ref?: string | null;

  @Field(() => String)
  etiqueta: string;

  @Field(() => Boolean)
  estado: boolean;

  @Field(() => String, { nullable: true })
  descripcion?: string | null;

  @Field(() => String, { nullable: true })
  url_publica?: string | null;

  @Field(() => String, { nullable: true })
  nota_interna?: string | null;

  @Field(() => Boolean, { nullable: true })
  inventariable?: boolean | null;

  @Field(() => Float, { nullable: true })
  peso?: number | null;

  @Field(() => Float, { nullable: true })
  longitud?: number | null;

  @Field(() => Float, { nullable: true })
  anchura?: number | null;

  @Field(() => Float, { nullable: true })
  altura?: number | null;

  @Field(() => Float, { nullable: true })
  superficie?: number | null;

  @Field(() => Float, { nullable: true })
  volumen?: number | null;

  @Field(() => String, { nullable: true })
  nomenclatura_aduanera?: string | null;

  @Field(() => Float, { nullable: true })
  precio_venta?: number | null;

  @Field(() => Float, { nullable: true })
  precio_minimo?: number | null;

  @Field(() => String, { nullable: true })
  impuesto_id?: string | null;

  @Field(() => Float, { nullable: true })
  precio_compra?: number | null;

  @Field(() => Float, { nullable: true })
  stock_minimo_alerta?: number | null;

  @Field(() => Float, { nullable: true })
  stock_deseado?: number | null;

  @Field(() => String, { nullable: true })
  codigo_barras?: string | null;

  @Field(() => ID, { nullable: true })
  id_pais?: string | null;

  @Field(() => ID, { nullable: true })
  id_provincia?: string | null;

  @Field(() => String, { nullable: true })
  poblacion?: string | null;

  @Field(() => ID, { nullable: true })
  id_unidad_medida?: string | null;

  @Field(() => ID, { nullable: true })
  id_unidad_peso?: string | null;

  @Field(() => ID, { nullable: true })
  id_unidad_longitud?: string | null;

  @Field(() => ID, { nullable: true })
  id_unidad_superficie?: string | null;

  @Field(() => ID, { nullable: true })
  id_unidad_volumen?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen_defecto?: string | null;

  @Field(() => ID, { nullable: true })
  id_categoria_item?: string | null;

  @Field(() => ID, { nullable: true })
  id_estado_venta?: string | null;

  @Field(() => ID, { nullable: true })
  id_estado_compra?: string | null;

  @Field(() => ID, { nullable: true })
  id_tipo_control_caducidad?: string | null;

  @Field(() => ID, { nullable: true })
  id_tipo_item?: string | null;

  @Field(() => ID, { nullable: true })
  id_tipo_control_inventario?: string | null;

  @Field(() => ID, { nullable: true })
  id_naturaleza_item?: string | null;

  @Field(() => ID, { nullable: true })
  id_tipo_comportamiento?: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_venta?: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_venta_intracomunitaria?: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_venta_exportacion?: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_compra?: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_compra_intracomunitaria?: string | null;

  @Field(() => ID, { nullable: true })
  id_cuenta_compra_importacion?: string | null;
}
