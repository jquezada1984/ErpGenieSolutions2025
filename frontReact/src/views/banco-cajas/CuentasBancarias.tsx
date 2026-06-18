import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
} from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery, useQuery, gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import useJwtPayload from '../../hooks/useJwtPayload';
import SelectEmpresa from '../../components/SelectEmpresa';
import { actualizarCuentaBancaria } from '../../_apis_/bancoCaja';
import { TIPOS_CUENTA } from './constants';

const GET_CUENTAS = gql`
  query GetCuentas($id_empresa: ID) {
    cuentasBancarias(id_empresa: $id_empresa) {
      id_cuenta_bancaria
      id_empresa
      referencia
      etiqueta_cuenta
      tipo_cuenta
      numero_cuenta
      saldo_actual
      estado
      estado_cuenta
      banco {
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

interface CuentaRow {
  id_cuenta_bancaria: string;
  id_empresa?: string;
  referencia?: string;
  etiqueta_cuenta?: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  saldo_actual: number;
  estado: boolean;
  banco?: { nombre?: string };
}

const labelTipo = (v: string) => TIPOS_CUENTA.find((t) => t.value === v)?.label || v;

const CuentasBancarias: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [rows, setRows] = useState<CuentaRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const [load, { loading }] = useLazyQuery(GET_CUENTAS, {
    fetchPolicy: 'network-only',
    onCompleted: (d) => setRows(d?.cuentasBancarias || []),
    onError: (e) => setError(e.message),
  });

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const loadCuentas = useCallback(
    (id_empresa: string | null) => {
      if (!id_empresa) {
        setRows([]);
        return;
      }
      setError(null);
      load({ variables: { id_empresa } });
    },
    [load],
  );

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadCuentas(idEmpresaUsuario);
    } else if (scope === 'GLOBAL') {
      setRows([]);
    }
  }, [scope, idEmpresaUsuario, loadCuentas]);

  useEffect(() => {
    if (location.pathname === '/banco-cajas/cuentas') {
      if (scope === 'EMPRESA' && idEmpresaUsuario) {
        loadCuentas(idEmpresaUsuario);
      } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
        loadCuentas(selectedIdEmpresa);
      }
    }
  }, [location.pathname, scope, idEmpresaUsuario, selectedIdEmpresa, loadCuentas]);

  const reload = useCallback(() => {
    const id = scope === 'EMPRESA' ? idEmpresaUsuario : selectedIdEmpresa || null;
    loadCuentas(id ?? null);
  }, [scope, idEmpresaUsuario, selectedIdEmpresa, loadCuentas]);

  const handleEdit = (id: string) => {
    navigate(`/banco-cajas/cuentas/editar/${id}`);
  };

  const handleToggleEstado = async (cuenta: CuentaRow) => {
    try {
      setError(null);
      await actualizarCuentaBancaria(cuenta.id_cuenta_bancaria, {
        estado: !cuenta.estado,
        id_empresa: cuenta.id_empresa,
      });
      reload();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string };
      setError(ax?.response?.data?.error || ax?.message || 'Error al actualizar el estado');
    }
  };

  const columns = [
    { Header: 'Ref.', accessor: 'referencia', filterable: true, width: 100 },
    { Header: 'Etiqueta', accessor: 'etiqueta_cuenta', filterable: true },
    {
      Header: 'Tipo',
      accessor: 'tipo_cuenta',
      filterable: true,
      Cell: ({ value }: { value: string }) => labelTipo(value),
    },
    {
      Header: 'Banco',
      id: 'banco',
      accessor: (r: CuentaRow) => r.banco?.nombre || '—',
      filterable: true,
    },
    { Header: 'Nº cuenta', accessor: 'numero_cuenta', filterable: true, width: 140 },
    {
      Header: 'Saldo',
      accessor: 'saldo_actual',
      width: 110,
      Cell: ({ value }: { value: number }) => Number(value || 0).toFixed(2),
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      filterable: true,
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      Header: 'Acciones',
      accessor: 'id_cuenta_bancaria',
      sortable: false,
      filterable: false,
      width: 160,
      Cell: ({ original }: { original: CuentaRow }) => {
        const activo = !!original.estado;
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <Button
              onClick={() =>
                activo && navigate(`/banco-cajas/cuentas/${original.id_cuenta_bancaria}/movimientos`)
              }
              color={activo ? 'primary' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Movimientos' : 'Cuenta inactiva'}
              disabled={!activo}
            >
              <i className="bi bi-list-ul" />
            </Button>
            <Button
              onClick={() => activo && handleEdit(original.id_cuenta_bancaria)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Editar' : 'Cuenta inactiva: no se puede editar'}
              disabled={!activo}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!original.estado}
                onChange={() => handleToggleEstado(original)}
                title={activo ? 'Desactivar cuenta' : 'Activar cuenta'}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const showTable =
    scope === 'EMPRESA' ? Boolean(idEmpresaUsuario) : Boolean(selectedIdEmpresa);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title mb-0">
                  <i className="fas fa-university text-primary me-2" />
                  Cuentas bancarias y cajas
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="secondary"
                    outline
                    className="me-2"
                    onClick={() => navigate('/banco-cajas/bancos')}
                  >
                    Catálogo bancos
                  </Button>
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={() =>
                      navigate('/banco-cajas/cuentas/nuevo', {
                        state:
                          scope === 'GLOBAL' && selectedIdEmpresa
                            ? { id_empresa: selectedIdEmpresa }
                            : undefined,
                      })
                    }
                    disabled={scope === 'GLOBAL' && !selectedIdEmpresa}
                    title={
                      scope === 'GLOBAL' && !selectedIdEmpresa
                        ? 'Seleccione una empresa primero'
                        : undefined
                    }
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nueva cuenta
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3 mt-3">
                  <Label for="id_empresa_listado_cuentas">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => {
                      setSelectedIdEmpresa(val ?? '');
                      if (val) loadCuentas(val);
                      else setRows([]);
                    }}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver las cuentas"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver las cuentas bancarias
                </Alert>
              )}

              {error && <Alert color="danger" className="mb-3">{error}</Alert>}

              {showTable && (
                <div className="grid-container mt-3">
                  <ReactTable
                    data={rows}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    showPagination
                    showPageSizeOptions
                    pageSizeOptions={[5, 10, 20, 50]}
                    loading={loading}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CuentasBancarias;
