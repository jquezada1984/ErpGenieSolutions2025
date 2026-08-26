const axios = require('axios');
const { ctxHeaders } = require('../utils/requestContext');

const BASE_URL = process.env.FINANCIERO_PY_BASE_URL || 'http://localhost:5001';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

async function proxy(method, path, body, req) {
  const headers = {
    ...(await ctxHeaders(req, body || {})),
    ...(req.headers.authorization && { Authorization: req.headers.authorization }),
    'Content-Type': 'application/json',
  };
  const res = await http.request({ method, url: path, data: body, headers });
  return res.data;
}

module.exports = {
  crearFacturaClienteBorrador: (body, req) => proxy('POST', '/api/facturas-clientes', body, req),
  reemplazarLineas: (id, body, req) => proxy('PUT', `/api/facturas-clientes/${id}/lineas`, body, req),
  validarFactura: (id, req) => proxy('POST', `/api/facturas-clientes/${id}/validar`, {}, req),
  anularFactura: (id, req) => proxy('POST', `/api/facturas-clientes/${id}/anular`, {}, req),
  enviarCorreoFactura: (id, body, req) =>
    proxy('POST', `/api/facturas-clientes/${id}/enviar-correo`, body, req),

  crearFacturaProveedorBorrador: (body, req) =>
    proxy('POST', '/api/facturas-proveedores', body, req),
  reemplazarLineasProveedor: (id, body, req) =>
    proxy('PUT', `/api/facturas-proveedores/${id}/lineas`, body, req),
  validarFacturaProveedor: (id, req) =>
    proxy('POST', `/api/facturas-proveedores/${id}/validar`, {}, req),
  anularFacturaProveedor: (id, req) =>
    proxy('POST', `/api/facturas-proveedores/${id}/anular`, {}, req),
  enviarCorreoFacturaProveedor: (id, body, req) =>
    proxy('POST', `/api/facturas-proveedores/${id}/enviar-correo`, body, req),

  crearCobro: (body, req) => proxy('POST', '/api/cobros', body, req),
  validarCobro: (id, req) => proxy('POST', `/api/cobros/${id}/validar`, {}, req),
  anularCobro: (id, req) => proxy('POST', `/api/cobros/${id}/anular`, {}, req),

  crearPagoProveedor: (body, req) => proxy('POST', '/api/pagos-proveedor', body, req),
  validarPagoProveedor: (id, req) => proxy('POST', `/api/pagos-proveedor/${id}/validar`, {}, req),
  anularPagoProveedor: (id, req) => proxy('POST', `/api/pagos-proveedor/${id}/anular`, {}, req),
};
