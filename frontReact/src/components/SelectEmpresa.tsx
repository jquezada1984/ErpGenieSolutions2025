import React from 'react';
import SearchableSelect from './SearchableSelect';

export interface SelectEmpresaProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  empresas: {
    id_empresa: string;
    nombre: string;
    ruc: string;
    estado: boolean;
  }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectEmpresa: React.FC<SelectEmpresaProps> = ({
  value,
  onChange,
  empresas,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = empresas.map((emp) => ({
    value: emp.id_empresa,
    label: emp.nombre,
  }));

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled}
      placeholder={placeholder}
      error={error}
    />
  );
};

export default SelectEmpresa;
