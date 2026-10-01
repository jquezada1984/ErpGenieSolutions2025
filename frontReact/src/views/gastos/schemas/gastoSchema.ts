import * as yup from 'yup';

const lineaSchema = yup.object({
  id_item: yup.string().nullable().default(null),
  impuesto_id: yup.mixed().nullable().default(null),
  descripcion: yup.string().trim().required('Descripción obligatoria'),
  cantidad: yup
    .number()
    .typeError('Cantidad inválida')
    .required('Cantidad obligatoria')
    .moreThan(0, 'Cantidad debe ser mayor que cero'),
  precio_unitario: yup
    .number()
    .typeError('Precio inválido')
    .required('Precio obligatorio')
    .min(0, 'Precio no puede ser negativo'),
  descuento: yup
    .number()
    .typeError('Descuento inválido')
    .min(0, 'Descuento no puede ser negativo')
    .default(0),
  orden: yup.number().integer().min(1).default(1),
});

export const GastoFormSchema = yup
  .object({
    id_empresa: yup.string().nullable().default(''),
    id_categoria_gasto: yup.string().required('La categoría es obligatoria'),
    id_tercero: yup.string().nullable().default(null),
    tipo_documento: yup.string().nullable().default(''),
    numero_documento: yup.string().nullable().default(''),
    fecha_gasto: yup.string().required('La fecha de gasto es obligatoria'),
    fecha_vencimiento: yup.string().nullable().default(''),
    concepto: yup.string().trim().required('El concepto es obligatorio'),
    observacion: yup.string().nullable().default(''),
    detalles: yup
      .array()
      .of(lineaSchema)
      .min(1, 'Debe existir al menos una línea')
      .required(),
  })
  .test('vencimiento', 'La fecha de vencimiento debe ser >= fecha de gasto', (value) => {
    if (!value?.fecha_vencimiento || !value?.fecha_gasto) return true;
    return value.fecha_vencimiento >= value.fecha_gasto;
  });

export const CategoriaGastoSchema = yup.object({
  codigo: yup.string().trim().required('Código obligatorio').max(20),
  nombre: yup.string().trim().required('Nombre obligatorio').max(100),
  descripcion: yup.string().nullable().default(''),
});

export type GastoLineaForm = yup.InferType<typeof lineaSchema>;
export type GastoFormValues = yup.InferType<typeof GastoFormSchema>;
export type CategoriaGastoFormValues = yup.InferType<typeof CategoriaGastoSchema>;
