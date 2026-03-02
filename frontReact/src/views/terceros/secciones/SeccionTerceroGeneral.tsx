import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText, Spinner } from 'reactstrap';
import { listarTiposTercero } from '../../../_apis_/tercero';
import SelectTipoTercero from '../../../components/selects/SelectTipoTercero';

type Props = { data: any; onChange: (d:any)=>void };

const SeccionTerceroGeneral: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<any>({
    cliente_potencial: false, cliente: false, proveedor: false,
    nombre: '', apodo: '', codigo_cliente: '', estado: true,
    sujeto_iva: true, id_tipo_tercero: '', tipo_entidad_comercial: ''
  });
  const [err, setErr] = useState<{[k:string]:string}>({});
  const [tiposTercero, setTiposTercero] = useState<any[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);

  useEffect(()=> setF((p:any)=>({...p,...data})),[data]);

  // Cargar tipos de tercero al montar el componente
  useEffect(() => {
    const cargarTipos = async () => {
      setLoadingTipos(true);
      try {
        const datos = await listarTiposTercero();
        setTiposTercero(datos || []);
      } catch (error) {
        console.error('Error al cargar tipos de tercero:', error);
        setTiposTercero([]);
      } finally {
        setLoadingTipos(false);
      }
    };
    cargarTipos();
  }, []);

  const chg = useCallback((e: any) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    const u = { ...f, [name]: value };
    setF(u);
    if (name==='nombre') {
      const ne = {...err};
      if (!String(value||'').trim()) ne.nombre='El nombre es obligatorio'; else delete ne.nombre;
      setErr(ne);
    }
    onChange(u);
  }, [f, onChange, err]);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4"><i className="fas fa-id-card text-primary me-2" />Información general</h5>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="nombre">Nombre del tercero <span className="text-danger">*</span></Label>
              <Input id="nombre" name="nombre" value={f.nombre} onChange={chg} invalid={!!err.nombre}/>
              {err.nombre && <FormText color="danger">{err.nombre}</FormText>}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="apodo">Apodo (comercial, marca…)</Label>
              <Input id="apodo" name="apodo" value={f.apodo || ''} onChange={chg}/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup check>
              <Input id="cliente_potencial" name="cliente_potencial" type="checkbox" checked={!!f.cliente_potencial} onChange={chg}/>
              <Label for="cliente_potencial" check>Cliente potencial</Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check>
              <Input id="cliente" name="cliente" type="checkbox" checked={!!f.cliente} onChange={chg}/>
              <Label for="cliente" check>Cliente</Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check>
              <Input id="proveedor" name="proveedor" type="checkbox" checked={!!f.proveedor} onChange={chg}/>
              <Label for="proveedor" check>Proveedor</Label>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={4}>
            <FormGroup>
              <Label for="codigo_cliente">Código cliente</Label>
              <Input id="codigo_cliente" name="codigo_cliente" value={f.codigo_cliente || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check className="mt-4">
              <Input id="estado" name="estado" type="checkbox" checked={!!f.estado} onChange={chg}/>
              <Label for="estado" check>Activo</Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check className="mt-4">
              <Input id="sujeto_iva" name="sujeto_iva" type="checkbox" checked={!!f.sujeto_iva} onChange={chg}/>
              <Label for="sujeto_iva" check>Sujeto a IVA</Label>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="id_tipo_tercero">Tipo de tercero</Label>
              <SelectTipoTercero
                value={f.id_tipo_tercero || ''}
                onChange={(val) => {
                  const u = { ...f, id_tipo_tercero: val ?? '' };
                  setF(u);
                  onChange(u);
                }}
                tipos={tiposTercero}
                isLoading={loadingTipos}
                isDisabled={loadingTipos}
                placeholder="Seleccionar"
              />
              {loadingTipos && <Spinner size="sm" className="mt-2" />}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="tipo_entidad_comercial">Tipo de entidad comercial</Label>
              <Input id="tipo_entidad_comercial" name="tipo_entidad_comercial" type="select"
                     value={f.tipo_entidad_comercial || ''} onChange={chg}>
                <option value="">Seleccionar</option>
                <option value="Natural">Natural</option>
                <option value="Jurídica">Jurídica</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionTerceroGeneral;
