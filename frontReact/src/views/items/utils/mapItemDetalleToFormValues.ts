import { getDefaultItemFormValues, type ItemFormValues } from '../schemas/itemSchema';

/** Respuesta GraphQL `itemDetalleEdicion` (campos alineados con ItemNestJs). */
export interface ItemDetalleEdicionGql {
  id_item: string;
  id_empresa: string;
  producto_ref?: string | null;
  etiqueta: string;
  estado: boolean;
  descripcion?: string | null;
  url_publica?: string | null;
  nota_interna?: string | null;
  inventariable?: boolean | null;
  peso?: number | null;
  longitud?: number | null;
  anchura?: number | null;
  altura?: number | null;
  superficie?: number | null;
  volumen?: number | null;
  nomenclatura_aduanera?: string | null;
  precio_venta?: number | null;
  precio_minimo?: number | null;
  impuesto_id?: string | null;
  precio_compra?: number | null;
  stock_minimo_alerta?: number | null;
  stock_deseado?: number | null;
  codigo_barras?: string | null;
  id_pais?: string | null;
  id_provincia?: string | null;
  poblacion?: string | null;
  id_unidad_medida?: string | null;
  id_unidad_peso?: string | null;
  id_unidad_longitud?: string | null;
  id_unidad_superficie?: string | null;
  id_unidad_volumen?: string | null;
  id_almacen_defecto?: string | null;
  id_categoria_item?: string | null;
  id_estado_venta?: string | null;
  id_estado_compra?: string | null;
  id_tipo_control_caducidad?: string | null;
  id_tipo_item?: string | null;
  id_tipo_control_inventario?: string | null;
  id_naturaleza_item?: string | null;
  id_tipo_comportamiento?: string | null;
  id_cuenta_venta?: string | null;
  id_cuenta_venta_intracomunitaria?: string | null;
  id_cuenta_venta_exportacion?: string | null;
  id_cuenta_compra?: string | null;
  id_cuenta_compra_intracomunitaria?: string | null;
  id_cuenta_compra_importacion?: string | null;
}

const str = (v: string | null | undefined) => (v != null ? String(v).trim() : '');

const num0 = (v: number | null | undefined) =>
  v != null && Number.isFinite(Number(v)) ? Number(v) : 0;

/**
 * Mapea lectura ItemNestJs → valores del formulario (IDs para combos, no labels).
 * Campos no persistidos en `item` se dejan en default del formulario.
 */
export function mapItemDetalleToFormValues(d: ItemDetalleEdicionGql | null | undefined): ItemFormValues {
  const base = getDefaultItemFormValues('producto');
  if (!d) return base;

  const invent = d.inventariable !== false;

  return {
    ...base,
    id_empresa: str(d.id_empresa) || base.id_empresa,
    nombre: str(d.etiqueta) || base.nombre,
    codigo: str(d.producto_ref) || base.codigo,
    etiqueta: str(d.etiqueta) || base.etiqueta,
    descripcion: str(d.descripcion) || base.descripcion,
    url_publica: str(d.url_publica) || base.url_publica,
    nota_privada: str(d.nota_interna) || base.nota_privada,
    estado: d.estado !== false,
    tipo_item: invent ? 'producto' : 'servicio',
    id_tipo_item: str(d.id_tipo_item) || base.id_tipo_item,
    id_tipo_comportamiento: str(d.id_tipo_comportamiento) || base.id_tipo_comportamiento,
    id_estado_venta: str(d.id_estado_venta) || base.id_estado_venta,
    estado_venta: base.estado_venta,
    id_estado_compra: str(d.id_estado_compra) || base.id_estado_compra,
    estado_compra: base.estado_compra,
    usar_lote_serie: base.usar_lote_serie,
    fecha_caducidad_obligatoria: base.fecha_caducidad_obligatoria,
    naturaleza_producto: base.naturaleza_producto,
    id_naturaleza_item: str(d.id_naturaleza_item) || base.id_naturaleza_item,
    id_tipo_control_inventario: str(d.id_tipo_control_inventario) || base.id_tipo_control_inventario,
    id_tipo_control_caducidad: str(d.id_tipo_control_caducidad) || base.id_tipo_control_caducidad,
    precio_venta: num0(d.precio_venta),
    precio_venta_minimo: num0(d.precio_minimo),
    id_moneda_venta: base.id_moneda_venta,
    tasa_iva: base.tasa_iva,
    impuesto_id: str(d.impuesto_id) || base.impuesto_id,
    etiquetas: base.etiquetas,
    precio_compra: num0(d.precio_compra),
    id_moneda_compra: base.id_moneda_compra,
    id_almacen_defecto: str(d.id_almacen_defecto) || base.id_almacen_defecto,
    stock_actual: base.stock_actual,
    stock_minimo: num0(d.stock_minimo_alerta),
    stock_deseado: num0(d.stock_deseado),
    unidad_medida: str(d.id_unidad_medida) || base.unidad_medida,
    peso: num0(d.peso),
    unidad_peso: str(d.id_unidad_peso) || base.unidad_peso,
    largo: num0(d.longitud),
    ancho: num0(d.anchura),
    alto: num0(d.altura),
    unidad_dimension: str(d.id_unidad_longitud) || base.unidad_dimension,
    superficie: num0(d.superficie),
    unidad_superficie: str(d.id_unidad_superficie) || base.unidad_superficie,
    volumen: num0(d.volumen),
    unidad_volumen: str(d.id_unidad_volumen) || base.unidad_volumen,
    nomenclatura_aduanera: str(d.nomenclatura_aduanera) || base.nomenclatura_aduanera,
    id_pais_origen: str(d.id_pais) || base.id_pais_origen,
    id_provincia_origen: str(d.id_provincia) || base.id_provincia_origen,
    descripcion_servicio: base.descripcion_servicio,
    cuenta_venta: str(d.id_cuenta_venta) || base.cuenta_venta,
    cuenta_venta_intracomunitaria: str(d.id_cuenta_venta_intracomunitaria) || base.cuenta_venta_intracomunitaria,
    cuenta_venta_exportacion: str(d.id_cuenta_venta_exportacion) || base.cuenta_venta_exportacion,
    cuenta_compra: str(d.id_cuenta_compra) || base.cuenta_compra,
    cuenta_compra_intracomunitaria: str(d.id_cuenta_compra_intracomunitaria) || base.cuenta_compra_intracomunitaria,
    cuenta_compra_importacion: str(d.id_cuenta_compra_importacion) || base.cuenta_compra_importacion,
  };
}
