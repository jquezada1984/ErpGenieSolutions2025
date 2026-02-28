import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Container, Row, Col, Badge, Alert } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const GET_CONTACTOS_BY_TERCERO = gql`
  query GetContactosByTercero($id_tercero: String!) {
    contactosByTercero(id_tercero: $id_tercero) {
      id_contacto
      id_tercero
      apellidos_etiqueta
      nombre
      puesto_trabajo
      correo
      telefono_trabajo
      telefono_particular
      movil
      estado
    }
  }
`;

interface Contacto {
  id_contacto: string;
  id_tercero?: string;
  nombre?: string;
  apellidos_etiqueta?: string;
  puesto_trabajo?: string;
  correo?: string;
  telefono_trabajo?: string;
  telefono_particular?: string;
  movil?: string;
  estado: boolean;
}

const Contactos: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [getContactos, { loading: queryLoading }] = useLazyQuery(GET_CONTACTOS_BY_TERCERO, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const loadContactos = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const { data } = await getContactos({ variables: { id_tercero: id } });
      if (data?.contactosByTercero) {
        setContactos(data.contactosByTercero);
      } else {
        setContactos([]);
      }
    } catch (err: any) {
      console.error('Error cargando contactos:', err);
      setContactos([]);
      setError('Error al cargar los contactos: ' + (err?.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactos();
  }, [id]);

  const handleNuevoContacto = () => {
    navigate(`/terceros/${id}/contactos/nuevo`);
  };

  const handleEdit = (id_contacto: string) => {
    navigate(`/terceros/${id}/contactos/editar/${id_contacto}`);
  };

  const handleToggleEstado = (contacto: Contacto) => {
    // Placeholder - sin lógica aún
    console.log('Toggle estado:', contacto);
  };

  const tableData = contactos.map((item) => ({
    ...item,
    nombre_completo: `${item.nombre || ''} ${item.apellidos_etiqueta || ''}`.trim() || 'N/A',
    puesto: item.puesto_trabajo || 'N/A',
    telefono: item.movil || item.telefono_trabajo || item.telefono_particular || 'N/A',
  }));

  const columns = [
    {
      Header: 'Nombre',
      accessor: 'nombre_completo',
      filterable: true,
    },
    {
      Header: 'Puesto',
      accessor: 'puesto',
      filterable: true,
    },
    {
      Header: 'Correo',
      accessor: 'correo',
      filterable: true,
    },
    {
      Header: 'Teléfono',
      accessor: 'telefono',
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
      accessor: 'id_contacto',
      sortable: false,
      filterable: false,
      width: 120,
      Cell: ({ original }: any) => (
        <div className="d-flex align-items-center justify-content-center gap-2">
          <Button
            onClick={() => handleEdit(original.id_contacto)}
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
                  Contactos
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={handleNuevoContacto}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Contacto
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

export default Contactos;
