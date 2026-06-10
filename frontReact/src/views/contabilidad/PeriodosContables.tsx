import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Table,
} from 'reactstrap';
import useJwtPayload from '../../hooks/useJwtPayload';
import { cerrarPeriodoContable } from '../../_apis_/contabilidad';

const GET_PERIODOS = gql`
  query GetPeriodosContables($id_empresa: String!) {
    periodosContables(id_empresa: $id_empresa) {
      id_periodo_contable
      ref
      etiqueta
      fecha_inicio
      fecha_fin
      num_entradas
      num_movimientos
      estado
    }
  }
`;

const PeriodosContables: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [cerrando, setCerrando] = React.useState<string | null>(null);
  const [mensaje, setMensaje] = React.useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_PERIODOS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const periodos = data?.periodosContables || [];

  const handleCerrar = async (id: string) => {
    if (!window.confirm('¿Cerrar este periodo contable?')) return;
    setCerrando(id);
    setMensaje(null);
    try {
      await cerrarPeriodoContable(id);
      setMensaje('Periodo cerrado correctamente');
      await refetch();
    } catch (e: unknown) {
      const err = e as { response?: { data?: Record<string, unknown> | string }; message?: string };
      const d = err.response?.data;
      setMensaje(
        typeof d === 'string' ? d : JSON.stringify(d) || err.message || 'Error al cerrar',
      );
    } finally {
      setCerrando(null);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">
            Periodo contable ({periodos.length})
          </CardTitle>
          <Link to="/contabilidad/configuracion/periodo/nuevo" className="btn btn-primary">
            Nuevo año fiscal
          </Link>
        </div>

        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar periodos</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Ref.</th>
                <th>Etiqueta</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Nº entradas</th>
                <th>Nº movimientos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {periodos.map((p: {
                id_periodo_contable: string;
                ref: string;
                etiqueta: string;
                fecha_inicio: string;
                fecha_fin: string;
                num_entradas: number;
                num_movimientos: number;
                estado: string;
              }) => (
                <tr key={p.id_periodo_contable}>
                  <td>{p.ref}</td>
                  <td>{p.etiqueta}</td>
                  <td>{p.fecha_inicio}</td>
                  <td>{p.fecha_fin}</td>
                  <td>{p.num_entradas}</td>
                  <td>{p.num_movimientos}</td>
                  <td>{p.estado}</td>
                  <td>
                    {p.estado === 'ABIERTO' && (
                      <Button
                        size="sm"
                        color="warning"
                        disabled={cerrando === p.id_periodo_contable}
                        onClick={() => handleCerrar(p.id_periodo_contable)}
                      >
                        Cerrar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {periodos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    No hay periodos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default PeriodosContables;
