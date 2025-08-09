import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Row, Col, Card, CardBody } from 'reactstrap';
import * as Icon from "react-feather";
import { 
  FaBuilding, 
  FaUsers, 
  FaUserTie, 
  FaSitemap, 
  FaUser, 
  FaUserFriends, 
  FaAddressBook, 
  FaHome, 
  FaCog, 
  FaChartBar, 
  FaFileAlt, 
  FaCalendar, 
  FaTicketAlt, 
  FaTools 
} from 'react-icons/fa';
import './IconSelector.css';

interface IconSelectorProps {
  isOpen: boolean;
  toggle: () => void;
  onSelect: (iconName: string) => void;
  currentValue?: string;
}

interface IconOption {
  name: string;
  icon: React.ReactNode;
  category: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ isOpen, toggle, onSelect, currentValue }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Iconos organizados por categorías (solo iconos que funcionan)
  const iconCategories = {
    'Navegación': [
      { name: 'bi bi-house', icon: <FaHome size={20} />, category: 'Navegación' },
      { name: 'bi bi-list', icon: <Icon.List size={20} />, category: 'Navegación' },
      { name: 'bi bi-grid', icon: <Icon.Grid size={20} />, category: 'Navegación' },
      { name: 'bi bi-menu', icon: <Icon.Menu size={20} />, category: 'Navegación' },
      { name: 'bi bi-arrow-left', icon: <Icon.ArrowLeft size={20} />, category: 'Navegación' },
      { name: 'bi bi-arrow-right', icon: <Icon.ArrowRight size={20} />, category: 'Navegación' },
    ],
    'Administración': [
      { name: 'bi bi-building', icon: <FaBuilding size={20} />, category: 'Administración' },
      { name: 'bi bi-sitemap', icon: <FaSitemap size={20} />, category: 'Administración' },
      { name: 'bi bi-users', icon: <FaUsers size={20} />, category: 'Administración' },
      { name: 'bi bi-user', icon: <FaUser size={20} />, category: 'Administración' },
      { name: 'bi bi-user-plus', icon: <Icon.UserPlus size={20} />, category: 'Administración' },
      { name: 'bi bi-gear', icon: <FaCog size={20} />, category: 'Administración' },
    ],
    'Terceros': [
      { name: 'bi bi-person-tie', icon: <FaUserTie size={20} />, category: 'Terceros' },
      { name: 'bi bi-person-friends', icon: <FaUserFriends size={20} />, category: 'Terceros' },
      { name: 'bi bi-address-book', icon: <FaAddressBook size={20} />, category: 'Terceros' },
      { name: 'bi bi-person-plus', icon: <Icon.UserPlus size={20} />, category: 'Terceros' },
      { name: 'bi bi-people', icon: <Icon.Users size={20} />, category: 'Terceros' },
      { name: 'bi bi-person', icon: <Icon.User size={20} />, category: 'Terceros' },
    ],
    'Acciones': [
      { name: 'bi bi-plus', icon: <Icon.Plus size={20} />, category: 'Acciones' },
      { name: 'bi bi-pencil', icon: <Icon.Edit size={20} />, category: 'Acciones' },
      { name: 'bi bi-trash', icon: <Icon.Trash size={20} />, category: 'Acciones' },
      { name: 'bi bi-eye', icon: <Icon.Eye size={20} />, category: 'Acciones' },
      { name: 'bi bi-search', icon: <Icon.Search size={20} />, category: 'Acciones' },
      { name: 'bi bi-check', icon: <Icon.Check size={20} />, category: 'Acciones' },
      { name: 'bi bi-x', icon: <Icon.X size={20} />, category: 'Acciones' },
    ],
    'Comunicación': [
      { name: 'bi bi-envelope', icon: <Icon.Mail size={20} />, category: 'Comunicación' },
      { name: 'bi bi-telephone', icon: <Icon.Phone size={20} />, category: 'Comunicación' },
      { name: 'bi bi-chat', icon: <Icon.MessageCircle size={20} />, category: 'Comunicación' },
      { name: 'bi bi-bell', icon: <Icon.Bell size={20} />, category: 'Comunicación' },
      { name: 'bi bi-info-circle', icon: <Icon.Info size={20} />, category: 'Comunicación' },
    ],
    'Financiero': [
      { name: 'bi bi-currency-dollar', icon: <Icon.DollarSign size={20} />, category: 'Financiero' },
      { name: 'bi bi-credit-card', icon: <Icon.CreditCard size={20} />, category: 'Financiero' },
      { name: 'bi bi-bank', icon: <Icon.Briefcase size={20} />, category: 'Financiero' },
      { name: 'bi bi-graph-up', icon: <FaChartBar size={20} />, category: 'Financiero' },
    ],
    'Documentos': [
      { name: 'bi bi-file-text', icon: <FaFileAlt size={20} />, category: 'Documentos' },
      { name: 'bi bi-file-earmark', icon: <Icon.File size={20} />, category: 'Documentos' },
      { name: 'bi bi-folder', icon: <Icon.Folder size={20} />, category: 'Documentos' },
      { name: 'bi bi-archive', icon: <Icon.Archive size={20} />, category: 'Documentos' },
    ],
    'Calendario': [
      { name: 'bi bi-calendar', icon: <FaCalendar size={20} />, category: 'Calendario' },
      { name: 'bi bi-calendar-event', icon: <Icon.Calendar size={20} />, category: 'Calendario' },
      { name: 'bi bi-clock', icon: <Icon.Clock size={20} />, category: 'Calendario' },
    ],
    'Soporte': [
      { name: 'bi bi-ticket', icon: <FaTicketAlt size={20} />, category: 'Soporte' },
      { name: 'bi bi-tools', icon: <FaTools size={20} />, category: 'Soporte' },
      { name: 'bi bi-wrench', icon: <Icon.Wrench size={20} />, category: 'Soporte' },
      { name: 'bi bi-life-buoy', icon: <Icon.HelpCircle size={20} />, category: 'Soporte' },
    ],
  };

  // Aplanar todos los iconos para búsqueda
  const allIcons: IconOption[] = Object.values(iconCategories).flat();

  // Filtrar iconos basado en búsqueda
  const filteredIcons = allIcons.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onSelect(iconName);
    toggle();
    setSearchTerm('');
  };

  const handleClose = () => {
    toggle();
    setSearchTerm('');
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        <i className="bi bi-palette me-2"></i>
        Seleccionar Icono
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <Input
            type="text"
            placeholder="Buscar iconos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
        </div>

        {searchTerm ? (
          // Vista de búsqueda
          <Row>
            {filteredIcons.map((icon, index) => (
              <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-2">
                <Card 
                  className={`icon-card ${currentValue === icon.name ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer', minHeight: '80px' }}
                  onClick={() => handleIconSelect(icon.name)}
                >
                  <CardBody className="text-center p-2">
                    <div className="mb-1">{icon.icon}</div>
                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>
                      {icon.name}
                    </small>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          // Vista por categorías
          <div>
            {Object.entries(iconCategories).map(([category, icons]) => (
              <div key={category} className="mb-4">
                <h6 className="text-muted mb-3">{category}</h6>
                <Row>
                  {icons.map((icon, index) => (
                    <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-2">
                      <Card 
                        className={`icon-card ${currentValue === icon.name ? 'border-primary' : ''}`}
                        style={{ cursor: 'pointer', minHeight: '80px' }}
                        onClick={() => handleIconSelect(icon.name)}
                      >
                        <CardBody className="text-center p-2">
                          <div className="mb-1">{icon.icon}</div>
                          <small className="text-muted d-block" style={{ fontSize: '10px' }}>
                            {icon.name}
                          </small>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredIcons.length === 0 && (
          <div className="text-center text-muted py-4">
            <i className="bi bi-search" style={{ fontSize: '2rem' }}></i>
            <p className="mt-2">No se encontraron iconos que coincidan con "{searchTerm}"</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default IconSelector; 