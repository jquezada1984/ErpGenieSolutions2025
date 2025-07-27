import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: boolean;
}

const sucursalesMock: Sucursal[] = [
  { id: 1, nombre: 'Sucursal Lima', direccion: 'Av. Principal 123', telefono: '999999999', email: 'lima@sucursal.com', estado: true },
  { id: 2, nombre: 'Sucursal Arequipa', direccion: 'Calle Secundaria 456', telefono: '988888888', email: 'arequipa@sucursal.com', estado: false },
];

const Sucursales: React.FC = () => {
  const navigate = useNavigate();
  const [sucursales, setSucursales] = useState<Sucursal[]>(sucursalesMock);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleNuevaSucursal = () => {
    navigate('/sucursales/nueva');
  };

  const handleEdit = (sucursal: Sucursal) => {
    navigate(`/sucursales/editar/${sucursal.id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sucursal?')) {
      setSucursales(prev => prev.filter(s => s.id !== id));
      setSuccess('Sucursal eliminada exitosamente');
      setError(null);
    }
  };

  const tableData = sucursales.map((sucursal) => ({
    id: sucursal.id,
    nombre: sucursal.nombre,
    direccion: sucursal.direccion,
    telefono: sucursal.telefono,
    email: sucursal.email,
    estado: (
      <Badge 
        color={sucursal.estado ? 'success' : 'danger'}
        className={`status-badge ${sucursal.estado ? 'active' : 'inactive'}`}
      >
        {sucursal.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(sucursal)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleDelete(sucursal.id)}
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
    { Header: 'Dirección', accessor: 'direccion', filterable: true },
    { Header: 'Teléfono', accessor: 'telefono', filterable: true },
    { Header: 'Email', accessor: 'email', filterable: true },
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
                  Sucursales
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevaSucursal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Sucursal
                  </Button>
                </div>
              </div>

                      {error && (
          <Alert color="danger" fade={false} isOpen={!!error} toggle={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" fade={false} isOpen={!!success} toggle={() => setSuccess(null)}>
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

export default Sucursales; 