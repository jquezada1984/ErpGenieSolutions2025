import React from "react";
import { Row, Col, FormGroup, Label, Input, FormFeedback } from "reactstrap";

type FormErrors = Record<string, { message?: string } | undefined>;

export default function SeccionProducto({
  formData,
  onChange,
  formErrors,
}: {
  formData: any;
  onChange: (name: string, value: any) => void;
  formErrors?: FormErrors;
}) {
  return (
    <>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Referencia del producto *</Label>
            <Input
              value={formData.producto_ref}
              onChange={(e) => onChange("producto_ref", e.target.value)}
              placeholder="Ej: PROD-0001"
              invalid={Boolean(formErrors?.producto_ref?.message)}
            />
            {formErrors?.producto_ref?.message && (
              <FormFeedback>{formErrors.producto_ref.message}</FormFeedback>
            )}
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Etiqueta *</Label>
            <Input
              value={formData.etiqueta}
              onChange={(e) => onChange("etiqueta", e.target.value)}
              placeholder="Ej: Zapato Deportivo"
              invalid={Boolean(formErrors?.etiqueta?.message)}
            />
            {formErrors?.etiqueta?.message && (
              <FormFeedback>{formErrors.etiqueta.message}</FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Estado (Venta)</Label>
            <div className="form-check form-switch d-flex align-items-center gap-2">
              <Input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={formData.estado_venta === "VENTA"}
                onChange={(e) =>
                  onChange("estado_venta", e.target.checked ? "VENTA" : "NO_VENTA")
                }
              />
              <span className="form-check-label text-body">
                {formData.estado_venta === "VENTA" ? "A la venta" : "No a la venta"}
              </span>
            </div>
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Estado (Compra)</Label>
            <div className="form-check form-switch d-flex align-items-center gap-2">
              <Input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={formData.estado_compra === "COMPRA"}
                onChange={(e) =>
                  onChange("estado_compra", e.target.checked ? "COMPRA" : "NO_COMPRA")
                }
              />
              <span className="form-check-label text-body">
                {formData.estado_compra === "COMPRA" ? "Se compra" : "No se compra"}
              </span>
            </div>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <FormGroup>
            <Label>Descripción</Label>
            <Input
              type="textarea"
              rows={6}
              value={formData.descripcion}
              onChange={(e) => onChange("descripcion", e.target.value)}
              placeholder="Descripción del producto..."
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <FormGroup>
            <Label>URL pública</Label>
            <Input
              value={formData.url_publica}
              onChange={(e) => onChange("url_publica", e.target.value)}
              placeholder="https://..."
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
