import React, { useEffect, useState } from 'react';
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
import CountrySelect from '../../../components/CountrySelect';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SelectProvincia from '../../../components/selects/SelectProvincia';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { crearAlmacen } from '../../../_apis_/almacen';
import '../ConfiguracionItem.scss';

/** Catálogo existente InicioNestJs vía Gateway (mismo patrón que Terceros / Item / Banco). */
const GET_PAISES = gql`
  query GetPaisesNuevoAlmacen {
    paises {
      id_pais
      nombre
      codigo_iso
      icono
    }
  }
`;

const GET_EMPRESAS = gql`
  query GetEmpresasNuevoAlmacen {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

/**
 * Pantalla "Nuevo almacén".
 * Escritura: Gateway POST /api/almacen → AlmacenPython.
 * Multiempresa: mismo patrón que NuevoInventario.
 */
const NuevoAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [idEmpresa, setIdEmpresa] = useState('');
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
  const [estado, setEstado] = useState(true);

  const [loadingCrear, setLoadingCrear] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const { data: paisesData, loading: loadingPaises } = useQuery(GET_PAISES);
  const paises = paisesData?.paises || [];

  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario && !idEmpresa) {
      setIdEmpresa(idEmpresaUsuario);
    }
  }, [scope, idEmpresaUsuario, idEmpresa]);

  const idEmpresaActiva = scope === 'GLOBAL' ? idEmpresa : idEmpresaUsuario || idEmpresa;

  const onCancelar = () => {
    // Listado /items/almacenes aún no existe: volver atrás de forma segura.
    navigate(-1);
  };

  const onGuardar = async () => {
    setError(null);
    setInfo(null);
    const nextErr: Record<string, string> = {};
    if (!idEmpresaActiva) nextErr.id_empresa = 'Debe seleccionar empresa';
    if (!almacenRef.trim()) nextErr.almacen_ref = 'La referencia es obligatoria';
    if (!nombre.trim()) nextErr.nombre = 'El nombre es obligatorio';
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length > 0) {
      setError('Revise los campos obligatorios.');
      return;
    }

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
      estado: Boolean(estado),
    };

    try {
      setLoadingCrear(true);
      const res = await crearAlmacen(body);
      if (res?.success !== true) {
        setError(
          (typeof res?.error === 'string' && res.error) ||
            (typeof res?.message === 'string' && res.message) ||
            'No se pudo crear el almacén.'
        );
        return;
      }
      const idCreado = res?.data?.id_almacen ? String(res.data.id_almacen) : '';
      setInfo(
        idCreado
          ? `Almacén creado correctamente. (${idCreado})`
          : 'Almacén creado correctamente.'
      );
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
            'Ya existe un almacén con esa referencia para esta empresa.'
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
  };

  return (
    <div className="configuracion-item">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-building text-primary me-2" />
              Nuevo almacén
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={onCancelar}>
                Cancelar
              </Button>
              <Button color="primary" onClick={onGuardar} disabled={loadingCrear}>
                {loadingCrear ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Crear almacén'
                )}
              </Button>
            </div>
          </div>

          <Card className="mb-4">
            <CardBody>
              <h5 className="mb-3">
                <i className="fas fa-toggle-on text-primary me-2" />
                Estado
              </h5>
              <FormGroup className="mb-0">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="estado_almacen"
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                  />
                  <Label className="form-check-label" htmlFor="estado_almacen">
                    {estado ? 'Activo' : 'Inactivo'}
                  </Label>
                </div>
              </FormGroup>
            </CardBody>
          </Card>

          {info && (
            <Alert color="info" toggle={() => setInfo(null)}>
              {info}
            </Alert>
          )}
          {error && (
            <Alert color="danger" toggle={() => setError(null)}>
              {error}
            </Alert>
          )}

          <p className="text-muted mb-3">
            Complete los datos del almacén y haga clic en <b>Crear almacén</b>.
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
                    <Label htmlFor="almacen_ref">
                      Referencia <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="almacen_ref"
                      value={almacenRef}
                      onChange={(e) => {
                        setAlmacenRef(e.target.value);
                        setFieldErr((p) => ({ ...p, almacen_ref: '' }));
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
                      onChange={(e) => {
                        setNombre(e.target.value);
                        setFieldErr((p) => ({ ...p, nombre: '' }));
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
                      onChange={(e) => setDescripcion(e.target.value)}
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
                      onChange={(e) => setDireccion(e.target.value)}
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
                      // Igual que Nuevo Producto / terceros: al cambiar país se limpia provincia.
                      setIdPais(e.target.value);
                      setIdProvincia('');
                    }}
                    disabled={loadingPaises}
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
                      onChange={(id) => setIdProvincia(id ?? '')}
                      id_pais={idPais || null}
                      isDisabled={!idPais}
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
                      onChange={(e) => setPoblacion(e.target.value)}
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
                      onChange={(e) => setCodigoPostal(e.target.value)}
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
                      onChange={(e) => setTelefono(e.target.value)}
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
                      onChange={(e) => setFax(e.target.value)}
                      placeholder="Fax"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevoAlmacen;
