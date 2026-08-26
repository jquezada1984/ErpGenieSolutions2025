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
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SearchableSelect from '../../../components/SearchableSelect';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { crearSalidaStock } from '../../../_apis_/almacen';
import '../ConfiguracionItem.scss';

const GET_EMPRESAS = gql`
  query GetEmpresasStockSalida {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ALMACENES_LISTADO = gql`
  query AlmacenesListadoStockSalida($id_empresa: ID!) {
    almacenesListado(id_empresa: $id_empresa) {
      id_almacen
      almacen_ref
      nombre
      estado
    }
  }
`;

const ITEMS_LISTADO_PRODUCTO = gql`
  query GetItemsProductoStockSalida($id_empresa: ID, $codigo_tipo_item: String) {
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

const cantidadValida = (valor: string): boolean => {
  if (!/^\d+(\.\d{1,2})?$/.test(valor)) return false;
  return !/^0+(\.0+)?$/.test(valor);
};

const SalidaStockAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const jwtPayload = useJwtPayload();
  const scope = jwtPayload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = jwtPayload?.id_empresa || '';

  const [idEmpresa, setIdEmpresa] = useState('');
  const [idItem, setIdItem] = useState('');
  const [idAlmacen, setIdAlmacen] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fechaMovimiento, setFechaMovimiento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [concepto, setConcepto] = useState('');
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

  const opcionesProducto = useMemo(() => {
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

  const reiniciarIntencion = () => {
    setIdItem('');
    setIdAlmacen('');
    setCantidad('');
    setFechaMovimiento('');
    setReferencia('');
    setConcepto('');
    setIdOrigen(nuevaClaveOrigen());
    setFieldErr({});
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
    return err.message || 'No se pudo registrar la salida de stock.';
  };

  const guardar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitLockRef.current) return;

    setError(null);
    setOk(null);

    const nextErr: Record<string, string> = {};
    const cantidadNormalizada = cantidad.trim();
    if (!idEmpresaActiva) nextErr.id_empresa = 'Debe seleccionar empresa.';
    if (!idItem) nextErr.id_item = 'Debe seleccionar producto.';
    if (!idAlmacen) nextErr.id_almacen = 'Debe seleccionar almacén.';
    if (!cantidadNormalizada) {
      nextErr.cantidad = 'La cantidad es obligatoria.';
    } else if (!cantidadValida(cantidadNormalizada)) {
      nextErr.cantidad = 'Ingrese una cantidad mayor a cero, con máximo dos decimales.';
    }
    if (!fechaMovimiento) nextErr.fecha_movimiento = 'La fecha es obligatoria.';

    setFieldErr(nextErr);
    if (Object.keys(nextErr).length > 0) {
      setError('Revise los campos obligatorios.');
      return;
    }

    submitLockRef.current = true;
    const body = {
      id_empresa: idEmpresaActiva,
      id_item: idItem,
      id_almacen: idAlmacen,
      id_origen: idOrigen,
      cantidad: cantidadNormalizada,
      fecha_movimiento: fechaMovimiento,
      referencia: referencia.trim() || null,
      concepto: concepto.trim() || null,
    };

    try {
      setLoadingGuardar(true);
      const result = await crearSalidaStock(body);
      const response = result?.data;
      const estadoOperacion = response?.data?.estado_operacion;
      const message =
        (typeof response?.message === 'string' && response.message) ||
        (typeof response?.error === 'string' && response.error);

      if (response?.success !== true || (result.status !== 201 && result.status !== 200)) {
        setError(message || 'No se pudo registrar la salida de stock.');
        return;
      }

      if (result.status === 201 && estadoOperacion === 'CREADO') {
        setOk(message || 'Salida de stock registrada correctamente');
        reiniciarIntencion();
        return;
      }

      if (result.status === 200 && estadoOperacion === 'YA_PROCESADO') {
        setOk(message || 'La intención de salida ya fue procesada.');
        reiniciarIntencion();
        return;
      }

      setError(message || 'Respuesta no esperada al registrar la salida de stock.');
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
              <i className="fas fa-arrow-up text-primary me-2" />
              Salida de stock
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
              <Button color="primary" type="submit" form="form-stock-salida" disabled={loadingGuardar}>
                {loadingGuardar ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Registrar salida'
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
            Registre una salida de existencias para un producto con stock disponible.
          </p>

          <form id="form-stock-salida" onSubmit={guardar}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="mb-3">
                  <i className="fas fa-info-circle text-primary me-2" />
                  Datos de la salida
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
                          onChange={(value) => {
                            setIdEmpresa(value ?? '');
                            setIdItem('');
                            setIdAlmacen('');
                            setIdOrigen(nuevaClaveOrigen());
                            setFieldErr((previous) => ({ ...previous, id_empresa: '' }));
                          }}
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
                      <Label>
                        Producto <span className="text-danger">*</span>
                      </Label>
                      <SearchableSelect
                        value={idItem || null}
                        onChange={(value) => {
                          const next = Array.isArray(value) ? value[0] ?? '' : value ?? '';
                          setIdItem(next);
                          setFieldErr((previous) => ({ ...previous, id_item: '' }));
                        }}
                        options={opcionesProducto}
                        isLoading={loadingItems}
                        isDisabled={!idEmpresaActiva || loadingItems || !!errorItems}
                        placeholder={
                          !idEmpresaActiva
                            ? 'Seleccione empresa'
                            : errorItems
                              ? 'No se pudo cargar productos'
                              : 'Buscar producto por referencia / etiqueta'
                        }
                      />
                      {fieldErr.id_item && <FormText color="danger">{fieldErr.id_item}</FormText>}
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label htmlFor="stock_salida_almacen">
                        Almacén <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="stock_salida_almacen"
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
                      <Label htmlFor="stock_salida_cantidad">
                        Cantidad <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="stock_salida_cantidad"
                        type="text"
                        inputMode="decimal"
                        value={cantidad}
                        onChange={(event) => {
                          setCantidad(event.target.value);
                          setFieldErr((previous) => ({ ...previous, cantidad: '' }));
                        }}
                        invalid={Boolean(fieldErr.cantidad)}
                      />
                      {fieldErr.cantidad && <FormText color="danger">{fieldErr.cantidad}</FormText>}
                    </FormGroup>
                  </Col>

                  <Col md={3}>
                    <FormGroup>
                      <Label htmlFor="stock_salida_fecha">
                        Fecha de movimiento <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="stock_salida_fecha"
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

                  <Col md={6}>
                    <FormGroup>
                      <Label htmlFor="stock_salida_referencia">Referencia</Label>
                      <Input
                        id="stock_salida_referencia"
                        value={referencia}
                        onChange={(event) => setReferencia(event.target.value)}
                        placeholder="Referencia opcional"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={12}>
                    <FormGroup className="mb-0">
                      <Label htmlFor="stock_salida_concepto">Concepto</Label>
                      <Input
                        id="stock_salida_concepto"
                        type="textarea"
                        rows={3}
                        value={concepto}
                        onChange={(event) => setConcepto(event.target.value)}
                        placeholder="Concepto opcional"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SalidaStockAlmacen;
