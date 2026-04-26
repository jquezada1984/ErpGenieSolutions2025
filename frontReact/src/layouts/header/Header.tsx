import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { MessageSquare } from 'react-feather';
import * as Icon from 'react-feather';
import LogoWhite from '../../assets/images/logos/xtreme-white-icon.svg';
import MessageDD from './MessageDD';
import NotificationDD from './NotificationDD';
import user1 from '../../assets/images/users/user1.jpg';
import useAuth from '../../components/authGurad/useAuth';
import { ToggleMiniSidebar, ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';
import store from '../../store/Store';
import { setMainMenu } from '../../store/MainMenuSlice';
import { usePermissions } from '../../components/authGurad/usePermissions';
import { useEffect } from 'react';
import './HeaderMenu.css';

const DEFAULT_SECTION_ICON = 'bi bi-grid';

type RootState = ReturnType<typeof store.getState>;

const Header = () => {
  const isDarkMode = useSelector((state: RootState) => state.customizer.isDark);
  const topbarColor = useSelector((state: RootState) => state.customizer.topbarBg);
  const dispatch = useDispatch();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const selectedMenu = useSelector((state: RootState) => state.mainMenu.selected);
  
  // Hook de permisos: menuLateral = secciones con permisos (100% desde BD)
  const { 
    menuLateral, 
    cargarOpcionesMenuSuperior, 
    cargarMenuLateral,
    loading: loadingPermisos 
  } = usePermissions();

  // Cargar secciones y opciones cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.id_perfil) {
      cargarOpcionesMenuSuperior(user.id_perfil);
      cargarMenuLateral(user.id_perfil);
    } else {
      dispatch(setMainMenu(''));
    }
  }, [user?.id_perfil, cargarOpcionesMenuSuperior, cargarMenuLateral, dispatch]);

  // Seleccionar primera sección cuando menuLateral cargue o la selección actual no exista
  useEffect(() => {
    if (menuLateral.length === 0) return;
    const seleccionValida = selectedMenu && menuLateral.some(s => s.id_seccion === selectedMenu);
    if (!seleccionValida) {
      dispatch(setMainMenu(menuLateral[0].id_seccion));
    }
  }, [menuLateral, selectedMenu, dispatch]);



  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  };

  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="topbar"
    >
      {/******************************/}
      {/**********Toggle Buttons**********/}
      {/******************************/}
      <div className="d-flex align-items-center">
        <Button
          color={topbarColor}
          className="d-none d-lg-block"
          onClick={() => dispatch(ToggleMiniSidebar())}
        >
          <i className="bi bi-list" />
        </Button>
        <NavbarBrand href="/" className="d-sm-block d-lg-none">
          <img src={LogoWhite} alt="Logo" height={40} />
        </NavbarBrand>
        <Button
          color={topbarColor}
          className="d-sm-block d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          <i className="bi bi-list" />
        </Button>
      </div>

      {/******************************/}
      {/**********Left Nav Bar**********/}
      {/******************************/}

      <Nav className="me-auto d-none d-lg-flex" navbar>
        {loadingPermisos ? (
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <span className="text-light">Cargando permisos...</span>
          </div>
        ) : menuLateral.length > 0 ? (
          // Opciones 100% desde BD (menu_seccion + permisos por perfil) (igual que Terceros)
          menuLateral.map((seccion) => {
            const isActive = selectedMenu === seccion.id_seccion;
            const iconoClase = seccion.icono || DEFAULT_SECTION_ICON;
            return (
              <NavItem key={seccion.id_seccion}>
                <Button
                  color="link"
                  className={`nav-link d-flex flex-column align-items-center justify-content-center${isActive ? ' main-menu-active' : ''}`}
                  onClick={() => dispatch(setMainMenu(seccion.id_seccion))}
                  style={{ minWidth: 70, padding: 0 }}
                >
                  <i className={iconoClase} style={{ fontSize: 18 }} />
                  <span className="mt-1 text-center" style={{ fontSize: 12, lineHeight: 1.1 }}>{seccion.nombre}</span>
                </Button>
              </NavItem>
            );
          })
        ) : null}
      </Nav>
      {/******************************/}
      {/**********Notification DD**********/}
      {/******************************/}
      <div className="d-flex">
        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <Icon.Bell size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <DropdownItem header>
              <span className="mb-0">Notifications</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <NotificationDD />
            </SimpleBar>
            <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
        {/******************************/}
        {/**********Message DD**********/}
        {/******************************/}
        <UncontrolledDropdown className="mx-1">
          <DropdownToggle color={topbarColor}>
            <MessageSquare size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <DropdownItem header>
              <span className="mb-0">Messages</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <MessageDD />
            </SimpleBar>
            <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
        {/******************************/}
        {/**********Profile DD**********/}
        {/******************************/}
        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <img src={user1} alt="profile" className="rounded-circle" width="30" />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <ProfileDD />
            <div className="p-2 px-3">
              <Button color="danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Navbar>
  );
};

export default Header;
