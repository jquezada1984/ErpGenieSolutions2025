import React from 'react';
import * as Icon from "react-feather";
import { FaBuilding, FaUsers, FaUserTie, FaSitemap, FaUser, FaUserFriends, FaAddressBook, FaBox, FaWarehouse, FaTruck, FaClipboardList } from 'react-icons/fa';

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
  // Módulo item: mismo patrón que terceros — solo bloques con title + children, sin caption duplicado por sección
  items: [
    {
      title: "Productos",
      icon: <FaBox size={16} />,
      id: 'productos',
      children: [
        { title: "Nuevo producto", href: "/items/productos/nuevo", icon: <Icon.Plus size={14} /> },
        { title: "Listado", href: "/items/productos", icon: <Icon.List size={14} /> },
        { title: "Stocks", href: "/items/productos/stocks", icon: <Icon.Package size={14} /> },
        { title: "Stocks por lotes/serie", href: "/items/productos/stocks-lotes", icon: <Icon.Layers size={14} /> },
        { title: "Lotes/Series", href: "/items/productos/lotes", icon: <Icon.Hash size={14} /> },
        { title: "Atributos de variantes", href: "/items/productos/atributos", icon: <Icon.Sliders size={14} /> },
        { title: "Estadísticas", href: "/items/productos/estadisticas", icon: <Icon.BarChart2 size={14} /> },
      ],
    },
    {
      title: "Servicios",
      icon: <Icon.Settings size={16} />,
      id: 'servicios',
      children: [
        { title: "Nuevo servicio", href: "/items/servicios/nuevo", icon: <Icon.Plus size={14} /> },
        { title: "Listado", href: "/items/servicios", icon: <Icon.List size={14} /> },
        { title: "Atributos de variantes", href: "/items/servicios/atributos", icon: <Icon.Sliders size={14} /> },
        { title: "Estadísticas", href: "/items/servicios/estadisticas", icon: <Icon.BarChart2 size={14} /> },
      ],
    },
    {
      title: "Almacenes",
      icon: <FaWarehouse size={16} />,
      id: 'almacenes',
      children: [
        { title: "Nuevo almacén", href: "/items/almacenes/nuevo", icon: <Icon.Plus size={14} /> },
        { title: "Listado", href: "/items/almacenes", icon: <Icon.List size={14} /> },
        { title: "Movimientos", href: "/items/almacenes/movimientos", icon: <Icon.Repeat size={14} /> },
        { title: "Cambio de existencias a granel", href: "/items/almacenes/cambio-granel", icon: <Icon.RefreshCw size={14} /> },
        { title: "Reaprovisionamiento", href: "/items/almacenes/reaprovisionamiento", icon: <Icon.TrendingUp size={14} /> },
        { title: "Stock a fecha", href: "/items/almacenes/stock-fecha", icon: <Icon.Calendar size={14} /> },
      ],
    },
    {
      title: "Inventarios",
      icon: <FaClipboardList size={16} />,
      id: 'inventarios',
      children: [
        { title: "Nuevo inventario", href: "/items/inventarios/nuevo", icon: <Icon.Plus size={14} /> },
        { title: "Listado", href: "/items/inventarios", icon: <Icon.List size={14} /> },
      ],
    },
    {
      title: "Envíos",
      icon: <FaTruck size={16} />,
      id: 'envios',
      children: [
        { title: "Nuevo envío", href: "/items/envios/nuevo", icon: <Icon.Plus size={14} /> },
        { title: "Listado", href: "/items/envios", icon: <Icon.List size={14} /> },
        { title: "Estadísticas", href: "/items/envios/estadisticas", icon: <Icon.BarChart2 size={14} /> },
      ],
    },
    {
      title: "Recepciones",
      icon: <Icon.Inbox size={16} />,
      id: 'recepciones',
      children: [
        { title: "Nueva recepción", href: "/items/recepciones/nuevo", icon: <Icon.Plus size={14} /> },
        { title: "Listado", href: "/items/recepciones", icon: <Icon.List size={14} /> },
        { title: "Estadísticas", href: "/items/recepciones/estadisticas", icon: <Icon.BarChart2 size={14} /> },
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
