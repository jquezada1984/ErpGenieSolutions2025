import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CountrySelect from '../../../components/CountrySelect';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SelectProvincia from '../../../components/selects/SelectProvincia';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { actualizarAlmacen } from '../../../_apis_/almacen';
import '../ConfiguracionItem.scss';

const GET_PAISES = gql`
  query GetPaisesEditarAlmacen {
    paises {
      id_pais
      nombre
      codigo_iso
      icono
    }
  }
`;

const GET_EMPRESAS = gql`
  query GetEmpresasEditarAlmacen {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ALMACEN_POR_ID = gql`
  query AlmacenPorIdEdicion($id_almacen: ID!, $id_empresa: ID!) {
    almacenPorId(id_almacen: $id_almacen, id_empresa: $id_empresa) {
      id_almacen
      id_empresa
      almacen_ref
      nombre
      descripcion
      direccion
      codigo_postal
      poblacion
      id_pais
      pais
      id_provincia
      provincia
      telefono
      fax
      estado
    }
  }
`;

type AlmacenDetalleRow = {
  id_almacen: string;
  id_empresa?: string | null;
  almacen_ref?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  direccion?: string | null;
  codigo_postal?: string | null;
  poblacion?: string | null;
  id_pais?: string | null;
  pais?: string | null;
  id_provincia?: string | null;
  provincia?: string | null;
  telefono?: string | null;
  fax?: string | null;
  estado?: boolean | null;
};

/**
 * Pantalla "Editar almacén".
 * Lectura: GraphQL almacenPorId → Gateway → AlmacenNestJs.
 * Escritura: Gateway PUT /api/almacen/:id → AlmacenPython.
 */
const EditarAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: idAlmacenParam } = useParams<{ id: string }>();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const idEmpresaFromNav = String(
    (location.state as { id_empresa?: string } | null)?.id_empresa ?? '',
  ).trim();

  const [idEmpresa, setIdEmpresa] = useState(idEmpresaFromNav);
  const [almacenRef, setAlmacenRef] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [poblacion, setPoblacion] = useState('');
  const [idPais, setIdPais] = useState('');
  const [idProvincia, setIdProvincia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fax, setFax] = useState('');

  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);

  // EMPRESA: JWT. GLOBAL: state de navegación / SelectEmpresa (nunca null en query).
  const idEmpresaFiltroConsulta =
    scope === 'GLOBAL'
      ? idEmpresa.trim() || null
      : idEmpresaUsuario.trim() || null;

  const { data: paisesData, loading: loadingPaises } = useQuery(GET_PAISES);
  const paises = paisesData?.paises || [];

  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];

  const {
    data: almData,
    loading: loadingAlm,
    error: errorAlm,
  } = useQuery<{ almacenPorId: AlmacenDetalleRow | null }>(ALMACEN_POR_ID, {
    variables: {
      id_almacen: idAlmacenParam ?? '',
      id_empresa: idEmpresaFiltroConsulta as string,
    },
    skip: !idAlmacenParam || !idEmpresaFiltroConsulta,
    fetchPolicy: 'cache-and-network',
  });

  const almacenRow = almData?.almacenPorId ?? null;

  useEffect(() => {
    if (scope !== 'GLOBAL') return;
    if (!idEmpresaFromNav) return;
    setIdEmpresa((prev) => (prev.trim() ? prev : idEmpresaFromNav));
  }, [scope, idEmpresaFromNav]);

  useEffect(() => {
    hydratedKeyRef.current = null;
    setHydrated(false);
  }, [idAlmacenParam, idEmpresaFiltroConsulta]);

  useEffect(() => {
    if (!almacenRow || !idAlmacenParam || !idEmpresaFiltroConsulta) return;
    if (almacenRow.id_almacen !== idAlmacenParam) return;
    const hydrateKey = `${idAlmacenParam}|${idEmpresaFiltroConsulta}`;
    if (hydratedKeyRef.current === hydrateKey) return;

    hydratedKeyRef.current = hydrateKey;

    if (scope === 'GLOBAL') {
      setIdEmpresa(String(almacenRow.id_empresa ?? idEmpresaFiltroConsulta).trim());
    }
    setAlmacenRef(String(almacenRow.almacen_ref ?? '').trim());
    setNombre(String(almacenRow.nombre ?? '').trim());
    setDescripcion(String(almacenRow.descripcion ?? '').trim());
    setDireccion(String(almacenRow.direccion ?? '').trim());
    setCodigoPostal(String(almacenRow.codigo_postal ?? '').trim());
    setPoblacion(String(almacenRow.poblacion ?? '').trim());
    setIdPais(String(almacenRow.id_pais ?? '').trim());
    setIdProvincia(String(almacenRow.id_provincia ?? '').trim());
    setTelefono(String(almacenRow.telefono ?? '').trim());
    setFax(String(almacenRow.fax ?? '').trim());
    setFieldErr({});
    setError(null);
    setOk(null);
    setHasChanges(false);
    setHydrated(true);
  }, [almacenRow, idAlmacenParam, idEmpresaFiltroConsulta, scope]);

  const idEmpresaActiva = scope === 'GLOBAL' ? idEmpresa : idEmpresaUsuario || idEmpresa;

  const markChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  const onGuardar = async () => {
    setError(null);
    setOk(null);

    if (almacenRow?.estado === false) {
      setError('Este almacén está inactivo; no se puede editar.');
      return;
    }

    const nextErr: Record<string, string> = {};
    if (!idEmpresaActiva) nextErr.id_empresa = 'Debe seleccionar empresa';
    if (!almacenRef.trim()) nextErr.almacen_ref = 'La referencia es obligatoria';
    if (!nombre.trim()) nextErr.nombre = 'El nombre es obligatorio';
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length > 0) {
      setError('Revise los campos obligatorios.');
      return;
    }

    if (!idAlmacenParam || loadingGuardar) return;

    const body = {
      id_empresa: idEmpresaActiva,
      almacen_ref: almacenRef.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      direccion: direccion.trim() || null,
      codigo_postal: codigoPostal.trim() || null,
      poblacion: poblacion.trim() || null,
      id_pais: idPais.trim() || null,
      id_provincia: idProvincia.trim() || null,
      telefono: telefono.trim() || null,
      fax: fax.trim() || null,
    };

    try {
      setLoadingGuardar(true);
      const res = await actualizarAlmacen(idAlmacenParam, body);
      if (res?.success !== true) {
        setError(
          (typeof res?.error === 'string' && res.error) ||
            (typeof res?.message === 'string' && res.message) ||
            'No se pudo actualizar el almacén.'
        );
        return;
      }
      setOk('Almacén actualizado correctamente.');
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
            'Ya existe un almacén con esa referencia para esta empresa.'
        );
        return;
      }
      if (err.status === 404) {
        setError(
          (typeof err.data?.error === 'string' && err.data.error) || 'Almacén no encontrado.'
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
          'Error al actualizar el almacén.'
      );
    } finally {
      setLoadingGuardar(false);
    }
  };

  const handleCancel = () => {
    navigate('/items/almacenes');
  };

  const formDisabled =
    loadingAlm || !hydrated || !almacenRow || almacenRow.estado === false;

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-edit text-primary me-2" />
              Editar almacén
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
                  'Actualizar almacén'
                )}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">{ok}</Alert>}
          {error && (
            <Alert color="danger" toggle={() => setError(null)}>
              {error}
            </Alert>
          )}

          {errorAlm && (
            <Alert color="danger">Error al cargar el almacén: {errorAlm.message}</Alert>
          )}

          {scope === 'GLOBAL' && idAlmacenParam && !idEmpresaFiltroConsulta && (
            <Alert color="info" className="mb-3">
              Seleccione una empresa para editar el almacén.
            </Alert>
          )}

          {scope === 'GLOBAL' && idAlmacenParam && !idEmpresaFiltroConsulta && (
            <Card className="mb-4">
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id_empresa_previo">
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
                </FormGroup>
              </CardBody>
            </Card>
          )}

          {loadingAlm && !almacenRow && (
            <div className="text-center py-4">
              <Spinner />
              <p className="mt-2 text-muted">Cargando almacén…</p>
            </div>
          )}

          {!loadingAlm &&
            idAlmacenParam &&
            !!idEmpresaFiltroConsulta &&
            !almacenRow &&
            !errorAlm && (
              <Alert color="warning">Almacén no encontrado.</Alert>
            )}

          {almacenRow && almacenRow.estado === false && (
            <Alert color="warning">Este almacén está inactivo; no se puede editar.</Alert>
          )}

          {almacenRow && almacenRow.estado !== false && (
            <>
              <p className="text-muted mb-3">
                Modifique los datos del almacén y haga clic en <b>Actualizar almacén</b>.
              </p>

              <Card className="mb-4">
                <CardBody>
                  <h5 className="mb-3">
                    <i className="fas fa-id-card text-primary me-2" />
                    Información general
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
                            isDisabled={loadingEmpresas || formDisabled}
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
                        <Label htmlFor="almacen_ref">
                          Referencia <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="almacen_ref"
                          value={almacenRef}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setAlmacenRef(e.target.value);
                            setFieldErr((p) => ({ ...p, almacen_ref: '' }));
                            markChanged();
                          }}
                          placeholder="Ej. ALM-PRINCIPAL"
                        />
                        {fieldErr.almacen_ref && (
                          <FormText color="danger">{fieldErr.almacen_ref}</FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="nombre">
                          Nombre <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="nombre"
                          value={nombre}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setNombre(e.target.value);
                            setFieldErr((p) => ({ ...p, nombre: '' }));
                            markChanged();
                          }}
                          placeholder="Almacén principal"
                        />
                        {fieldErr.nombre && <FormText color="danger">{fieldErr.nombre}</FormText>}
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                          id="descripcion"
                          type="textarea"
                          rows={3}
                          value={descripcion}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setDescripcion(e.target.value);
                            markChanged();
                          }}
                          placeholder="Descripción del almacén"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-4">
                <CardBody>
                  <h5 className="mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2" />
                    Ubicación
                  </h5>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          type="textarea"
                          rows={2}
                          value={direccion}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setDireccion(e.target.value);
                            markChanged();
                          }}
                          placeholder="Dirección del almacén"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <CountrySelect
                        key={`country-select-${idPais}-${paises.length}`}
                        id="id_pais"
                        name="id_pais"
                        value={idPais}
                        onChange={(e) => {
                          setIdPais(e.target.value);
                          setIdProvincia('');
                          markChanged();
                        }}
                        disabled={loadingPaises || formDisabled}
                        loading={loadingPaises}
                        countries={paises}
                        label={
                          <>
                            <i className="fas fa-globe me-1" />
                            País
                          </>
                        }
                      />
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Provincia</Label>
                        <SelectProvincia
                          value={idProvincia || null}
                          onChange={(id) => {
                            setIdProvincia(id ?? '');
                            markChanged();
                          }}
                          id_pais={idPais || null}
                          isDisabled={!idPais || formDisabled}
                          placeholder="Seleccionar provincia"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label htmlFor="poblacion">Ciudad / Población</Label>
                        <Input
                          id="poblacion"
                          value={poblacion}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setPoblacion(e.target.value);
                            markChanged();
                          }}
                          placeholder="Ciudad"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label htmlFor="codigo_postal">Código postal</Label>
                        <Input
                          id="codigo_postal"
                          value={codigoPostal}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setCodigoPostal(e.target.value);
                            markChanged();
                          }}
                          placeholder="Código postal"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-4">
                <CardBody>
                  <h5 className="mb-3">
                    <i className="fas fa-phone text-primary me-2" />
                    Contacto
                  </h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={telefono}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setTelefono(e.target.value);
                            markChanged();
                          }}
                          placeholder="Teléfono"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="fax">Fax</Label>
                        <Input
                          id="fax"
                          value={fax}
                          disabled={formDisabled}
                          onChange={(e) => {
                            setFax(e.target.value);
                            markChanged();
                          }}
                          placeholder="Fax"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarAlmacen;
