import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Button, Container, Row, Col, Badge, Alert, Spinner } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toggleEstadoSocio } from '../../_apis_/socio';

const GET_SOCIOS = gql`
  query GetSocios {
    socios {
      id_socio
      fecha_inicio
      fecha_fin
      estado
      rol_socio {
        nombre
      }
    }
  }
`;

interface Socio {
  id_socio: string;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  estado: boolean;
  rol_socio?: {
    nombre?: string | null;
  } | null;
}

const Socios: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [getSocios, { loading: queryLoading }] = useLazyQuery(GET_SOCIOS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    loadSocios();
  }, []);

  useEffect(() => {
    if (location.pathname === '/socios') {
      loadSocios();
    }
  }, [location.pathname]);

  const loadSocios = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await getSocios();
      if (data && data.socios) {
        setSocios(data.socios);
      } else {
        setSocios([]);
      }
    } catch (err: any) {
      console.error('❌ Error cargando socios:', err);
      setSocios([]);
      setError('Error al cargar los socios: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoSocio = () => {
    navigate('/socios/nuevo');
  };

  const handleEdit = (id: string) => {
    navigate(`/socios/${id}/editar`);
  };

  const handleToggleEstado = async (socio: Socio) => {
    try {
      await toggleEstadoSocio(socio.id_socio);
      await loadSocios();
    } catch (err: any) {
      console.error('Error actualizando estado de socio:', err);
      setError(err?.message || 'Error al actualizar el estado');
    }
  };

  const formatFecha = (value?: string | null) => {
    if (!value) return '-';

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-');
      return `${d}/${m}/${y}`;
    }

    return value;
  };

  const tableData = socios.map((socio) => ({
    ...socio,
    rol: socio.rol_socio?.nombre || 'N/A',
    cantidad_terceros: '—',
  }));

  const columns = [
    {
      Header: 'Rol',
      accessor: 'rol',
      filterable: true,
    },
    {
      Header: 'Fecha inicio',
      accessor: 'fecha_inicio',
      Cell: ({ value }: { value?: string | null }) => formatFecha(value),
      filterable: true,
    },
    {
      Header: 'Fecha fin',
      accessor: 'fecha_fin',
      Cell: ({ value }: { value?: string | null }) => formatFecha(value),
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
      Header: 'Cantidad terceros',
      accessor: 'cantidad_terceros',
      filterable: false,
      sortable: false,
    },
    {
      Header: 'Acciones',
      accessor: 'id_socio',
      sortable: false,
      filterable: false,
      width: 120,
      Cell: ({ original }: any) => {
        const activo = !!original.estado;
        return (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <Button
              onClick={() => activo && handleEdit(original.id_socio)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-2"
              title={activo ? 'Editar' : 'Socio inactivo: no se puede editar'}
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
                  Socios
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={handleNuevoSocio}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Socio
                  </Button>
                </div>
              </div>

              {(loading || queryLoading) && (
                <div className="d-flex align-items-center mb-3">
                  <Spinner size="sm" className="me-2" />
                  <span>Cargando socios...</span>
                </div>
              )}

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

export default Socios;
