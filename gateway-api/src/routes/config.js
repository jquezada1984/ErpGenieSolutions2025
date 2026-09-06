const axios = require('axios');
const { ctxHeaders } = require('../utils/requestContext');

const BASE_URL = process.env.PYTHON_SERVICE_URL || 'http://python-service:5000';
const TIMEOUT = parseInt(process.env.CONFIG_TIMEOUT || '15000', 10);
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
      'Error en configuración';
    return reply.code(status).send({ success: false, error: msg });
  }
}

module.exports = async function configRoutes(fastify) {
  fastify.get('/config/empresa', (req, reply) =>
    forward(req, reply, 'get', '/api/config/empresa'),
  );
  fastify.put('/config/empresa', (req, reply) =>
    forward(req, reply, 'put', '/api/config/empresa'),
  );
  fastify.put('/config/empresa/paneles', (req, reply) =>
    forward(req, reply, 'put', '/api/config/empresa/paneles'),
  );
  fastify.put('/config/empresa/alertas', (req, reply) =>
    forward(req, reply, 'put', '/api/config/empresa/alertas'),
  );
  fastify.put('/config/empresa/emails', (req, reply) =>
    forward(req, reply, 'put', '/api/config/empresa/emails'),
  );
  fastify.get('/config/instancia/seguridad', (req, reply) =>
    forward(req, reply, 'get', '/api/config/instancia/seguridad'),
  );
  fastify.put('/config/instancia/seguridad', (req, reply) =>
    forward(req, reply, 'put', '/api/config/instancia/seguridad'),
  );
};
