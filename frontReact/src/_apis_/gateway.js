import axios from 'axios';

// URL base del Gateway Fastify
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

// Configurar axios para el Gateway
const gatewayClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para enviar token en peticiones GraphQL/REST (mismo comportamiento que Apollo)
gatewayClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
gatewayClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en Gateway:', error.response?.data || error.message);
    throw error;
  }
);

// ===== ENDPOINTS UNIFICADOS A TRAVÉS DEL GATEWAY =====

// CONSULTAS (GraphQL a través del Gateway)
export const getEmpresas = async () => {
  try {
    const response = await gatewayClient.get('/empresas');
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    throw error;
  }
};

export const getEmpresa = async (id) => {
  try {
    const response = await gatewayClient.get(`/empresas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener empresa:', error);
    throw error;
  }
};

// MUTACIONES (Python a través del Gateway)
export const crearEmpresa = async (empresaData) => {
  try {
    const response = await gatewayClient.post('/empresas', empresaData);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear empresa:', error);
    throw error;
  }
};

export const actualizarEmpresa = async (id, empresaData) => {
  try {
    const response = await gatewayClient.put(`/empresas/${id}`, empresaData);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al actualizar empresa:', error);
    throw error;
  }
};

export const eliminarEmpresa = async (id) => {
  try {
    const response = await gatewayClient.delete(`/empresas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al eliminar empresa:', error);
    throw error;
  }
};

// Catálogo impuestos (InicioNestJs – catálogo general vía GraphQL)
export const listarImpuestos = async () => {
  try {
    const response = await gatewayClient.post('/graphql', {
      query: `
        query {
          impuestos {
            id
            nombre
            tasa
          }
        }
      `,
    });
    const data = response.data?.data;
    const list = data?.impuestos ?? response.data?.impuestos ?? [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('❌ Error al listar impuestos:', error);
    return [];
  }
};

// Catálogo almacenes (InicioNestJs – catálogo general vía GraphQL)
export const listarAlmacenes = async () => {
  try {
    const response = await gatewayClient.post('/graphql', {
      query: `
        query {
          almacenes {
            id_almacen
            almacen_ref
            nombre
          }
        }
      `,
    });
    const data = response.data?.data;
    const list = data?.almacenes ?? response.data?.almacenes ?? [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('❌ Error al listar almacenes:', error);
    return [];
  }
};

// Catálogo tipos de unidad (InicioNestJs – catálogo general vía GraphQL)
export const listarTiposUnidad = async () => {
  try {
    const response = await gatewayClient.post('/graphql', {
      query: `
        query {
          tiposUnidad {
            id_tipo_unidad
            codigo
            nombre
          }
        }
      `,
    });
    const data = response.data?.data;
    const list = data?.tiposUnidad ?? response.data?.tiposUnidad ?? [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('❌ Error al listar tipos de unidad:', error);
    return [];
  }
};

// Catálogo unidades (InicioNestJs) con filtro opcional por tipo (ej: PESO, LONGITUD, SUPERFICIE, VOLUMEN)
export const listarUnidades = async (tipoCodigo) => {
  try {
    const hasTipo = typeof tipoCodigo === 'string' && tipoCodigo.trim() !== '';
    const response = await gatewayClient.post('/graphql', {
      query: hasTipo
        ? `
          query ($tipoCodigo: String) {
            unidades(tipoCodigo: $tipoCodigo) {
              id_unidad
              id_tipo_unidad
              codigo
              nombre
              abreviatura
              tipo_unidad {
                id_tipo_unidad
                codigo
                nombre
              }
            }
          }
        `
        : `
          query {
            unidades {
              id_unidad
              id_tipo_unidad
              codigo
              nombre
              abreviatura
              tipo_unidad {
                id_tipo_unidad
                codigo
                nombre
              }
            }
          }
        `,
      variables: hasTipo ? { tipoCodigo } : undefined,
    });
    const data = response.data?.data;
    const list = data?.unidades ?? response.data?.unidades ?? [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('❌ Error al listar unidades:', error);
    return [];
  }
};

// ===== ENDPOINTS DE MONITOREO =====

export const checkGatewayHealth = async () => {
  try {
    const response = await gatewayClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('❌ Gateway no saludable:', error);
    throw error;
  }
};

export const getGatewayStatus = async () => {
  try {
    const response = await gatewayClient.get('/status');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener estado del Gateway:', error);
    throw error;
  }
}; 