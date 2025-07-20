import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// GraphQL queries y mutations
const GET_EMPRESAS = gql`
  query GetEmpresas {
    empresas {
      id_empresa
      nombre
      ruc
      direccion
      telefono
      email
      estado
    }
  }
`;

const CREATE_EMPRESA = gql`
  mutation CreateEmpresa($nombre: String!, $ruc: String!, $direccion: String, $telefono: String, $email: String) {
    crearEmpresa(nombre: $nombre, ruc: $ruc, direccion: $direccion, telefono: $telefono, email: $email) {
      id_empresa
      nombre
      ruc
      direccion
      telefono
      email
      estado
    }
  }
`;

const UPDATE_EMPRESA = gql`
  mutation UpdateEmpresa($id_empresa: Int!, $nombre: String, $ruc: String, $direccion: String, $telefono: String, $email: String, $estado: Boolean) {
    actualizarEmpresa(
      id_empresa: $id_empresa
      nombre: $nombre
      ruc: $ruc
      direccion: $direccion
      telefono: $telefono
      email: $email
      estado: $estado
    ) {
      id_empresa
      nombre
      ruc
      direccion
      telefono
      email
      estado
    }
  }
`;

const DELETE_EMPRESA = gql`
  mutation DeleteEmpresa($id_empresa: Int!) {
    eliminarEmpresa(id_empresa: $id_empresa)
  }
`;

interface Empresa {
  id_empresa: number;
  nombre: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: boolean;
}

interface FormData {
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
}

const Empresas: React.FC = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GraphQL hooks
  const [getEmpresas, { loading: queryLoading }] = useLazyQuery(GET_EMPRESAS);
  const [createEmpresa] = useMutation(CREATE_EMPRESA);
  const [updateEmpresa] = useMutation(UPDATE_EMPRESA);
  const [deleteEmpresa] = useMutation(DELETE_EMPRESA);

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      const { data } = await getEmpresas();
      if (data) {
        setEmpresas(data.empresas);
      }
    } catch (error) {
      console.error('Error cargando empresas:', error);
      setError('Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaEmpresa = () => {
    navigate('/empresas/nueva');
  };

  const handleEdit = (empresa: Empresa) => {
    navigate(`/empresas/editar/${empresa.id_empresa}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta empresa?')) {
      try {
        await deleteEmpresa({
          variables: { id_empresa: id },
        });
        setError('Empresa eliminada exitosamente');
        loadEmpresas();
      } catch (error) {
        console.error('Error eliminando empresa:', error);
        setError('Error al eliminar la empresa');
      }
    }
  };

  // Preparar datos para ReactTable
  const tableData = empresas.map((empresa) => ({
    id: empresa.id_empresa,
    nombre: empresa.nombre,
    ruc: empresa.ruc,
    direccion: empresa.direccion || '-',
    telefono: empresa.telefono || '-',
    email: empresa.email || '-',
    estado: (
      <Badge 
        color={empresa.estado ? 'success' : 'danger'}
        className={`status-badge ${empresa.estado ? 'active' : 'inactive'}`}
      >
        {empresa.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(empresa)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleDelete(empresa.id_empresa)}
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
    {
      Header: 'ID',
      accessor: 'id',
      width: 60,
    },
    {
      Header: 'Nombre',
      accessor: 'nombre',
      filterable: true,
    },
    {
      Header: 'RUC',
      accessor: 'ruc',
      filterable: true,
    },
    {
      Header: 'Dirección',
      accessor: 'direccion',
      filterable: true,
    },
    {
      Header: 'Teléfono',
      accessor: 'telefono',
      filterable: true,
    },
    {
      Header: 'Email',
      accessor: 'email',
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
      accessor: 'actions',
      sortable: false,
      filterable: false,
      width: 120,
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
                  Empresas
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevaEmpresa}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Empresa
                  </Button>
                </div>
              </div>

              {error && (
                <Alert color="danger" toggle={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <div className="grid-container">
                <ReactTable
                  data={tableData}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  loading={loading}
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

export default Empresas; 