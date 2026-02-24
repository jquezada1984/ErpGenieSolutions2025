// gateway-api/src/schemas/producto.js
const productoCreateSchema = {
    type: "object",
    required: ["id_empresa", "producto_ref"],
    additionalProperties: true,
    properties: {
      id_empresa: { type: "string", format: "uuid" },
      producto_ref: { type: "string" },
      etiqueta: { type: "string" },
      estado_venta: { type: "string" },
      estado_compra: { type: "string" },
      descripcion: { type: "string" },
      url_publica: { type: "string" },
      naturaleza: { type: "string" },
      peso: { type: "number" },
      longitud: { type: "number" },
      anchura: { type: "number" },
      altura: { type: "number" },
      unidad_longitud: { type: "string" },
      superficie: { type: "number" },
      unidad_superficie: { type: "string" },
      volumen: { type: "number" },
      unidad_volumen: { type: "string" },
      nomenclatura_aduanera: { type: "string" },
      pais_origen: { type: "string" },
      provincia_origen: { type: "string" },
      nota_interna: { type: "string" },
      precio_venta: { type: "number" },
      precio_minimo: { type: "number" },
      impuesto_id: { type: ["number", "null"] },
      contabilidad_venta: { type: "string" },
      contabilidad_exportacion: { type: "string" },
      contabilidad_compra: { type: "string" },
      contabilidad_importacion: { type: "string" },
    },
  };
  
  const productoUpdateSchema = {
    type: "object",
    minProperties: 1,
    additionalProperties: true,
    properties: productoCreateSchema.properties,
  };
  
  module.exports = { productoCreateSchema, productoUpdateSchema };
  