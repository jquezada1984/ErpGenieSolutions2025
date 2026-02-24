import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Badge,
  Input,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";

import { listarProductos, actualizarProducto } from "../../_apis_/producto";
import { listarEmpresas } from "../../_apis_/empresa";
import "./ConfiguracionProducto.scss";

type Producto = {
  id_producto: string;
  producto_ref: string;
  etiqueta: string;
  estado_venta: string | boolean | null;
  estado_compra?: string | boolean | null;
  estado?: boolean;
  precio_venta: number | null;
  impuesto_id: string | null;
  id_empresa: string;
  updated_at?: string;
};

type Empresa = { id_empresa: string; nombre: string };

/** Normaliza valor de backend (boolean o string) a "en venta" o no */
function isEnVenta(val: string | boolean | null | undefined): boolean {
  if (val === true || val === "true") return true;
  if (val === false || val === "false") return false;
  const s = typeof val === "string" ? val.trim().toLowerCase() : "";
  if (!s) return false;
  if (s.startsWith("no")) return false;
  if (s.includes("venta") || s.includes("a la venta") || s === "venta") return true;
  return false;
}

/** Normaliza valor de backend (boolean o string) a "se compra" o no */
function isSeCompra(val: string | boolean | null | undefined): boolean {
  if (val === true || val === "true") return true;
  if (val === false || val === "false") return false;
  const s = typeof val === "string" ? val.trim().toLowerCase() : "";
  if (!s) return false;
  if (s.startsWith("no")) return false;
  if (
    s.includes("compra") ||
    s.includes("se compra") ||
    s.includes("disponible para compra") ||
    s.includes("disponible") ||
    s === "compra"
  )
    return true;
  return false;
}

export default function ProductosLista() {
  const navigate = useNavigate();
  const location = useLocation();

  const [idEmpresaActiva, setIdEmpresaActiva] = useState<string | null>(
    () => localStorage.getItem("empresa_activa_id")
  );
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  const [items, setItems] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // paginación backend
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // búsqueda UI (cliente)
  const [search, setSearch] = useState("");

  const loadProductos = async () => {
    if (!idEmpresaActiva) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const res = await listarProductos({
        id_empresa: idEmpresaActiva,
        page,
        limit,
      });

      const productos = res?.data?.items ?? [];
      setItems(productos);
      setTotal(res?.data?.total ?? 0);
    } catch (e: any) {
      setItems([]);
      setTotal(0);
      setError("Error al cargar productos: " + (e?.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoadingEmpresas(true);
      try {
        const res = await listarEmpresas();
        setEmpresas(res?.data ?? []);
      } catch {
        setEmpresas([]);
      } finally {
        setLoadingEmpresas(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    loadProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, idEmpresaActiva]);

  // Igual que en Empresas: recarga al volver a /productos
  useEffect(() => {
    if (location.pathname === "/productos" && idEmpresaActiva) {
      loadProductos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleCambioEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value || null;
    setIdEmpresaActiva(id);
    if (id) {
      localStorage.setItem("empresa_activa_id", id);
    } else {
      localStorage.removeItem("empresa_activa_id");
    }
    setPage(1);
  };

  const handleNuevo = () => navigate("/productos/nuevo");
  const handleEdit = (p: Producto) => {
    if (!p.estado) return; // Producto inactivo: no permitir edición
    if (!idEmpresaActiva) {
      setError("Seleccione una empresa antes de editar un producto.");
      return;
    }
    navigate(`/productos/editar/${p.id_producto}?id_empresa=${idEmpresaActiva}`);
  };

  // Handler para toggle del switch activo/inactivo
  const handleToggleEstado = async (producto: Producto) => {
    if (!idEmpresaActiva) {
      setError("Seleccione una empresa antes de cambiar el estado del producto.");
      return;
    }

    const nuevoEstado = !producto.estado;
    try {
      setError(null);
      await actualizarProducto(
        producto.id_producto,
        { estado: nuevoEstado },
        idEmpresaActiva
      );
      await loadProductos();
      setSuccess(`Producto ${nuevoEstado ? "activado" : "desactivado"} correctamente`);
    } catch (e: any) {
      setError("Error al actualizar estado: " + (e?.message || "Error desconocido"));
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const ref = (p.producto_ref || "").toLowerCase();
      const etq = (p.etiqueta || "").toLowerCase();
      return ref.includes(q) || etq.includes(q);
    });
  }, [items, search]);

  // Datos para ReactTable (mismo patrón que Empresas)
  const tableData = filtered.map((p) => {
    const enVenta = isEnVenta(p.estado_venta);
    const seCompra = isSeCompra(p.estado_compra);
    const activo = Boolean(p.estado);
    return {
      id_producto: p.id_producto,
      producto_ref: p.producto_ref,
      etiqueta: p.etiqueta,
      precio_venta:
        p.precio_venta == null ? "-" : Number(p.precio_venta).toFixed(2),
      estado_venta: (
        <Badge
          color={enVenta ? "success" : "danger"}
          className={`status-badge ${enVenta ? "active" : "inactive"}`}
        >
          {enVenta ? "En venta" : "No"}
        </Badge>
      ),
      estado_compra: (
        <Badge
          color={seCompra ? "success" : "danger"}
          className={`status-badge ${seCompra ? "active" : "inactive"}`}
        >
          {seCompra ? "Se compra" : "No"}
        </Badge>
      ),
      estado: (
        <Badge
          color={activo ? "success" : "danger"}
          className={`status-badge ${activo ? "active" : "inactive"}`}
        >
          {activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
      actions: (
      <div className="grid-action-buttons text-center d-flex align-items-center justify-content-center gap-2">
        <Button
          onClick={() => handleEdit(p)}
          color="info"
          size="sm"
          disabled={!activo}
          title={activo ? "Editar" : "Producto inactivo: no se puede editar"}
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>

        <div className="form-check form-switch d-flex align-items-center">
          <Input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={activo}
            onChange={() => handleToggleEstado(p)}
            title={activo ? "Activo" : "Inactivo"}
          />
        </div>
      </div>
    ),
    };
  });

  const columns = [
    {
      Header: "Referencia",
      accessor: "producto_ref",
      filterable: true,
    },
    {
      Header: "Etiqueta",
      accessor: "etiqueta",
      filterable: true,
    },
    {
      Header: "Precio",
      accessor: "precio_venta",
      filterable: true,
      width: 120,
    },
    {
      Header: "Estado (Venta)",
      accessor: "estado_venta",
      sortable: false,
      filterable: false,
      width: 120,
    },
    {
      Header: "Estado (Compra)",
      accessor: "estado_compra",
      sortable: false,
      filterable: false,
      width: 120,
    },
    {
      Header: "Estado",
      accessor: "estado",
      sortable: false,
      filterable: false,
      width: 100,
    },
    {
      Header: "Acciones",
      accessor: "actions",
      sortable: false,
      filterable: false,
      width: 120,
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* Header estilo Empresas */}
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Productos
                </CardTitle>

                <div className="grid-actions d-flex gap-2">
                  <select
                    className="form-control"
                    style={{ width: 220 }}
                    value={idEmpresaActiva ?? ""}
                    onChange={handleCambioEmpresa}
                    disabled={loadingEmpresas}
                  >
                    <option value="">Seleccione empresa...</option>
                    {empresas.map((em) => (
                      <option key={em.id_empresa} value={em.id_empresa}>
                        {em.nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-control"
                    style={{ width: 260 }}
                    placeholder="Buscar por referencia o etiqueta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <Button color="primary" className="grid-primary-button" onClick={handleNuevo}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Producto
                  </Button>
                </div>
              </div>

              {/* Alerts estilo Empresas */}
              {error && (
                <Alert color="danger" isOpen={!!error} toggle={() => setError(null)}>
                  {error}{" "}
                  <Button size="sm" color="danger" outline onClick={loadProductos} className="ms-2">
                    Reintentar
                  </Button>
                </Alert>
              )}

              {success && (
                <Alert color="success" isOpen={!!success} toggle={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              {/* Tabla estilo Empresas */}
              <div className="grid-container">
                <ReactTable
                  data={tableData}
                  columns={columns}
                  defaultPageSize={limit}
                  className="-striped -highlight"
                  loading={loading}
                  showPagination={true}
                  showPageSizeOptions={true}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageJump={true}
                  collapseOnSortingChange={true}
                  collapseOnPageChange={true}
                  collapseOnDataChange={true}
                  // Paginación backend: controlamos page/limit afuera
                  page={page - 1}
                  pages={pageCount}
                  manual
                  onPageChange={(p) => setPage(p + 1)}
                  onPageSizeChange={(size) => {
                    setPage(1);
                    setLimit(size);
                  }}
                />
              </div>

              {/* Footer opcional (si quieres mostrar total igual) */}
              <div className="d-flex align-items-center justify-content-between mt-3">
                <div className="text-muted">
                  Total: <b>{total}</b>
                </div>

                <div className="text-muted">
                  Página <b>{page}</b> de <b>{pageCount}</b>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
