import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import { NuevoProductoSchema, type NuevoProductoFormValues } from "../../validations/producto/nuevoProducto.schema";
import SeccionProducto from "./secciones/SeccionProducto";
import SeccionDimensiones from "./secciones/SeccionDimensiones";
import SeccionOrigenAduana from "./secciones/SeccionOrigenAduana";
import SeccionPreciosImpuestos from "./secciones/SeccionPreciosImpuestos";
import SeccionContabilidad from "./secciones/SeccionContabilidad";
import SeccionNotas from "./secciones/SeccionNotas";

import { crearProducto, getPaises, getProvincias, getImpuestos } from "../../_apis_/producto";

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
  /** id_pais del catálogo (para SELECT y cargar provincias) */
  pais_id: string;
  /** nombre de provincia (valor enviado en payload) */
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
  // backend: validate.Length(max=10) y mejor evitar caracteres ² ³
  return u
    .replace("²", "2")
    .replace("³", "3")
    .trim();
}

function formatApiError(err: any): string {
  const data = err?.response?.data;

  if (typeof data?.error === "string") return data.error;

  if (data?.error && typeof data.error === "object") {
    // Marshmallow style: { campo: ["msg"] }
    try {
      return Object.entries(data.error)
        .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
        .join(" | ");
    } catch {
      return JSON.stringify(data.error);
    }
  }

  if (typeof data?.msg === "string") return data.msg; // jwt errors a veces vienen como msg
  return err?.message || "Error inesperado";
}

type PaisOption = { id_pais: string; nombre: string; codigo_iso: string };
type ProvinciaOption = { id_provincia: string; nombre: string };
type ImpuestoOption = { id: number; nombre: string; tasa: number };

/**
 * Validación: react-hook-form + yup + yupResolver, mode: "onSubmit".
 * Errores visibles solo al pulsar "Crear Producto" (campos en rojo + mensaje).
 *
 * PRUEBAS RÁPIDAS:
 * - Caso 1: Submit sin llenar referencia/etiqueta → se muestran errores en rojo y mensaje "Corrija los campos...".
 * - Caso 2: Llenar producto_ref y etiqueta → submit normal, misma llamada crearProducto(payload) que antes.
 * - Caso 3: Con errores visibles, cambiar de tab (p. ej. a Dimensiones) → tabs siguen funcionando, no se rompen.
 */
export default function NuevoProducto() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"1" | "2" | "3" | "4" | "5" | "6">("1");

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<NuevoProductoFormValues>({
    resolver: yupResolver(NuevoProductoSchema),
    mode: "onSubmit",
    defaultValues: initialForm as NuevoProductoFormValues,
  });

  const formData = watch();

  const [paises, setPaises] = useState<PaisOption[]>([]);
  const [provincias, setProvincias] = useState<ProvinciaOption[]>([]);
  const [impuestos, setImpuestos] = useState<ImpuestoOption[]>([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingImpuestos, setLoadingImpuestos] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onChange = <K extends keyof NuevoProductoFormValues>(name: K, value: NuevoProductoFormValues[K]) => {
    setValue(name, value);
  };

  const onCancelar = () => {
    navigate("/productos");
  };

  // Submit: mismo payload y misma llamada que antes; validación ya hecha por RHF (mode: onSubmit).
  const onCrearRHF = async (values: NuevoProductoFormValues) => {
    setError(null);

    const idEmpresa = localStorage.getItem("empresa_activa_id");
    if (!idEmpresa?.trim()) {
      setError("Seleccione una empresa en la lista de productos antes de crear uno nuevo.");
      return;
    }

    const impuestoIdParsed =
      values.impuesto_id && String(values.impuesto_id).trim()
        ? Number(values.impuesto_id)
        : null;

    const payload: any = {
      id_empresa: idEmpresa.trim(),
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
      const res: any = await crearProducto(payload);

      if (!res?.success) {
        throw new Error("No se pudo crear el producto.");
      }

      const idProducto = res?.data?.id_producto;
      if (idProducto) {
        navigate(`/productos/editar/${idProducto}`);
      } else {
        navigate("/productos");
      }
    } catch (e: any) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  // Solo al enviar: si la validación falla, mostrar mensaje y cambiar al tab del primer error.
  const onInvalid = (errs: Record<string, { message?: string } | undefined>) => {
    setError("Corrija los campos marcados antes de continuar.");
    if (errs.producto_ref || errs.etiqueta) setActiveTab("1");
    else if (errs.impuesto_id) setActiveTab("4");
  };

  return (
    <div className="producto-page">
      <div className="producto-header">
        <div>
          <h4 className="producto-title">Nuevo Producto</h4>
          <p className="producto-subtitle">
            Complete la información del producto. Luego haga clic en “Crear Producto”.
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
            onClick={handleSubmit(onCrearRHF, onInvalid)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creando...
              </>
            ) : (
              "Crear Producto"
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
