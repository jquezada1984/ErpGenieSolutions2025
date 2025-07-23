import React, { lazy, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
import AuthGuard from '../components/authGurad/AuthGuard';
import Login from '../views/auth/Login';
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

// Dashboard pages
const Comercio = Loadable(lazy(() => import('../views/dashboards/Comercio')));

// Mantenimiento pages
const Empresas = Loadable(lazy(() => import('../views/empresas/Empresas')));
const NuevaEmpresa = Loadable(lazy(() => import('../views/empresas/NuevaEmpresa')));
const EditarEmpresa = Loadable(lazy(() => import('../views/empresas/EditarEmpresa')));

const NuevaSucursal = Loadable(lazy(() => import('../views/empresas/NuevaSucursal')));
const Sucursales = Loadable(lazy(() => import('../views/empresas/Sucursales')));
const EditarSucursal = Loadable(lazy(() => import('../views/empresas/EditarSucursal')));
const Perfiles = Loadable(lazy(() => import('../views/empresas/Perfiles')));
const NuevoPerfil = Loadable(lazy(() => import('../views/empresas/NuevoPerfil')));
const EditarPerfil = Loadable(lazy(() => import('../views/empresas/EditarPerfil')));
const Menus = Loadable(lazy(() => import('../views/empresas/Menus')));
const NuevoMenu = Loadable(lazy(() => import('../views/empresas/NuevoMenu')));

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
      { path: 'perfiles/nueva', element: <NuevoPerfil /> },
      { path: 'perfiles/editar/:id', element: <EditarPerfil /> },
      { path: 'menus', element: <Menus /> },
      { path: 'menus/nueva', element: <NuevoMenu /> },
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
