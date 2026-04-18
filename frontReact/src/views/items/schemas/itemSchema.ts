import * as yup from 'yup';

/**
 * Valores del formulario compartidos entre producto y servicio (módulo item).
 * id_empresa aplica patrón GLOBAL/EMPRESA (SelectEmpresa o JWT).
 * Campos ampliados inspirados en referencia funcional (Dolibarr), frontend only.
 */
export interface ItemFormValues {
  id_empresa: string;
  nombre: string;
  codigo: string;
  etiqueta: string;
  descripcion: string;
  url_publica: string;
  nota_privada: string;
  estado: boolean;
  tipo_item: 'producto' | 'servicio';
  /** UUID public.tipo_item_catalogo (combo Tipo de ítem, pestaña Empresa) */
  id_tipo_item: string;
  /** UUID public.tipo_comportamiento_item (segundo nivel de clasificación) */
  id_tipo_comportamiento: string;
  /** Id del catálogo estado_venta_item (select Estado venta en tab General) */
  id_estado_venta: string;
  estado_venta: number;
  /** Id del catálogo estado_compra_item (select Estado compra en tab General) */
  id_estado_compra: string;
  estado_compra: number;
  usar_lote_serie: boolean;
  fecha_caducidad_obligatoria: boolean;
  naturaleza_producto: string;
  /** UUID catálogo naturaleza_item_catalogo (valor real del combo) */
  id_naturaleza_item: string;
  /** UUID tipo_control_inventario_item */
  id_tipo_control_inventario: string;
  /** UUID tipo_control_caducidad_item */
  id_tipo_control_caducidad: string;
  // Venta
  precio_venta: number;
  precio_venta_minimo: number;
  id_moneda_venta: string;
  tasa_iva: number;
  /** Id del impuesto del catálogo (GraphQL impuestos.id), para persistir impuesto_id */
  impuesto_id: string;
  etiquetas: string;
  // Compra (producto)
  precio_compra: number;
  id_moneda_compra: string;
  // Inventario / logística (producto)
  id_almacen_defecto: string;
  stock_actual: number;
  stock_minimo: number;
  stock_deseado: number;
  unidad_medida: string;
  peso: number;
  unidad_peso: string;
  largo: number;
  ancho: number;
  alto: number;
  unidad_dimension: string;
  superficie: number;
  unidad_superficie: string;
  volumen: number;
  unidad_volumen: string;
  nomenclatura_aduanera: string;
  id_pais_origen: string;
  id_provincia_origen: string;
  // Servicio
  descripcion_servicio: string;
  // Contabilidad
  cuenta_venta: string;
  cuenta_venta_intracomunitaria: string;
  cuenta_venta_exportacion: string;
  cuenta_compra: string;
  cuenta_compra_intracomunitaria: string;
  cuenta_compra_importacion: string;
}

const numMinZero = () =>
  yup
    .number()
    .typeError('Debe ser un número')
    .transform((v) => (v === '' || v == null ? undefined : Number(v)))
    .min(0, 'No puede ser negativo');

export const ItemSchema = yup.object({
  id_empresa: yup.string().required('La empresa es obligatoria'),
  nombre: yup.string().required('El nombre es obligatorio').trim(),
  codigo: yup.string().trim(),
  etiqueta: yup.string().trim(),
  descripcion: yup.string().trim(),
  url_publica: yup.string().trim().transform((v) => (v === '' ? undefined : v)).url('URL no válida').optional(),
  nota_privada: yup.string().trim(),
  estado: yup.boolean(),
  tipo_item: yup.string().oneOf(['producto', 'servicio']).required(),
  id_tipo_item: yup.string().trim(),
  id_tipo_comportamiento: yup
    .string()
    .trim()
    .when('tipo_item', {
      is: 'producto',
      then: (schema) => schema.required('Seleccione el tipo de comportamiento'),
      otherwise: (schema) => schema,
    }),
  id_estado_venta: yup.string().trim().optional(),
  estado_venta: numMinZero().optional(),
  id_estado_compra: yup.string().trim().optional(),
  estado_compra: numMinZero().optional(),
  usar_lote_serie: yup.boolean(),
  fecha_caducidad_obligatoria: yup.boolean(),
  naturaleza_producto: yup.string().trim(),
  id_naturaleza_item: yup.string().trim(),
  id_tipo_control_inventario: yup.string().trim(),
  id_tipo_control_caducidad: yup.string().trim(),
  precio_venta: numMinZero().optional(),
  precio_venta_minimo: numMinZero().optional(),
  id_moneda_venta: yup.string().trim(),
  tasa_iva: numMinZero().optional(),
  impuesto_id: yup.string().trim(),
  etiquetas: yup.string().trim(),
  precio_compra: numMinZero().optional(),
  id_moneda_compra: yup.string().trim(),
  id_almacen_defecto: yup.string().trim(),
  stock_actual: numMinZero().optional(),
  stock_minimo: numMinZero().optional(),
  stock_deseado: numMinZero().optional(),
  unidad_medida: yup.string().trim(),
  peso: numMinZero().optional(),
  unidad_peso: yup.string().trim(),
  largo: numMinZero().optional(),
  ancho: numMinZero().optional(),
  alto: numMinZero().optional(),
  unidad_dimension: yup.string().trim(),
  superficie: numMinZero().optional(),
  unidad_superficie: yup.string().trim(),
  volumen: numMinZero().optional(),
  unidad_volumen: yup.string().trim(),
  nomenclatura_aduanera: yup.string().trim(),
  id_pais_origen: yup.string().trim(),
  id_provincia_origen: yup.string().trim(),
  descripcion_servicio: yup.string().trim(),
  cuenta_venta: yup.string().trim(),
  cuenta_venta_intracomunitaria: yup.string().trim(),
  cuenta_venta_exportacion: yup.string().trim(),
  cuenta_compra: yup.string().trim(),
  cuenta_compra_intracomunitaria: yup.string().trim(),
  cuenta_compra_importacion: yup.string().trim(),
});

/** Valores por defecto del formulario item (producto/servicio). Una sola fuente para todos los formularios. */
export const getDefaultItemFormValues = (tipo_item: 'producto' | 'servicio'): ItemFormValues => ({
  id_empresa: '',
  nombre: '',
  codigo: '',
  etiqueta: '',
  descripcion: '',
  url_publica: '',
  nota_privada: '',
  estado: true,
  tipo_item,
  id_tipo_item: '',
  id_tipo_comportamiento: '',
  id_estado_venta: '',
  estado_venta: 0,
  id_estado_compra: '',
  estado_compra: 0,
  usar_lote_serie: false,
  fecha_caducidad_obligatoria: false,
  naturaleza_producto: '',
  id_naturaleza_item: '',
  id_tipo_control_inventario: '',
  id_tipo_control_caducidad: '',
  precio_venta: 0,
  precio_venta_minimo: 0,
  id_moneda_venta: '',
  tasa_iva: 0,
  impuesto_id: '',
  etiquetas: '',
  precio_compra: 0,
  id_moneda_compra: '',
  id_almacen_defecto: '',
  stock_actual: 0,
  stock_minimo: 0,
  stock_deseado: 0,
  unidad_medida: '',
  peso: 0,
  unidad_peso: '',
  largo: 0,
  ancho: 0,
  alto: 0,
  unidad_dimension: '',
  superficie: 0,
  unidad_superficie: '',
  volumen: 0,
  unidad_volumen: '',
  nomenclatura_aduanera: '',
  id_pais_origen: '',
  id_provincia_origen: '',
  descripcion_servicio: '',
  cuenta_venta: '',
  cuenta_venta_intracomunitaria: '',
  cuenta_venta_exportacion: '',
  cuenta_compra: '',
  cuenta_compra_intracomunitaria: '',
  cuenta_compra_importacion: '',
});
