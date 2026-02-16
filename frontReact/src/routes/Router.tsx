import React, { lazy, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
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

// Auth pages
const Login = Loadable(lazy(() => import('../views/auth/Login')));

// Dashboard pages
const Comercio = Loadable(lazy(() => import('../views/dashboards/Comercio')));

// Mantenimiento pages
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

// Contabilidad pages - Configuración
const ConfiguracionGeneral = Loadable(lazy(() => import('../views/contabilidad/ConfiguracionGeneral')));
const DiariosContables = Loadable(lazy(() => import('../views/contabilidad/DiariosContables')));
const ModelosPlanesContables = Loadable(lazy(() => import('../views/contabilidad/ModelosPlanesContables')));
const PlanContable = Loadable(lazy(() => import('../views/contabilidad/PlanContable')));
const CuentasIndividuales = Loadable(lazy(() => import('../views/contabilidad/CuentasIndividuales')));
const PeriodoContable = Loadable(lazy(() => import('../views/contabilidad/PeriodoContable')));
const CuentasDefecto = Loadable(lazy(() => import('../views/contabilidad/CuentasDefecto')));
const CuentasBancarias = Loadable(lazy(() => import('../views/contabilidad/CuentasBancarias')));
const CuentasIva = Loadable(lazy(() => import('../views/contabilidad/CuentasIva')));
const CuentasImpuestos = Loadable(lazy(() => import('../views/contabilidad/CuentasImpuestos')));
const CuentasProductos = Loadable(lazy(() => import('../views/contabilidad/CuentasProductos')));
const CerrarCuentas = Loadable(lazy(() => import('../views/contabilidad/CerrarCuentas')));
const GruposPersonalizados = Loadable(lazy(() => import('../views/contabilidad/GruposPersonalizados')));

// Contabilidad pages - Transferencia
const FacturasClientes = Loadable(lazy(() => import('../views/contabilidad/FacturasClientes')));
const FacturasProveedores = Loadable(lazy(() => import('../views/contabilidad/FacturasProveedores')));
const RegistroVentas = Loadable(lazy(() => import('../views/contabilidad/RegistroVentas')));
const RegistroCompras = Loadable(lazy(() => import('../views/contabilidad/RegistroCompras')));
const RegistroBanco = Loadable(lazy(() => import('../views/contabilidad/RegistroBanco')));
const ExportarDocumentos = Loadable(lazy(() => import('../views/contabilidad/ExportarDocumentos')));

// Contabilidad pages - Contabilidad
const AsientosContables = Loadable(lazy(() => import('../views/contabilidad/AsientosContables')));
const LibroMayor = Loadable(lazy(() => import('../views/contabilidad/LibroMayor')));
const Diarios = Loadable(lazy(() => import('../views/contabilidad/Diarios')));
const SaldoCuenta = Loadable(lazy(() => import('../views/contabilidad/SaldoCuenta')));
const Exportar = Loadable(lazy(() => import('../views/contabilidad/Exportar')));
const Cerrar = Loadable(lazy(() => import('../views/contabilidad/Cerrar')));
const Informes = Loadable(lazy(() => import('../views/contabilidad/Informes')));

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
      { path: 'usuarios', element: <Usuarios /> },
      { path: 'usuarios/nuevo', element: <NuevoUsuario /> },
      { path: 'usuarios/editar/:id', element: <EditarUsuario /> },
      // Contabilidad - Configuración
      { path: 'contabilidad/configuracion/general', element: <ConfiguracionGeneral /> },
      { path: 'contabilidad/configuracion/diarios', element: <DiariosContables /> },
      { path: 'contabilidad/configuracion/modelos-planes', element: <ModelosPlanesContables /> },
      { path: 'contabilidad/configuracion/plan-contable', element: <PlanContable /> },
      { path: 'contabilidad/configuracion/cuentas-individuales', element: <CuentasIndividuales /> },
      { path: 'contabilidad/configuracion/periodo', element: <PeriodoContable /> },
      { path: 'contabilidad/configuracion/cuentas-defecto', element: <CuentasDefecto /> },
      { path: 'contabilidad/configuracion/cuentas-bancarias', element: <CuentasBancarias /> },
      { path: 'contabilidad/configuracion/cuentas-iva', element: <CuentasIva /> },
      { path: 'contabilidad/configuracion/cuentas-impuestos', element: <CuentasImpuestos /> },
      { path: 'contabilidad/configuracion/cuentas-productos', element: <CuentasProductos /> },
      { path: 'contabilidad/configuracion/cerrar-cuentas', element: <CerrarCuentas /> },
      { path: 'contabilidad/configuracion/grupos-personalizados', element: <GruposPersonalizados /> },
      
      // Contabilidad - Transferencia
      { path: 'contabilidad/transferencia/facturas-clientes', element: <FacturasClientes /> },
      { path: 'contabilidad/transferencia/facturas-proveedores', element: <FacturasProveedores /> },
      { path: 'contabilidad/transferencia/registro/ventas', element: <RegistroVentas /> },
      { path: 'contabilidad/transferencia/registro/compras', element: <RegistroCompras /> },
      { path: 'contabilidad/transferencia/registro/banco', element: <RegistroBanco /> },
      { path: 'contabilidad/transferencia/exportar-documentos', element: <ExportarDocumentos /> },
      
      // Contabilidad - Contabilidad
      { path: 'contabilidad/asientos', element: <AsientosContables /> },
      { path: 'contabilidad/libro-mayor', element: <LibroMayor /> },
      { path: 'contabilidad/diarios', element: <Diarios /> },
      { path: 'contabilidad/saldo-cuenta', element: <SaldoCuenta /> },
      { path: 'contabilidad/exportar', element: <Exportar /> },
      { path: 'contabilidad/cerrar', element: <Cerrar /> },
      { path: 'contabilidad/informes', element: <Informes /> },
      
      { path: 'test-flags', element: <FlagTest /> },
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
