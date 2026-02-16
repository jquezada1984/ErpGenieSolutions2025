import axios from 'axios';

// URL base del Gateway API
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

// Configurar axios para el Gateway
const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar headers de autenticación y empresa
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Obtener id_empresa e id_usuario del token o localStorage
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Intentar obtener id_empresa del token o usar el que viene en el body
        if (payload.id_empresa) {
          config.headers['X-Company-Id'] = payload.id_empresa;
        }
        if (payload.sub || payload.id) {
          config.headers['X-User-Id'] = payload.sub || payload.id;
        }
      }
    } catch (e) {
      console.warn('No se pudo extraer headers del token:', e);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en API Tercero:', error.response?.data || error.message);
    
    // Extraer el mensaje de error específico de la respuesta
    if (error.response?.data?.error) {
      const customError = new Error(error.response.data.error);
      customError.status = error.response.status;
      customError.data = error.response.data;
      throw customError;
    }
    
    throw error;
  }
);

// ===== CONSULTAS (GET) - NestJS GraphQL a través del Gateway =====

// Listar todos los terceros
export const listarTerceros = async () => {
  try {
    const response = await apiClient.get('/api/tercero');
    return response.data || [];
  } catch (error) {
    console.error('❌ Error al listar terceros:', error);
    throw error;
  }
};

// Obtener un tercero por ID
export const obtenerTercero = async (id) => {
  try {
    const response = await apiClient.get(`/api/tercero/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener tercero:', error);
    throw error;
  }
};

// ===== CATÁLOGOS / SELECTS (GET) - NestJS GraphQL a través del Gateway =====

// Listar tipos de tercero
export const listarTiposTercero = async () => {
  try {
    const response = await apiClient.get('/api/tercero/selects/tipo-tercero');
    return response.data || [];
  } catch (error) {
    console.error('❌ Error al listar tipos de tercero:', error);
    throw error;
  }
};

// Listar condiciones de pago
export const listarCondicionesPago = async () => {
  try {
    const response = await apiClient.get('/api/tercero/selects/condicion-pago');
    return response.data || [];
  } catch (error) {
    console.error('❌ Error al listar condiciones de pago:', error);
    throw error;
  }
};

// Listar formas de pago
export const listarFormasPago = async () => {
  try {
    const response = await apiClient.get('/api/tercero/selects/forma-pago');
    return response.data || [];
  } catch (error) {
    console.error('❌ Error al listar formas de pago:', error);
    throw error;
  }
};

// Listar incoterms
export const listarIncoterms = async () => {
  try {
    const response = await apiClient.get('/api/tercero/selects/incoterms');
    return response.data || [];
  } catch (error) {
    console.error('❌ Error al listar incoterms:', error);
    throw error;
  }
};

// Listar países
export const listarPaises = async () => {
  try {
    const response = await apiClient.get('/api/tercero/selects/paises');
    console.log('📦 Respuesta de países:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('❌ Error al listar países:', error);
    console.error('❌ Detalles del error:', error.response?.data || error.message);
    throw error;
  }
};

// ===== MUTACIONES (POST/PUT/DELETE) - Python a través del Gateway =====

// Crear tercero
export const crearTercero = async (terceroData) => {
  try {
    const response = await apiClient.post('/api/tercero', terceroData);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear tercero:', error);
    throw error;
  }
};

// Actualizar tercero
export const actualizarTercero = async (id, terceroData) => {
  try {
    const response = await apiClient.put(`/api/tercero/${id}`, terceroData);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar tercero:', error);
    throw error;
  }
};

// Eliminar tercero
export const eliminarTercero = async (id) => {
  try {
    const response = await apiClient.delete(`/api/tercero/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar tercero:', error);
    throw error;
  }
};
