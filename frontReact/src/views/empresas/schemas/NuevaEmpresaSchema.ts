import * as yup from 'yup';

export interface NuevaEmpresaFormValues {
  nombre: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado?: boolean;
  id_moneda?: string;
  id_pais?: string;
  codigo_postal?: string;
  poblacion?: string;
  movil?: string;
  fax?: string;
  web?: string;
  nota?: string;
  sujeto_iva?: boolean;
  id_provincia?: string;
  fiscal_year_start_month?: number;
  fiscal_year_start_day?: number;
}

export const NuevaEmpresaSchema = yup.object({
  nombre: yup
    .string()
    .trim()
    .required('La razón social es obligatoria'),

  ruc: yup
    .string()
    .trim()
    .required('El RUC es obligatorio'),
});
