const axios = require("axios");

const baseURL = process.env.PRODUCTO_NEST_GQL_URL || "http://localhost:3006";

const client = axios.create({
  baseURL,
  timeout: 15000,
});

function ctxHeaders(req) {
  const headers = { "Content-Type": "application/json" };

  if (req.headers.authorization) headers.Authorization = req.headers.authorization;
  if (req.headers["x-user-id"]) headers["X-User-Id"] = req.headers["x-user-id"];
  if (req.headers["x-company-id"]) headers["X-Company-Id"] = req.headers["x-company-id"];

  return headers;
}

async function gqlRequest(query, variables = {}, req, operationName) {
  const res = await client.post(
    "/graphql",
    { query, variables, operationName },
    { headers: ctxHeaders(req) }
  );

  if (res.data?.errors?.length) {
    const err = new Error(res.data.errors[0].message || "GraphQL error");
    err.response = { status: 400, data: res.data };
    throw err;
  }

  return res.data;
}

async function listarImpuestos(req) {
  const query = `query { impuestos { id nombre tasa } }`;
  return gqlRequest(query, {}, req);
}

async function listarEmpresas(req) {
  const query = `query { empresas { id_empresa nombre } }`;
  return gqlRequest(query, {}, req);
}

module.exports = {
  gqlRequest,
  listarImpuestos,
  listarEmpresas,
};
