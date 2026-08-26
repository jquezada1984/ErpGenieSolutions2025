import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SearchableSelect from '../../../components/SearchableSelect';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { crearCambioMasivoStock } from '../../../_apis_/almacen';
import '../ConfiguracionItem.scss';

const GET_EMPRESAS = gql`
  query GetEmpresasStockCambioMasivo {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ALMACENES_LISTADO = gql`
  query AlmacenesListadoStockCambioMasivo($id_empresa: ID!) {
    almacenesListado(id_empresa: $id_empresa) {
      id_almacen
      almacen_ref
      nombre
      estado
    }
  }
`;

const ITEMS_LISTADO_PRODUCTO = gql`
  query GetItemsProductoStockCambioMasivo($id_empresa: ID, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      producto_ref
      etiqueta
      estado
    }
  }
`;

type AlmacenCatalogoRow = {
  id_almacen: string;
  almacen_ref?: string | null;
  nombre?: string | null;
  estado?: boolean | null;
};

type ItemCatalogoRow = {
  id_item: string;
  producto_ref?: string | null;
  etiqueta?: string | null;
  estado?: boolean | null;
};

type DetalleFila = {
  key: string;
  id_item: string;
  tipo_ajuste: string;
  cantidad: string;
};

type ApiError = Error & {
  status?: number;
  data?: {
    error?: string;
    message?: string;
    detail?: string;
    errors?: Record<string, string[] | string>;
  };
};

const nuevaClaveOrigen = () => crypto.randomUUID();
const nuevaFilaKey = () => crypto.randomUUID();

const filaVacia = (): DetalleFila => ({
  key: nuevaFilaKey(),
  id_item: '',
  tipo_ajuste: 'POSITIVO',
  cantidad: '',
});

const cantidadValida = (valor: string): boolean => {
  if (!/^\d+(\.\d{1,2})?$/.test(valor)) return false;
  return !/^0+(\.0+)?$/.test(valor);
};

const CambioMasivoStockAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const jwtPayload = useJwtPayload();
  const scope = jwtPayload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = jwtPayload?.id_empresa || '';

  const [idEmpresa, setIdEmpresa] = useState('');
  const [idAlmacen, setIdAlmacen] = useState('');
  const [fechaMovimiento, setFechaMovimiento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [concepto, setConcepto] = useState('');
  const [detalles, setDetalles] = useState<DetalleFila[]>([filaVacia()]);
  const [idOrigen, setIdOrigen] = useState(nuevaClaveOrigen);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const submitLockRef = useRef(false);

  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];
  const idEmpresaActiva = scope === 'GLOBAL' ? idEmpresa : idEmpresaUsuario || idEmpresa;

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario && !idEmpresa) {
      setIdEmpresa(idEmpresaUsuario);
    }
  }, [scope, idEmpresaUsuario, idEmpresa]);

  const {
    data: almacenesData,
    loading: loadingAlmacenes,
    error: errorAlmacenes,
  } = useQuery(ALMACENES_LISTADO, {
    variables: { id_empresa: idEmpresaActiva || null },
    skip: !idEmpresaActiva,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const almacenes = (almacenesData?.almacenesListado || []) as AlmacenCatalogoRow[];

  const {
    data: itemsData,
    loading: loadingItems,
    error: errorItems,
  } = useQuery(ITEMS_LISTADO_PRODUCTO, {
    variables: {
      id_empresa: idEmpresaActiva || null,
      codigo_tipo_item: 'PRODUCT',
    },
    skip: !idEmpresaActiva,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const opcionesProductoBase = useMemo(() => {
    const list = (itemsData?.itemsListado || []) as ItemCatalogoRow[];
    return list
      .filter((item) => item.estado !== false)
      .map((item) => {
        const referenciaItem = String(item.producto_ref ?? '').trim();
        const etiqueta = String(item.etiqueta ?? '').trim();
        return {
          value: String(item.id_item),
          label:
            referenciaItem && etiqueta
              ? `${referenciaItem} - ${etiqueta}`
              : etiqueta || referenciaItem || 'Sin etiqueta',
        };
      });
  }, [itemsData?.itemsListado]);

  const opcionesProductoParaFila = (filaKey: string, idItemActual: string) => {
    const seleccionados = new Set(
      detalles
        .filter((d) => d.key !== filaKey && d.id_item)
        .map((d) => d.id_item),
    );
    return opcionesProductoBase.filter(
      (opt) => !seleccionados.has(opt.value) || opt.value === idItemActual,
    );
  };

  const reiniciarTrasExito = () => {
    setDetalles([filaVacia()]);
    setFechaMovimiento('');
    setReferencia('');
    setConcepto('');
    setIdOrigen(nuevaClaveOrigen());
    setFieldErr({});
  };

  const alCambiarEmpresa = (value: string | null) => {
    setIdEmpresa(value ?? '');
    setIdAlmacen('');
    setDetalles([filaVacia()]);
    setFechaMovimiento('');
    setReferencia('');
    setConcepto('');
    setIdOrigen(nuevaClaveOrigen());
    setOk(null);
    setError(null);
    setFieldErr({});
  };

  const actualizarDetalle = (key: string, patch: Partial<DetalleFila>) => {
    setDetalles((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  };

  const agregarFila = () => {
    setDetalles((prev) => [...prev, filaVacia()]);
  };

  const quitarFila = (key: string) => {
    setDetalles((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.key !== key);
    });
  };

  const mensajeError = (err: ApiError) => {
    if (err.status === 400 && err.data?.errors && typeof err.data.errors === 'object') {
      const detalle = Object.entries(err.data.errors)
        .map(([campo, valor]) => `${campo}: ${Array.isArray(valor) ? valor.join(', ') : String(valor)}`)
        .join(' | ');
      if (detalle) return detalle;
    }
    if (err.status === 409) {
      if (typeof err.data?.detail === 'string' && err.data.detail) return err.data.detail;
      if (typeof err.data?.error === 'string' && err.data.error) return err.data.error;
      if (typeof err.data?.message === 'string' && err.data.message) return err.data.message;
    }
    if (typeof err.data?.error === 'string' && err.data.error) return err.data.error;
    if (typeof err.data?.detail === 'string' && err.data.detail) return err.data.detail;
    if (typeof err.data?.message === 'string' && err.data.message) return err.data.message;
    return err.message || 'No se pudo registrar el cambio masivo de stock.';
  };

  const guardar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitLockRef.current) return;

    setError(null);
    setOk(null);

    const nextErr: Record<string, string> = {};
    if (!idEmpresaActiva) nextErr.id_empresa = 'Debe seleccionar empresa.';
    if (!idAlmacen) nextErr.id_almacen = 'Debe seleccionar almacén.';
    if (!fechaMovimiento) nextErr.fecha_movimiento = 'La fecha es obligatoria.';

    const idsVistos = new Set<string>();
    let hayDetalleInvalido = false;
    detalles.forEach((detalle, index) => {
      const pref = `detalle_${index}`;
      const cantidadNormalizada = detalle.cantidad.trim();
      if (!detalle.id_item) {
        nextErr[`${pref}_id_item`] = 'Debe seleccionar producto.';
        hayDetalleInvalido = true;
      } else if (idsVistos.has(detalle.id_item)) {
        nextErr[`${pref}_id_item`] = 'Producto duplicado en el lote.';
        hayDetalleInvalido = true;
      } else {
        idsVistos.add(detalle.id_item);
      }
      if (detalle.tipo_ajuste !== 'POSITIVO' && detalle.tipo_ajuste !== 'NEGATIVO') {
        nextErr[`${pref}_tipo_ajuste`] = 'Debe seleccionar el tipo de ajuste.';
        hayDetalleInvalido = true;
      }
      if (!cantidadNormalizada) {
        nextErr[`${pref}_cantidad`] = 'La cantidad es obligatoria.';
        hayDetalleInvalido = true;
      } else if (!cantidadValida(cantidadNormalizada)) {
        nextErr[`${pref}_cantidad`] =
          'Ingrese una cantidad mayor a cero, con máximo dos decimales.';
        hayDetalleInvalido = true;
      }
    });

    if (detalles.length < 1 || hayDetalleInvalido) {
      nextErr.detalles = 'Revise las líneas del lote.';
    }

    setFieldErr(nextErr);
    if (Object.keys(nextErr).length > 0) {
      setError('Revise los campos obligatorios.');
      return;
    }

    submitLockRef.current = true;
    const body = {
      id_empresa: idEmpresaActiva,
      id_almacen: idAlmacen,
      id_origen: idOrigen,
      fecha_movimiento: fechaMovimiento,
      referencia: referencia.trim() || null,
      concepto: concepto.trim() || null,
      detalles: detalles.map((d) => ({
        id_item: d.id_item,
        tipo_ajuste: d.tipo_ajuste,
        cantidad: d.cantidad.trim(),
      })),
    };

    try {
      setLoadingGuardar(true);
      const result = await crearCambioMasivoStock(body);
      const response = result?.data;
      const estadoOperacion = response?.data?.estado_operacion;
      const message =
        (typeof response?.message === 'string' && response.message) ||
        (typeof response?.error === 'string' && response.error);

      if (response?.success !== true || (result.status !== 201 && result.status !== 200)) {
        setError(message || 'No se pudo registrar el cambio masivo de stock.');
        return;
      }

      if (result.status === 201 && estadoOperacion === 'CREADO') {
        setOk(message || 'Cambio masivo de stock registrado correctamente.');
        reiniciarTrasExito();
        return;
      }

      if (result.status === 200 && estadoOperacion === 'YA_PROCESADO') {
        setOk(message || 'Esta operación ya había sido procesada.');
        reiniciarTrasExito();
        return;
      }

      setError(message || 'Respuesta no esperada al registrar el cambio masivo de stock.');
    } catch (e: unknown) {
      setError(mensajeError(e as ApiError));
    } finally {
      submitLockRef.current = false;
      setLoadingGuardar(false);
    }
  };

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-layer-group text-primary me-2" />
              Cambio masivo de stock
            </CardTitle>
            <div>
              <Button
                color="secondary"
                outline
                className="me-2"
                onClick={() => navigate('/items/almacenes/stock-actual')}
              >
                Stock actual
              </Button>
              <Button
                color="primary"
                type="submit"
                form="form-stock-cambio-masivo"
                disabled={loadingGuardar}
              >
                {loadingGuardar ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Registrar cambio masivo'
                )}
              </Button>
            </div>
          </div>

          {ok && (
            <Alert color="success" toggle={() => setOk(null)}>
              {ok}
            </Alert>
          )}
          {error && (
            <Alert color="danger" toggle={() => setError(null)}>
              {error}
            </Alert>
          )}

          <p className="text-muted mb-3">
            Permite registrar varios ajustes de stock en una sola operación.
          </p>

          <form id="form-stock-cambio-masivo" onSubmit={guardar}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="mb-3">
                  <i className="fas fa-info-circle text-primary me-2" />
                  Datos de la operación
                </h5>

                <Row>
                  {scope === 'GLOBAL' && (
                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          Empresa <span className="text-danger">*</span>
                        </Label>
                        <SelectEmpresa
                          value={idEmpresa || null}
                          onChange={alCambiarEmpresa}
                          empresas={empresas}
                          isLoading={loadingEmpresas}
                          isDisabled={loadingEmpresas}
                          placeholder="Seleccionar empresa"
                        />
                        {fieldErr.id_empresa && (
                          <FormText color="danger">{fieldErr.id_empresa}</FormText>
                        )}
                      </FormGroup>
                    </Col>
                  )}

                  <Col md={6}>
                    <FormGroup>
                      <Label htmlFor="cambio_masivo_almacen">
                        Almacén <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="cambio_masivo_almacen"
                        type="select"
                        value={idAlmacen}
                        onChange={(event) => {
                          setIdAlmacen(event.target.value);
                          setFieldErr((previous) => ({ ...previous, id_almacen: '' }));
                        }}
                        disabled={!idEmpresaActiva || loadingAlmacenes || !!errorAlmacenes}
                      >
                        {!idEmpresaActiva ? (
                          <option value="">Seleccione empresa</option>
                        ) : loadingAlmacenes ? (
                          <option value="">Cargando...</option>
                        ) : errorAlmacenes ? (
                          <option value="">No se pudo cargar almacenes</option>
                        ) : (
                          <>
                            <option value="">Seleccionar almacén</option>
                            {almacenes
                              .filter((almacen) => almacen.estado !== false)
                              .map((almacen) => {
                                const ref = String(almacen.almacen_ref ?? '').trim();
                                const nombre = String(almacen.nombre ?? '').trim();
                                const label =
                                  ref && nombre
                                    ? `${ref} - ${nombre}`
                                    : nombre || ref || String(almacen.id_almacen);
                                return (
                                  <option key={almacen.id_almacen} value={almacen.id_almacen}>
                                    {label}
                                  </option>
                                );
                              })}
                          </>
                        )}
                      </Input>
                      {fieldErr.id_almacen && (
                        <FormText color="danger">{fieldErr.id_almacen}</FormText>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md={3}>
                    <FormGroup>
                      <Label htmlFor="cambio_masivo_fecha">
                        Fecha de movimiento <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="cambio_masivo_fecha"
                        type="date"
                        value={fechaMovimiento}
                        onChange={(event) => {
                          setFechaMovimiento(event.target.value);
                          setFieldErr((previous) => ({ ...previous, fecha_movimiento: '' }));
                        }}
                        invalid={Boolean(fieldErr.fecha_movimiento)}
                      />
                      {fieldErr.fecha_movimiento && (
                        <FormText color="danger">{fieldErr.fecha_movimiento}</FormText>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md={3}>
                    <FormGroup>
                      <Label htmlFor="cambio_masivo_referencia">Referencia</Label>
                      <Input
                        id="cambio_masivo_referencia"
                        value={referencia}
                        onChange={(event) => setReferencia(event.target.value)}
                        placeholder="Referencia opcional"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={12}>
                    <FormGroup className="mb-0">
                      <Label htmlFor="cambio_masivo_concepto">Concepto</Label>
                      <Input
                        id="cambio_masivo_concepto"
                        type="textarea"
                        rows={2}
                        value={concepto}
                        onChange={(event) => setConcepto(event.target.value)}
                        placeholder="Concepto opcional"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="mb-2">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <i className="fas fa-list text-primary me-2" />
                    Detalles del lote
                  </h5>
                  <Button
                    color="secondary"
                    outline
                    type="button"
                    size="sm"
                    onClick={agregarFila}
                    disabled={loadingGuardar}
                  >
                    + Agregar producto
                  </Button>
                </div>
                {fieldErr.detalles && (
                  <FormText color="danger" className="d-block mb-2">
                    {fieldErr.detalles}
                  </FormText>
                )}

                <div className="table-responsive">
                  <Table bordered size="sm" className="mb-0 align-middle">
                    <thead>
                      <tr>
                        <th style={{ minWidth: 240 }}>Producto</th>
                        <th style={{ minWidth: 160 }}>Tipo de ajuste</th>
                        <th style={{ minWidth: 110 }}>Cantidad</th>
                        <th style={{ width: 90 }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalles.map((detalle, index) => {
                        const pref = `detalle_${index}`;
                        return (
                          <tr key={detalle.key}>
                            <td>
                              <SearchableSelect
                                value={detalle.id_item || null}
                                onChange={(value) => {
                                  const next = Array.isArray(value)
                                    ? value[0] ?? ''
                                    : value ?? '';
                                  actualizarDetalle(detalle.key, { id_item: next });
                                  setFieldErr((previous) => ({
                                    ...previous,
                                    [`${pref}_id_item`]: '',
                                    detalles: '',
                                  }));
                                }}
                                options={opcionesProductoParaFila(
                                  detalle.key,
                                  detalle.id_item,
                                )}
                                isLoading={loadingItems}
                                isDisabled={
                                  !idEmpresaActiva || loadingItems || !!errorItems
                                }
                                placeholder={
                                  !idEmpresaActiva
                                    ? 'Seleccione empresa'
                                    : errorItems
                                      ? 'No se pudo cargar productos'
                                      : 'Buscar producto'
                                }
                              />
                              {fieldErr[`${pref}_id_item`] && (
                                <FormText color="danger">
                                  {fieldErr[`${pref}_id_item`]}
                                </FormText>
                              )}
                            </td>
                            <td>
                              <Input
                                type="select"
                                value={detalle.tipo_ajuste}
                                onChange={(event) => {
                                  actualizarDetalle(detalle.key, {
                                    tipo_ajuste: event.target.value,
                                  });
                                  setFieldErr((previous) => ({
                                    ...previous,
                                    [`${pref}_tipo_ajuste`]: '',
                                  }));
                                }}
                                invalid={Boolean(fieldErr[`${pref}_tipo_ajuste`])}
                              >
                                <option value="POSITIVO">Ajuste positivo</option>
                                <option value="NEGATIVO">Ajuste negativo</option>
                              </Input>
                              {fieldErr[`${pref}_tipo_ajuste`] && (
                                <FormText color="danger">
                                  {fieldErr[`${pref}_tipo_ajuste`]}
                                </FormText>
                              )}
                            </td>
                            <td>
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={detalle.cantidad}
                                onChange={(event) => {
                                  actualizarDetalle(detalle.key, {
                                    cantidad: event.target.value,
                                  });
                                  setFieldErr((previous) => ({
                                    ...previous,
                                    [`${pref}_cantidad`]: '',
                                  }));
                                }}
                                invalid={Boolean(fieldErr[`${pref}_cantidad`])}
                              />
                              {fieldErr[`${pref}_cantidad`] && (
                                <FormText color="danger">
                                  {fieldErr[`${pref}_cantidad`]}
                                </FormText>
                              )}
                            </td>
                            <td>
                              <Button
                                color="danger"
                                outline
                                size="sm"
                                type="button"
                                disabled={detalles.length <= 1 || loadingGuardar}
                                onClick={() => quitarFila(detalle.key)}
                              >
                                Quitar
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CambioMasivoStockAlmacen;
