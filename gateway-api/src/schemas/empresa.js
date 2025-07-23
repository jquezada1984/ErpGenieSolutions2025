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
      minLength: 1,
      maxLength: 200,
      description: 'Dirección de la empresa'
    },
    telefono: {
      type: 'string',
      minLength: 1,
      maxLength: 20,
      description: 'Teléfono de la empresa'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email de la empresa'
    }
  },
  required: ['nombre', 'ruc', 'direccion', 'telefono', 'email'],
  additionalProperties: false
};

// Esquema para actualizar empresa (campos opcionales)
const empresaUpdateSchema = {
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
      minLength: 1,
      maxLength: 20,
      description: 'RUC de la empresa (formato flexible)'
    },
    direccion: {
      type: 'string',
      minLength: 1,
      maxLength: 200,
      description: 'Dirección de la empresa'
    },
    telefono: {
      type: 'string',
      minLength: 1,
      maxLength: 20,
      description: 'Teléfono de la empresa'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email de la empresa'
    },
    estado: {
      type: 'boolean',
      description: 'Estado de la empresa'
    }
  },
  additionalProperties: false,
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
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
};

module.exports = {
  empresaSchema,
  empresaUpdateSchema,
  empresaResponseSchema
}; 