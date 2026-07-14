import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Alert, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Spinner } from 'reactstrap';
import useJwtPayload from '../../../hooks/useJwtPayload';

const GET_ESTADO = gql`
  query EstadoAreaContabilidad($id_empresa: String!) {
    estadoAreaContabilidad(id_empresa: $id_empresa) {
      paso1_diarios
      paso2_modelos
      paso3_plan
      plan_activo_nombre
      paso4_periodo
      paso5_cuentas_defecto
      paso6_cuentas_bancarias
      paso7_cuentas_iva
      paso8_cuentas_impuestos
      paso9_cuentas_productos
    }
  }
`;

type Paso = { n: string; label: string; to: string; key: keyof EstadoKeys };

type EstadoKeys = {
  paso1_diarios: boolean;
  paso2_modelos: boolean;
  paso3_plan: boolean;
  paso4_periodo: boolean;
  paso5_cuentas_defecto: boolean;
  paso6_cuentas_bancarias: boolean;
  paso7_cuentas_iva: boolean;
  paso8_cuentas_impuestos: boolean;
  paso9_cuentas_productos: boolean;
};

const PASOS_CONFIG: Paso[] = [
  { n: '1', label: 'Verificar lista de diarios', to: '/contabilidad/configuracion/diarios', key: 'paso1_diarios' },
  { n: '2', label: 'Verificar/crear modelo de plan de cuentas', to: '/contabilidad/configuracion/modelos-planes', key: 'paso2_modelos' },
  { n: '3', label: 'Seleccionar/completar plan de cuentas', to: '/contabilidad/configuracion/plan-contable', key: 'paso3_plan' },
  { n: '4', label: 'Definir ejercicio fiscal por defecto', to: '/contabilidad/configuracion/periodo', key: 'paso4_periodo' },
  { n: '5', label: 'Definir cuentas contables por defecto', to: '/contabilidad/configuracion/cuentas-defecto', key: 'paso5_cuentas_defecto' },
  { n: '6', label: 'Definir cuentas de cada banco', to: '/contabilidad/configuracion/cuentas-bancarias', key: 'paso6_cuentas_bancarias' },
  { n: '7', label: 'Definir cuentas de tasas de IVA', to: '/contabilidad/configuracion/cuentas-iva', key: 'paso7_cuentas_iva' },
  { n: '8', label: 'Definir cuentas por defecto de impuestos', to: '/contabilidad/configuracion/cuentas-impuestos', key: 'paso8_cuentas_impuestos' },
  { n: '9', label: 'Definir cuentas de productos/servicios', to: '/contabilidad/configuracion/cuentas-productos', key: 'paso9_cuentas_productos' },
];

const PASOS_OP: { n: string; label: string; to: string }[] = [
  { n: 'A', label: 'Verificar vínculos facturas clientes', to: '/contabilidad/transferencia/facturas-clientes' },
  { n: 'B', label: 'Verificar vínculos facturas proveedores', to: '/contabilidad/transferencia/facturas-proveedores' },
  { n: 'C', label: 'Registrar transacciones en contabilidad', to: '/contabilidad/transferencia/registro/ventas' },
  { n: 'D', label: 'Leer informes o exportar contabilidad', to: '/contabilidad/exportar' },
  { n: 'E', label: 'Cerrar el periodo', to: '/contabilidad/cerrar' },
];

const AreaContabilidad: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const { data, loading, error } = useQuery(GET_ESTADO, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const estado = data?.estadoAreaContabilidad as EstadoKeys | undefined;

  const icono = (ok?: boolean) => (ok ? '✓' : '⚠');

  return (
    <div>
      <h4 className="mb-3">Área contabilidad</h4>
      {error && <Alert color="danger">Error al cargar el estado de configuración</Alert>}
      {loading && <Spinner />}

      {!loading && estado && (
        <>
          {estado.plan_activo_nombre && (
            <Alert color="info" className="mb-3">
              Plan contable activo: <strong>{data.estadoAreaContabilidad.plan_activo_nombre}</strong>
            </Alert>
          )}

          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Configuración inicial (una vez o anualmente)</CardTitle>
              <ListGroup flush>
                {PASOS_CONFIG.map((p) => (
                  <ListGroupItem key={p.n} className="d-flex justify-content-between align-items-center">
                    <span>
                      <strong>PASO {p.n}:</strong> {p.label}
                    </span>
                    <span>
                      <span className="me-2" title={estado[p.key] ? 'Completado' : 'Pendiente'}>
                        {icono(estado[p.key])}
                      </span>
                      <Link to={p.to}>Ir</Link>
                    </span>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle tag="h5">Operación diaria, semanal o mensual</CardTitle>
              <ListGroup flush>
                {PASOS_OP.map((p) => (
                  <ListGroupItem key={p.n} className="d-flex justify-content-between align-items-center">
                    <span>
                      <strong>PASO {p.n}:</strong> {p.label}
                    </span>
                    <Link to={p.to}>Ir</Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default AreaContabilidad;
