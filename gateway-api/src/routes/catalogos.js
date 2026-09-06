const axios = require('axios');
const { ctxHeaders } = require('../utils/requestContext');

const BASE_URL = process.env.PYTHON_SERVICE_URL || 'http://python-service:5000';
const TIMEOUT = parseInt(process.env.CATALOGOS_TIMEOUT || '15000', 10);

const http = axios.create({ baseURL: BASE_URL, timeout: TIMEOUT });

async function proxy(method, path, body, req) {
  const headers = {
    ...(await ctxHeaders(req, body || {})),
    ...(req.headers.authorization && { Authorization: req.headers.authorization }),
    'Content-Type': 'application/json',
  };
  const res = await http.request({
    method,
    url: path,
    data: ['GET', 'DELETE'].includes(method.toUpperCase()) ? undefined : body,
    headers,
  });
  return res.data;
}

async function forward(request, reply, method, path) {
  try {
    const data = method.toLowerCase() === 'get' ? null : request.body;
    const result = await proxy(method, path, data, request);
    return reply.send(result);
  } catch (error) {
    const status = error.response?.status || error.statusCode || 500;
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error en catálogos';
    return reply.code(status).send({ success: false, error: msg });
  }
}

module.exports = async function catalogosRoutes(fastify) {
  const resources = [
    { key: 'condicion-pago' },
    { key: 'forma-pago' },
    { key: 'moneda' },
    { key: 'tipo-entidad-legal' },
    { key: 'formato-papel' },
    { key: 'impuesto' },
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
