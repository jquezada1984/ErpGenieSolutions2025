const { pythonService } = require('../services');

async function forward(request, reply, method, path) {
  try {
    const data = method.toLowerCase() === 'get' ? null : request.body;
    const result = await pythonService.call(path, method.toUpperCase(), data);
    return reply.send(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return reply.code(status).send({ success: false, error: error.message });
  }
}

module.exports = async function catalogosRoutes(fastify) {
  const resources = [
    { key: 'condicion-pago', idType: 'string' },
    { key: 'forma-pago', idType: 'string' },
    { key: 'moneda', idType: 'string' },
    { key: 'tipo-entidad-legal', idType: 'number' },
    { key: 'formato-papel', idType: 'string' },
  ];

  fastify.get('/catalogos/modos-pago', (req, reply) =>
    forward(req, reply, 'get', '/api/catalogos/forma-pago'),
  );

  for (const { key } of resources) {
    fastify.get(`/catalogos/${key}`, (req, reply) => {
      const qs = new URLSearchParams(req.query || {}).toString();
      const suffix = qs ? `?${qs}` : '';
      return forward(req, reply, 'get', `/api/catalogos/${key}${suffix}`);
    });

    fastify.post(`/catalogos/${key}`, (req, reply) =>
      forward(req, reply, 'post', `/api/catalogos/${key}`),
    );

    fastify.get(`/catalogos/${key}/:id`, (req, reply) =>
      forward(req, reply, 'get', `/api/catalogos/${key}/${req.params.id}`),
    );

    fastify.put(`/catalogos/${key}/:id`, (req, reply) =>
      forward(req, reply, 'put', `/api/catalogos/${key}/${req.params.id}`),
    );

    fastify.patch(`/catalogos/${key}/:id/activo`, (req, reply) =>
      forward(req, reply, 'patch', `/api/catalogos/${key}/${req.params.id}/activo`),
    );
  }
};
