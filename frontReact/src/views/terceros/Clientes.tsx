import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Container, Row, Col, Badge, Alert } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { actualizarTercero } from '../../_apis_/tercero';

const GET_CLIENTES = gql`
  query GetClientes {
    clientes {
      id_tercero
      nombre
      apodo
      cliente
      proveedor
      cliente_potencial
      estado
      codigo_cliente
      empresa {
        id_empresa
        nombre
      }
      tipo_tercero {
        id_tipo_tercero
        nombre
      }
      asignado_a
    }
  }
`;

interface Cliente {
  id_tercero: string;
  nombre: string;
  apodo?: string;
  cliente: boolean;
  proveedor: boolean;
  cliente_potencial: boolean;
  estado: boolean;
  codigo_cliente?: string;
  empresa?: {
    id_empresa: string;
    nombre: string;
  };
  tipo_tercero?: {
    id_tipo_tercero: string;
    nombre: string;
  };
  asignado_a?: string;
}

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [getClientes, { loading: queryLoading }] = useLazyQuery(GET_CLIENTES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (location.pathname === '/terceros/clientes' || location.pathname === '/clientes') {
      loadClientes();
    }
  }, [location.pathname]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await getClientes();

      if (data && data.clientes) {
        setClientes(data.clientes);
      } else {
        setClientes([]);
      }
    } catch (err: any) {
      console.error('❌ Error cargando clientes:', err);
      setClientes([]);
      setError('Error al cargar los clientes: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoCliente = () => {
    navigate('/clientes/nuevo');
  };

  const handleEdit = (id_tercero: string) => {
    navigate(`/clientes/editar/${id_tercero}`);
  };

  const handleToggleEstado = async (cliente: Cliente) => {
    try {
      await actualizarTercero(cliente.id_tercero, { estado: !cliente.estado });
      await loadClientes();
    } catch (err: any) {
      console.error('Error actualizando estado:', err);
      setError(err?.message || 'Error al actualizar el estado');
    }
  };

  const tableData = clientes.map((item) => ({
    ...item,
    identificacion: item.codigo_cliente || item.apodo || 'N/A',
    tipo: item.tipo_tercero?.nombre || 'Cliente',
    empresa_nombre: item.empresa?.nombre || 'N/A',
    representante: item.asignado_a || 'N/A',
  }));

  const columns = [
    {
      Header: 'Nombre',
      accessor: 'nombre',
      filterable: true,
    },
    {
      Header: 'Identificación',
      accessor: 'identificacion',
      filterable: true,
    },
    {
      Header: 'Tipo de Cliente',
      accessor: 'tipo',
      filterable: true,
    },
    {
      Header: 'Empresa',
      accessor: 'empresa_nombre',
      filterable: true,
    },
    {
      Header: 'Representante',
      accessor: 'representante',
      filterable: true,
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Acciones',
      accessor: 'id_tercero',
      sortable: false,
      filterable: false,
      width: 120,
      Cell: ({ original }: any) => (
        <div className="d-flex align-items-center justify-content-center gap-2">
          <Button
            onClick={() => handleEdit(original.id_tercero)}
            color="info"
            size="sm"
            className="me-2"
            title="Editar"
          >
            <i className="bi bi-pencil-fill"></i>
          </Button>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!original.estado}
              onChange={() => handleToggleEstado(original)}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Clientes
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={handleNuevoCliente}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Cliente
                  </Button>
                </div>
              </div>

              {error && (
                <Alert color="danger" className="mb-3">
                  {error}
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
                  loading={loading || queryLoading}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Clientes;
