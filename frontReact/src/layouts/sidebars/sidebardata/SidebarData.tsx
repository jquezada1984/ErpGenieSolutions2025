import React from 'react';
import * as Icon from "react-feather";
import { FaBuilding, FaUsers, FaUserTie, FaSitemap, FaUser, FaUserFriends, FaAddressBook } from 'react-icons/fa';

const sidebarMenus = {
  inicio: [
    { caption: "Administración" },
    {
      title: "Empresa",
      icon: <FaBuilding size={16} />,
      id: 'empresa',
      children: [
        { title: "Lista", href: "/empresas", icon: <Icon.List size={14} /> },
        { title: "Crear", href: "/empresas/nueva", icon: <Icon.Plus size={14} /> },
      ],
    },
    // Temporalmente comentado para mostrar solo Empresa según la consulta SQL
    // {
    //   title: "Sucursal",
    //   icon: <FaSitemap size={16} />,
    //   id: 'sucursal',
    //   children: [
    //     { title: "Lista", href: "/sucursales", icon: <Icon.List size={14} /> },
    //     { title: "Crear", href: "/sucursales/nueva", icon: <Icon.Plus size={14} /> },
    //   ],
    // },
    // {
    //   title: "Menú",
    //   icon: <Icon.Menu size={16} />,
    //   id: 'menu',
    //   children: [
    //     { title: "Lista", href: "/menus", icon: <Icon.List size={14} /> },
    //     { title: "Crear", href: "/menus/nuevo", icon: <Icon.Plus size={14} /> },
    //   ],
    // },
    // {
    //   title: "Perfil",
    //   icon: <FaUsers size={16} />,
    //   id: 'perfil',
    //   children: [
    //     { title: "Lista", href: "/perfiles", icon: <Icon.List size={14} /> },
    //     { title: "Crear", href: "/perfiles/nuevo", icon: <Icon.Plus size={14} /> },
    //   ],
    // },
    // {
    //   title: "Usuario",
    //   icon: <FaUser size={16} />,
    //   id: 'usuario',
    //   children: [
    //     { title: "Nuevo usuario", href: "/usuario/nuevo", icon: <Icon.UserPlus size={14} /> },
    //     { title: "Listado de usuarios", href: "/usuario/lista", icon: <Icon.List size={14} /> },
    //     { title: "Vista jerárquica", href: "/usuario/jerarquia", icon: <Icon.Users size={14} /> },
    //   ],
    // },
  ],
  terceros: [
    { caption: "Dashboard" },
    { title: "Dashboard", href: "/dashboard", icon: <Icon.Home size={16} /> },
    { caption: "Tercero" },
    {
      title: "Tercero",
      icon: <FaUserTie size={16} />,
      id: 'tercero',
      children: [
        { title: "Nuevo tercero", href: "/terceros/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado tercero", href: "/terceros", icon: <Icon.List size={14} /> },
      ],
    },
    {
      title: "Cliente",
      icon: <FaUserTie size={16} />,
      id: 'cliente',
      children: [
        { title: "Nuevo cliente", href: "/clientes/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado cliente", href: "/clientes", icon: <Icon.List size={14} /> },
      ],
    },
    {
      title: "Cliente Potencial",
      icon: <FaUserTie size={16} />,
      id: 'cliente_potencial',
      children: [
        { title: "Nuevo cliente potencial", href: "/clientes_potenciales/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado cliente potencial", href: "/clientes_potenciales", icon: <Icon.List size={14} /> },
      ],
    },
    {
      title: "Proveedor",
      icon: <FaUserTie size={16} />,
      id: 'proveedor',
      children: [
        { title: "Nuevo proveedor", href: "/proveedores/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado proveedor", href: "/proveedores", icon: <Icon.List size={14} /> },
      ],
    },
  ],
  servicios: [
    { caption: "Servicios" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  proyectos: [
    { caption: "Proyectos" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  comercial: [
    { caption: "Comercial" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  financiera: [
    { caption: "Financiera" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  bancos: [
    { caption: "Bancos | Cajas" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  contabilidad: [
    { caption: "Contabilidad" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  rrhh: [
    { caption: "RRHH" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  documentos: [
    { caption: "Documentos" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  agenda: [
    { caption: "Agenda" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  tickets: [
    { caption: "Tickets" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
  utilidades: [
    { caption: "Utilidades" },
    { title: "Próximamente", icon: <Icon.Info size={16} /> },
  ],
};

const getSidebarData = (mainMenuKey: string) => sidebarMenus[mainMenuKey] || [];

export default getSidebarData;
