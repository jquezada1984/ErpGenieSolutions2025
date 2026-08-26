const financieroPython = require('../services/financieroPython');

module.exports = async function (fastify, opts) {
  const handle = async (fn, request, reply, code = 200) => {
    try {
      const data = await fn(request);
      return reply.code(code).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  };

  fastify.post('/facturas-clientes', async (request, reply) => {
    return handle(
      (req) => financieroPython.crearFacturaClienteBorrador(req.body || {}, req),
      request,
      reply,
      201,
    );
  });
  fastify.put('/facturas-clientes/:id/lineas', async (request, reply) => {
    return handle(
      (req) => financieroPython.reemplazarLineas(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });
  fastify.post('/facturas-clientes/:id/validar', async (request, reply) => {
    return handle((req) => financieroPython.validarFactura(req.params.id, req), request, reply);
  });
  fastify.post('/facturas-clientes/:id/anular', async (request, reply) => {
    return handle((req) => financieroPython.anularFactura(req.params.id, req), request, reply);
  });
  fastify.post('/facturas-clientes/:id/enviar-correo', async (request, reply) => {
    return handle(
      (req) => financieroPython.enviarCorreoFactura(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.post('/facturas-proveedores', async (request, reply) => {
    return handle(
      (req) => financieroPython.crearFacturaProveedorBorrador(req.body || {}, req),
      request,
      reply,
      201,
    );
  });
  fastify.put('/facturas-proveedores/:id/lineas', async (request, reply) => {
    return handle(
      (req) => financieroPython.reemplazarLineasProveedor(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });
  fastify.post('/facturas-proveedores/:id/validar', async (request, reply) => {
    return handle(
      (req) => financieroPython.validarFacturaProveedor(req.params.id, req),
      request,
      reply,
    );
  });
  fastify.post('/facturas-proveedores/:id/anular', async (request, reply) => {
    return handle(
      (req) => financieroPython.anularFacturaProveedor(req.params.id, req),
      request,
      reply,
    );
  });
  fastify.post('/facturas-proveedores/:id/enviar-correo', async (request, reply) => {
    return handle(
      (req) => financieroPython.enviarCorreoFacturaProveedor(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.post('/cobros', async (request, reply) => {
    return handle((req) => financieroPython.crearCobro(req.body || {}, req), request, reply, 201);
  });
  fastify.post('/cobros/:id/validar', async (request, reply) => {
    return handle((req) => financieroPython.validarCobro(req.params.id, req), request, reply);
  });
  fastify.post('/cobros/:id/anular', async (request, reply) => {
    return handle((req) => financieroPython.anularCobro(req.params.id, req), request, reply);
  });

  fastify.post('/pagos-proveedor', async (request, reply) => {
    return handle(
      (req) => financieroPython.crearPagoProveedor(req.body || {}, req),
      request,
      reply,
      201,
    );
  });
  fastify.post('/pagos-proveedor/:id/validar', async (request, reply) => {
    return handle(
      (req) => financieroPython.validarPagoProveedor(req.params.id, req),
      request,
      reply,
    );
  });
  fastify.post('/pagos-proveedor/:id/anular', async (request, reply) => {
    return handle(
      (req) => financieroPython.anularPagoProveedor(req.params.id, req),
      request,
      reply,
    );
  });
};
