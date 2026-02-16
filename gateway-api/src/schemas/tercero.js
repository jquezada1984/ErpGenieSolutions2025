// src/schemas/tercero.js

const uuid = { type: 'string', minLength: 1 }; // validación ligera (el microservicio valida a fondo)

const booleanish = { type: 'boolean' };
const stringOpt = { type: 'string' };
const numberOpt = { type: 'number' };

const terceroCreateSchema = {
  type: 'object',
  additionalProperties: true,
  required: ['nombre'],
  properties: {
    // roles
    cliente_potencial: booleanish,
    cliente: booleanish,
    proveedor: booleanish,

    // general
    nombre: { type: 'string', minLength: 1 },
    apodo: stringOpt,
    codigo_cliente: stringOpt,
    estado: booleanish,
    sujeto_iva: booleanish,
    id_tipo_tercero: uuid,
    tipo_entidad_comercial: stringOpt,

    // ubicación / contacto
    direccion: stringOpt,
    poblacion: stringOpt,
    codigo_postal: stringOpt,
    id_pais: uuid,
    provincia: stringOpt,
    telefono: stringOpt,
    movil: stringOpt,
    fax: stringOpt,
    web: stringOpt,
    correo: stringOpt,
    logo: stringOpt,

    // comercial / organización
    id_condicion_pago: uuid,
    id_forma_pago: uuid,
    capital: numberOpt,
    id_profesional_1: stringOpt,
    id_profesional_2: stringOpt,
    cif_intra: stringOpt,
    sede_central: uuid,
    asignado_a: uuid,
  },
};

const terceroUpdateSchema = {
  type: 'object',
  additionalProperties: true,
  minProperties: 1,
  properties: terceroCreateSchema.properties,
};

module.exports = {
  terceroCreateSchema,
  terceroUpdateSchema,
};
