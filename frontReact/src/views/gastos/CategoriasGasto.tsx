import React, { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SelectEmpresa from '../../components/SelectEmpresa';
import useJwtPayload from '../../hooks/useJwtPayload';
import {
  actualizarCategoriaGasto,
  cambiarEstadoCategoriaGasto,
  crearCategoriaGasto,
  extractApiError,
} from '../../_apis_/gasto';
import { GET_CATEGORIAS_GASTO, GET_EMPRESAS } from './gastosQueries';
import { CategoriaGastoFormValues, CategoriaGastoSchema } from './schemas/gastoSchema';

const CategoriasGasto: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaToken = payload?.id_empresa || '';
  const isGlobal = scope === 'GLOBAL';
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const idEmpresa = isGlobal ? empresaSeleccionada : empresaToken;
  const skip = isGlobal && !empresaSeleccionada;

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: !isGlobal });
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_CATEGORIAS_GASTO, {
    variables: { id_empresa: idEmpresa, solo_activos: false },
    skip,
    fetchPolicy: 'cache-and-network',
    context: { headers: { 'X-Company-Id': idEmpresa || '' } },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaGastoFormValues>({
    resolver: yupResolver(CategoriaGastoSchema) as any,
    defaultValues: { codigo: '', nombre: '', descripcion: '' },
  });

  const rows = useMemo(() => data?.categoriasGasto || [], [data]);

  const openNuevo = () => {
    setEditId(null);
    reset({ codigo: '', nombre: '', descripcion: '' });
    setErr(null);
    setModalOpen(true);
  };

  const openEdit = (row: any) => {
    setEditId(row.id_categoria_gasto);
    reset({
      codigo: row.codigo || '',
      nombre: row.nombre || '',
      descripcion: row.descripcion || '',
    });
    setErr(null);
    setModalOpen(true);
  };

  const onSave = async (values: CategoriaGastoFormValues) => {
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const body = {
        codigo: values.codigo.trim(),
        nombre: values.nombre.trim(),
        descripcion: values.descripcion?.trim() || null,
        ...(isGlobal ? { id_empresa: idEmpresa } : {}),
      };
      if (editId) {
        await actualizarCategoriaGasto(editId, body, idEmpresa);
        setOk('Categoría actualizada');
      } else {
        await crearCategoriaGasto(body, idEmpresa);
        setOk('Categoría creada');
      }
      setModalOpen(false);
      await refetch();
    } catch (e: any) {
      setErr(extractApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const onToggle = async (row: any) => {
    try {
      await cambiarEstadoCategoriaGasto(row.id_categoria_gasto, idEmpresa);
      await refetch();
    } catch (e: any) {
      setErr(extractApiError(e));
    }
  };

  const columns = [
    { Header: 'Código', accessor: 'codigo', filterable: true },
    { Header: 'Nombre', accessor: 'nombre', filterable: true },
    {
      Header: 'Descripción',
      accessor: 'descripcion',
      Cell: ({ value }: any) => value || '-',
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      Cell: ({ value }: any) => (
        <Badge color={value ? 'success' : 'danger'}>{value ? 'Activa' : 'Inactiva'}</Badge>
      ),
    },
    {
      Header: 'Acciones',
      accessor: 'id_categoria_gasto',
      sortable: false,
      filterable: false,
      width: 140,
      Cell: ({ original }: any) => (
        <div className="d-flex gap-2 justify-content-center align-items-center">
          <Button color="info" size="sm" onClick={() => openEdit(original)}>
            <i className="bi bi-pencil-fill" />
          </Button>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!original.estado}
              onChange={() => onToggle(original)}
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
                  Categorías de gasto
                </CardTitle>
                <div className="grid-actions d-flex gap-2">
                  <Button color="secondary" outline onClick={() => navigate('/gastos')}>
                    Volver a gastos
                  </Button>
                  <Button color="primary" disabled={skip} onClick={openNuevo}>
                    <i className="bi bi-plus-circle me-2" />
                    Nueva categoría
                  </Button>
                </div>
              </div>

              {isGlobal && (
                <FormGroup className="mb-3" style={{ maxWidth: 420 }}>
                  <Label>Empresa</Label>
                  <SelectEmpresa
                    value={empresaSeleccionada || null}
                    onChange={(v) => setEmpresaSeleccionada(v || '')}
                    empresas={empresasData?.empresas || []}
                  />
                </FormGroup>
              )}

              {skip && <Alert color="info">Seleccione una empresa.</Alert>}
              {ok && <Alert color="success">{ok}</Alert>}
              {err && <Alert color="danger">{err}</Alert>}
              {error && <Alert color="danger">{error.message}</Alert>}

              {loading && !data ? (
                <div className="text-center py-4">
                  <Spinner />
                </div>
              ) : (
                !skip && (
                  <ReactTable
                    data={rows}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    noDataText="Sin categorías"
                  />
                )
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          {editId ? 'Editar categoría' : 'Nueva categoría'}
        </ModalHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <ModalBody>
            {err && <Alert color="danger">{err}</Alert>}
            <FormGroup>
              <Label>Código *</Label>
              <Input {...register('codigo')} invalid={!!errors.codigo} />
              {errors.codigo && <FormText color="danger">{errors.codigo.message}</FormText>}
            </FormGroup>
            <FormGroup>
              <Label>Nombre *</Label>
              <Input {...register('nombre')} invalid={!!errors.nombre} />
              {errors.nombre && <FormText color="danger">{errors.nombre.message}</FormText>}
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <Input type="textarea" rows={2} {...register('descripcion')} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" outline onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Guardar'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </Container>
  );
};

export default CategoriasGasto;
