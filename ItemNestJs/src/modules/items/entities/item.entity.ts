import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { EstadoVentaItem } from '../../catalogos/entities/estado-venta-item.entity';
import { EstadoCompraItem } from '../../catalogos/entities/estado-compra-item.entity';
import { DuracionUnidadCatalogo } from '../../catalogos/entities/duracion-unidad-catalogo.entity';
import { TipoItemCatalogo } from '../../catalogos/entities/tipo-item-catalogo.entity';
import { EmpresaItemRef } from './empresa-item-ref.entity';

@ObjectType()
@Entity('item')
export class Item {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id_item: string;

  @Field(() => ID)
  @Column('uuid')
  id_empresa: string;

  @Field(() => EmpresaItemRef, { nullable: true })
  @ManyToOne(() => EmpresaItemRef, { nullable: true })
  @JoinColumn({ name: 'id_empresa' })
  empresa?: EmpresaItemRef | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  producto_ref: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  etiqueta: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  codigo_barras: string | null;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 6,
    nullable: true,
    transformer: {
      to: (v: number | null) => v,
      from: (v: string | null) => (v == null || v === '' ? null : parseFloat(v)),
    },
  })
  precio_venta: number | null;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 6,
    nullable: true,
    transformer: {
      to: (v: number | null) => v,
      from: (v: string | null) => (v == null || v === '' ? null : parseFloat(v)),
    },
  })
  precio_compra: number | null;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 6,
    nullable: true,
    transformer: {
      to: (v: number | null) => v,
      from: (v: string | null) => (v == null || v === '' ? null : parseFloat(v)),
    },
  })
  stock_minimo_alerta: number | null;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 6,
    nullable: true,
    transformer: {
      to: (v: number | null) => v,
      from: (v: string | null) => (v == null || v === '' ? null : parseFloat(v)),
    },
  })
  stock_deseado: number | null;

  @Field(() => EstadoVentaItem, { nullable: true })
  @ManyToOne(() => EstadoVentaItem, { nullable: true })
  @JoinColumn({ name: 'id_estado_venta' })
  estadoVenta?: EstadoVentaItem | null;

  @Field(() => EstadoCompraItem, { nullable: true })
  @ManyToOne(() => EstadoCompraItem, { nullable: true })
  @JoinColumn({ name: 'id_estado_compra' })
  estadoCompra?: EstadoCompraItem | null;

  /** FK catálogo tipo ítem (PRODUCT, SERVICE, …). Sin @Field: solo uso interno / joins. */
  @ManyToOne(() => TipoItemCatalogo, { nullable: true })
  @JoinColumn({ name: 'id_tipo_item' })
  tipoItem?: TipoItemCatalogo | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration_value: number | null;

  @Field(() => DuracionUnidadCatalogo, { nullable: true })
  @ManyToOne(() => DuracionUnidadCatalogo, { nullable: true })
  @JoinColumn({ name: 'id_duration_unit' })
  duracionUnidad?: DuracionUnidadCatalogo | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
