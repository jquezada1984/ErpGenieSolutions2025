const { pythonService, nestjsService } = require('../services');

async function routes(fastify, options) {
  
  // GET /gateway/health - Health check de todos los servicios
  fastify.get('/health', {
    schema: {
      description: 'Health check de todos los microservicios',
      tags: ['Monitoreo'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                gateway: { type: 'string' },
                services: {
                  type: 'object',
                  properties: {
                    python: { type: 'object' },
                    nestjs: { type: 'object' }
                  }
                },
                timestamp: { type: 'string' }
              }
            },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      fastify.log.info('GET /health - Verificando salud de servicios');
      
      const healthStatus = {
        gateway: 'OK',
        services: {},
        timestamp: new Date().toISOString()
      };

      // Verificar Python Service
      try {
        const pythonHealth = await pythonService.healthCheck();
        healthStatus.services.python = {
          status: 'OK',
          response: pythonHealth
        };
      } catch (error) {
        healthStatus.services.python = {
          status: 'ERROR',
          error: error.message
        };
      }

      // Verificar NestJS Service
      try {
        const nestjsHealth = await nestjsService.healthCheck();
        healthStatus.services.nestjs = {
          status: 'OK',
          response: nestjsHealth
        };
      } catch (error) {
        healthStatus.services.nestjs = {
          status: 'ERROR',
          error: error.message
        };
      }

      return healthStatus;
      
    } catch (error) {
      fastify.log.error('Error en health check:', error);
      throw new Error(`Error en health check: ${error.message}`);
    }
  });

  // GET /gateway/status - Estado del Gateway
  fastify.get('/status', {
    schema: {
      description: 'Estado del API Gateway',
      tags: ['Monitoreo'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                version: { type: 'string' },
                uptime: { type: 'number' },
                services: {
                  type: 'object',
                  properties: {
                    python: { type: 'string' },
                    nestjs: { type: 'string' }
                  }
                },
                endpoints: {
                  type: 'array',
                  items: { type: 'string' }
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
      const startTime = process.uptime();
      
      const status = {
        status: 'RUNNING',
        version: '1.0.0',
        uptime: Math.floor(startTime),
        services: {
          python: process.env.PYTHON_SERVICE_URL,
          nestjs: process.env.NESTJS_SERVICE_URL
        },
        endpoints: [
          'GET /gateway/empresas',
          'GET /gateway/empresas/:id',
          'POST /gateway/empresas',
          'PUT /gateway/empresas/:id',
          'DELETE /gateway/empresas/:id',
          'GET /gateway/health',
          'GET /gateway/status'
        ]
      };

      return status;
      
    } catch (error) {
      fastify.log.error('Error obteniendo status:', error);
      throw new Error(`Error obteniendo status: ${error.message}`);
    }
  });
}

module.exports = routes; 