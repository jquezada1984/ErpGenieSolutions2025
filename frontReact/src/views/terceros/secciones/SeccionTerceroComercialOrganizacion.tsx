import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SelectCondicionPago from '../../../components/selects/SelectCondicionPago';
import SelectFormaPago from '../../../components/selects/SelectFormaPago';
import SelectRepresentante from '../../../components/selects/SelectRepresentante';
import SelectTamanoEmpresa from '../../../components/selects/SelectTamanoEmpresa';
import SelectDirectorioDocumento from '../../../components/selects/SelectDirectorioDocumento';
import ImageUpload from '../../../components/common/ImageUpload';
import useJwtPayload from '../../../hooks/useJwtPayload';

type Props = { data:any; onChange:(d:any)=>void };

const SeccionTerceroComercialOrganizacion: React.FC<Props> = ({ data, onChange }) => {
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaUsuario = payload?.id_empresa;

  const [f, setF] = useState<any>({
    capital: 0, id_condicion_pago:'', id_forma_pago:'', id_empresa: '',
    id_tamano_empresa:'', id_profesional_1:'', id_profesional_2:'', cif_intra:'',
    sede_central:'', asignado_a:'', logo:'', id_directorio_documento:'',
  });
  const [err, setErr] = useState<{[k:string]:string}>({});

  useEffect(()=> setF((p:any)=>({...p,...data})),[data]);

  // Si scope EMPRESA, asegurar que id_empresa del usuario se envía en el formulario cuando esté vacío
  useEffect(() => {
    if (scope === 'EMPRESA' && empresaUsuario && !data.id_empresa) {
      setF((p: any) => ({ ...p, id_empresa: empresaUsuario }));
      onChange({ ...data, id_empresa: empresaUsuario });
    }
  }, [scope, empresaUsuario, data.id_empresa]);

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

  const GET_REPRESENTANTES = gql`
    query GetRepresentantes($id_empresa: ID!) {
      representantesPorEmpresa(id_empresa: $id_empresa) {
        id_tercero
        nombre
      }
    }
  `;

  const GET_TIPOS_ENTIDAD = gql`
    query GetTiposEntidad {
      tiposEntidadComercial {
        id_tipo_entidad
        nombre
      }
    }
  `;

  const GET_TAMANOS_EMPRESA = gql`
    query GetTamanosEmpresa {
      tamanosEmpresa {
        id_tamano_empresa
        nombre
      }
    }
  `;

  // Obtener datos maestros con manejo de errores
  const { data: condicionesData, loading: loadingCondiciones, error: errorCondiciones } = useQuery(GET_CONDICIONES_PAGO);
  const { data: formasData, loading: loadingFormas, error: errorFormas } = useQuery(GET_FORMAS_PAGO);
  const { data: empresasData, loading: loadingEmpresas, error: errorEmpresas } = useQuery(GET_EMPRESAS);
  const { data: tamanosEmpresaData } = useQuery(GET_TAMANOS_EMPRESA);
  const {
    data: representantesData,
    loading: loadingRepresentantes,
  } = useQuery(GET_REPRESENTANTES, {
    variables: { id_empresa: f.id_empresa },
    skip: !f.id_empresa,
  });

  const condicionesPago = condicionesData?.condicionesPago || [];
  const formasPago = formasData?.formasPago || [];
  const empresas = empresasData?.empresas || [];
  const tamanosEmpresa = tamanosEmpresaData?.tamanosEmpresa || [];
  const representantes = representantesData?.representantesPorEmpresa || [];

  const loading = loadingCondiciones || loadingFormas || loadingEmpresas;

  const chg = useCallback((e:any)=>{
    const {name, value, type} = e.target;
    const v = type==='number' ? (value===''?0:Number(value)) : value;
    const u = {...f, [name]: v};
    if (name === 'id_empresa') {
      u.asignado_a = '';
    }
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
          {scope === 'GLOBAL' && (
          <Col md={4}>
            {errorEmpresas && (
              <div className="alert alert-danger">
                <strong>Error cargando empresas:</strong> {errorEmpresas.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_empresa">Empresa</Label>
              <SelectEmpresa
                value={f.id_empresa || ''}
                onChange={(val) => {
                  const u = { ...f, id_empresa: val ?? '', asignado_a: '' };
                  setF(u);
                  onChange(u);
                }}
                empresas={empresas}
                isLoading={loadingEmpresas}
                isDisabled={loadingEmpresas}
                placeholder="Seleccionar"
              />
            </FormGroup>
          </Col>
          )}
          <Col md={4}>
            {errorCondiciones && (
              <div className="alert alert-danger">
                <strong>Error cargando condiciones de pago:</strong> {errorCondiciones.message}
              </div>
            )}
            <FormGroup>
              <Label htmlFor="id_condicion_pago">Condiciones de pago</Label>
              <SelectCondicionPago
                value={f.id_condicion_pago || ''}
                onChange={(val) => {
                  const u = { ...f, id_condicion_pago: val ?? '' };
                  setF(u);
                  onChange(u);
                }}
                condiciones={condicionesPago}
                isLoading={loadingCondiciones}
                isDisabled={loadingCondiciones}
                placeholder="Seleccionar"
              />
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
              <SelectFormaPago
                value={f.id_forma_pago || ''}
                onChange={(val) => {
                  const u = { ...f, id_forma_pago: val ?? '' };
                  setF(u);
                  onChange(u);
                }}
                formas={formasPago}
                isLoading={loadingFormas}
                isDisabled={loadingFormas}
                placeholder="Seleccionar"
              />
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
          <Col md={4}>
            <FormGroup>
              <Label htmlFor="id_tamano_empresa">Tamaño de empresa</Label>
              <SelectTamanoEmpresa
                value={f.id_tamano_empresa || ''}
                onChange={(val) => {
                  const u = { ...f, id_tamano_empresa: val ?? '' };
                  setF(u);
                  onChange(u);
                }}
                tamanos={tamanosEmpresa}
                placeholder="Seleccionar"
              />
            </FormGroup>
          </Col>
        </Row>

        {false && (
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Carpeta de documentos</Label>
                <SelectDirectorioDocumento
                  module="tercero"
                  empresaId={f.id_empresa}
                  value={f.id_directorio_documento || ''}
                  isDisabled={!f.id_empresa}
                  onChange={(val) => {
                    const updated = {
                      ...f,
                      id_directorio_documento: val || '',
                    };
                    setF(updated);
                    onChange(updated);
                  }}
                />
                {!f.id_empresa && (
                  <FormText>
                    Debe seleccionar una empresa primero
                  </FormText>
                )}
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label>Subir Logo</Label>
              <ImageUpload
                value={f.logo}
                empresaId={f.id_empresa}
                disabled={!f.id_empresa}
                onChange={(url) => {
                  const updated = {
                    ...f,
                    logo: url,
                  };
                  setF(updated);
                  onChange(updated);
                }}
              />
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
              <Label htmlFor="asignado_a">Asignar representante</Label>
              <SelectRepresentante
                value={f.asignado_a || ''}
                onChange={(val) => {
                  const u = { ...f, asignado_a: val ?? '' };
                  setF(u);
                  onChange(u);
                }}
                representantes={representantes}
                isLoading={loadingRepresentantes}
                isDisabled={!f.id_empresa || loadingRepresentantes}
                placeholder={
                  !f.id_empresa
                    ? 'Seleccione empresa primero'
                    : 'Seleccionar representante'
                }
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionTerceroComercialOrganizacion;
