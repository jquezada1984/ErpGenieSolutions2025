import React, { useMemo, useState } from 'react';
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
import useJwtPayload from '../../../hooks/useJwtPayload';
import { cerrarPeriodoContable } from '../../../_apis_/contabilidad';

const GET_PERIODOS = gql`
  query PeriodosCerrar($id_empresa: String!) {
    periodosContables(id_empresa: $id_empresa) {
      id_periodo_contable
      ref
      etiqueta
      fecha_inicio
      fecha_fin
      estado
      num_entradas
      num_movimientos
    }
  }
`;

const CerrarPeriodo: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const anioActual = new Date().getFullYear();
  const [anio, setAnio] = useState(anioActual);
  const [cerrando, setCerrando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_PERIODOS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const periodos = (data?.periodosContables || []).filter(
    (p: { ref: string }) => String(p.ref).startsWith(String(anio)),
  );
  const periodoActivo = periodos.find((p: { estado: string }) => p.estado === 'ABIERTO');

  const handleCerrar = async (id: string) => {
    if (!window.confirm('¿Cerrar este periodo contable? No se podrán registrar más movimientos.')) return;
    setCerrando(id);
    setMensaje(null);
    try {
      await cerrarPeriodoContable(id);
      setMensaje('Periodo cerrado correctamente');
      await refetch();
    } catch (e: unknown) {
      const err = e as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(err.response?.data) || err.message || 'Error al cerrar');
    } finally {
      setCerrando(null);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">
            Cierre anual — Periodo contable
          </CardTitle>
          <div>
            <Button size="sm" color="light" onClick={() => setAnio((a) => a - 1)}>
              ‹
            </Button>
            <span className="mx-2 fw-bold">{anio}</span>
            <Button size="sm" color="light" onClick={() => setAnio((a) => a + 1)}>
              ›
            </Button>
          </div>
        </div>

        {error && <Alert color="danger">Error al cargar periodos</Alert>}
        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {loading && <Spinner />}

        {!loading && periodos.length === 0 && (
          <Alert color="warning">
            No se encontró ningún período fiscal activo para {anio}.{' '}
            <Link to="/contabilidad/configuracion/periodo">Definir periodo contable</Link>
          </Alert>
        )}

        {!loading && periodos.length > 0 && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Ref.</th>
                <th>Etiqueta</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Entradas</th>
                <th>Movimientos</th>
                <th>Estado</th>
                <th />
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
            </tbody>
          </Table>
        )}

        {periodoActivo && (
          <Alert color="secondary" className="mt-3 mb-0">
            Periodo abierto: <strong>{periodoActivo.ref}</strong> ({periodoActivo.etiqueta})
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default CerrarPeriodo;
