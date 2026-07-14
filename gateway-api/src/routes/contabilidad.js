const contabilidadPython = require('../services/contabilidadPython');

module.exports = async function (fastify, opts) {
  const handle = async (fn, request, reply) => {
    try {
      const data = await fn(request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  };

  fastify.put('/configuracion-contabilidad', async (request, reply) => {
    try {
      const data = await contabilidadPython.actualizarConfiguracionContabilidad(
        request.body || {},
        request,
      );
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.post('/periodos-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearPeriodoContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.patch('/periodos-contables/:id/cerrar', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.cerrarPeriodoContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/diarios-contables/inicializar-defecto', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.inicializarDiariosContablesDefecto(req),
      request,
      reply,
    );
  });

  fastify.post('/diarios-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearDiarioContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/diarios-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.actualizarDiarioContable(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.patch('/diarios-contables/:id/activo', async (request, reply) => {
    const activo = request.body?.activo ?? request.body?.estado ?? true;
    return handle(
      (req) => contabilidadPython.patchActivoDiarioContable(req.params.id, activo, req),
      request,
      reply,
    );
  });

  fastify.delete('/diarios-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.eliminarDiarioContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/modelos-planes-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearModeloPlanContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/modelos-planes-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.actualizarModeloPlanContable(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.patch('/modelos-planes-contables/:id/activo', async (request, reply) => {
    const activo = request.body?.activo ?? request.body?.estado ?? true;
    return handle(
      (req) => contabilidadPython.patchActivoModeloPlanContable(req.params.id, activo, req),
      request,
      reply,
    );
  });

  fastify.delete('/modelos-planes-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.eliminarModeloPlanContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/cuentas-contables', async (request, reply) => {
    try {
      const data = await contabilidadPython.crearCuentaContable(request.body || {}, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: err.message };
      return reply.code(status).send(payload);
    }
  });

  fastify.put('/cuentas-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.actualizarCuentaContable(req.params.id, req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.patch('/cuentas-contables/:id/activo', async (request, reply) => {
    const activo = request.body?.activo ?? request.body?.estado ?? true;
    return handle(
      (req) => contabilidadPython.patchActivoCuentaContable(req.params.id, activo, req),
      request,
      reply,
    );
  });

  fastify.delete('/cuentas-contables/:id', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.eliminarCuentaContable(req.params.id, req),
      request,
      reply,
    );
  });

  fastify.post('/cuentas-contables-defecto/inicializar', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.inicializarCuentasContablesDefecto(req),
      request,
      reply,
    );
  });

  fastify.put('/cuentas-contables-defecto', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.guardarCuentasContablesDefecto(req.body || {}, req),
      request,
      reply,
    );
  });

  fastify.get('/contabilidad/exportar', async (request, reply) => {
    return handle(
      (req) =>
        contabilidadPython.listarMovimientosExportar(
          {
            desde: req.query.desde,
            hasta: req.query.hasta,
            incluir_exportados: req.query.incluir_exportados,
          },
          req,
        ),
      request,
      reply,
    );
  });

  fastify.post('/contabilidad/exportar/ejecutar', async (request, reply) => {
    return handle(
      (req) => contabilidadPython.ejecutarExportacionContabilidad(req.body || {}, req),
      request,
      reply,
    );
  });

  // Fase 1 — IVA, impuestos, grupos, bancos
  fastify.get('/cuentas-iva', (req, reply) => handle((r) => contabilidadPython.proxyGet('/api/cuentas-iva', r), req, reply));
  fastify.post('/cuentas-iva', (req, reply) => handle((r) => contabilidadPython.proxyPost('/api/cuentas-iva', req.body, r), req, reply));
  fastify.put('/cuentas-iva/:id', (req, reply) => handle((r) => contabilidadPython.proxyPut(`/api/cuentas-iva/${req.params.id}`, req.body, r), req, reply));
  fastify.delete('/cuentas-iva/:id', (req, reply) => handle((r) => contabilidadPython.proxyDelete(`/api/cuentas-iva/${req.params.id}`, r), req, reply));

  fastify.get('/cuentas-impuestos', (req, reply) => handle((r) => contabilidadPython.proxyGet('/api/cuentas-impuestos', r), req, reply));
  fastify.post('/cuentas-impuestos', (req, reply) => handle((r) => contabilidadPython.proxyPost('/api/cuentas-impuestos', req.body, r), req, reply));
  fastify.put('/cuentas-impuestos/:id', (req, reply) => handle((r) => contabilidadPython.proxyPut(`/api/cuentas-impuestos/${req.params.id}`, req.body, r), req, reply));
  fastify.delete('/cuentas-impuestos/:id', (req, reply) => handle((r) => contabilidadPython.proxyDelete(`/api/cuentas-impuestos/${req.params.id}`, r), req, reply));

  fastify.get('/grupos-cuentas-personalizados', (req, reply) => handle((r) => contabilidadPython.proxyGet('/api/grupos-cuentas-personalizados', r), req, reply));
  fastify.post('/grupos-cuentas-personalizados', (req, reply) => handle((r) => contabilidadPython.proxyPost('/api/grupos-cuentas-personalizados', req.body, r), req, reply));
  fastify.put('/grupos-cuentas-personalizados/:id', (req, reply) => handle((r) => contabilidadPython.proxyPut(`/api/grupos-cuentas-personalizados/${req.params.id}`, req.body, r), req, reply));
  fastify.delete('/grupos-cuentas-personalizados/:id', (req, reply) => handle((r) => contabilidadPython.proxyDelete(`/api/grupos-cuentas-personalizados/${req.params.id}`, r), req, reply));
  fastify.put('/grupos-cuentas-personalizados/:id/cuentas', (req, reply) => handle((r) => contabilidadPython.proxyPut(`/api/grupos-cuentas-personalizados/${req.params.id}/cuentas`, req.body, r), req, reply));

  fastify.get('/cuentas-bancarias-contables', (req, reply) => handle((r) => contabilidadPython.proxyGet('/api/cuentas-bancarias-contables', r), req, reply));
  fastify.put('/cuentas-bancarias-contables/:id', (req, reply) => handle((r) => contabilidadPython.proxyPut(`/api/cuentas-bancarias-contables/${req.params.id}`, req.body, r), req, reply));

  // Fase 2-3 — transferencia
  const transfGet = (path, req) => {
    const qs = new URLSearchParams(req.query || {}).toString();
    return contabilidadPython.proxyGet(qs ? `${path}?${qs}` : path, req);
  };
  fastify.get('/transferencia-contable/facturas-clientes/resumen', (req, reply) => handle((r) => transfGet('/api/transferencia-contable/facturas-clientes/resumen', r), req, reply));
  fastify.get('/transferencia-contable/facturas-proveedores/resumen', (req, reply) => handle((r) => transfGet('/api/transferencia-contable/facturas-proveedores/resumen', r), req, reply));
  fastify.get('/transferencia-contable/facturas-clientes/lineas', (req, reply) => handle((r) => transfGet('/api/transferencia-contable/facturas-clientes/lineas', r), req, reply));
  fastify.get('/transferencia-contable/facturas-proveedores/lineas', (req, reply) => handle((r) => transfGet('/api/transferencia-contable/facturas-proveedores/lineas', r), req, reply));
  fastify.post('/transferencia-contable/facturas-clientes/vincular-automatico', (req, reply) => handle((r) => contabilidadPython.proxyPost('/api/transferencia-contable/facturas-clientes/vincular-automatico', req.body, r), req, reply));
  fastify.post('/transferencia-contable/facturas-proveedores/vincular-automatico', (req, reply) => handle((r) => contabilidadPython.proxyPost('/api/transferencia-contable/facturas-proveedores/vincular-automatico', req.body, r), req, reply));
  fastify.patch('/transferencia-contable/lineas/vincular', (req, reply) => handle((r) => contabilidadPython.proxyPatch('/api/transferencia-contable/lineas/vincular', req.body, r), req, reply));
  fastify.patch('/transferencia-contable/lineas/cambiar-cuenta', (req, reply) => handle((r) => contabilidadPython.proxyPatch('/api/transferencia-contable/lineas/cambiar-cuenta', req.body, r), req, reply));
  fastify.get('/transferencia-contable/registro/:origen/preview', (req, reply) => handle((r) => transfGet(`/api/transferencia-contable/registro/${req.params.origen}/preview`, r), req, reply));
  fastify.post('/transferencia-contable/registro/:origen', (req, reply) => handle((r) => contabilidadPython.proxyPost(`/api/transferencia-contable/registro/${req.params.origen}`, req.body, r), req, reply));
  fastify.get('/transferencia-contable/exportar-documentos', (req, reply) => handle((r) => transfGet('/api/transferencia-contable/exportar-documentos', r), req, reply));
};
