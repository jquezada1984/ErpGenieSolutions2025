const axios = require('axios');

module.exports = async function (fastify) {
  fastify.get('/directorio', async (request, reply) => {
    const { module } = request.query;

    const baseURL = process.env.MEDIA_SERVICE_BASE_URL || 'http://localhost:3010';

    try {
      const res = await axios.get(`${baseURL}/directorio`, {
        params: { module },
        headers: {
          'X-Company-Id':
            request.headers['x-company-id'] || request.headers['X-Company-Id'] || '',
          'X-User-Id':
            request.headers['x-user-id'] || request.headers['X-User-Id'] || '',
        },
      });

      return res.data;
    } catch (error) {
      reply.code(500);
      return { error: 'Error obteniendo directorios' };
    }
  });

  fastify.post('/directorio', async (request, reply) => {
    try {
      const baseURL = process.env.MEDIA_SERVICE_BASE_URL || 'http://localhost:3010';

      const response = await axios.post(`${baseURL}/directorio`, request.body, {
        headers: {
          'Content-Type': 'application/json',
          'X-Company-Id':
            request.headers['x-company-id'] || request.headers['X-Company-Id'] || '',
          'X-User-Id': request.headers['x-user-id'] || request.headers['X-User-Id'] || '',
        },
      });

      return response.data;
    } catch (error) {
      reply.code(500).send({
        error: 'Error creando directorio',
      });
    }
  });
};
