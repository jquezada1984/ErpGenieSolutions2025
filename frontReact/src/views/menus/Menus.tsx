import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

interface Menu {
  id: number;
  nombre: string;
  ruta: string;
  icono: string;
  estado: boolean;
}

const menusMock: Menu[] = [
  { id: 1, nombre: 'Dashboard', ruta: '/dashboard', icono: 'bi bi-house', estado: true },
  { id: 2, nombre: 'Empresas', ruta: '/empresas', icono: 'bi bi-building', estado: true },
  { id: 3, nombre: 'Usuarios', ruta: '/usuarios', icono: 'bi bi-people', estado: false },
];

const Menus: React.FC = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>(menusMock);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleNuevoMenu = () => {
    navigate('/menus/nueva');
  };

  const handleEdit = (menu: Menu) => {
    // Implementar navegación a edición si lo deseas
    alert('Funcionalidad de edición no implementada');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este menú?')) {
      setMenus(prev => prev.filter(m => m.id !== id));
      setSuccess('Menú eliminado exitosamente');
      setError(null);
    }
  };

  const tableData = menus.map((menu) => ({
    id: menu.id,
    nombre: menu.nombre,
    ruta: menu.ruta,
    icono: <i className={menu.icono}></i>,
    estado: (
      <Badge 
        color={menu.estado ? 'success' : 'danger'}
        className={`status-badge ${menu.estado ? 'active' : 'inactive'}`}
      >
        {menu.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(menu)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleDelete(menu.id)}
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
    { Header: 'Ruta', accessor: 'ruta', filterable: true },
    { Header: 'Icono', accessor: 'icono', filterable: false },
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
                  Menús
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevoMenu}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Menú
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

export default Menus; 