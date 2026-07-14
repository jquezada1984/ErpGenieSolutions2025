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
    console.error('❌ Error en API Socio:', error.response?.data || error.message);

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

// ===== CATÁLOGOS / SELECTS (GET) - REST a través del Gateway =====

// Listar roles de socio
export const listarRolesSocio = async () => {
  try {
    const response = await apiClient.get('/api/socio/selects/rol-socio');
    const body = response.data;
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.data)) return body.data;
    return [];
  } catch (error) {
    console.error('❌ Error al listar roles de socio:', error);
    throw error;
  }
};

// Listar terceros disponibles para socio
export const listarTercerosDisponibles = async (params) => {
  try {
    const response = await apiClient.get('/api/socio/selects/terceros', { params });
    const body = response.data;
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.data)) return body.data;
    return [];
  } catch (error) {
    console.error('❌ Error al listar terceros disponibles para socio:', error);
    throw error;
  }
};

// ===== MUTACIONES (POST/PUT/PATCH) - Python a través del Gateway =====

// Crear socio
export const crearSocio = async (data) => {
  try {
    const response = await apiClient.post('/api/socio', data);
    return response.data;
  } catch (error) {
    console.error('❌ Error completo:', error.response?.data);
    //console.error('❌ Error al crear socio:', error);
    throw error;
  }
};

// Actualizar socio
export const actualizarSocio = async (id, data) => {
  try {
    const response = await apiClient.put(`/api/socio/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar socio:', error);
    throw error;
  }
};

// Cambiar estado de socio
export const toggleEstadoSocio = async (id) => {
  try {
    const response = await apiClient.patch(`/api/socio/${id}/estado`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al cambiar estado de socio:', error);
    throw error;
  }
};
