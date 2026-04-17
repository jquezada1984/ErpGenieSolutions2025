import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { gql, useQuery } from '@apollo/client';
import * as yup from 'yup';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormText,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import './NuevoServicio.scss';
import '../secciones/ModalEtiquetasCategoria.scss';

import SeccionItemEmpresa from '../secciones/SeccionItemEmpresa';
import { ItemSchema, getDefaultItemFormValues, type ItemFormValues } from '../schemas/itemSchema';
import useJwtPayload from '../../../hooks/useJwtPayload';
import {
  listarEstadosCompraItem,
  listarEstadosVentaItem,
  listarEtiquetasCategoria,
  listarNaturalezasItem,
  crearEtiquetaCategoria,
  crearItemProducto,
} from '../../../_apis_/item';
import { mapItemFormToCreateBody } from '../utils/mapItemFormToCreateBody';
import { listarDuracionUnidadCatalogo, listarImpuestos } from '../../../_apis_/gateway';
import SearchableSelect from '../../../components/SearchableSelect';
import {
  type CuentaContableCatalogItem,
  filterCuentasParaCampo,
  toSelectOptions,
} from '../utils/cuentasContablesFilters';

const initialForm = getDefaultItemFormValues('servicio');

const NuevoServicioSchema = ItemSchema.shape({
  id_estado_venta: yup.string().trim().required('El estado de venta es obligatorio'),
  precio_venta: yup
    .number()
    .typeError('El precio de venta debe ser un número')
    .test('precio-venta-obligatorio', 'El precio de venta es obligatorio', (v) => Number(v) > 0),
});

const CUENTAS_CONTABLES_QUERY = gql`
  query CuentasContablesCatalogoNuevoServicio {
    cuentasContables {
      id_cuenta_contable
      codigo
      nombre
      descripcion
      tipo_cuenta
      permite_movimientos
      estado
    }
  }
`;

type EstadoVenta = { id_estado_venta: string; nombre: string };
type EstadoCompra = { id_estado_compra: string; nombre: string };
type ImpuestoOpt = { id: string | number; nombre: string; tasa: number };
type DuracionUnidadCatalogoRow = {
  id_duration_unit: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
};

type EtiquetaRow = {
  id: string;
  ref: string;
  nombre: string;
  descripcion: string;
  color: string;
  posicion: number;
  estado: boolean;
};

/** Normaliza entrada HEX (#RGB o #RRGGBB); null si no es válida (mismo criterio que Nuevo Producto / SeccionItemGeneral). */
function normalizeHexColor(input: string): string | null {
  let t = String(input ?? '').trim();
  if (t === '') return null;
  if (!t.startsWith('#')) t = `#${t}`;
  if (/^#[0-9A-Fa-f]{6}$/.test(t)) return t.toLowerCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(t)) {
    const a = t[1];
    const b = t[2];
    const c = t[3];
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase();
  }
  return null;
}

const NuevoServicio: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [activeTab, setActiveTab] = useState<'1' | '2'>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const [estadosVenta, setEstadosVenta] = useState<EstadoVenta[]>([]);
  const [estadosCompra, setEstadosCompra] = useState<EstadoCompra[]>([]);
  const [impuestos, setImpuestos] = useState<ImpuestoOpt[]>([]);

  const [durationValue, setDurationValue] = useState<number | ''>('');
  const [durationUnit, setDurationUnit] = useState('');
  /** Solo Nuevo Servicio → `item.mandatory_periods` vía POST (no forma parte del esquema compartido). */
  const [mandatoryPeriods, setMandatoryPeriods] = useState(false);
  const [duracionUnidadesCatalogo, setDuracionUnidadesCatalogo] = useState<DuracionUnidadCatalogoRow[]>([]);
  const [loadingDuracionUnidades, setLoadingDuracionUnidades] = useState(false);
  const [errDuracionUnidades, setErrDuracionUnidades] = useState<string | null>(null);

  const [labelsOpen, setLabelsOpen] = useState(false);
  const [labelsView, setLabelsView] = useState<'list' | 'create'>('list');
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [labelsErr, setLabelsErr] = useState<string | null>(null);
  const [labelsList, setLabelsList] = useState<EtiquetaRow[]>([]);
  const [newLabel, setNewLabel] = useState({
    ref: '',
    nombre: '',
    descripcion: '',
    color: '#0d6efd',
    posicion: 10,
  });

  const { watch, setValue, handleSubmit, reset } = useForm<ItemFormValues>({
    resolver: yupResolver(NuevoServicioSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  useEffect(() => {
    if (scope === 'EMPRESA' && empresaUsuario && !formData.id_empresa) {
      setValue('id_empresa', empresaUsuario);
    }
  }, [scope, empresaUsuario, formData.id_empresa, setValue]);

  /**
   * El POST de ítem (ItemPython) exige `id_naturaleza_item` y la columna es NOT NULL.
   * Este formulario no muestra el combo; se rellena con la primera fila del catálogo si sigue vacío.
   */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (String(formData.id_naturaleza_item || '').trim()) return;
      try {
        const list = await listarNaturalezasItem();
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        const idNat = String((list[0] as { id_naturaleza_item?: string }).id_naturaleza_item ?? '').trim();
        if (idNat) setValue('id_naturaleza_item', idNat);
      } catch {
        /* el submit mostrará error de validación si sigue faltando */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [formData.id_naturaleza_item, setValue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ev, ec, imp] = await Promise.all([
        listarEstadosVentaItem(),
        listarEstadosCompraItem(),
        listarImpuestos(),
      ]);
      if (cancelled) return;
      setEstadosVenta(Array.isArray(ev) ? ev : []);
      setEstadosCompra(Array.isArray(ec) ? ec : []);
      setImpuestos(Array.isArray(imp) ? imp : []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingDuracionUnidades(true);
      setErrDuracionUnidades(null);
      try {
        const rows = await listarDuracionUnidadCatalogo();
        if (cancelled) return;
        setDuracionUnidadesCatalogo(Array.isArray(rows) ? rows : []);
      } catch (e) {
        if (!cancelled) {
          setErrDuracionUnidades(e instanceof Error ? e.message : 'No se pudo cargar unidades de duración.');
          setDuracionUnidadesCatalogo([]);
        }
      } finally {
        if (!cancelled) setLoadingDuracionUnidades(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { data: gqlCuentas, loading: cuentasLoading, error: cuentasError } = useQuery<{
    cuentasContables: CuentaContableCatalogItem[];
  }>(CUENTAS_CONTABLES_QUERY, { fetchPolicy: 'cache-and-network' });

  const cuentasRaw = gqlCuentas?.cuentasContables ?? [];

  const opcionesCuentaVenta = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_venta', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaVentaExportacion = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_venta_exportacion', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaCompra = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_compra', cuentasRaw)),
    [cuentasRaw]
  );
  const opcionesCuentaCompraImportacion = useMemo(
    () => toSelectOptions(filterCuentasParaCampo('cuenta_compra_importacion', cuentasRaw)),
    [cuentasRaw]
  );

  const setCuentaField = useCallback(
    (field: 'cuenta_venta' | 'cuenta_venta_exportacion' | 'cuenta_compra' | 'cuenta_compra_importacion', val: string | null) => {
      setValue(field, (val ?? '') as never);
    },
    [setValue]
  );

  const toggle = (t: '1' | '2') => activeTab !== t && setActiveTab(t);

  const onEmpresa = useCallback(
    (d: Partial<ItemFormValues>) => {
      Object.entries(d).forEach(([key, value]) => {
        setValue(key as keyof ItemFormValues, value as never);
      });
      setFieldErr((prev) => {
        const next = { ...prev };
        if (d.id_empresa) delete next.id_empresa;
        if (d.id_tipo_item) delete next.id_tipo_item;
        return next;
      });
    },
    [setValue]
  );

  const onFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, type } = e.target;
      const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      if (name === 'codigo') {
        setValue('codigo', String(value) as never);
        setValue('nombre', String(value) as never);
        setFieldErr((prev) => {
          const next = { ...prev };
          delete next.codigo;
          return next;
        });
        return;
      }
      setValue(name as keyof ItemFormValues, value as never);
      if (name === 'id_estado_venta' || name === 'precio_venta') {
        setFieldErr((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [setValue]
  );

  const onTaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      const imp = impuestos.find((i) => String(i.id) === id);
      setValue('impuesto_id', (id || '') as never);
      setValue('tasa_iva', (imp ? Number(imp.tasa) : 0) as never);
    },
    [impuestos, setValue]
  );

  const onDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationValue(e.target.value === '' ? '' : Number(e.target.value));
  }, []);

  const onDurationUnitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationUnit(e.target.value);
  }, []);

  const onMandatoryPeriodsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMandatoryPeriods(e.target.checked);
  }, []);

  const validateRequiredForServicio = useCallback(
    (values: ItemFormValues): Record<string, string> => {
      const next: Record<string, string> = {};
      const idEmpresa = String(values.id_empresa || payload?.id_empresa || '').trim();

      if (!idEmpresa) next.id_empresa = 'La empresa es obligatoria';
      if (!String(values.codigo || '').trim()) next.codigo = 'La referencia del producto es obligatoria';
      if (!(Number(values.precio_venta) > 0)) {
        next.precio_venta = 'El precio de venta es obligatorio';
      }
      if (!String(values.id_estado_venta || '').trim()) {
        next.id_estado_venta = 'El estado de venta es obligatorio';
      }
      // Campo técnico requerido internamente para servicio.
      if (!String(values.id_tipo_item || '').trim()) {
        next.id_tipo_item = 'No se pudo configurar internamente el tipo de ítem (servicio).';
      }
      return next;
    },
    [payload?.id_empresa]
  );

  const selectedImpuestoId =
    formData.impuesto_id && impuestos.some((i) => String(i.id) === String(formData.impuesto_id))
      ? String(formData.impuesto_id)
      : '';

  const toEtiqueta = (raw: Record<string, unknown>): EtiquetaRow => ({
    id: String(raw.id_etiqueta_categoria ?? raw.idEtiquetaCategoria ?? ''),
    ref: String(raw.ref ?? raw.referencia ?? ''),
    nombre: String(raw.nombre ?? ''),
    descripcion: String(raw.descripcion ?? ''),
    color: String(raw.color ?? '#0d6efd'),
    posicion: Number(raw.posicion ?? 0),
    estado: raw.estado !== false,
  });

  const loadLabels = useCallback(async () => {
    const idEmp = String(formData.id_empresa || empresaUsuario || '').trim();
    if (!idEmp) {
      setLabelsErr('Seleccione una empresa en General para gestionar etiquetas/categorías.');
      setLabelsList([]);
      return;
    }
    setLabelsLoading(true);
    setLabelsErr(null);
    try {
      const data = await listarEtiquetasCategoria(idEmp);
      const list = Array.isArray(data) ? data : [];
      setLabelsList(list.map((x) => toEtiqueta((x ?? {}) as Record<string, unknown>)));
    } catch (e) {
      setLabelsErr(e instanceof Error ? e.message : 'No se pudo cargar el catálogo.');
      setLabelsList([]);
    } finally {
      setLabelsLoading(false);
    }
  }, [formData.id_empresa, empresaUsuario]);

  const openLabels = useCallback(async () => {
    setLabelsOpen(true);
    setLabelsView('list');
    await loadLabels();
  }, [loadLabels]);

  const createLabel = useCallback(async () => {
    const idEmp = String(formData.id_empresa || empresaUsuario || '').trim();
    if (!idEmp) {
      setLabelsErr('Seleccione una empresa en General antes de crear etiquetas/categorías.');
      return;
    }
    if (!newLabel.ref.trim() || !newLabel.nombre.trim()) {
      setLabelsErr('Referencia y nombre son obligatorios.');
      return;
    }
    setLabelsLoading(true);
    setLabelsErr(null);
    try {
      await crearEtiquetaCategoria({
        id_empresa: idEmp,
        ref: newLabel.ref.trim(),
        nombre: newLabel.nombre.trim(),
        descripcion: newLabel.descripcion.trim(),
        color: newLabel.color,
        posicion: Number(newLabel.posicion || 0),
        estado: true,
      });
      setLabelsView('list');
      setNewLabel({ ref: '', nombre: '', descripcion: '', color: '#0d6efd', posicion: 10 });
      await loadLabels();
    } catch (e) {
      setLabelsErr(e instanceof Error ? e.message : 'No se pudo crear la categoría.');
    } finally {
      setLabelsLoading(false);
    }
  }, [formData.id_empresa, empresaUsuario, loadLabels, newLabel]);

  const onColorHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLabel((p) => ({ ...p, color: e.target.value }));
  }, []);

  const onColorHexBlur = useCallback(() => {
    setNewLabel((p) => {
      const n = normalizeHexColor(p.color);
      return { ...p, color: n ?? '#0d6efd' };
    });
  }, []);

  const onColorNativeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLabel((p) => ({ ...p, color: e.target.value }));
  }, []);

  const onSubmitRHF = useCallback(
    async (values: ItemFormValues) => {
      setLoading(true);
      setErr(null);
      setOk(false);
      try {
        const requiredErrors = validateRequiredForServicio(values);
        setFieldErr(requiredErrors);
        if (Object.keys(requiredErrors).length > 0) {
          setErr(Object.values(requiredErrors).join(' | '));
          setLoading(false);
          return;
        }

        const id_empresa = values.id_empresa || (payload?.id_empresa ?? '');
        /**
         * POST único hacia ItemPython (tabla `item`). `id_tipo_item` = UUID fila SERVICE
         * (catálogo `tipo_item_catalogo`) lo fija `SeccionItemEmpresa` con defaultTipoItemCodigo="SERVICE".
         * `mapItemFormToCreateBody` ya envía inventariable = (tipo_item === 'producto'); para servicio es false.
         * Se fuerza de nuevo aquí para no depender de estados corruptos del formulario.
         */
        const body: Record<string, unknown> = {
          ...mapItemFormToCreateBody({ ...values, id_empresa }),
          mandatory_periods: mandatoryPeriods === true,
          inventariable: false,
        };
        if (durationValue !== '' && durationValue != null) {
          const dv = Number(durationValue);
          if (Number.isFinite(dv)) {
            body.duration_value = dv;
          }
        }
        if (durationUnit) {
          body.id_duration_unit = durationUnit;
        }

        const res = await crearItemProducto(body);
        if (res?.success && res?.id_item) {
          setOk(true);
          setTimeout(() => {
            reset({ ...initialForm, id_empresa });
            setDurationValue('');
            setDurationUnit('');
            setMandatoryPeriods(false);
            setFieldErr({});
            setOk(false);
            setActiveTab('1');
          }, 2000);
        } else {
          setErr(res?.message || res?.error || 'No se pudo crear el servicio');
        }
      } catch (e: unknown) {
        const ax = e as {
          message?: string;
          data?: { errors?: unknown; error?: string; detail?: string };
          response?: { data?: { errors?: unknown; error?: string; detail?: string } };
        };
        const d = ax.data ?? ax.response?.data;
        if (d?.errors && typeof d.errors === 'object') {
          const flat = Object.entries(d.errors as Record<string, string[]>)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ');
          setErr(flat || ax.message || 'Error de validación');
        } else {
          setErr(d?.error || d?.detail || ax?.message || 'Error al crear el servicio');
        }
      } finally {
        setLoading(false);
      }
    },
    [payload?.id_empresa, reset, validateRequiredForServicio, durationValue, durationUnit, mandatoryPeriods]
  );

  const onInvalid = useCallback((formErrors: unknown) => {
    const collect = (obj: unknown): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj && typeof obj === 'object' && 'message' in obj && typeof (obj as { message: unknown }).message === 'string') {
        return [(obj as { message: string }).message];
      }
      return Object.values(obj).flatMap(collect);
    };
    const messages = collect(formErrors);
    const e = formErrors as Partial<Record<keyof ItemFormValues, { message?: string }>>;
    setFieldErr((prev) => ({
      ...prev,
      ...(e.id_empresa?.message ? { id_empresa: e.id_empresa.message } : {}),
      ...(e.nombre?.message || e.codigo?.message
        ? { codigo: e.nombre?.message || e.codigo?.message || '' }
        : {}),
      ...(e.id_estado_venta?.message ? { id_estado_venta: e.id_estado_venta.message } : {}),
      ...(e.precio_venta?.message ? { precio_venta: e.precio_venta.message } : {}),
    }));
    setErr(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  return (
    <div className="configuracion-nuevo-servicio">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <CardTitle className="mb-0">
              <i className="fas fa-concierge-bell text-primary me-2" />
              Nuevo Servicio
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => navigate('/items/servicios')}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmitRHF, onInvalid)} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Crear Servicio'
                )}
              </Button>
            </div>
          </div>

          {ok && (
            <Alert color="success" className="mb-3" role="status">
              Servicio creado correctamente.
            </Alert>
          )}
          {err && (
            <Alert color="danger" className="mb-3" role="alert">
              {err}
            </Alert>
          )}

          <div className="instruction-text mb-3">
            <p>
              Complete la información del servicio y haga clic en <b>Crear Servicio</b>.
            </p>
          </div>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
                <i className="fas fa-id-card me-2" />General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
                <i className="fas fa-tag me-2" />Venta
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">
                      <i className="fas fa-id-card text-primary me-2" />
                      Datos generales
                    </h5>
                    <div className="d-flex align-items-center gap-3 flex-shrink-0">
                      <FormGroup className="mb-0">
                        <div className="form-check form-switch">
                          <Input
                            id="estado"
                            name="estado"
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.estado !== false}
                            onChange={onFieldChange}
                          />
                          <Label for="estado" className="form-check-label ms-2">
                            Activo
                          </Label>
                        </div>
                      </FormGroup>
                      <Button color="secondary" outline size="sm" onClick={openLabels}>
                        Etiquetas / Categorías
                      </Button>
                    </div>
                  </div>

                  <SeccionItemEmpresa
                    data={formData}
                    onChange={onEmpresa}
                    defaultTipoItemCodigo="SERVICE"
                    ocultarCatalogosTipoYComportamiento
                    variant="inline"
                  />
                  {fieldErr.id_empresa && <FormText color="danger">{fieldErr.id_empresa}</FormText>}

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="codigo">
                          Referencia del producto <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="codigo"
                          name="codigo"
                          value={formData.codigo || ''}
                          onChange={onFieldChange}
                          placeholder="Código interno"
                          invalid={!!fieldErr.codigo}
                        />
                        {fieldErr.codigo && <FormText color="danger">{fieldErr.codigo}</FormText>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="etiqueta">Etiqueta</Label>
                        <Input
                          id="etiqueta"
                          name="etiqueta"
                          value={formData.etiqueta || ''}
                          onChange={onFieldChange}
                          placeholder="Etiqueta para listados"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="id_estado_compra">Estado compra</Label>
                        <Input
                          id="id_estado_compra"
                          name="id_estado_compra"
                          type="select"
                          value={formData.id_estado_compra || ''}
                          onChange={onFieldChange}
                        >
                          <option value="">Seleccionar</option>
                          {estadosCompra.map((opt) => (
                            <option key={opt.id_estado_compra} value={opt.id_estado_compra}>
                              {opt.nombre}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="id_estado_venta">
                          Estado venta <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="id_estado_venta"
                          name="id_estado_venta"
                          type="select"
                          value={formData.id_estado_venta || ''}
                          onChange={onFieldChange}
                          invalid={!!fieldErr.id_estado_venta}
                        >
                          <option value="">Seleccionar</option>
                          {estadosVenta.map((opt) => (
                            <option key={opt.id_estado_venta} value={opt.id_estado_venta}>
                              {opt.nombre}
                            </option>
                          ))}
                        </Input>
                        {fieldErr.id_estado_venta && <FormText color="danger">{fieldErr.id_estado_venta}</FormText>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="duration_value">Duración</Label>
                        <Input
                          id="duration_value"
                          name="duration_value"
                          type="number"
                          min={0}
                          value={durationValue}
                          onChange={onDurationChange}
                          placeholder="Ej. 12"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="id_duration_unit">Unidad de duración</Label>
                        <Input
                          id="id_duration_unit"
                          name="id_duration_unit"
                          type="select"
                          value={durationUnit}
                          onChange={onDurationUnitChange}
                          disabled={loadingDuracionUnidades}
                        >
                          <option value="">
                            {loadingDuracionUnidades ? 'Cargando…' : 'Seleccionar'}
                          </option>
                          {duracionUnidadesCatalogo.map((row) => (
                            <option key={row.id_duration_unit} value={row.id_duration_unit}>
                              {row.nombre}
                            </option>
                          ))}
                        </Input>
                        {errDuracionUnidades && (
                          <FormText color="danger">{errDuracionUnidades}</FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className="mt-4">
                        <div className="form-check">
                          <Input
                            id="mandatory_periods"
                            name="mandatory_periods"
                            type="checkbox"
                            className="form-check-input"
                            checked={mandatoryPeriods}
                            onChange={onMandatoryPeriodsChange}
                          />
                          <Label for="mandatory_periods" className="form-check-label">
                            Períodos obligatorios
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="descripcion">Descripción</Label>
                        <Input
                          id="descripcion"
                          name="descripcion"
                          type="textarea"
                          rows={3}
                          value={formData.descripcion || ''}
                          onChange={onFieldChange}
                          placeholder="Descripción breve del servicio"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="nota_privada">Nota privada</Label>
                        <Input
                          id="nota_privada"
                          name="nota_privada"
                          type="textarea"
                          rows={1}
                          value={formData.nota_privada || ''}
                          onChange={onFieldChange}
                          placeholder="Nota interna"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="url_publica">URL pública</Label>
                        <Input
                          id="url_publica"
                          name="url_publica"
                          type="url"
                          value={formData.url_publica || ''}
                          onChange={onFieldChange}
                          placeholder="https://..."
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>

            <TabPane tabId="2">
              <Card>
                <CardBody>
                  <h5 className="mb-4">
                    <i className="fas fa-tag text-primary me-2" />
                    Venta
                  </h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="precio_venta">
                          Precio de venta <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="precio_venta"
                          name="precio_venta"
                          type="number"
                          min={0}
                          step="0.01"
                          value={formData.precio_venta === 0 ? '' : formData.precio_venta}
                          onChange={onFieldChange}
                          invalid={!!fieldErr.precio_venta}
                        />
                        {fieldErr.precio_venta && <FormText color="danger">{fieldErr.precio_venta}</FormText>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="precio_venta_minimo">Precio mínimo de venta</Label>
                        <Input
                          id="precio_venta_minimo"
                          name="precio_venta_minimo"
                          type="number"
                          min={0}
                          step="0.01"
                          value={formData.precio_venta_minimo === 0 ? '' : formData.precio_venta_minimo}
                          onChange={onFieldChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="tasa_iva">Tasa impositiva</Label>
                        <Input
                          id="tasa_iva"
                          name="tasa_iva"
                          type="select"
                          value={selectedImpuestoId}
                          onChange={onTaxChange}
                        >
                          <option value="">Seleccionar</option>
                          {impuestos.map((i) => (
                            <option key={String(i.id)} value={String(i.id)}>
                              {i.nombre}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {cuentasLoading && cuentasRaw.length === 0 && (
                    <div className="d-flex align-items-center gap-2 text-muted mb-3">
                      <Spinner size="sm" />
                      <span>Cargando catálogo de cuentas contables…</span>
                    </div>
                  )}

                  {cuentasError && (
                    <Alert color="warning" className="mb-3">
                      No se pudo cargar el catálogo de cuentas contables vía GraphQL. Los combos quedarán vacíos hasta que el
                      gateway e InicioNestJs respondan. ({cuentasError.message})
                    </Alert>
                  )}

                  <Row className="mt-2">
                    <Col md={12}>
                      <h6 className="text-muted mb-3">Códigos contables</h6>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cuenta_venta">Código contable (venta)</Label>
                        <SearchableSelect
                          value={formData.cuenta_venta || null}
                          onChange={(v) => setCuentaField('cuenta_venta', v)}
                          options={opcionesCuentaVenta}
                          placeholder="Seleccione cuenta contable (venta)"
                          isLoading={cuentasLoading}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cuenta_venta_exportacion">Código contable (exportación de ventas)</Label>
                        <SearchableSelect
                          value={formData.cuenta_venta_exportacion || null}
                          onChange={(v) => setCuentaField('cuenta_venta_exportacion', v)}
                          options={opcionesCuentaVentaExportacion}
                          placeholder="Seleccione cuenta (exportación de ventas)"
                          isLoading={cuentasLoading}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cuenta_compra">Código contable (compra)</Label>
                        <SearchableSelect
                          value={formData.cuenta_compra || null}
                          onChange={(v) => setCuentaField('cuenta_compra', v)}
                          options={opcionesCuentaCompra}
                          placeholder="Seleccione cuenta contable (compra)"
                          isLoading={cuentasLoading}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cuenta_compra_importacion">Código contable (importación de compras)</Label>
                        <SearchableSelect
                          value={formData.cuenta_compra_importacion || null}
                          onChange={(v) => setCuentaField('cuenta_compra_importacion', v)}
                          options={opcionesCuentaCompraImportacion}
                          placeholder="Seleccione cuenta (importación de compras)"
                          isLoading={cuentasLoading}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>

          <Modal
            isOpen={labelsOpen}
            toggle={() => setLabelsOpen(false)}
            size="lg"
            style={{ zIndex: 9999 }}
            backdrop="static"
            keyboard={false}
            centered
            contentClassName="modal-etiquetas-categoria-scope bg-white shadow"
          >
            <ModalHeader toggle={() => setLabelsOpen(false)} className="modal-etiquetas-header border-0">
              {labelsView === 'create' ? (
                <span className="modal-title d-flex align-items-center gap-2">
                  <i className="fas fa-tags text-primary" />
                  Crear etiqueta / categoría
                </span>
              ) : (
                <span className="modal-title d-flex align-items-center gap-2">
                  <i className="fas fa-tags text-primary" />
                  Etiquetas / Categorías
                </span>
              )}
            </ModalHeader>
            <ModalBody className="modal-etiquetas-body pt-0">
              {labelsView === 'list' && (
                <div className="etiquetas-modal-lista">
                  {labelsErr && (
                    <Alert color="danger" className="py-2 px-3 small mb-2">
                      {labelsErr}
                    </Alert>
                  )}
                  <p className="text-muted small mb-2 etiquetas-lista-ayuda">
                    Catálogo de clasificación comercial para servicios.
                  </p>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <div className="etiquetas-subtitle">Listado por empresa</div>
                    <Button
                      color="primary"
                      size="sm"
                      className="px-3"
                      onClick={() => setLabelsView('create')}
                      disabled={labelsLoading}
                    >
                      <i className="fas fa-plus me-1" />
                      Nueva
                    </Button>
                  </div>
                  <div className="etiquetas-tabla-scroll">
                    <table className="table table-custom table-bordered table-sm mb-0 etiquetas-tabla-datos">
                      <colgroup>
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '20%' }} />
                        <col />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '18%' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Ref.</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th className="text-end">Pos.</th>
                          <th>Color</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labelsLoading ? (
                          <tr>
                            <td colSpan={5} className="text-center text-muted small py-4">
                              Cargando catálogo…
                            </td>
                          </tr>
                        ) : labelsList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center text-muted small py-4">
                              No hay etiquetas para mostrar.
                            </td>
                          </tr>
                        ) : (
                          labelsList.map((l, idx) => (
                            <tr key={l.id || `${l.ref || 'row'}-${idx}`}>
                              <td className="text-nowrap">{l.ref}</td>
                              <td className="text-truncate etiquetas-col-nombre" title={l.nombre}>
                                {l.nombre}
                              </td>
                              <td className="text-truncate etiquetas-col-desc" title={l.descripcion}>
                                {l.descripcion}
                              </td>
                              <td className="text-end text-nowrap">{l.posicion}</td>
                              <td className="text-nowrap">
                                <span
                                  className="etiquetas-swatch-inline"
                                  style={{
                                    backgroundColor: l.color,
                                  }}
                                />
                                <span className="text-muted small">{l.color}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {labelsView === 'create' && (
                <>
                  {labelsErr && (
                    <Alert color="danger" className="py-2 px-3 small mb-2">
                      {labelsErr}
                    </Alert>
                  )}
                  <p className="text-muted small mb-3">
                    Complete los datos. La referencia y el nombre son obligatorios para crear la categoría en el catálogo.
                  </p>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="label_ref">
                          Ref. <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="label_ref"
                          value={newLabel.ref}
                          onChange={(e) => setNewLabel((p) => ({ ...p, ref: e.target.value }))}
                          placeholder="ETQ-003"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="label_nombre">
                          Nombre <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="label_nombre"
                          value={newLabel.nombre}
                          onChange={(e) => setNewLabel((p) => ({ ...p, nombre: e.target.value }))}
                          placeholder="Nombre visible"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="label_desc">Descripción</Label>
                        <Input
                          id="label_desc"
                          value={newLabel.descripcion}
                          onChange={(e) => setNewLabel((p) => ({ ...p, descripcion: e.target.value }))}
                          placeholder="Descripción opcional"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="label_color_hex">Color</Label>
                        <div className="d-flex flex-wrap align-items-start gap-3">
                          <div
                            className="rounded border etq-color-swatch"
                            style={{
                              backgroundColor: normalizeHexColor(newLabel.color) ?? '#e9ecef',
                            }}
                            title="Vista previa"
                            role="img"
                            aria-label="Vista previa del color"
                          />
                          <div className="flex-grow-1" style={{ minWidth: 160 }}>
                            <Input
                              id="label_color_hex"
                              type="text"
                              value={newLabel.color}
                              onChange={onColorHexChange}
                              onBlur={onColorHexBlur}
                              placeholder="#4dabf7"
                              autoComplete="off"
                              spellCheck={false}
                              maxLength={9}
                            />
                            <FormText color="muted" className="mb-0">
                              Escriba o pegue un HEX (ej. #4dabf7, #e64980). También puede usar el selector.
                            </FormText>
                          </div>
                          <div>
                            <Label className="small text-muted d-block mb-1" for="label_color_native">
                              Selector
                            </Label>
                            <Input
                              id="label_color_native"
                              type="color"
                              className="etq-color-native form-control form-control-color"
                              value={normalizeHexColor(newLabel.color) ?? '#0d6efd'}
                              onChange={onColorNativeChange}
                              title="Elegir color"
                              aria-label="Selector visual de color"
                            />
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="label_pos">Posición</Label>
                        <Input
                          id="label_pos"
                          type="number"
                          min={0}
                          value={newLabel.posicion}
                          onChange={(e) =>
                            setNewLabel((p) => ({ ...p, posicion: e.target.value === '' ? 0 : Number(e.target.value) }))
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              )}
            </ModalBody>
            <ModalFooter className="modal-etiquetas-footer">
              {labelsView === 'create' ? (
                <>
                  <Button color="secondary" outline className="me-2" onClick={() => setLabelsView('list')}>
                    Anular
                  </Button>
                  <Button color="primary" onClick={createLabel} disabled={labelsLoading}>
                    Crear
                  </Button>
                </>
              ) : (
                <Button color="secondary" outline onClick={() => setLabelsOpen(false)}>
                  Cerrar
                </Button>
              )}
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevoServicio;
