import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import CountrySelect from '../../../../components/CountrySelect';
import SelectProvincia from '../../../../components/selects/SelectProvincia';

type Props = { data: any; onChange: (d: any) => void };

const GET_PAISES = gql`
  query GetPaises {
    paises {
      id_pais
      nombre
      codigo_iso
      icono
    }
  }
`;

const SeccionContactoDireccion: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<any>({
    direccion: '',
    codigo_postal: '',
    poblacion: '',
    id_provincia: '',
    id_pais: '',
  });

  useEffect(() => setF((p: any) => ({ ...p, ...data })), [data]);

  const { data: paisesData, loading: loadingPaises, error: errorPaises } = useQuery(GET_PAISES);
  const paises = paisesData?.paises || [];

  const chg = useCallback((e: any) => {
    const { name, value } = e.target;
    const u = { ...f, [name]: value };
    setF(u);
    onChange(u);
  }, [f, onChange]);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4"><i className="fas fa-map-marker-alt text-primary me-2" />Dirección</h5>

        <Row>
          <Col md={12}>
            <FormGroup>
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" type="textarea" rows={3} value={f.direccion || ''} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="codigo_postal">Código postal</Label>
              <Input id="codigo_postal" name="codigo_postal" value={f.codigo_postal || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="poblacion">Población</Label>
              <Input id="poblacion" name="poblacion" value={f.poblacion || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={4}>
            {errorPaises && (
              <div className="alert alert-danger">
                <strong>Error cargando países:</strong> {errorPaises.message}
              </div>
            )}
            <CountrySelect
              key={`country-select-${f.id_pais}-${paises.length}`}
              id="id_pais"
              name="id_pais"
              value={f.id_pais}
              onChange={chg}
              disabled={loadingPaises}
              loading={loadingPaises}
              countries={paises}
              label={
                <>
                  <i className="fas fa-globe me-1"></i>
                  País
                </>
              }
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Provincia</Label>
              <SelectProvincia
                value={f.id_provincia || null}
                onChange={(v) => {
                  const u = { ...f, id_provincia: v ?? '' };
                  setF(u);
                  onChange(u);
                }}
                id_pais={f.id_pais || null}
                isDisabled={!f.id_pais}
                placeholder="Seleccionar provincia"
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionContactoDireccion;
