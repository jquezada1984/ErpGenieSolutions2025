// src/services/mediaService.js
const axios = require('axios');

const BASE_URL = process.env.MEDIA_SERVICE_BASE_URL || 'http://localhost:3010';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Sube archivos al servicio de media.
 * @param {object} formData - Objeto FormData (form-data) con los campos/archivos.
 * @param {object} [headers={}] - Headers adicionales (ej. X-Company-Id, X-User-Id).
 * @returns {Promise<object>} response.data del servicio.
 */
async function uploadMedia(formData, headers = {}) {
  const requestHeaders = {
    ...formData.getHeaders(),
    ...headers,
  };
  const res = await http.post('/media/upload', formData, { headers: requestHeaders });
  return res.data;
}

/**
 * Lista medios por módulo y id de entidad.
 * @param {string} module
 * @param {string} module_id
 * @param {object} [headers={}]
 * @returns {Promise<object>}
 */
async function getMediaByModule(module, module_id, headers = {}) {
  const res = await http.get('/media', {
    params: { module, module_id },
    headers,
  });
  return res.data;
}

/**
 * Elimina un medio por id.
 * @param {string} id_media
 * @param {object} [headers={}]
 * @returns {Promise<object>}
 */
async function deleteMedia(id_media, headers = {}) {
  const res = await http.delete(`/media/${id_media}`, { headers });
  return res.data;
}

/**
 * Registra o actualiza metadata en media-service.
 * @param {object} data - Cuerpo JSON tal cual lo envía el cliente.
 * @param {object} [headers={}]
 * @returns {Promise<object>}
 */
async function saveMetadata(data, headers = {}) {
  const res = await http.post('/media/metadata', data, { headers });
  return res.data;
}

module.exports = {
  uploadMedia,
  getMediaByModule,
  deleteMedia,
  saveMetadata,
};
