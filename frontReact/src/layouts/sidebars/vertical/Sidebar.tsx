import React, { useEffect } from 'react';
import { Button, Nav } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import Logo from '../../logo/Logo';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';
import store from '../../../store/Store';
import { usePermissions } from '../../../components/authGurad/usePermissions';
import useAuth from '../../../components/authGurad/useAuth';
import * as Icon from "react-feather";

type RootState = ReturnType<typeof store.getState>;

const Sidebar = () => {
  const location = useLocation();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const { user } = useAuth();

  const activeBg = useSelector((state: RootState) => state.customizer.sidebarBg);
  const isFixed = useSelector((state: RootState) => state.customizer.isSidebarFixed);
  const dispatch = useDispatch();
  const selectedMenu = useSelector((state: RootState) => state.mainMenu.selected);

  // selectedMenu = id_seccion (UUID). Todo el contenido viene de BD.
  const {
    menuLateralOrdenado,
    cargarMenuLateralOrdenado,
    loading: loadingPermisos
  } = usePermissions();

  // Cargar ítems y submenús de la sección seleccionada (100% desde BD)
  useEffect(() => {
    if (!user?.id_perfil || !selectedMenu) return;
    cargarMenuLateralOrdenado(selectedMenu);
  }, [selectedMenu, user?.id_perfil, cargarMenuLateralOrdenado]);

  const menuOrdenadoActual = menuLateralOrdenado[0];
  const esMenuDeSeccionActual = menuOrdenadoActual && menuOrdenadoActual.id_seccion === selectedMenu;

  const convertirItemsADatosSidebar = (items: typeof menuOrdenadoActual.items, iconoDefault: React.ReactNode) =>
    items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      if (hasChildren) {
        return {
          title: item.etiqueta,
          icon: item.icono ? <i className={item.icono} /> : iconoDefault,
          id: item.id_item,
          children: item.children!.map(child => ({
            id: child.id_item,
            title: child.etiqueta,
            href: child.ruta || '#',
            icon: child.icono ? <i className={child.icono} /> : <Icon.List size={14} />
          }))
        };
      }
      if (item.ruta) {
        return {
          title: item.etiqueta,
          icon: item.icono ? <i className={item.icono} /> : iconoDefault,
          id: item.id_item,
          href: item.ruta,
          children: undefined
        };
      }
      return {
        title: item.etiqueta,
        icon: item.icono ? <i className={item.icono} /> : iconoDefault,
        id: item.id_item,
        children: []
      };
    });

  // Contenido 100% desde BD: caption = nombre de la sección; ítems = menu_item + hijos
  let sidebarItems: Array<{ caption?: string; title?: string; icon?: React.ReactNode; id?: string; href?: string; children?: Array<{ title: string; href: string; icon: React.ReactNode }> }> = [];

  if (esMenuDeSeccionActual && menuOrdenadoActual) {
    const caption = menuOrdenadoActual.nombre;
    sidebarItems = [{ caption }];
    if (menuOrdenadoActual.items?.length) {
      sidebarItems.push(...convertirItemsADatosSidebar(menuOrdenadoActual.items, <Icon.Menu size={16} />));
    }
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
              {sidebarItems.map((navi, index) => {
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
