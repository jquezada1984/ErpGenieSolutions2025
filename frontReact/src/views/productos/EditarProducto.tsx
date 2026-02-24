import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import "./ConfiguracionProducto.scss";

import { EditarProductoSchema, type EditarProductoFormValues } from "../../validations/producto/editarProducto.schema";
import SeccionProducto from "./secciones/SeccionProducto";
import SeccionDimensiones from "./secciones/SeccionDimensiones";
import SeccionOrigenAduana from "./secciones/SeccionOrigenAduana";
import SeccionPreciosImpuestos from "./secciones/SeccionPreciosImpuestos";
import SeccionContabilidad from "./secciones/SeccionContabilidad";
import SeccionNotas from "./secciones/SeccionNotas";

import {
  obtenerProductoPorId,
  actualizarProducto,
  getPaises,
  getProvincias,
  getImpuestos,
} from "../../_apis_/producto";

type ProductoForm = {
  producto_ref: string;
  etiqueta: string;
  estado_venta: "VENTA" | "NO_VENTA";
  estado_compra: "COMPRA" | "NO_COMPRA";
  descripcion: string;
  url_publica: string;

  naturaleza: string;
  peso: string;
  unidad_peso: string;
  longitud: string;
  anchura: string;
  altura: string;
  unidad_longitud: string;

  superficie: string;
  unidad_superficie: string;
  volumen: string;
  unidad_volumen: string;

  nomenclatura_aduanera: string;
  pais_id: string;
  provincia_origen: string;

  precio_venta: string;
  precio_minimo: string;
  impuesto_id: string;

  contabilidad_venta: string;
  contabilidad_exportacion: string;
  contabilidad_compra: string;
  contabilidad_importacion: string;

  nota_interna: string;
};

const initialForm: ProductoForm = {
  producto_ref: "",
  etiqueta: "",
  estado_venta: "VENTA",
  estado_compra: "COMPRA",
  descripcion: "",
  url_publica: "",

  naturaleza: "",
  peso: "",
  unidad_peso: "kg",
  longitud: "",
  anchura: "",
  altura: "",
  unidad_longitud: "mm",

  superficie: "",
  unidad_superficie: "mm²",
  volumen: "",
  unidad_volumen: "mm³",

  nomenclatura_aduanera: "",
  pais_id: "",
  provincia_origen: "",

  precio_venta: "",
  precio_minimo: "",
  impuesto_id: "",

  contabilidad_venta: "",
  contabilidad_exportacion: "",
  contabilidad_compra: "",
  contabilidad_importacion: "",

  nota_interna: "",
};

function emptyToNull(v: string) {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}

function unitToApi(u: string) {
  return u.replace("²", "2").replace("³", "3").trim();
}

function formatApiError(err: any): string {
  const data = err?.response?.data;

  if (typeof data?.error === "string") return data.error;

  if (data?.error && typeof data.error === "object") {
    try {
      return Object.entries(data.error)
        .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
        .join(" | ");
    } catch {
      return JSON.stringify(data.error);
    }
  }

  if (typeof data?.msg === "string") return data.msg;
  return err?.message || "Error inesperado";
}

type PaisOption = { id_pais: string; nombre: string; codigo_iso: string };
type ProvinciaOption = { id_provincia: string; nombre: string };
type ImpuestoOption = { id: number; nombre: string; tasa: number };

/**
 * Validación: react-hook-form + yup + yupResolver, mode: "onSubmit".
 * Errores visibles solo al pulsar "Guardar Cambios".
 *
 * PRUEBAS RÁPIDAS:
 * - Abrir editar producto y guardar sin tocar nada → debe permitir guardar si ya tiene referencia y etiqueta.
 * - Borrar referencia y guardar → debe mostrar error en producto_ref.
 * - Borrar etiqueta y guardar → debe mostrar error en etiqueta.
 * - Cambiar de tabs con errores visibles → no se rompe nada.
 */
export default function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"1" | "2" | "3" | "4" | "5" | "6">("1");

  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EditarProductoFormValues>({
    resolver: yupResolver(EditarProductoSchema),
    mode: "onSubmit",
    defaultValues: initialForm as EditarProductoFormValues,
  });

  const formData = watch();

  const [paises, setPaises] = useState<PaisOption[]>([]);
  const [provincias, setProvincias] = useState<ProvinciaOption[]>([]);
  const [impuestos, setImpuestos] = useState<ImpuestoOption[]>([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingImpuestos, setLoadingImpuestos] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar catálogos
  useEffect(() => {
    getPaises()
      .then(setPaises)
      .catch(() => setPaises([]))
      .finally(() => setLoadingPaises(false));
  }, []);

  useEffect(() => {
    getImpuestos()
      .then(setImpuestos)
      .catch(() => setImpuestos([]))
      .finally(() => setLoadingImpuestos(false));
  }, []);

  useEffect(() => {
    if (!formData.pais_id) {
      setProvincias([]);
      return;
    }
    setLoadingProvincias(true);
    getProvincias(formData.pais_id)
      .then(setProvincias)
      .catch(() => setProvincias([]))
      .finally(() => setLoadingProvincias(false));
  }, [formData.pais_id]);

  // Cargar producto por ID
  useEffect(() => {
    const loadProducto = async () => {
      if (!id) {
        setError("ID de producto no válido");
        setLoadingProducto(false);
        return;
      }

      // Obtener id_empresa: query param > localStorage
      const idEmpresa = searchParams.get("id_empresa") || localStorage.getItem("empresa_activa_id");
      if (!idEmpresa) {
        setError("Seleccione una empresa antes de editar un producto.");
        setLoadingProducto(false);
        return;
      }

      try {
        setLoadingProducto(true);
        setError(null);

        const res = await obtenerProductoPorId(id, idEmpresa);
        if (!res?.success || !res?.data) {
          throw new Error("Producto no encontrado");
        }

        const producto = res.data;

        // Mapear datos del backend al formulario
        const paisEncontrado = paises.find(
          (p) => p.codigo_iso === producto.pais_origen
        );

        // Guardar id_empresa en localStorage si viene por query (para mantener consistencia)
        if (searchParams.get("id_empresa") && searchParams.get("id_empresa") !== localStorage.getItem("empresa_activa_id")) {
          localStorage.setItem("empresa_activa_id", searchParams.get("id_empresa")!);
        }

        reset({
          producto_ref: producto.producto_ref || "",
          etiqueta: producto.etiqueta || "",
          estado_venta: (producto.estado_venta as "VENTA" | "NO_VENTA") || "VENTA",
          estado_compra: (producto.estado_compra as "COMPRA" | "NO_COMPRA") || "COMPRA",
          descripcion: producto.descripcion || "",
          url_publica: producto.url_publica || "",

          naturaleza: producto.naturaleza || "",
          peso: producto.peso ? String(producto.peso) : "",
          unidad_peso: "kg",
          longitud: producto.longitud ? String(producto.longitud) : "",
          anchura: producto.anchura ? String(producto.anchura) : "",
          altura: producto.altura ? String(producto.altura) : "",
          unidad_longitud: producto.unidad_longitud || "mm",

          superficie: producto.superficie ? String(producto.superficie) : "",
          unidad_superficie: producto.unidad_superficie || "mm²",

          volumen: producto.volumen ? String(producto.volumen) : "",
          unidad_volumen: producto.unidad_volumen || "mm³",

          nomenclatura_aduanera: producto.nomenclatura_aduanera || "",
          pais_id: paisEncontrado?.id_pais || "",
          provincia_origen: producto.provincia_origen || "",

          precio_venta: producto.precio_venta ? String(producto.precio_venta) : "",
          precio_minimo: producto.precio_minimo ? String(producto.precio_minimo) : "",
          impuesto_id: producto.impuesto_id ? String(producto.impuesto_id) : "",

          contabilidad_venta: producto.contabilidad_venta || "",
          contabilidad_exportacion: producto.contabilidad_exportacion || "",
          contabilidad_compra: producto.contabilidad_compra || "",
          contabilidad_importacion: producto.contabilidad_importacion || "",

          nota_interna: producto.nota_interna || "",
        });

        // Cargar provincias si hay país seleccionado
        if (paisEncontrado?.id_pais) {
          getProvincias(paisEncontrado.id_pais)
            .then(setProvincias)
            .catch(() => setProvincias([]));
        }
      } catch (e: any) {
        setError(formatApiError(e));
      } finally {
        setLoadingProducto(false);
      }
    };

    loadProducto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchParams]);

  const tabs = useMemo(
    () => [
      { id: "1", label: "Producto" },
      { id: "2", label: "Dimensiones" },
      { id: "3", label: "Origen / Aduana" },
      { id: "4", label: "Precios / Impuestos" },
      { id: "5", label: "Contabilidad" },
      { id: "6", label: "Notas" },
    ] as const,
    []
  );

  const toggle = (tab: "1" | "2" | "3" | "4" | "5" | "6") => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const onChange = <K extends keyof EditarProductoFormValues>(name: K, value: EditarProductoFormValues[K]) => {
    setValue(name, value);
  };

  const onCancelar = () => {
    navigate("/productos");
  };

  // Submit: misma lógica y payload que antes; validación hecha por RHF (mode: onSubmit).
  const onGuardarRHF = async (values: EditarProductoFormValues) => {
    setError(null);

    const idEmpresa = searchParams.get("id_empresa") || localStorage.getItem("empresa_activa_id");
    if (!idEmpresa?.trim()) {
      setError("Seleccione una empresa antes de editar un producto.");
      return;
    }

    const impuestoIdParsed =
      values.impuesto_id && String(values.impuesto_id).trim()
        ? Number(values.impuesto_id)
        : null;

    const payload: any = {
      producto_ref: values.producto_ref.trim(),

      etiqueta: emptyToNull(values.etiqueta),
      estado_venta: values.estado_venta || null,
      estado_compra: values.estado_compra || null,
      descripcion: emptyToNull(values.descripcion),
      url_publica: emptyToNull(values.url_publica),

      naturaleza: emptyToNull(values.naturaleza),
      peso: emptyToNull(values.peso),
      longitud: emptyToNull(values.longitud),
      anchura: emptyToNull(values.anchura),
      altura: emptyToNull(values.altura),
      unidad_longitud: unitToApi(values.unidad_longitud),

      superficie: emptyToNull(values.superficie),
      unidad_superficie: unitToApi(values.unidad_superficie),

      volumen: emptyToNull(values.volumen),
      unidad_volumen: unitToApi(values.unidad_volumen),

      nomenclatura_aduanera: emptyToNull(values.nomenclatura_aduanera),
      pais_origen: values.pais_id
        ? (paises.find((p) => p.id_pais === values.pais_id)?.codigo_iso ?? null)
        : null,
      provincia_origen: emptyToNull(values.provincia_origen),

      precio_venta: emptyToNull(values.precio_venta),
      precio_minimo: emptyToNull(values.precio_minimo),

      impuesto_id: impuestoIdParsed,

      contabilidad_venta: emptyToNull(values.contabilidad_venta),
      contabilidad_exportacion: emptyToNull(values.contabilidad_exportacion),
      contabilidad_compra: emptyToNull(values.contabilidad_compra),
      contabilidad_importacion: emptyToNull(values.contabilidad_importacion),

      nota_interna: emptyToNull(values.nota_interna),
    };

    setLoading(true);
    try {
      const res: any = await actualizarProducto(id!, payload, idEmpresa);

      if (!res?.success) {
        throw new Error("No se pudo actualizar el producto.");
      }

      navigate("/productos");
    } catch (e: any) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errs: Record<string, { message?: string } | undefined>) => {
    setError("Corrija los campos marcados antes de continuar.");
    if (errs.producto_ref || errs.etiqueta) setActiveTab("1");
    else if (errs.impuesto_id) setActiveTab("4");
  };

  if (loadingProducto) {
    return (
      <div className="producto-page">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <Spinner color="primary" />
          <span className="ms-3">Cargando producto...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="producto-page">
      <div className="producto-header">
        <div>
          <h4 className="producto-title">Editar Producto</h4>
          <p className="producto-subtitle">
            Modifique la información del producto. Luego haga clic en "Guardar Cambios".
          </p>

          {error && (
            <Alert color="danger" className="mt-2 mb-0">
              {error}
            </Alert>
          )}
        </div>

        <div className="producto-actions">
          <Button outline color="primary" onClick={onCancelar} disabled={loading}>
            Cancelar
          </Button>

          <Button
            color="primary"
            type="button"
            onClick={handleSubmit(onGuardarRHF, onInvalid)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </div>

      <Card className="producto-card">
        <CardHeader className="producto-tabs">
          <Nav tabs>
            {tabs.map((t) => (
              <NavItem key={t.id}>
                <NavLink
                  className={classnames({ active: activeTab === t.id })}
                  onClick={() => toggle(t.id)}
                >
                  {t.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </CardHeader>

        <CardBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <SeccionProducto
                formData={formData}
                onChange={onChange}
                formErrors={errors}
              />
            </TabPane>

            <TabPane tabId="2">
              <SeccionDimensiones formData={formData} onChange={onChange} />
            </TabPane>

            <TabPane tabId="3">
              <SeccionOrigenAduana
                formData={formData}
                onChange={onChange}
                paises={paises}
                provincias={provincias}
                loadingPaises={loadingPaises}
                loadingProvincias={loadingProvincias}
              />
            </TabPane>

            <TabPane tabId="4">
              <SeccionPreciosImpuestos
                formData={formData}
                onChange={onChange}
                impuestos={impuestos}
                loadingImpuestos={loadingImpuestos}
                formErrors={errors}
              />
            </TabPane>

            <TabPane tabId="5">
              <SeccionContabilidad formData={formData} onChange={onChange} />
            </TabPane>

            <TabPane tabId="6">
              <SeccionNotas formData={formData} onChange={onChange} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
}
