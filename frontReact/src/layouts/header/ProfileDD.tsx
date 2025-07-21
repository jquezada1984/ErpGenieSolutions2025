import React from 'react';
import { DropdownItem } from 'reactstrap';
import { User, FileText, Star, Settings, Droplet } from 'react-feather';
import user1 from '../../assets/images/users/user1.jpg';
import useAuth from '../../components/authGurad/useAuth';

const ProfileDD = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
        <img src={user1} alt="user" className="rounded-circle" width="60" />
        <span>
          <h6 className="mb-0">{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</h6>
          <small>{user ? user.email : ''}</small>
        </span>
      </div>
      <DropdownItem className="px-4 py-3">
        <User size={20} />
        &nbsp; Mi perfil
      </DropdownItem>
      <DropdownItem className="px-4 py-3">
        <FileText size={20} />
        &nbsp; Editar perfil
      </DropdownItem>
      <DropdownItem className="px-4 py-3">
        <Star size={20} />
        &nbsp; Mi saldo
      </DropdownItem>
      <DropdownItem className="px-4 py-3">
        <Droplet size={20} />
        &nbsp; Personalizar
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem className="px-4 py-3">
        <Settings size={20} />
        &nbsp; Ajustes
      </DropdownItem>
      <DropdownItem divider />
    </div>
  );
};

export default ProfileDD;
