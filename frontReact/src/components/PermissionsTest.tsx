import React, { useEffect } from 'react';
import { Card, CardBody, CardTitle, Alert, Badge, Spinner } from 'reactstrap';
import { usePermissions } from './authGurad/usePermissions';
import useAuth from './authGurad/useAuth';

const PermissionsTest: React.FC = () => {
  const { user } = useAuth();
  const {
    permisos,
    menuLateral,
    opcionesMenuSuperior,
    perfilCompleto,
    loading,
    error,
    cargarPerfilCompleto,
  } = usePermissions();

  useEffect(() => {
    if (user?.id_perfil) {
      cargarPerfilCompleto(user.id_perfil);
    }
  }, [user?.id_perfil, cargarPerfilCompleto]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner color="primary" />
        <p className="mt-2">Cargando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <strong>Error:</strong> {error}
      </Alert>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <CardTitle tag="h4">
                <i className="bi bi-shield-check me-2"></i>
                Prueba de Permisos - {user?.email}
              </CardTitle>

              <div className="row">
                {/* Información del Perfil */}
                <div className="col-md-6">
                  <Card className="mb-3">
                    <CardBody>
                      <h6>Información del Perfil</h6>
                      {perfilCompleto ? (
                        <div>
                          <p><strong>Perfil:</strong> {perfilCompleto.nombre}</p>
                          <p><strong>Estado:</strong> 
                            <Badge color={perfilCompleto.estado ? 'success' : 'danger'} className="ms-2">
                              {perfilCompleto.estado ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </p>
                          <p><strong>Total Permisos:</strong> {perfilCompleto.totalPermisos}</p>
                          <p><strong>Permisos Activos:</strong> {perfilCompleto.permisosActivos}</p>
                        </div>
                      ) : (
                        <p className="text-muted">No hay información del perfil</p>
                      )}
                    </CardBody>
                  </Card>
                </div>

                {/* Opciones del Menú Superior */}
                <div className="col-md-6">
                  <Card className="mb-3">
                    <CardBody>
                      <h6>Opciones del Menú Superior Disponibles</h6>
                      {opcionesMenuSuperior.length > 0 ? (
                        <div>
                          {opcionesMenuSuperior.map((opcion, index) => (
                            <Badge key={index} color="primary" className="me-2 mb-2">
                              {opcion}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No hay opciones disponibles</p>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>

              {/* Menú Lateral con Permisos */}
              <div className="row">
                <div className="col-12">
                  <Card>
                    <CardBody>
                      <h6>Menú Lateral con Permisos</h6>
                      {menuLateral.length > 0 ? (
                        <div>
                          {menuLateral.map((seccion) => (
                            <div key={seccion.id_seccion} className="mb-3">
                              <h6 className="text-primary">
                                <i className="bi bi-folder me-2"></i>
                                {seccion.nombre}
                                <Badge color="secondary" className="ms-2">
                                  {seccion.items.length} items
                                </Badge>
                              </h6>
                              <div className="ms-3">
                                {seccion.items.map((item) => (
                                  <div key={item.id_item} className="d-flex align-items-center mb-1">
                                    <i className={`${item.icono || 'bi bi-circle'} me-2`}></i>
                                    <span>{item.etiqueta}</span>
                                    {item.ruta && (
                                      <Badge color="info" className="ms-2">
                                        {item.ruta}
                                      </Badge>
                                    )}
                                    <Badge 
                                      color={item.permitido ? 'success' : 'danger'} 
                                      className="ms-2"
                                    >
                                      {item.permitido ? 'Permitido' : 'Denegado'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No hay secciones con permisos</p>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>

              {/* Lista Completa de Permisos */}
              <div className="row">
                <div className="col-12">
                  <Card>
                    <CardBody>
                      <h6>Lista Completa de Permisos</h6>
                      {permisos.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Ruta</th>
                                <th>Sección</th>
                                <th>Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {permisos.map((permiso) => (
                                <tr key={permiso.id_item}>
                                  <td>
                                    <i className={`${permiso.icono || 'bi bi-circle'} me-2`}></i>
                                    {permiso.etiqueta}
                                  </td>
                                  <td>{permiso.ruta || '-'}</td>
                                  <td>{permiso.seccion.nombre}</td>
                                  <td>
                                    <Badge color={permiso.permitido ? 'success' : 'danger'}>
                                      {permiso.permitido ? 'Permitido' : 'Denegado'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted">No hay permisos configurados</p>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTest;
