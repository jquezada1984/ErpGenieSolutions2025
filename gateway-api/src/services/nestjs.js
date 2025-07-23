const axios = require('axios');

const NESTJS_SERVICE_URL = process.env.NESTJS_SERVICE_URL;
const TIMEOUT = parseInt(process.env.NESTJS_SERVICE_TIMEOUT || '5000');

if (!NESTJS_SERVICE_URL) {
  throw new Error('NESTJS_SERVICE_URL no está configurado en las variables de entorno');
}

// Cliente HTTP para NestJS GraphQL Service
const nestjsClient = axios.create({
  baseURL: NESTJS_SERVICE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para logging
nestjsClient.interceptors.request.use(
  (config) => {
    console.log(`🟢 NestJS Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🟢 NestJS Request Error:', error);
    return Promise.reject(error);
  }
);

nestjsClient.interceptors.response.use(
  (response) => {
    console.log(`🟢 NestJS Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🟢 NestJS Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

const nestjsService = {
  // Obtener todas las empresas
  async getEmpresas() {
    try {
      const query = `
        query {
          empresas {
            id_empresa
            nombre
            ruc
            direccion
            telefono
            email
            estado
          }
        }
      `;

      const response = await nestjsClient.post('/graphql', { query });
      
      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo empresas desde NestJS: ${error.response?.data?.message || error.message}`);
    }
  },

  // Obtener empresa por ID
  async getEmpresa(id) {
    try {
      const query = `
        query GetEmpresa($id_empresa: ID!) {
          empresa(id_empresa: $id_empresa) {
            id_empresa
            nombre
            ruc
            direccion
            telefono
            email
            estado
          }
        }
      `;

      const variables = { id_empresa: id };

      const response = await nestjsClient.post('/graphql', { 
        query, 
        variables 
      });
      
      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo empresa desde NestJS: ${error.response?.data?.message || error.message}`);
    }
  },

  // Ejecutar query GraphQL personalizada
  async executeQuery(query, variables = {}) {
    try {
      const response = await nestjsClient.post('/graphql', { 
        query, 
        variables 
      });
      
      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Error ejecutando query GraphQL: ${error.response?.data?.message || error.message}`);
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await nestjsClient.get('/health');
      return response.data;
    } catch (error) {
      // Si no hay endpoint /health, intentar con GraphQL
      try {
        const query = `query { __typename }`;
        const response = await nestjsClient.post('/graphql', { query });
        return { status: 'OK', graphql: 'available' };
      } catch (graphqlError) {
        throw new Error(`Error en health check de NestJS: ${error.message}`);
      }
    }
  },

  // Método genérico para llamadas REST
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

      const response = await nestjsClient(config);
      return response.data;
    } catch (error) {
      throw new Error(`Error en llamada a NestJS ${method} ${endpoint}: ${error.response?.data?.message || error.message}`);
    }
  }
};

module.exports = nestjsService; 