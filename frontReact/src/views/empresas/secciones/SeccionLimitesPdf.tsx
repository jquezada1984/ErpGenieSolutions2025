import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
};

const SeccionLimitesPdf: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState({
    decimales_precio: 2,
    decimales_cantidad: 2,
    decimales_total: 2,
    pdf_mostrar_ruc: true,
    pdf_pie_texto: '',
  });

  useEffect(() => {
    setF({
      decimales_precio: Number(data?.decimales_precio ?? 2),
      decimales_cantidad: Number(data?.decimales_cantidad ?? 2),
      decimales_total: Number(data?.decimales_total ?? 2),
      pdf_mostrar_ruc: data?.pdf_mostrar_ruc !== false,
      pdf_pie_texto: String(data?.pdf_pie_texto ?? ''),
    });
  }, [
    data?.decimales_precio,
    data?.decimales_cantidad,
    data?.decimales_total,
    data?.pdf_mostrar_ruc,
    data?.pdf_pie_texto,
  ]);

  const chg = (name: string, value: unknown) => {
    const next = { ...f, [name]: value };
    setF(next);
    onChange(next);
  };

  return (
    <Card className="mb-3">
      <CardBody>
        <h5 className="mb-3">Límites, precisión y PDF</h5>
        <p className="text-muted small">
          Decimales usados en facturas y redondeo. Parámetros de pie/RUC en DocumentApi.
        </p>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label>Decimales precio</Label>
              <Input
                type="number"
                min={0}
                max={6}
                value={f.decimales_precio}
                onChange={(e) => chg('decimales_precio', Number(e.target.value))}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Decimales cantidad</Label>
              <Input
                type="number"
                min={0}
                max={6}
                value={f.decimales_cantidad}
                onChange={(e) => chg('decimales_cantidad', Number(e.target.value))}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Decimales total / IVA</Label>
              <Input
                type="number"
                min={0}
                max={6}
                value={f.decimales_total}
                onChange={(e) => chg('decimales_total', Number(e.target.value))}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <FormGroup check className="mt-2">
              <Input
                id="pdf_mostrar_ruc"
                type="checkbox"
                checked={f.pdf_mostrar_ruc}
                onChange={(e) => chg('pdf_mostrar_ruc', e.target.checked)}
              />
              <Label check for="pdf_mostrar_ruc">
                Mostrar RUC en PDF
              </Label>
            </FormGroup>
          </Col>
          <Col md={8}>
            <FormGroup>
              <Label>Pie de página PDF</Label>
              <Input
                type="textarea"
                rows={2}
                placeholder="Vacío = ERP Genie Solutions"
                value={f.pdf_pie_texto}
                onChange={(e) => chg('pdf_pie_texto', e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionLimitesPdf;
