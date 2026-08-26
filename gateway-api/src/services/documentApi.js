const axios = require('axios');
const { ctxHeaders } = require('../utils/requestContext');

const BASE_URL = process.env.DOCUMENT_API_BASE_URL || 'http://localhost:5010';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 180000,
  responseType: 'arraybuffer',
});

async function proxyPdf(method, path, req, body) {
  const headers = {
    ...(await ctxHeaders(req, body || {})),
    ...(req.headers.authorization && { Authorization: req.headers.authorization }),
  };
  if (method !== 'GET') headers['Content-Type'] = 'application/json';
  const res = await http.request({ method, url: path, data: body, headers });
  return {
    data: Buffer.from(res.data),
    contentType: res.headers['content-type'] || 'application/pdf',
    disposition: res.headers['content-disposition'] || 'inline; filename="documento.pdf"',
  };
}

module.exports = { proxyPdf };
