import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
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
  FormText,
  Label,
  Input,
} from 'reactstrap';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getMediaByModule, deleteMedia, updateMedia } from '../../_apis_/media';
import { getDirectorios, createDirectorio } from '../../_apis_/directorio';
import SelectEmpresa from '../../components/SelectEmpresa';
import SearchableSelect from '../../components/SearchableSelect';
import type { SearchableSelectOption } from '../../components/SearchableSelect';
import useJwtPayload from '../../hooks/useJwtPayload';

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

const GET_TERCEROS = gql`
  query GetTercerosDocumentos($id_empresa: ID) {
    terceros(id_empresa: $id_empresa) {
      id_tercero
      nombre
    }
  }
`;

const GET_PRODUCTOS = gql`
  query GetProductosDocumentos($id_empresa: ID!) {
    productos(id_empresa: $id_empresa) {
      id_producto
      nombre
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
  id_directorio_padre?: string | null;
  padre?: { id_directorio_documento?: string } | null;
}

function padreIdDeDirectorio(d: DirectorioItem): string | null {
  const raw =
    d.id_directorio_padre ?? d.padre?.id_directorio_documento ?? null;
  if (raw === undefined || raw === null || raw === '') return null;
  return String(raw);
}

const Documentos: React.FC = () => {
  const usuario = useJwtPayload();
  const scope = usuario?.scope_acceso || 'EMPRESA';
  const [searchParams] = useSearchParams();
  const empresaIdFromUrlRaw = searchParams.get('empresa_id');
  const empresaIdFromUrl =
    empresaIdFromUrlRaw && empresaIdFromUrlRaw !== 'undefined'
      ? empresaIdFromUrlRaw
      : undefined;
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string | null>(empresaIdFromUrl || null);
  const empresaActiva =
    scope === 'GLOBAL' ? empresaSeleccionada : usuario?.id_empresa;
  const moduleFromUrl = searchParams.get('module');
  const moduleIdFromUrl = searchParams.get('module_id');
  const isContextLocked = !!(moduleFromUrl && moduleIdFromUrl);
  const isEmpresaLocked = scope === 'GLOBAL' && isContextLocked;
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string>(moduleFromUrl || '');
  const [moduleIdSeleccionado, setModuleIdSeleccionado] = useState<string>(moduleIdFromUrl || '');
  const [opcionesModulo, setOpcionesModulo] = useState<SearchableSelectOption[]>([]);
  const [loadingOpciones, setLoadingOpciones] = useState(false);
  const { data: empresasData, loading: loadingEmpresas } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];
  const [loadTerceros] = useLazyQuery(GET_TERCEROS, { fetchPolicy: 'network-only' });
  const [loadProductos] = useLazyQuery(GET_PRODUCTOS, { fetchPolicy: 'network-only' });

  const [documentos, setDocumentos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [directorios, setDirectorios] = useState<DirectorioItem[]>([]);
  const [currentDirectorioId, setCurrentDirectorioId] = useState<string | null>(null);
  const [stackDirectorios, setStackDirectorios] = useState<DirectorioItem[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [mediaEditando, setMediaEditando] = useState<MediaItem | null>(null);
  const [estadoArchivo, setEstadoArchivo] = useState('');
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  useEffect(() => {
    if (scope === 'GLOBAL' && empresaIdFromUrl) {
      setEmpresaSeleccionada(empresaIdFromUrl);
    }
  }, [scope, empresaIdFromUrl]);

  useEffect(() => {
    setModuloSeleccionado(moduleFromUrl || '');
    setModuleIdSeleccionado(moduleIdFromUrl || '');
    setCurrentDirectorioId(null);
    setStackDirectorios([]);
  }, [moduleFromUrl, moduleIdFromUrl]);

  const resetCarpetas = useCallback(() => {
    setCurrentDirectorioId(null);
    setStackDirectorios([]);
  }, []);

  const directoriosActuales = useMemo(() => {
    return directorios.filter((d) => {
      const padre = padreIdDeDirectorio(d);
      if (currentDirectorioId) {
        return padre === currentDirectorioId;
      }
      return padre == null;
    });
  }, [directorios, currentDirectorioId]);

  useEffect(() => {
    if (isContextLocked) {
      return;
    }
    if (!moduloSeleccionado || !empresaActiva) {
      setOpcionesModulo([]);
      setLoadingOpciones(false);
      return;
    }

    let cancelled = false;
    setLoadingOpciones(true);
    setOpcionesModulo([]);

    if (moduloSeleccionado === 'tercero') {
      loadTerceros({ variables: { id_empresa: empresaActiva } })
        .then((res) => {
          if (cancelled) return;
          if (res.error) {
            setOpcionesModulo([]);
            return;
          }
          const data = res.data?.terceros || [];
          setOpcionesModulo(
            data.map((t: { id_tercero: string; nombre?: string }) => ({
              value: t.id_tercero,
              label: `${t.nombre ?? ''} (${String(t.id_tercero).slice(0, 6)})`,
            })),
          );
        })
        .catch(() => {
          if (!cancelled) setOpcionesModulo([]);
        })
        .finally(() => {
          if (!cancelled) setLoadingOpciones(false);
        });
    } else if (moduloSeleccionado === 'producto') {
      loadProductos({ variables: { id_empresa: empresaActiva } })
        .then((res) => {
          if (cancelled) return;
          if (res.error) {
            setOpcionesModulo([]);
            return;
          }
          const data = res.data?.productos || [];
          setOpcionesModulo(
            data.map((p: { id_producto: string; nombre?: string }) => ({
              value: p.id_producto,
              label: `${p.nombre ?? ''} (${String(p.id_producto).slice(0, 6)})`,
            })),
          );
        })
        .catch(() => {
          if (!cancelled) setOpcionesModulo([]);
        })
        .finally(() => {
          if (!cancelled) setLoadingOpciones(false);
        });
    } else {
      setLoadingOpciones(false);
      setOpcionesModulo([]);
    }

    return () => {
      cancelled = true;
    };
  }, [
    moduloSeleccionado,
    empresaActiva,
    isContextLocked,
    loadTerceros,
    loadProductos,
  ]);

  const loadMedia = useCallback(async () => {
    if (!moduloSeleccionado || !moduleIdSeleccionado || !empresaActiva) {
      setDocumentos([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const list = await getMediaByModule(
        moduloSeleccionado,
        moduleIdSeleccionado,
        currentDirectorioId || undefined,
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
    currentDirectorioId,
    empresaActiva,
  ]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const loadDirectorios = useCallback(async () => {
    if (!moduloSeleccionado || !empresaActiva) {
      setDirectorios([]);
      return;
    }
    try {
      const data = await getDirectorios(moduloSeleccionado, empresaActiva || undefined);
      setDirectorios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando directorios', error);
    }
  }, [moduloSeleccionado, empresaActiva]);

  useEffect(() => {
    loadDirectorios();
  }, [loadDirectorios]);

  const handleCrearDirectorio = async () => {
    if (!nuevoNombre.trim()) return;
    if (!moduloSeleccionado) return;
    if (!empresaActiva) return;

    setLoadingCreate(true);

    try {
      const nuevaCarpeta = nuevoNombre.trim();
      const payload = {
        nombre: nuevaCarpeta,
        modulo: moduloSeleccionado,
        tipo_directorio: 'MANUAL',
        ...(currentDirectorioId && {
          id_directorio_padre: currentDirectorioId,
        }),
      };

      console.log('currentDirectorioId:', currentDirectorioId);
      console.log('CREANDO DIRECTORIO:', payload);

      await createDirectorio(payload, empresaActiva || undefined);

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

              {scope === 'GLOBAL' && (
                <Row className="mb-3">
                  <Col md={4}>
                    <FormGroup>
                      <Label>Empresa</Label>
                      <SelectEmpresa
                        value={empresaSeleccionada}
                        onChange={(empresa) => {
                          if (isEmpresaLocked) return;

                          setEmpresaSeleccionada(empresa);
                          resetCarpetas();
                          setModuleIdSeleccionado('');
                          setOpcionesModulo([]);
                        }}
                        empresas={empresas}
                        isLoading={loadingEmpresas}
                        isDisabled={isEmpresaLocked || loadingEmpresas}
                        placeholder="Seleccionar empresa"
                      />
                      {isEmpresaLocked && (
                        <FormText color="muted">
                          Empresa bloqueada por contexto de navegación
                        </FormText>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              )}

              {scope === 'GLOBAL' && !empresaSeleccionada ? (
                <Alert color="info" className="mb-0">
                  Seleccione una empresa
                </Alert>
              ) : (
                <>
                  {!isContextLocked && !moduloSeleccionado && (
                    <Alert color="info" className="mb-3">
                      Seleccione un modulo para ver documentos
                    </Alert>
                  )}

                  {isContextLocked ? (
                    <Row className="mb-3">
                      <Col md={4}>
                        <FormGroup>
                          <Label>Modulo</Label>
                          <Input value={moduloSeleccionado} disabled />
                        </FormGroup>
                      </Col>
                      <Col md={8}>
                        <FormGroup>
                          <Label>Entidad</Label>
                          <Input value={moduleIdSeleccionado} disabled />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="mb-3">
                      <Col md={4}>
                        <FormGroup>
                          <Label>Modulo</Label>
                          <Input
                            type="select"
                            value={moduloSeleccionado}
                            onChange={(e) => {
                              setModuloSeleccionado(e.target.value);
                              setModuleIdSeleccionado('');
                              resetCarpetas();
                            }}
                          >
                            <option value="">Seleccione</option>
                            <option value="tercero">Tercero</option>
                            <option value="producto">Producto</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={8}>
                        <FormGroup>
                          <Label>Entidad</Label>
                          <SearchableSelect
                            options={opcionesModulo}
                            value={moduleIdSeleccionado || null}
                            onChange={(val) => {
                              setModuleIdSeleccionado(val || '');
                              resetCarpetas();
                            }}
                            isDisabled={!moduloSeleccionado || !empresaActiva}
                            isLoading={loadingOpciones}
                            placeholder="Seleccione una entidad"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}

                  {!isContextLocked &&
                    moduloSeleccionado &&
                    !moduleIdSeleccionado &&
                    empresaActiva && (
                      <Alert color="info" className="mb-3">
                        Seleccione una entidad para listar documentos
                      </Alert>
                    )}

                  {empresaActiva && moduloSeleccionado && moduleIdSeleccionado ? (
              <Row>
                <Col md={3} className="mb-3 mb-md-0">
                  <Card>
                    <CardBody>
                      <h6 className="mb-2">Directorios</h6>
                      <div
                        className="small text-muted mb-2"
                        style={{ cursor: 'default' }}
                      >
                        <span
                          role="button"
                          tabIndex={0}
                          className="text-primary"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setStackDirectorios([]);
                            setCurrentDirectorioId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setStackDirectorios([]);
                              setCurrentDirectorioId(null);
                            }
                          }}
                        >
                          Documentos
                        </span>
                        {stackDirectorios.map((d, index) => (
                          <React.Fragment key={d.id_directorio_documento}>
                            <span className="mx-1">/</span>
                            <span
                              role="button"
                              tabIndex={0}
                              className="text-primary"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const newStack = stackDirectorios.slice(0, index + 1);
                                setStackDirectorios(newStack);
                                setCurrentDirectorioId(d.id_directorio_documento);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  const newStack = stackDirectorios.slice(0, index + 1);
                                  setStackDirectorios(newStack);
                                  setCurrentDirectorioId(d.id_directorio_documento);
                                }
                              }}
                            >
                              {d.nombre}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                      {stackDirectorios.length > 0 && (
                        <Button
                          color="secondary"
                          size="sm"
                          className="mb-2 w-100"
                          onClick={() => {
                            const newStack = [...stackDirectorios];
                            newStack.pop();
                            setStackDirectorios(newStack);
                            setCurrentDirectorioId(
                              newStack.length > 0
                                ? newStack[newStack.length - 1].id_directorio_documento
                                : null,
                            );
                          }}
                        >
                          ← Volver
                        </Button>
                      )}
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
                        {directoriosActuales.map((dir) => (
                          <li
                            key={dir.id_directorio_documento}
                            className="list-group-item d-flex align-items-center gap-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setStackDirectorios((prev) => [...prev, dir]);
                              setCurrentDirectorioId(dir.id_directorio_documento);
                            }}
                          >
                            <span aria-hidden>📁</span>
                            <span>{dir.nombre}</span>
                          </li>
                        ))}
                      </ul>
                      {directoriosActuales.length === 0 && (
                        <p className="text-muted small mb-0 mt-2">
                          No hay subcarpetas en esta ubicación
                        </p>
                      )}
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
                  ) : null}
                </>
              )}
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
