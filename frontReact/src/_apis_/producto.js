import axios from "axios";

const API_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:3002";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export async function listarProductos(params = {}) {
  const { id_empresa, page = 1, limit = 20 } = params;

  const { data } = await api.get("/api/productos", {
    params: { id_empresa, page, limit },
  });

  return data;
}

export async function crearProducto(payload) {
  // Escritura: Gateway POST /api/producto -> ProductoPython (CQRS)
  const { data } = await api.post("/api/producto", payload);
  return data;
}

/** Catálogos para Origen/Aduana (lectura vía Gateway -> ProductoNestJs) */
export async function getPaises() {
  const { data } = await api.get("/api/productos/selects/paises");
  return data?.data ?? [];
}

export async function getProvincias(id_pais) {
  if (!id_pais) return [];
  const { data } = await api.get("/api/productos/selects/provincias", {
    params: { id_pais },
  });
  return data?.data ?? [];
}

export async function getImpuestos() {
  const { data } = await api.get("/api/productos/selects/impuestos");
  return data?.data ?? [];
}

export async function obtenerProductoPorId(id_producto, id_empresa) {
  const { data } = await api.get(`/api/productos/${id_producto}`, {
    params: { id_empresa },
  });
  return data;
}

export async function actualizarProducto(id_producto, payload, id_empresa) {
  // Escritura: Gateway PATCH /api/producto/:id -> ProductoPython (CQRS)
  const { data } = await api.patch(`/api/producto/${id_producto}`, payload, {
    params: { id_empresa },
    headers: id_empresa ? { "x-empresa-id": id_empresa } : {},
  });
  return data;
}
