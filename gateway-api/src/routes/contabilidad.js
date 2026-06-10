const contabilidadPython = require('../services/contabilidadPython');

module.exports = async function (fastify, opts) {
  const handle = async (fn, request, reply) => {
    try {
      const data = await fn(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  };

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

  fastify.post('/periodos-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearPeriodoContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.patch('/periodos-contables/:id/cerrar', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.cerrarPeriodoContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/diarios-contables/inicializar-defecto', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.inicializarDiariosContablesDefecto(req),
      request,
      reply,
    );
  });

  fastify.post('/diarios-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearDiarioContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/diarios-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.actualizarDiarioContable(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.patch('/diarios-contables/:id/activo', async (request, reply) => {
    const activo = request.body?.activo ?? request.body?.estado ?? true;
    return handle(
      (req) => contabilidadPython.patchActivoDiarioContable(req.params.id, activo, req),
      request,
      reply,
    );
  });

  fastify.delete('/diarios-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.eliminarDiarioContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/modelos-planes-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearModeloPlanContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/modelos-planes-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.actualizarModeloPlanContable(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.patch('/modelos-planes-contables/:id/activo', async (request, reply) => {
    const activo = request.body?.activo ?? request.body?.estado ?? true;
    return handle(
      (req) => contabilidadPython.patchActivoModeloPlanContable(req.params.id, activo, req),
      request,
      reply,
    );
  });

  fastify.delete('/modelos-planes-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.eliminarModeloPlanContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/cuentas-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearCuentaContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/cuentas-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.actualizarCuentaContable(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.patch('/cuentas-contables/:id/activo', async (request, reply) => {
    const activo = request.body?.activo ?? request.body?.estado ?? true;
    return handle(
      (req) => contabilidadPython.patchActivoCuentaContable(req.params.id, activo, req),
      request,
      reply,
    );
  });

  fastify.delete('/cuentas-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.eliminarCuentaContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/cuentas-contables-defecto/inicializar', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.inicializarCuentasContablesDefecto(req),
      request,
      reply,
    );
  });

  fastify.put('/cuentas-contables-defecto', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.guardarCuentasContablesDefecto(req.body || {}, req),
      request,
      reply,
    );
  });
};
