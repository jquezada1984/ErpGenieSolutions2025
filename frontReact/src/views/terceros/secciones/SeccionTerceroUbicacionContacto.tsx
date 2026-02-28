import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import CountrySelect from '../../../components/CountrySelect';
import ImageUpload from '../../../components/common/ImageUpload';

type Props = { data:any; onChange:(d:any)=>void };

const SeccionTerceroUbicacionContacto: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<any>({
    direccion:'', poblacion:'', codigo_postal:'', id_pais:'', provincia:'',
    telefono:'', movil:'', fax:'', web:'', correo:'', logo:''
  });

  useEffect(()=> setF((p:any)=>({...p,...data})),[data]);

  // Query GraphQL para obtener países (igual que en SeccionEmpresa)
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

  const { data: paisesData, loading: loadingPaises, error: errorPaises } = useQuery(GET_PAISES);
  const paises = paisesData?.paises || [];

  const chg = useCallback((e:any)=>{
    const {name, value} = e.target;
    const u = {...f, [name]: value};
    setF(u); onChange(u);
  },[f,onChange]);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4"><i className="fas fa-map-marker-alt text-primary me-2" />Ubicación y contacto</h5>

        <Row>
          <Col md={12}>
            <FormGroup>
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" type="textarea" rows={3} value={f.direccion || ''} onChange={chg}/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="codigo_postal">Código postal</Label>
              <Input id="codigo_postal" name="codigo_postal" value={f.codigo_postal || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="poblacion">Población</Label>
              <Input id="poblacion" name="poblacion" value={f.poblacion || ''} onChange={chg}/>
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
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="provincia">Provincia</Label>
              <Input id="provincia" name="provincia" value={f.provincia || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" type="tel" value={f.telefono || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="movil">Móvil</Label>
              <Input id="movil" name="movil" type="tel" value={f.movil || ''} onChange={chg}/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="fax">Fax</Label>
              <Input id="fax" name="fax" type="tel" value={f.fax || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" name="correo" type="email" value={f.correo || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="web">Web</Label>
              <Input id="web" name="web" type="url" value={f.web || ''} onChange={chg}/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <ImageUpload
              value={f.logo}
              onChange={(url) => {
                const u = { ...f, logo: url };
                setF(u);
                onChange(u);
              }}
              label="Subir Logo"
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionTerceroUbicacionContacto;
