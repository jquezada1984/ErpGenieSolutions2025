// src/routes/tercero.js
const { terceroCreateSchema, terceroUpdateSchema } = require('../schemas/tercero');
const terceroPython = require('../services/terceroPython');
const terceroNestJs = require('../services/terceroNestJs');
const { nestjsService } = require('../services');

module.exports = async function (fastify, opts) {
  // ---------------------------
  // LECTURA (PRESENTACIÓN) -> NestJS
  // ---------------------------
  fastify.get('/tercero', async (request, reply) => {
    try {
      const data = await terceroNestJs.listarTerceros(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/clientes', async (request, reply) => {
    try {
      const data = await terceroNestJs.listarClientes(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/tercero/:id', async (request, reply) => {
    try {
      const data = await terceroNestJs.obtenerTercero(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // SELECTS / CATALOGOS (presentación) -> NestJS
  fastify.get('/tercero/selects/tipo-tercero', async (request, reply) => {
    try {
      const data = await terceroNestJs.listarTiposTercero(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/tercero/selects/condicion-pago', async (request, reply) => {
    try {
      const data = await terceroNestJs.listarCondicionesPago(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/tercero/selects/forma-pago', async (request, reply) => {
    try {
      const data = await terceroNestJs.listarFormasPago(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/tercero/selects/paises', async (request, reply) => {
    try {
      console.log('📥 Gateway: GET /tercero/selects/paises');
      const response = await nestjsService.getPaises();
      const data = response?.paises || [];
      console.log('✅ Gateway: Países obtenidos:', data?.length || 0);
      return reply.code(200).send(data);
    } catch (err) {
      console.error('❌ Gateway: Error al obtener países:', err);
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.get('/tercero/selects/empresas', async (request, reply) => {
    try {
      console.log('📥 Gateway: GET /tercero/selects/empresas');
      const response = await nestjsService.getEmpresas();
      const data = response?.empresas || [];
      console.log('✅ Gateway: Empresas obtenidas:', data?.length || 0);
      return reply.code(200).send(data);
    } catch (err) {
      console.error('❌ Gateway: Error al obtener empresas:', err);
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  // ---------------------------
  // ESCRITURA -> Python (SIN CAMBIOS)
  // ---------------------------
  fastify.post(
    '/tercero',
    { schema: { body: terceroCreateSchema } },
    async (request, reply) => {
      try {
        const data = await terceroPython.crearTercero(request.body, request);
        return reply.code(201).send(data);
      } catch (err) {
        const status = err.response?.status || 500;
        const payload = err.response?.data || { error: err.message };
        return reply.code(status).send(payload);
      }
    }
  );

  fastify.post(
    '/api/terceros',
    { schema: { body: terceroCreateSchema } },
    async (request, reply) => {
      try {
        const data = await terceroPython.crearTercero(request.body, request);
        return reply.code(201).send(data);
      } catch (err) {
        const status = err.response?.status || 500;
        const payload = err.response?.data || { error: err.message };
        return reply.code(status).send(payload);
      }
    }
  );

  fastify.put(
    '/tercero/:id',
    {
      schema: {
        body: terceroUpdateSchema,
        params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      },
    },
    async (request, reply) => {
      try {
        const data = await terceroPython.actualizarTercero(request.params.id, request.body, request);
        return reply.code(200).send(data);
      } catch (err) {
        const status = err.response?.status || 500;
        const payload = err.response?.data || { error: err.message };
        return reply.code(status).send(payload);
      }
    }
  );

  fastify.delete(
    '/tercero/:id',
    { schema: { params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } },
    async (request, reply) => {
      try {
        const data = await terceroPython.eliminarTercero(request.params.id, request);
        return reply.code(200).send(data);
      } catch (err) {
        const status = err.response?.status || 500;
        const payload = err.response?.data || { error: err.message };
        return reply.code(status).send(payload);
      }
    }
  );
};
