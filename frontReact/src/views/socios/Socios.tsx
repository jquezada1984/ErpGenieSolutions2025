import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Button, Container, Row, Col, Badge, Alert, Spinner, FormGroup, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toggleEstadoSocio } from '../../_apis_/socio';
import useJwtPayload from '../../hooks/useJwtPayload';
import SelectEmpresa from '../../components/SelectEmpresa';

const GET_SOCIOS = gql`
  query GetSocios {
    socios {
      id_socio
      fecha_inicio
      fecha_fin
      estado
      socioTerceros {
        id_tercero
      }
      rol_socio {
        nombre
      }
    }
  }
`;

const GET_EMPRESAS = gql`
  query GetEmpresas {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

interface Socio {
  id_socio: string;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  estado: boolean;
  socioTerceros?: {
    id_tercero: string;
  }[] | null;
  rol_socio?: {
    nombre?: string | null;
  } | null;
}

const Socios: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaToken = payload?.id_empresa || '';
  const isGlobal = scope === 'GLOBAL';

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: !isGlobal });
  const empresas = empresasData?.empresas || [];

  const {
    data: sociosData,
    loading: queryLoading,
    error: queryError,
    refetch: refetchSocios,
  } = useQuery(GET_SOCIOS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    skip: isGlobal && !empresaSeleccionada,
    context: {
      headers: {
        'X-Company-Id': isGlobal ? empresaSeleccionada : empresaToken,
      },
    },
  });
  const socios: Socio[] = sociosData?.socios || [];

  const handleNuevoSocio = () => {
    navigate('/socios/nuevo');
  };

  const handleEdit = (id: string) => {
    navigate(`/socios/${id}/editar`);
  };

  const handleToggleEstado = async (socio: Socio) => {
    try {
      await toggleEstadoSocio(socio.id_socio);
      await refetchSocios();
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
    cantidad_terceros: socio.socioTerceros?.length || 0,
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

              {isGlobal && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_listado">Empresa</Label>
                  <SelectEmpresa
                    value={empresaSeleccionada || null}
                    onChange={(val) => setEmpresaSeleccionada(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los socios"
                  />
                </FormGroup>
              )}

              {isGlobal && !empresaSeleccionada && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los socios
                </Alert>
              )}

              {queryLoading && (
                <div className="d-flex align-items-center mb-3">
                  <Spinner size="sm" className="me-2" />
                  <span>Cargando socios...</span>
                </div>
              )}

              {queryError && (
                <Alert color="danger" className="mb-3">
                  Error al cargar los socios: {queryError.message}
                </Alert>
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
                  loading={queryLoading}
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
