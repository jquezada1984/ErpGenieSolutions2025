import * as yup from 'yup';



export type NuevaCuentaBancariaFormValues = {

  id_empresa: string;

  referencia: string;

  etiqueta_cuenta: string;

  tipo_cuenta: string;

  id_moneda: string;

  estado_cuenta: string;

  id_pais: string;

  id_provincia: string;

  direccion_banco: string;

  web: string;

  comentario: string;

  comentario_html: string;

  saldo_inicial: number;

  fecha_saldo_inicial: string;

  saldo_minimo_autorizado: number;

  saldo_minimo_deseado: number;

  id_banco: string;

  iban: string;

  numero_cuenta: string;

  id_tercero: string;

  codigo_contable: string;

  id_cuenta_contable: string;

  estado: boolean;

};



export const NuevaCuentaBancariaSchema = yup.object({

  id_empresa: yup.string().trim().required('Seleccione la empresa'),

  referencia: yup.string().trim().max(50),

  etiqueta_cuenta: yup.string().trim().max(255),

  tipo_cuenta: yup

    .string()

    .oneOf(['ahorro', 'corriente', 'caja_efectivo'])

    .required('Seleccione el tipo de cuenta'),

  id_moneda: yup.string().trim().required('Seleccione la divisa'),

  estado_cuenta: yup.string(),

  id_pais: yup.string(),

  id_provincia: yup.string(),

  direccion_banco: yup.string(),

  web: yup.string(),

  comentario: yup.string(),

  comentario_html: yup.string(),

  saldo_inicial: yup.number().min(0, 'El saldo inicial no puede ser negativo').default(0),

  fecha_saldo_inicial: yup.string(),

  saldo_minimo_autorizado: yup.number().min(0, 'No puede ser negativo').default(0),

  saldo_minimo_deseado: yup.number().min(0, 'No puede ser negativo').default(0),

  id_banco: yup.string().trim().required('Seleccione el banco'),

  iban: yup.string(),

  numero_cuenta: yup.string().trim().required('El número de cuenta es obligatorio'),

  id_tercero: yup.string(),

  codigo_contable: yup.string(),

  id_cuenta_contable: yup.string(),

  estado: yup.boolean(),

});



export const initialCuentaForm: NuevaCuentaBancariaFormValues = {

  id_empresa: '',

  referencia: '',

  etiqueta_cuenta: '',

  tipo_cuenta: 'corriente',

  id_moneda: '',

  estado_cuenta: 'abierta',

  id_pais: '',

  id_provincia: '',

  direccion_banco: '',

  web: '',

  comentario: '',

  comentario_html: '',

  saldo_inicial: 0,

  fecha_saldo_inicial: '',

  saldo_minimo_autorizado: 0,

  saldo_minimo_deseado: 0,

  id_banco: '',

  iban: '',

  numero_cuenta: '',

  id_tercero: '',

  codigo_contable: '',

  id_cuenta_contable: '',

  estado: true,

};


