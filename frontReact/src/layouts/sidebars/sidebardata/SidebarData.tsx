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
    {
      title: "Sucursal",
      icon: <FaSitemap size={16} />,
      id: 'sucursal',
      children: [
        { title: "Lista", href: "/sucursales", icon: <Icon.List size={14} /> },
        { title: "Crear", href: "/sucursales/nueva", icon: <Icon.Plus size={14} /> },
      ],
    },
    {
      title: "Menú",
      icon: <Icon.Menu size={16} />,
      id: 'menu',
      children: [
        { title: "Lista", href: "/menus", icon: <Icon.List size={14} /> },
        { title: "Crear", href: "/menus/nuevo", icon: <Icon.Plus size={14} /> },
      ],
    },
    {
      title: "Perfil",
      icon: <FaUsers size={16} />,
      id: 'perfil',
      children: [
        { title: "Lista", href: "/perfiles", icon: <Icon.List size={14} /> },
        { title: "Crear", href: "/perfiles/nuevo", icon: <Icon.Plus size={14} /> },
      ],
    },
    {
      title: "Usuario",
      icon: <FaUser size={16} />,
      id: 'usuario',
      children: [
        { title: "Nuevo usuario", href: "/usuario/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado de usuarios", href: "/usuario/lista", icon: <Icon.List size={14} /> },
        { title: "Vista jerárquica", href: "/usuario/jerarquia", icon: <Icon.Users size={14} /> },
      ],
    },
  ],
  terceros: [
    { caption: "Dashboard" },
    { title: "Dashboard", href: "/terceros/dashboard", icon: <Icon.Home size={16} /> },
    { caption: "Tercero" },
    {
      title: "Tercero",
      icon: <FaUserTie size={16} />,
      id: 'tercero',
      children: [
        { title: "Nuevo tercero", href: "/tercero/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado", href: "/tercero/lista", icon: <Icon.List size={14} /> },
        {
          title: "Clientes potenciales",
          icon: <FaUserFriends size={14} />,
          children: [
            { title: "Nuevo cliente potencial", href: "/tercero/clientepotencial/nuevo", icon: <Icon.UserPlus size={14} /> },
          ],
        },
        {
          title: "Clientes",
          icon: <FaUserFriends size={14} />,
          children: [
            { title: "Nuevo cliente", href: "/tercero/cliente/nuevo", icon: <Icon.UserPlus size={14} /> },
          ],
        },
        {
          title: "Proveedores",
          icon: <FaUserFriends size={14} />,
          children: [
            { title: "Nuevo proveedor", href: "/tercero/proveedor/nuevo", icon: <Icon.UserPlus size={14} /> },
          ],
        },
      ],
    },
    { caption: "Contactos/Direcciones" },
    {
      title: "Contactos/Direcciones",
      icon: <FaAddressBook size={16} />,
      id: 'contactos',
      children: [
        { title: "Nuevo Contacto/Dirección", href: "/contacto/nuevo", icon: <Icon.UserPlus size={14} /> },
        { title: "Listado", href: "/contacto/lista", icon: <Icon.List size={14} /> },
        { title: "Clientes potenciales", href: "/contacto/clientepotencial", icon: <Icon.List size={14} /> },
        { title: "Clientes", href: "/contacto/cliente", icon: <Icon.List size={14} /> },
        { title: "Proveedores", href: "/contacto/proveedor", icon: <Icon.List size={14} /> },
        { title: "Otro", href: "/contacto/otro", icon: <Icon.List size={14} /> },
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
