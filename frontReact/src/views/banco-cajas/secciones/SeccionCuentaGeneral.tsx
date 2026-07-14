import React, { useEffect, useState, useCallback } from 'react';

import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap';

import type { FieldErrors } from 'react-hook-form';

import { useQuery, gql } from '@apollo/client';

import CountrySelect from '../../../components/CountrySelect';

import SelectProvincia from '../../../components/selects/SelectProvincia';

import { TIPOS_CUENTA, ESTADOS_CUENTA } from '../constants';

import type { NuevaCuentaBancariaFormValues } from '../schemas/NuevaCuentaBancariaSchema';

import { fieldErrorMessage } from '../utils/cuentaFormValidation';



const GET_MONEDAS = gql`

  query {

    monedas {

      id_moneda

      nombre

      codigo

    }

  }

`;



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



type Props = {

  data: Record<string, unknown>;

  onChange: (d: Record<string, unknown>) => void;

  errors?: FieldErrors<NuevaCuentaBancariaFormValues>;

};



const SeccionCuentaGeneral: React.FC<Props> = ({ data, onChange, errors }) => {

  const [f, setF] = useState<Record<string, unknown>>({});

  const { data: monedasData } = useQuery(GET_MONEDAS);

  const { data: paisesData, loading: loadingPaises } = useQuery(GET_PAISES);

  const monedas = monedasData?.monedas || [];

  const paises = paisesData?.paises || [];



  useEffect(() => setF((p) => ({ ...p, ...data })), [data]);



  const chg = useCallback(

    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

      const { name, value } = e.target;

      const u: Record<string, unknown> = { ...f, [name]: value };

      if (name === 'id_pais') {

        u.id_provincia = '';

      }

      setF(u);

      onChange(u);

    },

    [f, onChange],

  );



  const idPais = String(f.id_pais || '');

  const errMoneda = fieldErrorMessage(errors, 'id_moneda');

  const errTipo = fieldErrorMessage(errors, 'tipo_cuenta');



  return (

    <Card>

      <CardBody>

        <h5 className="mb-4">Identificación</h5>

        <Row>

          <Col md={6}>

            <FormGroup>

              <Label>Ref.</Label>

              <Input name="referencia" value={String(f.referencia || '')} onChange={chg} />

            </FormGroup>

          </Col>

          <Col md={6}>

            <FormGroup>

              <Label>Etiqueta cuenta o caja</Label>

              <Input name="etiqueta_cuenta" value={String(f.etiqueta_cuenta || '')} onChange={chg} />

            </FormGroup>

          </Col>

          <Col md={6}>

            <FormGroup>

              <Label>Tipo de cuenta *</Label>

              <Input

                type="select"

                name="tipo_cuenta"

                value={String(f.tipo_cuenta || '')}

                onChange={chg}

                invalid={!!errTipo}

              >

                {TIPOS_CUENTA.map((t) => (

                  <option key={t.value} value={t.value}>

                    {t.label}

                  </option>

                ))}

              </Input>

              {errTipo && <FormText color="danger">{errTipo}</FormText>}

            </FormGroup>

          </Col>

          <Col md={6}>

            <FormGroup>

              <Label>Divisa *</Label>

              <Input

                type="select"

                name="id_moneda"

                value={String(f.id_moneda || '')}

                onChange={chg}

                invalid={!!errMoneda}

              >

                <option value="">Seleccionar…</option>

                {monedas.map((m: { id_moneda: string; nombre: string; codigo?: string }) => (

                  <option key={m.id_moneda} value={m.id_moneda}>

                    {m.nombre} {m.codigo ? `(${m.codigo})` : ''}

                  </option>

                ))}

              </Input>

              {errMoneda && <FormText color="danger">{errMoneda}</FormText>}

            </FormGroup>

          </Col>

          <Col md={6}>

            <FormGroup>

              <Label>Estado</Label>

              <Input type="select" name="estado_cuenta" value={String(f.estado_cuenta || 'abierta')} onChange={chg}>

                {ESTADOS_CUENTA.map((e) => (

                  <option key={e.value} value={e.value}>

                    {e.label}

                  </option>

                ))}

              </Input>

            </FormGroup>

          </Col>

          <Col md={6}>

            <CountrySelect

              key={`country-select-${idPais}-${paises.length}`}

              id="id_pais"

              name="id_pais"

              value={idPais}

              onChange={chg}

              disabled={loadingPaises}

              loading={loadingPaises}

              countries={paises}

              label={

                <>

                  <i className="fas fa-globe me-1" />

                  País de la cuenta

                </>

              }

            />

          </Col>

          <Col md={6}>

            <FormGroup>

              <Label>Provincia</Label>

              <SelectProvincia

                key={`provincia-${idPais}-${String(f.id_provincia || '')}`}

                value={String(f.id_provincia || '') || null}

                onChange={(v) => {

                  const u = { ...f, id_provincia: v ?? '' };

                  setF(u);

                  onChange(u);

                }}

                id_pais={idPais || null}

                isDisabled={!idPais}

                placeholder="Seleccionar provincia"

              />

            </FormGroup>

          </Col>

          <Col md={12}>

            <FormGroup>

              <Label>Domiciliación de cuenta</Label>

              <Input

                type="textarea"

                name="direccion_banco"

                rows={3}

                value={String(f.direccion_banco || '')}

                onChange={chg}

              />

            </FormGroup>

          </Col>

          <Col md={6}>

            <FormGroup>

              <Label>Web</Label>

              <Input name="web" value={String(f.web || '')} onChange={chg} />

            </FormGroup>

          </Col>

        </Row>

      </CardBody>

    </Card>

  );

};



export default SeccionCuentaGeneral;


