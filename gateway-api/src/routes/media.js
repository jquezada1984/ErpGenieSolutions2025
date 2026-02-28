// src/routes/media.js
const FormData = require('form-data');
const mediaService = require('../services/mediaService');

module.exports = async function (fastify, opts) {
  fastify.post('/media/upload', async (request, reply) => {
    try {
      const file = await request.file();
      if (!file) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }
      const fileBuffer = await file.toBuffer();
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: file.filename,
        contentType: file.mimetype,
      });
      const headers = {
        'X-Company-Id': request.headers['x-company-id'] || request.headers['X-Company-Id'] || '',
        'X-User-Id': request.headers['x-user-id'] || request.headers['X-User-Id'] || '',
      };
      const data = await mediaService.uploadMedia(formData, headers);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });
};
