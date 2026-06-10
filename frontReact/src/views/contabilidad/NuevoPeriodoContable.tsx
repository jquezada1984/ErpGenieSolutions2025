import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import useJwtPayload from '../../hooks/useJwtPayload';
import { crearPeriodoContable } from '../../_apis_/contabilidad';

const NuevoPeriodoContable: React.FC = () => {
  const navigate = useNavigate();
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const [etiqueta, setEtiqueta] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEmpresa) {
      setError('No se encontró empresa en la sesión');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await crearPeriodoContable({
        etiqueta,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      navigate('/contabilidad/configuracion/periodo');
    } catch (err: unknown) {
      const ex = err as { response?: { data?: Record<string, unknown> | string }; message?: string };
      const d = ex.response?.data;
      setError(typeof d === 'string' ? d : JSON.stringify(d) || ex.message || 'Error al crear');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Nuevo año fiscal</CardTitle>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Etiqueta</Label>
            <Input value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Fecha inicio</Label>
            <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Fecha fin</Label>
            <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
          </FormGroup>
          <Button color="primary" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Crear periodo'}
          </Button>{' '}
          <Link to="/contabilidad/configuracion/periodo" className="btn btn-secondary">
            Cancelar
          </Link>
        </Form>
      </CardBody>
    </Card>
  );
};

export default NuevoPeriodoContable;
