import axios from 'axios';

const GATEWAY_URL = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: `${GATEWAY_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.id_empresa) config.headers['X-Company-Id'] = payload.id_empresa;
      if (payload.sub || payload.id) config.headers['X-User-Id'] = payload.sub || payload.id;
    } catch {
      /* ignore */
    }
  }
  return config;
});

const unwrap = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
};

export const crearPeriodoContable = async (payload) =>
  unwrap(await apiClient.post('/periodos-contables', payload));

export const cerrarPeriodoContable = async (id) =>
  unwrap(await apiClient.patch(`/periodos-contables/${id}/cerrar`));

export const inicializarDiariosContablesDefecto = async () =>
  unwrap(await apiClient.post('/diarios-contables/inicializar-defecto'));

export const crearDiarioContable = async (payload) =>
  unwrap(await apiClient.post('/diarios-contables', payload));

export const actualizarDiarioContable = async (id, payload) =>
  unwrap(await apiClient.put(`/diarios-contables/${id}`, payload));

export const patchActivoDiarioContable = async (id, activo) =>
  unwrap(await apiClient.patch(`/diarios-contables/${id}/activo`, { activo }));

export const eliminarDiarioContable = async (id) =>
  unwrap(await apiClient.delete(`/diarios-contables/${id}`));

export const crearModeloPlanContable = async (payload) =>
  unwrap(await apiClient.post('/modelos-planes-contables', payload));

export const actualizarModeloPlanContable = async (id, payload) =>
  unwrap(await apiClient.put(`/modelos-planes-contables/${id}`, payload));

export const patchActivoModeloPlanContable = async (id, activo) =>
  unwrap(await apiClient.patch(`/modelos-planes-contables/${id}/activo`, { activo }));

export const eliminarModeloPlanContable = async (id) =>
  unwrap(await apiClient.delete(`/modelos-planes-contables/${id}`));

export const crearCuentaContable = async (payload) =>
  unwrap(await apiClient.post('/cuentas-contables', payload));

export const actualizarCuentaContable = async (id, payload) =>
  unwrap(await apiClient.put(`/cuentas-contables/${id}`, payload));

export const patchActivoCuentaContable = async (id, activo) =>
  unwrap(await apiClient.patch(`/cuentas-contables/${id}/activo`, { activo }));

export const eliminarCuentaContable = async (id) =>
  unwrap(await apiClient.delete(`/cuentas-contables/${id}`));

export const inicializarCuentasContablesDefecto = async () =>
  unwrap(await apiClient.post('/cuentas-contables-defecto/inicializar'));

export const guardarCuentasContablesDefecto = async (items) =>
  unwrap(await apiClient.put('/cuentas-contables-defecto', { items }));

export const listarMovimientosExportar = async (params = {}) => {
  const res = await apiClient.get('/contabilidad/exportar', { params });
  const body = unwrap(res);
  if (Array.isArray(body)) return body;
  return body?.data ?? [];
};

export const ejecutarExportacionContabilidad = async (payload) =>
  unwrap(await apiClient.post('/contabilidad/exportar/ejecutar', payload));

export const actualizarConfiguracionContabilidad = async (payload) =>
  unwrap(await apiClient.put('/configuracion-contabilidad', payload));

export const listarCuentasIva = async () => unwrap(await apiClient.get('/cuentas-iva'));
export const crearCuentaIva = async (payload) => unwrap(await apiClient.post('/cuentas-iva', payload));
export const actualizarCuentaIva = async (id, payload) => unwrap(await apiClient.put(`/cuentas-iva/${id}`, payload));
export const eliminarCuentaIva = async (id) => unwrap(await apiClient.delete(`/cuentas-iva/${id}`));

export const listarCuentasImpuestos = async () => unwrap(await apiClient.get('/cuentas-impuestos'));
export const crearCuentaImpuesto = async (payload) => unwrap(await apiClient.post('/cuentas-impuestos', payload));
export const actualizarCuentaImpuesto = async (id, payload) => unwrap(await apiClient.put(`/cuentas-impuestos/${id}`, payload));
export const eliminarCuentaImpuesto = async (id) => unwrap(await apiClient.delete(`/cuentas-impuestos/${id}`));

export const listarGruposCuentas = async () => unwrap(await apiClient.get('/grupos-cuentas-personalizados'));
export const crearGrupoCuentas = async (payload) => unwrap(await apiClient.post('/grupos-cuentas-personalizados', payload));
export const actualizarGrupoCuentas = async (id, payload) => unwrap(await apiClient.put(`/grupos-cuentas-personalizados/${id}`, payload));
export const eliminarGrupoCuentas = async (id) => unwrap(await apiClient.delete(`/grupos-cuentas-personalizados/${id}`));
export const asignarCuentasGrupo = async (id, ids_cuentas_contables) =>
  unwrap(await apiClient.put(`/grupos-cuentas-personalizados/${id}/cuentas`, { ids_cuentas_contables }));

export const actualizarCuentaBancariaContable = async (id, payload) =>
  unwrap(await apiClient.put(`/cuentas-bancarias-contables/${id}`, payload));

export const vincularAutomaticoClientes = async (anio) =>
  unwrap(await apiClient.post('/transferencia-contable/facturas-clientes/vincular-automatico', { anio }));
export const vincularAutomaticoProveedores = async (anio) =>
  unwrap(await apiClient.post('/transferencia-contable/facturas-proveedores/vincular-automatico', { anio }));
export const vincularLineasFactura = async (ids_lineas, id_cuenta_contable) =>
  unwrap(await apiClient.patch('/transferencia-contable/lineas/vincular', { ids_lineas, id_cuenta_contable }));
export const cambiarCuentaLineas = async (ids_lineas, id_cuenta_contable) =>
  unwrap(await apiClient.patch('/transferencia-contable/lineas/cambiar-cuenta', { ids_lineas, id_cuenta_contable }));
export const ejecutarRegistroContable = async (origen, payload) =>
  unwrap(await apiClient.post(`/transferencia-contable/registro/${origen}`, payload));
export const exportarDocumentosOrigen = async (params) =>
  unwrap(await apiClient.get('/transferencia-contable/exportar-documentos', { params }));

export const listarLineasFacturaClientes = async (anio, vinculadas = false) => {
  const res = await apiClient.get('/transferencia-contable/facturas-clientes/lineas', {
    params: { anio, vinculadas },
  });
  const body = unwrap(res);
  if (Array.isArray(body)) return body;
  return body?.data ?? [];
};

export const listarLineasFacturaProveedores = async (anio, vinculadas = false) => {
  const res = await apiClient.get('/transferencia-contable/facturas-proveedores/lineas', {
    params: { anio, vinculadas },
  });
  const body = unwrap(res);
  if (Array.isArray(body)) return body;
  return body?.data ?? [];
};
