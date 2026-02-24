import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import CountrySelect from "../../../components/CountrySelect";

type PaisOption = { id_pais: string; nombre: string; codigo_iso: string };
type ProvinciaOption = { id_provincia: string; nombre: string };

type Props = {
  formData: {
    nomenclatura_aduanera: string;
    pais_id: string;
    provincia_origen: string;
  };
  onChange: (name: string, value: string) => void;
  paises: PaisOption[];
  provincias: ProvinciaOption[];
  loadingPaises: boolean;
  loadingProvincias: boolean;
};

export default function SeccionOrigenAduana({
  formData,
  onChange,
  paises,
  provincias,
  loadingPaises,
  loadingProvincias,
}: Props) {
  const onPaisChange = (id_pais: string) => {
    onChange("pais_id", id_pais);
    onChange("provincia_origen", "");
  };

  const handlePaisSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPaisChange(e.target.value);
  };

  const countriesForSelect = paises.map((p) => ({
    id_pais: p.id_pais,
    nombre: p.nombre,
    codigo_iso: p.codigo_iso,
    icono: "",
  }));

  return (
    <>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Código aduanero (HS)</Label>
            <Input
              value={formData.nomenclatura_aduanera}
              onChange={(e) => onChange("nomenclatura_aduanera", e.target.value)}
              placeholder="Ej: 6403.99"
            />
          </FormGroup>
        </Col>

        <Col md="6">
          <CountrySelect
            id="pais_id"
            name="pais_id"
            value={formData.pais_id}
            onChange={handlePaisSelectChange}
            disabled={loadingPaises}
            loading={loadingPaises}
            countries={countriesForSelect}
            label="País de origen"
          />
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <FormGroup>
            <Label>Provincia de origen</Label>
            <Input
              type="select"
              value={formData.provincia_origen}
              onChange={(e) => onChange("provincia_origen", e.target.value)}
              disabled={loadingProvincias || !formData.pais_id}
            >
              <option value="">Seleccione provincia...</option>
              {provincias.map((pr) => (
                <option key={pr.id_provincia} value={pr.nombre}>
                  {pr.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
