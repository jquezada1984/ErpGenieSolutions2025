const inventarioPython = require('../services/inventarioPython');
const itemPython = require('../services/itemPython');

module.exports = async function (fastify, opts) {
  // Escritura inventario -> InventarioPython (principal)
  // Fallback temporal -> ItemPython para no romper flujo actual.
  fastify.post('/inventario', async (request, reply) => {
    try {
      const data = await inventarioPython.crearInventario(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (errInventario) {
      fastify.log.warn(
        { err: errInventario?.message || errInventario },
        'InventarioPython no disponible, usando fallback ItemPython',
      );
      try {
        const dataFallback = await itemPython.crearInventario(request.body || {}, request);
        return reply.code(201).send(dataFallback);
      } catch (errFallback) {
        const status = errFallback.response?.status || errInventario.response?.status || 500;
        const payload =
          errFallback.response?.data ||
          errInventario.response?.data ||
          { success: false, error: errFallback.message || errInventario.message };
        return reply.code(status).send(payload);
      }
    }
  });

  fastify.put('/inventario/:id', async (request, reply) => {
    try {
      const data = await inventarioPython.actualizarInventario(
        request.params.id,
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });
};
