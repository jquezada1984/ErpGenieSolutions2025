import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { VISIBILIDAD_OPTIONS } from '../../../../constants/visibilidad';

type Props = { data: any; onChange: (d: any) => void };

const SeccionContactoGeneral: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<any>({
    apellidos: '',
    nombre: '',
    titulo: '',
    puesto_trabajo: '',
    fecha_nacimiento: '',
    alerta_cumpleanos: false,
    visibilidad: '',
    estado: true,
  });

  useEffect(() => setF((p: any) => ({ ...p, ...data })), [data]);

  const chg = useCallback((e: any) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    const u = { ...f, [name]: value };
    setF(u);
    onChange(u);
  }, [f, onChange]);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4"><i className="fas fa-id-card text-primary me-2" />Información general</h5>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="apellidos">Apellidos / Etiqueta</Label>
              <Input id="apellidos" name="apellidos" value={f.apellidos || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={f.nombre || ''} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="titulo">Título</Label>
              <Input id="titulo" name="titulo" value={f.titulo || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="puesto_trabajo">Puesto de trabajo</Label>
              <Input id="puesto_trabajo" name="puesto_trabajo" value={f.puesto_trabajo || ''} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="fecha_nacimiento">Fecha de nacimiento</Label>
              <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={f.fecha_nacimiento || ''} onChange={chg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup check className="mt-4">
              <Input id="alerta_cumpleanos" name="alerta_cumpleanos" type="checkbox" checked={!!f.alerta_cumpleanos} onChange={chg} />
              <Label for="alerta_cumpleanos" check>Alerta cumpleaños</Label>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="visibilidad">Visibilidad</Label>
              <Input id="visibilidad" name="visibilidad" type="select" value={f.visibilidad || ''} onChange={chg}>
                <option value="">Seleccionar</option>
                {VISIBILIDAD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup check className="mt-4">
              <Input id="estado" name="estado" type="checkbox" checked={!!f.estado} onChange={chg} />
              <Label for="estado" check>Activo</Label>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionContactoGeneral;
