import React from "react";
import { Row, Col, FormGroup, Label, Input, InputGroup } from "reactstrap";

const NATURALEZA_OPCIONES = [
  "Producto",
  "Servicio",
  "Digital",
  "Activo",
  "Materia prima",
  "Kit",
  "Otro",
] as const;

const UNIDADES_PESO = ["g", "kg", "lb", "oz", "t"] as const;
const UNIDADES_LONGITUD = ["mm", "cm", "m", "km", "in", "ft"] as const;
const UNIDADES_SUPERFICIE = ["mm²", "cm²", "m²", "ha", "ac"] as const;
const UNIDADES_VOLUMEN = ["mm³", "cm³", "m³", "ml", "l", "gal"] as const;

export default function SeccionDimensiones({ formData, onChange }: any) {
  const naturalezaVal = formData.naturaleza ?? "";
  const opcionNaturaleza =
    NATURALEZA_OPCIONES.find((o) => o === naturalezaVal.trim()) ?? "Otro";

  const onNaturalezaInput = (texto: string) => {
    onChange("naturaleza", texto);
  };

  const onNaturalezaSelect = (valor: string) => {
    if (valor !== "Otro") onChange("naturaleza", valor);
  };

  return (
    <>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Naturaleza</Label>
            <InputGroup>
              <Input
                value={formData.naturaleza}
                onChange={(e) => onNaturalezaInput(e.target.value)}
                placeholder="Ej: Producto físico / Servicio"
              />
              <Input
                type="select"
                value={opcionNaturaleza}
                onChange={(e) => onNaturalezaSelect(e.target.value)}
                style={{ maxWidth: 140 }}
              >
                {NATURALEZA_OPCIONES.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Peso</Label>
            <InputGroup>
              <Input
                value={formData.peso}
                onChange={(e) => onChange("peso", e.target.value)}
                placeholder="0.00"
              />
              <Input
                type="select"
                value={formData.unidad_peso ?? "kg"}
                onChange={(e) => onChange("unidad_peso", e.target.value)}
                style={{ maxWidth: 80 }}
              >
                {UNIDADES_PESO.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="8">
          <FormGroup>
            <Label>Longitud × Anchura × Altura</Label>
            <Row>
              <Col md="4">
                <Input
                  value={formData.longitud}
                  onChange={(e) => onChange("longitud", e.target.value)}
                  placeholder="Long."
                />
              </Col>
              <Col md="4">
                <Input
                  value={formData.anchura}
                  onChange={(e) => onChange("anchura", e.target.value)}
                  placeholder="Anch."
                />
              </Col>
              <Col md="4">
                <Input
                  value={formData.altura}
                  onChange={(e) => onChange("altura", e.target.value)}
                  placeholder="Alt."
                />
              </Col>
            </Row>
          </FormGroup>
        </Col>

        <Col md="4">
          <FormGroup>
            <Label>Unidad longitud</Label>
            <Input
              type="select"
              value={formData.unidad_longitud}
              onChange={(e) => onChange("unidad_longitud", e.target.value)}
            >
              {UNIDADES_LONGITUD.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Superficie</Label>
            <Row>
              <Col md="7">
                <Input
                  value={formData.superficie}
                  onChange={(e) => onChange("superficie", e.target.value)}
                  placeholder="0.00"
                />
              </Col>
              <Col md="5">
                <Input
                  type="select"
                  value={formData.unidad_superficie}
                  onChange={(e) => onChange("unidad_superficie", e.target.value)}
                >
                  {UNIDADES_SUPERFICIE.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label>Volumen</Label>
            <Row>
              <Col md="7">
                <Input
                  value={formData.volumen}
                  onChange={(e) => onChange("volumen", e.target.value)}
                  placeholder="0.00"
                />
              </Col>
              <Col md="5">
                <Input
                  type="select"
                  value={formData.unidad_volumen}
                  onChange={(e) => onChange("unidad_volumen", e.target.value)}
                >
                  {UNIDADES_VOLUMEN.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
