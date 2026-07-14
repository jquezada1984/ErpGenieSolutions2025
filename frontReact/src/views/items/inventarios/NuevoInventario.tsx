import React, { useEffect, useMemo, useState } from 'react';
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
import { listarAlmacenes } from '../../../_apis_/gateway';
import { crearInventario } from '../../../_apis_/inventario';
import '../ConfiguracionItem.scss';

const GET_EMPRESAS = gql`
  query GetEmpresasInventario {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const GET_ITEMS_PRODUCTO = gql`
  query GetItemsProductoInventario($id_empresa: ID, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      producto_ref
      etiqueta
      estado
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

const NuevoInventario: React.FC = () => {
  const navigate = useNavigate();
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
  const [loadingCrear, setLoadingCrear] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario && !idEmpresa) {
      setIdEmpresa(idEmpresaUsuario);
    }
  }, [scope, idEmpresaUsuario, idEmpresa]);

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

  const idEmpresaActiva = scope === 'GLOBAL' ? idEmpresa : idEmpresaUsuario || idEmpresa;

  const { data: itemsData, loading: loadingItems } = useQuery<{ itemsListado: ItemRow[] }>(
    GET_ITEMS_PRODUCTO,
    {
      variables: {
        id_empresa: idEmpresaActiva || null,
        codigo_tipo_item: 'PRODUCT',
      },
      skip: !idEmpresaActiva,
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

  const onCrear = async () => {
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

    const body = {
      id_empresa: idEmpresaActiva,
      inventario_ref: inventarioRef.trim(),
      etiqueta: etiqueta.trim(),
      id_almacen: idAlmacen,
      observacion: observacion.trim() || null,
    };

    try {
      setLoadingCrear(true);
      const res = await crearInventario(body);
      if (res?.success !== true) {
        setError(
          (typeof res?.error === 'string' && res.error) ||
            (typeof res?.message === 'string' && res.message) ||
            'No se pudo crear el inventario.'
        );
        return;
      }
      setOk('Inventario creado correctamente.');
      setInventarioRef('');
      setEtiqueta('');
      setIdAlmacen('');
      setObservacion('');
      setProductoEspecifico(null);
      setFiltroEtiquetasCategorias('');
      setFieldErr({});
      return;
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
          'Error interno del servidor.'
      );
      return;
    } finally {
      setLoadingCrear(false);
    }

    // TODO FASE 3: guardar detalle del inventario (inventario_detalle).
    // TODO FASE 3: implementar inventario_detalle.
    // TODO FASE 3: consultar stock_item_almacen y calcular diferencia.
    // TODO FASE 4: flujo de cierre de inventario.
  };

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-clipboard-list text-primary me-2" />
              Nuevo inventario
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => navigate('/items/inventarios')}>
                Cancelar
              </Button>
              <Button color="primary" onClick={onCrear} disabled={loadingCrear}>
                {loadingCrear ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Crear inventario'
                )}
              </Button>
            </div>
          </div>

          {ok && <Alert color="info">{ok}</Alert>}
          {error && <Alert color="danger">{error}</Alert>}

          <p className="text-muted mb-3">
            Complete los datos del inventario y haga clic en <b>Crear inventario</b>.
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
                      }}
                      placeholder="Ej. INV-2026-001"
                    />
                    {fieldErr.inventario_ref && <FormText color="danger">{fieldErr.inventario_ref}</FormText>}
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
                      onChange={(e) => setObservacion(e.target.value)}
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
                      onChange={setProductoEspecifico}
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
                      onChange={(e) => setFiltroEtiquetasCategorias(e.target.value)}
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
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevoInventario;
