import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Badge,
} from 'reactstrap';
import { useLazyQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

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
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [modal, setModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // GraphQL hooks
  const [getEmpresas, { loading }] = useLazyQuery(GET_EMPRESAS);
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
      setAlert({ type: 'danger', message: 'Error al cargar las empresas' });
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingEmpresa(null);
      setFormData({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        email: '',
      });
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nombre: empresa.nombre,
      ruc: empresa.ruc,
      direccion: empresa.direccion || '',
      telefono: empresa.telefono || '',
      email: empresa.email || '',
    });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEmpresa) {
        // Actualizar empresa
        await updateEmpresa({
          variables: {
            id_empresa: editingEmpresa.id_empresa,
            ...formData,
          },
        });
        setAlert({ type: 'success', message: 'Empresa actualizada exitosamente' });
      } else {
        // Crear nueva empresa
        await createEmpresa({
          variables: formData,
        });
        setAlert({ type: 'success', message: 'Empresa creada exitosamente' });
      }
      
      toggleModal();
      loadEmpresas();
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'danger', message: 'Error al procesar la empresa' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta empresa?')) {
      try {
        await deleteEmpresa({
          variables: { id_empresa: id },
        });
        setAlert({ type: 'success', message: 'Empresa eliminada exitosamente' });
        loadEmpresas();
      } catch (error) {
        console.error('Error eliminando empresa:', error);
        setAlert({ type: 'danger', message: 'Error al eliminar la empresa' });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h4" className="mb-0">
                  Mantenimiento de Empresas
                </CardTitle>
                <Button color="primary" onClick={toggleModal}>
                  <i className="fas fa-plus me-2"></i>
                  Nueva Empresa
                </Button>
              </div>

              {alert && (
                <Alert color={alert.type} toggle={() => setAlert(null)}>
                  {alert.message}
                </Alert>
              )}

              <div className="table-responsive">
                <Table className="table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>RUC</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          Cargando...
                        </td>
                      </tr>
                    ) : empresas.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No hay empresas registradas
                        </td>
                      </tr>
                    ) : (
                      empresas.map((empresa) => (
                        <tr key={empresa.id_empresa}>
                          <td>{empresa.id_empresa}</td>
                          <td>{empresa.nombre}</td>
                          <td>{empresa.ruc}</td>
                          <td>{empresa.direccion || '-'}</td>
                          <td>{empresa.telefono || '-'}</td>
                          <td>{empresa.email || '-'}</td>
                          <td>
                            <Badge color={empresa.estado ? 'success' : 'danger'}>
                              {empresa.estado ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(empresa)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(empresa.id_empresa)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear/editar empresa */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="ruc">RUC *</Label>
                  <Input
                    id="ruc"
                    name="ruc"
                    type="text"
                    value={formData.ruc}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              {editingEmpresa ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
};

export default Empresas; 