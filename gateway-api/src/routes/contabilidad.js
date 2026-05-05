const contabilidadPython = require('../services/contabilidadPython');

module.exports = async function (fastify, opts) {
  fastify.put('/configuracion-contabilidad', async (request, reply) => {
    try {
      const data = await contabilidadPython.actualizarConfiguracionContabilidad(
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
