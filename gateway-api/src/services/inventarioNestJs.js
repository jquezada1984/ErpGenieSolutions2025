const axios = require('axios');

const BASE_URL = process.env.INVENTARIO_NEST_GQL_URL || 'http://inventario-nestjs-service:3013';
const TIMEOUT = parseInt(process.env.INVENTARIO_NEST_TIMEOUT || '10000', 10);

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
  const res = await http.post('/graphql', { query, variables }, { headers: ctxHeaders(req) });
  if (res.data?.errors?.length) {
    const msg = res.data.errors.map((e) => e.message).join(' | ');
    const err = new Error(msg);
    err.response = { status: 400, data: res.data };
    throw err;
  }
  return res.data?.data || {};
}

async function inventariosListado(req, filtros = {}) {
  const query = `
    query (
      $id_empresa: ID
      $inventario_ref: String
      $etiqueta: String
      $warehouse: String
      $id_almacen: ID
      $product: String
      $estado_inventario: String
    ) {
      inventariosListado(
        id_empresa: $id_empresa
        inventario_ref: $inventario_ref
        etiqueta: $etiqueta
        warehouse: $warehouse
        id_almacen: $id_almacen
        product: $product
        estado_inventario: $estado_inventario
      ) {
        id_inventario
        inventario_ref
        etiqueta
        id_almacen
        almacen
        product
        estado_inventario
        estado
      }
    }
  `;

  const variables = {
    id_empresa: filtros.id_empresa ?? null,
    inventario_ref: filtros.inventario_ref ?? null,
    etiqueta: filtros.etiqueta ?? null,
    warehouse: filtros.warehouse ?? null,
    id_almacen: filtros.id_almacen ?? null,
    product: filtros.product ?? null,
    estado_inventario: filtros.estado_inventario ?? null,
  };

  const data = await gqlRequest(query, variables, req);
  return data.inventariosListado || [];
}

module.exports = {
  inventariosListado,
};
