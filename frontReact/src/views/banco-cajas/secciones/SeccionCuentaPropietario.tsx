import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { useQuery, gql } from '@apollo/client';
import useJwtPayload from '../../../hooks/useJwtPayload';

const GET_TERCEROS = gql`
  query GetTerceros($id_empresa: ID) {
    terceros(id_empresa: $id_empresa) {
      id_tercero
      nombre
      apodo
    }
  }
`;

type Props = { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void };

const SeccionCuentaPropietario: React.FC<Props> = ({ data, onChange }) => {
  const [f, setF] = useState<Record<string, unknown>>({});
  const payload = useJwtPayload();
  const idEmpresaForm = String(data.id_empresa || '');
  const idEmpresaJwt = payload?.id_empresa;
  const idEmpresa = idEmpresaForm || idEmpresaJwt;

  const { data: tercerosData } = useQuery(GET_TERCEROS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
  });
  const terceros = tercerosData?.terceros || [];

  useEffect(() => setF((p) => ({ ...p, ...data })), [data]);

  const chg = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const u = { ...f, [name]: value };
      setF(u);
      onChange(u);
    },
    [f, onChange],
  );

  const titular = terceros.find((t: { id_tercero: string }) => t.id_tercero === f.id_tercero);

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">Propietario (tercero)</h5>
        <Row>
          <Col md={8}>
            <FormGroup>
              <Label>Titular de la cuenta</Label>
              <Input type="select" name="id_tercero" value={String(f.id_tercero || '')} onChange={chg}>
                <option value="">Seleccionar tercero…</option>
                {terceros.map((t: { id_tercero: string; nombre: string; apodo?: string }) => (
                  <option key={t.id_tercero} value={t.id_tercero}>
                    {t.nombre}
                    {t.apodo ? ` (${t.apodo})` : ''}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          {titular && (
            <Col md={12}>
              <p className="text-muted small mb-0">
                Tercero seleccionado: <strong>{titular.nombre}</strong>
              </p>
            </Col>
          )}
          <Col md={6} className="mt-3">
            <FormGroup>
              <Label>Código contable</Label>
              <Input name="codigo_contable" value={String(f.codigo_contable || '')} onChange={chg} />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SeccionCuentaPropietario;
