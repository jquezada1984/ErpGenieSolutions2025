import React, { useEffect, useMemo } from 'react';
import { Button, Nav } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import Logo from '../../logo/Logo';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';
import store from '../../../store/Store';
import {
  usePermissions,
  type MenuItemOrdenado,
} from '../../../components/authGurad/usePermissions';
import useAuth from '../../../components/authGurad/useAuth';
import * as Icon from "react-feather";

type RootState = ReturnType<typeof store.getState>;

/** Filtra el árbol del sidebar a ítems permitidos (perfil_menu_permiso vía menuLateralPorPerfil). */
function filtrarItemsPorPermiso(
  items: MenuItemOrdenado[],
  permitidos: Set<string>
): MenuItemOrdenado[] {
  return items
    .map((item) => {
      const children = item.children?.length
        ? filtrarItemsPorPermiso(item.children, permitidos)
        : [];
      const selfOk = permitidos.has(item.id_item);
      if (!selfOk && children.length === 0) return null;
      return { ...item, children };
    })
    .filter((item): item is MenuItemOrdenado => item != null);
}

const Sidebar = () => {
  const location = useLocation();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const { user } = useAuth();

  const activeBg = useSelector((state: RootState) => state.customizer.sidebarBg);
  const isFixed = useSelector((state: RootState) => state.customizer.isSidebarFixed);
  const dispatch = useDispatch();
  const selectedMenu = useSelector((state: RootState) => state.mainMenu.selected);

  // selectedMenu = id_seccion (UUID). Ítems solo si la sección está permitida por perfil.
  const {
    menuLateral,
    menuLateralOrdenado,
    cargarMenuLateral,
    cargarMenuLateralOrdenado,
    limpiarMenuLateralOrdenado,
    loading: loadingPermisos
  } = usePermissions();

  // Secciones con permiso para este perfil (solo al cambiar perfil)
  useEffect(() => {
    if (!user?.id_perfil) {
      limpiarMenuLateralOrdenado();
      return;
    }
    // Evitar ítems del perfil anterior mientras llega menuLateralPorPerfil
    limpiarMenuLateralOrdenado();
    cargarMenuLateral(user.id_perfil);
    // Intencionalmente solo id_perfil: evitar re-fetch por identidad inestable de useLazyQuery
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id_perfil]);

  const seccionPermitida = useMemo(
    () => (selectedMenu ? menuLateral.find((s) => s.id_seccion === selectedMenu) : undefined),
    [menuLateral, selectedMenu]
  );

  const idsPermitidos = useMemo(() => {
    if (!seccionPermitida?.items?.length) return new Set<string>();
    return new Set(seccionPermitida.items.map((i) => i.id_item));
  }, [seccionPermitida]);

  // Cargar árbol solo cuando hay sección seleccionada Y está en el menú permitido del perfil.
  // No depender de `loading`: eso re-disparaba la query en bucle (spinner eterno).
  useEffect(() => {
    if (!user?.id_perfil || !selectedMenu) {
      limpiarMenuLateralOrdenado();
      return;
    }
    // Aún no llegó menuLateralPorPerfil: esperar (sin limpiar en bucle)
    if (menuLateral.length === 0) return;

    const permitida = menuLateral.some((s) => s.id_seccion === selectedMenu);
    if (!permitida) {
      limpiarMenuLateralOrdenado();
      return;
    }
    cargarMenuLateralOrdenado(selectedMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu, user?.id_perfil, menuLateral]);

  const menuOrdenadoActual = menuLateralOrdenado[0];
  const esMenuDeSeccionActual =
    !!selectedMenu &&
    !!seccionPermitida &&
    !!menuOrdenadoActual &&
    menuOrdenadoActual.id_seccion === selectedMenu;

  const itemsFiltrados = useMemo(() => {
    if (!esMenuDeSeccionActual || !menuOrdenadoActual?.items?.length) return [];
    return filtrarItemsPorPermiso(menuOrdenadoActual.items, idsPermitidos);
  }, [esMenuDeSeccionActual, menuOrdenadoActual, idsPermitidos]);

  // Spinner solo mientras falta contenido de una sección que sí está permitida
  const mostrarCargandoMenu =
    !!user?.id_perfil &&
    !!selectedMenu &&
    !!seccionPermitida &&
    !esMenuDeSeccionActual &&
    loadingPermisos;

  const convertirItemsADatosSidebar = (items: MenuItemOrdenado[], iconoDefault: React.ReactNode) =>
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

  // Caption + ítems filtrados por permiso; layout del sidebar sigue visible
  let sidebarItems: Array<{ caption?: string; title?: string; icon?: React.ReactNode; id?: string; href?: string; children?: Array<{ title: string; href: string; icon: React.ReactNode }> }> = [];

  if (esMenuDeSeccionActual && menuOrdenadoActual) {
    const caption = menuOrdenadoActual.nombre;
    sidebarItems = [{ caption }];
    if (itemsFiltrados.length) {
      sidebarItems.push(...convertirItemsADatosSidebar(itemsFiltrados, <Icon.Menu size={16} />));
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
          {mostrarCargandoMenu ? (
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
