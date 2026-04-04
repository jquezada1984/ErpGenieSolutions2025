import React from 'react';
import SearchableSelect from '../SearchableSelect';

export interface SelectTamanoEmpresaProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  tamanos: {
    id_tamano_empresa: string;
    nombre: string;
  }[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: string;
}

const SelectTamanoEmpresa: React.FC<SelectTamanoEmpresaProps> = ({
  value,
  onChange,
  tamanos,
  isLoading,
  isDisabled,
  placeholder,
  error,
}) => {
  const options = tamanos.map((t) => ({
    value: t.id_tamano_empresa,
    label: t.nombre,
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

export default SelectTamanoEmpresa;
