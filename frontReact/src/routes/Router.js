import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
import AuthGuard from '../components/authGurad/AuthGuard';
import LoginGraphQL from '../views/auth/LoginGraphQL';

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

/***** Auth Pages ****/
const Error = Loadable(lazy(() => import('../views/auth/Error')));
const Register = Loadable(lazy(() => import('../views/auth/Register')));

/*****Routes******/
const ThemeRoutes = [
  {
    path: '/',
    element: <LoginGraphQL />,
    children: [],
  },
  {
    path: 'auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <LoginGraphQL /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default ThemeRoutes;
