const documentApi = require('../services/documentApi');

module.exports = async function (fastify) {
  const sendPdf = async (fn, request, reply) => {
    try {
      const pdf = await fn(request);
      return reply
        .code(200)
        .header('Content-Type', pdf.contentType)
        .header('Content-Disposition', pdf.disposition)
        .send(pdf.data);
    } catch (err) {
      const status = err.response?.status || 500;
      let payload = { success: false, error: err.message };
      const raw = err.response?.data;
      if (raw) {
        try {
          payload = JSON.parse(Buffer.from(raw).toString('utf8'));
        } catch {
          /* keep */
        }
      }
      return reply.code(status).send(payload);
    }
  };

  fastify.post('/documentos/generar', async (request, reply) => {
    return sendPdf(
      (req) => documentApi.proxyPdf('POST', '/api/documentos/generar', req, req.body || {}),
      request,
      reply,
    );
  });
  fastify.get('/documentos/factura-cliente/:id', async (request, reply) => {
    return sendPdf(
      (req) => documentApi.proxyPdf('GET', `/api/documentos/factura-cliente/${req.params.id}`, req),
      request,
      reply,
    );
  });
  fastify.get('/documentos/factura-proveedor/:id', async (request, reply) => {
    return sendPdf(
      (req) =>
        documentApi.proxyPdf('GET', `/api/documentos/factura-proveedor/${req.params.id}`, req),
      request,
      reply,
    );
  });
  fastify.get('/documentos/pago/:id', async (request, reply) => {
    return sendPdf(
      (req) => documentApi.proxyPdf('GET', `/api/documentos/pago/${req.params.id}`, req),
      request,
      reply,
    );
  });
  fastify.get('/documentos/reporte-estadistico', async (request, reply) => {
    return sendPdf(
      (req) => documentApi.proxyPdf('GET', '/api/documentos/reporte-estadistico', req),
      request,
      reply,
    );
  });
};
