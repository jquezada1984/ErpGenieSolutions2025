// Esquema para crear perfil
const perfilSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      description: 'Nombre del perfil'
    },
    descripcion: {
      type: 'string',
      description: 'Descripción del perfil'
    },
    estado: {
      type: 'boolean',
      description: 'Estado del perfil'
    },
    id_empresa: {
      type: 'string',
      description: 'ID de la empresa'
    }
  },
  required: ['nombre', 'estado', 'id_empresa'],
  additionalProperties: false
};

// Esquema para actualizar perfil
const perfilUpdateSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      description: 'Nombre del perfil'
    },
    descripcion: {
      type: 'string',
      description: 'Descripción del perfil'
    },
    estado: {
      type: 'boolean',
      description: 'Estado del perfil'
    }
  },
  additionalProperties: false
};

module.exports = {
  perfilSchema,
  perfilUpdateSchema
}; 