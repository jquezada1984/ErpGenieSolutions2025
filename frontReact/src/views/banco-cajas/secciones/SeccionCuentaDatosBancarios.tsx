import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap';
import type { FieldErrors } from 'react-hook-form';
import { listarBancos } from '../../../_apis_/bancoCaja';
import type { NuevaCuentaBancariaFormValues } from '../schemas/NuevaCuentaBancariaSchema';
import { fieldErrorMessage } from '../utils/cuentaFormValidation';

type Props = {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  errors?: FieldErrors<NuevaCuentaBancariaFormValues>;
};

const SeccionCuentaDatosBancarios: React.FC<Props> = ({ data, onChange, errors }) => {
  const [f, setF] = useState<Record<string, unknown>>({});
  const [bancos, setBancos] = useState<Array<{ id_banco: string; nombre: string; swift?: string }>>([]);
  const [swift, setSwift] = useState('');

  useEffect(() => setF((p) => ({ ...p, ...data })), [data]);

  useEffect(() => {
    listarBancos()
      .then(setBancos)
      .catch(() => setBancos([]));
  }, []);

  useEffect(() => {
    const b = bancos.find((x) => x.id_banco === f.id_banco as string);
    setSwift(b?.swift || '');
  }, [f.id_banco, bancos]);

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const u = { ...f, [name]: value };
      setF(u);
      onChange(u);
    },
    [f, onChange],
  );

  const errBanco = fieldErrorMessage(errors, 'id_banco');
  const errNumero = fieldErrorMessage(errors, 'numero_cuenta');

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">Datos bancarios</h5>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Nombre del banco *</Label>
              <Input
                type="select"
                name="id_banco"
                value={String(f.id_banco || '')}
                onChange={chg}
                invalid={!!errBanco}
              >
                <option value="">Seleccionar banco…</option>
                {bancos.map((b) => (
                  <option key={b.id_banco} value={b.id_banco}>
                    {b.nombre}
                  </option>
                ))}
              </Input>
              {errBanco && <FormText color="danger">{errBanco}</FormText>}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Código BIC/SWIFT</Label>
              <Input value={swift} readOnly disabled className="bg-light" />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Número de cuenta IBAN</Label>
              <Input name="iban" value={String(f.iban || '')} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Número cuenta *</Label>
              <Input
                name="numero_cuenta"
                value={String(f.numero_cuenta || '')}
                onChange={chg}
                invalid={!!errNumero}
              />
              {errNumero && <FormText color="danger">{errNumero}</FormText>}
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionCuentaDatosBancarios;
