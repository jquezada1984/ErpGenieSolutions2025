const almacenPython = require('../services/almacenPython');

module.exports = async function (fastify, opts) {
  // Escritura almacén → AlmacenPython únicamente.
  fastify.post('/almacen/stock-cambio-masivo', async (request, reply) => {
    try {
      const result = await almacenPython.crearCambioMasivoStock(request.body || {}, request);
      return reply.code(result.status).send(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear cambio masivo de stock' };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/almacen/stock-transferencia', async (request, reply) => {
    try {
      const result = await almacenPython.crearTransferenciaStock(request.body || {}, request);
      return reply.code(result.status).send(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear transferencia de stock' };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/almacen/stock-ajuste', async (request, reply) => {
    try {
      const result = await almacenPython.crearAjusteStock(request.body || {}, request);
      return reply.code(result.status).send(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear ajuste de stock' };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/almacen/stock-salida', async (request, reply) => {
    try {
      const result = await almacenPython.crearSalidaStock(request.body || {}, request);
      return reply.code(result.status).send(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear salida de stock' };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/almacen/stock-entrada', async (request, reply) => {
    try {
      const result = await almacenPython.crearEntradaStock(request.body || {}, request);
      return reply.code(result.status).send(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear entrada de stock' };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/almacen/stock-inicial', async (request, reply) => {
    try {
      const result = await almacenPython.crearStockInicial(request.body || {}, request);
      return reply.code(result.status).send(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear stock inicial' };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/almacen', async (request, reply) => {
    try {
      const data = await almacenPython.crearAlmacen(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear almacén' };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/almacen/:id', async (request, reply) => {
    try {
      const data = await almacenPython.actualizarAlmacen(
        request.params.id,
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al actualizar almacén' };
      return reply.code(status).send(payload);
    }
  });
};
