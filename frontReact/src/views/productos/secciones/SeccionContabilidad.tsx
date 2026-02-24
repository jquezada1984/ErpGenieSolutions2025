import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";

export default function SeccionContabilidad({ formData, onChange }: any) {
  return (
    <>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Cuenta contable (venta)</Label>
            <Input
              value={formData.contabilidad_venta}
              onChange={(e) => onChange("contabilidad_venta", e.target.value)}
              placeholder="Ej: 4101"
            />
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Cuenta contable (venta exportación)</Label>
            <Input
              value={formData.contabilidad_exportacion}
              onChange={(e) => onChange("contabilidad_exportacion", e.target.value)}
              placeholder="Ej: 4102"
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Cuenta contable (compra)</Label>
            <Input
              value={formData.contabilidad_compra}
              onChange={(e) => onChange("contabilidad_compra", e.target.value)}
              placeholder="Ej: 5101"
            />
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Cuenta contable (compra importación)</Label>
            <Input
              value={formData.contabilidad_importacion}
              onChange={(e) => onChange("contabilidad_importacion", e.target.value)}
              placeholder="Ej: 5102"
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
