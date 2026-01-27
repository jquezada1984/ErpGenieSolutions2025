import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Row, Col, Badge, Spinner } from 'reactstrap';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';

// Consulta GraphQL para obtener el menú completo con permisos del perfil
const GET_MENU_CON_PERMISOS = gql`
  query GetMenuConPermisos($id_perfil: ID!) {
    perfilConPermisos(id_perfil: $id_perfil) {
      id_perfil
      nombre
      estado
      totalPermisos
      permisosActivos
      secciones {
        id_seccion
        nombre
        orden
        icono
        tienePermisos
        items {
          id_item
          etiqueta
          ruta
          icono
          permitido
          seccion {
            id_seccion
            nombre
            orden
          }
        }
      }
    }
  }
`;

// Mutations para actualizar permisos
const CREAR_PERMISO = gql`
  mutation CrearPermisoMenu($id_perfil: ID!, $id_item: ID!, $permitido: Boolean!) {
    crearPermisoMenu(id_perfil: $id_perfil, id_item: $id_item, permitido: $permitido) {
      id_perfil
      id_item
      permitido
    }
  }
`;

const ACTUALIZAR_PERMISO = gql`
  mutation ActualizarPermisoMenu($id_perfil: ID!, $id_item: ID!, $permitido: Boolean!) {
    actualizarPermisoMenu(id_perfil: $id_perfil, id_item: $id_item, permitido: $permitido) {
      id_perfil
      id_item
      permitido
    }
  }
`;

const ELIMINAR_PERMISO = gql`
  mutation EliminarPermisoMenu($id_perfil: ID!, $id_item: ID!) {
    eliminarPermisoMenu(id_perfil: $id_perfil, id_item: $id_item)
  }
`;

const CREAR_PERMISOS_MASIVOS = gql`
  mutation CrearPermisosMasivos($id_perfil: ID!, $ids_items: [ID!]!, $permitido: Boolean!) {
    crearPermisosMasivos(id_perfil: $id_perfil, ids_items: $ids_items, permitido: $permitido) {
      id_perfil
      id_item
      permitido
    }
  }
`;

interface MenuItem {
  id_item: string;
  etiqueta: string;
  ruta?: string;
  icono?: string;
  permitido: boolean;
  seccion: {
    id_seccion: string;
    nombre: string;
    orden: number;
  };
}

interface SeccionConPermisos {
  id_seccion: string;
  nombre: string;
  orden: number;
  icono?: string;
  tienePermisos: boolean;
  items: MenuItem[];
}

interface PerfilConPermisos {
  id_perfil: string;
  nombre: string;
  estado: boolean;
  totalPermisos: number;
  permisosActivos: number;
  secciones: SeccionConPermisos[];
}

interface PermisosMenuProps {
  idPerfil: string;
  onPermisosChange?: (permisos: any[]) => void;
}

const PermisosMenu: React.FC<PermisosMenuProps> = ({ idPerfil, onPermisosChange }) => {
  const [permisos, setPermisos] = useState<{ [key: string]: boolean }>({});
  const [permisosOriginales, setPermisosOriginales] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string>('');
  const [mostrarTodasLasSecciones, setMostrarTodasLasSecciones] = useState(false);

  // Mutations
  const [crearPermiso] = useMutation(CREAR_PERMISO);
  const [actualizarPermiso] = useMutation(ACTUALIZAR_PERMISO);
  const [eliminarPermiso] = useMutation(ELIMINAR_PERMISO);
  const [crearPermisosMasivos] = useMutation(CREAR_PERMISOS_MASIVOS);

  // Consulta GraphQL para obtener el menú con permisos
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery(GET_MENU_CON_PERMISOS, {
    variables: { id_perfil: idPerfil },
    skip: !idPerfil,
    errorPolicy: 'all'
  });

  // Inicializar permisos cuando los datos estén disponibles (después de que el componente se monte)
  useEffect(() => {
    if (data?.perfilConPermisos) {
      const perfil = data.perfilConPermisos;
      // Debug: mostrar todas las secciones recibidas
      console.log('🔍 DEBUG - Secciones recibidas:', perfil.secciones.map((s: SeccionConPermisos) => ({
        nombre: s.nombre,
        id_seccion: s.id_seccion,
        totalItems: s.items.length,
        tienePermisos: s.tienePermisos
      })));
      
      // Inicializar permisos desde los datos
      const permisosIniciales: { [key: string]: boolean } = {};
      perfil.secciones.forEach((seccion: SeccionConPermisos) => {
        seccion.items.forEach((item: MenuItem) => {
          permisosIniciales[item.id_item] = item.permitido;
        });
      });
      setPermisos(permisosIniciales);
      setPermisosOriginales(permisosIniciales);
    }
  }, [data]);

  // Manejar errores de la consulta
  useEffect(() => {
    if (queryError) {
      setError(queryError.message || 'Error al cargar los permisos del menú');
    }
  }, [queryError]);

  const handlePermisoChange = (idItem: string, permitido: boolean) => {
    setPermisos(prev => ({
      ...prev,
      [idItem]: permitido
    }));
  };

  const handleSeccionToggle = (idSeccion: string, permitido: boolean) => {
    if (data?.perfilConPermisos) {
      const seccion = data.perfilConPermisos.secciones.find((s: SeccionConPermisos) => s.id_seccion === idSeccion);
      if (seccion) {
        const nuevosPermisos = { ...permisos };
        seccion.items.forEach((item: MenuItem) => {
          nuevosPermisos[item.id_item] = permitido;
        });
        setPermisos(nuevosPermisos);
      }
    }
  };

  const handleGuardarPermisos = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Identificar cambios: nuevos permisos, actualizaciones y eliminaciones
      const nuevosPermisos: string[] = [];
      const permisosActualizar: Array<{ id_item: string; permitido: boolean }> = [];
      const permisosEliminar: string[] = [];

      Object.keys(permisos).forEach(id_item => {
        const permitido = permisos[id_item];
        const originalPermitido = permisosOriginales[id_item];

        if (originalPermitido === undefined) {
          // Es un permiso nuevo
          if (permitido) {
            nuevosPermisos.push(id_item);
          }
        } else if (originalPermitido !== permitido) {
          // El permiso cambió
          if (permitido) {
            permisosActualizar.push({ id_item, permitido: true });
          } else {
            permisosEliminar.push(id_item);
          }
        }
      });

      // También eliminar permisos que estaban antes pero ya no están
      Object.keys(permisosOriginales).forEach(id_item => {
        if (permisos[id_item] === undefined && permisosOriginales[id_item]) {
          permisosEliminar.push(id_item);
        }
      });

      // Ejecutar mutations
      const promises: Promise<any>[] = [];

      // Crear nuevos permisos masivamente si hay muchos
      if (nuevosPermisos.length > 0) {
        if (nuevosPermisos.length > 10) {
          promises.push(
            crearPermisosMasivos({
              variables: {
                id_perfil: idPerfil,
                ids_items: nuevosPermisos,
                permitido: true
              }
            })
          );
        } else {
          nuevosPermisos.forEach(id_item => {
            promises.push(
              crearPermiso({
                variables: {
                  id_perfil: idPerfil,
                  id_item,
                  permitido: true
                }
              })
            );
          });
        }
      }

      // Actualizar permisos existentes
      // Usar crearPermisoMenu en lugar de actualizarPermisoMenu porque crearPermisoMenu
      // maneja automáticamente el caso de permisos existentes (los actualiza)
      permisosActualizar.forEach(({ id_item, permitido }) => {
        promises.push(
          crearPermiso({
            variables: {
              id_perfil: idPerfil,
              id_item,
              permitido
            }
          })
        );
      });

      // Eliminar permisos
      permisosEliminar.forEach(id_item => {
        promises.push(
          eliminarPermiso({
            variables: {
              id_perfil: idPerfil,
              id_item
            }
          })
        );
      });

      // Verificar si hay cambios antes de ejecutar
      if (nuevosPermisos.length === 0 && permisosActualizar.length === 0 && permisosEliminar.length === 0) {
        setSuccess('No hay cambios para guardar');
        setLoading(false);
        return;
      }

      console.log('📝 Guardando permisos:', {
        nuevos: nuevosPermisos.length,
        actualizar: permisosActualizar.length,
        eliminar: permisosEliminar.length
      });

      // Ejecutar todas las mutations
      const resultados = await Promise.allSettled(promises);
      
      // Verificar si hubo errores
      const errores = resultados.filter(r => r.status === 'rejected');
      if (errores.length > 0) {
        const mensajesError = errores.map((e: any) => {
          const error = e.reason;
          return error?.response?.data?.errors?.[0]?.message || error?.message || 'Error desconocido';
        });
        throw new Error(`Error al guardar algunos permisos: ${mensajesError.join(', ')}`);
      }

      // Actualizar permisos originales
      setPermisosOriginales({ ...permisos });
      
      const mensaje = `Permisos guardados exitosamente. ${nuevosPermisos.length} nuevos, ${permisosActualizar.length} actualizados, ${permisosEliminar.length} eliminados.`;
      setSuccess(mensaje);
      console.log('✅', mensaje);
      
      // Refrescar datos después de un breve delay para asegurar que la BD se actualizó
      setTimeout(() => {
        refetch();
      }, 500);
      
      if (onPermisosChange) {
        const permisosArray = Object.entries(permisos)
          .filter(([_, permitido]) => permitido)
          .map(([id_item, permitido]) => ({ id_item, permitido }));
        onPermisosChange(permisosArray);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.errors?.[0]?.message || 
                          err?.response?.data?.error || 
                          err?.message || 
                          'Error al guardar los permisos';
      setError(errorMessage);
      console.error('❌ Error al guardar permisos:', err);
      console.error('❌ Detalles del error:', {
        message: err?.message,
        response: err?.response?.data,
        stack: err?.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (data?.perfilConPermisos) {
      const nuevosPermisos: { [key: string]: boolean } = {};
      data.perfilConPermisos.secciones.forEach((seccion: SeccionConPermisos) => {
        seccion.items.forEach((item: MenuItem) => {
          nuevosPermisos[item.id_item] = true;
        });
      });
      setPermisos(nuevosPermisos);
    }
  };

  const handleSelectNone = () => {
    if (data?.perfilConPermisos) {
      const nuevosPermisos: { [key: string]: boolean } = {};
      data.perfilConPermisos.secciones.forEach((seccion: SeccionConPermisos) => {
        seccion.items.forEach((item: MenuItem) => {
          nuevosPermisos[item.id_item] = false;
        });
      });
      setPermisos(nuevosPermisos);
    }
  };

  if (queryLoading) {
    return (
      <Card>
        <CardBody className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Cargando permisos del menú...</p>
        </CardBody>
      </Card>
    );
  }

  if (queryError || !data?.perfilConPermisos) {
    return (
      <Card>
        <CardBody>
          <Alert color="danger" fade={false} timeout={0}>
            <h5>Error al cargar permisos</h5>
            <p>{queryError?.message || 'No se pudieron cargar los permisos del menú'}</p>
            <Button color="primary" onClick={() => refetch()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reintentar
            </Button>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  const perfil = data.perfilConPermisos as PerfilConPermisos;

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <CardTitle tag="h5" className="mb-0">
            <i className="bi bi-shield-check me-2"></i>
            Permisos de Menú
          </CardTitle>
          <div className="d-flex gap-2">
            <Button 
              color={mostrarTodasLasSecciones ? "info" : "outline-info"} 
              size="sm" 
              onClick={() => setMostrarTodasLasSecciones(!mostrarTodasLasSecciones)}
            >
              <i className={`bi bi-${mostrarTodasLasSecciones ? 'eye-slash' : 'eye'} me-2`}></i>
              {mostrarTodasLasSecciones ? 'Ocultar Sin Permisos' : 'Mostrar Todas las Opciones'}
            </Button>
            <Button color="outline-primary" size="sm" onClick={handleSelectAll}>
              <i className="bi bi-check-all me-2"></i>
              Seleccionar Todo
            </Button>
            <Button color="outline-secondary" size="sm" onClick={handleSelectNone}>
              <i className="bi bi-x-square me-2"></i>
              Deseleccionar Todo
            </Button>
            <Button color="primary" onClick={handleGuardarPermisos} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Guardar Permisos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resumen de permisos */}
        <Alert color="info" fade={false} className="mb-3" timeout={0}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Resumen de Permisos:</strong>
              <span className="ms-2">
                <Badge color="success">{perfil.permisosActivos}</Badge> de <Badge color="primary">{perfil.totalPermisos}</Badge> permisos activos
              </span>
            </div>
            <div>
              <small className="text-muted">
                {Math.round((perfil.permisosActivos / perfil.totalPermisos) * 100)}% de permisos asignados
              </small>
            </div>
          </div>
        </Alert>

        {error && (
          <Alert color="danger" fade={false} className="mb-3" timeout={0}>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" fade={false} className="mb-3" timeout={0}>
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </Alert>
        )}

        {/* Lista de secciones con permisos */}
        <Accordion open={openAccordion} toggle={(id) => setOpenAccordion(id === openAccordion ? '' : id)}>
          {perfil.secciones
            .filter(seccion => {
              // Si mostrarTodasLasSecciones está activo, mostrar todas las secciones
              if (mostrarTodasLasSecciones) {
                return true;
              }
              // Si no, mostrar solo las que tienen permisos o items con permisos asignados
              return seccion.tienePermisos || seccion.items.some(item => permisos[item.id_item]);
            })
            .map((seccion) => {
            const itemsConPermisos = seccion.items.filter(item => permisos[item.id_item]);
            const totalItems = seccion.items.length;
            const porcentajePermisos = totalItems > 0 ? Math.round((itemsConPermisos.length / totalItems) * 100) : 0;

            return (
              <AccordionItem key={seccion.id_seccion}>
                <AccordionHeader targetId={seccion.id_seccion}>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <div className="d-flex align-items-center">
                      {seccion.icono && <i className={`${seccion.icono} me-2`}></i>}
                      <strong>{seccion.nombre}</strong>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge color={porcentajePermisos > 0 ? 'success' : 'secondary'}>
                        {itemsConPermisos.length}/{totalItems}
                      </Badge>
                      <Badge color={porcentajePermisos === 100 ? 'success' : porcentajePermisos > 0 ? 'warning' : 'secondary'}>
                        {porcentajePermisos}%
                      </Badge>
                    </div>
                  </div>
                </AccordionHeader>
                <div className="d-flex justify-content-end gap-2 p-2 bg-light border-bottom">
                  <Button
                    color="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeccionToggle(seccion.id_seccion, true);
                    }}
                    title="Seleccionar toda la sección"
                  >
                    <i className="bi bi-check"></i> Seleccionar todo
                  </Button>
                  <Button
                    color="outline-secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeccionToggle(seccion.id_seccion, false);
                    }}
                    title="Deseleccionar toda la sección"
                  >
                    <i className="bi bi-x"></i> Deseleccionar todo
                  </Button>
                </div>
                <AccordionBody accordionId={seccion.id_seccion}>
                  <Row>
                    {seccion.items.map((item) => (
                      <Col key={item.id_item} md={6} lg={4} className="mb-3">
                        <div className="d-flex align-items-center p-2 border rounded">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`permiso-${item.id_item}`}
                              checked={permisos[item.id_item] || false}
                              onChange={(e) => handlePermisoChange(item.id_item, e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={`permiso-${item.id_item}`}>
                              <strong>{item.etiqueta}</strong>
                            </label>
                          </div>
                          <div className="flex-grow-1">
                            {item.icono && <i className={`${item.icono} me-2`}></i>}
                            {item.ruta && (
                              <small className="text-muted d-block">
                                <i className="bi bi-link-45deg me-1"></i>
                                {item.ruta}
                              </small>
                            )}
                          </div>
                          <Badge color={permisos[item.id_item] ? 'success' : 'secondary'} size="sm">
                            {permisos[item.id_item] ? 'Permitido' : 'Denegado'}
                          </Badge>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </Accordion>

        {perfil.secciones.length === 0 && (
          <div className="text-center p-4 text-muted">
            <i className="bi bi-inbox fs-3"></i>
            <p className="mt-2">No hay secciones de menú disponibles</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PermisosMenu;











