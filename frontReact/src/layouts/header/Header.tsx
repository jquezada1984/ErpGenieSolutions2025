import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
// Iconos
import { Home, Users, Box, Briefcase, ShoppingCart, DollarSign, BookOpen, Search, User, FileText, Calendar, Tag, Tool, Globe } from 'react-feather';
import { FaBuilding, FaProjectDiagram, FaMoneyCheckAlt, FaUserCog, FaFileInvoice, FaUserFriends, FaRegFolderOpen, FaRegCalendarAlt, FaTicketAlt, FaTools, FaGlobe, FaUniversity } from 'react-icons/fa';
import './HeaderMenu.css';

const mainMenuOptions: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'inicio', label: 'Inicio', icon: <Home size={18} /> },
  { key: 'terceros', label: 'Terceros', icon: <FaBuilding size={18} /> },
  { key: 'servicios', label: 'Servicios', icon: <Box size={18} /> },
  { key: 'proyectos', label: 'Proyectos', icon: <FaProjectDiagram size={18} /> },
  { key: 'comercial', label: 'Comercial', icon: <ShoppingCart size={18} /> },
  { key: 'financiera', label: 'Financiera', icon: <DollarSign size={18} /> },
  { key: 'bancos', label: 'Bancos | Cajas', icon: <FaUniversity size={18} /> },
  { key: 'contabilidad', label: 'Contabilidad', icon: <BookOpen size={18} /> },
  { key: 'rrhh', label: 'RRHH', icon: <User size={18} /> },
  { key: 'documentos', label: 'Documentos', icon: <FileText size={18} /> },
  { key: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
  { key: 'tickets', label: 'Tickets', icon: <FaTicketAlt size={18} /> },
  { key: 'utilidades', label: 'Utilidades', icon: <Tool size={18} /> },
];

type RootState = ReturnType<typeof store.getState>;

const Header = () => {
  const isDarkMode = useSelector((state: RootState) => state.customizer.isDark);
  const topbarColor = useSelector((state: RootState) => state.customizer.topbarBg);
  const dispatch = useDispatch();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const selectedMenu = useSelector((state: RootState) => state.mainMenu.selected);
  
  // Hook de permisos
  const { 
    opcionesMenuSuperior, 
    cargarOpcionesMenuSuperior, 
    loading: loadingPermisos 
  } = usePermissions();

  // Cargar permisos cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.id_perfil) {
      cargarOpcionesMenuSuperior(user.id_perfil);
    } else {
      // Mostrar menú por defecto si no hay perfil
      dispatch(setMainMenu('inicio'));
    }
  }, [user?.id_perfil, cargarOpcionesMenuSuperior, dispatch]);

  // Asegurar que el estado inicial se mantenga
  useEffect(() => {
    if (selectedMenu === '' || selectedMenu === null || selectedMenu === undefined) {
      dispatch(setMainMenu('inicio'));
    }
  }, [selectedMenu, dispatch, opcionesMenuSuperior]);

  // Mapear nombres de secciones a claves del menú
  const mapearSeccionAClave = (nombreSeccion: string): string => {
    const mapeo: { [key: string]: string } = {
      'Inicio': 'inicio',
      'Terceros': 'terceros',
      'Servicios': 'servicios',
      'Proyectos': 'proyectos',
      'Comercial': 'comercial',
      'Financiera': 'financiera',
      'Bancos': 'bancos',
      'Contabilidad': 'contabilidad',
      'RRHH': 'rrhh',
      'Documentos': 'documentos',
      'Agenda': 'agenda',
      'Tickets': 'tickets',
      'Utilidades': 'utilidades'
    };
    return mapeo[nombreSeccion] || nombreSeccion.toLowerCase();
  };

  // Filtrar opciones del menú según permisos
  const opcionesPermitidas = mainMenuOptions.filter(option => {
    return opcionesMenuSuperior.some(seccion => mapearSeccionAClave(seccion) === option.key);
  });



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
        ) : opcionesPermitidas.length > 0 ? (
          // Mostrar opciones filtradas por permisos
          opcionesPermitidas.map((item) => {
            const isActive = selectedMenu === item.key;
            return (
              <NavItem key={item.key}>
                <Button
                  color="link"
                  className={`nav-link d-flex flex-column align-items-center justify-content-center${isActive ? ' main-menu-active' : ''}`}
                  onClick={() => dispatch(setMainMenu(item.key))}
                  style={{ minWidth: 70, padding: 0 }}
                >
                  {item.icon}
                  <span className="mt-1 text-center" style={{ fontSize: 12, lineHeight: 1.1 }}>{item.label}</span>
                </Button>
              </NavItem>
            );
          })
        ) : (
          // Mostrar menú por defecto si no hay permisos cargados
          mainMenuOptions.slice(0, 5).map((item) => {
            const isActive = selectedMenu === item.key;
            return (
              <NavItem key={item.key}>
                <Button
                  color="link"
                  className={`nav-link d-flex flex-column align-items-center justify-content-center${isActive ? ' main-menu-active' : ''}`}
                  onClick={() => dispatch(setMainMenu(item.key))}
                  style={{ minWidth: 70, padding: 0 }}
                >
                  {item.icon}
                  <span className="mt-1 text-center" style={{ fontSize: 12, lineHeight: 1.1 }}>{item.label}</span>
                </Button>
              </NavItem>
            );
          })
        )}
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
