const axios = require('axios');
const {
    isProduction,
    buildGraphqlProxyErrorReply,
    buildGraphqlHealthErrorReply,
} = require('../utils/sanitize-gateway-error');

function forwardGraphqlHeaders(request) {
  const req = request || {};
  const h = req.headers || {};
  return {
    'Content-Type': 'application/json',
    'X-Company-Id': h['x-company-id'] || h['X-Company-Id'] || '',
    'X-User-Id': h['x-user-id'] || h['X-User-Id'] || '',
    Authorization: h.authorization || h.Authorization || '',
  };
}

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

  // Catálogos generales en InicioNestJs (países, provincias, monedas)
  if (query && (
    query.includes('provinciasByPais') ||
    query.includes('provincias') ||
    query.includes('paises') ||
    query.includes('monedas')
  )) {
    console.log('🔄 Redirigiendo catálogo países/provincias/monedas a InicioNestJs');
    return config.nestjsService;
  }
  
  // Verificar si es una consulta de catálogos de terceros o contactos (TerceroNestJs)
  if (query && (
    query.includes('incoterms') ||
    query.includes('tiposTercero') ||
    query.includes('representantesPorEmpresa') ||
    query.includes('rolesSocio') ||
    query.includes('tercerosDisponiblesParaSocio') ||
    query.includes('socios') ||
    query.includes('socio(') ||
    query.includes('terceros') ||
    query.includes('tercero(') ||
    query.includes('clientes') ||
    query.includes('contactosByTercero') ||
    query.includes('contacto(')
  )) {
    console.log('🔄 Redirigiendo consulta de terceros/contactos a TerceroNestJs');
    return config.terceroNestJsService;
  }
  
  // Banco / Cajas (BancoCajaNestJs)
  if (query && (
    query.includes('bancos') ||
    query.includes('banco(') ||
    query.includes('cuentasBancarias') ||
    query.includes('cuentaBancaria(') ||
    query.includes('movimientosBancarios') ||
    query.includes('movimientoBancario(') ||
    query.includes('transferenciasBancarias') ||
    query.includes('transferenciaBancaria(')
  )) {
    console.log('🔄 Redirigiendo consulta banco-caja a BancoCajaNestJs');
    return config.bancoCajaNestJsService;
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

  // Módulo inventario físico (InventarioNestJs)
  if (query && (
    query.includes('inventariosListado') ||
    query.includes('inventarioPorId') ||
    query.includes('actualizarEstadoInventario')
  )) {
    console.log('🔄 Redirigiendo consulta de inventario a InventarioNestJs');
    return config.inventarioNestJsService;
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
        'X-Company-Id': context.request.headers['x-company-id'] || '',
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
      const { query, variables, operationName } = request.body || {};
      
      if (!query) {
        return reply.status(400).send({
          success: false,
          error: 'Query GraphQL requerida',
          timestamp: new Date().toISOString()
        });
      }

      const config = {
        nestjsService: process.env.NESTJS_SERVICE_URL,
        menuService: process.env.MENU_SERVICE_URL,
        terceroNestJsService: process.env.TERCERO_NEST_GQL_URL || 'http://tercero-nestjs-service:3001',
        itemNestJsService: process.env.ITEM_NEST_GQL_URL || 'http://item-nestjs-service:3011',
        bancoCajaNestJsService:
          process.env.BANCO_CAJA_NEST_GQL_URL || 'http://banco-caja-nestjs-service:3014',
        itemNestJsService: process.env.ITEM_NEST_GQL_URL || 'http://item-nestjs-service:3011',
        inventarioNestJsService: process.env.INVENTARIO_NEST_GQL_URL || 'http://inventario-nestjs-service:3013'
      };

      const result = await executeGraphQLQuery(query, variables, operationName, { request }, config);
      return reply.send(result);
    } catch (error) {
      fastify.log.error('Error en endpoint GraphQL:', error);

      const { statusCode, body } = buildGraphqlProxyErrorReply(error);
      return reply.status(statusCode).send(body);
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
      const ts = new Date().toISOString();
      return reply.status(500).send({
        success: false,
        error: isProduction() ? 'No se pudo completar la operación.' : 'Error en endpoint GraphQL',
        timestamp: ts,
      });
    }
  });

  // Endpoint para verificar conectividad con InicioNestJs GraphQL (POST mínimo; no existe GET /health en Nest)
  fastify.get('/graphql/health', async (request, reply) => {
    const baseUrl = process.env.NESTJS_SERVICE_URL || 'http://localhost:3001';
    const healthUrl = baseUrl.replace(/\/graphql\/?$/, '') + '/';
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
      const { statusCode, body } = buildGraphqlHealthErrorReply(error);
      return reply.status(statusCode).send(body);
    }
  });
}

module.exports = routes; 