import React, { useEffect } from 'react';
import { Button, Nav } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import Logo from '../../logo/Logo';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';
import getSidebarData from '../sidebardata/SidebarData';
import store from '../../../store/Store';
import { usePermissions } from '../../../components/authGurad/usePermissions';
import useAuth from '../../../components/authGurad/useAuth';
import * as Icon from "react-feather";
type RootState = ReturnType<typeof store.getState>;

const Sidebar = () => {
  const location = useLocation();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const { user } = useAuth();

  //const [collapsed, setCollapsed] = useState(null);
  // const toggle = (index) => {
  //   setCollapsed(collapsed === index ? null : index);
  // };

  const activeBg = useSelector((state: RootState) => state.customizer.sidebarBg);
  const isFixed = useSelector((state: RootState) => state.customizer.isSidebarFixed);
  const dispatch = useDispatch();
  const selectedMenu = useSelector((state: RootState) => state.mainMenu.selected);
  
  // Hook de permisos
  const { 
    menuLateral, 
    menuLateralOrdenado,
    cargarMenuLateralOrdenado,
    getIdSeccionPorNombre,
    loading: loadingPermisos 
  } = usePermissions();

  // ID de sección por menú: Inicio usa ID fijo; Contabilidad y demás usan menuLateral o consulta por nombre
  const obtenerIdSeccionPorMenu = (menu: string): string | undefined => {
    if (menu === 'inicio') {
      return '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1'; // Administración
    }
    const nombreSeccion: { [key: string]: string } = {
      'terceros': 'Terceros',
      'contabilidad': 'Contabilidad',
      'financiera': 'Financiera',
      'bancos': 'Bancos',
      'rrhh': 'RRHH',
      'documentos': 'Documentos',
      'agenda': 'Agenda',
      'tickets': 'Tickets',
      'utilidades': 'Utilidades',
      'servicios': 'Servicios',
      'proyectos': 'Proyectos',
      'comercial': 'Comercial',
    };
    const nombre = nombreSeccion[menu];
    return nombre ? menuLateral.find(s => s.nombre === nombre)?.id_seccion : undefined;
  };

  // Cargar menú lateral ordenado cuando cambie el menú seleccionado
  useEffect(() => {
    if (!user?.id_perfil) return;
    let idSeccion = obtenerIdSeccionPorMenu(selectedMenu);
    if (idSeccion) {
      cargarMenuLateralOrdenado(idSeccion);
      return;
    }
    // Respaldo: si la sección no está en menuLateral, obtener id por nombre
    if (selectedMenu === 'contabilidad') {
      getIdSeccionPorNombre('Contabilidad').then((id) => { if (id) cargarMenuLateralOrdenado(id); });
    } else if (selectedMenu === 'terceros') {
      getIdSeccionPorNombre('Terceros').then((id) => { if (id) cargarMenuLateralOrdenado(id); });
    }
  }, [selectedMenu, user?.id_perfil, menuLateral, cargarMenuLateralOrdenado, getIdSeccionPorNombre]);

  // Construir datos del sidebar: dinámico (BD) o estático
  // Solo usar menuOrdenadoActual si corresponde a la sección actual (mismo id_seccion)
  const idSeccionActual = obtenerIdSeccionPorMenu(selectedMenu);
  const menuOrdenadoActual = menuLateralOrdenado[0];
  const esMenuDinamicoActual = menuOrdenadoActual && idSeccionActual && menuOrdenadoActual.id_seccion === idSeccionActual;

  // Título del sidebar por clave de menú (cuando el contenido viene de BD)
  const captionPorMenu: { [key: string]: string } = {
    inicio: 'Administración',
    contabilidad: 'Contabilidad',
    terceros: 'Terceros',
    financiera: 'Financiera',
    bancos: 'Bancos | Cajas',
    rrhh: 'RRHH',
    documentos: 'Documentos',
    agenda: 'Agenda',
    tickets: 'Tickets',
    utilidades: 'Utilidades',
    servicios: 'Servicios',
    proyectos: 'Proyectos',
    comercial: 'Comercial',
  };

  const convertirItemsADatosSidebar = (items: typeof menuOrdenadoActual.items, iconoDefault: React.ReactNode) =>
    items.map(item => ({
      title: item.etiqueta,
      icon: item.icono ? <i className={item.icono} /> : iconoDefault,
      id: item.id_item,
      children: item.children?.map(child => ({
        title: child.etiqueta,
        href: child.ruta,
        icon: child.icono ? <i className={child.icono} /> : <Icon.List size={14} />
      })) || []
    }));

  let SidebarData;

  if (esMenuDinamicoActual && menuOrdenadoActual.items?.length) {
    // Menú dinámico desde BD: mismo id_seccion que la sección seleccionada
    const caption = captionPorMenu[selectedMenu] || menuOrdenadoActual.nombre;
    SidebarData = [
      { caption },
      ...convertirItemsADatosSidebar(menuOrdenadoActual.items, <Icon.Home size={16} />)
    ];
  } else if (selectedMenu === 'inicio') {
    // Fallback estático solo para Inicio cuando no hay datos dinámicos
    SidebarData = [
      { caption: 'Administración' },
      {
        title: 'Empresa',
        icon: <i className="bi bi-building" />,
        id: 'empresa',
        children: [
          { title: 'Lista', href: '/empresas', icon: <Icon.List size={14} /> },
          { title: 'Crear', href: '/empresas/nueva', icon: <Icon.Plus size={14} /> },
        ],
      }
    ];
  } else {
    // Resto: datos estáticos (terceros, contabilidad "Próximamente", etc.)
    SidebarData = getSidebarData(selectedMenu);
  }

  return (
    <div className={`sidebarBox shadow bg-${activeBg} ${isFixed ? 'fixedSidebar' : ''}`}>
      <SimpleBar style={{ height: '100%' }}>
        {/********Logo*******/}
        <div className="d-flex p-3 align-items-center">
          <Logo />
          <Button
            size="sm"
            className="ms-auto btn-close d-sm-block d-lg-none"
            onClick={() => dispatch(ToggleMobileSidebar())}
          />
        </div>
        {/********Sidebar Content*******/}
        <div className="p-3 pt-1 mt-2">
          {loadingPermisos ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando menú...</p>
            </div>
          ) : (
            <Nav vertical className={activeBg === 'white' ? '' : 'lightText'}>
              {SidebarData.map((navi, index) => {
                // Manejar estructura del SidebarData estático (más simple y directo)
                if (navi.caption) {
                  const key = navi.caption || `caption-${index}`;
                  return (
                    <div className="navCaption fw-bold mt-4" key={key}>
                      {navi.caption}
                    </div>
                  );
                }
                
                if (navi.children) {
                  const key = navi.id || `navi-${index}`;
                  return (
                    <NavSubMenu
                      key={key}
                      icon={navi.icon}
                      title={navi.title}
                      items={navi.children}
                      suffix={navi.suffix}
                      suffixColor={navi.suffixColor}
                      isUrl={currentURL === navi.href}
                    />
                  );
                }
                
                const key = navi.id || `item-${index}`;
                return (
                  <NavItemContainer
                    key={key}
                    className={location.pathname === navi.href ? 'activeLink' : ''}
                    to={navi.href}
                    title={navi.title}
                    suffix={navi.suffix}
                    suffixColor={navi.suffixColor}
                    icon={navi.icon}
                  />
                );
              })}
            </Nav>
          )}
        </div>
      </SimpleBar>
    </div>
  );
};

export default Sidebar;
