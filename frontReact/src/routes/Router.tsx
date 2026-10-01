import React, { lazy, ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
import AuthGuard from '../components/authGurad/AuthGuard';
import Error404 from '../views/auth/Error404';

/****Layouts*****/
const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));

/***** Pages ****/
const Starter = Loadable(lazy(() => import('../views/Starter')));
const About = Loadable(lazy(() => import('../views/About')));
const Alerts = Loadable(lazy(() => import('../views/ui/Alerts')));
const Badges = Loadable(lazy(() => import('../views/ui/Badges')));
const Buttons = Loadable(lazy(() => import('../views/ui/Buttons')));
const Cards = Loadable(lazy(() => import('../views/ui/Cards')));
const Grid = Loadable(lazy(() => import('../views/ui/Grid')));
const Tables = Loadable(lazy(() => import('../views/ui/Tables')));
const Forms = Loadable(lazy(() => import('../views/ui/Forms')));
const Breadcrumbs = Loadable(lazy(() => import('../views/ui/Breadcrumbs')));
const Login = Loadable(lazy(() => import('../views/auth/Login')));
const Comercio = Loadable(lazy(() => import('../views/dashboards/DashboardInicio')));
const DashboardTerceros = Loadable(lazy(() => import('../views/dashboards/DashboardTerceros')));
const DashboardProductos = Loadable(lazy(() => import('../views/dashboards/DashboardProductos')));
const DashboardFinanciero = Loadable(lazy(() => import('../views/dashboards/DashboardFinanciero')));
const DashboardBanco = Loadable(lazy(() => import('../views/dashboards/DashboardBanco')));
const DashboardComercial = Loadable(lazy(() => import('../views/dashboards/DashboardComercial')));
const Empresas = Loadable(lazy(() => import('../views/empresas/Empresas')));
const NuevaEmpresa = Loadable(lazy(() => import('../views/empresas/NuevaEmpresa')));
const EditarEmpresa = Loadable(lazy(() => import('../views/empresas/EditarEmpresa')));
const NuevaSucursal = Loadable(lazy(() => import('../views/sucursales/NuevaSucursal')));
const Sucursales = Loadable(lazy(() => import('../views/sucursales/Sucursales')));
const EditarSucursal = Loadable(lazy(() => import('../views/sucursales/EditarSucursal')));
const Perfiles = Loadable(lazy(() => import('../views/perfiles/Perfiles')));
const NuevoPerfil = Loadable(lazy(() => import('../views/perfiles/NuevoPerfil')));
const EditarPerfil = Loadable(lazy(() => import('../views/perfiles/EditarPerfil')));
const Menus = Loadable(lazy(() => import('../views/menus/Menus')));
const MenuMasterDetail = Loadable(lazy(() => import('../views/menus/MenuMasterDetail')));
const NuevoMenuCompleto = Loadable(lazy(() => import('../views/menus/NuevoMenuCompleto')));
const NuevoMenu = Loadable(lazy(() => import('../views/menus/NuevoMenu')));
const NuevaSeccion = Loadable(lazy(() => import('../views/menus/NuevaSeccion')));
const NuevoItem = Loadable(lazy(() => import('../views/menus/NuevoItem')));
const EditarItem = Loadable(lazy(() => import('../views/menus/EditarItem')));
const Usuarios = Loadable(lazy(() => import('../views/usuarios/Usuarios')));
const NuevoUsuario = Loadable(lazy(() => import('../views/usuarios/NuevoUsuario')));
const EditarUsuario = Loadable(lazy(() => import('../views/usuarios/EditarUsuario')));
const NuevoTercero = Loadable(lazy(() => import('../views/terceros/NuevoTercero')));
const Terceros = Loadable(lazy(() => import('../views/terceros/Terceros')));
const EditarTercero = Loadable(lazy(() => import('../views/terceros/EditarTercero')));
const Clientes = Loadable(lazy(() => import('../views/terceros/Clientes')));
const NuevoCliente = Loadable(lazy(() => import('../views/terceros/NuevoCliente')));
const EditarCliente = Loadable(lazy(() => import('../views/terceros/EditarCliente')));
const ClientesPotenciales = Loadable(lazy(() => import('../views/terceros/ClientesPotenciales')));
const NuevoClientePotencial = Loadable(lazy(() => import('../views/terceros/NuevoClientePotencial')));
const EditarClientePotencial = Loadable(lazy(() => import('../views/terceros/EditarClientePotencial')));
const Proveedores = Loadable(lazy(() => import('../views/terceros/Proveedores')));
const NuevoProveedor = Loadable(lazy(() => import('../views/terceros/NuevoProveedor')));
const EditarProveedor = Loadable(lazy(() => import('../views/terceros/EditarProveedor')));
const Socios = Loadable(lazy(() => import('../views/socios/Socios')));
const SocioForm = Loadable(lazy(() => import('../views/socios/SocioForm')));
const Contactos = Loadable(lazy(() => import('../views/terceros/contactos/Contactos')));
const NuevoContacto = Loadable(lazy(() => import('../views/terceros/contactos/NuevoContacto')));
const EditarContacto = Loadable(lazy(() => import('../views/terceros/contactos/EditarContacto')));
const ContabilidadGeneral = Loadable(lazy(() => import('../views/contabilidad/operativa/AreaContabilidad')));
const AreaContabilidad = ContabilidadGeneral;
const AsientosContables = Loadable(lazy(() => import('../views/contabilidad/operativa/AsientosContables')));
const NuevoAsientoContable = Loadable(lazy(() => import('../views/contabilidad/operativa/NuevoAsientoContable')));
const LibroMayor = Loadable(lazy(() => import('../views/contabilidad/operativa/LibroMayor')));
const DiariosOperativa = Loadable(lazy(() => import('../views/contabilidad/operativa/DiariosOperativa')));
const SaldoCuenta = Loadable(lazy(() => import('../views/contabilidad/operativa/SaldoCuenta')));
const ExportarContabilidad = Loadable(lazy(() => import('../views/contabilidad/operativa/ExportarContabilidad')));
const CerrarPeriodo = Loadable(lazy(() => import('../views/contabilidad/operativa/CerrarPeriodo')));
const InformesContables = Loadable(lazy(() => import('../views/contabilidad/informes/InformesContables')));
const ContabilidadConfiguracion = Loadable(lazy(() => import('../views/contabilidad/ContabilidadConfiguracion')));
const PeriodosContables = Loadable(lazy(() => import('../views/contabilidad/PeriodosContables')));
const NuevoPeriodoContable = Loadable(lazy(() => import('../views/contabilidad/NuevoPeriodoContable')));
const DiariosContables = Loadable(lazy(() => import('../views/contabilidad/DiariosContables')));
const ModelosPlanesContables = Loadable(lazy(() => import('../views/contabilidad/ModelosPlanesContables')));
const ListadoCuentasContables = Loadable(lazy(() => import('../views/contabilidad/ListadoCuentasContables')));
const CuentasIndividuales = Loadable(lazy(() => import('../views/contabilidad/CuentasIndividuales')));
const CuentasContablesDefecto = Loadable(lazy(() => import('../views/contabilidad/CuentasContablesDefecto')));
const CuentasBancariasConfigContable = Loadable(lazy(() => import('../views/contabilidad/configuracion/CuentasBancarias')));
const CuentasIva = Loadable(lazy(() => import('../views/contabilidad/configuracion/CuentasIva')));
const CuentasImpuestos = Loadable(lazy(() => import('../views/contabilidad/configuracion/CuentasImpuestos')));
const CuentasProductos = Loadable(lazy(() => import('../views/contabilidad/configuracion/CuentasProductos')));
const CerrarCuentas = Loadable(lazy(() => import('../views/contabilidad/configuracion/CerrarCuentas')));
const GruposPersonalizados = Loadable(lazy(() => import('../views/contabilidad/configuracion/GruposPersonalizados')));
const FacturasClientesHub = Loadable(lazy(() => import('../views/contabilidad/transferencia/facturas-clientes/FacturasClientesHub')));
const LineasClientesAContabilizar = Loadable(lazy(() => import('../views/contabilidad/transferencia/facturas-clientes/LineasAContabilizar')));
const LineasClientesContabilizadas = Loadable(lazy(() => import('../views/contabilidad/transferencia/facturas-clientes/LineasContabilizadas')));
const FacturasProveedoresHub = Loadable(lazy(() => import('../views/contabilidad/transferencia/facturas-proveedores/FacturasProveedoresHub')));
const LineasProveedoresAContabilizar = Loadable(lazy(() => import('../views/contabilidad/transferencia/facturas-proveedores/LineasAContabilizar')));
const LineasProveedoresContabilizadas = Loadable(lazy(() => import('../views/contabilidad/transferencia/facturas-proveedores/LineasContabilizadas')));
const RegistroVentas = Loadable(lazy(() => import('../views/contabilidad/transferencia/registro/RegistroVentas')));
const RegistroCompras = Loadable(lazy(() => import('../views/contabilidad/transferencia/registro/RegistroCompras')));
const RegistroBanco = Loadable(lazy(() => import('../views/contabilidad/transferencia/registro/RegistroBanco')));
const RegistroOperacionesVarias = Loadable(
  lazy(() => import('../views/contabilidad/transferencia/registro/RegistroOperacionesVarias')),
);
const RegistroContableHub = Loadable(
  lazy(() => import('../views/contabilidad/transferencia/registro/RegistroContableHub')),
);
const TransferenciaContableHub = Loadable(
  lazy(() => import('../views/contabilidad/transferencia/TransferenciaContableHub')),
);
const ExportarDocumentosOrigen = Loadable(lazy(() => import('../views/contabilidad/transferencia/ExportarDocumentosOrigen')));
const ModuloPendiente = Loadable(lazy(() => import('../views/common/ModuloPendiente')));
const NuevaFacturaCliente = Loadable(lazy(() => import('../views/financiero/facturas-clientes/NuevaFacturaCliente')));
const ListadoFacturasCliente = Loadable(
  lazy(() => import('../views/financiero/facturas-clientes/ListadoFacturasCliente')),
);
const DetalleFacturaCliente = Loadable(
  lazy(() => import('../views/financiero/facturas-clientes/DetalleFacturaCliente')),
);
const ListadoCobrosCliente = Loadable(
  lazy(() => import('../views/financiero/facturas-clientes/ListadoCobrosCliente')),
);
const NuevoCobroCliente = Loadable(
  lazy(() => import('../views/financiero/facturas-clientes/NuevoCobroCliente')),
);
const DetalleCobroCliente = Loadable(
  lazy(() => import('../views/financiero/facturas-clientes/DetalleCobroCliente')),
);
const NuevaFacturaProveedor = Loadable(
  lazy(() => import('../views/financiero/facturas-proveedor/NuevaFacturaProveedor')),
);
const ListadoFacturasProveedor = Loadable(
  lazy(() => import('../views/financiero/facturas-proveedor/ListadoFacturasProveedor')),
);
const DetalleFacturaProveedor = Loadable(
  lazy(() => import('../views/financiero/facturas-proveedor/DetalleFacturaProveedor')),
);
const ListadoPagosProveedor = Loadable(
  lazy(() => import('../views/financiero/facturas-proveedor/ListadoPagosProveedor')),
);
const NuevoPagoProveedor = Loadable(
  lazy(() => import('../views/financiero/facturas-proveedor/NuevoPagoProveedor')),
);
const DetallePagoProveedor = Loadable(
  lazy(() => import('../views/financiero/facturas-proveedor/DetallePagoProveedor')),
);
const DiccionariosIndex = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/DiccionariosIndex')));
const CondicionesPagoDiccionario = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/CondicionesPagoDiccionario')));
const ModosPagoDiccionario = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/ModosPagoDiccionario')));
const MonedasDiccionario = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/MonedasDiccionario')));
const TipoEntidadLegalDiccionario = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/TipoEntidadLegalDiccionario')));
const FormatosPapelDiccionario = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/FormatosPapelDiccionario')));
const ConfigPaneles = Loadable(lazy(() => import('../views/configuracion/Paneles')));
const ConfigAlertas = Loadable(lazy(() => import('../views/configuracion/Alertas')));
const ConfigSeguridad = Loadable(lazy(() => import('../views/configuracion/Seguridad')));
const ConfigEmails = Loadable(lazy(() => import('../views/configuracion/Emails')));
const ConfiguracionHub = Loadable(lazy(() => import('../views/configuracion/ConfiguracionHub')));
const ConfiguracionEmpresa = Loadable(lazy(() => import('../views/configuracion/ConfiguracionEmpresa')));
const ImpuestosDiccionario = Loadable(lazy(() => import('../views/financiero/configuracion/diccionarios/ImpuestosDiccionario')));
// Módulo Item (productos y servicios)
const Productos = Loadable(lazy(() => import('../views/items/productos/Productos')));
const ProductosStocks = Loadable(lazy(() => import('../views/items/productos/ProductosStocks')));
const ProductosStocksLotes = Loadable(lazy(() => import('../views/items/productos/ProductosStocksLotes')));
const ProductosLotes = Loadable(lazy(() => import('../views/items/productos/ProductosLotes')));
const ProductosAtributos = Loadable(lazy(() => import('../views/items/productos/ProductosAtributos')));
const ProductosEstadisticas = Loadable(lazy(() => import('../views/items/productos/ProductosEstadisticas')));
const NuevoProducto = Loadable(lazy(() => import('../views/items/productos/NuevoProducto')));
const EditarProducto = Loadable(lazy(() => import('../views/items/productos/EditarProducto')));
const Servicios = Loadable(lazy(() => import('../views/items/servicios/Servicios')));
const NuevoServicio = Loadable(lazy(() => import('../views/items/servicios/NuevoServicio')));
const EditarServicio = Loadable(lazy(() => import('../views/items/servicios/EditarServicio')));
const NuevoInventario = Loadable(lazy(() => import('../views/items/inventarios/NuevoInventario')));
const EditarInventario = Loadable(lazy(() => import('../views/items/inventarios/EditarInventario')));
const Inventarios = Loadable(lazy(() => import('../views/items/inventarios/Inventarios')));
const Almacenes = Loadable(lazy(() => import('../views/items/almacenes/Almacenes')));
const MovimientosStock = Loadable(lazy(() => import('../views/items/stock/MovimientosStock')));
const TransferenciasStock = Loadable(lazy(() => import('../views/items/stock/TransferenciasStock')));
const StockConsultas = Loadable(lazy(() => import('../views/items/stock/StockConsultas')));
const CambioMasivoStock = Loadable(lazy(() => import('../views/items/stock/CambioMasivoStock')));
const Documentos = Loadable(lazy(() => import('../views/documentos/Documentos')));
const CuentasBancarias = Loadable(lazy(() => import('../views/banco-cajas/CuentasBancarias')));
const NuevoCuentaBancaria = Loadable(lazy(() => import('../views/banco-cajas/NuevoCuentaBancaria')));
const EditarCuentaBancaria = Loadable(lazy(() => import('../views/banco-cajas/EditarCuentaBancaria')));
const BancosCatalogo = Loadable(lazy(() => import('../views/banco-cajas/Bancos')));
const MovimientosCuenta = Loadable(lazy(() => import('../views/banco-cajas/MovimientosCuenta')));
const NuevoMovimientoBancario = Loadable(
  lazy(() => import('../views/banco-cajas/NuevoMovimientoBancario')),
);
const Transferencias = Loadable(lazy(() => import('../views/banco-cajas/Transferencias')));
const NuevaTransferencia = Loadable(
  lazy(() => import('../views/banco-cajas/NuevaTransferencia')),
);
const Gastos = Loadable(lazy(() => import('../views/gastos/Gastos')));
const GastoForm = Loadable(lazy(() => import('../views/gastos/GastoForm')));
const CategoriasGasto = Loadable(lazy(() => import('../views/gastos/CategoriasGasto')));

// Test component
const FlagTest = Loadable(lazy(() => import('../components/FlagTest')));

interface RouteType {
  path: string;
  element: ReactNode;
  children?: RouteType[];
}

/*****Routes******/
const ThemeRoutes: RouteType[] = [
  {
    path: '/',
    element: <AuthGuard><FullLayout /></AuthGuard>,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Comercio /> },
      { path: 'terceros/dashboard', element: <DashboardTerceros /> },
      { path: 'items/dashboard', element: <DashboardProductos /> },
      { path: 'financiero/dashboard', element: <DashboardFinanciero /> },
      { path: 'banco-cajas/dashboard', element: <DashboardBanco /> },
      { path: 'comercial/dashboard', element: <DashboardComercial /> },
      { path: 'empresas', element: <Empresas /> },
      { path: 'empresas/nueva', element: <NuevaEmpresa /> },
      { path: 'empresas/editar/:id', element: <EditarEmpresa /> },

      { path: 'sucursales/nueva', element: <NuevaSucursal /> },
      { path: 'sucursales', element: <Sucursales /> },
      { path: 'sucursales/editar/:id', element: <EditarSucursal /> },
      { path: 'starter', element: <Starter /> },
      { path: 'about', element: <About /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'badges', element: <Badges /> },
      { path: 'buttons', element: <Buttons /> },
      { path: 'cards', element: <Cards /> },
      { path: 'grid', element: <Grid /> },
      { path: 'tables', element: <Tables /> },
      { path: 'forms', element: <Forms /> },
      { path: 'breadcrumbs', element: <Breadcrumbs /> },
      { path: 'perfiles', element: <Perfiles /> },
      { path: 'perfiles/nuevo', element: <NuevoPerfil /> },
      { path: 'perfiles/editar/:id', element: <EditarPerfil /> },
      { path: 'menus', element: <Menus /> },
      { path: 'menus/estructura', element: <MenuMasterDetail /> },
      { path: 'menus/nuevo', element: <NuevoMenuCompleto /> },
      { path: 'menus/nueva', element: <NuevoMenu /> },
      { path: 'menus/seccion/nueva', element: <NuevaSeccion /> },
      { path: 'menus/seccion/editar/:id', element: <NuevaSeccion /> },
      { path: 'menus/item/nuevo', element: <NuevoItem /> },
      { path: 'menus/item/editar/:id', element: <EditarItem /> },
      { path: 'usuario', element: <Usuarios /> },
      { path: 'usuario/nuevo', element: <NuevoUsuario /> },
      { path: 'usuario/editar/:id', element: <EditarUsuario /> },
      { path: 'test-flags', element: <FlagTest /> },
      { path: 'terceros', element: <Terceros /> },
      { path: 'terceros/nuevo', element: <NuevoTercero /> },
      { path: 'terceros/editar/:id', element: <EditarTercero /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'clientes/nuevo', element: <NuevoCliente /> },
      { path: 'clientes/editar/:id', element: <EditarCliente /> },
      { path: 'clientes_potenciales', element: <ClientesPotenciales /> },
      { path: 'clientes_potenciales/nuevo', element: <NuevoClientePotencial /> },
      { path: 'clientes_potenciales/editar/:id', element: <EditarClientePotencial /> },
      { path: 'proveedores', element: <Proveedores /> },
      { path: 'proveedores/nuevo', element: <NuevoProveedor /> },
      { path: 'proveedores/editar/:id', element: <EditarProveedor /> },
      { path: 'socios', element: <Socios /> },
      { path: 'socios/nuevo', element: <SocioForm /> },
      { path: 'socios/:id/editar', element: <SocioForm /> },
      { path: 'terceros/:id/contactos', element: <Contactos /> },
      { path: 'terceros/:id/contactos/nuevo', element: <NuevoContacto /> },
      { path: 'terceros/:id/contactos/editar/:contactoId', element: <EditarContacto /> },
      { path: 'contabilidad', element: <AreaContabilidad /> },
      { path: 'contabilidad/asientos', element: <AsientosContables /> },
      { path: 'contabilidad/asientos/nuevo', element: <NuevoAsientoContable /> },
      { path: 'contabilidad/libro-mayor', element: <LibroMayor /> },
      { path: 'contabilidad/diarios', element: <DiariosOperativa /> },
      { path: 'contabilidad/saldo-cuenta', element: <SaldoCuenta /> },
      { path: 'contabilidad/exportar', element: <ExportarContabilidad /> },
      { path: 'contabilidad/cerrar', element: <CerrarPeriodo /> },
      { path: 'contabilidad/informes', element: <InformesContables /> },
      { path: 'contabilidad/configuracion/general', element: <ContabilidadConfiguracion /> },
      { path: 'contabilidad/configuracion/periodo', element: <PeriodosContables /> },
      { path: 'contabilidad/configuracion/periodo/nuevo', element: <NuevoPeriodoContable /> },
      { path: 'contabilidad/configuracion/diarios', element: <DiariosContables /> },
      { path: 'contabilidad/configuracion/modelos-planes', element: <ModelosPlanesContables /> },
      { path: 'contabilidad/configuracion/plan-contable', element: <ListadoCuentasContables /> },
      { path: 'contabilidad/configuracion/cuentas-individuales', element: <CuentasIndividuales /> },
      { path: 'contabilidad/configuracion/cuentas-defecto', element: <CuentasContablesDefecto /> },
      { path: 'contabilidad/configuracion/cuentas-bancarias', element: <CuentasBancariasConfigContable /> },
      { path: 'contabilidad/configuracion/cuentas-iva', element: <CuentasIva /> },
      { path: 'contabilidad/configuracion/cuentas-impuestos', element: <CuentasImpuestos /> },
      { path: 'contabilidad/configuracion/cuentas-productos', element: <CuentasProductos /> },
      { path: 'contabilidad/configuracion/cerrar-cuentas', element: <CerrarCuentas /> },
      { path: 'contabilidad/configuracion/grupos-personalizados', element: <GruposPersonalizados /> },
      { path: 'contabilidad/transferencia', element: <TransferenciaContableHub /> },
      { path: 'contabilidad/transferencia/facturas-clientes', element: <FacturasClientesHub /> },
      { path: 'contabilidad/transferencia/facturas-clientes/lineas-a-contabilizar', element: <LineasClientesAContabilizar /> },
      { path: 'contabilidad/transferencia/facturas-clientes/lineas-contabilizadas', element: <LineasClientesContabilizadas /> },
      { path: 'contabilidad/transferencia/facturas-proveedores', element: <FacturasProveedoresHub /> },
      { path: 'contabilidad/transferencia/facturas-proveedores/lineas-a-contabilizar', element: <LineasProveedoresAContabilizar /> },
      { path: 'contabilidad/transferencia/facturas-proveedores/lineas-contabilizadas', element: <LineasProveedoresContabilizadas /> },
      { path: 'contabilidad/transferencia/registro', element: <RegistroContableHub /> },
      { path: 'contabilidad/transferencia/registro/ventas', element: <RegistroVentas /> },
      { path: 'contabilidad/transferencia/registro/compras', element: <RegistroCompras /> },
      { path: 'contabilidad/transferencia/registro/banco', element: <RegistroBanco /> },
      { path: 'contabilidad/transferencia/registro/varios', element: <RegistroOperacionesVarias /> },
      { path: 'contabilidad/transferencia/exportar-documentos', element: <ExportarDocumentosOrigen /> },
      { path: 'financiero/facturas-clientes/nueva', element: <NuevaFacturaCliente /> },
      { path: 'financiero/facturas-clientes/listado', element: <ListadoFacturasCliente /> },
      { path: 'financiero/facturas-clientes/plantillas', element: <ModuloPendiente /> },
      { path: 'financiero/facturas-clientes/estadisticas', element: <ModuloPendiente /> },
      { path: 'financiero/facturas-clientes/pagos/nuevo', element: <NuevoCobroCliente /> },
      { path: 'financiero/facturas-clientes/pagos/:id', element: <DetalleCobroCliente /> },
      { path: 'financiero/facturas-clientes/pagos', element: <ListadoCobrosCliente /> },
      { path: 'financiero/facturas-clientes/:id', element: <DetalleFacturaCliente /> },
      { path: 'financiero/facturas-proveedor/nueva', element: <NuevaFacturaProveedor /> },
      { path: 'financiero/facturas-proveedor/listado', element: <ListadoFacturasProveedor /> },
      { path: 'financiero/facturas-proveedor/plantillas', element: <ModuloPendiente /> },
      { path: 'financiero/facturas-proveedor/estadisticas', element: <ModuloPendiente /> },
      { path: 'financiero/facturas-proveedor/pagos/nuevo', element: <NuevoPagoProveedor /> },
      { path: 'financiero/facturas-proveedor/pagos/:id', element: <DetallePagoProveedor /> },
      { path: 'financiero/facturas-proveedor/pagos', element: <ListadoPagosProveedor /> },
      { path: 'financiero/facturas-proveedor/:id', element: <DetalleFacturaProveedor /> },
      { path: 'financiero/configuracion/diccionarios', element: <DiccionariosIndex /> },
      { path: 'financiero/configuracion/diccionarios/condiciones-pago', element: <CondicionesPagoDiccionario /> },
      { path: 'financiero/configuracion/diccionarios/modos-pago', element: <ModosPagoDiccionario /> },
      { path: 'financiero/configuracion/diccionarios/impuestos', element: <ImpuestosDiccionario /> },
      { path: 'financiero/configuracion/diccionarios/monedas', element: <MonedasDiccionario /> },
      { path: 'financiero/configuracion/diccionarios/tipo-entidad-legal', element: <TipoEntidadLegalDiccionario /> },
      { path: 'financiero/configuracion/diccionarios/formatos-papel', element: <FormatosPapelDiccionario /> },
      { path: 'configuracion', element: <ConfiguracionHub /> },
      { path: 'configuracion/empresa', element: <ConfiguracionEmpresa /> },
      { path: 'configuracion/diccionarios', element: <DiccionariosIndex /> },
      { path: 'configuracion/diccionarios/condiciones-pago', element: <CondicionesPagoDiccionario /> },
      { path: 'configuracion/diccionarios/modos-pago', element: <ModosPagoDiccionario /> },
      { path: 'configuracion/diccionarios/impuestos', element: <ImpuestosDiccionario /> },
      { path: 'configuracion/diccionarios/monedas', element: <MonedasDiccionario /> },
      { path: 'configuracion/diccionarios/tipo-entidad-legal', element: <TipoEntidadLegalDiccionario /> },
      { path: 'configuracion/diccionarios/formatos-papel', element: <FormatosPapelDiccionario /> },
      { path: 'configuracion/paneles', element: <ConfigPaneles /> },
      { path: 'configuracion/alertas', element: <ConfigAlertas /> },
      { path: 'configuracion/seguridad', element: <ConfigSeguridad /> },
      { path: 'configuracion/emails', element: <ConfigEmails /> },
      { path: 'financiero/*', element: <ModuloPendiente /> },
      {
        path: 'items',
        element: <Outlet />,
        children: [
          { path: 'productos', element: <Productos /> },
          { path: 'productos/nuevo', element: <NuevoProducto /> },
          { path: 'productos/editar/:id', element: <EditarProducto /> },
          { path: 'productos/stocks', element: <ProductosStocks /> },
          { path: 'productos/stocks-lotes', element: <ProductosStocksLotes /> },
          { path: 'productos/lotes', element: <ProductosLotes /> },
          { path: 'productos/atributos', element: <ProductosAtributos /> },
          { path: 'productos/estadisticas', element: <ProductosEstadisticas /> },
          { path: 'servicios', element: <Servicios /> },
          { path: 'servicios/nuevo', element: <NuevoServicio /> },
          { path: 'servicios/editar/:id', element: <EditarServicio /> },
          { path: 'almacenes', element: <Almacenes /> },
          { path: 'stock/movimientos', element: <MovimientosStock /> },
          { path: 'stock/transferencias', element: <TransferenciasStock /> },
          { path: 'stock/cambio-masivo', element: <CambioMasivoStock /> },
          { path: 'stock/consultas', element: <StockConsultas /> },
        ],
      },
      { path: 'documentos', element: <Documentos /> },
      { path: 'banco-cajas/cuentas', element: <CuentasBancarias /> },
      { path: 'banco-cajas/cuentas/nuevo', element: <NuevoCuentaBancaria /> },
      { path: 'banco-cajas/cuentas/editar/:id', element: <EditarCuentaBancaria /> },
      { path: 'banco-cajas/bancos', element: <BancosCatalogo /> },
      { path: 'banco-cajas/cuentas/:id/movimientos', element: <MovimientosCuenta /> },
      {
        path: 'banco-cajas/cuentas/:id/movimientos/nuevo',
        element: <NuevoMovimientoBancario />,
      },
      { path: 'banco-cajas/transferencias', element: <Transferencias /> },
      { path: 'banco-cajas/transferencias/nuevo', element: <NuevaTransferencia /> },

      { path: 'gastos', element: <Gastos /> },
      { path: 'gastos/nuevo', element: <GastoForm /> },
      { path: 'gastos/:id/editar', element: <GastoForm /> },
      { path: 'gastos/categorias', element: <CategoriasGasto /> },

      { path: 'items/productos', element: <Productos /> },
      { path: 'items/productos/stocks', element: <ProductosStocks /> },
      { path: 'items/productos/stocks-lotes', element: <ProductosStocksLotes /> },
      { path: 'items/productos/lotes', element: <ProductosLotes /> },
      { path: 'items/productos/atributos', element: <ProductosAtributos /> },
      { path: 'items/productos/estadisticas', element: <ProductosEstadisticas /> },
      { path: 'items/productos/nuevo', element: <NuevoProducto /> },
      { path: 'items/productos/editar/:id', element: <EditarProducto /> },
      { path: 'items/servicios', element: <Servicios /> },
      { path: 'items/servicios/nuevo', element: <NuevoServicio /> },
      { path: 'items/servicios/editar/:id', element: <EditarServicio /> },
      { path: 'items/inventarios', element: <Inventarios /> },
      { path: 'items/inventarios/nuevo', element: <NuevoInventario /> },
      { path: 'items/inventarios/editar/:id', element: <EditarInventario /> },
      { path: 'items/almacenes', element: <Almacenes /> },
      { path: 'items/stock/movimientos', element: <MovimientosStock /> },
      { path: 'items/stock/transferencias', element: <TransferenciasStock /> },
      { path: 'items/stock/cambio-masivo', element: <CambioMasivoStock /> },
      { path: 'items/stock/consultas', element: <StockConsultas /> },
      { path: '*', element: <Error404 /> },
    ],
  },
  {
    path: 'auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/login" /> },
    ],
  },
  {
    path: '*',
    element: <Error404 />,
  },
];

export default ThemeRoutes;
