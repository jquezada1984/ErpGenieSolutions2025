const axios = require('axios');

module.exports = async function (fastify) {
  fastify.get('/estado-archivo', async (request, reply) => {
    const { empresa } = request.query || {};
    const baseURL = process.env.MEDIA_SERVICE_BASE_URL || 'http://localhost:3010';

    try {
      const res = await axios.get(`${baseURL}/estado-archivo`, {
        params: { empresa },
        headers: {
          'X-Company-Id':
            request.headers['x-company-id'] || request.headers['X-Company-Id'] || '',
          'X-User-Id':
            request.headers['x-user-id'] || request.headers['X-User-Id'] || '',
        },
      });

      return res.data;
    } catch (error) {
      const status = error.response?.status || 500;
      const payload = error.response?.data || { error: 'Error obteniendo estado de archivo' };
      return reply.code(status).send(payload);
    }
  });
};
