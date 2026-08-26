import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardTitle } from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';

type InfoModulo = {
  titulo: string;
  detalle: string;
  alternativas?: { label: string; to: string }[];
};

const POR_PREFIJO: { prefijo: string; info: InfoModulo }[] = [
  {
    prefijo: '/financiero/pedidos-facturables',
    info: {
      titulo: 'Pedidos facturables',
      detalle:
        'Facturar pedidos de venta aún no está disponible. Hoy puede emitir facturas de cliente de forma directa.',
      alternativas: [
        { label: 'Nueva factura cliente', to: '/financiero/facturas-clientes/nueva' },
        { label: 'Listado de facturas cliente', to: '/financiero/facturas-clientes/listado' },
      ],
    },
  },
  {
    prefijo: '/financiero/donaciones',
    info: {
      titulo: 'Donaciones',
      detalle: 'El módulo de donaciones está planificado (P1). No hay alta ni listado todavía.',
      alternativas: [
        { label: 'Facturas a clientes', to: '/financiero/facturas-clientes/listado' },
      ],
    },
  },
  {
    prefijo: '/financiero/impuestos',
    info: {
      titulo: 'Impuestos y gastos especiales',
      detalle:
        'Impuestos sociales/fiscales e IGST/CGST/SGST (menú heredado de Dolibarr) no están implementados. Para IVA use las cuentas de impuestos en Contabilidad.',
      alternativas: [
        { label: 'Cuentas de IVA', to: '/contabilidad/configuracion/cuentas-iva' },
        { label: 'Cuentas de impuestos', to: '/contabilidad/configuracion/cuentas-impuestos' },
      ],
    },
  },
  {
    prefijo: '/financiero/salarios',
    info: {
      titulo: 'Salarios',
      detalle: 'Nómina, pagos de sueldo y estadísticas de salarios aún no están disponibles.',
      alternativas: [{ label: 'Área de contabilidad', to: '/contabilidad' }],
    },
  },
  {
    prefijo: '/financiero/prestamos',
    info: {
      titulo: 'Préstamos',
      detalle: 'Alta y seguimiento de préstamos no están implementados.',
      alternativas: [{ label: 'Cuentas bancarias', to: '/banco-cajas/cuentas' }],
    },
  },
  {
    prefijo: '/financiero/pagos-varios',
    info: {
      titulo: 'Pagos varios',
      detalle:
        'Los pagos no ligados a factura aún no tienen flujo propio. Use cobros de cliente o pagos a proveedor.',
      alternativas: [
        { label: 'Cobros de cliente', to: '/financiero/facturas-clientes/pagos' },
        { label: 'Pagos a proveedor', to: '/financiero/facturas-proveedor/pagos' },
      ],
    },
  },
  {
    prefijo: '/financiero/margenes',
    info: {
      titulo: 'Márgenes',
      detalle: 'El informe de márgenes está pendiente. Las facturas de cliente y proveedor sí están operativas.',
      alternativas: [
        { label: 'Facturas cliente', to: '/financiero/facturas-clientes/listado' },
        { label: 'Facturas proveedor', to: '/financiero/facturas-proveedor/listado' },
      ],
    },
  },
  {
    prefijo: '/financiero/gastos',
    info: {
      titulo: 'Gastos / informes de gastos',
      detalle: 'Informes de gastos aún no están disponibles.',
      alternativas: [
        { label: 'Facturas de proveedor', to: '/financiero/facturas-proveedor/listado' },
      ],
    },
  },
  {
    prefijo: '/gastos',
    info: {
      titulo: 'Gastos / informes de gastos',
      detalle: 'Informes de gastos aún no están disponibles.',
      alternativas: [
        { label: 'Facturas de proveedor', to: '/financiero/facturas-proveedor/listado' },
      ],
    },
  },
  {
    prefijo: '/financiero/facturas-clientes/plantillas',
    info: {
      titulo: 'Plantillas de factura cliente',
      detalle: 'Las plantillas recurrentes están pendientes (P1). Puede crear facturas una a una.',
      alternativas: [{ label: 'Nueva factura cliente', to: '/financiero/facturas-clientes/nueva' }],
    },
  },
  {
    prefijo: '/financiero/facturas-clientes/estadisticas',
    info: {
      titulo: 'Estadísticas de facturas cliente',
      detalle: 'Las estadísticas de pantalla están pendientes (P1).',
      alternativas: [{ label: 'Listado de facturas cliente', to: '/financiero/facturas-clientes/listado' }],
    },
  },
  {
    prefijo: '/financiero/facturas-proveedor/plantillas',
    info: {
      titulo: 'Plantillas de factura proveedor',
      detalle: 'Las plantillas recurrentes están pendientes (P1).',
      alternativas: [{ label: 'Nueva factura proveedor', to: '/financiero/facturas-proveedor/nueva' }],
    },
  },
  {
    prefijo: '/financiero/facturas-proveedor/estadisticas',
    info: {
      titulo: 'Estadísticas de facturas proveedor',
      detalle: 'Las estadísticas de pantalla están pendientes (P1).',
      alternativas: [{ label: 'Listado de facturas proveedor', to: '/financiero/facturas-proveedor/listado' }],
    },
  },
];

const FALLBACK: InfoModulo = {
  titulo: 'Módulo en desarrollo',
  detalle:
    'Esta opción del menú está prevista y todavía no tiene pantallas. Facturas, cobros y pagos a proveedor sí están operativos.',
  alternativas: [
    { label: 'Facturas cliente', to: '/financiero/facturas-clientes/listado' },
    { label: 'Facturas proveedor', to: '/financiero/facturas-proveedor/listado' },
  ],
};

function resolverInfo(pathname: string): InfoModulo {
  const exacto = POR_PREFIJO.find((e) => e.prefijo === pathname);
  if (exacto) return exacto.info;
  const porPrefijo = POR_PREFIJO.find(
    (e) => pathname === e.prefijo || pathname.startsWith(`${e.prefijo}/`),
  );
  return porPrefijo?.info ?? FALLBACK;
}

const ModuloPendiente: React.FC = () => {
  const { pathname } = useLocation();
  const info = resolverInfo(pathname);

  return (
    <Card>
      <CardBody>
        <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa para continuar." />
        <CardTitle tag="h4">{info.titulo}</CardTitle>
        <Alert color="warning" className="mb-3">
          {info.detalle}
        </Alert>
        <p className="text-muted small mb-3">Ruta: {pathname}</p>
        {info.alternativas?.map((a) => (
          <Button key={a.to} color="primary" outline tag={Link} to={a.to} className="me-2 mb-2">
            {a.label}
          </Button>
        ))}
      </CardBody>
    </Card>
  );
};

export default ModuloPendiente;
