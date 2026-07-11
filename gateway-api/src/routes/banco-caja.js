const bancoCajaPython = require('../services/bancoCajaPython');
const bancoCajaNestJs = require('../services/bancoCajaNestJs');

module.exports = async function (fastify) {
  // --- Lectura (NestJS GraphQL) ---
  fastify.get('/banco', async (request, reply) => {
    try {
      const soloActivos = request.query.soloActivos !== 'false';
      const data = await bancoCajaNestJs.listarBancos(request, soloActivos);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/banco/:id', async (request, reply) => {
    try {
      const data = await bancoCajaNestJs.obtenerBanco(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/cuenta-bancaria', async (request, reply) => {
    try {
      const idEmpresa =
        request.query.id_empresa ||
        request.headers['x-company-id'] ||
        request.headers['X-Company-Id'];
      const data = await bancoCajaNestJs.listarCuentasBancarias(request, idEmpresa);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/cuenta-bancaria/:id', async (request, reply) => {
    try {
      const data = await bancoCajaNestJs.obtenerCuentaBancaria(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  // --- Escritura (Python REST) ---
  fastify.post('/banco', async (request, reply) => {
    try {
      const data = await bancoCajaPython.crearBanco(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.put('/banco/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.actualizarBanco(request.params.id, request.body, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.delete('/banco/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.eliminarBanco(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.post('/cuenta-bancaria', async (request, reply) => {
    try {
      const data = await bancoCajaPython.crearCuentaBancaria(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.put('/cuenta-bancaria/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.actualizarCuentaBancaria(
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

  fastify.delete('/cuenta-bancaria/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.eliminarCuentaBancaria(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/movimiento-bancario', async (request, reply) => {
    try {
      const idCuenta = request.query.id_cuenta_bancaria;
      if (!idCuenta) {
        return reply.code(400).send({ error: 'id_cuenta_bancaria es obligatorio' });
      }
      const idEmpresa =
        request.query.id_empresa ||
        request.headers['x-company-id'] ||
        request.headers['X-Company-Id'];
      const data = await bancoCajaNestJs.listarMovimientosBancarios(
        request,
        idCuenta,
        idEmpresa,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/movimiento-bancario/:id', async (request, reply) => {
    try {
      const data = await bancoCajaNestJs.obtenerMovimientoBancario(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.post('/movimiento-bancario', async (request, reply) => {
    try {
      const data = await bancoCajaPython.crearMovimientoBancario(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.put('/movimiento-bancario/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.actualizarMovimientoBancario(
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

  fastify.delete('/movimiento-bancario/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.eliminarMovimientoBancario(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/transferencia-bancaria', async (request, reply) => {
    try {
      const idEmpresa =
        request.query.id_empresa ||
        request.headers['x-company-id'] ||
        request.headers['X-Company-Id'];
      const data = await bancoCajaNestJs.listarTransferenciasBancarias(request, idEmpresa);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.get('/transferencia-bancaria/:id', async (request, reply) => {
    try {
      const data = await bancoCajaNestJs.obtenerTransferenciaBancaria(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.post('/transferencia-bancaria', async (request, reply) => {
    try {
      const data = await bancoCajaPython.crearTransferenciaBancaria(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });

  fastify.delete('/transferencia-bancaria/:id', async (request, reply) => {
    try {
      const data = await bancoCajaPython.eliminarTransferenciaBancaria(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      return reply.code(status).send(err.response?.data || { error: err.message });
    }
  });
};
