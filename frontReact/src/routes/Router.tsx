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
const Login = Loadable(lazy(() => import('../views/auth/Login')));
const Comercio = Loadable(lazy(() => import('../views/dashboards/Comercio')));
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
const ContabilidadGeneral = Loadable(lazy(() => import('../views/contabilidad/ContabilidadGeneral')));
const ContabilidadConfiguracion = Loadable(lazy(() => import('../views/contabilidad/ContabilidadConfiguracion')));
const Documentos = Loadable(lazy(() => import('../views/documentos/Documentos')));

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
      { path: 'documentos', element: <Documentos /> },

      { path: 'contabilidad/general', element: <ContabilidadGeneral /> },
      { path: 'contabilidad/configuracion/general', element: <ContabilidadConfiguracion /> },

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
