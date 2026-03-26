// src/routes/media.js
const FormData = require('form-data');
const mediaService = require('../services/mediaService');

function forwardMediaHeaders(request) {
  return {
    'X-Company-Id': request.headers['x-company-id'] || request.headers['X-Company-Id'] || '',
    'X-User-Id': request.headers['x-user-id'] || request.headers['X-User-Id'] || '',
  };
}

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

  fastify.get('/media', async (request, reply) => {
    try {
      const { module, module_id } = request.query || {};
      const moduleVal = typeof module === 'string' ? module.trim() : '';
      const moduleIdVal = typeof module_id === 'string' ? module_id.trim() : '';
      if (!moduleVal || !moduleIdVal) {
        return reply.code(400).send({ error: 'module y module_id son obligatorios' });
      }
      const headers = forwardMediaHeaders(request);
      const data = await mediaService.getMediaByModule(moduleVal, moduleIdVal, headers);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.delete('/media/:id_media', async (request, reply) => {
    try {
      const { id_media } = request.params || {};
      const idVal = typeof id_media === 'string' ? id_media.trim() : '';
      if (!idVal) {
        return reply.code(400).send({ error: 'id_media es obligatorio' });
      }
      const headers = forwardMediaHeaders(request);
      const data = await mediaService.deleteMedia(idVal, headers);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/media/metadata', async (request, reply) => {
    try {
      const headers = forwardMediaHeaders(request);
      const data = await mediaService.saveMetadata(request.body, headers);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { error: err.message };
      return reply.code(status).send(payload);
    }
  });
};
