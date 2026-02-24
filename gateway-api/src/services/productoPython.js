const axios = require("axios");

const baseURL = process.env.PRODUCTO_PYTHON_URL || process.env.PRODUCTO_PY_BASE_URL || "http://localhost:3005";

const client = axios.create({
  baseURL,
  timeout: 15000,
});

function ctxHeaders(req) {
  const headers = {};

  // Pasar Authorization tal cual (ProductoPython usa @jwt_required)
  if (req.headers.authorization) headers.Authorization = req.headers.authorization;

  // Opcional: si tú usas X-User-Id / X-Company-Id en tu ecosistema
  if (req.headers["x-user-id"]) headers["X-User-Id"] = req.headers["x-user-id"];
  if (req.headers["x-company-id"]) headers["X-Company-Id"] = req.headers["x-company-id"];

  // Pasar x-empresa-id (obligatorio para multiempresa)
  if (req.headers["x-empresa-id"]) {
    headers["x-empresa-id"] = req.headers["x-empresa-id"];
  } else if (req.headers["X-Empresa-Id"]) {
    headers["x-empresa-id"] = req.headers["X-Empresa-Id"];
  } else if (req.query?.id_empresa) {
    headers["x-empresa-id"] = req.query.id_empresa;
  }

  return headers;
}

async function crearProducto(body, req) {
  const res = await client.post("/api/producto", body, { headers: ctxHeaders(req) });
  return res.data;
}

async function actualizarProducto(idProducto, body, req) {
  const headers = ctxHeaders(req);
  
  // También pasar id_empresa como query param si no está en headers (fallback)
  const params = {};
  if (!headers["x-empresa-id"] && req.query?.id_empresa) {
    params.id_empresa = req.query.id_empresa;
  }
  
  const res = await client.patch(`/api/producto/${idProducto}`, body, { 
    headers,
    params: Object.keys(params).length > 0 ? params : undefined
  });
  return res.data;
}

async function eliminarProducto(idProducto, req) {
  const res = await client.delete(`/api/producto/${idProducto}`, { headers: ctxHeaders(req) });
  return res.data;
}

module.exports = {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
