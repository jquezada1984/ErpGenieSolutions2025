// src/services/itemNestJs.js
// Cliente GraphQL hacia ItemNestJs (lectura / catálogos del módulo item).
// Mismo patrón que terceroNestJs.js: solo lectura; escritura va a ItemPython.

const axios = require('axios');

// URL del servicio ItemNestJs (GraphQL) - misma convención que TERCERO_NEST_GQL_URL
const BASE_URL = process.env.ITEM_NEST_GQL_URL || 'http://item-nestjs-service:3011';
const TIMEOUT = parseInt(process.env.ITEM_NEST_TIMEOUT || '10000', 10);

const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

function ctxHeaders(req) {
  return {
    'Content-Type': 'application/json',
    'X-Company-Id': req.headers['x-company-id'] || req.headers['X-Company-Id'] || '',
    'X-User-Id': req.headers['x-user-id'] || req.headers['X-User-Id'] || '',
    Authorization: req.headers.authorization || '',
  };
}

async function gqlRequest(query, variables, req) {
  try {
    const res = await http.post(
      '/graphql',
      { query, variables },
      { headers: ctxHeaders(req) }
    );
    if (res.data.errors?.length) {
      const msg = res.data.errors.map((e) => e.message).join(' | ');
      const err = new Error(msg);
      err.response = { status: 400, data: res.data };
      throw err;
    }
    return res.data.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ ItemNestJs GraphQL error:', error.response.data);
    }
    throw error;
  }
}

// --------------------
// LECTURA CATÁLOGOS ITEM (para combos / selects)
// --------------------

/**
 * Lista estados de venta activos ordenados por "orden" (catálogo estado_venta_item).
 * Sirve para poblar el combo "Estado venta" en NuevoProducto / formularios item.
 */
async function listarEstadosVentaItem(req) {
  const query = `
    query {
      estadosVentaItem {
        id_estado_venta
        codigo
        nombre
        descripcion
        orden
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.estadosVentaItem || [];
}

/**
 * Lista estados de compra activos ordenados por "orden" (catálogo estado_compra_item).
 * Sirve para poblar el combo "Estado compra" en NuevoProducto / formularios item.
 */
async function listarEstadosCompraItem(req) {
  const query = `
    query {
      estadosCompraItem {
        id_estado_compra
        codigo
        nombre
        descripcion
        orden
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.estadosCompraItem || [];
}

/**
 * Lista naturalezas de ítem activas ordenadas por "orden" (catálogo naturaleza_item_catalogo).
 * Sirve para poblar el combo "Naturaleza producto" en NuevoProducto / formularios item.
 */
async function listarNaturalezasItem(req) {
  const query = `
    query {
      naturalezasItem {
        id_naturaleza_item
        codigo
        nombre
        descripcion
        orden
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.naturalezasItem || [];
}

/**
 * Lista tipos de control de inventario activos (catálogo tipo_control_inventario_item).
 */
async function listarTiposControlInventarioItem(req) {
  const query = `
    query {
      tiposControlInventarioItem {
        id_tipo_control_inventario
        codigo
        nombre
        descripcion
        orden
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.tiposControlInventarioItem || [];
}

/**
 * Lista tipos de control de caducidad activos (catálogo tipo_control_caducidad_item).
 */
async function listarTiposControlCaducidadItem(req) {
  const query = `
    query {
      tiposControlCaducidadItem {
        id_tipo_control_caducidad
        codigo
        nombre
        descripcion
        orden
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.tiposControlCaducidadItem || [];
}

/**
 * Catálogo tipo_comportamiento_item (SIMPLE, INVENTARIABLE, SERVICIO, etc.).
 */
async function listarTiposComportamientoItem(req) {
  const query = `
    query {
      tiposComportamientoItem {
        id_tipo_comportamiento
        codigo
        nombre
        descripcion
        orden
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.tiposComportamientoItem || [];
}

module.exports = {
  listarEstadosVentaItem,
  listarEstadosCompraItem,
  listarNaturalezasItem,
  listarTiposControlInventarioItem,
  listarTiposControlCaducidadItem,
  listarTiposComportamientoItem,
};
