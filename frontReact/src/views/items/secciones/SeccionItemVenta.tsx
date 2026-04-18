import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { listarImpuestos } from '../../../_apis_/gateway';
import type { ItemFormValues } from '../schemas/itemSchema';

type Props = {
  data: Partial<ItemFormValues>;
  onChange: (d: Partial<ItemFormValues>) => void;
  /** Solo para el tab "Precios" del NuevoProducto */
  modoPrecios?: boolean;
  uiRules?: {
    resaltarPrecioVenta: boolean;
    resaltarImpuesto: boolean;
  };
};

export type ImpuestoOption = { id: number | string; nombre: string; tasa: number };

const SeccionItemVenta: React.FC<Props> = ({ data, onChange, modoPrecios = false, uiRules }) => {
  const [f, setF] = useState({
    precio_venta: 0,
    precio_venta_minimo: 0,
    tasa_iva: 0,
    impuesto_id: '',
    etiquetas: '',
  });
  const [impuestos, setImpuestos] = useState<ImpuestoOption[]>([]);

  useEffect(() => {
    listarImpuestos()
      .then((list) => setImpuestos(Array.isArray(list) ? list : []))
      .catch(() => setImpuestos([]));
  }, []);

  useEffect(
    () =>
      setF((p) => ({
        ...p,
        precio_venta: data.precio_venta ?? 0,
        precio_venta_minimo: data.precio_venta_minimo ?? 0,
        tasa_iva: data.tasa_iva ?? 0,
        impuesto_id: data.impuesto_id ?? '',
        etiquetas: data.etiquetas ?? '',
      })),
    [data.precio_venta, data.precio_venta_minimo, data.tasa_iva, data.impuesto_id, data.etiquetas]
  );

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numFields = ['precio_venta', 'precio_venta_minimo'];
      const num = numFields.includes(name) ? (value === '' ? 0 : Number(value)) : value;
      const u = { ...f, [name]: num };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange]
  );

  const chgTasaIva = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.value;
      const imp = impuestos.find((i) => String(i.id) === id);
      const newTasa = imp != null ? Number(imp.tasa) : 0;
      const impuesto_id = id ? String(id) : '';
      const u = { ...f, tasa_iva: newTasa, impuesto_id };
      setF(u);
      onChange({ ...data, ...u });
    },
    [f, data, onChange, impuestos]
  );

  const selectedIdImpuesto =
    f.impuesto_id && impuestos.some((i) => String(i.id) === String(f.impuesto_id))
      ? String(f.impuesto_id)
      : (() => {
          const byTasa = impuestos.find((i) => Number(i.tasa) === Number(f.tasa_iva));
          return byTasa != null ? String(byTasa.id) : '';
        })();

  if (modoPrecios) {
    return (
      <Row className="g-2">
        <Col md={4}>
          <FormGroup>
            <Label for="precio_venta">
              Precio de venta
              {uiRules?.resaltarPrecioVenta && <span className="text-danger ms-1">*</span>}
            </Label>
            <Input
              id="precio_venta"
              name="precio_venta"
              type="number"
              step="0.01"
              min={0}
              className="form-control-sm"
              value={f.precio_venta === 0 ? '' : f.precio_venta}
              onChange={chg}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="precio_venta_minimo">Precio venta mínimo</Label>
            <Input
              id="precio_venta_minimo"
              name="precio_venta_minimo"
              type="number"
              step="0.01"
              min={0}
              className="form-control-sm"
              value={f.precio_venta_minimo === 0 ? '' : f.precio_venta_minimo}
              onChange={chg}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="tasa_iva">
              Tasa IVA (%)
              {uiRules?.resaltarImpuesto && <span className="text-danger ms-1">*</span>}
            </Label>
            <Input
              id="tasa_iva"
              name="tasa_iva"
              type="select"
              className="form-control-sm"
              value={selectedIdImpuesto}
              onChange={chgTasaIva}
            >
              <option value="">Seleccionar</option>
              {(impuestos || []).map((i) => (
                <option key={i.id} value={String(i.id)}>
                  {i.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
    );
  }

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">
          <i className="fas fa-tag text-primary me-2" />
          Venta
        </h5>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="precio_venta">Precio de venta</Label>
              <Input
                id="precio_venta"
                name="precio_venta"
                type="number"
                step="0.01"
                min={0}
                value={f.precio_venta === 0 ? '' : f.precio_venta}
                onChange={chg}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="precio_venta_minimo">Precio venta mínimo</Label>
              <Input
                id="precio_venta_minimo"
                name="precio_venta_minimo"
                type="number"
                step="0.01"
                min={0}
                value={f.precio_venta_minimo === 0 ? '' : f.precio_venta_minimo}
                onChange={chg}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="tasa_iva">Tasa IVA (%)</Label>
              <Input
                id="tasa_iva"
                name="tasa_iva"
                type="select"
                value={selectedIdImpuesto}
                onChange={chgTasaIva}
              >
                <option value="">Seleccionar</option>
                {(impuestos || []).map((i) => (
                  <option key={i.id} value={String(i.id)}>
                    {i.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionItemVenta;
