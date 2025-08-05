const axios = require('axios');

// Configuración del microservicio Python
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

// Middleware para manejar errores de comunicación con Python
const handlePythonError = (error) => {
  console.error('❌ Error comunicándose con Python:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    return {
      success: false,
      error: 'Servicio Python no disponible',
      message: 'El servicio de Python no está respondiendo'
    };
  }
  
  if (error.response) {
    // Error de respuesta del servidor Python
    return {
      success: false,
      error: error.response.data?.error || 'Error en el servicio Python',
      message: error.response.data?.message || 'Error interno del servidor'
    };
  }
  
  return {
    success: false,
    error: 'Error de comunicación',
    message: 'No se pudo comunicar con el servicio Python'
  };
};

// Esquemas de validación para Fastify
const perfilSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 50 },
    descripcion: { type: 'string' },
    id_empresa: { type: 'string' },
    estado: { type: 'boolean' }
  },
  required: ['nombre', 'id_empresa']
};

const perfilUpdateSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 50 },
    descripcion: { type: 'string' },
    estado: { type: 'boolean' }
  }
};

const estadoSchema = {
  type: 'object',
  properties: {
    estado: { type: 'boolean' }
  },
  required: ['estado']
};

async function perfilRoutes(fastify, options) {
  
  // GET /api/perfiles - Obtener todos los perfiles
  fastify.get('/perfiles', async (request, reply) => {
    try {
      fastify.log.info('🔄 Gateway: Obteniendo perfiles desde Python...');
      
      const response = await axios.get(`${PYTHON_SERVICE_URL}/api/perfiles`);
      
      fastify.log.info('✅ Gateway: Perfiles obtenidos exitosamente');
      return response.data;
    } catch (error) {
      fastify.log.error('❌ Gateway: Error obteniendo perfiles:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });

  // GET /api/perfiles/:id - Obtener un perfil específico
  fastify.get('/perfiles/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      fastify.log.info(`🔄 Gateway: Obteniendo perfil ${id} desde Python...`);
      
      const response = await axios.get(`${PYTHON_SERVICE_URL}/api/perfiles/${id}`);
      
      fastify.log.info('✅ Gateway: Perfil obtenido exitosamente');
      return response.data;
    } catch (error) {
      fastify.log.error('❌ Gateway: Error obteniendo perfil:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });

  // POST /api/perfiles - Crear un nuevo perfil
  fastify.post('/perfiles', {
    schema: {
      body: perfilSchema
    }
  }, async (request, reply) => {
    try {
      const perfilData = request.body;
      fastify.log.info('🔄 Gateway: Creando perfil en Python...', perfilData);
      
      const response = await axios.post(`${PYTHON_SERVICE_URL}/api/perfiles`, perfilData);
      
      fastify.log.info('✅ Gateway: Perfil creado exitosamente');
      reply.status(201).send(response.data);
    } catch (error) {
      fastify.log.error('❌ Gateway: Error creando perfil:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });

  // PUT /api/perfiles/:id - Actualizar un perfil
  fastify.put('/perfiles/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: perfilUpdateSchema
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const perfilData = request.body;
      fastify.log.info(`🔄 Gateway: Actualizando perfil ${id} en Python...`, perfilData);
      
      const response = await axios.put(`${PYTHON_SERVICE_URL}/api/perfiles/${id}`, perfilData);
      
      fastify.log.info('✅ Gateway: Perfil actualizado exitosamente');
      return response.data;
    } catch (error) {
      fastify.log.error('❌ Gateway: Error actualizando perfil:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });

  // DELETE /api/perfiles/:id - Eliminar un perfil
  fastify.delete('/perfiles/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      fastify.log.info(`🔄 Gateway: Eliminando perfil ${id} en Python...`);
      
      const response = await axios.delete(`${PYTHON_SERVICE_URL}/api/perfiles/${id}`);
      
      fastify.log.info('✅ Gateway: Perfil eliminado exitosamente');
      return response.data;
    } catch (error) {
      fastify.log.error('❌ Gateway: Error eliminando perfil:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });

  // PUT /api/perfiles/:id/estado - Cambiar estado de un perfil
  fastify.put('/perfiles/:id/estado', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: estadoSchema
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { estado } = request.body;
      fastify.log.info(`🔄 Gateway: Cambiando estado del perfil ${id} a ${estado} en Python...`);
      
      const response = await axios.put(`${PYTHON_SERVICE_URL}/api/perfiles/${id}/estado`, { estado });
      
      fastify.log.info('✅ Gateway: Estado de perfil cambiado exitosamente');
      return response.data;
    } catch (error) {
      fastify.log.error('❌ Gateway: Error cambiando estado de perfil:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });

  // GET /api/empresas/:empresaId/perfiles - Obtener perfiles por empresa
  fastify.get('/empresas/:empresaId/perfiles', {
    schema: {
      params: {
        type: 'object',
        properties: {
          empresaId: { type: 'string' }
        },
        required: ['empresaId']
      }
    }
  }, async (request, reply) => {
    try {
      const { empresaId } = request.params;
      fastify.log.info(`🔄 Gateway: Obteniendo perfiles de empresa ${empresaId} desde Python...`);
      
      const response = await axios.get(`${PYTHON_SERVICE_URL}/api/empresas/${empresaId}/perfiles`);
      
      fastify.log.info('✅ Gateway: Perfiles por empresa obtenidos exitosamente');
      return response.data;
    } catch (error) {
      fastify.log.error('❌ Gateway: Error obteniendo perfiles por empresa:', error.message);
      const errorResponse = handlePythonError(error);
      reply.status(error.response?.status || 500).send(errorResponse);
    }
  });
}

module.exports = perfilRoutes; 