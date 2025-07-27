// Esquema para crear empresa
const empresaSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la empresa'
    },
    ruc: {
      type: 'string',
      pattern: '^\\d{11}$',
      description: 'RUC de 11 dígitos'
    },
    direccion: {
      type: 'string',
      maxLength: 255,
      description: 'Dirección de la empresa'
    },
    telefono: {
      type: 'string',
      maxLength: 20,
      description: 'Teléfono de la empresa'
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 128,
      description: 'Email de la empresa'
    },
    estado: {
      type: 'boolean',
      description: 'Estado de la empresa'
    },
    id_moneda: {
      type: 'string',
      description: 'ID de la moneda'
    },
    id_pais: {
      type: 'string',
      description: 'ID del país'
    },
    codigo_postal: {
      type: 'string',
      maxLength: 20,
      description: 'Código postal'
    },
    poblacion: {
      type: 'string',
      maxLength: 100,
      description: 'Población'
    },
    movil: {
      type: 'string',
      maxLength: 20,
      description: 'Teléfono móvil'
    },
    fax: {
      type: 'string',
      maxLength: 20,
      description: 'Fax'
    },
    web: {
      type: 'string',
      maxLength: 255,
      description: 'Sitio web'
    },
    nota: {
      type: 'string',
      description: 'Nota'
    },
    sujeto_iva: {
      type: 'boolean',
      description: 'Sujeto a IVA'
    },
    id_provincia: {
      type: 'string',
      description: 'ID de la provincia'
    },
    fiscal_year_start_month: {
      type: 'integer',
      minimum: 1,
      maximum: 12,
      description: 'Mes de inicio del ejercicio fiscal'
    },
    fiscal_year_start_day: {
      type: 'integer',
      minimum: 1,
      maximum: 31,
      description: 'Día de inicio del ejercicio fiscal'
    },
    identificacion: {
      type: 'object',
      description: 'Datos de identificación de la empresa'
    },
    redes_sociales: {
      type: 'array',
      description: 'Redes sociales de la empresa'
    },
    horarios_apertura: {
      type: 'array',
      description: 'Horarios de apertura de la empresa'
    }
  },
  required: ['nombre', 'ruc'],
  additionalProperties: true
};

// Esquema para actualizar empresa (campos opcionales)
const empresaUpdateSchema = {
  type: 'object',
  additionalProperties: true,
  minProperties: 1 // Al menos un campo debe ser proporcionado
};

// Esquema de respuesta para empresa
const empresaResponseSchema = {
  type: 'object',
  properties: {
    id_empresa: { type: 'string' },
    nombre: { type: 'string' },
    ruc: { type: 'string' },
    direccion: { type: 'string' },
    telefono: { type: 'string' },
    email: { type: 'string' },
    estado: { type: 'boolean' },
    id_moneda: { type: 'string' },
    id_pais: { type: 'string' },
    codigo_postal: { type: 'string' },
    poblacion: { type: 'string' },
    movil: { type: 'string' },
    fax: { type: 'string' },
    web: { type: 'string' },
    nota: { type: 'string' },
    sujeto_iva: { type: 'boolean' },
    id_provincia: { type: 'string' },
    fiscal_year_start_month: { type: 'integer' },
    fiscal_year_start_day: { type: 'integer' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
};

module.exports = {
  empresaSchema,
  empresaUpdateSchema,
  empresaResponseSchema
}; 