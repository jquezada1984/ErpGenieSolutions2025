const axios = require('axios');

module.exports = async function (fastify) {
  fastify.get('/directorio', async (request, reply) => {
    const { module } = request.query;

    const baseURL = process.env.MEDIA_SERVICE_BASE_URL || 'http://localhost:3010';

    try {
      const res = await axios.get(`${baseURL}/directorio`, {
        params: { module },
        headers: {
          'X-Company-Id': request.headers['x-company-id'] || '',
          'X-User-Id': request.headers['x-user-id'] || '',
        },
      });

      return res.data;
    } catch (error) {
      reply.code(500);
      return { error: 'Error obteniendo directorios' };
    }
  });
};
