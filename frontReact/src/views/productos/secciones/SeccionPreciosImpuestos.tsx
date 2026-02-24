import React from "react";
import { Row, Col, FormGroup, Label, Input, FormFeedback } from "reactstrap";

type ImpuestoOption = { id: number; nombre: string; tasa: number };
type FormErrors = Record<string, { message?: string } | undefined>;

export default function SeccionPreciosImpuestos({
  formData,
  onChange,
  impuestos = [],
  loadingImpuestos = false,
  formErrors,
}: {
  formData: any;
  onChange: (name: string, value: string) => void;
  impuestos?: ImpuestoOption[];
  loadingImpuestos?: boolean;
  formErrors?: FormErrors;
}) {
  return (
    <>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Precio de venta</Label>
            <Input
              value={formData.precio_venta}
              onChange={(e) => onChange("precio_venta", e.target.value)}
              placeholder="0.00"
            />
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Precio mínimo</Label>
            <Input
              value={formData.precio_minimo}
              onChange={(e) => onChange("precio_minimo", e.target.value)}
              placeholder="0.00"
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <FormGroup>
            <Label>Impuesto</Label>
            <Input
              type="select"
              value={formData.impuesto_id}
              onChange={(e) => onChange("impuesto_id", e.target.value)}
              disabled={loadingImpuestos}
              invalid={Boolean(formErrors?.impuesto_id?.message)}
            >
              <option value="">Seleccione impuesto</option>
              {impuestos.map((imp) => (
                <option key={imp.id} value={imp.id}>
                  {imp.nombre} ({imp.tasa}%)
                </option>
              ))}
            </Input>
            {formErrors?.impuesto_id?.message && (
              <FormFeedback>{formErrors.impuesto_id.message}</FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
