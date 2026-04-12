'use strict';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Respuesta JSON para setErrorHandler de Fastify (rutas /api/*).
 * En producción no se expone el mensaje interno ni detalles de red/BD.
 */
function buildFastifyErrorReply(error) {
  const ts = new Date().toISOString();
  const statusCode = error.statusCode || 500;

  if (!isProduction()) {
    return {
      statusCode,
      body: {
        success: false,
        error: error.message || 'Error interno del servidor',
        timestamp: ts,
      },
    };
  }

  if (statusCode === 401) {
    return {
      statusCode: 401,
      body: {
        success: false,
        error: 'Sesión no válida o expirada.',
        timestamp: ts,
      },
    };
  }
  if (statusCode === 403) {
    return {
      statusCode: 403,
      body: {
        success: false,
        error: 'No tiene permiso para esta operación.',
        timestamp: ts,
      },
    };
  }
  if (statusCode === 404) {
    return {
      statusCode: 404,
      body: {
        success: false,
        error: 'Recurso no encontrado.',
        timestamp: ts,
      },
    };
  }

  if (statusCode >= 500 || statusCode === 502 || statusCode === 503) {
    return {
      statusCode: statusCode >= 500 ? statusCode : 500,
      body: {
        success: false,
        error: 'No se pudo completar la operación.',
        timestamp: ts,
      },
    };
  }

  if (error.validation) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: 'Solicitud no válida.',
        timestamp: ts,
      },
    };
  }

  const msg = String(error.message || '');
  if (/ECONNREFUSED|ECONNRESET|ETIMEDOUT|password|postgres|sql|socket|axios|certificate/i.test(msg)) {
    return {
      statusCode: 500,
      body: {
        success: false,
        error: 'No se pudo completar la operación.',
        timestamp: ts,
      },
    };
  }

  return {
    statusCode,
    body: {
      success: false,
      error: 'Solicitud no procesada.',
      timestamp: ts,
    },
  };
}

/** Errores al reenviar GraphQL a los microservicios Nest. */
function buildGraphqlProxyErrorReply(error) {
  const ts = new Date().toISOString();

  if (!isProduction()) {
    const message =
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.error ||
      error.message ||
      'Error interno del servidor';
    const status = error.response?.status === 401 ? 401 : error.response?.status === 403 ? 403 : 500;
    return { statusCode: status, body: { success: false, error: message, timestamp: ts } };
  }

  if (error.response?.status === 401) {
    return {
      statusCode: 401,
      body: { success: false, error: 'Sesión no válida o expirada.', timestamp: ts },
    };
  }
  if (error.response?.status === 403) {
    return {
      statusCode: 403,
      body: { success: false, error: 'No tiene permiso para esta operación.', timestamp: ts },
    };
  }

  return {
    statusCode: 500,
    body: { success: false, error: 'No se pudo completar la operación.', timestamp: ts },
  };
}

/** GET /graphql/health — no filtrar ECONNREFUSED al cliente en producción. */
function buildGraphqlHealthErrorReply(error) {
  const ts = new Date().toISOString();
  if (!isProduction()) {
    return {
      statusCode: 503,
      body: {
        success: false,
        service: 'NestJS GraphQL',
        status: 'disconnected',
        error: error.message,
        timestamp: ts,
      },
    };
  }
  return {
    statusCode: 503,
    body: {
      success: false,
      service: 'NestJS GraphQL',
      status: 'disconnected',
      error: 'Servicio no disponible.',
      timestamp: ts,
    },
  };
}

module.exports = {
  isProduction,
  buildFastifyErrorReply,
  buildGraphqlProxyErrorReply,
  buildGraphqlHealthErrorReply,
};
