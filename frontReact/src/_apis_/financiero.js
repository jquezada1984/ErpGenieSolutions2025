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
      const storedEmpresa =
        typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('erp.id_empresa') : '';
      if (storedEmpresa) config.headers['X-Company-Id'] = storedEmpresa;
      else if (payload.id_empresa) config.headers['X-Company-Id'] = payload.id_empresa;
      if (payload.sub || payload.id) config.headers['X-User-Id'] = payload.sub || payload.id;
      if (payload.scope_acceso) config.headers['X-Scope-Acceso'] = payload.scope_acceso;
    } catch {
      /* ignore */
    }
  }
  return config;
});

const unwrap = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'data' in body && body.success !== undefined) {
    return body.data;
  }
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
};

export const crearFacturaCliente = async (payload) =>
  unwrap(await apiClient.post('/facturas-clientes', payload));

export const reemplazarLineasFactura = async (id, lineas) =>
  unwrap(await apiClient.put(`/facturas-clientes/${id}/lineas`, { lineas }));

export const reemplazarLineasFacturaProveedor = async (id, lineas) =>
  unwrap(await apiClient.put(`/facturas-proveedores/${id}/lineas`, { lineas }));

export const validarFacturaCliente = async (id) =>
  unwrap(await apiClient.post(`/facturas-clientes/${id}/validar`));

export const anularFacturaCliente = async (id) =>
  unwrap(await apiClient.post(`/facturas-clientes/${id}/anular`));

export const crearFacturaProveedor = async (payload) =>
  unwrap(await apiClient.post('/facturas-proveedores', payload));

export const validarFacturaProveedor = async (id) =>
  unwrap(await apiClient.post(`/facturas-proveedores/${id}/validar`));

export const anularFacturaProveedor = async (id) =>
  unwrap(await apiClient.post(`/facturas-proveedores/${id}/anular`));

export const crearCobro = async (payload) => unwrap(await apiClient.post('/cobros', payload));

export const validarCobro = async (id) => unwrap(await apiClient.post(`/cobros/${id}/validar`));

export const anularCobro = async (id) => unwrap(await apiClient.post(`/cobros/${id}/anular`));

export const crearPagoProveedor = async (payload) =>
  unwrap(await apiClient.post('/pagos-proveedor', payload));

export const validarPagoProveedor = async (id) =>
  unwrap(await apiClient.post(`/pagos-proveedor/${id}/validar`));

export const anularPagoProveedor = async (id) =>
  unwrap(await apiClient.post(`/pagos-proveedor/${id}/anular`));

export const enviarCorreoFacturaCliente = async (id, payload = {}) =>
  unwrap(await apiClient.post(`/facturas-clientes/${id}/enviar-correo`, payload));

export const enviarCorreoFacturaProveedor = async (id, payload = {}) =>
  unwrap(await apiClient.post(`/facturas-proveedores/${id}/enviar-correo`, payload));

const abrirBlobPdf = (blob, nombre) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.target = '_blank';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const descargarPdfFacturaCliente = async (id) => {
  const res = await apiClient.get(`/documentos/factura-cliente/${id}`, { responseType: 'blob' });
  abrirBlobPdf(res.data, `factura-${id}.pdf`);
};

export const descargarPdfFacturaProveedor = async (id) => {
  const res = await apiClient.get(`/documentos/factura-proveedor/${id}`, { responseType: 'blob' });
  abrirBlobPdf(res.data, `factura-prov-${id}.pdf`);
};

export const descargarPdfPago = async (id) => {
  const res = await apiClient.get(`/documentos/pago/${id}`, { responseType: 'blob' });
  abrirBlobPdf(res.data, `pago-${id}.pdf`);
};
