// Esquema para crear sucursal
const sucursalSchema = {
  type: 'object',
  properties: {
    id_empresa: {
      type: 'string',
      description: 'ID de la empresa'
    },
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la sucursal'
    },
    direccion: {
      type: 'string',
      maxLength: 255,
      description: 'Dirección de la sucursal'
    },
    telefono: {
      type: 'string',
      maxLength: 20,
      description: 'Teléfono de la sucursal'
    },
    codigo_establecimiento: {
      type: 'string',
      maxLength: 50,
      description: 'Código del establecimiento'
    },
    estado: {
      type: 'boolean',
      description: 'Estado de la sucursal'
    }
  },
  required: ['id_empresa', 'nombre'],
  additionalProperties: false
};

// Esquema para actualizar sucursal
const sucursalUpdateSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la sucursal'
    },
    direccion: {
      type: 'string',
      maxLength: 255,
      description: 'Dirección de la sucursal'
    },
    telefono: {
      type: 'string',
      maxLength: 20,
      description: 'Teléfono de la sucursal'
    },
    codigo_establecimiento: {
      type: 'string',
      maxLength: 50,
      description: 'Código del establecimiento'
    },
    estado: {
      type: 'boolean',
      description: 'Estado de la sucursal'
    }
  },
  additionalProperties: false
};

module.exports = {
  sucursalSchema,
  sucursalUpdateSchema
}; 