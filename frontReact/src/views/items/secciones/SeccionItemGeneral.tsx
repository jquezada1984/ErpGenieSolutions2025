import React, { useEffect, useState, useCallback } from 'react';
import { Button, Card, CardBody, Row, Col, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import type { ItemFormValues } from '../schemas/itemSchema';
import {
  listarEstadosVentaItem,
  listarEstadosCompraItem,
  listarNaturalezasItem,
  listarTiposControlInventarioItem,
  listarTiposControlCaducidadItem,
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
  mostrarAsteriscosObligatorios?: boolean;
  isEdit?: boolean;
  uiRules?: {
    inventarioRelevante: boolean;
    caducidadRelevante: boolean;
  };
  /**
   * `null` = el padre está cargando (no duplicar fetch); objeto = usar esas listas.
   * `undefined` = este componente pide los catálogos (servicios / sin prefetch).
   */
  catalogosControlProveidos?: CatalogosControlProveidos | null;
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

const SeccionItemGeneral: React.FC<Props> = ({
  data,
  onChange,
  tipoItem,
  mostrarAsteriscosObligatorios = false,
  isEdit = false,
  uiRules,
  catalogosControlProveidos,
}) => {
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

  // Flujo visual (frontend) tipo Dolibarr para gestionar Etiquetas/Categorías (sin backend)
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  const [labelsView, setLabelsView] = useState<'list' | 'create'>('list');
  const [labelsList, setLabelsList] = useState<
    Array<{ ref: string; descripcion: string; color: string; posicion: number }>
  >([
    { ref: 'ETQ-001', descripcion: 'Ejemplo: Categoría general', color: '#0d6efd', posicion: 1 },
    { ref: 'ETQ-002', descripcion: 'Ejemplo: Promociones', color: '#198754', posicion: 2 },
  ]);
  const [newLabel, setNewLabel] = useState<{ ref: string; descripcion: string; color: string; posicion: number }>({
    ref: '',
    descripcion: '',
    color: '#0d6efd',
    posicion: 1,
  });

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

  const handleOpenLabels = useCallback(() => {
    setLabelsView('list');
    setLabelsModalOpen(true);
  }, []);

  const handleCloseLabels = useCallback(() => {
    setLabelsModalOpen(false);
    setLabelsView('list');
    setNewLabel({ ref: '', descripcion: '', color: '#0d6efd', posicion: 1 });
  }, []);

  const handleStartCreateLabel = useCallback(() => {
    setNewLabel({ ref: '', descripcion: '', color: '#0d6efd', posicion: labelsList.length + 1 });
    setLabelsView('create');
  }, [labelsList.length]);

  const handleCancelCreateLabel = useCallback(() => {
    setLabelsView('list');
  }, []);

  const handleCreateLabel = useCallback(() => {
    const ref = (newLabel.ref || '').trim();
    if (!ref) return;

    setLabelsList((p) => [
      ...p,
      {
        ref,
        descripcion: newLabel.descripcion || '',
        color: newLabel.color || '#0d6efd',
        posicion: Number(newLabel.posicion || 1),
      },
    ]);

    setLabelsView('list');
    setNewLabel({ ref: '', descripcion: '', color: '#0d6efd', posicion: labelsList.length + 2 });
  }, [newLabel, labelsList.length]);

  const chgNewLabel = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const v = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
    setNewLabel((p) => ({ ...p, [name]: v } as any));
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
                disabled={isEdit}
              />
            </FormGroup>
          </Col>
        </Row>
        {/* Segunda fila: Etiqueta | Naturaleza producto */}
        <Row>
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
          <Col md={6}>
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

        {/* Flujo visual (frontend) Etiquetas/Categorías tipo Dolibarr */}
        <Modal
          isOpen={labelsModalOpen}
          toggle={handleCloseLabels}
          size="lg"
          style={{ zIndex: 9999 }}
          backdrop="static"
          keyboard={false}
          centered
        >
          <ModalHeader toggle={handleCloseLabels}>
            {labelsView === 'create' ? 'CREAR ETIQUETA/CATEGORÍA' : 'Etiquetas/Categorías'}
          </ModalHeader>
          <ModalBody>
            {labelsView === 'list' && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="fw-semibold text-muted">ETIQUETAS/CATEGORÍAS (PRODUCTOS)</div>
                  </div>
                  <Button color="primary" size="sm" onClick={handleStartCreateLabel}>
                    + Nueva
                  </Button>
                </div>
                <table className="table table-bordered table-sm mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Ref.</th>
                      <th>Descripción</th>
                      <th style={{ width: '20%' }}>Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(labelsList || []).map((l, idx) => (
                      <tr key={`${l.ref || `l-${idx}`}`}>
                        <td>{l.ref}</td>
                        <td>{l.descripcion}</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 18,
                              height: 18,
                              borderRadius: 4,
                              backgroundColor: l.color,
                              border: '1px solid rgba(0,0,0,0.1)',
                              verticalAlign: 'middle',
                              marginRight: 8,
                            }}
                          />
                          {l.color}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {labelsView === 'create' && (
              <>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lbl_ref">Ref.</Label>
                      <Input
                        id="lbl_ref"
                        name="ref"
                        value={newLabel.ref}
                        onChange={chgNewLabel}
                        placeholder="ETQ-003"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lbl_color">Color</Label>
                      <Input id="lbl_color" name="color" type="color" value={newLabel.color} onChange={chgNewLabel} />
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
                        placeholder="Descripción para la etiqueta/categoría"
                      />
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
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {labelsView === 'create' ? (
              <>
                <Button color="primary" onClick={handleCreateLabel}>
                  Crear
                </Button>
                <Button color="secondary" outline onClick={handleCancelCreateLabel}>
                  Anular
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
