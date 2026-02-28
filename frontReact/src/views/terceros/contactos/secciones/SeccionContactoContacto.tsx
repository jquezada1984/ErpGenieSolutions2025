import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';

type Props = { data: any; onChange: (d: any) => void };

const SeccionContactoContacto: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<any>({
    telefono_trabajo: '',
    telefono_particular: '',
    movil: '',
    fax: '',
    correo: '',
  });

  useEffect(() => setF((p: any) => ({ ...p, ...data })), [data]);

  const chg = useCallback((e: any) => {
    const { name, value } = e.target;
    const u = { ...f, [name]: value };
    setF(u);
    onChange(u);
  }, [f, onChange]);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4"><i className="fas fa-phone text-primary me-2" />Información de contacto</h5>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="telefono_trabajo">Teléfono trabajo</Label>
              <Input id="telefono_trabajo" name="telefono_trabajo" value={f.telefono_trabajo || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="telefono_particular">Teléfono particular</Label>
              <Input id="telefono_particular" name="telefono_particular" value={f.telefono_particular || ''} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="movil">Móvil</Label>
              <Input id="movil" name="movil" value={f.movil || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="fax">Fax</Label>
              <Input id="fax" name="fax" value={f.fax || ''} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" name="correo" type="email" value={f.correo || ''} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionContactoContacto;
