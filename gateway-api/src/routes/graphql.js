const axios = require('axios');

// Función para determinar el servicio objetivo basado en la consulta
const getTargetService = (query, config) => {
  // Primero verificar si es una mutación de autenticación (debe ir a InicioNestJs)
  if (query && (
    query.includes('mutation') && (
      query.includes('login') ||
      query.includes('register') ||
      query.includes('refreshToken') ||
      query.includes('validateToken')
    )
  )) {
    console.log('🔄 Redirigiendo mutación de autenticación a InicioNestJs');
    return config.nestjsService;
  }

  if (query && query.includes('mutation') && query.includes('actualizarEstadoItem')) {
    console.log('🔄 Redirigiendo mutación actualizarEstadoItem a ItemNestJs');
    return config.itemNestJsService;
  }
  
  // Verificar si es una consulta de catálogos de terceros o contactos (TerceroNestJs)
  if (query && (
    query.includes('incoterms') ||
    query.includes('tiposTercero') ||
    query.includes('representantesPorEmpresa') ||
    query.includes('terceros') ||
    query.includes('tercero(') ||
    query.includes('clientes') ||
    query.includes('contactosByTercero') ||
    query.includes('contacto(')
  )) {
    console.log('🔄 Redirigiendo consulta de terceros/contactos a TerceroNestJs');
    return config.terceroNestJsService;
  }
  
  // Verificar si es una consulta de catálogos del módulo item (ItemNestJs)
  if (query && (
    query.includes('itemDetalleEdicion') ||
    query.includes('itemsListado') ||
    query.includes('estadosVentaItem') ||
    query.includes('estadosCompraItem') ||
    query.includes('naturalezasItem') ||
    query.includes('tiposControlInventarioItem') ||
    query.includes('tiposControlCaducidadItem')
  )) {
    console.log('🔄 Redirigiendo consulta de item (catálogos) a ItemNestJs');
    return config.itemNestJsService;
  }

  // Catálogo tipo ítem (tabla tipo_item_catalogo) en InicioNestJs
  if (query && query.includes('tiposItemCatalogo')) {
    console.log('🔄 Redirigiendo consulta tiposItemCatalogo a InicioNestJs');
    return config.nestjsService;
  }

  // Catálogo almacenes vive en InicioNestJs (catálogo general)
  if (query && query.includes('almacenes')) {
    console.log('🔄 Redirigiendo consulta de almacenes a InicioNestJs');
    return config.nestjsService;
  }

  // Catálogo unidades vive en InicioNestJs (catálogo general)
  if (query && (query.includes('tiposUnidad') || query.includes('unidades'))) {
    console.log('🔄 Redirigiendo consulta de unidades a InicioNestJs');
    return config.nestjsService;
  }

  // Luego verificar si es una consulta específica de menús y permisos
  if (query && (
    query.includes('menu') || 
    query.includes('permiso') || 
    query.includes('autorizacion') ||
    query.includes('opcionesMenuSuperior') ||
    query.includes('permisosPorPerfil') ||
    query.includes('permisosPorModulo') ||
    query.includes('menuLateralPorPerfil') ||
    query.includes('idSeccionPorNombre')
  )) {
    console.log('🔄 Redirigiendo consulta de menú a MenuNestJs');
    return config.menuService;
  } else {
    console.log('🔄 Redirigiendo consulta a InicioNestJs');
    return config.nestjsService;
  }
};

// Función para ejecutar consultas GraphQL
async function executeGraphQLQuery(query, variables, operationName, context, config) {
  try {
    // Determinar servicio objetivo
    const targetUrl = getTargetService(query, config);
    const target = `${targetUrl}/graphql`;
    
    console.log('🟣 Ejecutando consulta GraphQL:', operationName || 'anonymous');
    console.log('🔄 Target service:', target);
    
    const response = await axios.post(target, {
      query,
      variables,
      operationName
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': context.request.headers.authorization || '',
      },
      timeout: parseInt(process.env.GRAPHQL_SERVICE_TIMEOUT || '10000')
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

      // Obtener configuración del gateway (catálogos generales como monedas, impuestos → InicioNestJs vía nestjsService)
      const config = {
        nestjsService: process.env.NESTJS_SERVICE_URL,
        menuService: process.env.MENU_SERVICE_URL,
        terceroNestJsService: process.env.TERCERO_NEST_GQL_URL || 'http://tercero-nestjs-service:3001',
        itemNestJsService: process.env.ITEM_NEST_GQL_URL || 'http://item-nestjs-service:3011'
      };

      const result = await executeGraphQLQuery(query, variables, operationName, { request }, config);
      
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

  // Endpoint para verificar conectividad con InicioNestJs GraphQL (POST mínimo; no existe GET /health en Nest)
  fastify.get('/graphql/health', async (request, reply) => {
    try {
      const base = (process.env.NESTJS_SERVICE_URL || 'http://localhost:3001').replace(/\/$/, '');
      const response = await axios.post(
        `${base}/graphql`,
        { query: '{ __typename }' },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 3000
        }
      );

      if (response.data && response.data.data) {
        return reply.send({
          success: true,
          service: 'NestJS GraphQL',
          status: 'connected',
          timestamp: new Date().toISOString()
        });
      }

      return reply.status(503).send({
        success: false,
        service: 'NestJS GraphQL',
        status: 'disconnected',
        error: 'GraphQL respondió sin data válida',
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