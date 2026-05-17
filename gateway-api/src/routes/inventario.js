const inventarioPython = require('../services/inventarioPython');

module.exports = async function (fastify, opts) {
  // Escritura inventario → InventarioPython únicamente (sin fallback ItemPython).
  fastify.post('/inventario', async (request, reply) => {
    try {
      const data = await inventarioPython.crearInventario(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al crear inventario' };
      return reply.code(status).send(payload);
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
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al actualizar inventario' };
      return reply.code(status).send(payload);
    }
  });
};
