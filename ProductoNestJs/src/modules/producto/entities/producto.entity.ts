import { ObjectType, Field, ID, GraphQLISODateTime, Float, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'producto', schema: 'public' })
export class Producto {
  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid', name: 'id_producto' })
  id_producto: string;

  @Field()
  @Column({ name: 'producto_ref', type: 'varchar', nullable: false })
  producto_ref: string;

  @Field({ nullable: true })
  @Column({ name: 'etiqueta', type: 'varchar', nullable: true })
  etiqueta?: string;

  @Field({ nullable: true })
  @Column({ name: 'estado_venta', type: 'varchar', nullable: true })
  estado_venta?: string;

  @Field({ nullable: true })
  @Column({ name: 'estado_compra', type: 'varchar', nullable: true })
  estado_compra?: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ name: 'estado', type: 'boolean', nullable: false, default: true })
  estado?: boolean;

  @Field({ nullable: true })
  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  @Column({ name: 'url_publica', type: 'text', nullable: true })
  url_publica?: string;

  @Field({ nullable: true })
  @Column({ name: 'naturaleza', type: 'varchar', nullable: true })
  naturaleza?: string;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'peso', type: 'numeric', nullable: true })
  peso?: number;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'longitud', type: 'numeric', nullable: true })
  longitud?: number;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'anchura', type: 'numeric', nullable: true })
  anchura?: number;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'altura', type: 'numeric', nullable: true })
  altura?: number;

  @Field({ nullable: true })
  @Column({ name: 'unidad_longitud', type: 'varchar', nullable: true })
  unidad_longitud?: string;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'superficie', type: 'numeric', nullable: true })
  superficie?: number;

  @Field({ nullable: true })
  @Column({ name: 'unidad_superficie', type: 'varchar', nullable: true })
  unidad_superficie?: string;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'volumen', type: 'numeric', nullable: true })
  volumen?: number;

  @Field({ nullable: true })
  @Column({ name: 'unidad_volumen', type: 'varchar', nullable: true })
  unidad_volumen?: string;

  @Field({ nullable: true })
  @Column({ name: 'nomenclatura_aduanera', type: 'varchar', nullable: true })
  nomenclatura_aduanera?: string;

  @Field({ nullable: true })
  @Column({ name: 'pais_origen', type: 'varchar', nullable: true })
  pais_origen?: string;

  @Field({ nullable: true })
  @Column({ name: 'provincia_origen', type: 'varchar', nullable: true })
  provincia_origen?: string;

  @Field({ nullable: true })
  @Column({ name: 'nota_interna', type: 'text', nullable: true })
  nota_interna?: string;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'precio_venta', type: 'numeric', nullable: true })
  precio_venta?: number;

  @Field(() => Float, { nullable: true })
  @Column({ name: 'precio_minimo', type: 'numeric', nullable: true })
  precio_minimo?: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'impuesto_id', type: 'integer', nullable: true })
  impuesto_id?: number;

  @Field({ nullable: true })
  @Column({ name: 'contabilidad_venta', type: 'varchar', nullable: true })
  contabilidad_venta?: string;

  @Field({ nullable: true })
  @Column({ name: 'contabilidad_exportacion', type: 'varchar', nullable: true })
  contabilidad_exportacion?: string;

  @Field({ nullable: true })
  @Column({ name: 'contabilidad_compra', type: 'varchar', nullable: true })
  contabilidad_compra?: string;

  @Field({ nullable: true })
  @Column({ name: 'contabilidad_importacion', type: 'varchar', nullable: true })
  contabilidad_importacion?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid', name: 'id_empresa' })
  id_empresa: string;
}
