const inventarioPython = require('../services/inventarioPython');

module.exports = async function (fastify, opts) {
  // --- Inventario físico (cabecera) ---
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

  fastify.post('/inventario/:id/cerrar', async (request, reply) => {
    try {
      const data = await inventarioPython.cerrarInventario(
        request.params.id,
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload =
        err.response?.data ||
        { success: false, error: err.message || 'Error al cerrar inventario' };
      return reply.code(status).send(payload);
    }
  });

  // --- Almacenes ---
  fastify.post('/almacen', async (request, reply) => {
    try {
      const data = await inventarioPython.crearAlmacen(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.put('/almacen/:id', async (request, reply) => {
    try {
      const data = await inventarioPython.actualizarAlmacen(
        request.params.id,
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  // --- Stock / Kardex ---
  fastify.post('/stock/saldo', async (request, reply) => {
    try {
      const data = await inventarioPython.upsertSaldo(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/movimiento', async (request, reply) => {
    try {
      const data = await inventarioPython.crearMovimiento(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/transferencia', async (request, reply) => {
    try {
      const data = await inventarioPython.crearTransferencia(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/transferencia/:id/completar', async (request, reply) => {
    try {
      const data = await inventarioPython.completarTransferencia(
        request.params.id,
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/cambio-masivo', async (request, reply) => {
    try {
      const data = await inventarioPython.crearCambioMasivo(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/cambio-masivo/:id/completar', async (request, reply) => {
    try {
      const data = await inventarioPython.completarCambioMasivo(
        request.params.id,
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/lote', async (request, reply) => {
    try {
      const data = await inventarioPython.upsertLote(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/a-fecha', async (request, reply) => {
    try {
      const data = await inventarioPython.stockAFecha(request.body || {}, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/reposicion', async (request, reply) => {
    try {
      const data = await inventarioPython.stockReposicion(request.body || {}, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });

  fastify.post('/stock/valoracion-pmp', async (request, reply) => {
    try {
      const data = await inventarioPython.stockValoracionPmp(request.body || {}, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { success: false, error: err.message });
    }
  });
};
