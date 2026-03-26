import React, { useState, useEffect, useCallback } from 'react';
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
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { getMediaByModule, deleteMedia } from '../../_apis_/media';

/** UUID de tercero de prueba: sustituir por un `id_tercero` real (p. ej. desde el listado). */
const TERCERO_PRUEBA_MODULE_ID = '51e6bbe1-a1ad-4766-ba07-65cddcc7b58a';

interface MediaItem {
  id_media: string;
  tipo: string;
  estado_archivo: string;
  es_principal: boolean;
  url?: string;
  file?: { url?: string };
}

const Documentos: React.FC = () => {
  const [documentos, setDocumentos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getMediaByModule('tercero', TERCERO_PRUEBA_MODULE_ID);
      setDocumentos(Array.isArray(list) ? list : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cargar documentos';
      setError(msg);
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const resolveUrl = (doc: MediaItem) => doc.file?.url ?? doc.url ?? '';

  const handleDelete = async (id_media: string) => {
    const confirmado = window.confirm('¿Seguro que deseas eliminar este documento?');
    if (!confirmado) return;

    setDeletingId(id_media);
    setError(null);
    try {
      await deleteMedia(id_media);
      await loadMedia();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al eliminar';
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

              <Row>
                <Col md={3} className="mb-3 mb-md-0">
                  <Card>
                    <CardBody>
                      <h6 className="mb-0">Directorios</h6>
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
                                <div className="mt-auto">
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
    </Container>
  );
};

export default Documentos;
