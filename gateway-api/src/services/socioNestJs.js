const axios = require('axios');

const BASE_URL = process.env.TERCERO_NEST_GQL_URL || 'http://tercero-nestjs-service:3001';
const TIMEOUT = parseInt(process.env.TERCERO_NEST_TIMEOUT || '10000', 10);

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
}

async function rolesSocio(req) {
  const query = `
    query {
      rolesSocio {
        id_rol_socio
        nombre
      }
    }
  `;
  const data = await gqlRequest(query, {}, req);
  return data.rolesSocio || [];
}

async function tercerosDisponiblesParaSocio(id_empresa, id_socio, req) {
  const query = `
    query ($id_empresa: String!, $id_socio: String) {
      tercerosDisponiblesParaSocio(id_empresa: $id_empresa, id_socio: $id_socio) {
        id_tercero
        nombre
      }
    }
  `;
  const data = await gqlRequest(query, { id_empresa, id_socio: id_socio || null }, req);
  return data.tercerosDisponiblesParaSocio || [];
}

module.exports = {
  rolesSocio,
  tercerosDisponiblesParaSocio,
};
