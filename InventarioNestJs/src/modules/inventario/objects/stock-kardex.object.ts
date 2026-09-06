import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlmacenListado {
  @Field(() => ID)
  id_almacen: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field({ nullable: true })
  almacen_ref?: string | null;

  @Field({ nullable: true })
  nombre?: string | null;

  @Field({ nullable: true })
  descripcion?: string | null;

  @Field({ nullable: true })
  direccion?: string | null;

  @Field({ nullable: true })
  codigo_postal?: string | null;

  @Field({ nullable: true })
  poblacion?: string | null;

  @Field(() => ID, { nullable: true })
  id_pais?: string | null;

  @Field(() => ID, { nullable: true })
  id_provincia?: string | null;

  @Field({ nullable: true })
  telefono?: string | null;

  @Field({ nullable: true })
  estado?: boolean | null;
}

@ObjectType()
export class StockListado {
  @Field(() => ID)
  id_stock_producto_almacen: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field(() => Float, { nullable: true })
  stock_fisico?: number | null;

  @Field(() => Float, { nullable: true })
  stock_reservado?: number | null;

  @Field(() => Float, { nullable: true })
  stock_virtual?: number | null;

  @Field(() => Float, { nullable: true })
  stock_disponible?: number | null;

  @Field(() => Float, { nullable: true })
  stock_alerta?: number | null;

  @Field(() => Float, { nullable: true })
  stock_deseado?: number | null;

  @Field({ nullable: true })
  estado?: boolean | null;
}

@ObjectType()
export class MovimientoListado {
  @Field(() => ID)
  id_movimiento_inventario: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field({ nullable: true })
  tipo_movimiento?: string | null;

  @Field(() => Float, { nullable: true })
  cantidad?: number | null;

  @Field(() => Float, { nullable: true })
  costo_unitario?: number | null;

  @Field(() => Float, { nullable: true })
  costo_total?: number | null;

  @Field({ nullable: true })
  fecha_movimiento?: string | null;

  @Field({ nullable: true })
  referencia?: string | null;

  @Field({ nullable: true })
  concepto?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field({ nullable: true })
  modulo_origen?: string | null;

  @Field(() => ID, { nullable: true })
  id_origen?: string | null;

  @Field(() => ID, { nullable: true })
  id_asiento_contable?: string | null;
}

@ObjectType()
export class InventarioLineaListado {
  @Field(() => ID)
  id_inventario_detalle: string;

  @Field(() => ID, { nullable: true })
  id_inventario?: string | null;

  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field(() => Float, { nullable: true })
  stock_sistema?: number | null;

  @Field(() => Float, { nullable: true })
  stock_contado?: number | null;

  @Field(() => Float, { nullable: true })
  diferencia?: number | null;

  @Field({ nullable: true })
  observacion?: string | null;
}

@ObjectType()
export class LoteSerieListado {
  @Field(() => ID)
  id_lote_serie: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field({ nullable: true })
  codigo_lote_serie?: string | null;

  @Field(() => Float, { nullable: true })
  cantidad_actual?: number | null;

  @Field({ nullable: true })
  fecha_caducidad?: string | null;

  @Field({ nullable: true })
  fecha_limite_venta?: string | null;

  @Field({ nullable: true })
  observacion?: string | null;

  @Field({ nullable: true })
  estado?: boolean | null;
}

@ObjectType()
export class StockAFechaListado {
  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field(() => Float, { nullable: true })
  stock_a_fecha?: number | null;
}

@ObjectType()
export class StockReposicionListado {
  @Field(() => ID, { nullable: true })
  id_stock_producto_almacen?: string | null;

  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field(() => Float, { nullable: true })
  stock_fisico?: number | null;

  @Field(() => Float, { nullable: true })
  umbral_alerta?: number | null;

  @Field(() => Float, { nullable: true })
  stock_deseado?: number | null;

  @Field(() => Float, { nullable: true })
  faltante?: number | null;
}

@ObjectType()
export class StockValoracionListado {
  @Field(() => ID, { nullable: true })
  id_item?: string | null;

  @Field({ nullable: true })
  producto_ref?: string | null;

  @Field({ nullable: true })
  etiqueta?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field(() => Float, { nullable: true })
  stock_fisico?: number | null;

  @Field(() => Float, { nullable: true })
  pmp?: number | null;

  @Field(() => Float, { nullable: true })
  valor_total?: number | null;
}

@ObjectType()
export class TransferenciaListado {
  @Field(() => ID)
  id_transferencia_stock: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field({ nullable: true })
  transferencia_ref?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen_origen?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen_destino?: string | null;

  @Field({ nullable: true })
  almacen_origen?: string | null;

  @Field({ nullable: true })
  almacen_destino?: string | null;

  @Field({ nullable: true })
  estado_transferencia?: string | null;

  @Field({ nullable: true })
  fecha_transferencia?: string | null;

  @Field({ nullable: true })
  observacion?: string | null;
}

@ObjectType()
export class CambioMasivoListado {
  @Field(() => ID)
  id_cambio_masivo_stock: string;

  @Field(() => ID, { nullable: true })
  id_empresa?: string | null;

  @Field(() => ID, { nullable: true })
  id_almacen?: string | null;

  @Field({ nullable: true })
  almacen_nombre?: string | null;

  @Field({ nullable: true })
  referencia?: string | null;

  @Field({ nullable: true })
  concepto?: string | null;

  @Field({ nullable: true })
  fecha_movimiento?: string | null;

  @Field({ nullable: true })
  estado_operacion?: string | null;
}
