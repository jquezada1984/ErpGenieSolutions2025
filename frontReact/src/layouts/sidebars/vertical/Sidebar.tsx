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
    cargarMenuLateral, 
    cargarMenuLateralOrdenado,
    loading: loadingPermisos 
  } = usePermissions();

  // Mapear menú seleccionado a ID de sección
  const obtenerIdSeccionPorMenu = (menu: string): string => {
    const mapeoSecciones: { [key: string]: string } = {
      'inicio': '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1', // Administración
      'terceros': '39dea275-b0f7-4fb3-83fa-7c0ea31c3cf2', // Terceros (ejemplo)
      'servicios': '49dea275-b0f7-4fb3-83fa-7c0ea31c3cf3', // Servicios (ejemplo)
      'proyectos': '59dea275-b0f7-4fb3-83fa-7c0ea31c3cf4', // Proyectos (ejemplo)
      'comercial': '69dea275-b0f7-4fb3-83fa-7c0ea31c3cf5', // Comercial (ejemplo)
      'financiera': '79dea275-b0f7-4fb3-83fa-7c0ea31c3cf6', // Financiera (ejemplo)
      'bancos': '89dea275-b0f7-4fb3-83fa-7c0ea31c3cf7', // Bancos (ejemplo)
      'contabilidad': '99dea275-b0f7-4fb3-83fa-7c0ea31c3cf8', // Contabilidad (ejemplo)
      'rrhh': 'a9dea275-b0f7-4fb3-83fa-7c0ea31c3cf9', // RRHH (ejemplo)
      'documentos': 'b9dea275-b0f7-4fb3-83fa-7c0ea31c3cfa', // Documentos (ejemplo)
      'agenda': 'c9dea275-b0f7-4fb3-83fa-7c0ea31c3cfb', // Agenda (ejemplo)
      'tickets': 'd9dea275-b0f7-4fb3-83fa-7c0ea31c3cfc', // Tickets (ejemplo)
      'utilidades': 'e9dea275-b0f7-4fb3-83fa-7c0ea31c3cfd' // Utilidades (ejemplo)
    };
    return mapeoSecciones[menu] || '29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1'; // Default a Administración
  };

  // Cargar menú lateral cuando cambie el perfil o el menú seleccionado
  useEffect(() => {
    console.log('🔍 DEBUG - Sidebar - Menú seleccionado:', selectedMenu);
    console.log('🔍 DEBUG - Sidebar - Usuario id_perfil:', user?.id_perfil);
    
    // For "inicio" menu, use dynamic menu from database
    if (selectedMenu === 'inicio' && user?.id_perfil) {
      const idSeccion = obtenerIdSeccionPorMenu(selectedMenu);
      console.log('🔍 DEBUG - Sidebar - Cargando menú dinámico para inicio, id_seccion:', idSeccion);
      cargarMenuLateralOrdenado(idSeccion);
    } else {
      console.log('🔍 DEBUG - Sidebar - Usando menú estático para:', selectedMenu);
    }
  }, [selectedMenu, user?.id_perfil, cargarMenuLateralOrdenado]);

  // Log adicional para verificar cambios en selectedMenu
  useEffect(() => {
    console.log('🔍 DEBUG - Sidebar - selectedMenu cambió a:', selectedMenu);
  }, [selectedMenu]);

  // Usar menú lateral ordenado si está disponible, sino usar el estático
  // Pero siempre priorizar el menú estático que ya tiene la estructura correcta
  // Use dynamic menu for "inicio" if available, otherwise use static
  let SidebarData;
  console.log('🔍 DEBUG - Sidebar - Verificando condiciones:', {
    selectedMenu,
    menuLateralOrdenadoLength: menuLateralOrdenado.length,
    userPerfil: user?.id_perfil
  });
  
  if (selectedMenu === 'inicio') {
    if (menuLateralOrdenado.length > 0) {
      console.log('🔍 DEBUG - Sidebar - Usando menú dinámico ordenado para inicio');
      // Convert menuLateralOrdenado to SidebarData format
      const menuOrdenado = menuLateralOrdenado[0];
      SidebarData = [
        { caption: menuOrdenado.nombre },
        ...menuOrdenado.items.map(item => ({
          title: item.etiqueta,
          icon: item.icono ? <i className={item.icono} /> : <Icon.Home size={16} />,
          id: item.id_item,
          children: item.children?.map(child => ({
            title: child.etiqueta,
            href: child.ruta,
            icon: child.icono ? <i className={child.icono} /> : <Icon.List size={14} />
          })) || []
        }))
      ];
    } else {
      console.log('🔍 DEBUG - Sidebar - Menú dinámico no cargado, usando estático simplificado para inicio');
      // Use simplified static menu for inicio (only Empresa)
      SidebarData = [
        { caption: "Administración" },
        {
          title: "Empresa",
          icon: <i className="bi bi-building" />,
          id: 'empresa',
          children: [
            { title: "Lista", href: "/empresas", icon: <Icon.List size={14} /> },
            { title: "Crear", href: "/empresas/nueva", icon: <Icon.Plus size={14} /> },
          ],
        }
      ];
    }
  } else {
    console.log('🔍 DEBUG - Sidebar - Usando menú estático para:', selectedMenu);
    SidebarData = getSidebarData(selectedMenu);
  }
  
  console.log('🔍 DEBUG - Sidebar - selectedMenu:', selectedMenu);
  console.log('🔍 DEBUG - Sidebar - menuLateral:', menuLateral);
  console.log('🔍 DEBUG - Sidebar - menuLateralOrdenado:', menuLateralOrdenado);
  console.log('🔍 DEBUG - Sidebar - SidebarData (final):', SidebarData);
  console.log('🔍 DEBUG - Sidebar - Tipo de SidebarData:', typeof SidebarData);
  console.log('🔍 DEBUG - Sidebar - Es array:', Array.isArray(SidebarData));
  console.log('🔍 DEBUG - Sidebar - Longitud:', SidebarData?.length);
  
  // Debug adicional para verificar la estructura
  if (SidebarData && Array.isArray(SidebarData)) {
    console.log('🔍 DEBUG - Sidebar - Primeros 3 items:', SidebarData.slice(0, 3));
    SidebarData.forEach((item, index) => {
      console.log(`🔍 DEBUG - Sidebar - Item ${index}:`, {
        caption: item.caption,
        title: item.title,
        id: item.id,
        hasChildren: !!item.children,
        childrenCount: item.children?.length || 0
      });
    });
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
