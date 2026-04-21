const terceroPython = require('../services/terceroPython');
const socioNestJs = require('../services/socioNestJs');

module.exports = async function (fastify) {
  fastify.get('/socio/selects/rol-socio', async (request, reply) => {
    try {
      const data = await socioNestJs.rolesSocio(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/socio/selects/terceros', async (request, reply) => {
    try {
      const { id_empresa, id_socio } = request.query || {};
      const data = await socioNestJs.tercerosDisponiblesParaSocio(id_empresa, id_socio, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/socio', async (request, reply) => {
    try {
      const data = await terceroPython.crearSocio(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/socio/:id', async (request, reply) => {
    try {
      const data = await terceroPython.actualizarSocio(request.params.id, request.body, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.patch('/socio/:id/estado', async (request, reply) => {
    try {
      const data = await terceroPython.toggleEstadoSocio(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });
};
