const { empresaSchema, empresaUpdateSchema } = require('../schemas/empresa');
const { pythonService, nestjsService } = require('../services');

async function routes(fastify, options) {
  
  // GET /gateway/empresas - Obtener todas las empresas (NestJS GraphQL)
  fastify.get('/empresas', {
    schema: {
      description: 'Obtener todas las empresas',
      tags: ['Empresas'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id_empresa: { type: 'string' },
                  nombre: { type: 'string' },
                  ruc: { type: 'string' },
                  direccion: { type: 'string' },
                  telefono: { type: 'string' },
                  email: { type: 'string' },
                  estado: { type: 'boolean' }
                }
              }
            },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      fastify.log.info('GET /empresas - Obteniendo empresas desde NestJS');
      
      const response = await nestjsService.getEmpresas();
      return response.data?.empresas || [];
      
    } catch (error) {
      fastify.log.error('Error obteniendo empresas:', error);
      throw new Error(`Error al obtener empresas: ${error.message}`);
    }
  });

  // GET /gateway/empresas/:id - Obtener empresa específica (NestJS GraphQL)
  fastify.get('/empresas/:id', {
    schema: {
      description: 'Obtener empresa por ID',
      tags: ['Empresas'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID de la empresa' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id_empresa: { type: 'string' },
                nombre: { type: 'string' },
                ruc: { type: 'string' },
                direccion: { type: 'string' },
                telefono: { type: 'string' },
                email: { type: 'string' },
                estado: { type: 'boolean' }
              }
            },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      fastify.log.info(`GET /empresas/${id} - Obteniendo empresa desde NestJS`);
      
      const response = await nestjsService.getEmpresa(id);
      return response.data?.empresa;
      
    } catch (error) {
      fastify.log.error(`Error obteniendo empresa ${request.params.id}:`, error);
      throw new Error(`Error al obtener empresa: ${error.message}`);
    }
  });

  // POST /gateway/empresas - Crear nueva empresa (Python REST)
  fastify.post('/empresas', {
    schema: {
      description: 'Crear nueva empresa',
      tags: ['Empresas'],
      body: empresaSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const empresaData = request.body;
      fastify.log.info('POST /empresas - Creando empresa en Python');
      
      const response = await pythonService.createEmpresa(empresaData);
      reply.status(201);
      return response;
      
    } catch (error) {
      fastify.log.error('Error creando empresa:', error);
      
      // Detectar errores específicos de duplicidad
      if (error.message.includes('Ya existe una empresa con este RUC')) {
        return reply.status(409).send({
          success: false,
          error: 'Ya existe una empresa con este RUC',
          field: 'ruc',
          type: 'duplicate',
          timestamp: new Date().toISOString()
        });
      }
      if (error.message.includes('Ya existe una empresa con este email')) {
        return reply.status(409).send({
          success: false,
          error: 'Ya existe una empresa con este email',
          field: 'email',
          type: 'duplicate',
          timestamp: new Date().toISOString()
        });
      }
      
      // Detectar errores de validación
      if (error.message.includes('body/') || error.message.includes('must match')) {
        return reply.status(400).send({
          success: false,
          error: error.message,
          type: 'validation',
          timestamp: new Date().toISOString()
        });
      }
      
      // Error genérico
      return reply.status(500).send({
        success: false,
        error: `Error al crear empresa: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  });

  // PUT /gateway/empresas/:id - Actualizar empresa (Python REST)
  fastify.put('/empresas/:id', {
    schema: {
      description: 'Actualizar empresa',
      tags: ['Empresas'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID de la empresa' }
        },
        required: ['id']
      },
      body: empresaUpdateSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const empresaData = request.body;
      
      console.log('🚀 Gateway - Datos recibidos del frontend:', JSON.stringify(empresaData, null, 2));
      console.log('🚀 Gateway - Campos recibidos:', Object.keys(empresaData));
      
      fastify.log.info(`PUT /empresas/${id} - Actualizando empresa en Python`);
      fastify.log.info(`Datos a actualizar:`, JSON.stringify(empresaData, null, 2));
      
      const response = await pythonService.updateEmpresa(id, empresaData);
      fastify.log.info(`Respuesta de Python:`, JSON.stringify(response, null, 2));
      
      // Devolver respuesta directa sin procesamiento adicional
      return reply.send(response);
      
    } catch (error) {
      fastify.log.error(`Error actualizando empresa ${request.params.id}:`, error);
      
      // Detectar errores específicos de duplicidad
      if (error.message.includes('Ya existe una empresa con este RUC')) {
        return reply.status(409).send({
          success: false,
          error: 'Ya existe una empresa con este RUC',
          field: 'ruc',
          type: 'duplicate',
          timestamp: new Date().toISOString()
        });
      }
      if (error.message.includes('Ya existe una empresa con este email')) {
        return reply.status(409).send({
          success: false,
          error: 'Ya existe una empresa con este email',
          field: 'email',
          type: 'duplicate',
          timestamp: new Date().toISOString()
        });
      }
      
      // Detectar errores de validación
      if (error.message.includes('body/') || error.message.includes('must match')) {
        return reply.status(400).send({
          success: false,
          error: error.message,
          type: 'validation',
          timestamp: new Date().toISOString()
        });
      }
      
      // Error genérico
      return reply.status(500).send({
        success: false,
        error: `Error al actualizar empresa: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  });

  // DELETE /gateway/empresas/:id - Eliminar empresa (Python REST)
  fastify.delete('/empresas/:id', {
    schema: {
      description: 'Eliminar empresa (cambiar estado a false)',
      tags: ['Empresas'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID de la empresa' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      fastify.log.info(`DELETE /empresas/${id} - Eliminando empresa en Python`);
      
      const response = await pythonService.deleteEmpresa(id);
      return response;
      
    } catch (error) {
      fastify.log.error(`Error eliminando empresa ${request.params.id}:`, error);
      throw new Error(`Error al eliminar empresa: ${error.message}`);
    }
  });
}

module.exports = routes; 