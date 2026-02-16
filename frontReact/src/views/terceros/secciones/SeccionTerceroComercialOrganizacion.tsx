import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

type Props = { data:any; onChange:(d:any)=>void };

const SeccionTerceroComercialOrganizacion: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<any>({
    capital: 0, id_condicion_pago:'', id_forma_pago:'', id_empresa: '',
    id_profesional_1:'', id_profesional_2:'', cif_intra:'',
    sede_central:'', asignado_a:''
  });
  const [err, setErr] = useState<{[k:string]:string}>({});

  useEffect(()=> setF((p:any)=>({...p,...data})),[data]);

  // Queries GraphQL para obtener catálogos (igual que en SeccionEmpresa)
  const GET_CONDICIONES_PAGO = gql`
    query GetCondicionesPago {
      condicionesPago {
        id_condicion_pago
        descripcion
      }
    }
  `;

  const GET_FORMAS_PAGO = gql`
    query GetFormasPago {
      formasPago {
        id_forma_pago
        descripcion
      }
    }
  `;

  const GET_EMPRESAS = gql`
    query GetEmpresas {
      empresas {
        id_empresa
        nombre
        ruc
        estado
      }
    }
  `;

  // Obtener datos maestros con manejo de errores
  const { data: condicionesData, loading: loadingCondiciones, error: errorCondiciones } = useQuery(GET_CONDICIONES_PAGO);
  const { data: formasData, loading: loadingFormas, error: errorFormas } = useQuery(GET_FORMAS_PAGO);
  const { data: empresasData, loading: loadingEmpresas, error: errorEmpresas } = useQuery(GET_EMPRESAS);

  const condicionesPago = condicionesData?.condicionesPago || [];
  const formasPago = formasData?.formasPago || [];
  const empresas = empresasData?.empresas || [];
  
  const loading = loadingCondiciones || loadingFormas || loadingEmpresas;

  const chg = useCallback((e:any)=>{
    const {name, value, type} = e.target;
    const v = type==='number' ? (value===''?0:Number(value)) : value;
    const u = {...f, [name]: v};
    setF(u);
    if (name==='capital') {
      const ne={...err}; if (v<0) ne.capital='No puede ser negativo'; else delete ne.capital; setErr(ne);
    }
    onChange(u);
  },[f,onChange,err]);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4"><i className="fas fa-briefcase text-primary me-2" />Comercial y organización</h5>

        <Row>
          <Col md={4}>
            {errorEmpresas && (
              <div className="alert alert-danger">
                <strong>Error cargando empresas:</strong> {errorEmpresas.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_empresa">Empresa</Label>
              <Input id="id_empresa" name="id_empresa" type="select" value={f.id_empresa || ''} onChange={chg} disabled={loadingEmpresas}>
                <option value="">{loadingEmpresas ? 'Cargando...' : 'Seleccionar'}</option>
                {empresas.map((emp) => (
                  <option key={emp.id_empresa} value={emp.id_empresa}>
                    {emp.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            {errorCondiciones && (
              <div className="alert alert-danger">
                <strong>Error cargando condiciones de pago:</strong> {errorCondiciones.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_condicion_pago">Condiciones de pago</Label>
              <Input id="id_condicion_pago" name="id_condicion_pago" type="select" value={f.id_condicion_pago || ''} onChange={chg} disabled={loadingCondiciones}>
                <option value="">{loadingCondiciones ? 'Cargando...' : 'Seleccionar'}</option>
                {condicionesPago.map((cond) => (
                  <option key={cond.id_condicion_pago} value={cond.id_condicion_pago}>
                    {cond.descripcion}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            {errorFormas && (
              <div className="alert alert-danger">
                <strong>Error cargando formas de pago:</strong> {errorFormas.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_forma_pago">Forma de pago</Label>
              <Input id="id_forma_pago" name="id_forma_pago" type="select" value={f.id_forma_pago || ''} onChange={chg} disabled={loadingFormas}>
                <option value="">{loadingFormas ? 'Cargando...' : 'Seleccionar'}</option>
                {formasPago.map((forma) => (
                  <option key={forma.id_forma_pago} value={forma.id_forma_pago}>
                    {forma.descripcion}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="capital">Capital</Label>
              <Input id="capital" name="capital" type="number" step="0.01" min="0"
                     value={f.capital} onChange={chg} invalid={!!err.capital}/>
              {err.capital && <FormText color="danger">{err.capital}</FormText>}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="id_profesional_1">ID profesional 1</Label>
              <Input id="id_profesional_1" name="id_profesional_1" value={f.id_profesional_1 || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="id_profesional_2">ID profesional 2</Label>
              <Input id="id_profesional_2" name="id_profesional_2" value={f.id_profesional_2 || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="cif_intra">CIF Intra.</Label>
              <Input id="cif_intra" name="cif_intra" value={f.cif_intra || ''} onChange={chg}/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="sede_central">Sede central (UUID de tercero)</Label>
              <Input id="sede_central" name="sede_central" value={f.sede_central || ''} onChange={chg}/>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="asignado_a">Asignar a representante</Label>
              <Input id="asignado_a" name="asignado_a" type="select" value={f.asignado_a || ''} onChange={chg}>
                <option value="">Seleccionar</option>
                {/* llena con usuarios */}
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionTerceroComercialOrganizacion;
