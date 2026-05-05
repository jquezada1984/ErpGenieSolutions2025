/**
 * API del módulo Item vía Gateway.
 * Lectura (catálogos) → Gateway → ItemNestJs.
 * Escritura (crear ítem) → Gateway → ItemPython POST /api/item.
 * Actualizar ítem → Gateway → ItemPython PUT /api/item/:id_item.
 * Actualizar servicio (tipo SERVICE) → Gateway → ItemPython PUT /api/item/servicio/:id_item.
 * Mismo patrón que _apis_/tercero.js.
 */
import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id_empresa) config.headers['X-Company-Id'] = payload.id_empresa;
        if (payload.sub || payload.id) config.headers['X-User-Id'] = payload.sub || payload.id;
      } catch (e) {
        console.warn('No se pudo extraer headers del token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const msg =
      (typeof data?.error === 'string' && data.error) ||
      (typeof data?.message === 'string' && data.message) ||
      error.message ||
      'Error en la petición';
    const err = new Error(msg);
    if (error.response) {
      err.status = error.response.status;
      err.data = data;
    }
    return Promise.reject(err);
  }
);

// ===== CATÁLOGOS / SELECTS (GET) - ItemNestJs a través del Gateway =====

/**
 * Lista estados de venta (catálogo estado_venta_item) para combo "Estado venta" en NuevoProducto.
 * Devuelve array con { id_estado_venta, codigo, nombre, descripcion, orden }.
 * Gateway envía el array envuelto en { success, data, timestamp }; usar response.data.data (mismo patrón que _apis_/gateway.js).
 */
export const listarEstadosVentaItem = async () => {
  try {
    const response = await apiClient.get('/api/item/selects/estado-venta');
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar estados venta item:', error);
    return [];
  }
};

/**
 * Lista estados de compra (catálogo estado_compra_item) para combo "Estado compra" en NuevoProducto.
 * Devuelve array con { id_estado_compra, codigo, nombre, descripcion, orden }.
 * Gateway envía el array envuelto en { success, data, timestamp }; usar response.data.data.
 */
export const listarEstadosCompraItem = async () => {
  try {
    const response = await apiClient.get('/api/item/selects/estado-compra');
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar estados compra item:', error);
    return [];
  }
};

/**
 * Lista naturalezas de ítem (catálogo naturaleza_item_catalogo) para combo "Naturaleza producto" en NuevoProducto.
 * Devuelve array con { id_naturaleza_item, codigo, nombre, descripcion, orden }.
 */
export const listarNaturalezasItem = async () => {
  try {
    const response = await apiClient.get('/api/item/selects/naturaleza');
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar naturalezas item:', error);
    return [];
  }
};

/**
 * Catálogo tipo_control_inventario_item (combo Control de inventario).
 */
export const listarTiposControlInventarioItem = async () => {
  try {
    const response = await apiClient.get('/api/item/selects/control-inventario');
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar tipos control inventario item:', error);
    return [];
  }
};

/**
 * Catálogo tipo_control_caducidad_item (combo Control de fechas).
 */
export const listarTiposControlCaducidadItem = async () => {
  try {
    const response = await apiClient.get('/api/item/selects/control-caducidad');
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar tipos control caducidad item:', error);
    return [];
  }
};

/**
 * Catálogo tipo_comportamiento_item (SIMPLE, INVENTARIABLE, SERVICIO, etc.).
 */
export const listarTiposComportamientoItem = async () => {
  try {
    const response = await apiClient.get('/api/item/selects/comportamiento-item');
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar tipos comportamiento item:', error);
    return [];
  }
};

/**
 * Crear ítem (tabla item) → Gateway → ItemPython POST /api/item.
 * Headers X-Company-Id / X-User-Id los añade el interceptor desde el JWT.
 */
export const crearItemProducto = async (body) => {
  const response = await apiClient.post('/api/item', body);
  return response.data;
};

/**
 * Crear cabecera de inventario → Gateway → ItemPython POST /api/inventario.
 */
export const crearInventario = async (body) => {
  const response = await apiClient.post('/api/inventario', body);
  return response.data;
};

/**
 * Actualizar cabecera de inventario → Gateway → InventarioPython PUT /api/inventario/:id_inventario
 */
export const actualizarInventario = async (id_inventario, body) => {
  const id = encodeURIComponent(String(id_inventario || '').trim());
  const response = await apiClient.put(`/api/inventario/${id}`, body);
  return response.data;
};

/**
 * Actualizar ítem existente (tabla item) → Gateway → ItemPython PUT /api/item/:id_item.
 */
export const actualizarItemProducto = async (id_item, body) => {
  const response = await apiClient.put(`/api/item/${encodeURIComponent(id_item)}`, body);
  return response.data;
};

/**
 * Actualizar solo servicio (tipo SERVICE) → Gateway → ItemPython PUT /api/item/servicio/:id_item.
 */
export const actualizarItemServicio = async (id_item, body) => {
  const response = await apiClient.put(
    `/api/item/servicio/${encodeURIComponent(String(id_item || '').trim())}`,
    body,
  );
  return response.data;
};

/**
 * Catálogo etiquetas/categorías comerciales (tabla item_etiqueta_categoria).
 * Gateway → ItemPython GET /api/item/etiqueta-categoria (params: id_empresa; opcional id_tipo_item UUID tipo_item_catalogo).
 * Sin id_empresa el backend devuelve lista vacía; no rompe la UI.
 * Sin id_tipo_item el backend lista todas las filas de la empresa (compatibilidad consumidores antiguos).
 * opciones.incluirSinTipoItem: solo modal Nuevo Producto — incluye filas con id_tipo_item NULL (legado).
 */
export const listarEtiquetasCategoria = async (id_empresa, id_tipo_item, opciones = {}) => {
  try {
    const params = {};
    if (id_empresa != null && String(id_empresa).trim() !== '') {
      params.id_empresa = String(id_empresa).trim();
    }
    if (id_tipo_item != null && String(id_tipo_item).trim() !== '') {
      params.id_tipo_item = String(id_tipo_item).trim();
    }
    if (opciones && opciones.incluirSinTipoItem === true) {
      params.incluir_sin_tipo_item = '1';
    }
    const config = Object.keys(params).length > 0 ? { params } : {};
    const response = await apiClient.get('/api/item/etiqueta-categoria', config);
    const raw = response.data;
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    console.error('❌ Error al listar etiquetas/categorías:', error);
    return [];
  }
};

/**
 * Crear fila en item_etiqueta_categoria → Gateway → ItemPython POST /api/item/etiqueta-categoria.
 * id_empresa puede ir en body; el interceptor añade X-Company-Id desde el JWT.
 */
export const crearEtiquetaCategoria = async (body) => {
  const response = await apiClient.post('/api/item/etiqueta-categoria', body);
  return response.data;
};

/**
 * Actualizar fila en item_etiqueta_categoria → Gateway → ItemPython
 * PUT /api/item/etiqueta-categoria/:id_etiqueta_categoria
 * Body: id_empresa, id_etiqueta_categoria (opcional, eco), ref, nombre, descripcion, color, posicion, estado
 */
export const actualizarEtiquetaCategoria = async (id_etiqueta_categoria, body) => {
  const response = await apiClient.put(
    `/api/item/etiqueta-categoria/${encodeURIComponent(String(id_etiqueta_categoria || '').trim())}`,
    body
  );
  return response.data;
};

/**
 * Cambiar solo estado (activo/inactivo) → Gateway → ItemPython
 * PATCH /api/item/etiqueta-categoria/:id/estado
 * Body: { id_empresa?, estado: boolean }
 */
export const cambiarEstadoEtiquetaCategoria = async (id_etiqueta_categoria, body) => {
  const id = encodeURIComponent(String(id_etiqueta_categoria || '').trim());
  const response = await apiClient.patch(`/api/item/etiqueta-categoria/${id}/estado`, body);
  return response.data;
};
