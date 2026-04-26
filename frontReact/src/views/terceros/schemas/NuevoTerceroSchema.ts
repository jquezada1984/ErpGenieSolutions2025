import * as yup from 'yup';

export interface NuevoTerceroFormValues {
  id_empresa: string;
  cliente_potencial: boolean;
  cliente: boolean;
  proveedor: boolean;
  nombre: string;
  apodo: string;
  codigo_cliente: string;
  codigo_proveedor: string;
  estado: boolean;
  sujeto_iva: boolean;
  id_tipo_tercero: string;
  id_tipo_entidad?: number | string;
  direccion: string;
  poblacion: string;
  codigo_postal: string;
  id_pais: string;
  id_provincia?: string;
  telefono: string;
  movil: string;
  fax: string;
  web: string;
  correo: string;
  logo: string;
  capital: number;
  id_condicion_pago: string;
  id_forma_pago: string;
  id_profesional_1: string;
  id_profesional_2: string;
  cif_intra: string;
  id_tamano_empresa?: string;
  sede_central: string;
  asignado_a: string;
}

export const NuevoTerceroSchema = yup.object({
  id_empresa: yup.string().required('La empresa es obligatoria'),
  cliente_potencial: yup.boolean(),
  cliente: yup.boolean(),
  proveedor: yup.boolean(),
  nombre: yup.string().required('El nombre es obligatorio'),
  apodo: yup.string(),
  codigo_cliente: yup.string(),
  codigo_proveedor: yup.string(),
  estado: yup.boolean(),
  sujeto_iva: yup.boolean(),
  id_tipo_tercero: yup.string(),
  id_tipo_entidad: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' ? null : value
    )
    .notRequired(),
  direccion: yup.string(),
  poblacion: yup.string(),
  codigo_postal: yup.string(),
  id_pais: yup.string(),
  id_provincia: yup.string(),
  telefono: yup.string(),
  movil: yup.string(),
  fax: yup.string(),
  web: yup.string(),
  correo: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .email('Correo inválido')
    .optional(),
  logo: yup.string(),
  capital: yup
    .number()
    .typeError('El capital debe ser un número')
    .transform((v) => {
      if (v === '' || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    })
    .optional()
    .min(0, 'El capital no puede ser negativo'),
  id_condicion_pago: yup.string(),
  id_forma_pago: yup.string(),
  id_profesional_1: yup.string(),
  id_profesional_2: yup.string(),
  cif_intra: yup.string(),
  id_tamano_empresa: yup.string(),
  sede_central: yup.string(),
  asignado_a: yup.string(),
}).test(
  'al-menos-un-rol',
  'Debe seleccionar al menos un rol: cliente potencial, cliente o proveedor.',
  (value) => {
    if (!value) return false;
    return !!(value.cliente_potencial || value.cliente || value.proveedor);
  }
);
