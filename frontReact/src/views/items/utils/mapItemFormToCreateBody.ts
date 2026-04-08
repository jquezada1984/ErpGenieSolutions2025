import type { ItemFormValues } from '../schemas/itemSchema';

const trim = (s: string | undefined | null) => (s ?? '').trim();

/** Solo incluye claves con valor útil (evita enviar "" en FKs opcionales). */
function put(
  out: Record<string, unknown>,
  key: string,
  val: string | number | boolean | null | undefined
) {
  if (val === undefined || val === null) return;
  if (typeof val === 'string' && val === '') return;
  out[key] = val;
}

/**
 * Cuerpo JSON alineado con columnas de `item` para POST vía Gateway → ItemPython.
 * Los catálogos ya deben traer IDs en el estado del formulario.
 */
export function mapItemFormToCreateBody(v: ItemFormValues): Record<string, unknown> {
  const etiqueta = trim(v.nombre) || trim(v.etiqueta) || trim(v.codigo);
  const out: Record<string, unknown> = {
    id_empresa: trim(v.id_empresa),
    etiqueta,
    estado: v.estado !== false,
    inventariable: v.tipo_item === 'producto',
  };

  put(out, 'producto_ref', trim(v.codigo));
  put(out, 'descripcion', trim(v.descripcion));
  put(out, 'url_publica', trim(v.url_publica));
  put(out, 'nota_interna', trim(v.nota_privada));

  put(out, 'precio_venta', v.precio_venta);
  put(out, 'precio_minimo', v.precio_venta_minimo);
  put(out, 'precio_compra', v.precio_compra);
  put(out, 'peso', v.peso);
  put(out, 'longitud', v.largo);
  put(out, 'anchura', v.ancho);
  put(out, 'altura', v.alto);
  put(out, 'superficie', v.superficie);
  put(out, 'volumen', v.volumen);
  put(out, 'nomenclatura_aduanera', trim(v.nomenclatura_aduanera));
  put(out, 'stock_minimo_alerta', v.stock_minimo);
  put(out, 'stock_deseado', v.stock_deseado);

  put(out, 'id_unidad_medida', trim(v.unidad_medida));
  put(out, 'id_unidad_peso', trim(v.unidad_peso));
  put(out, 'id_unidad_longitud', trim(v.unidad_dimension));
  put(out, 'id_unidad_superficie', trim(v.unidad_superficie));
  put(out, 'id_unidad_volumen', trim(v.unidad_volumen));
  put(out, 'id_almacen_defecto', trim(v.id_almacen_defecto));
  put(out, 'id_pais', trim(v.id_pais_origen));
  put(out, 'id_provincia', trim(v.id_provincia_origen));

  put(out, 'id_tipo_item', trim(v.id_tipo_item));
  put(out, 'id_tipo_comportamiento', trim(v.id_tipo_comportamiento));
  put(out, 'id_estado_venta', trim(v.id_estado_venta));
  put(out, 'id_estado_compra', trim(v.id_estado_compra));
  put(out, 'id_naturaleza_item', trim(v.id_naturaleza_item));
  put(out, 'id_tipo_control_inventario', trim(v.id_tipo_control_inventario));
  put(out, 'id_tipo_control_caducidad', trim(v.id_tipo_control_caducidad));
  put(out, 'impuesto_id', trim(v.impuesto_id));

  put(out, 'id_cuenta_venta', trim(v.cuenta_venta));
  put(out, 'id_cuenta_venta_intracomunitaria', trim(v.cuenta_venta_intracomunitaria));
  put(out, 'id_cuenta_venta_exportacion', trim(v.cuenta_venta_exportacion));
  put(out, 'id_cuenta_compra', trim(v.cuenta_compra));
  put(out, 'id_cuenta_compra_intracomunitaria', trim(v.cuenta_compra_intracomunitaria));
  put(out, 'id_cuenta_compra_importacion', trim(v.cuenta_compra_importacion));

  return out;
}
