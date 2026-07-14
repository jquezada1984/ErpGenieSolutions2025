const axios = require('axios');
const { ctxHeaders } = require('./terceroPython');

const BASE_URL = process.env.CONTABILIDAD_PY_BASE_URL || 'http://localhost:5002';

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

async function actualizarConfiguracionContabilidad(body, req) {
  return proxy('PUT', '/api/configuracion-contabilidad', body, req);
}

async function crearPeriodoContable(body, req) {
  return proxy('POST', '/api/periodos-contables', body, req);
}

async function cerrarPeriodoContable(id, req) {
  return proxy('PATCH', `/api/periodos-contables/${id}/cerrar`, {}, req);
}

async function inicializarDiariosContablesDefecto(req) {
  return proxy('POST', '/api/diarios-contables/inicializar-defecto', {}, req);
}

async function crearDiarioContable(body, req) {
  return proxy('POST', '/api/diarios-contables', body, req);
}

async function actualizarDiarioContable(id, body, req) {
  return proxy('PUT', `/api/diarios-contables/${id}`, body, req);
}

async function patchActivoDiarioContable(id, activo, req) {
  return proxy('PATCH', `/api/diarios-contables/${id}/activo`, { activo }, req);
}

async function eliminarDiarioContable(id, req) {
  return proxy('DELETE', `/api/diarios-contables/${id}`, {}, req);
}

async function crearModeloPlanContable(body, req) {
  return proxy('POST', '/api/modelos-planes-contables', body, req);
}

async function actualizarModeloPlanContable(id, body, req) {
  return proxy('PUT', `/api/modelos-planes-contables/${id}`, body, req);
}

async function patchActivoModeloPlanContable(id, activo, req) {
  return proxy('PATCH', `/api/modelos-planes-contables/${id}/activo`, { activo }, req);
}

async function eliminarModeloPlanContable(id, req) {
  return proxy('DELETE', `/api/modelos-planes-contables/${id}`, {}, req);
}

async function crearCuentaContable(body, req) {
  return proxy('POST', '/api/cuentas-contables', body, req);
}

async function actualizarCuentaContable(id, body, req) {
  return proxy('PUT', `/api/cuentas-contables/${id}`, body, req);
}

async function patchActivoCuentaContable(id, activo, req) {
  return proxy('PATCH', `/api/cuentas-contables/${id}/activo`, { activo }, req);
}

async function eliminarCuentaContable(id, req) {
  return proxy('DELETE', `/api/cuentas-contables/${id}`, {}, req);
}

async function inicializarCuentasContablesDefecto(req) {
  return proxy('POST', '/api/cuentas-contables-defecto/inicializar', {}, req);
}

async function guardarCuentasContablesDefecto(body, req) {
  return proxy('PUT', '/api/cuentas-contables-defecto', body, req);
}

async function listarMovimientosExportar(query, req) {
  const qs = new URLSearchParams(query).toString();
  return proxy('GET', `/api/contabilidad/exportar?${qs}`, {}, req);
}

async function ejecutarExportacionContabilidad(body, req) {
  return proxy('POST', '/api/contabilidad/exportar/ejecutar', body, req);
}

async function proxyGet(path, req) {
  return proxy('GET', path, {}, req);
}

async function proxyPost(path, body, req) {
  return proxy('POST', path, body, req);
}

async function proxyPatch(path, body, req) {
  return proxy('PATCH', path, body, req);
}

async function proxyPut(path, body, req) {
  return proxy('PUT', path, body, req);
}

async function proxyDelete(path, req) {
  return proxy('DELETE', path, {}, req);
}

module.exports = {
  actualizarConfiguracionContabilidad,
  crearPeriodoContable,
  cerrarPeriodoContable,
  inicializarDiariosContablesDefecto,
  crearDiarioContable,
  actualizarDiarioContable,
  patchActivoDiarioContable,
  eliminarDiarioContable,
  crearModeloPlanContable,
  actualizarModeloPlanContable,
  patchActivoModeloPlanContable,
  eliminarModeloPlanContable,
  crearCuentaContable,
  actualizarCuentaContable,
  patchActivoCuentaContable,
  eliminarCuentaContable,
  inicializarCuentasContablesDefecto,
  guardarCuentasContablesDefecto,
  listarMovimientosExportar,
  ejecutarExportacionContabilidad,
  proxyGet,
  proxyPost,
  proxyPatch,
  proxyPut,
  proxyDelete,
};
