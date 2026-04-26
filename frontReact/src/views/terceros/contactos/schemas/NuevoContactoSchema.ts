import * as yup from 'yup';

export interface NuevoContactoFormValues {
  apellidos: string;
  nombre: string;
  titulo: string;
  puesto_trabajo: string;
  fecha_nacimiento: string;
  alerta_cumpleanos: boolean;
  visibilidad: string;
  direccion: string;
  codigo_postal: string;
  poblacion: string;
  id_provincia: string;
  id_pais: string;
  telefono_trabajo: string;
  telefono_particular: string;
  movil: string;
  fax: string;
  correo: string;
  estado: boolean;
}

export const NuevoContactoSchema = yup.object({
  apellidos: yup.string().required('Los apellidos son obligatorios'),
  nombre: yup.string().required('El nombre es obligatorio'),
  titulo: yup.string().optional(),
  puesto_trabajo: yup.string().optional(),
  fecha_nacimiento: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  alerta_cumpleanos: yup.boolean(),
  visibilidad: yup.string().optional(),
  direccion: yup.string().optional(),
  codigo_postal: yup.string().optional(),
  poblacion: yup.string().optional(),
  id_provincia: yup.string().optional(),
  id_pais: yup.string().optional(),
  telefono_trabajo: yup.string().optional(),
  telefono_particular: yup.string().optional(),
  movil: yup.string().optional(),
  fax: yup.string().optional(),
  correo: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .email('Correo inválido')
    .optional(),
  estado: yup.boolean(),
});
