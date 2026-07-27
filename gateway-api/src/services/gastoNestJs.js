/**
 * Cliente GraphQL opcional hacia GastoNestJs (lectura).
 * El front usará principalmente POST /graphql del Gateway (routing en graphql.js).
 * Este helper sirve para health/smoke y futuros selects REST si se necesitan.
 */
const axios = require('axios');

const BASE_URL = process.env.GASTO_NEST_GQL_URL || 'http://gasto-nestjs-service:3017';
const TIMEOUT = parseInt(process.env.GASTO_NEST_TIMEOUT || '10000', 10);

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

async function health() {
  const res = await http.get('/health');
  return res.data;
}

async function gqlRequest(query, variables, req) {
  const res = await http.post(
    '/graphql',
    { query, variables },
    { headers: ctxHeaders(req) },
  );
  if (res.data.errors?.length) {
    const msg = res.data.errors.map((e) => e.message).join(' | ');
    const err = new Error(msg);
    err.response = { status: 400, data: res.data };
    throw err;
  }
  return res.data.data;
}

module.exports = {
  health,
  gqlRequest,
};
