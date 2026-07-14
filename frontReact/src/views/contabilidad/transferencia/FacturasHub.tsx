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
import {
  MESES_LABEL,
  anioActual,
  formatImporte,
  pivotResumen,
} from './transferenciaUtils';

const GET_RESUMEN = gql`
  query ResumenVinculacion($id_empresa: String!, $anio: Int!, $tipo: String!) {
    resumenVinculacionFacturas(id_empresa: $id_empresa, anio: $anio, tipo: $tipo) {
      no_vinculadas {
        cuenta
        mes
        num_lineas
        total
      }
      vinculadas {
        cuenta
        mes
        num_lineas
        total
      }
    }
  }
`;

type HubProps = {
  tipo: 'CLIENTE' | 'PROVEEDOR';
  titulo: string;
  basePath: string;
  vincularAuto: (anio: number) => Promise<unknown>;
};

const ResumenTable: React.FC<{ titulo: string; items: ReturnType<typeof pivotResumen> }> = ({
  titulo,
  items,
}) => (
  <>
    <h6 className="mt-4 mb-2">{titulo}</h6>
    <Table responsive bordered size="sm">
      <thead>
        <tr>
          <th>Cuenta</th>
          {MESES_LABEL.map((m) => (
            <th key={m} className="text-center">{m}</th>
          ))}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((row) => (
          <tr key={row.cuenta}>
            <td>{row.cuenta}</td>
            {MESES_LABEL.map((_, idx) => {
              const cel = row.meses[idx + 1];
              return (
                <td key={idx} className="text-end text-muted small">
                  {cel ? formatImporte(cel.total) : '—'}
                </td>
              );
            })}
            <td className="text-end fw-bold">{formatImporte(row.totalImporte)}</td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={14} className="text-center text-muted">Sin datos</td>
          </tr>
        )}
      </tbody>
    </Table>
  </>
);

const FacturasHub: React.FC<HubProps> = ({ tipo, titulo, basePath, vincularAuto }) => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [anio, setAnio] = useState(anioActual());
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [vinculando, setVinculando] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_RESUMEN, {
    variables: { id_empresa: idEmpresa, anio, tipo },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const noVinc = pivotResumen(data?.resumenVinculacionFacturas?.no_vinculadas || []);
  const vinc = pivotResumen(data?.resumenVinculacionFacturas?.vinculadas || []);

  const handleVincular = async () => {
    setVinculando(true);
    setMensaje(null);
    try {
      const res = await vincularAuto(anio) as { vinculados?: number };
      setMensaje(`Vinculación automática: ${res?.vinculados ?? 0} líneas actualizadas.`);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setVinculando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">{titulo}</CardTitle>
        <div className="d-flex align-items-center gap-2 mb-3">
          <Button size="sm" outline onClick={() => setAnio((y) => y - 1)}>&lt;</Button>
          <strong>{anio}</strong>
          <Button size="sm" outline onClick={() => setAnio((y) => y + 1)}>&gt;</Button>
          <Button color="primary" className="ms-3" disabled={vinculando} onClick={handleVincular}>
            VINCULAR AUTOMÁTICAMENTE
          </Button>
        </div>

        <div className="mb-3">
          <Link to={`${basePath}/lineas-a-contabilizar?anio=${anio}`} className="btn btn-outline-secondary btn-sm me-2">
            Líneas a contabilizar
          </Link>
          <Link to={`${basePath}/lineas-contabilizadas?anio=${anio}`} className="btn btn-outline-secondary btn-sm">
            Líneas contabilizadas
          </Link>
        </div>

        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar resumen</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <>
            <ResumenTable titulo="Líneas no vinculadas" items={noVinc} />
            <ResumenTable titulo="Líneas vinculadas" items={vinc} />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default FacturasHub;
