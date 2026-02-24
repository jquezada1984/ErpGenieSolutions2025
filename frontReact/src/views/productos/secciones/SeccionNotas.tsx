import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";

export default function SeccionNotas({ formData, onChange }: any) {
  return (
    <Row>
      <Col md="12">
        <FormGroup>
          <Label>Nota interna</Label>
          <Input
            type="textarea"
            rows={6}
            value={formData.nota_interna}
            onChange={(e) => onChange("nota_interna", e.target.value)}
            placeholder="Notas internas (no visibles en documentos)..."
          />
        </FormGroup>
      </Col>
    </Row>
  );
}
