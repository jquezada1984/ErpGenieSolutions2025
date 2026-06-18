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
} from 'reactstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {
  actualizarMovimientoBancario,
  eliminarMovimientoBancario,
} from '../../_apis_/bancoCaja';
import { TIPOS_CUENTA } from './constants';

const GET_CUENTA = gql`
  query GetCuentaMov($id: ID!) {
    cuentaBancaria(id_cuenta_bancaria: $id) {
      id_cuenta_bancaria
      id_empresa
      referencia
      etiqueta_cuenta
      numero_cuenta
      tipo_cuenta
      saldo_actual
      estado
      banco {
        nombre
      }
    }
  }
`;

const GET_MOVIMIENTOS = gql`
  query GetMovimientos($id_cuenta: ID!, $id_empresa: ID) {
    movimientosBancarios(id_cuenta_bancaria: $id_cuenta, id_empresa: $id_empresa) {
      id_movimiento_bancario
      fecha_operacion
      fecha_valor
      importe
      concepto
      referencia
      conciliado
      estado
    }
  }
`;

interface MovRow {
  id_movimiento_bancario: string;
  fecha_operacion: string;
  fecha_valor?: string;
  importe: number;
  concepto?: string;
  referencia?: string;
  conciliado: boolean;
  estado: boolean;
}

const labelTipo = (v: string) => TIPOS_CUENTA.find((t) => t.value === v)?.label || v;

const MovimientosCuenta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<MovRow[]>([]);
  const [cuentaLabel, setCuentaLabel] = useState('');
  const [saldo, setSaldo] = useState<number | null>(null);
  const [idEmpresa, setIdEmpresa] = useState<string | null>(null);

  const [loadCuenta] = useLazyQuery(GET_CUENTA, {
    fetchPolicy: 'network-only',
    onCompleted: (d) => {
      const c = d?.cuentaBancaria;
      if (!c) {
        setError('Cuenta no encontrada');
        return;
      }
      setIdEmpresa(c.id_empresa);
      const ref = c.referencia || c.etiqueta_cuenta || c.numero_cuenta;
      const banco = c.banco?.nombre ? ` — ${c.banco.nombre}` : '';
      setCuentaLabel(`${ref}${banco} (${labelTipo(c.tipo_cuenta)})`);
      setSaldo(Number(c.saldo_actual ?? 0));
      if (id) {
        loadMov({ variables: { id_cuenta: id, id_empresa: c.id_empresa } });
      }
    },
    onError: (e) => setError(e.message),
  });

  const [loadMov, { loading }] = useLazyQuery(GET_MOVIMIENTOS, {
    fetchPolicy: 'network-only',
    onCompleted: (d) => setRows(d?.movimientosBancarios || []),
    onError: (e) => setError(e.message),
  });

  const reload = useCallback(() => {
    if (!id || !idEmpresa) return;
    loadMov({ variables: { id_cuenta: id, id_empresa: idEmpresa } });
    loadCuenta({ variables: { id } });
  }, [id, idEmpresa, loadMov, loadCuenta]);

  useEffect(() => {
    if (id) loadCuenta({ variables: { id } });
  }, [id, loadCuenta, location.key]);

  const handleToggleConciliado = async (mov: MovRow) => {
    try {
      setError(null);
      await actualizarMovimientoBancario(mov.id_movimiento_bancario, {
        conciliado: !mov.conciliado,
        id_empresa: idEmpresa,
      });
      reload();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string };
      setError(ax?.response?.data?.error || ax?.message || 'Error al actualizar');
    }
  };

  const handleAnular = async (mov: MovRow) => {
    if (!window.confirm('¿Anular este movimiento? Se revertirá el importe en el saldo.')) return;
    try {
      setError(null);
      await eliminarMovimientoBancario(mov.id_movimiento_bancario);
      reload();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string };
      setError(ax?.response?.data?.error || ax?.message || 'Error al anular');
    }
  };

  const columns = [
    {
      Header: 'Fecha op.',
      accessor: 'fecha_operacion',
      width: 110,
      Cell: ({ value }: { value: string }) => value?.slice(0, 10) || '—',
    },
    {
      Header: 'Fecha valor',
      accessor: 'fecha_valor',
      width: 110,
      Cell: ({ value }: { value?: string }) => (value ? value.slice(0, 10) : '—'),
    },
    {
      Header: 'Importe',
      accessor: 'importe',
      width: 120,
      Cell: ({ value }: { value: number }) => {
        const n = Number(value || 0);
        const color = n >= 0 ? 'success' : 'danger';
        return <span className={`text-${color}`}>{n.toFixed(2)}</span>;
      },
    },
    { Header: 'Concepto', accessor: 'concepto', filterable: true },
    { Header: 'Ref.', accessor: 'referencia', filterable: true, width: 100 },
    {
      Header: 'Conciliado',
      accessor: 'conciliado',
      width: 100,
      Cell: ({ original }: { original: MovRow }) => (
        <Badge color={original.conciliado ? 'success' : 'secondary'}>
          {original.conciliado ? 'Sí' : 'No'}
        </Badge>
      ),
    },
    {
      Header: 'Acciones',
      accessor: 'id_movimiento_bancario',
      sortable: false,
      filterable: false,
      width: 140,
      Cell: ({ original }: { original: MovRow }) => (
        <div className="d-flex gap-1 justify-content-center">
          <Button
            size="sm"
            color="outline-primary"
            title={original.conciliado ? 'Marcar no conciliado' : 'Marcar conciliado'}
            onClick={() => handleToggleConciliado(original)}
          >
            <i className="bi bi-check2-square" />
          </Button>
          <Button
            size="sm"
            color="outline-danger"
            title="Anular movimiento"
            onClick={() => handleAnular(original)}
          >
            <i className="bi bi-x-circle" />
          </Button>
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
                <div>
                  <CardTitle tag="h4" className="grid-title mb-1">
                    <i className="fas fa-exchange-alt text-primary me-2" />
                    Movimientos
                  </CardTitle>
                  {cuentaLabel && (
                    <p className="text-muted mb-0 small">
                      {cuentaLabel}
                      {saldo !== null && (
                        <span className="ms-2">
                          Saldo: <strong>{saldo.toFixed(2)}</strong>
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="grid-actions">
                  <Button
                    color="secondary"
                    outline
                    className="me-2"
                    onClick={() => navigate('/banco-cajas/cuentas')}
                  >
                    Volver
                  </Button>
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={() =>
                      navigate(`/banco-cajas/cuentas/${id}/movimientos/nuevo`, {
                        state: { id_empresa: idEmpresa },
                      })
                    }
                    disabled={!id}
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo movimiento
                  </Button>
                </div>
              </div>

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

export default MovimientosCuenta;
