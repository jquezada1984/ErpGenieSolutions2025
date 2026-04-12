const axios = require('axios');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;
const TIMEOUT = parseInt(process.env.PYTHON_SERVICE_TIMEOUT || '5000');

if (!PYTHON_SERVICE_URL) {
  throw new Error('PYTHON_SERVICE_URL no está configurado en las variables de entorno');
}

// Cliente HTTP para Python Service
const pythonClient = axios.create({
  baseURL: PYTHON_SERVICE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para logging
pythonClient.interceptors.request.use(
  (config) => {
    console.log(`🐍 Python Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🐍 Python Request Error:', error);
    return Promise.reject(error);
  }
);

pythonClient.interceptors.response.use(
  (response) => {
    console.log(`🐍 Python Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🐍 Python Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

const pythonService = {
  // Métodos HTTP genéricos
  async get(endpoint, params = null) {
    return this.call(endpoint, 'GET', params);
  },

  async post(endpoint, data = null) {
    return this.call(endpoint, 'POST', data);
  },

  async put(endpoint, data = null) {
    return this.call(endpoint, 'PUT', data);
  },

  async delete(endpoint) {
    return this.call(endpoint, 'DELETE');
  },

  // Crear empresa
  async createEmpresa(empresaData) {
    try {
      const response = await pythonClient.post('/api/empresa', empresaData);
      return response.data;
    } catch (error) {
      // Manejar errores específicos de duplicidad
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        if (errorData.type === 'duplicate' && errorData.field === 'ruc') {
          throw new Error('Ya existe una empresa con este RUC');
        }
        if (errorData.type === 'duplicate' && errorData.field === 'email') {
          throw new Error('Ya existe una empresa con este email');
        }
        throw new Error(errorData.error || 'Error de duplicidad en los datos');
      }
      
      // Manejar otros errores
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      throw new Error(`Error creando empresa en Python: ${errorMessage}`);
    }
  },

  // Actualizar empresa
  async updateEmpresa(id, empresaData) {
    try {
      console.log(`🐍 Actualizando empresa ${id} con datos:`, JSON.stringify(empresaData, null, 2));
      const response = await pythonClient.put(`/api/empresa/${id}`, empresaData);
      console.log(`🐍 Respuesta de actualización:`, JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      // Manejar errores específicos de duplicidad
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        if (errorData.type === 'duplicate' && errorData.field === 'ruc') {
          throw new Error('Ya existe una empresa con este RUC');
        }
        if (errorData.type === 'duplicate' && errorData.field === 'email') {
          throw new Error('Ya existe una empresa con este email');
        }
        throw new Error(errorData.error || 'Error de duplicidad en los datos');
      }
      
      // Manejar otros errores
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      throw new Error(`Error actualizando empresa en Python: ${errorMessage}`);
    }
  },

  // Eliminar empresa (cambiar estado a false)
  async deleteEmpresa(id) {
    try {
      const response = await pythonClient.put(`/api/empresa/${id}`, { estado: false });
      return response.data;
    } catch (error) {
      throw new Error(`Error eliminando empresa en Python: ${error.response?.data?.message || error.message}`);
    }
  },

  // Obtener empresa por ID
  async getEmpresa(id) {
    try {
      const response = await pythonClient.get(`/api/empresa/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo empresa en Python: ${error.response?.data?.message || error.message}`);
    }
  },

  // Obtener todas las empresas
  async getEmpresas() {
    try {
      const response = await pythonClient.get('/api/empresa');
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo empresas en Python: ${error.response?.data?.message || error.message}`);
    }
  },

  _authHeaders(authHeader) {
    if (!authHeader) return {};
    return { headers: { Authorization: authHeader } };
  },

  // Usuario: crear (InicioPython guarda; requiere JWT igual que PUT)
  async createUsuario(usuarioData, authHeader) {
    try {
      const response = await pythonClient.post(
        '/api/usuario',
        usuarioData,
        this._authHeaders(authHeader),
      );
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const d = error.response?.data;
      const errorMessage =
        d?.msg ||
        d?.error ||
        d?.message ||
        error.response?.statusText ||
        error.message;
      const err = new Error(`Error creando usuario en Python: ${errorMessage}`);
      err.statusCode = status;
      throw err;
    }
  },

  // Usuario: actualizar
  async updateUsuario(id, usuarioData, authHeader) {
    try {
      const response = await pythonClient.put(
        `/api/usuario/${id}`,
        usuarioData,
        this._authHeaders(authHeader),
      );
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const d = error.response?.data;
      const errorMessage =
        d?.msg ||
        d?.error ||
        d?.message ||
        error.response?.statusText ||
        error.message;
      const err = new Error(`Error actualizando usuario en Python: ${errorMessage}`);
      err.statusCode = status;
      throw err;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await pythonClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Error en health check de Python: ${error.message}`);
    }
  },

  // Método genérico para llamadas personalizadas
  async call(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method: method.toLowerCase(),
        url: endpoint
      };

      if (data) {
        if (method.toUpperCase() === 'GET') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await pythonClient(config);
      return response.data;
    } catch (error) {
      throw new Error(`Error en llamada a Python ${method} ${endpoint}: ${error.response?.data?.message || error.message}`);
    }
  }
};

module.exports = pythonService; 