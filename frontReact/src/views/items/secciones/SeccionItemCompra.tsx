import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import type { ItemFormValues } from '../schemas/itemSchema';

type Props = {
  data: Partial<ItemFormValues>;
  onChange: (d: Partial<ItemFormValues>) => void;
  /** Solo para el tab "Precios" del NuevoProducto */
  modoPrecios?: boolean;
  uiRules?: {
    resaltarPrecioCompra: boolean;
  };
};

const SeccionItemCompra: React.FC<Props> = ({ data, onChange, modoPrecios = false, uiRules }) => {
  const [f, setF] = useState({
    precio_compra: 0,
    cuenta_compra: '',
  });

  useEffect(
    () =>
      setF((p) => ({
        ...p,
        precio_compra: data.precio_compra ?? 0,
        cuenta_compra: data.cuenta_compra ?? '',
      })),
    [data.precio_compra, data.cuenta_compra]
  );

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const num = name === 'precio_compra' ? (value === '' ? 0 : Number(value)) : value;
      const u = { ...f, [name]: num };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  if (modoPrecios) {
    return (
      <Row className="g-2 mt-1">
        <Col md={4}>
          <FormGroup>
            <Label for="precio_compra">
              Precio de compra
              {uiRules?.resaltarPrecioCompra && <span className="text-danger ms-1">*</span>}
            </Label>
            <Input
              id="precio_compra"
              name="precio_compra"
              type="number"
              step="0.01"
              min={0}
              className="form-control-sm"
              value={f.precio_compra === 0 ? '' : f.precio_compra}
              onChange={chg}
            />
          </FormGroup>
        </Col>
      </Row>
    );
  }

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">
          <i className="fas fa-shopping-cart text-primary me-2" />
          Compra
        </h5>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="precio_compra">Precio de compra</Label>
              <Input
                id="precio_compra"
                name="precio_compra"
                type="number"
                step="0.01"
                min={0}
                value={f.precio_compra === 0 ? '' : f.precio_compra}
                onChange={chg}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="cuenta_compra">Cuenta contable (compra)</Label>
              <Input
                id="cuenta_compra"
                name="cuenta_compra"
                value={f.cuenta_compra}
                onChange={chg}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionItemCompra;
