import React, { useEffect, useState, useCallback } from 'react';

import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap';

import type { FieldErrors } from 'react-hook-form';

import type { NuevaCuentaBancariaFormValues } from '../schemas/NuevaCuentaBancariaSchema';

import { fieldErrorMessage } from '../utils/cuentaFormValidation';



type Props = {

  data: Record<string, unknown>;

  onChange: (d: Record<string, unknown>) => void;

  errors?: FieldErrors<NuevaCuentaBancariaFormValues>;

};



const SeccionCuentaSaldos: React.FC<Props> = ({ data, onChange, errors }) => {

  const [f, setF] = useState<Record<string, unknown>>({});



  useEffect(() => setF((p) => ({ ...p, ...data })), [data]);



  const chg = useCallback(

    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

      const { name, value, type } = e.target;

      const v = type === 'number' ? Number(value) : value;

      const u = { ...f, [name]: v };

      setF(u);

      onChange(u);

    },

    [f, onChange],

  );



  const errSaldoInicial = fieldErrorMessage(errors, 'saldo_inicial');

  const errMinAut = fieldErrorMessage(errors, 'saldo_minimo_autorizado');

  const errMinDes = fieldErrorMessage(errors, 'saldo_minimo_deseado');



  return (

    <Card>

      <CardBody>

        <h5 className="mb-4">Saldos y comentarios</h5>

        <Row>

          <Col md={12}>

            <FormGroup>

              <Label>Comentario</Label>

              <Input

                type="textarea"

                name="comentario"

                rows={4}

                value={String(f.comentario || '')}

                onChange={chg}

              />

            </FormGroup>

          </Col>

          <Col md={4}>

            <FormGroup>

              <Label>Saldo inicial</Label>

              <Input

                type="number"

                step="0.01"

                name="saldo_inicial"

                value={Number(f.saldo_inicial ?? 0)}

                onChange={chg}

                invalid={!!errSaldoInicial}

              />

              {errSaldoInicial && <FormText color="danger">{errSaldoInicial}</FormText>}

            </FormGroup>

          </Col>

          <Col md={4}>

            <FormGroup>

              <Label>Fecha</Label>

              <Input

                type="date"

                name="fecha_saldo_inicial"

                value={String(f.fecha_saldo_inicial || '').slice(0, 10)}

                onChange={chg}

              />

            </FormGroup>

          </Col>

          <Col md={4}>

            <FormGroup>

              <Label>Saldo mínimo autorizado</Label>

              <Input

                type="number"

                step="0.01"

                name="saldo_minimo_autorizado"

                value={Number(f.saldo_minimo_autorizado ?? 0)}

                onChange={chg}

                invalid={!!errMinAut}

              />

              {errMinAut && <FormText color="danger">{errMinAut}</FormText>}

            </FormGroup>

          </Col>

          <Col md={4}>

            <FormGroup>

              <Label>Saldo mínimo deseado</Label>

              <Input

                type="number"

                step="0.01"

                name="saldo_minimo_deseado"

                value={Number(f.saldo_minimo_deseado ?? 0)}

                onChange={chg}

                invalid={!!errMinDes}

              />

              {errMinDes && <FormText color="danger">{errMinDes}</FormText>}

            </FormGroup>

          </Col>

        </Row>

      </CardBody>

    </Card>

  );

};



export default SeccionCuentaSaldos;


