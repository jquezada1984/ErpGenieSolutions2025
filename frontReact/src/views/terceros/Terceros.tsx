import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Container, Row, Col, Badge, Alert } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { actualizarTercero } from '../../_apis_/tercero';

// GraphQL query para obtener terceros
const GET_TERCEROS = gql`
  query GetTerceros {
    terceros {
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

interface Tercero {
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

const Terceros: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [getTerceros, { loading: queryLoading }] = useLazyQuery(GET_TERCEROS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    loadTerceros();
  }, []);

  useEffect(() => {
    if (location.pathname === '/terceros') {
      loadTerceros();
    }
  }, [location.pathname]);

  const loadTerceros = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await getTerceros();

      if (data && data.terceros) {
        setTerceros(data.terceros);
      } else {
        setTerceros([]);
      }
    } catch (error: any) {
      console.error('❌ Error cargando terceros:', error);
      setTerceros([]);
      setError('Error al cargar los terceros: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoTercero = () => {
    navigate('/terceros/nuevo');
  };

  const handleEdit = (id: string) => {
    navigate(`/terceros/editar/${id}`);
  };

  const handleContactos = (id: string) => {
    navigate(`/terceros/${id}/contactos`);
  };

  const handleToggleEstado = async (tercero: Tercero) => {
    try {
      await actualizarTercero(tercero.id_tercero, { estado: !tercero.estado });
      await loadTerceros();
    } catch (err: any) {
      console.error('Error actualizando estado:', err);
      setError(err?.message || 'Error al actualizar el estado');
    }
  };

  const tableData = terceros.map((tercero) => {
    let tipo = '';
    if (tercero.cliente && tercero.proveedor) tipo = 'Cliente/Proveedor';
    else if (tercero.cliente) tipo = 'Cliente';
    else if (tercero.proveedor) tipo = 'Proveedor';
    else if (tercero.cliente_potencial) tipo = 'Cliente Potencial';
    else tipo = 'N/A';

    return {
      ...tercero,
      identificacion: tercero.codigo_cliente || tercero.apodo || 'N/A',
      tipo: tercero.tipo_tercero?.nombre || tipo,
      empresa_nombre: tercero.empresa?.nombre || 'N/A',
    };
  });

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
      Header: 'Tipo de Tercero',
      accessor: 'tipo',
      filterable: true,
    },
    {
      Header: 'Empresa',
      accessor: 'empresa_nombre',
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
      Cell: ({ original }: any) => {
        const activo = !!original.estado;
        return (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <Button
            onClick={() => activo && handleEdit(original.id_tercero)}
            color={activo ? 'info' : 'secondary'}
            size="sm"
            className="me-1"
            title={activo ? 'Editar' : 'Tercero inactivo: no se puede editar'}
            disabled={!activo}
          >
            <i className="bi bi-pencil-fill"></i>
          </Button>
          <Button
            onClick={() => activo && handleContactos(original.id_tercero)}
            color={activo ? 'info' : 'secondary'}
            size="sm"
            className="me-1"
            title={activo ? 'Contactos' : 'Tercero inactivo: no se puede acceder a contactos'}
            disabled={!activo}
          >
            <i className="bi bi-journal-text"></i>
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
        );
      },
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
                  Terceros
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={handleNuevoTercero}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Tercero
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

export default Terceros;
