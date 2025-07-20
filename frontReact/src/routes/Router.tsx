import React, { lazy, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
import AuthGuard from '../components/authGurad/AuthGuard';
import Login from '../views/auth/Login';

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
    element: <Navigate to="/auth/login" />,
  },
];

export default ThemeRoutes;
