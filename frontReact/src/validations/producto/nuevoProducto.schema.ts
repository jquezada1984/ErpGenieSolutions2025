import * as yup from "yup";

/**
 * Schema de validación para el formulario Nuevo Producto.
 * Nombres de campos alineados con ProductoForm / payload existente.
 * Validación solo en submit (mode: "onSubmit").
 */
export const NuevoProductoSchema = yup.object({
  producto_ref: yup
    .string()
    .required("Referencia del producto es obligatoria.")
    .trim(),
  etiqueta: yup
    .string()
    .required("Etiqueta es obligatoria.")
    .trim(),
  estado_venta: yup
    .string()
    .oneOf(["VENTA", "NO_VENTA"], "Valor no válido")
    .default("VENTA"),
  estado_compra: yup
    .string()
    .oneOf(["COMPRA", "NO_COMPRA"], "Valor no válido")
    .default("COMPRA"),
  descripcion: yup.string().default(""),
  url_publica: yup.string().default(""),
  naturaleza: yup.string().default(""),
  peso: yup.string().default(""),
  unidad_peso: yup.string().default("kg"),
  longitud: yup.string().default(""),
  anchura: yup.string().default(""),
  altura: yup.string().default(""),
  unidad_longitud: yup.string().default("mm"),
  superficie: yup.string().default(""),
  unidad_superficie: yup.string().default("mm²"),
  volumen: yup.string().default(""),
  unidad_volumen: yup.string().default("mm³"),
  nomenclatura_aduanera: yup.string().default(""),
  pais_id: yup.string().default(""),
  provincia_origen: yup.string().default(""),
  precio_venta: yup.string().default(""),
  precio_minimo: yup.string().default(""),
  impuesto_id: yup
    .string()
    .default("")
    .test(
      "impuesto-valido",
      "Si selecciona impuesto, debe ser un número mayor o igual a 1.",
      (value) => {
        if (!value || String(value).trim() === "") return true;
        const n = Number(value);
        return Number.isFinite(n) && n >= 1;
      }
    ),
  contabilidad_venta: yup.string().default(""),
  contabilidad_exportacion: yup.string().default(""),
  contabilidad_compra: yup.string().default(""),
  contabilidad_importacion: yup.string().default(""),
  nota_interna: yup.string().default(""),
});

export type NuevoProductoFormValues = yup.InferType<typeof NuevoProductoSchema>;
