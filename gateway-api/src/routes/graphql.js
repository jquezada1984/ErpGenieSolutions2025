const axios = require('axios');

// URL del servicio NestJS GraphQL
const NESTJS_GRAPHQL_URL = process.env.NESTJS_SERVICE_URL + '/graphql';

// Función para ejecutar consultas GraphQL
async function executeGraphQLQuery(query, variables, operationName, context) {
  try {
    console.log('🟣 Ejecutando consulta GraphQL:', operationName || 'anonymous');
    
    const response = await axios.post(NESTJS_GRAPHQL_URL, {
      query,
      variables,
      operationName
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': context.request.headers.authorization || '',
      },
      timeout: parseInt(process.env.NESTJS_SERVICE_TIMEOUT || '5000')
    });

    console.log('✅ Consulta GraphQL ejecutada exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error ejecutando consulta GraphQL:', error.response?.data || error.message);
    throw error;
  }
}

async function routes(fastify, options) {
  // Endpoint GraphQL
  fastify.post('/graphql', async (request, reply) => {
    try {
      const { query, variables, operationName } = request.body;
      
      if (!query) {
        return reply.status(400).send({
          success: false,
          error: 'Query GraphQL requerida',
          timestamp: new Date().toISOString()
        });
      }

      const result = await executeGraphQLQuery(query, variables, operationName, { request });
      
      return reply.send(result);
    } catch (error) {
      fastify.log.error('Error en endpoint GraphQL:', error);
      
      return reply.status(500).send({
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message || 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para obtener el schema (opcional, para herramientas como GraphQL Playground)
  fastify.get('/graphql', async (request, reply) => {
    try {
      return reply.send({
        success: true,
        message: 'GraphQL Gateway endpoint',
        service: 'NestJS GraphQL',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      fastify.log.error('Error en endpoint GraphQL GET:', error);
      return reply.status(500).send({
        success: false,
        error: 'Error en endpoint GraphQL',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para verificar conectividad con NestJS GraphQL
  fastify.get('/graphql/health', async (request, reply) => {
    try {
      const response = await axios.get(NESTJS_GRAPHQL_URL.replace('/graphql', '/health'), {
        timeout: 3000
      });
      
      return reply.send({
        success: true,
        service: 'NestJS GraphQL',
        status: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.status(503).send({
        success: false,
        service: 'NestJS GraphQL',
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = routes; 