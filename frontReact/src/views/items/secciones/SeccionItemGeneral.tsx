import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
  FormText,
} from 'reactstrap';
import './ModalEtiquetasCategoria.scss';
import type { ItemFormValues } from '../schemas/itemSchema';
import useJwtPayload from '../../../hooks/useJwtPayload';
import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import {
  listarEstadosVentaItem,
  listarEstadosCompraItem,
  listarNaturalezasItem,
  listarTiposControlInventarioItem,
  listarTiposControlCaducidadItem,
  listarEtiquetasCategoria,
  crearEtiquetaCategoria,
  actualizarEtiquetaCategoria,
  cambiarEstadoEtiquetaCategoria,
} from '../../../_apis_/item';

/** Tipo de un ítem del catálogo estado_venta_item (respuesta del API) */
type EstadoVentaItemOption = {
  id_estado_venta: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  orden?: number;
};

/** Tipo de un ítem del catálogo estado_compra_item (respuesta del API) */
type EstadoCompraItemOption = {
  id_estado_compra: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  orden?: number;
};

/** Tipo de un ítem del catálogo naturaleza_item_catalogo (respuesta del API) */
type NaturalezaItemOption = {
  id_naturaleza_item: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  orden?: number;
};

/** Catálogo tipo_control_inventario_item (API) */
type TipoControlInventarioOption = {
  id_tipo_control_inventario_item: string;
  codigo: string;
  nombre: string;
};

/** Catálogo tipo_control_caducidad_item (API) */
type TipoControlCaducidadOption = {
  id_tipo_control_caducidad_item: string;
  codigo: string;
  nombre: string;
};

type CatalogosControlProveidos = {
  inventario: TipoControlInventarioOption[];
  caducidad: TipoControlCaducidadOption[];
};

type Props = {
  data: Partial<ItemFormValues>;
  onChange: (d: Partial<ItemFormValues>) => void;
  tipoItem: 'producto' | 'servicio';
  /** Bloque de empresa incrustado bajo el título "Datos generales" (solo layout Nuevo Producto). */
  empresaSlot?: React.ReactNode;
  mostrarAsteriscosObligatorios?: boolean;
  uiRules?: {
    inventarioRelevante: boolean;
    caducidadRelevante: boolean;
  };
  /**
   * `null` = el padre está cargando (no duplicar fetch); objeto = usar esas listas.
   * `undefined` = este componente pide los catálogos (servicios / sin prefetch).
   */
  catalogosControlProveidos?: CatalogosControlProveidos | null;
  /** Si true, no se muestra el input "Etiqueta" (listados); el valor en el form padre se mantiene. */
  ocultarCampoEtiquetaListados?: boolean;
};

/** Compatibilidad con formulario: solo existe `usar_lote_serie` en payload; true se hidrata como LOTE. */
function inventarioCodigoFromPayload(usarLoteSerie: boolean | undefined): string {
  return usarLoteSerie === true ? 'LOTE' : 'SIN_CONTROL';
}

function caducidadCodigoFromPayload(fechaCadObl: boolean | undefined): string {
  return fechaCadObl === true ? 'FECHA_CADUCIDAD' : 'NINGUNA';
}

function flagsFromInventarioCodigo(codigo: string) {
  const usar_lote_serie = codigo === 'LOTE' || codigo === 'SERIE';
  const usar_lote = codigo === 'LOTE';
  const usar_serie = codigo === 'SERIE';
  return { usar_lote_serie, usar_lote, usar_serie };
}

function fechaCaducidadFromCaducidadCodigo(codigo: string): boolean {
  return codigo === 'FECHA_CADUCIDAD' || codigo === 'AMBAS';
}

/** Opciones react-select para el multiselect Etiquetas/Categorías (tab General); value = id_etiqueta_categoria. */
type EtiquetaCategoriaComboOption = { value: string; label: string };

const TEXTO_INFO_ETIQUETAS_FORMULARIO =
  'Las etiquetas permiten clasificar el producto para facilitar búsquedas, filtros y organización. Puedes seleccionar una o varias según corresponda.';

/** Fila del GET /api/item/etiqueta-categoria → opción de combo (solo activas). */
function mapApiFilaToEtiquetaComboOption(r: unknown): EtiquetaCategoriaComboOption | null {
  const row = r as Record<string, unknown>;
  const id = String(row?.id_etiqueta_categoria ?? row?.idEtiquetaCategoria ?? '').trim();
  if (!id) return null;
  const est = row?.estado;
  const activo = est === true || est === false ? Boolean(est) : true;
  if (!activo) return null;
  const ref = String(row?.ref ?? '').trim();
  const nombreRaw = row?.nombre != null ? String(row.nombre).trim() : '';
  const nombre = nombreRaw || ref;
  const label = ref && nombre && ref !== nombre ? `${ref} - ${nombre}` : nombre;
  return { value: id, label };
}

const estilosEtiquetasCategoriasVisual: StylesConfig<EtiquetaCategoriaComboOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
    borderRadius: '0.375rem',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#86b7fe' : '#adb5bd' },
  }),
  container: (base) => ({ ...base, width: '100%' }),
  multiValue: (base) => ({
    ...base,
    borderRadius: '0.25rem',
    backgroundColor: '#e7f1ff',
  }),
  multiValueLabel: (base) => ({ ...base, color: '#495057', fontSize: '0.875rem' }),
  placeholder: (base) => ({ ...base, color: '#6c757d' }),
};

/** Mensaje legible desde respuesta de error del Gateway/ItemPython (rechazo axios en _apis_/item). */
function mensajeErrorEtiquetaApi(e: unknown): string {
  const err = e as Error & { data?: Record<string, unknown>; status?: number };
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
  return 'No se pudo crear la etiqueta. Inténtelo de nuevo.';
}

function normalizarListaEtiquetasApi(raw: unknown): unknown[] {
  if (raw && typeof raw === 'object' && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: unknown[] }).data;
  }
  if (Array.isArray(raw)) return raw;
  return [];
}

/** Normaliza entrada HEX (#RGB o #RRGGBB); null si no es válida. */
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

const SeccionItemGeneral: React.FC<Props> = ({
  data,
  onChange,
  tipoItem,
  empresaSlot,
  mostrarAsteriscosObligatorios = false,
  uiRules,
  catalogosControlProveidos,
  ocultarCampoEtiquetaListados = false,
}) => {
  const jwtPayload = useJwtPayload();
  /** Misma lógica que NuevoProducto al crear ítem: formulario o JWT (evita submit silencioso sin empresa). */
  const idEmpresaEtiquetas = useMemo(
    () => String(data.id_empresa ?? jwtPayload?.id_empresa ?? '').trim(),
    [data.id_empresa, jwtPayload]
  );

  /** UUID en tipo_item_catalogo (PRODUCT vía SeccionItemEmpresa); requerido para catálogo de etiquetas por ámbito. */
  const idTipoItemEtiquetas = useMemo(
    () => String(data.id_tipo_item ?? '').trim(),
    [data.id_tipo_item]
  );

  const [f, setF] = useState({
    nombre: '',
    codigo: '',
    etiqueta: '',
    descripcion: '',
    url_publica: '',
    nota_privada: '',
    estado: true,
    id_estado_venta: '',
    estado_venta: 0,
    id_estado_compra: '',
    estado_compra: 0,
    usar_lote_serie: false,
    usar_lote: false,
    usar_serie: false,
    fecha_caducidad_obligatoria: false,
    naturaleza_producto: '',
    id_naturaleza_item: '',
    id_tipo_control_inventario: '',
    id_tipo_control_caducidad: '',
  });

  const [estadosVentaItem, setEstadosVentaItem] = useState<EstadoVentaItemOption[]>([]);
  const [loadingEstadosVenta, setLoadingEstadosVenta] = useState(false);
  const [estadosCompraItem, setEstadosCompraItem] = useState<EstadoCompraItemOption[]>([]);
  const [loadingEstadosCompra, setLoadingEstadosCompra] = useState(false);
  const [naturalezasItem, setNaturalezasItem] = useState<NaturalezaItemOption[]>([]);
  const [loadingNaturalezasItem, setLoadingNaturalezasItem] = useState(false);
  const [tiposControlInventarioItem, setTiposControlInventarioItem] = useState<TipoControlInventarioOption[]>([]);
  const [loadingTiposControlInventario, setLoadingTiposControlInventario] = useState(false);
  const [tiposControlCaducidadItem, setTiposControlCaducidadItem] = useState<TipoControlCaducidadOption[]>([]);
  const [loadingTiposControlCaducidad, setLoadingTiposControlCaducidad] = useState(false);

  /** Catálogo comercial real: Gateway → ItemPython → public.item_etiqueta_categoria */
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  const [labelsView, setLabelsView] = useState<'list' | 'create' | 'edit'>('list');
  /** Id de fila en edición (para futuro PUT); solo UX en esta fase. */
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [labelsList, setLabelsList] = useState<
    Array<{
      id: string;
      /** Empresa de la fila (API); el PATCH de estado debe usar la misma que en BD. */
      id_empresa: string;
      ref: string;
      nombre: string;
      descripcion: string;
      color: string;
      posicion: number;
      estado: boolean;
    }>
  >([]);
  /** Filtro local del listado del modal (ref / nombre); sin API. */
  const [labelsBusqueda, setLabelsBusqueda] = useState('');
  /** Mensajes informativos (p. ej. edición solo visual). */
  const [labelsInfo, setLabelsInfo] = useState<string | null>(null);
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [labelsSaving, setLabelsSaving] = useState(false);
  /** Fila cuyo switch de estado está guardando (evita doble envío). */
  const [labelEstadoSavingId, setLabelEstadoSavingId] = useState<string | null>(null);
  /** Selección visual en Datos generales; no forma parte del payload del ítem en esta fase. */
  const [selEtiquetasCategoriasVisual, setSelEtiquetasCategoriasVisual] = useState<
    readonly EtiquetaCategoriaComboOption[]
  >([]);
  /** Catálogo real para el multiselect (GET existente); se recarga con empresa y al cerrar el modal de catálogo. */
  const [etiquetasComboOpciones, setEtiquetasComboOpciones] = useState<EtiquetaCategoriaComboOption[]>([]);
  const [etiquetasComboLoading, setEtiquetasComboLoading] = useState(false);
  const [etiquetasCatSelectFocused, setEtiquetasCatSelectFocused] = useState(false);
  const [etiquetasCatMenuOpen, setEtiquetasCatMenuOpen] = useState(false);
  const showEtiquetasCategoriasInfo = etiquetasCatSelectFocused || etiquetasCatMenuOpen;

  const [labelsOk, setLabelsOk] = useState<string | null>(null);
  const [labelsErr, setLabelsErr] = useState<string | null>(null);
  const [labelsFieldErrors, setLabelsFieldErrors] = useState<{ ref?: string; posicion?: string }>({});
  const [newLabel, setNewLabel] = useState<{
    ref: string;
    nombre: string;
    descripcion: string;
    color: string;
    posicion: number;
    estado: boolean;
  }>({
    ref: '',
    nombre: '',
    descripcion: '',
    color: '#0d6efd',
    posicion: 1,
    estado: true,
  });

  useEffect(() => {
    if (tipoItem !== 'producto') return;
    const idE = idEmpresaEtiquetas;
    const idT = idTipoItemEtiquetas;
    if (!idE || !idT) {
      setEtiquetasComboOpciones([]);
      setSelEtiquetasCategoriasVisual([]);
      setEtiquetasComboLoading(false);
      return;
    }
    let cancelled = false;
    setEtiquetasComboLoading(true);
    listarEtiquetasCategoria(idE, idT, { incluirSinTipoItem: true })
      .then((rows) => {
        if (cancelled) return;
        const arr = Array.isArray(rows) ? rows : [];
        const opts = arr
          .map(mapApiFilaToEtiquetaComboOption)
          .filter((o): o is EtiquetaCategoriaComboOption => o != null)
          .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
        setEtiquetasComboOpciones(opts);
        setSelEtiquetasCategoriasVisual((prev) =>
          [...(prev ?? [])].filter((p) => opts.some((o) => o.value === p.value)),
        );
      })
      .catch(() => {
        if (!cancelled) setEtiquetasComboOpciones([]);
      })
      .finally(() => {
        if (!cancelled) setEtiquetasComboLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tipoItem, idEmpresaEtiquetas, idTipoItemEtiquetas, labelsModalOpen]);

  useEffect(() => {
    let idInv = data.id_tipo_control_inventario ?? '';
    if (!idInv && tiposControlInventarioItem.length > 0) {
      const codigo = inventarioCodigoFromPayload(data.usar_lote_serie);
      const opt = tiposControlInventarioItem.find((o) => o.codigo === codigo);
      if (opt) idInv = opt.id_tipo_control_inventario_item;
    }
    let idCad = data.id_tipo_control_caducidad ?? '';
    if (!idCad && tiposControlCaducidadItem.length > 0) {
      const codigo = caducidadCodigoFromPayload(data.fecha_caducidad_obligatoria);
      const opt = tiposControlCaducidadItem.find((o) => o.codigo === codigo);
      if (opt) idCad = opt.id_tipo_control_caducidad_item;
    }
    const invOpt = tiposControlInventarioItem.find((o) => o.id_tipo_control_inventario_item === idInv);
    const cadOpt = tiposControlCaducidadItem.find((o) => o.id_tipo_control_caducidad_item === idCad);
    const invCodigo = invOpt?.codigo || inventarioCodigoFromPayload(data.usar_lote_serie);
    const { usar_lote_serie, usar_lote, usar_serie } = flagsFromInventarioCodigo(invCodigo);
    const fecha_caducidad_obligatoria = fechaCaducidadFromCaducidadCodigo(
      cadOpt?.codigo || caducidadCodigoFromPayload(data.fecha_caducidad_obligatoria)
    );
    setF((p) => ({
      ...p,
      nombre: data.nombre ?? '',
      codigo: data.codigo ?? '',
      etiqueta: data.etiqueta ?? '',
      descripcion: data.descripcion ?? '',
      url_publica: data.url_publica ?? '',
      nota_privada: data.nota_privada ?? '',
      estado: data.estado !== false,
      id_estado_venta: data.id_estado_venta ?? '',
      estado_venta: data.estado_venta ?? 0,
      id_estado_compra: data.id_estado_compra ?? '',
      estado_compra: data.estado_compra ?? 0,
      usar_lote_serie,
      usar_lote,
      usar_serie,
      fecha_caducidad_obligatoria,
      naturaleza_producto: data.naturaleza_producto ?? '',
      id_naturaleza_item: data.id_naturaleza_item ?? '',
      id_tipo_control_inventario: idInv,
      id_tipo_control_caducidad: idCad,
    }));
  }, [
    data.nombre,
    data.codigo,
    data.etiqueta,
    data.descripcion,
    data.url_publica,
    data.nota_privada,
    data.estado,
    data.id_estado_venta,
    data.estado_venta,
    data.id_estado_compra,
    data.estado_compra,
    data.usar_lote_serie,
    data.fecha_caducidad_obligatoria,
    data.naturaleza_producto,
    data.id_naturaleza_item,
    data.id_tipo_control_inventario,
    data.id_tipo_control_caducidad,
    tiposControlInventarioItem,
    tiposControlCaducidadItem,
  ]);

  // Cargar catálogo Estado venta desde Gateway -> ItemNestJs (solo lectura)
  useEffect(() => {
    let cancelled = false;
    setLoadingEstadosVenta(true);
    listarEstadosVentaItem()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        const normalized = arr.map((item) => ({
          id_estado_venta: String(item?.id_estado_venta ?? item?.idEstadoVenta ?? ''),
          nombre: String(item?.nombre ?? item?.name ?? ''),
        }));
        setEstadosVentaItem(normalized);
      })
      .catch(() => {
        if (!cancelled) setEstadosVentaItem([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingEstadosVenta(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Cargar catálogo Estado compra desde Gateway -> ItemNestJs (solo lectura)
  useEffect(() => {
    let cancelled = false;
    setLoadingEstadosCompra(true);
    listarEstadosCompraItem()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        const normalized = arr.map((item) => ({
          id_estado_compra: String(item?.id_estado_compra ?? item?.idEstadoCompra ?? ''),
          nombre: String(item?.nombre ?? item?.name ?? ''),
        }));
        setEstadosCompraItem(normalized);
      })
      .catch(() => {
        if (!cancelled) setEstadosCompraItem([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingEstadosCompra(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Catálogo Naturaleza desde Gateway -> ItemNestJs (solo lectura)
  useEffect(() => {
    let cancelled = false;
    setLoadingNaturalezasItem(true);
    listarNaturalezasItem()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        const normalized = arr.map((item) => ({
          id_naturaleza_item: String(item?.id_naturaleza_item ?? item?.idNaturalezaItem ?? ''),
          nombre: String(item?.nombre ?? item?.name ?? ''),
        }));
        setNaturalezasItem(normalized);
      })
      .catch(() => {
        if (!cancelled) setNaturalezasItem([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingNaturalezasItem(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Catálogos control inventario + fechas: desde padre (prefetch) o misma lógica que naturaleza vía API
  useEffect(() => {
    if (catalogosControlProveidos !== undefined) {
      if (catalogosControlProveidos === null) {
        setLoadingTiposControlInventario(true);
        setLoadingTiposControlCaducidad(true);
        return;
      }
      setTiposControlInventarioItem(catalogosControlProveidos.inventario);
      setTiposControlCaducidadItem(catalogosControlProveidos.caducidad);
      setLoadingTiposControlInventario(false);
      setLoadingTiposControlCaducidad(false);
      return;
    }

    let cancelled = false;
    setLoadingTiposControlInventario(true);
    setLoadingTiposControlCaducidad(true);
    Promise.all([listarTiposControlInventarioItem(), listarTiposControlCaducidadItem()])
      .then(([invList, cadList]) => {
        if (cancelled) return;
        const arrI = Array.isArray(invList) ? invList : [];
        const arrC = Array.isArray(cadList) ? cadList : [];
        setTiposControlInventarioItem(
          arrI.map((item) => ({
            id_tipo_control_inventario_item: String(
              item?.id_tipo_control_inventario_item ??
                item?.id_tipo_control_inventario ??
                item?.idTipoControlInventarioItem ??
                ''
            ),
            codigo: String(item?.codigo ?? ''),
            nombre: String(item?.nombre ?? item?.name ?? ''),
          }))
        );
        setTiposControlCaducidadItem(
          arrC.map((item) => ({
            id_tipo_control_caducidad_item: String(
              item?.id_tipo_control_caducidad_item ??
                item?.id_tipo_control_caducidad ??
                item?.idTipoControlCaducidadItem ??
                ''
            ),
            codigo: String(item?.codigo ?? ''),
            nombre: String(item?.nombre ?? item?.name ?? ''),
          }))
        );
      })
      .catch(() => {
        if (!cancelled) {
          setTiposControlInventarioItem([]);
          setTiposControlCaducidadItem([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingTiposControlInventario(false);
          setLoadingTiposControlCaducidad(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [catalogosControlProveidos]);

  const mapRowsEtiquetaApi = useCallback((rows: unknown[]) => {
    if (!Array.isArray(rows)) return [];
    return rows.map((r: any) => {
      const ref = String(r?.ref ?? '');
      const nombreRaw = r?.nombre != null && String(r.nombre).trim() !== '' ? String(r.nombre) : '';
      const nombre = nombreRaw || ref;
      const id = String(r?.id_etiqueta_categoria ?? r?.idEtiquetaCategoria ?? '').trim();
      const idEmpresaRow = String(r?.id_empresa ?? r?.idEmpresa ?? '').trim();
      const est = r?.estado;
      const estado = est === true || est === false ? Boolean(est) : true;
      return {
        id,
        id_empresa: idEmpresaRow,
        ref,
        nombre,
        descripcion:
          r?.descripcion != null && String(r.descripcion).trim() !== ''
            ? String(r.descripcion)
            : '',
        color: String(r?.color ?? '#0d6efd'),
        posicion: typeof r?.posicion === 'number' ? r.posicion : Number(r?.posicion) || 0,
        estado,
      };
    });
  }, []);

  useEffect(() => {
    if (!labelsModalOpen) return;
    const idE = idEmpresaEtiquetas;
    const idT = idTipoItemEtiquetas;
    if (!idE || !idT) {
      setLabelsList([]);
      setLabelsLoading(false);
      return;
    }
    let cancelled = false;
    setLabelsLoading(true);
    listarEtiquetasCategoria(idE, idT, { incluirSinTipoItem: true })
      .then((raw: unknown) => {
        if (cancelled) return;
        setLabelsList(mapRowsEtiquetaApi(normalizarListaEtiquetasApi(raw)));
      })
      .catch(() => {
        if (!cancelled) setLabelsList([]);
      })
      .finally(() => {
        if (!cancelled) setLabelsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [labelsModalOpen, idEmpresaEtiquetas, idTipoItemEtiquetas, mapRowsEtiquetaApi]);

  useEffect(() => {
    if (!labelsOk) return;
    const t = window.setTimeout(() => setLabelsOk(null), 5000);
    return () => window.clearTimeout(t);
  }, [labelsOk]);

  useEffect(() => {
    if (!labelsInfo) return;
    const t = window.setTimeout(() => setLabelsInfo(null), 6000);
    return () => window.clearTimeout(t);
  }, [labelsInfo]);

  const etiquetasListadoFiltrado = useMemo(() => {
    const q = labelsBusqueda.trim().toLowerCase();
    if (!q) return labelsList;
    return labelsList.filter(
      (l) =>
        (l.ref && l.ref.toLowerCase().includes(q)) || (l.nombre && l.nombre.toLowerCase().includes(q))
    );
  }, [labelsList, labelsBusqueda]);

  const handleOpenLabels = useCallback(() => {
    setLabelsView('list');
    setLabelsOk(null);
    setLabelsErr(null);
    setLabelsInfo(null);
    setLabelsFieldErrors({});
    setLabelsBusqueda('');
    setEditingLabelId(null);
    setLabelEstadoSavingId(null);
    setLabelsModalOpen(true);
  }, []);

  const handleCloseLabels = useCallback(() => {
    setLabelsModalOpen(false);
    setLabelsView('list');
    setLabelsOk(null);
    setLabelsErr(null);
    setLabelsInfo(null);
    setLabelsFieldErrors({});
    setLabelsBusqueda('');
    setEditingLabelId(null);
    setLabelEstadoSavingId(null);
    setNewLabel({ ref: '', nombre: '', descripcion: '', color: '#0d6efd', posicion: 1, estado: true });
  }, []);

  const handleToggleEtiquetaEstado = useCallback(
    async (id: string, estadoActual: boolean, idEmpresaDeFila?: string) => {
      if (!id || labelEstadoSavingId) return;
      const idE = idEmpresaEtiquetas;
      const idEmpresaPayload = (idEmpresaDeFila && String(idEmpresaDeFila).trim()) || idE;
      if (!idEmpresaPayload) {
        setLabelsErr('Debe indicar una empresa (pestaña Empresa) o iniciar sesión con una empresa asignada.');
        return;
      }
      if (!idTipoItemEtiquetas) {
        setLabelsErr('Falta el tipo de ítem (PRODUCT) en el formulario para gestionar el catálogo.');
        return;
      }
      const siguiente = !estadoActual;
      setLabelsErr(null);
      setLabelEstadoSavingId(id);
      setLabelsList((prev) => prev.map((row) => (row.id === id ? { ...row, estado: siguiente } : row)));
      try {
        const res = await cambiarEstadoEtiquetaCategoria(id, {
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
        try {
          const raw = await listarEtiquetasCategoria(idEmpresaPayload, idTipoItemEtiquetas, {
            incluirSinTipoItem: true,
          });
          setLabelsList(mapRowsEtiquetaApi(normalizarListaEtiquetasApi(raw)));
        } catch (refreshErr) {
          console.error('El estado se guardó pero falló al refrescar el listado:', refreshErr);
          setLabelsInfo(
            'El estado se actualizó; si el listado no coincide, cierre y vuelva a abrir el modal.'
          );
        }
      } catch (e) {
        console.error('Error al cambiar estado de etiqueta/categoría:', e);
        setLabelsList((prev) => prev.map((row) => (row.id === id ? { ...row, estado: estadoActual } : row)));
        setLabelsErr(mensajeErrorEtiquetaApi(e));
      } finally {
        setLabelEstadoSavingId(null);
      }
    },
    [idEmpresaEtiquetas, idTipoItemEtiquetas, labelEstadoSavingId, mapRowsEtiquetaApi]
  );

  const handleStartCreateLabel = useCallback(() => {
    setNewLabel({
      ref: '',
      nombre: '',
      descripcion: '',
      color: '#0d6efd',
      posicion: labelsList.length + 1,
      estado: true,
    });
    setLabelsOk(null);
    setLabelsErr(null);
    setLabelsInfo(null);
    setLabelsFieldErrors({});
    setEditingLabelId(null);
    setLabelsView('create');
  }, [labelsList.length]);

  const handleStartEditLabel = useCallback(
    (row: {
      id: string;
      id_empresa?: string;
      ref: string;
      nombre: string;
      descripcion: string;
      color: string;
      posicion: number;
      estado: boolean;
    }) => {
      if (row.estado === false) return;
      setLabelsOk(null);
      setLabelsErr(null);
      setLabelsInfo(null);
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
    },
    []
  );

  const handleCancelCreateLabel = useCallback(() => {
    setLabelsView('list');
    setLabelsOk(null);
    setLabelsErr(null);
    setLabelsFieldErrors({});
    setEditingLabelId(null);
  }, []);

  const handleGuardarEdicionVisual = useCallback(async () => {
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
      setLabelsErr('Debe indicar una empresa (pestaña Empresa) o iniciar sesión con una empresa asignada.');
      return;
    }
    if (!idTipoItemEtiquetas) {
      setLabelsErr('Debe resolverse el tipo de ítem (PRODUCT) en la pestaña Empresa antes de editar etiquetas.');
      return;
    }

    const descripcion = (newLabel.descripcion || '').trim();
    const nombreTrim = (newLabel.nombre || '').trim();
    const nombre = nombreTrim || ref;

    setLabelsSaving(true);
    setLabelsErr(null);
    setLabelsOk(null);
    setLabelsInfo(null);
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
      const raw = await listarEtiquetasCategoria(idE, idTipoItemEtiquetas, {
        incluirSinTipoItem: true,
      });
      const listActualizado = mapRowsEtiquetaApi(normalizarListaEtiquetasApi(raw));
      setLabelsList(listActualizado);
      setLabelsView('list');
      setEditingLabelId(null);
      setLabelsFieldErrors({});
      setLabelsOk('Los cambios se han realizado de manera exitosa.');
    } catch (e) {
      console.error('Error al actualizar etiqueta/categoría:', e);
      setLabelsErr(mensajeErrorEtiquetaApi(e));
    } finally {
      setLabelsSaving(false);
    }
  }, [newLabel, editingLabelId, idEmpresaEtiquetas, idTipoItemEtiquetas, mapRowsEtiquetaApi]);

  const handleCreateLabel = useCallback(async () => {
    const ref = (newLabel.ref || '').trim();
    const idE = idEmpresaEtiquetas;
    const idT = idTipoItemEtiquetas;

    const nextField: { ref?: string; posicion?: string } = {};
    if (!ref) nextField.ref = 'La referencia es obligatoria';
    const posNum = Number(newLabel.posicion);
    if (!Number.isFinite(posNum) || posNum < 0) {
      nextField.posicion = 'Indique una posición válida (número ≥ 0)';
    }
    setLabelsFieldErrors(nextField);
    if (!ref || nextField.posicion) {
      setLabelsErr('Revise los campos marcados.');
      return;
    }
    if (!idE) {
      setLabelsErr('Debe indicar una empresa (pestaña Empresa) o iniciar sesión con una empresa asignada.');
      return;
    }
    if (!idT) {
      setLabelsErr('Debe resolverse el tipo de ítem (PRODUCT) en la pestaña Empresa antes de crear etiquetas.');
      return;
    }

    const descripcion = (newLabel.descripcion || '').trim();
    const nombreTrim = (newLabel.nombre || '').trim();
    const nombre = nombreTrim || ref;
    setLabelsSaving(true);
    setLabelsErr(null);
    setLabelsOk(null);
    try {
      const res = await crearEtiquetaCategoria({
        id_empresa: idE,
        id_tipo_item: idT,
        ref,
        nombre,
        descripcion: descripcion || null,
        color: normalizeHexColor(newLabel.color) ?? '#0d6efd',
        posicion: posNum,
        estado: newLabel.estado !== false,
      });
      if (res && typeof res === 'object' && (res as { success?: boolean }).success === false) {
        throw new Error(typeof (res as { error?: string }).error === 'string' ? (res as { error: string }).error : 'Respuesta rechazada');
      }
      const raw = await listarEtiquetasCategoria(idE, idT, { incluirSinTipoItem: true });
      const listActualizado = mapRowsEtiquetaApi(normalizarListaEtiquetasApi(raw));
      setLabelsList(listActualizado);
      setLabelsView('create');
      setLabelsErr(null);
      setEditingLabelId(null);
      setLabelsFieldErrors({});
      setNewLabel({
        ref: '',
        nombre: '',
        descripcion: '',
        color: '#0d6efd',
        posicion: listActualizado.length + 1,
        estado: true,
      });
      setLabelsOk('La etiqueta/categoría fue creada exitosamente.');
    } catch (e) {
      console.error('Error al crear etiqueta/categoría:', e);
      setLabelsErr(mensajeErrorEtiquetaApi(e));
    } finally {
      setLabelsSaving(false);
    }
  }, [newLabel, idEmpresaEtiquetas, idTipoItemEtiquetas, mapRowsEtiquetaApi]);

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
    setNewLabel((p) => ({ ...p, [name]: v } as any));
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

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, type } = e.target;
      const value =
        type === 'checkbox' ? e.target.checked : type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value;
      const u = { ...f, [name]: value };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  const onControlInventarioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      const opt = tiposControlInventarioItem.find((o) => o.id_tipo_control_inventario_item === id);
      const codigo = opt?.codigo || '';
      const { usar_lote_serie, usar_lote, usar_serie } = flagsFromInventarioCodigo(codigo || 'SIN_CONTROL');
      setF((prev) => ({ ...prev, id_tipo_control_inventario: id, usar_lote_serie, usar_lote, usar_serie }));
      onChange({ ...data, id_tipo_control_inventario: id, usar_lote_serie });
    },
    [data, onChange, tiposControlInventarioItem]
  );

  const onControlFechasChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      const opt = tiposControlCaducidadItem.find((o) => o.id_tipo_control_caducidad_item === id);
      const codigo = opt?.codigo || '';
      const fecha_caducidad_obligatoria = fechaCaducidadFromCaducidadCodigo(codigo || 'NINGUNA');
      setF((prev) => ({ ...prev, id_tipo_control_caducidad: id, fecha_caducidad_obligatoria }));
      onChange({ ...data, id_tipo_control_caducidad: id, fecha_caducidad_obligatoria });
    },
    [data, onChange, tiposControlCaducidadItem]
  );

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            <i className="fas fa-id-card text-primary me-2" />
            Datos generales
          </h5>
          {tipoItem === 'producto' && (
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              <FormGroup className="mb-0">
                <div className="form-check form-switch">
                  <Input
                    id="estado"
                    name="estado"
                    type="checkbox"
                    className="form-check-input"
                    checked={f.estado}
                    onChange={chg}
                  />
                  <Label for="estado" className="form-check-label ms-2">
                    Activo
                  </Label>
                </div>
              </FormGroup>
              <Button color="secondary" outline size="sm" onClick={handleOpenLabels}>
                Etiquetas / Categorías
              </Button>
            </div>
          )}
        </div>
        {empresaSlot}
        {/* Primera fila: Nombre | Código / Referencia */}
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="nombre">
                Nombre <span className="text-danger">*</span>
              </Label>
              <Input
                id="nombre"
                name="nombre"
                value={f.nombre}
                onChange={chg}
                placeholder={tipoItem === 'producto' ? 'Nombre del producto' : 'Nombre del servicio'}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="codigo">Código / Referencia</Label>
              <Input
                id="codigo"
                name="codigo"
                value={f.codigo}
                onChange={chg}
                placeholder="Código interno"
              />
            </FormGroup>
          </Col>
        </Row>
        {/* Segunda fila: Etiqueta (opcional) | Naturaleza producto */}
        <Row>
          {!ocultarCampoEtiquetaListados && (
            <Col md={6}>
              <FormGroup>
                <Label for="etiqueta">Etiqueta</Label>
                <Input
                  id="etiqueta"
                  name="etiqueta"
                  value={f.etiqueta}
                  onChange={chg}
                  placeholder="Etiqueta para listados"
                />
              </FormGroup>
            </Col>
          )}
          <Col md={ocultarCampoEtiquetaListados ? 12 : 6}>
            <FormGroup>
              <Label for="id_naturaleza_item">
                Naturaleza producto {mostrarAsteriscosObligatorios && <span className="text-danger">*</span>}
              </Label>
              <Input
                id="id_naturaleza_item"
                name="id_naturaleza_item"
                type="select"
                value={f.id_naturaleza_item}
                onChange={chg}
                disabled={tipoItem !== 'producto' || loadingNaturalezasItem}
              >
                <option value="">Seleccionar</option>
                {(naturalezasItem || []).map((opt, idx) => (
                  <option
                    key={opt.id_naturaleza_item || `nat-${idx}`}
                    value={opt.id_naturaleza_item || ''}
                  >
                    {opt.nombre || ''}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        {/* Multiselect Etiquetas/Categorías (solo producto): catálogo real GET /api/item/etiqueta-categoria; selección no va al payload del ítem en esta fase. */}
        {tipoItem === 'producto' && (
          <Row>
            <Col md={12}>
              {showEtiquetasCategoriasInfo && (
                <Alert color="success" className="py-2 px-3 small mb-2" role="status">
                  {TEXTO_INFO_ETIQUETAS_FORMULARIO}
                </Alert>
              )}
              <FormGroup>
                <Label for="etiquetas_categorias_visual">Etiquetas / Categorías</Label>
                <Select<EtiquetaCategoriaComboOption, true>
                  inputId="etiquetas_categorias_visual"
                  instanceId="etiquetas_categorias_visual"
                  isMulti
                  options={etiquetasComboOpciones}
                  value={selEtiquetasCategoriasVisual}
                  onChange={(opts) => setSelEtiquetasCategoriasVisual(opts ?? [])}
                  placeholder={
                    !idEmpresaEtiquetas
                      ? 'Seleccione empresa en la pestaña Empresa para cargar el catálogo'
                      : !idTipoItemEtiquetas
                        ? 'Espere el tipo de ítem PRODUCT (pestaña Empresa)…'
                        : etiquetasComboLoading
                          ? 'Cargando catálogo…'
                          : 'Seleccionar una o varias'
                  }
                  styles={estilosEtiquetasCategoriasVisual}
                  classNamePrefix="etq-cat-visual"
                  isClearable
                  isLoading={etiquetasComboLoading}
                  isDisabled={!idEmpresaEtiquetas || !idTipoItemEtiquetas}
                  closeMenuOnSelect={false}
                  onFocus={() => setEtiquetasCatSelectFocused(true)}
                  onBlur={() => setEtiquetasCatSelectFocused(false)}
                  onMenuOpen={() => setEtiquetasCatMenuOpen(true)}
                  onMenuClose={() => setEtiquetasCatMenuOpen(false)}
                  aria-label="Etiquetas o categorías del producto (selección múltiple, catálogo por empresa)"
                />
                {!idEmpresaEtiquetas ? (
                  <FormText color="muted" className="mb-0">
                    Indique empresa en <strong>Empresa</strong> o use sesión con empresa asignada para ver las
                    etiquetas disponibles.
                  </FormText>
                ) : !idTipoItemEtiquetas ? (
                  <FormText color="muted" className="mb-0">
                    El catálogo de etiquetas se filtra por empresa y por tipo de ítem <strong>PRODUCT</strong> (UUID en{' '}
                    <strong>tipo_item_catalogo</strong>).
                  </FormText>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        )}
        {/* Tercera fila: Estado compra | Estado venta */}
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="id_estado_compra">Estado compra</Label>
              <Input
                id="id_estado_compra"
                name="id_estado_compra"
                type="select"
                value={f.id_estado_compra ?? ''}
                onChange={chg}
                disabled={loadingEstadosCompra}
              >
                <option value="">Seleccionar</option>
                {(estadosCompraItem || []).map((opt, idx) => (
                  <option key={opt.id_estado_compra || `ec-${idx}`} value={opt.id_estado_compra || ''}>
                    {opt.nombre || ''}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="id_estado_venta">
                Estado venta {mostrarAsteriscosObligatorios && <span className="text-danger">*</span>}
              </Label>
              <Input
                id="id_estado_venta"
                name="id_estado_venta"
                type="select"
                value={f.id_estado_venta ?? ''}
                onChange={chg}
                disabled={loadingEstadosVenta}
              >
                <option value="">Seleccionar</option>
                {(estadosVentaItem || []).map((opt, idx) => (
                  <option key={opt.id_estado_venta || `ev-${idx}`} value={opt.id_estado_venta || ''}>
                    {opt.nombre || ''}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        {/* Cuarta fila: Activo solo servicio; control inventario + control fechas (misma fila, solo producto) */}
        <Row className="mb-3">
          {tipoItem !== 'producto' && (
            <Col md={6}>
              <FormGroup>
                <div className="form-check form-switch">
                  <Input
                    id="estado"
                    name="estado"
                    type="checkbox"
                    className="form-check-input"
                    checked={f.estado}
                    onChange={chg}
                  />
                  <Label for="estado" className="form-check-label ms-2">
                    Activo
                  </Label>
                </div>
              </FormGroup>
            </Col>
          )}
          {tipoItem === 'producto' && (
            <Col md={6}>
              <FormGroup>
                <Label for="control_inventario">Control de inventario</Label>
                {uiRules?.inventarioRelevante && <span className="text-danger ms-1">*</span>}
                <Input
                  id="control_inventario"
                  name="control_inventario"
                  type="select"
                  value={f.id_tipo_control_inventario || ''}
                  onChange={onControlInventarioChange}
                  disabled={loadingTiposControlInventario}
                >
                  <option value="">Seleccionar</option>
                  {(tiposControlInventarioItem || []).map((opt, idx) => (
                    <option
                      key={opt.id_tipo_control_inventario_item || `inv-${idx}`}
                      value={opt.id_tipo_control_inventario_item || ''}
                    >
                      {opt.nombre || opt.codigo || ''}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          )}
          {tipoItem === 'producto' && (
            <Col md={6}>
              <FormGroup>
                <Label for="control_fechas">Control de fechas</Label>
                {uiRules?.caducidadRelevante && <span className="text-danger ms-1">*</span>}
                <Input
                  id="control_fechas"
                  name="control_fechas"
                  type="select"
                  value={f.id_tipo_control_caducidad || ''}
                  onChange={onControlFechasChange}
                  disabled={loadingTiposControlCaducidad}
                >
                  <option value="">Seleccionar</option>
                  {(tiposControlCaducidadItem || []).map((opt, idx) => (
                    <option
                      key={opt.id_tipo_control_caducidad_item || `cad-${idx}`}
                      value={opt.id_tipo_control_caducidad_item || ''}
                    >
                      {opt.nombre || opt.codigo || ''}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          )}
        </Row>
        {/* Quinta fila y siguientes: Descripción, Nota privada, URL pública */}
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                name="descripcion"
                type="textarea"
                rows={3}
                value={f.descripcion}
                onChange={chg}
                placeholder="Descripción breve del producto"
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
                value={f.nota_privada}
                onChange={chg}
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
                value={f.url_publica}
                onChange={chg}
                placeholder="https://..."
              />
            </FormGroup>
          </Col>
        </Row>

        {/* Etiquetas/Categorías: catálogo comercial (Gateway → ItemPython → item_etiqueta_categoria) */}
        <Modal
          isOpen={labelsModalOpen}
          toggle={handleCloseLabels}
          size="lg"
          style={{ zIndex: 9999 }}
          backdrop="static"
          keyboard={false}
          centered
          contentClassName="modal-etiquetas-categoria-scope bg-white shadow"
        >
          <ModalHeader toggle={handleCloseLabels} className="modal-etiquetas-header border-0">
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
                  <Alert color="success" className="py-2 px-3 small mb-2">
                    {labelsOk}
                  </Alert>
                )}
                {labelsErr && (
                  <Alert color="danger" className="py-2 px-3 small mb-2">
                    {labelsErr}
                  </Alert>
                )}
                {labelsInfo && (
                  <Alert color="info" className="py-2 px-3 small mb-2">
                    {labelsInfo}
                  </Alert>
                )}
                {!idEmpresaEtiquetas && (
                  <Alert color="warning" className="mb-3">
                    Seleccione una empresa en la pestaña <b>Empresa</b> o use una sesión con empresa asignada para cargar y
                    crear etiquetas.
                  </Alert>
                )}
                {idEmpresaEtiquetas && !idTipoItemEtiquetas && (
                  <Alert color="warning" className="mb-3">
                    Espere a que se cargue el tipo de ítem <b>PRODUCT</b> en la pestaña <b>Empresa</b> (catálogo{' '}
                    <b>tipo_item_catalogo</b>) para listar y crear etiquetas de producto.
                  </Alert>
                )}
                <p className="text-muted small mb-2 etiquetas-lista-ayuda">
                  Catálogo de clasificación comercial para productos (empresa + tipo PRODUCT). Estilo de acciones alineado con
                  la lista de terceros.
                </p>
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
                    <Label for="etiquetas_modal_busqueda" className="small text-muted mb-1">
                      Buscar
                    </Label>
                    <Input
                      id="etiquetas_modal_busqueda"
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
                                    id={`etq-estado-${l.id || String(idx)}`}
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
                {labelsView === 'create' && labelsOk && (
                  <Alert color="success" className="py-2 px-3 small mb-2">
                    {labelsOk}
                  </Alert>
                )}
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
                      <Label for="lbl_ref">
                        Ref. <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="lbl_ref"
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
                      <Label for="lbl_nombre">Nombre</Label>
                      <Input
                        id="lbl_nombre"
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
                      <Label for="lbl_descripcion">Descripción</Label>
                      <Input
                        id="lbl_descripcion"
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
                      <Label for="lbl_color_hex">Color</Label>
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
                            id="lbl_color_hex"
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
                          <Label className="small text-muted d-block mb-1" for="lbl_color_native">
                            Selector
                          </Label>
                          <Input
                            id="lbl_color_native"
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
                      <Label for="lbl_posicion">Posición</Label>
                      <Input
                        id="lbl_posicion"
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
                          id="lbl_estado"
                          name="estado"
                          type="checkbox"
                          className="form-check-input"
                          checked={newLabel.estado}
                          onChange={chgNewLabel}
                        />
                        <Label for="lbl_estado" className="form-check-label ms-2">
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
                <Button color="secondary" outline className="me-2" onClick={handleCancelCreateLabel}>
                  Anular
                </Button>
                <Button color="primary" onClick={handleCreateLabel} disabled={labelsLoading || labelsSaving}>
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
                <Button color="secondary" outline className="me-2" onClick={handleCancelCreateLabel}>
                  Volver al listado
                </Button>
                <Button color="primary" onClick={handleGuardarEdicionVisual} disabled={labelsLoading || labelsSaving}>
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
              <Button color="secondary" outline onClick={handleCloseLabels}>
                Cerrar
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default SeccionItemGeneral;
