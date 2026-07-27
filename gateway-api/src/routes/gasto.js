/**
 * Rutas REST de escritura Gastos → GastoPython.
 * Lectura: GraphQL vía Gateway (/graphql → GastoNestJs).
 */
const gastoPython = require('../services/gastoPython');

module.exports = async function (fastify) {
  fastify.post('/categoria-gasto', async (request, reply) => {
    try {
      const data = await gastoPython.crearCategoriaGasto(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.put('/categoria-gasto/:id', async (request, reply) => {
    try {
      const data = await gastoPython.actualizarCategoriaGasto(
        request.params.id,
        request.body,
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.patch('/categoria-gasto/:id/estado', async (request, reply) => {
    try {
      const data = await gastoPython.cambiarEstadoCategoriaGasto(
        request.params.id,
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.post('/gasto', async (request, reply) => {
    try {
      const data = await gastoPython.crearGasto(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.put('/gasto/:id', async (request, reply) => {
    try {
      const data = await gastoPython.actualizarGasto(
        request.params.id,
        request.body,
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });
};
