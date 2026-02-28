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

module.exports = {
  uploadMedia,
};
