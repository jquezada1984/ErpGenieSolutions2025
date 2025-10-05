import React, { useEffect } from 'react';
import { Button, Nav } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import SidebarData from '../sidebardata/SidebarData';
import Logo from '../../logo/Logo';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';
import getSidebarData from '../sidebardata/SidebarData';
import store from '../../../store/Store';
import { usePermissions } from '../../../components/authGurad/usePermissions';
import useAuth from '../../../components/authGurad/useAuth';
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
    cargarMenuLateral, 
    loading: loadingPermisos 
  } = usePermissions();

  // Cargar menú lateral cuando cambie el perfil o el menú seleccionado
  useEffect(() => {
    if (user?.id_perfil) {
      cargarMenuLateral(user.id_perfil);
    }
  }, [user?.id_perfil, selectedMenu, cargarMenuLateral]);

  // Usar menú lateral filtrado por permisos en lugar del estático
  const SidebarData = menuLateral.length > 0 ? menuLateral : getSidebarData(selectedMenu);
  
  console.log('🔍 DEBUG - Sidebar - menuLateral:', menuLateral);
  console.log('🔍 DEBUG - Sidebar - SidebarData:', SidebarData);

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
                console.log('🔍 DEBUG - Sidebar - Mapeando elemento:', { navi, index });
                
                // Manejar estructura del menuLateral (SeccionConPermisos)
                if (navi.id_seccion) {
                  // Es una sección del menuLateral
                  const key = navi.id_seccion || `seccion-${index}`;
                  console.log('🔍 DEBUG - Sidebar - Renderizando sección:', key);
                  return (
                    <NavSubMenu
                      key={key}
                      icon={navi.icono ? <i className={navi.icono} /> : <i className="bi bi-folder" />}
                      title={navi.nombre}
                      items={navi.items?.map((item, itemIndex) => ({
                        title: item.etiqueta,
                        href: item.ruta,
                        icon: item.icono ? <i className={item.icono} /> : <i className="bi bi-file" />,
                        id: item.id_item || `item-${itemIndex}`
                      })) || []}
                      suffix={navi.tienePermisos ? "✓" : ""}
                      suffixColor={navi.tienePermisos ? "bg-success" : "bg-secondary"}
                      isUrl={false}
                    />
                  );
                }
                
                // Manejar estructura del SidebarData estático
                if (navi.caption) {
                  const key = navi.caption || `caption-${index}`;
                  console.log('🔍 DEBUG - Sidebar - Renderizando caption:', key);
                  return (
                    <div className="navCaption fw-bold mt-4" key={key}>
                      {navi.caption}
                    </div>
                  );
                }
                if (navi.children) {
                  const key = navi.id || `navi-${index}`;
                  console.log('🔍 DEBUG - Sidebar - Renderizando NavSubMenu:', key);
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
                console.log('🔍 DEBUG - Sidebar - Renderizando NavItemContainer:', key);
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
