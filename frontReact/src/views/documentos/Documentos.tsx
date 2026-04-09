import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  Badge,
  Button,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getMediaByModule, deleteMedia, updateMedia } from '../../_apis_/media';
import { getDirectorios, createDirectorio } from '../../_apis_/directorio';
import SelectEmpresa from '../../components/SelectEmpresa';
import useJwtPayload from '../../hooks/useJwtPayload';

const useUrlQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const GET_EMPRESAS = gql`
  query GetEmpresas {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

interface MediaItem {
  id_media: string;
  tipo: string;
  estado_archivo: string;
  es_principal: boolean;
  url?: string;
  file?: { url?: string };
}

interface DirectorioItem {
  id_directorio_documento: string;
  nombre: string;
}

const Documentos: React.FC = () => {
  const usuario = useJwtPayload();
  const scope = usuario?.scope_acceso || 'EMPRESA';
  const query = useUrlQuery();
  const [searchParams] = useSearchParams();
  const empresaIdFromUrlRaw = searchParams.get('empresa_id');
  const empresaIdFromUrl =
    empresaIdFromUrlRaw && empresaIdFromUrlRaw !== 'undefined'
      ? empresaIdFromUrlRaw
      : undefined;
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string | null>(empresaIdFromUrl || null);
  const empresaActiva = scope === 'GLOBAL' ? empresaSeleccionada : usuario?.id_empresa;
  const moduleFromUrl = query.get('module');
  const moduleIdFromUrl = query.get('module_id');
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(moduleFromUrl || null);
  const [moduleIdSeleccionado, setModuleIdSeleccionado] = useState<string | null>(moduleIdFromUrl || null);
  const hasModuloSeleccionado = !!moduloSeleccionado;
  const hasModuleContext = !!moduleIdSeleccionado;
  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];

  useEffect(() => {
    if (scope === 'GLOBAL' && empresaIdFromUrl) {
      setEmpresaSeleccionada(empresaIdFromUrl);
    }
  }, [scope, empresaIdFromUrl]);

  useEffect(() => {
    if (moduleFromUrl) {
      setModuloSeleccionado(moduleFromUrl);
    }
    if (moduleIdFromUrl) {
      setModuleIdSeleccionado(moduleIdFromUrl);
    }
  }, [moduleFromUrl, moduleIdFromUrl]);

  const [documentos, setDocumentos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [directorios, setDirectorios] = useState<DirectorioItem[]>([]);
  const [directorioSeleccionado, setDirectorioSeleccionado] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [mediaEditando, setMediaEditando] = useState<MediaItem | null>(null);
  const [estadoArchivo, setEstadoArchivo] = useState('');
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  const loadMedia = useCallback(async () => {
    if (!hasModuloSeleccionado) {
      setDocumentos([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (!hasModuleContext) {
      setDocumentos([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (scope === 'GLOBAL' && !empresaActiva) {
      setDocumentos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const list = await getMediaByModule(
        moduloSeleccionado,
        moduleIdSeleccionado,
        directorioSeleccionado || undefined,
        empresaActiva || undefined,
      );
      setDocumentos(Array.isArray(list) ? list : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cargar documentos';
      setError(msg);
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  }, [
    moduloSeleccionado,
    moduleIdSeleccionado,
    directorioSeleccionado,
    empresaActiva,
    scope,
    hasModuloSeleccionado,
    hasModuleContext,
  ]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const loadDirectorios = useCallback(async () => {
    if (!hasModuloSeleccionado) {
      setDirectorios([]);
      return;
    }
    if (scope === 'GLOBAL' && !empresaActiva) {
      setDirectorios([]);
      return;
    }
    try {
      const data = await getDirectorios(moduloSeleccionado, empresaActiva || undefined);
      setDirectorios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando directorios', error);
    }
  }, [moduloSeleccionado, empresaActiva, scope, hasModuloSeleccionado]);

  useEffect(() => {
    loadDirectorios();
  }, [loadDirectorios]);

  const handleCrearDirectorio = async () => {
    if (!nuevoNombre.trim()) return;
    if (!hasModuloSeleccionado) return;
    if (scope === 'GLOBAL' && !empresaActiva) return;

    setLoadingCreate(true);

    try {
      await createDirectorio(
        {
          nombre: nuevoNombre,
          modulo: moduloSeleccionado,
        },
        empresaActiva || undefined,
      );

      setNuevoNombre('');
      await loadDirectorios();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCreate(false);
    }
  };

  const resolveUrl = (doc: MediaItem) => doc.file?.url ?? doc.url ?? '';

  const handleDelete = async (id_media: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar documento?',
      text: 'Esta acción lo marcará como inactivo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setDeletingId(id_media);
    setError(null);
    try {
      await deleteMedia(id_media);

      await Swal.fire({
        title: 'Eliminado',
        text: 'El documento ha sido eliminado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      await loadMedia();
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el documento',
        icon: 'error',
      });

      const msg = error instanceof Error ? error.message : 'Error al eliminar';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Documentos
                </CardTitle>
              </div>

              {error && (
                <Alert color="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {!hasModuloSeleccionado && (
                <Alert color="info" className="mb-3">
                  Seleccione un modulo para ver documentos
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={scope === 'GLOBAL' ? 4 : 6}>
                  <FormGroup>
                    <Label>Modulo</Label>
                    <Input
                      type="select"
                      value={moduloSeleccionado || ''}
                      onChange={(e) => {
                        const nextModulo = e.target.value || null;
                        setModuloSeleccionado(nextModulo);
                        setDirectorioSeleccionado(null);
                        setModuleIdSeleccionado(null);
                      }}
                    >
                      <option value="">Seleccionar modulo</option>
                      <option value="tercero">tercero</option>
                      <option value="producto">producto</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={scope === 'GLOBAL' ? 4 : 6}>
                  <FormGroup>
                    <Label>Module ID</Label>
                    <Input
                      value={moduleIdSeleccionado || ''}
                      onChange={(e) => setModuleIdSeleccionado(e.target.value || null)}
                      placeholder="Ingrese module_id"
                    />
                  </FormGroup>
                </Col>
              </Row>

              {scope === 'GLOBAL' && (
                <Row className="mb-3">
                  <Col md={4}>
                    <FormGroup>
                      <Label>Empresa</Label>
                      <SelectEmpresa
                        value={empresaSeleccionada}
                        onChange={(val) => {
                          setEmpresaSeleccionada(val);
                          setDirectorioSeleccionado(null);
                        }}
                        empresas={empresas}
                        isLoading={loadingEmpresas}
                        isDisabled={loadingEmpresas}
                        placeholder="Seleccionar empresa"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}

              {scope === 'GLOBAL' && !empresaSeleccionada ? (
                <Alert color="info" className="mb-0">
                  Seleccione una empresa
                </Alert>
              ) : !hasModuloSeleccionado ? null : (
              !hasModuleContext ? (
                <Alert color="info" className="mb-0">
                  Seleccione o ingrese un module_id para listar documentos
                </Alert>
              ) : (

              <Row>
                <Col md={3} className="mb-3 mb-md-0">
                  <Card>
                    <CardBody>
                      <h6 className="mb-3">Directorios</h6>
                      <div className="mb-2">
                        <input
                          className="form-control"
                          placeholder="Nueva carpeta"
                          value={nuevoNombre}
                          onChange={(e) => setNuevoNombre(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary mt-1 w-100"
                          onClick={handleCrearDirectorio}
                          disabled={loadingCreate}
                        >
                          {loadingCreate ? 'Creando...' : 'Crear'}
                        </button>
                      </div>
                      <ul className="list-group">
                        <li
                          className={`list-group-item ${!directorioSeleccionado ? 'active' : ''}`}
                          onClick={() => setDirectorioSeleccionado(null)}
                        >
                          📁 Todas
                        </li>
                        {directorios.map((dir) => (
                          <li
                            key={dir.id_directorio_documento}
                            className={`list-group-item ${
                              directorioSeleccionado === dir.id_directorio_documento ? 'active' : ''
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDirectorioSeleccionado(dir.id_directorio_documento)}
                          >
                            📁 {dir.nombre}
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={9}>
                  {loading ? (
                    <div className="text-center py-4 text-muted">
                      <Spinner color="primary" className="me-2" />
                      Cargando documentos…
                    </div>
                  ) : documentos.length === 0 ? (
                    <Card>
                      <CardBody>
                        <p className="text-muted mb-0">No hay documentos</p>
                      </CardBody>
                    </Card>
                  ) : (
                    <Row>
                      {documentos.map((doc) => {
                        const url = resolveUrl(doc);
                        const esImagen = doc.tipo === 'imagen';
                        return (
                          <Col key={doc.id_media} xs="12" sm="6" md="4" lg="3" className="mb-3">
                            <Card className="h-100">
                              {esImagen && url ? (
                                <CardImg
                                  top
                                  src={url}
                                  alt={doc.tipo}
                                  style={{
                                    height: 180,
                                    objectFit: 'cover',
                                    width: '100%',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => setPreviewUrl(url)}
                                />
                              ) : (
                                <CardBody className="pb-0 text-muted" style={{ height: 180 }}>
                                  <i className="bi bi-file-earmark fs-1" aria-hidden />
                                </CardBody>
                              )}
                              <CardBody className="d-flex flex-column">
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                  <Badge color="secondary">{doc.tipo}</Badge>
                                  <Badge color="info">{doc.estado_archivo}</Badge>
                                  {doc.es_principal && (
                                    <Badge color="primary">Principal</Badge>
                                  )}
                                </div>
                                <div className="mt-auto d-flex flex-wrap gap-2">
                                  <Button
                                    color="primary"
                                    size="sm"
                                    disabled={guardandoEdicion || deletingId === doc.id_media}
                                    onClick={() => {
                                      setMediaEditando(doc);
                                      setEstadoArchivo(doc.estado_archivo || 'ACTIVO');
                                      setModalEditar(true);
                                    }}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    disabled={deletingId === doc.id_media}
                                    onClick={() => handleDelete(doc.id_media)}
                                  >
                                    {deletingId === doc.id_media ? (
                                      <>
                                        <Spinner size="sm" className="me-1" />
                                        Eliminando…
                                      </>
                                    ) : (
                                      'Eliminar'
                                    )}
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  )}
                </Col>
              </Row>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={!!previewUrl}
        toggle={() => setPreviewUrl(null)}
        size="lg"
        centered
      >
        <ModalHeader toggle={() => setPreviewUrl(null)} />
        <ModalBody className="text-center">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalEditar}
        toggle={() => {
          if (!guardandoEdicion) {
            setModalEditar(false);
            setMediaEditando(null);
          }
        }}
      >
        <ModalHeader
          toggle={() => {
            if (!guardandoEdicion) {
              setModalEditar(false);
              setMediaEditando(null);
            }
          }}
        >
          Editar documento
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Estado del archivo</Label>
            <Input
              type="select"
              value={estadoArchivo}
              onChange={(e) => setEstadoArchivo(e.target.value)}
              disabled={guardandoEdicion}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
              <option value="EN_PROCESO">EN PROCESO</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="ACEPTADO">ACEPTADO</option>
              <option value="COMPLETADO">COMPLETADO</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            disabled={guardandoEdicion}
            onClick={() => {
              setModalEditar(false);
              setMediaEditando(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            disabled={guardandoEdicion}
            onClick={async () => {
              if (!mediaEditando) return;

              setGuardandoEdicion(true);
              try {
                await updateMedia(mediaEditando.id_media, {
                  estado_archivo: estadoArchivo,
                });

                await Swal.fire({
                  icon: 'success',
                  title: 'Actualizado',
                  text: 'Documento actualizado correctamente',
                  timer: 1500,
                  showConfirmButton: false,
                });

                setModalEditar(false);
                setMediaEditando(null);
                await loadMedia();
              } catch (e) {
                console.error(e);

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo actualizar el documento',
                });
              } finally {
                setGuardandoEdicion(false);
              }
            }}
          >
            {guardandoEdicion ? (
              <>
                <Spinner size="sm" className="me-1" />
                Guardando…
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Documentos;
