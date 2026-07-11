import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormText,
} from 'reactstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { crearMovimientoBancario } from '../../_apis_/bancoCaja';

const today = () => new Date().toISOString().slice(0, 10);

const NuevoMovimientoBancario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const idEmpresa = (location.state as { id_empresa?: string })?.id_empresa;

  const [tipo, setTipo] = useState<'ingreso' | 'egreso'>('ingreso');
  const [monto, setMonto] = useState('');
  const [fechaMovimiento, setFechaMovimiento] = useState(today());
  const [concepto, setConcepto] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errMonto, setErrMonto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const m = parseFloat(monto.replace(',', '.'));
    if (!monto.trim() || Number.isNaN(m) || m <= 0) {
      setErrMonto('Indique un monto mayor que cero');
      setError('Revise el formulario');
      return;
    }
    setErrMonto(null);
    const montoSigned = tipo === 'ingreso' ? m : -m;
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        id_cuenta_bancaria: id,
        fecha_movimiento: fechaMovimiento,
        monto: montoSigned,
        tipo_movimiento: tipo,
        concepto: concepto.trim() || undefined,
        numero_documento: numeroDocumento.trim() || undefined,
      };
      if (idEmpresa) body.id_empresa = idEmpresa;
      await crearMovimientoBancario(body);
      navigate(`/banco-cajas/cuentas/${id}/movimientos`);
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { error?: string; monto?: string[]; _schema?: string[] } };
        message?: string;
      };
      const d = ax?.response?.data;
      setError(
        (Array.isArray(d?._schema) ? d._schema[0] : null) ||
          (Array.isArray(d?.monto) ? d.monto[0] : null) ||
          d?.error ||
          ax?.message ||
          'Error al guardar',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md="8" lg="6">
          <Card>
            <CardBody>
              <CardTitle tag="h4">Nuevo movimiento</CardTitle>
              <p className="text-muted small">
                Ingreso suma al saldo; egreso resta (convención Dolibarr).
              </p>

              {error && <Alert color="danger">{error}</Alert>}

              <FormGroup>
                <Label>Tipo *</Label>
                <Input
                  type="select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as 'ingreso' | 'egreso')}
                >
                  <option value="ingreso">Ingreso (crédito)</option>
                  <option value="egreso">Egreso (débito)</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Monto *</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={monto}
                  onChange={(e) => {
                    setMonto(e.target.value);
                    setErrMonto(null);
                  }}
                  invalid={!!errMonto}
                />
                {errMonto && <FormText color="danger">{errMonto}</FormText>}
              </FormGroup>

              <FormGroup>
                <Label>Fecha movimiento *</Label>
                <Input
                  type="date"
                  value={fechaMovimiento}
                  onChange={(e) => setFechaMovimiento(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Concepto</Label>
                <Input
                  type="textarea"
                  rows={2}
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Nº documento</Label>
                <Input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} />
              </FormGroup>

              <div className="d-flex gap-2 mt-3">
                <Button color="secondary" outline onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button color="primary" onClick={save} disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NuevoMovimientoBancario;
