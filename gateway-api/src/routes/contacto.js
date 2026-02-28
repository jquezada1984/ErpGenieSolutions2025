const terceroPython = require('../services/terceroPython');

module.exports = async function (fastify) {
  fastify.post('/contactos', async (request, reply) => {
    try {
      const data = await terceroPython.crearContacto(request.body, request);
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const body = err.response?.data;
      if (body && typeof body === 'object' && body.error) {
        return reply.status(status).send(body);
      }
      throw err;
    }
  });

  fastify.get('/contactos/tercero/:id_tercero', async (request, reply) => {
    const data = await terceroPython.listarContactosByTercero(request.params.id_tercero, request);
    return data;
  });

  fastify.get('/contactos/:id_contacto', async (request, reply) => {
    const data = await terceroPython.obtenerContacto(request.params.id_contacto, request);
    return data;
  });

  fastify.put('/contactos/:id_contacto', async (request, reply) => {
    const data = await terceroPython.actualizarContacto(request.params.id_contacto, request.body, request);
    return data;
  });

  fastify.patch('/contactos/:id_contacto/estado', async (request, reply) => {
    const data = await terceroPython.toggleContactoEstado(request.params.id_contacto, request);
    return data;
  });
};
