import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

const perfilesMock: Perfil[] = [
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', estado: true },
  { id: 2, nombre: 'Usuario', descripcion: 'Acceso limitado', estado: true },
  { id: 3, nombre: 'Invitado', descripcion: 'Solo lectura', estado: false },
];

const Perfiles: React.FC = () => {
  const navigate = useNavigate();
  const [perfiles, setPerfiles] = useState<Perfil[]>(perfilesMock);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleNuevoPerfil = () => {
    navigate('/perfiles/nueva');
  };

  const handleEdit = (perfil: Perfil) => {
    // Implementar navegación a edición si lo deseas
    alert('Funcionalidad de edición no implementada');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este perfil?')) {
      setPerfiles(prev => prev.filter(p => p.id !== id));
      setSuccess('Perfil eliminado exitosamente');
      setError(null);
    }
  };

  const tableData = perfiles.map((perfil) => ({
    id: perfil.id,
    nombre: perfil.nombre,
    descripcion: perfil.descripcion,
    estado: (
      <Badge 
        color={perfil.estado ? 'success' : 'danger'}
        className={`status-badge ${perfil.estado ? 'active' : 'inactive'}`}
      >
        {perfil.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(perfil)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleDelete(perfil.id)}
          color="danger"
          size="sm"
          title="Eliminar"
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    ),
  }));

  const columns = [
    { Header: 'ID', accessor: 'id', width: 60 },
    { Header: 'Nombre', accessor: 'nombre', filterable: true },
    { Header: 'Descripción', accessor: 'descripcion', filterable: true },
    { Header: 'Estado', accessor: 'estado', filterable: true },
    { Header: 'Acciones', accessor: 'actions', sortable: false, filterable: false, width: 120 },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Perfiles
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevoPerfil}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Perfil
                  </Button>
                </div>
              </div>

              {error && (
                <Alert color="danger" fade={false} toggle={() => setError(null)} timeout={5000}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} toggle={() => setSuccess(null)} timeout={5000}>
                  {success}
                </Alert>
              )}

              <div className="grid-container">
                <ReactTable
                  data={tableData}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  showPagination={true}
                  showPageSizeOptions={true}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageJump={true}
                  collapseOnSortingChange={true}
                  collapseOnPageChange={true}
                  collapseOnDataChange={true}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfiles; 