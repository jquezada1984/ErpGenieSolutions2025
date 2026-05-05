import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SearchableSelect from '../../../components/SearchableSelect';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { listarAlmacenes } from '../../../_apis_/gateway';
import { actualizarInventario } from '../../../_apis_/item';
import '../ConfiguracionItem.scss';

const GET_EMPRESAS = gql`
  query GetEmpresasInventarioEdicion {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const GET_ITEMS_PRODUCTO = gql`
  query GetItemsProductoInventarioEdicion($id_empresa: ID, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      producto_ref
      etiqueta
      estado
    }
  }
`;

const INVENTARIO_PARA_EDICION = gql`
  query InventarioParaEdicion($id_inventario: ID!, $id_empresa: ID) {
    inventariosListado(id_inventario: $id_inventario, id_empresa: $id_empresa) {
      id_inventario
      id_empresa
      inventario_ref
      etiqueta
      id_almacen
      almacen
      observacion
      estado
      estado_inventario
      product
    }
  }
`;

type AlmacenRow = {
  id_almacen: string;
  almacen_ref?: string;
  nombre: string;
};

type ItemRow = {
  id_item: string;
  producto_ref?: string | null;
  etiqueta: string;
  estado: boolean;
};

type InventarioListadoRow = {
  id_inventario: string;
  id_empresa?: string | null;
  inventario_ref?: string | null;
  etiqueta?: string | null;
  id_almacen?: string | null;
  almacen?: string | null;
  observacion?: string | null;
  estado?: boolean | null;
  estado_inventario?: string | null;
  product?: number | null;
};

const EditarInventario: React.FC = () => {
  const navigate = useNavigate();
  const { id: idInventarioParam } = useParams<{ id: string }>();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [idEmpresa, setIdEmpresa] = useState('');
  const [inventarioRef, setInventarioRef] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [idAlmacen, setIdAlmacen] = useState('');
  const [observacion, setObservacion] = useState('');

  const [productoEspecifico, setProductoEspecifico] = useState<string | null>(null);
  const [filtroEtiquetasCategorias, setFiltroEtiquetasCategorias] = useState('');

  const [almacenes, setAlmacenes] = useState<AlmacenRow[]>([]);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(false);
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const hydratedIdRef = useRef<string | null>(null);

  const idEmpresaFiltroConsulta =
    scope === 'GLOBAL' ? (idEmpresa.trim() ? idEmpresa : null) : idEmpresaUsuario || null;

  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];

  const {
    data: invData,
    loading: loadingInv,
    error: errorInv,
  } = useQuery<{ inventariosListado: InventarioListadoRow[] }>(INVENTARIO_PARA_EDICION, {
    variables: {
      id_inventario: idInventarioParam ?? '',
      id_empresa: idEmpresaFiltroConsulta,
    },
    skip: !idInventarioParam,
    fetchPolicy: 'cache-and-network',
  });

  const inventarioRow = invData?.inventariosListado?.[0] ?? null;

  useEffect(() => {
    hydratedIdRef.current = null;
    setHydrated(false);
  }, [idInventarioParam]);

  useEffect(() => {
    let cancelled = false;
    setLoadingAlmacenes(true);
    listarAlmacenes()
      .then((list) => {
        if (cancelled) return;
        setAlmacenes(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setAlmacenes([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingAlmacenes(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!inventarioRow || !idInventarioParam) return;
    if (inventarioRow.id_inventario !== idInventarioParam) return;
    if (hydratedIdRef.current === idInventarioParam) return;

    hydratedIdRef.current = idInventarioParam;

    setIdEmpresa(inventarioRow.id_empresa ?? '');
    setInventarioRef(String(inventarioRow.inventario_ref ?? '').trim());
    setEtiqueta(String(inventarioRow.etiqueta ?? '').trim());
    setIdAlmacen(String(inventarioRow.id_almacen ?? '').trim());
    setObservacion(String(inventarioRow.observacion ?? '').trim());
    setProductoEspecifico(null);
    setFiltroEtiquetasCategorias('');
    setFieldErr({});
    setError(null);
    setOk(null);
    setHasChanges(false);
    setHydrated(true);
  }, [inventarioRow, idInventarioParam]);

  const idEmpresaActiva = scope === 'GLOBAL' ? idEmpresa : idEmpresaUsuario || idEmpresa;

  const { data: itemsData, loading: loadingItems } = useQuery<{ itemsListado: ItemRow[] }>(
    GET_ITEMS_PRODUCTO,
    {
      variables: {
        id_empresa: idEmpresaActiva || null,
        codigo_tipo_item: 'PRODUCT',
      },
      skip: !idEmpresaActiva || !hydrated,
      fetchPolicy: 'cache-and-network',
    }
  );

  const opcionesProducto = useMemo(() => {
    const list = Array.isArray(itemsData?.itemsListado) ? itemsData?.itemsListado : [];
    return list
      .filter((it) => it?.estado !== false)
      .map((it) => {
        const ref = String(it.producto_ref ?? '').trim();
        const label = String(it.etiqueta ?? '').trim();
        return {
          value: String(it.id_item),
          label: ref ? `${ref} - ${label || 'Sin etiqueta'}` : label || String(it.id_item),
        };
      });
  }, [itemsData?.itemsListado]);

  const markChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  const onGuardar = async () => {
    setError(null);
    setOk(null);
    const nextErr: Record<string, string> = {};
    if (!idEmpresaActiva) nextErr.id_empresa = 'Debe seleccionar empresa';
    if (!inventarioRef.trim()) nextErr.inventario_ref = 'La referencia es obligatoria';
    if (!etiqueta.trim()) nextErr.etiqueta = 'La etiqueta es obligatoria';
    if (!idAlmacen) nextErr.id_almacen = 'Debe seleccionar almacén';
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length > 0) {
      setError('Revise los campos obligatorios.');
      return;
    }

    if (!idInventarioParam) return;

    const estInv = String(inventarioRow?.estado_inventario ?? '').trim();
    const body: Record<string, unknown> = {
      id_empresa: idEmpresaActiva,
      inventario_ref: inventarioRef.trim(),
      etiqueta: etiqueta.trim(),
      id_almacen: idAlmacen,
      observacion: observacion.trim() || null,
    };
    if (estInv && ['ABIERTO', 'BORRADOR', 'CERRADO'].includes(estInv.toUpperCase())) {
      body.estado_inventario = estInv.toUpperCase();
    }

    try {
      setLoadingGuardar(true);
      const res = await actualizarInventario(idInventarioParam, body);
      if (res?.success !== true) {
        setError(
          (typeof res?.error === 'string' && res.error) ||
            (typeof res?.message === 'string' && res.message) ||
            'No se pudo actualizar el inventario.'
        );
        return;
      }
      setOk('Inventario actualizado correctamente.');
      setHasChanges(false);
      window.setTimeout(() => {
        setOk(null);
      }, 4000);
    } catch (e: unknown) {
      const err = e as Error & {
        status?: number;
        data?: { error?: string; errors?: Record<string, string[] | string> };
      };
      if (err.status === 409) {
        setError(
          (typeof err.data?.error === 'string' && err.data.error) ||
            'Ya existe un inventario con esa referencia para esta empresa.'
        );
        return;
      }
      if (err.status === 404) {
        setError(
          (typeof err.data?.error === 'string' && err.data.error) || 'Inventario no encontrado.'
        );
        return;
      }
      if (err.status === 400 && err.data?.errors && typeof err.data.errors === 'object') {
        const msg = Object.entries(err.data.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
          .join(' | ');
        setError(msg || 'Error de validación.');
        return;
      }
      setError(
        (typeof err.data?.error === 'string' && err.data.error) ||
          err.message ||
          'Error al actualizar el inventario.'
      );
    } finally {
      setLoadingGuardar(false);
    }
  };

  const handleCancel = () => {
    navigate('/items/inventarios');
  };

  const formDisabled =
    loadingInv || !hydrated || !inventarioRow || inventarioRow.estado === false;

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-edit text-primary me-2" />
              Editar inventario
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={onGuardar}
                disabled={loadingGuardar || !hasChanges || formDisabled}
              >
                {loadingGuardar ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Actualizar inventario'
                )}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">{ok}</Alert>}
          {error && <Alert color="danger">{error}</Alert>}

          {errorInv && (
            <Alert color="danger">Error al cargar el inventario: {errorInv.message}</Alert>
          )}

          {loadingInv && !inventarioRow && (
            <div className="text-center py-4">
              <Spinner />
              <p className="mt-2 text-muted">Cargando inventario…</p>
            </div>
          )}

          {!loadingInv && idInventarioParam && !inventarioRow && !errorInv && (
            <Alert color="warning">Inventario no encontrado.</Alert>
          )}

          {inventarioRow && inventarioRow.estado === false && (
            <Alert color="warning">Este inventario está inactivo; no se puede editar.</Alert>
          )}

          {inventarioRow && inventarioRow.estado !== false && (
            <>
              <p className="text-muted mb-3">
                Modifique los datos del inventario y haga clic en <b>Actualizar inventario</b>.
              </p>

              <Card className="mb-4">
                <CardBody>
                  <h5 className="mb-3">
                    <i className="fas fa-id-card text-primary me-2" />
                    Datos generales
                  </h5>

                  <Row>
                    {scope === 'GLOBAL' && (
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="id_empresa">
                            Empresa <span className="text-danger">*</span>
                          </Label>
                          <SelectEmpresa
                            value={idEmpresa}
                            onChange={(val) => {
                              setIdEmpresa(val ?? '');
                              setFieldErr((p) => ({ ...p, id_empresa: '' }));
                              markChanged();
                            }}
                            empresas={empresas}
                            isLoading={loadingEmpresas}
                            isDisabled={loadingEmpresas}
                            placeholder="Seleccionar empresa"
                          />
                          {fieldErr.id_empresa && <FormText color="danger">{fieldErr.id_empresa}</FormText>}
                        </FormGroup>
                      </Col>
                    )}

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="inventario_ref">
                          Referencia <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="inventario_ref"
                          value={inventarioRef}
                          onChange={(e) => {
                            setInventarioRef(e.target.value);
                            setFieldErr((p) => ({ ...p, inventario_ref: '' }));
                            markChanged();
                          }}
                          placeholder="Ej. INV-2026-001"
                        />
                        {fieldErr.inventario_ref && (
                          <FormText color="danger">{fieldErr.inventario_ref}</FormText>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="etiqueta">
                          Etiqueta / Nombre del inventario <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="etiqueta"
                          value={etiqueta}
                          onChange={(e) => {
                            setEtiqueta(e.target.value);
                            setFieldErr((p) => ({ ...p, etiqueta: '' }));
                            markChanged();
                          }}
                          placeholder="Inventario general bodega principal"
                        />
                        {fieldErr.etiqueta && <FormText color="danger">{fieldErr.etiqueta}</FormText>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="id_almacen">
                          Almacén <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="id_almacen"
                          type="select"
                          value={idAlmacen}
                          onChange={(e) => {
                            setIdAlmacen(e.target.value);
                            setFieldErr((p) => ({ ...p, id_almacen: '' }));
                            markChanged();
                          }}
                          disabled={loadingAlmacenes}
                        >
                          <option value="">{loadingAlmacenes ? 'Cargando...' : 'Seleccionar'}</option>
                          {almacenes.map((a) => (
                            <option key={a.id_almacen} value={a.id_almacen}>
                              {a.almacen_ref ? `${a.almacen_ref} - ${a.nombre}` : a.nombre}
                            </option>
                          ))}
                        </Input>
                        {fieldErr.id_almacen && <FormText color="danger">{fieldErr.id_almacen}</FormText>}
                      </FormGroup>
                    </Col>

                    <Col md={12}>
                      <FormGroup>
                        <Label htmlFor="observacion">Observación</Label>
                        <Input
                          id="observacion"
                          type="textarea"
                          rows={3}
                          value={observacion}
                          onChange={(e) => {
                            setObservacion(e.target.value);
                            markChanged();
                          }}
                          placeholder="Notas generales del inventario"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h5 className="mb-3">
                    <i className="fas fa-boxes text-primary me-2" />
                    Productos a inventariar
                  </h5>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="producto_especifico">Producto específico (opcional)</Label>
                        <SearchableSelect
                          value={productoEspecifico}
                          onChange={(v) => {
                            setProductoEspecifico(v);
                            markChanged();
                          }}
                          options={opcionesProducto}
                          isLoading={loadingItems}
                          isDisabled={!idEmpresaActiva}
                          placeholder={
                            idEmpresaActiva
                              ? 'Buscar producto por referencia / etiqueta'
                              : 'Seleccione empresa para habilitar productos'
                          }
                        />
                        <FormText color="muted">
                          Se reutiliza `itemsListado` actual. Fase posterior: filtrar inventariable=true si el backend lo expone.
                        </FormText>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="filtro_etiquetas">Productos por etiquetas/categorías (opcional)</Label>
                        <Input
                          id="filtro_etiquetas"
                          value={filtroEtiquetasCategorias}
                          onChange={(e) => {
                            setFiltroEtiquetasCategorias(e.target.value);
                            markChanged();
                          }}
                          placeholder="Ej. FERRETERIA, ALTA_ROTACION"
                        />
                        <FormText color="muted">
                          Solo visual en esta fase. No persiste ni genera detalle.
                        </FormText>
                      </FormGroup>
                    </Col>
                  </Row>

                  {!idEmpresaActiva && scope === 'GLOBAL' && (
                    <Alert color="warning" className="mt-2 mb-0 py-2">
                      Seleccione una empresa para cargar productos y continuar.
                    </Alert>
                  )}
                </CardBody>
              </Card>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarInventario;
