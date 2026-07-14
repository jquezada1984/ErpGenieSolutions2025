import React, { useEffect, useCallback } from 'react';

import { Row, Col, FormGroup, Label, FormText } from 'reactstrap';

import type { FieldErrors } from 'react-hook-form';

import { useQuery, gql } from '@apollo/client';

import SelectEmpresa from '../../../components/SelectEmpresa';

import useJwtPayload from '../../../hooks/useJwtPayload';

import type { NuevaCuentaBancariaFormValues } from '../schemas/NuevaCuentaBancariaSchema';

import { fieldErrorMessage } from '../utils/cuentaFormValidation';



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



type Props = {

  data: Record<string, unknown>;

  onChange: (d: Record<string, unknown>) => void;

  soloLectura?: boolean;

  errors?: FieldErrors<NuevaCuentaBancariaFormValues>;

};



const SeccionCuentaEmpresa: React.FC<Props> = ({ data, onChange, soloLectura = false, errors }) => {

  const payload = useJwtPayload();

  const scope = payload?.scope_acceso || 'EMPRESA';

  const empresaUsuario = payload?.id_empresa;

  const idEmpresa = String(data.id_empresa || '');

  const errEmpresa = fieldErrorMessage(errors, 'id_empresa');



  const { data: empresasData, loading: loadingEmpresas, error: errorEmpresas } = useQuery(GET_EMPRESAS, {

    skip: scope !== 'GLOBAL',

  });

  const empresas = empresasData?.empresas || [];



  useEffect(() => {

    if (scope === 'EMPRESA' && empresaUsuario && !data.id_empresa) {

      onChange({ id_empresa: empresaUsuario });

    }

  }, [scope, empresaUsuario, data.id_empresa, onChange]);



  const onEmpresaChange = useCallback(

    (val: string | null) => {

      onChange({ id_empresa: val ?? '', id_tercero: '' });

    },

    [onChange],

  );



  if (scope !== 'GLOBAL') {

    return null;

  }



  const empresaNombre =

    empresas.find((e: { id_empresa: string }) => e.id_empresa === idEmpresa)?.nombre || '';



  if (soloLectura && idEmpresa) {

    return (

      <Row className="mb-3">

        <Col md={6}>

          <FormGroup>

            <Label>Empresa</Label>

            <p className="form-control-plaintext mb-0">

              <strong>{empresaNombre || idEmpresa}</strong>

            </p>

          </FormGroup>

        </Col>

      </Row>

    );

  }



  return (

    <Row className="mb-1">

      <Col md={6}>

        {errorEmpresas ? (

          <div className="alert alert-danger" role="alert">

            <strong>Error cargando empresas:</strong> {errorEmpresas.message}

          </div>

        ) : null}

        <FormGroup>

          <Label htmlFor="id_empresa_cuenta">

            Empresa <span className="text-danger">*</span>

          </Label>

          <SelectEmpresa

            value={idEmpresa || null}

            onChange={onEmpresaChange}

            empresas={empresas}

            isLoading={loadingEmpresas}

            isDisabled={loadingEmpresas || soloLectura}

            placeholder="Seleccionar empresa"

          />

          {errEmpresa && <FormText color="danger">{errEmpresa}</FormText>}

        </FormGroup>

      </Col>

    </Row>

  );

};



export default SeccionCuentaEmpresa;


