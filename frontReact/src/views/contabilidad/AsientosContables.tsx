import React, { useState } from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert, Button, Table, Badge } from 'reactstrap';
import { useQuery, gql } from '@apollo/client';

const GET_ASIENTOS_CONTABLES = gql`
  query GetAsientosContables {
    asientosContables {
      id
      numero
      fecha
      concepto
      total_debe
      total_haber
      estado
      empresa_id
      diario_contable_id
      created_at
      updated_at
    }
  }
`;

const GET_ASIENTOS_POR_FECHA = gql`
  query GetAsientosPorFecha($fechaInicio: String!, $fechaFin: String!) {
    asientosContablesPorFecha(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      id
      numero
      fecha
      concepto
      total_debe
      total_haber
      estado
      empresa_id
      diario_contable_id
      created_at
      updated_at
    }
  }
`;

interface AsientoContable {
  id: number;
  numero: string;
  fecha: string;
  concepto: string;
  total_debe: number;
  total_haber: number;
  estado: string;
  empresa_id?: number;
  diario_contable_id?: number;
  created_at: string;
  updated_at: string;
}

const AsientosContables: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [usarFiltroFecha, setUsarFiltroFecha] = useState(false);

  const { data: dataTodos, loading: loadingTodos, error: errorTodos } = useQuery(
    GET_ASIENTOS_CONTABLES,
    { skip: usarFiltroFecha }
  );

  const { data: dataFiltrados, loading: loadingFiltrados, error: errorFiltrados } = useQuery(
    GET_ASIENTOS_POR_FECHA,
    {
      variables: { fechaInicio, fechaFin },
      skip: !usarFiltroFecha || !fechaInicio || !fechaFin
    }
  );

  const loading = loadingTodos || loadingFiltrados;
  const error = errorTodos || errorFiltrados;
  const asientos: AsientoContable[] = usarFiltroFecha 
    ? (dataFiltrados?.asientosContablesPorFecha || [])
    : (dataTodos?.asientosContables || []);

  const getEstadoBadge = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'APROBADO':
        return <Badge color="success">Aprobado</Badge>;
      case 'BORRADOR':
        return <Badge color="warning">Borrador</Badge>;
      case 'ANULADO':
        return <Badge color="danger">Anulado</Badge>;
      default:
        return <Badge color="secondary">{estado}</Badge>;
    }
  };

  return (
    <ContabilidadBasePage
      title="Asientos Contables"
      icon="bi bi-journal-text"
      loading={loading}
      error={error?.message || null}
    >
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2 align-items-center">
            <input
              type="checkbox"
              id="filtrarFecha"
              checked={usarFiltroFecha}
              onChange={(e) => setUsarFiltroFecha(e.target.checked)}
              className="form-check-input"
            />
            <label htmlFor="filtrarFecha" className="form-check-label">
              Filtrar por fecha
            </label>
          </div>
          <Button color="primary" size="sm">
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Asiento
          </Button>
        </div>

        {usarFiltroFecha && (
          <div className="row mb-3">
            <div className="col-md-5">
              <label className="form-label">Fecha Inicio</label>
              <input
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">Fecha Fin</label>
              <input
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {asientos.length === 0 && !loading ? (
        <Alert color="info">
          <i className="bi bi-info-circle me-2"></i>
          No hay asientos contables registrados.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Total Debe</th>
                <th>Total Haber</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asientos.map((asiento) => (
                <tr key={asiento.id}>
                  <td>{asiento.numero}</td>
                  <td>{new Date(asiento.fecha).toLocaleDateString()}</td>
                  <td>{asiento.concepto}</td>
                  <td className="text-end">{Number(asiento.total_debe).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                  <td className="text-end">{Number(asiento.total_haber).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                  <td>{getEstadoBadge(asiento.estado)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button color="info" size="sm">
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button color="primary" size="sm">
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </ContabilidadBasePage>
  );
};

export default AsientosContables;
