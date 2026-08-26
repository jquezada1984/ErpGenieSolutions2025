import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from 'reactstrap';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';
import {
  anularFacturaProveedor,
  validarFacturaProveedor,
  descargarPdfFacturaProveedor,
  enviarCorreoFacturaProveedor,
  reemplazarLineasFacturaProveedor,
} from '../../../_apis_/financiero';
import FacturaLineasEditor, {
  lineasDesdeApi,
  toApiLineas,
  type LineaFacturaDraft,
} from '../lineas/FacturaLineasEditor';

const GET_FACTURA = gql`
  query FacturaProveedorDetalle($id_factura: String!, $id_empresa: String!) {
    facturaProveedor(id_factura: $id_factura, id_empresa: $id_empresa) {
      id_factura
      numero_factura
      fecha_factura
      fecha_vencimiento
      estado
      tipo_factura
      id_tercero
      tercero_nombre
      subtotal
      total_impuestos
      total_descuentos
      total_factura
      monto_pendiente
      nota_publica
      lineas {
        id_factura_linea
        id_item
        descripcion
        cantidad
        precio_unitario
        descuento_porcentaje
        descuento_valor
        subtotal
        orden
      }
    }
  }
`;

const DetalleFacturaProveedor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { idEmpresa } = useConfigEmpresaScope();
  const [accion, setAccion] = useState(false);
  const [guardandoLineas, setGuardandoLineas] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [lineas, setLineas] = useState<LineaFacturaDraft[]>([]);

  const { data, loading, error, refetch } = useQuery(GET_FACTURA, {
    variables: { id_factura: id, id_empresa: idEmpresa },
    skip: !id || !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const f = data?.facturaProveedor;
  const pendiente = Number(f?.monto_pendiente || 0);
  const esBorrador = f?.estado === 'BORRADOR';

  useEffect(() => {
    if (f?.lineas) setLineas(lineasDesdeApi(f.lineas));
  }, [f?.id_factura]);

  const onChangeLineas = async (next: LineaFacturaDraft[]) => {
    setLineas(next);
    if (!id || !esBorrador) return;
    setGuardandoLineas(true);
    setErrorAccion(null);
    try {
      await reemplazarLineasFacturaProveedor(id, toApiLineas(next));
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      const d = ex.response?.data;
      setErrorAccion(typeof d === 'string' ? d : JSON.stringify(d) || ex.message || 'Error al guardar líneas');
    } finally {
      setGuardandoLineas(false);
    }
  };

  const ejecutar = async (tipo: 'validar' | 'anular' | 'pdf' | 'correo') => {
    if (!id) return;
    if (tipo === 'anular' && !window.confirm('¿Anular / eliminar esta factura?')) return;
    setAccion(true);
    setMensaje(null);
    setErrorAccion(null);
    try {
      if (tipo === 'validar') {
        if (!lineas.length) {
          setErrorAccion('Añada al menos una línea antes de validar.');
          return;
        }
        await reemplazarLineasFacturaProveedor(id, toApiLineas(lineas));
        await validarFacturaProveedor(id);
        setMensaje('Factura validada. La contabilización se encola en RabbitMQ.');
        await refetch();
      } else if (tipo === 'anular') {
        await anularFacturaProveedor(id);
        setMensaje('Factura anulada.');
        await refetch();
      } else if (tipo === 'pdf') {
        await descargarPdfFacturaProveedor(id);
      } else {
        const extra = window.prompt('Correo adicional (vacío = correo del proveedor):', '') || '';
        const dataCorreo = (await enviarCorreoFacturaProveedor(
          id,
          extra.trim() ? { destinatarios: [extra.trim()] } : {},
        )) as { to?: string[]; enqueued?: boolean };
        setMensaje(
          dataCorreo?.enqueued === false
            ? `No se publicó en Rabbit. Destino: ${(dataCorreo.to || []).join(', ')}`
            : `Correo encolado para ${(dataCorreo.to || []).join(', ')}.`,
        );
      }
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      const d = ex.response?.data;
      setErrorAccion(typeof d === 'string' ? d : JSON.stringify(d) || ex.message || 'Error');
    } finally {
      setAccion(false);
    }
  };

  if (!idEmpresa) {
    return (
      <Card>
        <CardBody>
          <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa." />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <ConfigEmpresaBar hideWhenEmpresa />
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <CardTitle tag="h4" className="mb-0">
            Factura proveedor {f?.numero_factura || (esBorrador ? '(borrador)' : id)}
          </CardTitle>
          <div className="d-flex gap-2 flex-wrap">
            {esBorrador && (
              <Button color="primary" disabled={accion || guardandoLineas} onClick={() => ejecutar('validar')}>
                VALIDAR
              </Button>
            )}
            {f && (
              <Button color="info" outline disabled={accion} onClick={() => ejecutar('pdf')}>
                PDF
              </Button>
            )}
            {f?.estado === 'VALIDADA' && (
              <Button color="secondary" disabled={accion} onClick={() => ejecutar('correo')}>
                Enviar correo
              </Button>
            )}
            {f?.estado === 'VALIDADA' && pendiente > 0 && (
              <Button
                color="primary"
                tag={Link}
                to={`/financiero/facturas-proveedor/pagos/nuevo?id_tercero=${encodeURIComponent(
                  f.id_tercero,
                )}&tercero_nombre=${encodeURIComponent(
                  f.tercero_nombre || '',
                )}&id_factura=${encodeURIComponent(f.id_factura)}&numero_factura=${encodeURIComponent(
                  f.numero_factura || '',
                )}&monto=${encodeURIComponent(String(pendiente.toFixed(2)))}`}
              >
                Registrar pago
              </Button>
            )}
            {f && f.estado !== 'ANULADA' && (
              <Button color="danger" outline disabled={accion} onClick={() => ejecutar('anular')}>
                {esBorrador ? 'ELIMINAR' : 'Anular'}
              </Button>
            )}
            <Button color="secondary" outline tag={Link} to="/financiero/facturas-proveedor/listado">
              Listado
            </Button>
          </div>
        </div>

        {mensaje && <Alert color="success">{mensaje}</Alert>}
        {errorAccion && <Alert color="danger">{errorAccion}</Alert>}
        {error && <Alert color="danger">Error al cargar</Alert>}
        {guardandoLineas && <div className="small text-muted mb-2">Guardando líneas…</div>}
        {loading && <Spinner />}

        {f && (
          <>
            <p>
              <Badge color={f.estado === 'VALIDADA' ? 'success' : f.estado === 'ANULADA' ? 'danger' : 'secondary'}>
                {f.estado}
              </Badge>{' '}
              Proveedor: <strong>{f.tercero_nombre}</strong> · Fecha: {f.fecha_factura} · Tipo:{' '}
              {f.tipo_factura}
              {f.estado === 'VALIDADA' && (
                <>
                  {' '}
                  · Pendiente: <strong>{pendiente.toFixed(2)}</strong>
                </>
              )}
            </p>
            {idEmpresa && (
              <FacturaLineasEditor
                idEmpresa={idEmpresa}
                lineas={lineas}
                onChange={onChangeLineas}
                editable={esBorrador}
                esProveedor
              />
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default DetalleFacturaProveedor;
