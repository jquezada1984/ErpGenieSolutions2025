import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
} from 'reactstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import classnames from 'classnames';
import './NuevoServicio.scss';
import '../secciones/ModalEtiquetasCategoria.scss';

import SeccionItemEmpresa from '../secciones/SeccionItemEmpresa';
import { ItemSchema, getDefaultItemFormValues, type ItemFormValues } from '../schemas/itemSchema';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { mapItemDetalleToFormValues } from '../utils/mapItemDetalleToFormValues';
import { mapItemFormToUpdateServicioBody } from '../utils/mapItemFormToCreateBody';
import {
  listarDuracionUnidadCatalogo,
  listarImpuestos,
} from '../../../_apis_/gateway';
import {
  listarEstadosCompraItem,
  listarEstadosVentaItem,
  listarEtiquetasCategoria,
  listarNaturalezasItem,
  crearEtiquetaCategoria,
  actualizarEtiquetaCategoria,
  cambiarEstadoEtiquetaCategoria,
  actualizarItemServicio,
} from '../../../_apis_/item';
import SearchableSelect from '../../../components/SearchableSelect';
import {
  type CuentaContableCatalogItem,
  filterCuentasParaCampo,
  toSelectOptions,
} from '../utils/cuentasContablesFilters';

const initialForm = getDefaultItemFormValues('servicio');

function formatItemWriteError(err: unknown): string {
  const e = err as {
    message?: string;
    data?: { error?: string; errors?: Record<string, string[] | string> };
  };
  const d = e.data;
  if (d?.errors && typeof d.errors === 'object') {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(d.errors)) {
      if (Array.isArray(v)) parts.push(...v.map((m) => `${k}: ${m}`));
      else if (typeof v === 'string') parts.push(`${k}: ${v}`);
    }
    if (parts.length) return parts.join(' | ');
  }
  if (typeof d?.error === 'string' && d.error.trim()) return d.error.trim();
  if (typeof e.message === 'string' && e.message.trim()) return e.message.trim();
  return 'No se pudo guardar los cambios.';
}

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
  id_empresa: string;
  ref: string;
  nombre: string;
  descripcion: string;
  color: string;
  posicion: number;
  estado: boolean;
};

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

function mensajeErrorEtiquetaApi(e: unknown): string {
  const err = e as Error & { data?: Record<string, unknown> };
  const d = err.data;
  if (d && typeof d === 'object') {
    if (typeof d.error === 'string' && d.error.trim()) return d.error.trim();
    const raw = d.errors;
    if (raw && typeof raw === 'object') {
      const parts: string[] = [];
      for (const v of Object.values(raw)) {
        if (Array.isArray(v)) parts.push(...v.filter((x): x is string => typeof x === 'string'));
        else if (typeof v === 'string') parts.push(v);
      }
      if (parts.length) return parts.join(' ');
    }
    if (typeof d.detail === 'string' && d.detail.trim()) return d.detail.trim();
  }
  if (typeof err.message === 'string' && err.message.trim()) return err.message.trim();
  return 'No se pudo completar la operación. Inténtelo de nuevo.';
}

const ITEM_DETALLE_EDICION = gql`
  query ItemDetalleEdicionServicio($id_item: ID!) {
    itemDetalleEdicion(id_item: $id_item) {
      id_item
      id_empresa
      producto_ref
      etiqueta
      estado
      descripcion
      url_publica
      nota_interna
      inventariable
      precio_venta
      precio_minimo
      impuesto_id
      id_estado_venta
      id_estado_compra
      id_tipo_item
      id_naturaleza_item
      id_tipo_control_inventario
      id_tipo_control_caducidad
      id_cuenta_venta
      id_cuenta_venta_intracomunitaria
      id_cuenta_venta_exportacion
      id_cuenta_compra
      id_cuenta_compra_intracomunitaria
      id_cuenta_compra_importacion
    }
  }
`;

const CUENTAS_CONTABLES_QUERY = gql`
  query CuentasContablesCatalogoEditarServicio {
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

const EditarServicio: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [activeTab, setActiveTab] = useState<'1' | '2'>('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const [estadosVenta, setEstadosVenta] = useState<EstadoVenta[]>([]);
  const [estadosCompra, setEstadosCompra] = useState<EstadoCompra[]>([]);
  const [impuestos, setImpuestos] = useState<ImpuestoOpt[]>([]);

  const [durationValue, setDurationValue] = useState<number | ''>('');
  const [durationUnit, setDurationUnit] = useState('');
  const [mandatoryPeriods, setMandatoryPeriods] = useState(false);
  const [duracionUnidadesCatalogo, setDuracionUnidadesCatalogo] = useState<DuracionUnidadCatalogoRow[]>([]);
  const [loadingDuracionUnidades, setLoadingDuracionUnidades] = useState(false);
  const [errDuracionUnidades, setErrDuracionUnidades] = useState<string | null>(null);

  const [labelsOpen, setLabelsOpen] = useState(false);
  const [labelsView, setLabelsView] = useState<'list' | 'create' | 'edit'>('list');
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [labelsSaving, setLabelsSaving] = useState(false);
  const [labelsErr, setLabelsErr] = useState<string | null>(null);
  const [labelsOk, setLabelsOk] = useState<string | null>(null);
  const [labelsBusqueda, setLabelsBusqueda] = useState('');
  const [labelsFieldErrors, setLabelsFieldErrors] = useState<{ ref?: string; posicion?: string }>({});
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [labelEstadoSavingId, setLabelEstadoSavingId] = useState<string | null>(null);
  const [labelsList, setLabelsList] = useState<EtiquetaRow[]>([]);
  const [newLabel, setNewLabel] = useState({
    ref: '',
    nombre: '',
    descripcion: '',
    color: '#0d6efd',
    posicion: 10,
    estado: true,
  });

  const { watch, setValue, handleSubmit, reset } = useForm<ItemFormValues>({
    resolver: yupResolver(ItemSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  const idTipoItemEtiquetas = useMemo(
    () => String(formData.id_tipo_item ?? '').trim(),
    [formData.id_tipo_item]
  );

  const idEmpresaEtiquetas = useMemo(
    () => String(formData.id_empresa ?? empresaUsuario ?? '').trim(),
    [formData.id_empresa, empresaUsuario]
  );

  const etiquetasListadoFiltrado = useMemo(() => {
    const q = labelsBusqueda.trim().toLowerCase();
    if (!q) return labelsList;
    return labelsList.filter(
      (l) =>
        (l.ref && l.ref.toLowerCase().includes(q)) || (l.nombre && l.nombre.toLowerCase().includes(q))
    );
  }, [labelsList, labelsBusqueda]);

  const [fetchItemDetalle] = useLazyQuery(ITEM_DETALLE_EDICION, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

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
      setHasChanges(true);
    },
    [setValue]
  );

  useEffect(() => {
    if (scope === 'EMPRESA' && empresaUsuario && !formData.id_empresa) {
      setValue('id_empresa', empresaUsuario);
    }
  }, [scope, empresaUsuario, formData.id_empresa, setValue]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoadingDetalle(true);
      setError(null);
      const res = await fetchItemDetalle({ variables: { id_item: id } });
      if (cancelled) return;
      if (res.error?.message) {
        setError(res.error.message);
        reset({ ...initialForm });
        setLoadingDetalle(false);
        return;
      }
      const row = res.data?.itemDetalleEdicion;
      if (!row) {
        setError('No se encontró el servicio o no se pudo cargar desde el servidor.');
        reset({ ...initialForm });
        setLoadingDetalle(false);
        return;
      }
      const mapped = mapItemDetalleToFormValues(row);
      reset({ ...mapped, tipo_item: 'servicio' });
      const navState = location.state as
        | { prefill?: { duration_value?: number | null; id_duration_unit?: string | null } }
        | undefined;
      const durationFromState = navState?.prefill?.duration_value;
      const durationUnitFromState = navState?.prefill?.id_duration_unit;
      setDurationValue(
        durationFromState != null && Number.isFinite(Number(durationFromState))
          ? Number(durationFromState)
          : ''
      );
      setDurationUnit(String(durationUnitFromState ?? '').trim());
      setHasChanges(false);
      setLoadingDetalle(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchItemDetalle, reset, location.state]);

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
        /* sin bloquear pantalla */
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
      setHasChanges(true);
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
        setHasChanges(true);
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
      setHasChanges(true);
    },
    [setValue]
  );

  const onTaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const idImp = e.target.value;
      const imp = impuestos.find((i) => String(i.id) === idImp);
      setValue('impuesto_id', (idImp || '') as never);
      setValue('tasa_iva', Number(imp?.tasa ?? 0) as never);
      setHasChanges(true);
    },
    [impuestos, setValue]
  );

  const onDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationValue(e.target.value === '' ? '' : Number(e.target.value));
    setHasChanges(true);
  }, []);

  const onDurationUnitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationUnit(e.target.value);
    setHasChanges(true);
  }, []);

  const onMandatoryPeriodsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMandatoryPeriods(e.target.checked);
    setHasChanges(true);
  }, []);

  const selectedImpuestoId =
    formData.impuesto_id && impuestos.some((i) => String(i.id) === String(formData.impuesto_id))
      ? String(formData.impuesto_id)
      : '';

  const toEtiqueta = (raw: Record<string, unknown>): EtiquetaRow => ({
    id: String(raw.id_etiqueta_categoria ?? raw.idEtiquetaCategoria ?? ''),
    id_empresa: String(raw.id_empresa ?? raw.idEmpresa ?? ''),
    ref: String(raw.ref ?? raw.referencia ?? ''),
    nombre: String(raw.nombre ?? ''),
    descripcion: String(raw.descripcion ?? ''),
    color: String(raw.color ?? '#0d6efd'),
    posicion: Number(raw.posicion ?? 0),
    estado: raw.estado !== false,
  });

  const closeLabelsModal = useCallback(() => {
    setLabelsOpen(false);
    setLabelsView('list');
    setLabelsErr(null);
    setLabelsOk(null);
    setLabelsFieldErrors({});
    setLabelsBusqueda('');
    setEditingLabelId(null);
    setLabelEstadoSavingId(null);
    setNewLabel({ ref: '', nombre: '', descripcion: '', color: '#0d6efd', posicion: 10, estado: true });
  }, []);

  const loadLabels = useCallback(async () => {
    const idE = idEmpresaEtiquetas;
    const idT = idTipoItemEtiquetas;
    if (!idE) {
      setLabelsErr(null);
      setLabelsList([]);
      setLabelsLoading(false);
      return;
    }
    if (!idT) {
      setLabelsErr(null);
      setLabelsList([]);
      setLabelsLoading(false);
      return;
    }
    setLabelsLoading(true);
    setLabelsErr(null);
    try {
      const data = await listarEtiquetasCategoria(idE, idT);
      const list = Array.isArray(data) ? data : [];
      setLabelsList(list.map((x) => toEtiqueta((x ?? {}) as Record<string, unknown>)));
    } catch (e) {
      setLabelsErr(e instanceof Error ? e.message : 'No se pudo cargar el catálogo.');
      setLabelsList([]);
    } finally {
      setLabelsLoading(false);
    }
  }, [idEmpresaEtiquetas, idTipoItemEtiquetas]);

  const openLabels = useCallback(async () => {
    setLabelsOpen(true);
    setLabelsView('list');
    setLabelsErr(null);
    setLabelsOk(null);
    setLabelsFieldErrors({});
    setLabelsBusqueda('');
    setEditingLabelId(null);
    setLabelEstadoSavingId(null);
    const idE = idEmpresaEtiquetas;
    const idT = idTipoItemEtiquetas;
    if (!idE || !idT) {
      setLabelsList([]);
      setLabelsLoading(false);
      return;
    }
    await loadLabels();
  }, [loadLabels, idEmpresaEtiquetas, idTipoItemEtiquetas]);

  const handleStartCreateLabel = useCallback(() => {
    setNewLabel({
      ref: '',
      nombre: '',
      descripcion: '',
      color: '#0d6efd',
      posicion: labelsList.length + 1,
      estado: true,
    });
    setLabelsErr(null);
    setLabelsOk(null);
    setLabelsFieldErrors({});
    setEditingLabelId(null);
    setLabelsView('create');
  }, [labelsList.length]);

  const handleCancelLabelForm = useCallback(() => {
    setLabelsView('list');
    setLabelsErr(null);
    setLabelsFieldErrors({});
    setEditingLabelId(null);
    setNewLabel({ ref: '', nombre: '', descripcion: '', color: '#0d6efd', posicion: 10, estado: true });
  }, []);

  const handleStartEditLabel = useCallback((row: EtiquetaRow) => {
    if (row.estado === false) return;
    setLabelsErr(null);
    setLabelsOk(null);
    setLabelsFieldErrors({});
    setNewLabel({
      ref: row.ref,
      nombre: row.nombre,
      descripcion: row.descripcion,
      color: normalizeHexColor(row.color) ?? row.color ?? '#0d6efd',
      posicion: row.posicion,
      estado: row.estado !== false,
    });
    setEditingLabelId(row.id || null);
    setLabelsView('edit');
  }, []);

  const chgNewLabel = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const v =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
          ? value === ''
            ? 0
            : Number(value)
          : value;
    setNewLabel((p) => ({ ...p, [name]: v } as typeof p));
    if (name === 'ref' || name === 'posicion') {
      setLabelsErr(null);
      setLabelsFieldErrors((prev) => {
        const n = { ...prev };
        if (name === 'ref') delete n.ref;
        if (name === 'posicion') delete n.posicion;
        return n;
      });
    }
  }, []);

  const handleToggleEtiquetaEstado = useCallback(
    async (labelId: string, estadoActual: boolean, idEmpresaDeFila?: string) => {
      if (!labelId || labelEstadoSavingId) return;
      const idE = idEmpresaEtiquetas;
      const idEmpresaPayload = (idEmpresaDeFila && String(idEmpresaDeFila).trim()) || idE;
      if (!idEmpresaPayload) {
        setLabelsErr('Debe indicar una empresa en General o iniciar sesión con empresa asignada.');
        return;
      }
      if (!idTipoItemEtiquetas) {
        setLabelsErr('Falta el tipo de ítem SERVICE resuelto en Empresa.');
        return;
      }
      const siguiente = !estadoActual;
      setLabelsErr(null);
      setLabelEstadoSavingId(labelId);
      setLabelsList((prev) => prev.map((row) => (row.id === labelId ? { ...row, estado: siguiente } : row)));
      try {
        const res = await cambiarEstadoEtiquetaCategoria(labelId, {
          id_empresa: idEmpresaPayload,
          estado: siguiente,
        });
        if (res && typeof res === 'object' && (res as { success?: boolean }).success === false) {
          throw new Error(
            typeof (res as { error?: string }).error === 'string'
              ? (res as { error: string }).error
              : 'No se pudo actualizar el estado'
          );
        }
        await loadLabels();
      } catch (e) {
        console.error('Error al cambiar estado de etiqueta/categoría:', e);
        setLabelsList((prev) => prev.map((row) => (row.id === labelId ? { ...row, estado: estadoActual } : row)));
        setLabelsErr(mensajeErrorEtiquetaApi(e));
      } finally {
        setLabelEstadoSavingId(null);
      }
    },
    [idEmpresaEtiquetas, idTipoItemEtiquetas, labelEstadoSavingId, loadLabels]
  );

  const handleGuardarEdicionLabel = useCallback(async () => {
    const idEdit = (editingLabelId || '').trim();
    const ref = (newLabel.ref || '').trim();
    const posNum = Number(newLabel.posicion);
    const idE = idEmpresaEtiquetas;

    if (!idEdit) {
      setLabelsErr('No se identifica la etiqueta a guardar. Vuelva al listado e intente de nuevo.');
      return;
    }
    const nextField: { ref?: string; posicion?: string } = {};
    if (!ref) nextField.ref = 'La referencia es obligatoria';
    if (!Number.isFinite(posNum) || posNum < 0) {
      nextField.posicion = 'Indique una posición válida (número ≥ 0)';
    }
    setLabelsFieldErrors(nextField);
    if (!ref || nextField.posicion) {
      setLabelsErr('Revise los campos marcados.');
      return;
    }
    if (!idE) {
      setLabelsErr('Debe indicar una empresa en General o iniciar sesión con empresa asignada.');
      return;
    }
    if (!idTipoItemEtiquetas) {
      setLabelsErr('Debe resolverse el tipo de ítem SERVICE en Empresa antes de guardar.');
      return;
    }

    const descripcion = (newLabel.descripcion || '').trim();
    const nombreTrim = (newLabel.nombre || '').trim();
    const nombre = nombreTrim || ref;

    setLabelsSaving(true);
    setLabelsErr(null);
    setLabelsOk(null);
    try {
      const res = await actualizarEtiquetaCategoria(idEdit, {
        id_empresa: idE,
        id_etiqueta_categoria: idEdit,
        ref,
        nombre,
        descripcion: descripcion || null,
        color: normalizeHexColor(newLabel.color) ?? '#0d6efd',
        posicion: posNum,
        estado: newLabel.estado !== false,
      });
      if (res && typeof res === 'object' && (res as { success?: boolean }).success === false) {
        throw new Error(
          typeof (res as { error?: string }).error === 'string'
            ? (res as { error: string }).error
            : 'Respuesta rechazada'
        );
      }
      await loadLabels();
      setLabelsView('list');
      setEditingLabelId(null);
      setLabelsFieldErrors({});
      setLabelsOk('Los cambios se han guardado correctamente.');
    } catch (e) {
      console.error('Error al actualizar etiqueta/categoría:', e);
      setLabelsErr(mensajeErrorEtiquetaApi(e));
    } finally {
      setLabelsSaving(false);
    }
  }, [editingLabelId, newLabel, idEmpresaEtiquetas, idTipoItemEtiquetas, loadLabels]);

  const createLabel = useCallback(async () => {
    const idEmp = String(formData.id_empresa || empresaUsuario || '').trim();
    const idTipo = String(formData.id_tipo_item ?? '').trim();
    if (!idEmp) {
      setLabelsErr('Seleccione una empresa en General antes de crear etiquetas/categorías.');
      return;
    }
    if (!idTipo) {
      setLabelsErr('Debe resolverse el tipo de ítem SERVICE en Empresa antes de crear etiquetas.');
      return;
    }
    const ref = (newLabel.ref || '').trim();
    const posNum = Number(newLabel.posicion);
    const nextField: { ref?: string; posicion?: string } = {};
    if (!ref) nextField.ref = 'La referencia es obligatoria';
    if (!Number.isFinite(posNum) || posNum < 0) {
      nextField.posicion = 'Indique una posición válida (número ≥ 0)';
    }
    setLabelsFieldErrors(nextField);
    if (!ref || nextField.posicion) {
      setLabelsErr('Revise los campos marcados.');
      return;
    }
    const nombreTrim = (newLabel.nombre || '').trim();
    const nombre = nombreTrim || ref;

    setLabelsSaving(true);
    setLabelsErr(null);
    setLabelsOk(null);
    try {
      const res = await crearEtiquetaCategoria({
        id_empresa: idEmp,
        id_tipo_item: idTipo,
        ref,
        nombre,
        descripcion: (newLabel.descripcion || '').trim() || null,
        color: normalizeHexColor(newLabel.color) ?? newLabel.color,
        posicion: posNum,
        estado: newLabel.estado !== false,
      });
      if (res && typeof res === 'object' && (res as { success?: boolean }).success === false) {
        throw new Error(
          typeof (res as { error?: string }).error === 'string' ? (res as { error: string }).error : 'Respuesta rechazada'
        );
      }
      setLabelsView('list');
      setNewLabel({ ref: '', nombre: '', descripcion: '', color: '#0d6efd', posicion: labelsList.length + 1, estado: true });
      setLabelsFieldErrors({});
      await loadLabels();
      setLabelsOk('La etiqueta/categoría fue creada correctamente.');
    } catch (e) {
      setLabelsErr(mensajeErrorEtiquetaApi(e));
    } finally {
      setLabelsSaving(false);
    }
  }, [formData.id_empresa, formData.id_tipo_item, empresaUsuario, loadLabels, newLabel, labelsList.length]);

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

  useEffect(() => {
    if (!labelsOk) return;
    const t = window.setTimeout(() => setLabelsOk(null), 5000);
    return () => window.clearTimeout(t);
  }, [labelsOk]);

  const onSubmitRHF = useCallback(
    async (values: ItemFormValues) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setSuccess(false);
      setSuccessMessage(null);
      try {
        const id_empresa = values.id_empresa || empresaUsuario || '';
        if (!id_empresa) {
          setError('Debe seleccionar una empresa');
          setLoading(false);
          return;
        }
        const ref = (values.codigo || '').trim() || (values.nombre || '').trim();
        if (!ref) {
          setError('La referencia (código) o el nombre es obligatorio');
          setLoading(false);
          return;
        }
        const body = mapItemFormToUpdateServicioBody(values, {
          duration_value: durationValue,
          id_duration_unit: durationUnit,
          mandatory_periods: mandatoryPeriods,
        });
        const res = (await actualizarItemServicio(id, body)) as {
          success?: boolean;
          error?: string;
          message?: string;
        };
        if (res && typeof res === 'object' && res.success === false) {
          setError(typeof res.error === 'string' ? res.error : 'Error al guardar');
          return;
        }
        setSuccessMessage(
          typeof res?.message === 'string' && res.message.trim()
            ? res.message.trim()
            : 'Servicio actualizado correctamente.'
        );
        setSuccess(true);
        setHasChanges(false);
        window.setTimeout(() => {
          setSuccess(false);
          setSuccessMessage(null);
        }, 5000);
      } catch (e: unknown) {
        setError(formatItemWriteError(e));
      } finally {
        setLoading(false);
      }
    },
    [id, empresaUsuario, durationValue, durationUnit, mandatoryPeriods]
  );

  const onInvalid = useCallback((formErrors: unknown) => {
    const collect = (obj: unknown): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj && typeof obj === 'object' && 'message' in obj && typeof (obj as { message: unknown }).message === 'string')
        return [(obj as { message: string }).message];
      return Object.values(obj).flatMap(collect);
    };
    const messages = collect(formErrors);
    setError(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  return (
    <div className="configuracion-nuevo-servicio">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-edit text-primary me-2" />
              Editar Servicio
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => navigate('/items/servicios')}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmitRHF, onInvalid)}
                disabled={loading || loadingDetalle || !hasChanges}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </div>

          {success && (
            <Alert color="success">
              {successMessage || 'Servicio actualizado correctamente.'}
            </Alert>
          )}
          {error && <Alert color="danger">{error}</Alert>}
          {loadingDetalle && (
            <div className="text-center py-4 text-muted">
              <Spinner size="sm" className="me-2" />
              Cargando datos del servicio…
            </div>
          )}

          <div className="instruction-text mb-3">
            <p>
              Modifique la información del servicio y haga clic en <b>Guardar Cambios</b>.
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
            toggle={closeLabelsModal}
            size="lg"
            style={{ zIndex: 9999 }}
            backdrop="static"
            keyboard={false}
            centered
            contentClassName="modal-etiquetas-categoria-scope bg-white shadow"
          >
            <ModalHeader toggle={closeLabelsModal} className="modal-etiquetas-header border-0">
              {labelsView === 'create' ? (
                <span className="modal-title d-flex align-items-center gap-2">
                  <i className="fas fa-tags text-primary" />
                  Crear etiqueta / categoría
                </span>
              ) : labelsView === 'edit' ? (
                <span className="modal-title d-flex align-items-center gap-2">
                  <i className="fas fa-tags text-primary" />
                  Editar etiqueta / categoría
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
                  {labelsOk && (
                    <Alert color="success" className="py-2 px-3 small mb-2" role="status">
                      {labelsOk}
                    </Alert>
                  )}
                  {labelsErr && (
                    <Alert color="danger" className="py-2 px-3 small mb-2">
                      {labelsErr}
                    </Alert>
                  )}
                  {!idEmpresaEtiquetas && (
                    <Alert color="warning" className="mb-3">
                      Seleccione una empresa en <b>General</b> o use una sesión con empresa asignada para cargar y crear
                      etiquetas.
                    </Alert>
                  )}
                  {idEmpresaEtiquetas && !idTipoItemEtiquetas && (
                    <Alert color="warning" className="py-2 small mb-2">
                      Espere a que se cargue el tipo de ítem <strong>SERVICE</strong> en <strong>Empresa</strong>.
                    </Alert>
                  )}
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <div className="etiquetas-subtitle">Listado por empresa y tipo de ítem</div>
                    <Button
                      color="primary"
                      size="sm"
                      className="px-3"
                      onClick={handleStartCreateLabel}
                      disabled={labelsLoading || !idEmpresaEtiquetas || !idTipoItemEtiquetas}
                    >
                      <i className="fas fa-plus me-1" />
                      Nueva
                    </Button>
                  </div>
                  <Row className="mb-2 g-2 align-items-end">
                    <Col xs={12} md={7} lg={6}>
                      <Label for="srv_etq_busqueda" className="small text-muted mb-1">
                        Buscar
                      </Label>
                      <Input
                        id="srv_etq_busqueda"
                        type="search"
                        bsSize="sm"
                        className="etiquetas-busqueda-input"
                        placeholder="Buscar por referencia o nombre"
                        value={labelsBusqueda}
                        onChange={(e) => setLabelsBusqueda(e.target.value)}
                        autoComplete="off"
                        aria-label="Buscar etiquetas por referencia o nombre"
                      />
                    </Col>
                  </Row>
                  <div className="etiquetas-tabla-scroll">
                    <table className="table table-custom table-bordered table-sm mb-0 etiquetas-tabla-datos">
                      <colgroup>
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '18%' }} />
                        <col />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '124px' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Ref.</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th className="text-end">Pos.</th>
                          <th>Color</th>
                          <th className="etiquetas-col-acciones">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labelsLoading ? (
                          <tr>
                            <td colSpan={6} className="text-center text-muted small py-4">
                              Cargando catálogo…
                            </td>
                          </tr>
                        ) : etiquetasListadoFiltrado.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center text-muted small py-4">
                              {labelsList.length === 0
                                ? 'No hay etiquetas para mostrar.'
                                : 'Ningún resultado coincide con la búsqueda.'}
                            </td>
                          </tr>
                        ) : (
                          etiquetasListadoFiltrado.map((l, idx) => (
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
                              <td className="etiquetas-col-acciones">
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  <Button
                                    type="button"
                                    color={l.estado === false ? 'secondary' : 'info'}
                                    size="sm"
                                    className="px-2 py-1 etiquetas-btn-editar"
                                    title={l.estado === false ? 'Actívela para poder editar' : 'Editar'}
                                    disabled={
                                      l.estado === false || labelsLoading || labelEstadoSavingId === l.id
                                    }
                                    onClick={() =>
                                      l.estado !== false &&
                                      !labelsLoading &&
                                      labelEstadoSavingId !== l.id &&
                                      handleStartEditLabel(l)
                                    }
                                    aria-label="Editar etiqueta o categoría"
                                  >
                                    <i className="bi bi-pencil-fill" aria-hidden />
                                  </Button>
                                  <div className="form-check form-switch etiquetas-switch-fila mb-0">
                                    <Input
                                      id={`srv-etq-estado-${l.id || String(idx)}`}
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={l.estado !== false}
                                      disabled={labelsLoading || labelEstadoSavingId === l.id}
                                      onChange={() =>
                                        handleToggleEtiquetaEstado(l.id, l.estado !== false, l.id_empresa)
                                      }
                                      title={l.estado !== false ? 'Activo' : 'Inactivo'}
                                      aria-label={
                                        l.estado !== false
                                          ? 'Etiqueta activa; pulse para marcar inactiva'
                                          : 'Etiqueta inactiva; pulse para marcar activa'
                                      }
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(labelsView === 'create' || labelsView === 'edit') && (
                <>
                  {labelsErr && (
                    <Alert color="danger" className="py-2 px-3 small mb-2">
                      {labelsErr}
                    </Alert>
                  )}
                  {labelsView === 'create' ? (
                    <p className="text-muted small mb-3">
                      Complete los datos. La referencia es obligatoria; el nombre, si lo deja vacío, usará la referencia al
                      guardar.
                    </p>
                  ) : (
                    <p className="text-muted small mb-3">
                      Modifique los datos y pulse &quot;Guardar cambios&quot; para actualizar el catálogo en el servidor.
                    </p>
                  )}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="srv_etq_ref">
                          Ref. <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="srv_etq_ref"
                          name="ref"
                          value={newLabel.ref}
                          onChange={chgNewLabel}
                          placeholder="ETQ-003"
                          invalid={!!labelsFieldErrors.ref}
                        />
                        {labelsFieldErrors.ref && <FormText color="danger">{labelsFieldErrors.ref}</FormText>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="srv_etq_nombre">Nombre</Label>
                        <Input
                          id="srv_etq_nombre"
                          name="nombre"
                          value={newLabel.nombre}
                          onChange={chgNewLabel}
                          placeholder="Nombre visible"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="srv_etq_descripcion">Descripción</Label>
                        <Input
                          id="srv_etq_descripcion"
                          name="descripcion"
                          value={newLabel.descripcion}
                          onChange={chgNewLabel}
                          placeholder="Descripción opcional"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="srv_etq_color_hex">Color</Label>
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
                              id="srv_etq_color_hex"
                              name="color"
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
                            <Label className="small text-muted d-block mb-1" for="srv_etq_color_native">
                              Selector
                            </Label>
                            <Input
                              id="srv_etq_color_native"
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
                        <Label for="srv_etq_posicion">Posición</Label>
                        <Input
                          id="srv_etq_posicion"
                          name="posicion"
                          type="number"
                          value={newLabel.posicion}
                          onChange={chgNewLabel}
                          min={0}
                          invalid={!!labelsFieldErrors.posicion}
                        />
                        {labelsFieldErrors.posicion && (
                          <FormText color="danger">{labelsFieldErrors.posicion}</FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} className="d-flex align-items-end">
                      <FormGroup className="w-100">
                        <div className="form-check form-switch mb-3 pb-1">
                          <Input
                            id="srv_etq_estado"
                            name="estado"
                            type="checkbox"
                            className="form-check-input"
                            checked={newLabel.estado}
                            onChange={chgNewLabel}
                          />
                          <Label for="srv_etq_estado" className="form-check-label ms-2">
                            Activo
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              )}
            </ModalBody>
            <ModalFooter className="modal-etiquetas-footer">
              {labelsView === 'create' ? (
                <>
                  <Button color="secondary" outline className="me-2" onClick={handleCancelLabelForm}>
                    Anular
                  </Button>
                  <Button color="primary" onClick={createLabel} disabled={labelsLoading || labelsSaving}>
                    {labelsSaving ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Guardando…
                      </>
                    ) : (
                      'Crear'
                    )}
                  </Button>
                </>
              ) : labelsView === 'edit' ? (
                <>
                  <Button color="secondary" outline className="me-2" onClick={handleCancelLabelForm}>
                    Volver al listado
                  </Button>
                  <Button color="primary" onClick={handleGuardarEdicionLabel} disabled={labelsLoading || labelsSaving}>
                    {labelsSaving ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Guardando…
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </Button>
                </>
              ) : (
                <Button color="secondary" outline onClick={closeLabelsModal}>
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

export default EditarServicio;
