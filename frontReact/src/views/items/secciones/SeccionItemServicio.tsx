import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import type { ItemFormValues } from '../schemas/itemSchema';

type Props = { data: Partial<ItemFormValues>; onChange: (d: Partial<ItemFormValues>) => void };

const SeccionItemServicio: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState({
    descripcion_servicio: '',
    cuenta_venta: '',
  });

  useEffect(
    () =>
      setF((p) => ({
        ...p,
        descripcion_servicio: data.descripcion_servicio ?? '',
        cuenta_venta: data.cuenta_venta ?? '',
      })),
    [data.descripcion_servicio, data.cuenta_venta]
  );

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const u = { ...f, [name]: value };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">
          <i className="fas fa-concierge-bell text-primary me-2" />
          Servicio
        </h5>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="descripcion_servicio">Descripción del servicio</Label>
              <Input
                id="descripcion_servicio"
                name="descripcion_servicio"
                type="textarea"
                rows={3}
                value={f.descripcion_servicio}
                onChange={chg}
                placeholder="Detalle del servicio ofrecido"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="cuenta_venta">Cuenta contable (venta)</Label>
              <Input
                id="cuenta_venta"
                name="cuenta_venta"
                value={f.cuenta_venta}
                onChange={chg}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionItemServicio;
