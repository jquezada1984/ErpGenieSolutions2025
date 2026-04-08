// src/routes/item.js
// Rutas del módulo item: lectura (catálogos) → ItemNestJs; escritura → ItemPython (futuro).
// Mismo patrón que routes/tercero.js: GET selects y listados por NestJS, POST/PUT/DELETE por Python.

const itemNestJs = require('../services/itemNestJs');
const itemPython = require('../services/itemPython');

module.exports = async function (fastify, opts) {
  // ---------------------------
  // LECTURA (CATÁLOGOS / SELECTS) -> ItemNestJs
  // ---------------------------

  // Catálogo Estado venta (tabla estado_venta_item) para combo en NuevoProducto / General
  fastify.get('/item/selects/estado-venta', async (request, reply) => {
    try {
      const data = await itemNestJs.listarEstadosVentaItem(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // Catálogo Estado compra (tabla estado_compra_item) para combo en NuevoProducto / General
  fastify.get('/item/selects/estado-compra', async (request, reply) => {
    try {
      const data = await itemNestJs.listarEstadosCompraItem(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // Catálogo Naturaleza (tabla naturaleza_item_catalogo) para combo en NuevoProducto / General
  fastify.get('/item/selects/naturaleza', async (request, reply) => {
    try {
      const data = await itemNestJs.listarNaturalezasItem(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // Catálogo Control inventario (tabla tipo_control_inventario_item; mismo patrón slug que /naturaleza)
  fastify.get('/item/selects/control-inventario', async (request, reply) => {
    try {
      const data = await itemNestJs.listarTiposControlInventarioItem(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // Catálogo Control fechas / caducidad (tabla tipo_control_caducidad_item)
  fastify.get('/item/selects/control-caducidad', async (request, reply) => {
    try {
      const data = await itemNestJs.listarTiposControlCaducidadItem(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // Catálogo Tipo de comportamiento (tabla tipo_comportamiento_item)
  fastify.get('/item/selects/comportamiento-item', async (request, reply) => {
    try {
      const data = await itemNestJs.listarTiposComportamientoItem(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // ---------------------------
  // ESCRITURA -> ItemPython
  // ---------------------------
  fastify.post('/item', async (request, reply) => {
    try {
      const data = await itemPython.crearItem(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/item/:id', async (request, reply) => {
    try {
      const data = await itemPython.actualizarItem(request.params.id, request.body || {}, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });
};
