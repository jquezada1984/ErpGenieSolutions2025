// Esquema para crear sección de menú
const menuSeccionSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la sección'
    },
    orden: {
      type: 'integer',
      minimum: 0,
      description: 'Orden de la sección'
    },
    icono: {
      type: 'string',
      maxLength: 100,
      description: 'Icono de la sección'
    }
  },
  required: ['nombre'],
  additionalProperties: false
};

// Esquema para actualizar sección de menú
const menuSeccionUpdateSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la sección'
    },
    orden: {
      type: 'integer',
      minimum: 0,
      description: 'Orden de la sección'
    },
    icono: {
      type: 'string',
      maxLength: 100,
      description: 'Icono de la sección'
    }
  },
  additionalProperties: false
};

// Esquema para crear item de menú
const menuItemSchema = {
  type: 'object',
  properties: {
    id_seccion: {
      type: 'string',
      description: 'ID de la sección'
    },
    parent_id: {
      type: 'string',
      description: 'ID del item padre (opcional)'
    },
    etiqueta: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Etiqueta del item'
    },
    icono: {
      type: 'string',
      maxLength: 100,
      description: 'Icono del item'
    },
    ruta: {
      type: 'string',
      maxLength: 255,
      description: 'Ruta del item'
    },
    es_clickable: {
      type: 'boolean',
      description: 'Si el item es clickeable'
    },
    orden: {
      type: 'integer',
      minimum: 0,
      description: 'Orden del item'
    },
    muestra_badge: {
      type: 'boolean',
      description: 'Si muestra badge'
    },
    badge_text: {
      type: 'string',
      maxLength: 20,
      description: 'Texto del badge'
    },
    estado: {
      type: 'boolean',
      description: 'Estado del item'
    },
    created_by: {
      type: 'string',
      description: 'ID del usuario que creó el item'
    }
  },
  required: ['id_seccion', 'etiqueta'],
  additionalProperties: false
};

// Esquema para actualizar item de menú
const menuItemUpdateSchema = {
  type: 'object',
  properties: {
    etiqueta: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Etiqueta del item'
    },
    icono: {
      type: 'string',
      maxLength: 100,
      description: 'Icono del item'
    },
    ruta: {
      type: 'string',
      maxLength: 255,
      description: 'Ruta del item'
    },
    es_clickable: {
      type: 'boolean',
      description: 'Si el item es clickeable'
    },
    orden: {
      type: 'integer',
      minimum: 0,
      description: 'Orden del item'
    },
    muestra_badge: {
      type: 'boolean',
      description: 'Si muestra badge'
    },
    badge_text: {
      type: 'string',
      maxLength: 20,
      description: 'Texto del badge'
    },
    estado: {
      type: 'boolean',
      description: 'Estado del item'
    },
    updated_by: {
      type: 'string',
      description: 'ID del usuario que actualizó el item'
    }
  },
  additionalProperties: false
};

module.exports = {
  menuSeccionSchema,
  menuSeccionUpdateSchema,
  menuItemSchema,
  menuItemUpdateSchema
}; 