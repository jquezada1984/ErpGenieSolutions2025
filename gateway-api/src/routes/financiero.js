const financieroPython = require('../services/financieroPython');

module.exports = async function (fastify, opts) {
  fastify.post('/facturas-clientes', async (request, reply) => {
    try {
      const data = await financieroPython.crearFacturaClienteBorrador(
        request.body || {},
        request,
      );
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });
};
