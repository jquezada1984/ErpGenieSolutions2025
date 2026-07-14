import React, { useCallback, useEffect, useState } from 'react';
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
import { eliminarTransferenciaBancaria } from '../../_apis_/bancoCaja';
import { labelTipoPagoTransferencia } from './constants';

const GET_TRANSFERENCIAS = gql`
  query GetTransferencias($id_empresa: ID, $soloActivos: Boolean) {
    transferenciasBancarias(id_empresa: $id_empresa, soloActivos: $soloActivos) {
      id_transferencia_bancaria
      id_empresa
      monto
      fecha_movimiento
      concepto
      numero_documento
      tipo_movimiento
      estado
      cuentaOrigen {
        referencia
        etiqueta_cuenta
        numero_cuenta
        banco { nombre }
      }
      cuentaDestino {
        referencia
        etiqueta_cuenta
        numero_cuenta
        banco { nombre }
      }
    }
  }
`;

const GET_EMPRESAS = gql`
  query GetEmpresasTransferencias {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

interface CuentaRef {
  referencia?: string;
  etiqueta_cuenta?: string;
  numero_cuenta?: string;
  banco?: { nombre?: string };
}

interface TransfRow {
  id_transferencia_bancaria: string;
  id_empresa: string;
  monto: number;
  fecha_movimiento: string;
  concepto?: string;
  numero_documento?: string;
  tipo_movimiento?: string;
  estado: boolean;
  cuentaOrigen?: CuentaRef;
  cuentaDestino?: CuentaRef;
}

const labelCuenta = (c?: CuentaRef) => {
  if (!c) return '—';
  const ref = c.referencia || c.etiqueta_cuenta || c.numero_cuenta || '—';
  const banco = c.banco?.nombre ? ` (${c.banco.nombre})` : '';
  return `${ref}${banco}`;
};

const Transferencias: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [rows, setRows] = useState<TransfRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });

  const [load, { loading }] = useLazyQuery(GET_TRANSFERENCIAS, {
    fetchPolicy: 'network-only',
    onCompleted: (d) => setRows(d?.transferenciasBancarias || []),
    onError: (e) => setError(e.message),
  });

  const idEmpresaConsulta =
    scope === 'GLOBAL' ? selectedIdEmpresa || undefined : idEmpresaUsuario || undefined;

  const reload = useCallback(() => {
    if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setRows([]);
      return;
    }
    load({ variables: { id_empresa: idEmpresaConsulta, soloActivos: false } });
  }, [load, idEmpresaConsulta, scope, selectedIdEmpresa]);

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      load({ variables: { id_empresa: idEmpresaUsuario, soloActivos: false } });
    }
  }, [scope, idEmpresaUsuario, load, location.key]);

  useEffect(() => {
    if (scope === 'GLOBAL' && selectedIdEmpresa) reload();
  }, [scope, selectedIdEmpresa, reload]);

  const handleAnular = async (row: TransfRow) => {
    if (
      !window.confirm(
        '¿Anular esta transferencia? Se generarán reversas en ambas cuentas.',
      )
    ) {
      return;
    }
    try {
      setError(null);
      await eliminarTransferenciaBancaria(row.id_transferencia_bancaria);
      reload();
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { error?: string; _schema?: string[] } };
        message?: string;
      };
      const d = ax?.response?.data;
      setError(
        (Array.isArray(d?._schema) ? d._schema[0] : null) ||
          d?.error ||
          ax?.message ||
          'Error al anular',
      );
    }
  };

  const columns = [
    {
      Header: 'Fecha',
      accessor: 'fecha_movimiento',
      width: 110,
      Cell: ({ value }: { value: string }) => value?.slice(0, 10) || '—',
    },
    {
      Header: 'Origen',
      id: 'origen',
      accessor: (r: TransfRow) => labelCuenta(r.cuentaOrigen),
      filterable: true,
    },
    {
      Header: 'Destino',
      id: 'destino',
      accessor: (r: TransfRow) => labelCuenta(r.cuentaDestino),
      filterable: true,
    },
    {
      Header: 'Monto',
      accessor: 'monto',
      width: 120,
      Cell: ({ value }: { value: number }) => Number(value || 0).toFixed(2),
    },
    {
      Header: 'Tipo',
      accessor: 'tipo_movimiento',
      width: 140,
      Cell: ({ value }: { value?: string }) => labelTipoPagoTransferencia(value),
    },
    { Header: 'Descripción', accessor: 'concepto', filterable: true },
    { Header: 'Nº doc.', accessor: 'numero_documento', width: 100 },
    {
      Header: 'Estado',
      accessor: 'estado',
      width: 90,
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'secondary'}>{value ? 'Activa' : 'Anulada'}</Badge>
      ),
    },
    {
      Header: 'Acciones',
      accessor: 'id_transferencia_bancaria',
      sortable: false,
      filterable: false,
      width: 90,
      Cell: ({ original }: { original: TransfRow }) =>
        original.estado ? (
          <Button
            size="sm"
            color="outline-danger"
            title="Anular transferencia"
            onClick={() => handleAnular(original)}
          >
            <i className="bi bi-x-circle" />
          </Button>
        ) : null,
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
                  <i className="fas fa-random text-primary me-2" />
                  Transferencias internas
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={() =>
                      navigate('/banco-cajas/transferencias/nuevo', {
                        state: { id_empresa: idEmpresaConsulta },
                      })
                    }
                    disabled={scope === 'GLOBAL' && !selectedIdEmpresa}
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nueva transferencia
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mt-3">
                  <Label>Empresa</Label>
                  <SelectEmpresa
                    empresas={empresasData?.empresas || []}
                    value={selectedIdEmpresa}
                    onChange={(v) => setSelectedIdEmpresa(v)}
                  />
                </FormGroup>
              )}

              {error && <Alert color="danger" className="mb-3 mt-3">{error}</Alert>}

              <div className="grid-container mt-3">
                <ReactTable
                  data={rows}
                  columns={columns}
                  defaultPageSize={15}
                  className="-striped -highlight"
                  showPagination
                  loading={loading}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Transferencias;
