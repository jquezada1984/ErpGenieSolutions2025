import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Container, Row, Col, Badge, Alert } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { actualizarTercero } from '../../_apis_/tercero';

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

interface Proveedor {
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

const Proveedores: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [getTerceros, { loading: queryLoading }] = useLazyQuery(GET_TERCEROS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    loadProveedores();
  }, []);

  useEffect(() => {
    if (location.pathname === '/terceros/proveedores' || location.pathname === '/proveedores') {
      loadProveedores();
    }
  }, [location.pathname]);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await getTerceros();

      if (data && data.terceros) {
        const filtrados = data.terceros.filter((t: Proveedor) => t.proveedor === true);
        setProveedores(filtrados);
      } else {
        setProveedores([]);
      }
    } catch (err: any) {
      console.error('❌ Error cargando proveedores:', err);
      setProveedores([]);
      setError('Error al cargar los proveedores: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoProveedor = () => {
    navigate('/proveedores/nuevo');
  };

  const handleEdit = (id_tercero: string) => {
    navigate(`/proveedores/editar/${id_tercero}`);
  };

  const handleToggleEstado = async (proveedor: Proveedor) => {
    try {
      await actualizarTercero(proveedor.id_tercero, { estado: !proveedor.estado });
      await loadProveedores();
    } catch (err: any) {
      console.error('Error actualizando estado:', err);
      setError(err?.message || 'Error al actualizar el estado');
    }
  };

  const tableData = proveedores.map((item) => ({
    ...item,
    identificacion: item.codigo_cliente || item.apodo || 'N/A',
    tipo: item.tipo_tercero?.nombre || 'Proveedor',
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
      Header: 'Tipo de Proveedor',
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
      Cell: ({ original }: any) => {
        const activo = !!original.estado;
        return (
        <div className="d-flex align-items-center justify-content-center gap-2">
          <Button
            onClick={() => activo && handleEdit(original.id_tercero)}
            color={activo ? 'info' : 'secondary'}
            size="sm"
            className="me-2"
            title={activo ? 'Editar' : 'Proveedor inactivo: no se puede editar'}
            disabled={!activo}
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
                  Proveedores
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={handleNuevoProveedor}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Proveedor
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

export default Proveedores;
